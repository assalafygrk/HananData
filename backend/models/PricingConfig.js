const mongoose = require('mongoose');

const pricingConfigSchema = new mongoose.Schema({
  network: { type: String, required: true },
  category: { type: String, enum: ['airtime', 'data', 'cable', 'electricity', 'airtime-to-cash', 'bulk-sms', 'exam-pins'], required: true },
  planType: { type: String, default: 'general' }, // e.g. SME2, CORPORATE GIFTING, GIFTING, DIRECT etc.
  planId: { type: String },
  planName: { type: String },
  duration: { type: String }, // e.g. (30 Days)
  apiCost: { type: Number, required: true },
  vendorPrice: { type: Number, required: true },
  userPrice: { type: Number, required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

// Virtual for margin
pricingConfigSchema.virtual('margin').get(function() {
  return this.userPrice - this.apiCost;
});
pricingConfigSchema.set('toJSON', { virtuals: true });
pricingConfigSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('PricingConfig', pricingConfigSchema);
