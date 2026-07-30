const fs = require('fs');
const path = require('path');

const models = {
  'Admin.js': `const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Super Admin', 'Support', 'Finance'], default: 'Support' }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
`,
  'User.js': `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  walletBalance: { type: Number, default: 0 },
  kycTier: { type: Number, enum: [0, 1, 2], default: 0 },
  kycStatus: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
`,
  'Transaction.js': `const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['airtime', 'data', 'cable', 'electricity', 'airtime-to-cash', 'wallet-funding'], required: true },
  network: { type: String },
  amount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
  refId: { type: String, required: true, unique: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  resolvedNote: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
`,
  'PricingConfig.js': `const mongoose = require('mongoose');

const pricingConfigSchema = new mongoose.Schema({
  network: { type: String, required: true },
  category: { type: String, enum: ['airtime', 'data', 'cable', 'electricity'], required: true },
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
`,
  'Provider.js': `const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['vtu', 'payment-gateway'], required: true },
  apiKeyEncrypted: { type: String },
  baseUrl: { type: String },
  webhookUrl: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  liveBalance: { type: Number, default: 0 },
  lowBalanceThreshold: { type: Number, default: 1000 },
  lastPingAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Provider', providerSchema);
`,
  'KYCSubmission.js': `const mongoose = require('mongoose');

const kycSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['BVN', 'NIN'], required: true },
  documentUrl: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  rejectionReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('KYCSubmission', kycSubmissionSchema);
`,
  'Broadcast.js': `const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema({
  message: { type: String, required: true },
  targetSegment: { type: String, enum: ['all', 'active', 'suspended', 'tier0', 'tier1', 'tier2'], default: 'all' },
  scheduledAt: { type: Date },
  sentAt: { type: Date },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  status: { type: String, enum: ['pending', 'sent', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Broadcast', broadcastSchema);
`,
  'ReferralConfig.js': `const mongoose = require('mongoose');

const referralConfigSchema = new mongoose.Schema({
  bonusAmount: { type: Number, required: true, default: 500 },
  minFundingThreshold: { type: Number, required: true, default: 1000 }
}, { timestamps: true });

module.exports = mongoose.model('ReferralConfig', referralConfigSchema);
`,
  'ReferralHistory.js': `const mongoose = require('mongoose');

const referralHistorySchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bonusPaid: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('ReferralHistory', referralHistorySchema);
`,
  'AuditLog.js': `const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  actorType: { type: String, enum: ['admin', 'system'], required: true },
  action: { type: String, required: true },
  targetType: { type: String },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  note: { type: String }
}, { timestamps: { createdAt: 'timestamp', updatedAt: false } });

module.exports = mongoose.model('AuditLog', auditLogSchema);
`,
  'PlatformSettings.js': `const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  registrationEnabled: { type: Boolean, default: true },
  minFundingAmount: { type: Number, default: 100 },
  dailyTransactionCap: { type: Number, default: 1000000 }
}, { timestamps: true });

module.exports = mongoose.model('PlatformSettings', platformSettingsSchema);
`
};

const modelsDir = path.join(__dirname, 'models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir);
}

for (const [filename, content] of Object.entries(models)) {
  fs.writeFileSync(path.join(modelsDir, filename), content);
}
console.log('Models scaffolded successfully');
