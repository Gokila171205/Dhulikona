const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  village: { type: mongoose.Schema.Types.ObjectId, ref: 'Village', required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Operator
  status: { 
    type: String, 
    enum: ['Submitted', 'Verified', 'Maintenance Started', 'Resolved', 'Confirmed'],
    default: 'Submitted'
  },
  resolvedAt: { type: Date },
  confirmedAt: { type: Date },
  remarks: { type: String, default: '' },
  location: { type: String },
  date: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
