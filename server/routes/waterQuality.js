const express = require('express');
const router = express.Router();
const WaterQuality = require('../models/WaterQuality');

// GET all quality records
router.get('/', async (req, res) => {
  try {
    const records = await WaterQuality.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new quality test record
router.post('/', async (req, res) => {
  try {
    const record = new WaterQuality(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update a record
router.put('/:id', async (req, res) => {
  try {
    const record = await WaterQuality.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a record
router.delete('/:id', async (req, res) => {
  try {
    const record = await WaterQuality.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;