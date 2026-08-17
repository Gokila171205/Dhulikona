const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');

// GET all maintenance records (with pump details populated)
router.get('/', async (req, res) => {
  try {
    const records = await Maintenance.find()
      .populate('pump', 'name type status')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new maintenance record
router.post('/', async (req, res) => {
  try {
    const record = new Maintenance(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH update status (used by your "Complete" button)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Scheduled', 'In Progress', 'Completed'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updateFields = { status };
    if (status === 'Completed') {
      updateFields.completedAt = new Date();
    }

    const record = await Maintenance.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT full update (edit issue, priority, scheduledDate, etc.)
router.put('/:id', async (req, res) => {
  try {
    const record = await Maintenance.findByIdAndUpdate(
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
    const record = await Maintenance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;