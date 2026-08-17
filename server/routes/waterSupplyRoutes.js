const express = require('express');
const router = express.Router();
const { 
  getWaterSupply, 
  getWaterSupplyById, 
  createWaterSupply, 
  updateWaterSupply 
} = require('../controllers/waterSupplyController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getWaterSupply)
  .post(createWaterSupply);

router.route('/:id')
  .get(getWaterSupplyById)
  .put(updateWaterSupply);

module.exports = router;
