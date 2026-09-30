const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send("Orbit API is successfully staying alive!");
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

const PORT = process.env.PORT || 5001;

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is orbiting on port ${PORT}`);
});

// Connect to MongoDB
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
      console.log("✅ Orbit Database Connected!");

      // Auto-seed sample Instagram posts if database has no posts
      try {
        const Post = require('./models/Post');
        const samplePosts = require('./seedData');
        const count = await Post.countDocuments();
        if (count === 0) {
          await Post.insertMany(samplePosts);
          console.log("🌱 Auto-seeded initial Instagram posts into Orbit database!");
        }
      } catch (seedErr) {
        console.warn("Could not auto-seed database:", seedErr.message);
      }
    })
    .catch((err) => {
      console.error("❌ DB Connection Failed:", err.message);
      console.error("👉 Tip: Verify your MONGO_URI in backend/.env, check cluster address, and ensure IP 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.");
    });
} else {
  console.warn("⚠️ MONGO_URI is not set in backend/.env");
}

