const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// GET all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single complaint
router.get('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new complaint (used by villager side later)
router.post('/', async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH update complaint status (operator verifies / starts maintenance / resolves)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      'Submitted',
      'Verified',
      'Maintenance Started',
      'Resolved',
      'Confirmed'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updateFields = { status };

    // Auto-stamp timestamps when reaching key stages
    if (status === 'Resolved') {
      updateFields.resolvedAt = new Date();
    }
    if (status === 'Confirmed') {
      updateFields.confirmedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

    res.json(complaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;