require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const speakeasy = require('speakeasy');

async function test() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/HananData');
  const admin = await Admin.findOne();
  if (admin) {
    console.log("Admin email:", admin.email);
    console.log("Admin 2FA enabled:", admin.twoFactorEnabled);
    console.log("Admin 2FA secret (base32):", admin.twoFactorSecret);
    
    // Generate a current token to see what it expects
    if (admin.twoFactorSecret) {
      const token = speakeasy.totp({
        secret: admin.twoFactorSecret,
        encoding: 'base32'
      });
      console.log("Expected current TOTP token:", token);
    }
  } else {
    console.log("No admin found.");
  }
  process.exit();
}
test();
