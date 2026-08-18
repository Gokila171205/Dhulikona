const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema({
  villageId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  district: { type: String, required: true },
  block: { type: String, required: true },
  households: { type: Number, default: 0 },
  assignedOperator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

// Add indexes as requested (unique constraint automatically indexes villageId)
villageSchema.index({ name: 1 });
villageSchema.index({ district: 1 });
villageSchema.index({ block: 1 });
villageSchema.index({ status: 1 });

module.exports = mongoose.model('Village', villageSchema);
