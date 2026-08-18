const express = require('express');
const router = express.Router();
const Pump = require('../models/Pump');

// GET all pumps
router.get('/', async (req, res) => {
  try {
    const pumps = await Pump.find().sort({ createdAt: -1 });
    res.json(pumps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single pump
router.get('/:id', async (req, res) => {
  try {
    const pump = await Pump.findById(req.params.id);
    if (!pump) return res.status(404).json({ error: 'Pump not found' });
    res.json(pump);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new pump
router.post('/', async (req, res) => {
  try {
    const pump = new Pump(req.body);
    await pump.save();
    res.status(201).json(pump);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update a pump (used by your "Edit" button in Pumps.jsx)
router.put('/:id', async (req, res) => {
  try {
    const pump = await Pump.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pump) return res.status(404).json({ error: 'Pump not found' });
    res.json(pump);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a pump
router.delete('/:id', async (req, res) => {
  try {
    const pump = await Pump.findByIdAndDelete(req.params.id);
    if (!pump) return res.status(404).json({ error: 'Pump not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;