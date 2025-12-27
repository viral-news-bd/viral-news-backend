const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verify JWT Token
 */
const protect = async (req, res, next) => {
  let token;

  // Expect header: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Token missing' });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // IMPORTANT: decoded.id (match with auth.js)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (err) {
      console.error('Auth middleware error:', err.message);
      return res.status(401).json({ message: 'Token invalid or expired' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

/**
 * Premium access check
 */
const premiumOnly = (req, res, next) => {
  if (!req.user || !req.user.isPremium) {
    return res.status(403).json({ message: 'Premium access required' });
  }

  // Expiry check
  if (
    req.user.premiumExpiresAt &&
    new Date(req.user.premiumExpiresAt) < new Date()
  ) {
    return res.status(403).json({ message: 'Premium expired' });
  }

  next();
};

module.exports = { protect, premiumOnly };
