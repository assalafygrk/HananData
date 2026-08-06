const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['vtu', 'payment-gateway'], required: true },
  apiKeyEncrypted: { type: String },
  secretKeyEncrypted: { type: String },
  username: { type: String },
  baseUrl: { type: String },
  businessId: { type: String },
  webhookUrl: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  liveBalance: { type: Number, default: 0 },
  lowBalanceThreshold: { type: Number, default: 1000 },
  lastPingAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Provider', providerSchema);
