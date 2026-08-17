const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  pump: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pump',
    required: true
  },
  issue: { type: String, required: true, trim: true },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed'],
    default: 'Scheduled'
  },
  scheduledDate: { type: String, required: true },
  technician: { type: String, trim: true, default: '' },
  notes: { type: String, trim: true, default: '' },
  completedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);