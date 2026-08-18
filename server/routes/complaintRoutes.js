const express = require('express');

const router = express.Router();

const {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  updateComplaintStatus
} = require('../controllers/complaintController');

const { protect } = require('../middleware/authMiddleware');

// All complaint routes require authentication
router.use(protect);

// GET all complaints
// POST new complaint
router.route('/')
  .get(getComplaints)
  .post(createComplaint);

// GET complaint by ID
// PUT update complaint
router.route('/:id')
  .get(getComplaintById)
  .put(updateComplaint);

// PATCH complaint status
router.route('/:id/status')
  .patch(updateComplaintStatus);

module.exports = router;