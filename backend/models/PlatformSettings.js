const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  disableRegistration: { type: Boolean, default: false },
  airtimeToCashEnabled: { type: Boolean, default: true },
  minFunding: { type: Number, default: 100 },
  tier1Limit: { type: Number, default: 10000 },
  tier2Limit: { type: Number, default: 50000 },
  tier3Limit: { type: Number, default: 500000 },
  poolBalance: { type: Number, default: 500000 },
  supportPhone: { type: String, default: '0800-HANAN-DATA (toll free)' },
  supportEmail: { type: String, default: 'support@hanandata.ng' },
  whatsapp: { type: String, default: '+2349160048633' },
  paymentPointApiKey: { type: String, default: '' },
  paymentPointApiSecret: { type: String, default: '' },
  paymentPointBusinessId: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('PlatformSettings', platformSettingsSchema);
