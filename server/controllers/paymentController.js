const Payment = require('../models/Payment');
const { createAuditLog } = require('../services/auditService');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.user.role === 'villager') {
      query.user = req.user._id;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.village) {
      query.village = req.query.village;
    }

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate('user', 'name phone userId')
      .populate('village', 'name villageId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: payments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('user', 'name phone userId')
      .populate('village', 'name villageId');
      
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Create payment record
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res, next) => {
  try {
    const { user, village, amount, dueDate, paidDate, status, paymentMethod, transactionId } = req.body;

    const payment = await Payment.create({
      user: user || req.user._id,
      village,
      amount: Number(amount),
      dueDate,
      paidDate,
      status: status || 'Pending',
      paymentMethod,
      transactionId
    });

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'CREATE',
      module: 'PAYMENTS',
      description: `Recorded fee payment record of ₹${amount} for user ID: ${user || req.user._id} (${status})`,
      result: 'SUCCESS',
      relatedRecordId: payment._id.toString()
    });

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment record
// @route   PUT /api/payments/:id
// @access  Private
const updatePayment = async (req, res, next) => {
  try {
    let payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'UPDATE',
      module: 'PAYMENTS',
      description: `Updated fee payment details for: ${payment._id}`,
      result: 'SUCCESS',
      relatedRecordId: payment._id.toString()
    });

    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment
};
