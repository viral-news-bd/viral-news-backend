const express = require('express');
const { protect, premiumOnly } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

/**
 * @route   GET /api/premium/status
 * @desc    Check premium status (used by dashboard, frontend guards)
 * @access  Private
 */
router.get('/status', protect, async (req, res) => {
  const user = req.user;

  // Auto-handle expired premium
  if (
    user.isPremium &&
    user.premiumExpiresAt &&
    user.premiumExpiresAt < new Date()
  ) {
    user.isPremium = false;
    user.premiumExpiresAt = null;
    await user.save();
  }

  res.json({
    isPremium: user.isPremium,
    premiumExpiresAt: user.premiumExpiresAt,
    name: user.name
  });
});

/**
 * @route   GET /api/premium/viral-videos
 * @desc    Access premium viral videos
 * @access  Private + Premium
 */
router.get('/viral-videos', protect, premiumOnly, (req, res) => {
  res.json({
    message: 'Welcome to premium viral videos 🔥',
    user: req.user.name,
    access: true
  });
});

module.exports = router;
