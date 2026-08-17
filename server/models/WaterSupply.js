const mongoose = require('mongoose');

const waterSupplySchema = new mongoose.Schema({
  village: { type: mongoose.Schema.Types.ObjectId, ref: 'Village', required: true },
  supplyDate: { type: String, required: true }, // e.g., '2026-08-12'
  scheduledStart: { type: String, required: true }, // e.g., '16:00'
  scheduledEnd: { type: String, required: true }, // e.g., '18:00'
  actualStart: { type: String, default: '-' },
  actualEnd: { type: String, default: '-' },
  frequency: { type: String, default: 'Daily' },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Completed', 'Missed', 'Cancelled'],
    default: 'Scheduled'
  },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('WaterSupply', waterSupplySchema);
