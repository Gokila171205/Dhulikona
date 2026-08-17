const mongoose = require('mongoose');

const waterSupplySchema = new mongoose.Schema(
  {
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

    area: {
      type: String,
      required: true
    },

    pump: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'In Progress'],
      default: 'Scheduled'
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