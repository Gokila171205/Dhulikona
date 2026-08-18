const WaterQuality = require('../models/WaterQuality');
const { createAuditLog } = require('../services/auditService');

// @desc    Get all water quality records
// @route   GET /api/water-quality
// @access  Private
const getWaterQuality = async (req, res, next) => {
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

    const total = await WaterQuality.countDocuments(query);
    const records = await WaterQuality.find(query)
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

// @desc    Get water quality record by ID
// @route   GET /api/water-quality/:id
// @access  Private
const getWaterQualityById = async (req, res, next) => {
  try {
    const record = await WaterQuality.findById(req.params.id)
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

// @desc    Create water quality record
// @route   POST /api/water-quality
// @access  Private
const createWaterQuality = async (req, res, next) => {
  try {
    const { village, testDate, ph, tds, turbidity, chlorine, status, remarks } = req.body;

    const record = await WaterQuality.create({
      village,
      testDate,
      ph: Number(ph),
      tds: Number(tds),
      turbidity: Number(turbidity),
      chlorine: Number(chlorine),
      status,
      recordedBy: req.user._id,
      remarks
    });

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'CREATE',
      module: 'WATER_QUALITY',
      description: `Recorded water health test log: pH=${ph}, TDS=${tds} (${status})`,
      result: 'SUCCESS',
      relatedRecordId: record._id.toString()
    });

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Update water quality record
// @route   PUT /api/water-quality/:id
// @access  Private
const updateWaterQuality = async (req, res, next) => {
  try {
    let record = await WaterQuality.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    record = await WaterQuality.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'UPDATE',
      module: 'WATER_QUALITY',
      description: `Updated water quality health parameters for test: ${record._id}`,
      result: 'SUCCESS',
      relatedRecordId: record._id.toString()
    });

    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWaterQuality,
  getWaterQualityById,
  createWaterQuality,
  updateWaterQuality
};
