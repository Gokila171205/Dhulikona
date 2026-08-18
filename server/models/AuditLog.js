const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  logId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  role: { type: String, required: true },
  action: { 
    type: String, 
    required: true,
    enum: ['LOGIN', 'CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'VIEW', 'GENERATE_REPORT', 'MARK_AS_READ']
  },
  module: { 
    type: String, 
    required: true,
    enum: ['AUTHENTICATION', 'USERS', 'VILLAGES', 'PUMPS', 'WATER_SUPPLY', 'WATER_QUALITY', 'COMPLAINTS', 'MAINTENANCE', 'PAYMENTS', 'REPORTS', 'NOTIFICATIONS']
  },
  village: { type: String }, // Storing name or ID for context
  description: { type: String, required: true },
  result: { 
    type: String, 
    required: true,
    enum: ['SUCCESS', 'FAILED']
  },
  relatedRecordId: { type: String }
}, { timestamps: true });

// Add indexes for efficient querying/filtering (unique constraint automatically indexes logId)
auditLogSchema.index({ module: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ result: 1 });
auditLogSchema.index({ role: 1 });
auditLogSchema.index({ createdAt: -1 }); // Sort by newest first

module.exports = mongoose.model('AuditLog', auditLogSchema);
