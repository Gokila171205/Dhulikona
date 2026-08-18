const express = require('express');

const router = express.Router();

const {
  getWaterSupply,
  getWaterSupplyById,
  createWaterSupply,
  updateWaterSupply
} = require('../controllers/waterSupplyController');

const { protect } = require('../middleware/authMiddleware');

// All water supply routes require authentication
router.use(protect);

// GET all records
// POST new record
router.route('/')
  .get(getWaterSupply)
  .post(createWaterSupply);

// GET one record
// PUT update record
router.route('/:id')
  .get(getWaterSupplyById)
  .put(updateWaterSupply);

module.exports = router;