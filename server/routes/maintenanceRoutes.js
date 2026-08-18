const express = require('express');
const router = express.Router();
const { 
  getMaintenance, 
  getMaintenanceById, 
  createMaintenance, 
  updateMaintenance, 
  updateMaintenanceStatus 
} = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getMaintenance)
  .post(createMaintenance);

router.route('/:id')
  .get(getMaintenanceById)
  .put(updateMaintenance);

router.route('/:id/status')
  .patch(updateMaintenanceStatus);

module.exports = router;
