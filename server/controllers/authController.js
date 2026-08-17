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

module.exports = {
  loginUser
};
