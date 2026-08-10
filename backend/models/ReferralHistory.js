const mongoose = require('mongoose');

const referralHistorySchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bonusPaid: { type: Number, required: true },
  status: { type: String, enum: ['active', 'pending', 'paid'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('ReferralHistory', referralHistorySchema);
