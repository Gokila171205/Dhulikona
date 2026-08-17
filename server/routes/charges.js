const express = require('express');
const router = express.Router();
const Charge = require('../models/Charge');

// GET all charges
router.get('/', async (req, res) => {
  try {
    const charges = await Charge.find().sort({ createdAt: -1 });
    res.json(charges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new charge record
router.post('/', async (req, res) => {
  try {
    const charge = new Charge(req.body);
    await charge.save();
    res.status(201).json(charge);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH mark as paid (used by "Mark Paid" button)
router.patch('/:id/pay', async (req, res) => {
  try {
    const charge = await Charge.findByIdAndUpdate(
      req.params.id,
      { status: 'Paid', paidAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!charge) return res.status(404).json({ error: 'Charge not found' });
    res.json(charge);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT full update
router.put('/:id', async (req, res) => {
  try {
    const charge = await Charge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!charge) return res.status(404).json({ error: 'Charge not found' });
    res.json(charge);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a charge
router.delete('/:id', async (req, res) => {
  try {
    const charge = await Charge.findByIdAndDelete(req.params.id);
    if (!charge) return res.status(404).json({ error: 'Charge not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;