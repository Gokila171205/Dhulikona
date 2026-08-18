const AuditLog = require('../models/AuditLog');

/**
 * Helper to create an audit log entry
 * @param {Object} data 
 * @param {string} data.logId - Unique ID for this log
 * @param {string} data.userId - The ID of the user performing the action
 * @param {string} data.userName - The name of the user performing the action
 * @param {string} data.role - The role of the user
 * @param {string} data.action - Action enum (e.g. LOGIN, CREATE, UPDATE, DELETE)
 * @param {string} data.module - Module enum (e.g. AUTHENTICATION, USERS, VILLAGES)
 * @param {string} data.description - Human readable description of what happened
 * @param {string} data.result - SUCCESS or FAILED
 * @param {string} [data.village] - Optional context
 * @param {string} [data.relatedRecordId] - Optional ID of the created/updated resource
 */
const createAuditLog = async (data) => {
  try {
    const log = new AuditLog({
      logId: data.logId || `AL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: data.userId,
      userName: data.userName,
      role: data.role,
      action: data.action,
      module: data.module,
      description: data.description,
      result: data.result,
      village: data.village,
      relatedRecordId: data.relatedRecordId
    });
    
    await log.save();
    return log;
  } catch (error) {
    // We log the error but don't usually want to break the main application flow if logging fails
    console.error('Failed to create audit log:', error.message);
  }
};

module.exports = { createAuditLog };
