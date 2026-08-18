const mongoose = require('mongoose');

const waterQualitySchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true
    },

    testDate: {
      type: String
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    pump: {
      type: String,
      required: true,
      trim: true
    },

    village: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Village'
    },

    ph: {
      type: Number,
      required: true,
      min: 0,
      max: 14
    },

    turbidity: {
      type: Number,
      required: true,
      min: 0
    },

    tds: {
      type: Number,
      required: true,
      min: 0
    },

    chlorine: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: [
        'Safe',
        'Attention Required',
        'Needs Attention',
        'Unsafe',
        'Critical'
      ],
      default: 'Safe'
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    remarks: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('WaterQuality', waterQualitySchema);