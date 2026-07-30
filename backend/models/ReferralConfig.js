const mongoose = require('mongoose');

const referralConfigSchema = new mongoose.Schema({
  bonusAmount: { type: Number, required: true, default: 500 },
  minFundingThreshold: { type: Number, required: true, default: 1000 }
}, { timestamps: true });

module.exports = mongoose.model('ReferralConfig', referralConfigSchema);
