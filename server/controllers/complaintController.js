const Complaint = require('../models/Complaint');
const { createAuditLog } = require('../services/auditService');

// @desc    Get all complaints with pagination/filters
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Role-based restrictions
    if (req.user.role === 'villager') {
      query.reportedBy = req.user._id;
    } else if (req.user.role === 'operator') {
      query.assignedTo = req.user._id;
    }

    // Additional filters
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.village) {
      query.village = req.query.village;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('reportedBy', 'name phone userId')
      .populate('assignedTo', 'name phone userId')
      .populate('village', 'name villageId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const mapComplaint = (c) => ({
      _id: c._id,
      id: c._id.toString(),
      complaintId: c._id.toString(),
      title: c.title,
      description: c.description,
      status: c.status,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      resolvedAt: c.resolvedAt,
      confirmedAt: c.confirmedAt,
      village: c.village,
      reportedBy: c.reportedBy,
      assignedTo: c.assignedTo,
      villageName: c.village?.name || 'Unknown',
      villagerName: c.reportedBy?.name || 'Villager',
      operator: c.assignedTo?.name || 'Unassigned',
      submittedDate: c.createdAt,
      updatedDate: c.updatedAt
    });

    res.json({
      success: true,
      data: complaints.map(mapComplaint),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('reportedBy', 'name phone userId')
      .populate('assignedTo', 'name phone userId')
      .populate('village', 'name villageId');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Role-based access validation
    if (req.user.role === 'villager' && complaint.reportedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this complaint' });
    }

    const mapComplaint = (c) => ({
      _id: c._id,
      id: c._id.toString(),
      complaintId: c._id.toString(),
      title: c.title,
      description: c.description,
      status: c.status,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      resolvedAt: c.resolvedAt,
      confirmedAt: c.confirmedAt,
      village: c.village,
      reportedBy: c.reportedBy,
      assignedTo: c.assignedTo,
      villageName: c.village?.name || 'Unknown',
      villagerName: c.reportedBy?.name || 'Villager',
      operator: c.assignedTo?.name || 'Unassigned',
      submittedDate: c.createdAt,
      updatedDate: c.updatedAt
    });

    res.json({ success: true, data: mapComplaint(complaint) });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private/Villager
const createComplaint = async (req, res, next) => {
  try {
    const { title, description, village } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      village,
      reportedBy: req.user._id,
      status: 'Submitted'
    });

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'CREATE',
      module: 'COMPLAINTS',
      description: `Reported water problem: "${title}"`,
      result: 'SUCCESS',
      village: req.user.villageName || '',
      relatedRecordId: complaint._id.toString()
    });

    res.status(201).json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint details
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaint = async (req, res, next) => {
  try {
    let complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'UPDATE',
      module: 'COMPLAINTS',
      description: `Updated complaint details for: "${complaint.title}"`,
      result: 'SUCCESS',
      relatedRecordId: complaint._id.toString()
    });

    res.json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PATCH /api/complaints/:id/status
// @access  Private
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;

    let complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.status = status;
    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
    } else if (status === 'Confirmed') {
      complaint.confirmedAt = new Date();
    }

    await complaint.save();

    await createAuditLog({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'STATUS_CHANGE',
      module: 'COMPLAINTS',
      description: `Changed complaint status to ${status}. Remarks: ${remarks || 'None'}`,
      result: 'SUCCESS',
      relatedRecordId: complaint._id.toString()
    });

    res.json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  updateComplaintStatus
};
