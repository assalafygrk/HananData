const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Super Admin', 'Support', 'Finance'], default: 'Support' },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
