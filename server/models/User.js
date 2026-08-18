const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['villager', 'operator', 'admin'],
      default: 'villager',
      required: true
    },

    village: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Village'
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Indexes
userSchema.index({ role: 1 });
userSchema.index({ village: 1 });
userSchema.index({ status: 1 });

module.exports = mongoose.model('User', userSchema);