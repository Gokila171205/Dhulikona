const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    location: {
      type: String,
      default: ''
    },

    date: {
      type: Date,
      default: Date.now
    },

    village: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Village',
      required: true
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },

    status: {
      type: String,
      enum: [
        'Submitted',
        'Verified',
        'Maintenance Started',
        'Resolved',
        'Confirmed'
      ],
      default: 'Submitted'
    },

    remarks: {
      type: String,
      default: ''
    },

    resolvedAt: {
      type: Date
    },

    confirmedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);