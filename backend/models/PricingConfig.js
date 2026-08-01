const mongoose = require('mongoose');

const pricingConfigSchema = new mongoose.Schema({
  network: { type: String, required: true },
  category: { type: String, enum: ['airtime', 'data', 'cable', 'electricity', 'airtime-to-cash', 'bulk-sms', 'exam-pins'], required: true },
  planId: { type: String },
  planName: { type: String },
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
