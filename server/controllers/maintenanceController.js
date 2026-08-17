const Maintenance = require('../models/Maintenance');
const { createAuditLog } = require('../services/auditService');

// @desc    Get all maintenance records
// @route   GET /api/maintenance
// @access  Private
const getMaintenance = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.priority) {
      query.priority = req.query.priority;
    }
    if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }

    const total = await Maintenance.countDocuments(query);
    const records = await Maintenance.find(query)
      .populate('pump', 'name village type')
      .populate('complaint', 'title description')
      .populate('assignedTo', 'name phone userId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: records,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get maintenance record by ID
// @route   GET /api/maintenance/:id
// @access  Private
const getMaintenanceById = async (req, res, next) => {
  try {
    const record = await Maintenance.findById(req.params.id)
      .populate('pump', 'name village type')
      .populate('complaint', 'title description')
      .populate('assignedTo', 'name phone userId');
      
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Create maintenance record
// @route   POST /api/maintenance
// @access  Private
const createMaintenance = async (req, res, next) => {
  try {
    const { pump, complaint, assignedTo, issue, priority, status, startDate, endDate, remarks } = req.body;

    const record = await Maintenance.create({
      pump,
      complaint: complaint || null,
      assignedTo: assignedTo || req.user._id,
      issue,
      priority,
      status: status || 'Pending',
      startDate,
      endDate,
      remarks
    });

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'CREATE',
      module: 'MAINTENANCE',
      description: `Created maintenance task: "${issue}"`,
      result: 'SUCCESS',
      relatedRecordId: record._id.toString()
    });

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Update maintenance record
// @route   PUT /api/maintenance/:id
// @access  Private
const updateMaintenance = async (req, res, next) => {
  try {
    let record = await Maintenance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    record = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'UPDATE',
      module: 'MAINTENANCE',
      description: `Updated details for maintenance task: "${record.issue}"`,
      result: 'SUCCESS',
      relatedRecordId: record._id.toString()
    });

    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Update maintenance status
// @route   PATCH /api/maintenance/:id/status
// @access  Private
const updateMaintenanceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    let record = await Maintenance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    record.status = status;
    if (status === 'Completed') {
      record.endDate = new Date().toISOString().split('T')[0];
    }
    await record.save();

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'STATUS_CHANGE',
      module: 'MAINTENANCE',
      description: `Changed maintenance status of "${record.issue}" to: ${status}`,
      result: 'SUCCESS',
      relatedRecordId: record._id.toString()
    });

    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  updateMaintenanceStatus
};
