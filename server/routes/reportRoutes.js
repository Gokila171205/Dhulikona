const express = require('express');
const router = express.Router();
const { 
  getReportSummary,
  getUserReport,
  getVillageReport,
  getActivityReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorizeRoles('admin'));

router.route('/summary').get(getReportSummary);
router.route('/users').get(getUserReport);
router.route('/villages').get(getVillageReport);
router.route('/activity').get(getActivityReport);

module.exports = router;
