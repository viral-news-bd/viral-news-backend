const express = require('express');
const { protect, premiumOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/viral-videos', protect, premiumOnly, (req, res) => {
  res.json({
    message: 'Welcome to premium viral videos 🔥',
    user: req.user.name
  });
});

module.exports = router;
