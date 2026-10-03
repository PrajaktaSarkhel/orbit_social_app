const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to check DB connection before buffering
const checkDbConnection = (res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database temporarily unavailable",
      details: "MongoDB connection is offline. Please verify the database user credentials in backend/.env or MongoDB Atlas cluster status."
    });
  }
  return null;
};

// SIGNUP
router.post('/signup', async (req, res) => {
  if (checkDbConnection(res)) return;

  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    // 1. Check if user already exists to prevent duplicate key errors
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    // Exclude password from the response for security
    const { password: userPw, ...others } = user._doc;
    res.status(201).json(others);
    
  } catch (err) {
    console.error("Signup Error:", err);
    const isDbTimeout = err.message && err.message.includes('buffering timed out');
    const msg = isDbTimeout
      ? "Database connection timed out. Please check MongoDB Atlas connection."
      : (err.message || "Internal Server Error");
    res.status(500).json({ message: msg, details: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  if (checkDbConnection(res)) return;

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'orbit_secret_fallback',
      { expiresIn: "5d" }
    );

    res.status(200).json({
      token,
      username: user.username,
      userId: user._id
    });
  } catch (err) {
    console.error("Login Error:", err);
    const isDbTimeout = err.message && err.message.includes('buffering timed out');
    const msg = isDbTimeout
      ? "Database connection timed out. Please check MongoDB Atlas connection."
      : (err.message || "Internal Server Error");
    res.status(500).json({ message: msg, details: err.message });
  }
});

module.exports = router;