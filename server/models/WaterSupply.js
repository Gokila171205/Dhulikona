const mongoose = require('mongoose');

const waterSupplySchema = new mongoose.Schema(
  {
    // Village this water supply record belongs to
    village: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Village',
      required: true
    },

    // Date of water supply
    supplyDate: {
      type: String,
      required: true
    },

    // Scheduled supply time
    scheduledStart: {
      type: String,
      required: true
    },

    scheduledEnd: {
      type: String,
      required: true
    },

    // Actual supply time
    actualStart: {
      type: String,
      default: '-'
    },

    actualEnd: {
      type: String,
      default: '-'
    },

    // Frequency of water supply
    frequency: {
      type: String,
      default: 'Daily'
    },

    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Missed', 'Cancelled'],
      default: 'Scheduled'
    },

    // User who recorded the supply
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    remarks: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('WaterSupply', waterSupplySchema);