const User = require('../models/User');
const Village = require('../models/Village');
const bcrypt = require('bcryptjs');
const { createAuditLog } = require('../services/auditService');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Filtering
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { phone: { $regex: req.query.search, $options: 'i' } },
        { userId: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.role) query.role = req.query.role;
    if (req.query.status) query.status = req.query.status;
    if (req.query.village) query.village = req.query.village; // Expecting ObjectId

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('village', 'name district')
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
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

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('village', 'name district block')
      .select('-password');

    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res, next) => {
  try {
    const { userId, name, phone, password, role, village, status } = req.body;

    // Validation
    if (!userId || !name || !phone || !password || !role) {
      res.status(400);
      return next(new Error('Please provide all required fields'));
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ userId }, { phone }] });
    if (userExists) {
      res.status(400);
      return next(new Error('User with this ID or phone already exists'));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      userId,
      name,
      phone,
      password: hashedPassword,
      role,
      village: village || null,
      status: status || 'active'
    });

    if (user) {
      // Audit log
      await createAuditLog({
        userId: req.user._id,
        userName: req.user.name,
        role: req.user.role,
        action: 'CREATE',
        module: 'USERS',
        description: `Created new user ${user.name} (${user.role})`,
        result: 'SUCCESS',
        relatedRecordId: user._id.toString()
      });

      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          userId: user.userId,
          name: user.name,
          phone: user.phone,
          role: user.role,
          village: user.village,
          status: user.status
        }
      });
    } else {
      res.status(400);
      return next(new Error('Invalid user data'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const { name, phone, role, village, status, password } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    // Check phone uniqueness if changed
    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        res.status(400);
        return next(new Error('Phone number already in use'));
      }
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.role = role || user.role;
    if (village !== undefined) user.village = village;
    if (status) user.status = status;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'UPDATE',
      module: 'USERS',
      description: `Updated user profile for ${updatedUser.name}`,
      result: 'SUCCESS',
      relatedRecordId: updatedUser._id.toString()
    });

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        userId: updatedUser.userId,
        name: updatedUser.name,
        phone: updatedUser.phone,
        role: updatedUser.role,
        village: updatedUser.village,
        status: updatedUser.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user status
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      res.status(400);
      return next(new Error('Valid status is required'));
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    user.status = status;
    await user.save();

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'STATUS_CHANGE',
      module: 'USERS',
      description: `Changed status to ${status} for user ${user.name}`,
      result: 'SUCCESS',
      relatedRecordId: user._id.toString()
    });

    res.json({
      success: true,
      data: { _id: user._id, status: user.status }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus
};
