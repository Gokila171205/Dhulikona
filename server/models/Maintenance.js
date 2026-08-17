const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  pump: { type: mongoose.Schema.Types.ObjectId, ref: 'Pump', required: true },
  complaint: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Operator
  issue: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Emergency'],
    default: 'Medium'
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  startDate: { type: String, required: true },
  endDate: { type: String },
  remarks: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
