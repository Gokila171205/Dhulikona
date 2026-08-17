const mongoose = require('mongoose');

const waterQualitySchema = new mongoose.Schema({
  date: { type: String, required: true },
  location: { type: String, required: true, trim: true },
  pump: { type: String, required: true, trim: true },
  ph: { type: Number, required: true, min: 0, max: 14 },
  turbidity: { type: Number, required: true, min: 0 },
  tds: { type: Number, required: true, min: 0 },
  chlorine: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['Safe', 'Attention Required', 'Unsafe'],
    default: 'Safe'
  },
  remarks: { type: String, trim: true, default: '' },
  village: { type: mongoose.Schema.Types.ObjectId, ref: 'Village' },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('WaterQuality', waterQualitySchema);