const AuditLog = require('../models/AuditLog');

// @desc    Get all audit logs
// @route   GET /api/audit-logs
// @access  Private/Admin
const getAuditLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.search) {
      query.$or = [
        { userName: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { logId: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.role) query.role = req.query.role;
    if (req.query.module) query.module = req.query.module;
    if (req.query.action) query.action = req.query.action;
    if (req.query.result) query.result = req.query.result;
    if (req.query.village) query.village = { $regex: req.query.village, $options: 'i' };

    // Simple date filtering (YYYY-MM-DD)
    if (req.query.date) {
      const startDate = new Date(req.query.date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(req.query.date);
      endDate.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .populate('userId', 'userId name phone')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single audit log
// @route   GET /api/audit-logs/:id
// @access  Private/Admin
const getAuditLogById = async (req, res, next) => {
  try {
    const log = await AuditLog.findById(req.params.id)
      .populate('userId', 'userId name email phone role');

    if (!log) {
      res.status(404);
      return next(new Error('Audit log not found'));
    }

    res.json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditLogs,
  getAuditLogById
};
