const mongoose = require('mongoose');

const waterQualitySchema = new mongoose.Schema({
  village: { type: mongoose.Schema.Types.ObjectId, ref: 'Village', required: true },
  testDate: { type: String, required: true }, // e.g., '2026-08-12'
  ph: { type: Number, required: true },
  tds: { type: Number, required: true },
  turbidity: { type: Number, required: true },
  chlorine: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Safe', 'Needs Attention', 'Critical'],
    default: 'Safe'
  },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('WaterQuality', waterQualitySchema);
