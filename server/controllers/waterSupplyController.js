const WaterSupply = require('../models/WaterSupply');

// Get all water supply records
const getWaterSupplies = async (req, res) => {
  try {
    const supplies = await WaterSupply.find()
      .populate('village', 'name')
      .sort({ date: -1 });

    res.status(200).json(supplies);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch water supply records',
      error: error.message
    });
  }
};

// Get one water supply record
const getWaterSupplyById = async (req, res) => {
  try {
    const supply = await WaterSupply.findById(req.params.id)
      .populate('village', 'name');

    if (!supply) {
      return res.status(404).json({
        message: 'Water supply record not found'
      });
    }

    res.status(200).json(supply);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch water supply record',
      error: error.message
    });
  }
};

// Create water supply record
const createWaterSupply = async (req, res) => {
  try {
    const {
      village,
      date,
      startTime,
      endTime,
      duration,
      status
    } = req.body;

    const supply = await WaterSupply.create({
      village,
      date,
      startTime,
      endTime,
      duration,
      status
    });

    const populatedSupply = await supply.populate(
      'village',
      'name'
    );

    res.status(201).json({
      message: 'Water supply record created successfully',
      supply: populatedSupply
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create water supply record',
      error: error.message
    });
  }
};

module.exports = {
  getWaterSupplies,
  getWaterSupplyById,
  createWaterSupply
};