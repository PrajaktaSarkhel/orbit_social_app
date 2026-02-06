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

// ✅ CONNECT DB FIRST, THEN START SERVER
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Orbit Database Connected!");

    app.listen(PORT, () => {
      console.log(`🚀 Server is orbiting on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Failed:", err.message);
  });
