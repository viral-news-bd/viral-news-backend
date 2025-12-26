const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verify JWT Token
 */
const protect = async (req, res, next) => {
  let token;

  // Expect: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (without password)
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token invalid' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

/**
 * Premium access check
 */
const premiumOnly = (req, res, next) => {
  if (!req.user.isPremium) {
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
