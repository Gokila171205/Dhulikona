const express = require('express');
const router = express.Router();
const WaterSupply = require('../models/WaterSupply');

// GET all supply records
router.get('/', async (req, res) => {
  try {
    const records = await WaterSupply.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new supply record
router.post('/', async (req, res) => {
  try {
    const record = new WaterSupply(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update an existing record (used by your "Edit" button)
router.put('/:id', async (req, res) => {
  try {
    const record = await WaterSupply.findByIdAndUpdate(
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
    const record = await WaterSupply.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;