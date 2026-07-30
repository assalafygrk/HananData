const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  registrationEnabled: { type: Boolean, default: true },
  minFundingAmount: { type: Number, default: 100 },
  dailyTransactionCap: { type: Number, default: 1000000 }
}, { timestamps: true });

module.exports = mongoose.model('PlatformSettings', platformSettingsSchema);
