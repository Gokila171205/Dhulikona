const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    pump: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pump',
      required: true
    },

    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint'
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    issue: {
      type: String,
      required: true,
      trim: true
    },

    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Emergency'],
      default: 'Medium'
    },

    status: {
      type: String,
      enum: [
        'Scheduled',
        'Pending',
        'Assigned',
        'In Progress',
        'Completed',
        'Cancelled'
      ],
      default: 'Scheduled'
    },

    scheduledDate: {
      type: String
    },

    startDate: {
      type: String
    },

    endDate: {
      type: String
    },

    technician: {
      type: String,
      trim: true,
      default: ''
    },

    notes: {
      type: String,
      trim: true,
      default: ''
    },

    remarks: {
      type: String,
      default: ''
    },

    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);