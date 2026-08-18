const User = require('../models/User');
const Village = require('../models/Village');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createAuditLog } = require('../services/auditService');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    // Validate inputs
    if (!phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide phone and password' });
    }

    // Check for user
    const user = await User.findOne({ phone }).populate('village', 'name');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'User account is inactive. Please contact administrator.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Audit Log for failed login
      await createAuditLog({
        userId: user._id,
        userName: user.name,
        role: user.role,
        action: 'LOGIN',
        module: 'AUTHENTICATION',
        description: `Failed login attempt for user ${user.name}`,
        result: 'FAILED'
      });

      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Audit Log for successful login
    await createAuditLog({
      userId: user._id,
      userName: user.name,
      role: user.role,
      action: 'LOGIN',
      module: 'AUTHENTICATION',
      description: `User ${user.name} logged in successfully`,
      result: 'SUCCESS',
      village: user.village ? user.village.name : 'N/A'
    });

    res.json({
      success: true,
      data: {
        token: generateToken(user._id),
        user: {
          userId: user.userId,
          name: user.name,
          role: user.role,
          phone: user.phone,
          village: user.village ? user.village._id : null,
          villageName: user.village ? user.village.name : null,
          status: user.status
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register new villager user
// @route   POST /api/auth/signup
// @access  Public
const signupUser = async (req, res, next) => {
  try {
    const { name, phone, password, village } = req.body;

    // Validate inputs
    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, phone and password' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this phone number already exists' });
    }

    // Generate unique userId
    let userId;
    let userIdExists = true;
    while (userIdExists) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      userId = `U-VIL-${rand}`;
      const existing = await User.findOne({ userId });
      if (!existing) {
        userIdExists = false;
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with role 'villager' and status 'active'
    const user = await User.create({
      userId,
      name,
      phone,
      password: hashedPassword,
      role: 'villager',
      village: village || null,
      status: 'active'
    });

    // Populate village details if provided
    let populatedUser = user;
    if (village) {
      populatedUser = await User.findById(user._id).populate('village', 'name');
    }

    // Audit Log for successful signup
    await createAuditLog({
      userId: user._id,
      userName: user.name,
      role: 'villager',
      action: 'CREATE',
      module: 'AUTHENTICATION',
      description: `Villager user ${user.name} signed up successfully`,
      result: 'SUCCESS',
      village: populatedUser.village ? populatedUser.village.name : 'N/A'
    });

    res.status(201).json({
      success: true,
      data: {
        token: generateToken(user._id),
        user: {
          userId: user.userId,
          name: user.name,
          role: user.role,
          phone: user.phone,
          village: user.village ? user.village : null,
          villageName: populatedUser.village ? populatedUser.village.name : null,
          status: user.status
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  signupUser
};
