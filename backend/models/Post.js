const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  userAvatar: String,
  text: String,
  image: String,
  likes: [String], // Array of usernames who liked
  savedBy: [String], // Array of usernames who saved/bookmarked
  sharesCount: { type: Number, default: 0 },
  comments: [{
    username: String,
    userAvatar: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

module.exports = mongoose.models.Post || mongoose.model('Post', PostSchema);

