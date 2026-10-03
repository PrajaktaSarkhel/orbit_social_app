const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Post = require('./models/Post');
const samplePosts = require('./seedData');

async function runSeed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected successfully!");

    // 1. Safe backup of existing posts
    const existingPosts = await Post.find();
    const backupPath = path.join(__dirname, 'old_posts_backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(existingPosts, null, 2));
    console.log(`📦 Safely backed up ${existingPosts.length} posts to: ${backupPath}`);

    // 2. Remove the old test posts from user 'hello'
    const deleteResult = await Post.deleteMany({ username: 'hello' });
    console.log(`🗑️ Removed ${deleteResult.deletedCount} old test posts`);

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
