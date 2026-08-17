const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Villager
  village: { type: mongoose.Schema.Types.ObjectId, ref: 'Village', required: true },
  amount: { type: Number, required: true },
  dueDate: { type: String, required: true },
  paidDate: { type: String },
  status: { 
    type: String, 
    enum: ['Paid', 'Pending', 'Partially Paid', 'Overdue'],
    default: 'Pending'
  },
  paymentMethod: { 
    type: String, 
    enum: ['Cash', 'UPI', 'Card', 'NetBanking'],
    default: 'UPI'
  },
  transactionId: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
