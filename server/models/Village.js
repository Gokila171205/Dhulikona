const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  district: { type: String, required: true },
  block: { type: String, required: true },
  panchayat: { type: String, required: true },
  operator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalHouseholds: { type: Number, default: 0 },
  population: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Village', villageSchema);
