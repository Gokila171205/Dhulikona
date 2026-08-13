const mongoose = require('mongoose');

const pumpSchema = new mongoose.Schema({
  village: { type: mongoose.Schema.Types.ObjectId, ref: 'Village', required: true },
  name: { type: String, required: true },
  type: { type: String }, // e.g., Submersible, Hand pump
  status: { 
    type: String, 
    enum: ['Working', 'Not Working', 'Under Maintenance', 'Unavailable'],
    default: 'Working'
  },
  installationDate: { type: Date },
  lastMaintenanceDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Pump', pumpSchema);
