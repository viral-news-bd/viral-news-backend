const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'সব ফিল্ড পূরণ করা আবশ্যক' });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'এই ইমেইল ইতিমধ্যে ব্যবহৃত' });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // 5. (Optional) Create JWT on register
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    // 6. Response
    res.status(201).json({
      message: 'রেজিস্ট্রেশন সফল হয়েছে',
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user (temporary stub)
 * @access  Public
 */
router.post('/login', async (req, res) => {
  res.json({ message: 'Login route working' });
});

module.exports = router;
