const express = require('express');


const {
  getWaterSupplies,
  getWaterSupplyById,
  createWaterSupply
} = require('../controllers/waterSupplyController');

const router = express.Router();

// Get all water supply records
router.get('/', getWaterSupplies);

// Get one water supply record
router.get('/:id', getWaterSupplyById);

// Create water supply record
router.post('/', createWaterSupply);

module.exports = router;