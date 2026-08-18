const User = require('../models/User');
const Village = require('../models/Village');
const AuditLog = require('../models/AuditLog');
const Pump = require('../models/Pump');
const Complaint = require('../models/Complaint');
const WaterSupply = require('../models/WaterSupply');
const WaterQuality = require('../models/WaterQuality');
const Payment = require('../models/Payment');

// @desc    Get system report summary
// @route   GET /api/reports/summary
// @access  Private/Admin
const getReportSummary = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVillages = await Village.countDocuments();
    const totalAuditLogs = await AuditLog.countDocuments();
    const totalPumps = await Pump.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const totalWaterSupply = await WaterSupply.countDocuments();
    const totalWaterQuality = await WaterQuality.countDocuments();
    const totalPayments = await Payment.countDocuments();
    
    const householdsResult = await Village.aggregate([{ $group: { _id: null, total: { $sum: '$households' } } }]);
    const totalHouseholds = householdsResult.length > 0 ? householdsResult[0].total : 0;

    res.json({
      success: true,
      data: {
        users: { total: totalUsers, available: true },
        villages: { total: totalVillages, available: true },
        households: { total: totalHouseholds, available: true },
        activity: { total: totalAuditLogs, available: true },
        pumps: { total: totalPumps, available: true },
        complaints: { total: totalComplaints, available: true },
        waterSupply: { total: totalWaterSupply, available: true },
        waterQuality: { total: totalWaterQuality, available: true },
        payments: { total: totalPayments, available: true }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user report
// @route   GET /api/reports/users
// @access  Private/Admin
const getUserReport = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { phone: { $regex: req.query.search, $options: 'i' } },
        { userId: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.role) query.role = req.query.role;
    if (req.query.status) query.status = req.query.status;
    if (req.query.village) query.village = req.query.village;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password') // Ensure password is never returned
      .populate('village', 'name villageId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get village report
// @route   GET /api/reports/villages
// @access  Private/Admin
const getVillageReport = async (req, res, next) => {
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
      .populate('assignedOperator', 'name phone userId') // Only safe fields
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: villages,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get audit report
// @route   GET /api/reports/activity
// @access  Private/Admin
const getActivityReport = async (req, res, next) => {
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

    if (req.query.date) {
      const dateVal = new Date(req.query.date);
      if (isNaN(dateVal.getTime())) {
        res.status(400);
        return next(new Error('Invalid date format provided'));
      }
      dateVal.setHours(0, 0, 0, 0);
      const endDate = new Date(dateVal);
      endDate.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: dateVal, $lte: endDate };
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
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReportSummary,
  getUserReport,
  getVillageReport,
  getActivityReport
};
