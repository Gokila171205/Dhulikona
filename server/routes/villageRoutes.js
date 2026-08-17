const express = require('express');
const router = express.Router();
const {
  getVillages,
  getVillageById,
  createVillage,
  updateVillage,
  updateVillageStatus
} = require('../controllers/villageController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All village routes are protected and require admin role
router.use(protect);
router.use(authorizeRoles('admin'));

router.route('/')
  .get(getVillages)
  .post(createVillage);

router.route('/:id')
  .get(getVillageById)
  .put(updateVillage);

router.route('/:id/status')
  .patch(updateVillageStatus);

module.exports = router;
