const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    // 1. Check if user already exists to prevent duplicate key errors
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json("Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    // Exclude password from the response for security
    const { password, ...others } = user._doc;
    res.status(200).json(others);
    
  } catch (err) {
    // CRITICAL: This logs the error to your VS Code terminal
    console.error("Signup Error:", err); 
    res.status(500).json({ message: "Internal Server Error", details: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("Wrong password");

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "5d" } // Added expiration for better practice
    );

    res.status(200).json({
      token,
      username: user.username,
      userId: user._id
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal Server Error", details: err.message });
  }
});

module.exports = router;