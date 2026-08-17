const mongoose = require('mongoose');

const waterSupplySchema = new mongoose.Schema(
  {
    village: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Village',
      required: true
    },

    date: {
      type: Date,
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

    duration: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled'],
      default: 'Scheduled'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('WaterSupply', waterSupplySchema);