const WaterSupply = require('../models/WaterSupply');

// Get all water supply records
const getWaterSupplies = async (req, res) => {
  try {
    const supplies = await WaterSupply.find()
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json(supplies);
  } catch (error) {
    console.error('Error fetching water supplies:', error);

    res.status(500).json({
      message: 'Failed to fetch water supply records',
      error: error.message
    });
  }
};

// Get one water supply record
const getWaterSupplyById = async (req, res) => {
  try {
    const supply = await WaterSupply.findById(req.params.id);

    if (!supply) {
      return res.status(404).json({
        message: 'Water supply record not found'
      });
    }

    res.status(200).json(supply);
  } catch (error) {
    console.error('Error fetching water supply:', error);

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
      date,
      startTime,
      endTime,
      area,
      pump,
      status,
      remarks
    } = req.body;

    if (!date || !startTime || !endTime || !area || !pump) {
      return res.status(400).json({
        message: 'Date, start time, end time, area and pump are required'
      });
    }

    const supply = await WaterSupply.create({
      date,
      startTime,
      endTime,
      area,
      pump,
      status,
      remarks
    });

    res.status(201).json({
      message: 'Water supply record created successfully',
      supply
    });
  } catch (error) {
    console.error('Error creating water supply:', error);

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