const mongoose = require('mongoose');

const signupOtpSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  referralCode: { type: String },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 } // Auto-delete after 24 hours
});

module.exports = mongoose.model('SignupOTP', signupOtpSchema);
