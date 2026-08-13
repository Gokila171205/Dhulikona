const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['VILLAGER', 'OPERATOR', 'ADMIN'], 
    default: 'VILLAGER' 
  },
  phone: { type: String },
  village: { type: mongoose.Schema.Types.ObjectId, ref: 'Village' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
