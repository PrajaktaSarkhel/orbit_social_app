const router = require('express').Router();
const Post = require('../models/Post');

// 1. Create Post
router.post('/create', async (req, res) => {
  try {
    const { username, userId, text, image } = req.body;
    if (!text && !image) {
      return res.status(400).json({ error: "Post must contain text or an image" });
    }
    const newPost = new Post({
      userId,
      username,
      text,
      image,
      likes: [],
      savedBy: [],
      sharesCount: 0,
      comments: []
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Feed with Pagination & Filter (all, trending)
router.get('/feed', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const filter = req.query.filter || 'all';
  const skip = (page - 1) * limit;

  try {
    const total = await Post.countDocuments();
    let posts;

    if (filter === 'trending') {
      posts = await Post.aggregate([
        {
          $addFields: {
            engagementScore: {
              $add: [
                { $size: { $ifNull: ["$likes", []] } },
                { $size: { $ifNull: ["$comments", []] } },
                { $ifNull: ["$sharesCount", 0] }
              ]
            }
          }
        },
        { $sort: { engagementScore: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]);
    } else {
      posts = await Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    res.status(200).json({
      posts,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
      totalPosts: total
    });
  } catch (err) {
    console.error("Feed Fetch Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Like / Unlike Post with Optimistic Confirmation
router.put('/:id/like', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username is required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (!post.likes) post.likes = [];
    const hasLiked = post.likes.includes(username);

    if (!hasLiked) {
      post.likes.push(username);
    } else {
      post.likes = post.likes.filter((u) => u !== username);
    }

    await post.save();
    res.status(200).json({
      message: !hasLiked ? "Post liked" : "Post unliked",
      isLiked: !hasLiked,
      likes: post.likes,
      likesCount: post.likes.length
    });
  } catch (err) {
    console.error("Like Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Save / Unsave (Bookmark) Post
router.put('/:id/save', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username is required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (!post.savedBy) post.savedBy = [];
    const hasSaved = post.savedBy.includes(username);

    if (!hasSaved) {
      post.savedBy.push(username);
    } else {
      post.savedBy = post.savedBy.filter((u) => u !== username);
    }

    await post.save();
    res.status(200).json({
      message: !hasSaved ? "Post saved" : "Post removed from saved",
      isSaved: !hasSaved,
      savedBy: post.savedBy,
      savedCount: post.savedBy.length
    });
  } catch (err) {
    console.error("Save Post Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Comment on Post
router.post('/:id/comment', async (req, res) => {
  try {
    const { username, text } = req.body;
    if (!username || !text || !text.trim()) {
      return res.status(400).json({ error: "Username and comment text are required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const newComment = {
      username,
      text: text.trim(),
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    res.status(200).json({
      message: "Comment added",
      comment: newComment,
      comments: post.comments,
      commentsCount: post.comments.length
    });
  } catch (err) {
    console.error("Comment Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Share Post (Increment counter & provide metadata)
router.post('/:id/share', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.sharesCount = (post.sharesCount || 0) + 1;
    await post.save();

    res.status(200).json({
      message: "Post shared successfully",
      sharesCount: post.sharesCount
    });
  } catch (err) {
    console.error("Share Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 7. Get Saved Posts by User
router.get('/saved/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const posts = await Post.find({ savedBy: username }).sort({ updatedAt: -1 });
    res.status(200).json({ posts });
  } catch (err) {
    console.error("Get Saved Posts Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 8. Seed Sample Posts Endpoint
router.post('/seed', async (req, res) => {
  try {
    const samplePosts = require('../seedData');
    await Post.deleteMany({});
    const inserted = await Post.insertMany(samplePosts);
    res.status(200).json({
      message: "Seeded successfully",
      count: inserted.length,
      posts: inserted
    });
  } catch (err) {
    console.error("Seed Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;