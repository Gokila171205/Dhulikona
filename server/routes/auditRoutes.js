const express = require('express');
const router = express.Router();
const { getAuditLogs, getAuditLogById } = require('../controllers/auditController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All audit routes are protected, read-only, and require admin role
router.use(protect);
router.use(authorizeRoles('admin'));

router.route('/')
  .get(getAuditLogs);

router.route('/:id')
  .get(getAuditLogById);

module.exports = router;
