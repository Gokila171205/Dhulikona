const Village = require('../models/Village');
const { createAuditLog } = require('../services/auditService');

// @desc    Get all villages
// @route   GET /api/villages
// @access  Private/Admin
const getVillages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { villageId: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.district) query.district = req.query.district;
    if (req.query.status) query.status = req.query.status;

    const total = await Village.countDocuments(query);
    const villages = await Village.find(query)
      .populate('assignedOperator', 'name phone')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: villages,
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

// @desc    Get single village
// @route   GET /api/villages/:id
// @access  Private/Admin
const getVillageById = async (req, res, next) => {
  try {
    const village = await Village.findById(req.params.id)
      .populate('assignedOperator', 'name phone email status');

    if (!village) {
      res.status(404);
      return next(new Error('Village not found'));
    }

    res.json({ success: true, data: village });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new village
// @route   POST /api/villages
// @access  Private/Admin
const createVillage = async (req, res, next) => {
  try {
    const { villageId, name, district, block, households, assignedOperator, status } = req.body;

    if (!villageId || !name || !district || !block) {
      res.status(400);
      return next(new Error('Please provide all required fields'));
    }

    const villageExists = await Village.findOne({ villageId });
    if (villageExists) {
      res.status(400);
      return next(new Error('Village ID already exists'));
    }

    const village = await Village.create({
      villageId,
      name,
      district,
      block,
      households: households || 0,
      assignedOperator: assignedOperator || null,
      status: status || 'active'
    });

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'CREATE',
      module: 'VILLAGES',
      description: `Created new village ${village.name} (${village.villageId})`,
      result: 'SUCCESS',
      relatedRecordId: village._id.toString()
    });

    res.status(201).json({ success: true, data: village });
  } catch (error) {
    next(error);
  }
};

// @desc    Update village
// @route   PUT /api/villages/:id
// @access  Private/Admin
const updateVillage = async (req, res, next) => {
  try {
    const { name, district, block, households, assignedOperator, status } = req.body;

    const village = await Village.findById(req.params.id);

    if (!village) {
      res.status(404);
      return next(new Error('Village not found'));
    }

    village.name = name || village.name;
    village.district = district || village.district;
    village.block = block || village.block;
    if (households !== undefined) village.households = households;
    if (assignedOperator !== undefined) village.assignedOperator = assignedOperator;
    if (status) village.status = status;

    const updatedVillage = await village.save();

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'UPDATE',
      module: 'VILLAGES',
      description: `Updated village profile for ${updatedVillage.name}`,
      result: 'SUCCESS',
      relatedRecordId: updatedVillage._id.toString()
    });

    res.json({ success: true, data: updatedVillage });
  } catch (error) {
    next(error);
  }
};

// @desc    Change village status
// @route   PATCH /api/villages/:id/status
// @access  Private/Admin
const updateVillageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      res.status(400);
      return next(new Error('Valid status is required'));
    }

    const village = await Village.findById(req.params.id);
    
    if (!village) {
      res.status(404);
      return next(new Error('Village not found'));
    }

    village.status = status;
    await village.save();

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'STATUS_CHANGE',
      module: 'VILLAGES',
      description: `Changed status to ${status} for village ${village.name}`,
      result: 'SUCCESS',
      relatedRecordId: village._id.toString()
    });

    res.json({ success: true, data: { _id: village._id, status: village.status } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVillages,
  getVillageById,
  createVillage,
  updateVillage,
  updateVillageStatus
};
