const express = require('express');
const router = express.Router();
const { 
  getPumps, 
  getPumpById, 
  createPump, 
  updatePump, 
  updatePumpStatus 
} = require('../controllers/pumpController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(getPumps)
  .post(authorizeRoles('admin'), createPump);

router.route('/:id')
  .get(getPumpById)
  .put(authorizeRoles('admin'), updatePump);

router.route('/:id/status')
  .patch(updatePumpStatus);

module.exports = router;
