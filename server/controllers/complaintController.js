const Complaint = require('../models/Complaint');

// Get all complaints
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('reportedBy', 'name email phone')
      .populate('village', 'name')
      .populate('assignedTo', 'name email');

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch complaints',
      error: error.message
    });
  }
};

// Get a single complaint
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('reportedBy', 'name email phone')
      .populate('village', 'name')
      .populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({
        message: 'Complaint not found'
      });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch complaint',
      error: error.message
    });
  }
};

// Create a new complaint
const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      village,
      reportedBy
    } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      village,
      reportedBy
    });

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create complaint',
      error: error.message
    });
  }
};

module.exports = {
  getComplaints,
  getComplaintById,
  createComplaint
};