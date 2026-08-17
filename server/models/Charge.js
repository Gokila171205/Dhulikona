const mongoose = require('mongoose');

const chargeSchema = new mongoose.Schema({
  household: { type: String, required: true, trim: true }, // e.g. "HH-001"
  head: { type: String, required: true, trim: true },       // head of household name
  members: { type: Number, required: true, min: 1 },
  amount: { type: Number, required: true, min: 0 },
  dueDate: { type: String, required: true },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Overdue'],
    default: 'Pending'
  },
  paidAt: { type: Date },
  village: { type: mongoose.Schema.Types.ObjectId, ref: 'Village' }
}, { timestamps: true });

module.exports = mongoose.model('Charge', chargeSchema);