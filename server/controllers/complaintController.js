const Complaint = require('../models/Complaint');
const { createAuditLog } = require('../services/auditService');

const mapComplaint = (c) => {
  if (!c) return null;

  let villageObj = null;

  if (c.village) {
    if (c.village.name) {
      villageObj = {
        _id: c.village._id,
        villageId: c.village.villageId,
        name: c.village.name,
        district: c.village.district,
        block: c.village.block
      };
    } else {
      villageObj = {
        _id: c.village.toString(),
        name: 'Village unavailable'
      };
    }
  }

  let reportedByObj = null;

  if (c.reportedBy) {
    if (c.reportedBy.name) {
      reportedByObj = {
        _id: c.reportedBy._id,
        userId: c.reportedBy.userId,
        name: c.reportedBy.name,
        role: c.reportedBy.role,
        phone: c.reportedBy.phone
      };
    } else {
      reportedByObj = {
        _id: c.reportedBy.toString(),
        name: 'Reporter unavailable'
      };
    }
  }

  let assignedToObj = null;

  if (c.assignedTo) {
    if (c.assignedTo.name) {
      assignedToObj = {
        _id: c.assignedTo._id,
        userId: c.assignedTo.userId,
        name: c.assignedTo.name,
        role: c.assignedTo.role,
        phone: c.assignedTo.phone
      };
    } else {
      assignedToObj = {
        _id: c.assignedTo.toString(),
        name: 'Operator unavailable'
      };
    }
  }

  return {
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
    location: c.location,
    date: c.date,
    village: villageObj,
    reportedBy: reportedByObj,
    assignedTo: assignedToObj,
    remarks: c.remarks || '',
    resolutionRemarks: c.remarks || ''
  };
};

// Get all complaints
const getComplaints = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Role-based filtering
    if (req.user?.role === 'villager') {
      query.reportedBy = req.user._id;
    } else if (req.user?.role === 'operator') {
      query.assignedTo = req.user._id;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.village) {
      query.village = req.query.village;
    }

    if (req.query.search) {
      query.$or = [
        {
          title: {
            $regex: req.query.search,
            $options: 'i'
          }
        },
        {
          description: {
            $regex: req.query.search,
            $options: 'i'
          }
        }
      ];
    }

    const total = await Complaint.countDocuments(query);

    const complaints = await Complaint.find(query)
      .populate('reportedBy', 'name email phone userId role')
      .populate('assignedTo', 'name email phone userId role')
      .populate('village', 'name villageId district block')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: complaints.map(mapComplaint),
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

// Get complaint by ID
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('reportedBy', 'name email phone userId role')
      .populate('assignedTo', 'name email phone userId role')
      .populate('village', 'name villageId district block');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    if (
      req.user?.role === 'villager' &&
      complaint.reportedBy &&
      complaint.reportedBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this complaint'
      });
    }

    res.json({
      success: true,
      data: mapComplaint(complaint)
    });
  } catch (error) {
    next(error);
  }
};

// Create complaint
const createComplaint = async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      date,
      village,
      reportedBy
    } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      location,
      date,
      village,

      // Authenticated user takes priority
      reportedBy: req.user?._id || reportedBy,

      status: 'Submitted'
    });

    await complaint.populate([
      {
        path: 'village',
        select: 'name villageId district block'
      },
      {
        path: 'reportedBy',
        select: 'name email phone userId role'
      },
      {
        path: 'assignedTo',
        select: 'name email phone userId role'
      }
    ]);

    if (req.user) {
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
    }

    res.status(201).json({
      success: true,
      data: mapComplaint(complaint)
    });
  } catch (error) {
    next(error);
  }
};

// Update complaint
const updateComplaint = async (req, res, next) => {
  try {
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('village', 'name villageId district block')
      .populate('reportedBy', 'name email phone userId role')
      .populate('assignedTo', 'name email phone userId role');

    if (req.user) {
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
    }

    res.json({
      success: true,
      data: mapComplaint(complaint)
    });
  } catch (error) {
    next(error);
  }
};

// Update complaint status
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;

    const statusPath = Complaint.schema.path('status');

    if (
      statusPath?.enumValues &&
      !statusPath.enumValues.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid status: ${status}. Must be one of: ${statusPath.enumValues.join(', ')}`
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint.status = status;

    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
    }

    if (status === 'Confirmed') {
      complaint.confirmedAt = new Date();
    }

    if (remarks !== undefined) {
      complaint.remarks = remarks;
    }

    await complaint.save();

    await complaint.populate([
      {
        path: 'village',
        select: 'name villageId district block'
      },
      {
        path: 'reportedBy',
        select: 'name email phone userId role'
      },
      {
        path: 'assignedTo',
        select: 'name email phone userId role'
      }
    ]);

    if (req.user) {
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
    }

    res.json({
      success: true,
      data: mapComplaint(complaint)
    });
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