const mongoose = require('mongoose');

const waterSupplySchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true
    },

    startTime: {
      type: String,
      required: true
    },

    endTime: {
      type: String,
      required: true
    },

    area: {
      type: String,
      required: true,
      trim: true
    },

    pump: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ['Upcoming', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Upcoming'
    },

    remarks: {
      type: String,
      trim: true,
      default: ''
    },

    village: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Village'
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('WaterSupply', waterSupplySchema);