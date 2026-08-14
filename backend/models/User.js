const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  walletBalance: { type: Number, default: 0 },
  kycTier: { type: Number, enum: [0, 1, 2], default: 0 },
  kycStatus: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  transactionPinHash: { type: String },
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  virtualAccount: {
    bankName: { type: String },
    accountNumber: { type: String },
    accountName: { type: String },
    provider: { type: String, default: 'PaymentPoint' }
  },
  pushNotifs: { type: Boolean, default: true },
  emailNotifs: { type: Boolean, default: false },
  smsNotifs: { type: Boolean, default: false },
  appLockEnabled: { type: Boolean, default: false },
  appLockTimeout: { type: String, default: '3' },
  readBroadcasts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Broadcast' }],
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
  pinOtp: { type: String },
  pinOtpExpires: { type: Date },
  resetOtp: { type: String },
  resetOtpExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
