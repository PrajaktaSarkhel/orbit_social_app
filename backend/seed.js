const mongoose = require('mongoose');
require('dotenv').config();

const Post = require('./models/Post');
const samplePosts = require('./seedData');

async function runSeed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected successfully!");

    // 1. Remove old placeholder test posts from user 'hello' if any
    const deleteResult = await Post.deleteMany({ username: 'hello' });
    if (deleteResult.deletedCount > 0) {
      console.log(`🗑️ Removed ${deleteResult.deletedCount} old test posts`);
    }

    // 3. Insert fresh curated Instagram-style sample posts
    // We recreate fresh timestamps so they are active and current
    const freshPosts = samplePosts.map((p, index) => ({
      ...p,
      createdAt: new Date(Date.now() - (index * 3600000 * 3)), // Staggered by a few hours
    }));

    // Avoid duplicates if any sample post already existed
    let inserted = 0;
    for (const post of freshPosts) {
      const exists = await Post.findOne({ username: post.username, text: post.text });
      if (!exists) {
        await Post.create(post);
        inserted++;
      }
    }

    const totalPosts = await Post.countDocuments();
    console.log(`✨ Successfully seeded ${inserted} new posts! Total posts in database: ${totalPosts}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

runSeed();
