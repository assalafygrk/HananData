const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  disableRegistration: { type: Boolean, default: false },
  minFunding: { type: Number, default: 100 },
  tier1Limit: { type: Number, default: 10000 },
  tier2Limit: { type: Number, default: 50000 },
  tier3Limit: { type: Number, default: 500000 },
  poolBalance: { type: Number, default: 500000 }
}, { timestamps: true });

module.exports = mongoose.model('PlatformSettings', platformSettingsSchema);
