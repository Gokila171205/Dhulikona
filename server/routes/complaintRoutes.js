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

router.use(protect);

router.route('/')
  .get(getComplaints)
  .post(createComplaint);

router.route('/:id')
  .get(getComplaintById)
  .put(updateComplaint);

router.route('/:id/status')
  .patch(updateComplaintStatus);

module.exports = router;
