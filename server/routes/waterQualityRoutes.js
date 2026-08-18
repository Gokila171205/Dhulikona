const express = require('express');
const router = express.Router();
const { 
  getWaterQuality, 
  getWaterQualityById, 
  createWaterQuality, 
  updateWaterQuality 
} = require('../controllers/waterQualityController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getWaterQuality)
  .post(createWaterQuality);

router.route('/:id')
  .get(getWaterQualityById)
  .put(updateWaterQuality);

module.exports = router;
