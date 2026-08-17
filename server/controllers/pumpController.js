const Pump = require('../models/Pump');
const { createAuditLog } = require('../services/auditService');

// @desc    Get all pumps
// @route   GET /api/pumps
// @access  Private
const getPumps = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.village) {
      query.village = req.query.village;
    }
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    const total = await Pump.countDocuments(query);
    const pumps = await Pump.find(query)
      .populate('village', 'name villageId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: pumps,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pump by ID
// @route   GET /api/pumps/:id
// @access  Private
const getPumpById = async (req, res, next) => {
  try {
    const pump = await Pump.findById(req.params.id).populate('village', 'name villageId');
    if (!pump) {
      return res.status(404).json({ success: false, message: 'Pump not found' });
    }
    res.json({ success: true, data: pump });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new pump
// @route   POST /api/pumps
// @access  Private/Admin
const createPump = async (req, res, next) => {
  try {
    const { name, village, type, status, installationDate } = req.body;

    const pump = await Pump.create({
      name,
      village,
      type,
      status: status || 'Working',
      installationDate
    });

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'CREATE',
      module: 'PUMPS',
      description: `Added new water pump: "${name}"`,
      result: 'SUCCESS',
      relatedRecordId: pump._id.toString()
    });

    res.status(201).json({ success: true, data: pump });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pump
// @route   PUT /api/pumps/:id
// @access  Private/Admin
const updatePump = async (req, res, next) => {
  try {
    let pump = await Pump.findById(req.params.id);
    if (!pump) {
      return res.status(404).json({ success: false, message: 'Pump not found' });
    }

    pump = await Pump.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'UPDATE',
      module: 'PUMPS',
      description: `Updated profile details for pump: "${pump.name}"`,
      result: 'SUCCESS',
      relatedRecordId: pump._id.toString()
    });

    res.json({ success: true, data: pump });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pump status
// @route   PATCH /api/pumps/:id/status
// @access  Private
const updatePumpStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    let pump = await Pump.findById(req.params.id);
    if (!pump) {
      return res.status(404).json({ success: false, message: 'Pump not found' });
    }

    pump.status = status;
    pump.lastMaintenanceDate = new Date();
    await pump.save();

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'STATUS_CHANGE',
      module: 'PUMPS',
      description: `Changed status of pump "${pump.name}" to: ${status}`,
      result: 'SUCCESS',
      relatedRecordId: pump._id.toString()
    });

    res.json({ success: true, data: pump });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPumps,
  getPumpById,
  createPump,
  updatePump,
  updatePumpStatus
};
