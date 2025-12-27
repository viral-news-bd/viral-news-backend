const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,        // 🔐 normalize email
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false           // 🔐 never return password by default
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    isPremium: {
      type: Boolean,
      default: false
    },

    premiumExpiresAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

/**
 * Auto-check premium expiry
 * (future safe – optional use)
 */
userSchema.methods.isPremiumActive = function () {
  if (!this.isPremium) return false;
  if (!this.premiumExpiresAt) return false;
  return this.premiumExpiresAt > new Date();
};

module.exports = mongoose.model('User', userSchema);
