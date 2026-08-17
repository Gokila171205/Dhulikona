const mongoose = require('mongoose');

const waterSupplySchema = new mongoose.Schema({
  date: { type: String, required: true },        // "2026-08-13"
  startTime: { type: String, required: true },    // "06:00"
  endTime: { type: String, required: true },      // "08:00"
  area: { type: String, required: true, trim: true },
  pump: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ['Upcoming', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  remarks: { type: String, trim: true, default: '' },
  village: { type: mongoose.Schema.Types.ObjectId, ref: 'Village' },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('WaterSupply', waterSupplySchema);