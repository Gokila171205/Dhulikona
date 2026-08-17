const WaterSupply = require('../models/WaterSupply');
const { createAuditLog } = require('../services/auditService');

// @desc    Get all water supply records
// @route   GET /api/water-supply
// @access  Private
const getWaterSupply = async (req, res, next) => {
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
      query.remarks = { $regex: req.query.search, $options: 'i' };
    }

    const total = await WaterSupply.countDocuments(query);
    const records = await WaterSupply.find(query)
      .populate('village', 'name villageId')
      .populate('recordedBy', 'name phone userId')
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

// @desc    Get water supply record by ID
// @route   GET /api/water-supply/:id
// @access  Private
const getWaterSupplyById = async (req, res, next) => {
  try {
    const record = await WaterSupply.findById(req.params.id)
      .populate('village', 'name villageId')
      .populate('recordedBy', 'name phone userId');
      
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Create water supply record
// @route   POST /api/water-supply
// @access  Private
const createWaterSupply = async (req, res, next) => {
  try {
    const { village, supplyDate, scheduledStart, scheduledEnd, actualStart, actualEnd, frequency, status, remarks } = req.body;

    const record = await WaterSupply.create({
      village,
      supplyDate,
      scheduledStart,
      scheduledEnd,
      actualStart,
      actualEnd,
      frequency,
      status,
      recordedBy: req.user._id,
      remarks
    });

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'CREATE',
      module: 'WATER_SUPPLY',
      description: `Recorded water supply log for date ${supplyDate} (${status})`,
      result: 'SUCCESS',
      relatedRecordId: record._id.toString()
    });

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Update water supply record
// @route   PUT /api/water-supply/:id
// @access  Private
const updateWaterSupply = async (req, res, next) => {
  try {
    let record = await WaterSupply.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    record = await WaterSupply.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'UPDATE',
      module: 'WATER_SUPPLY',
      description: `Updated water supply log status to: ${record.status}`,
      result: 'SUCCESS',
      relatedRecordId: record._id.toString()
    });

    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWaterSupply,
  getWaterSupplyById,
  createWaterSupply,
  updateWaterSupply
};
