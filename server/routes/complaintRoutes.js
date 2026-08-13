const express = require('express');

const {
  getComplaints,
  getComplaintById,
  createComplaint
} = require('../controllers/complaintController');

const router = express.Router();

// Get all complaints
router.get('/', getComplaints);

// Get one complaint
router.get('/:id', getComplaintById);

// Create a complaint
router.post('/', createComplaint);

module.exports = router;