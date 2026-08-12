require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function checkAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const admins = await Admin.find({});
    console.log("All Admins:");
    admins.forEach(a => {
      console.log(`- ${a.email} | 2FA: ${a.twoFactorEnabled} | Role: ${a.role}`);
      if (a.twoFactorEnabled) {
        // Disable it forcefully for all admins for testing
        a.twoFactorEnabled = false;
        a.twoFactorSecret = undefined;
        a.save();
        console.log(`  -> Disabled 2FA for ${a.email}`);
      }
    });
  } catch (err) {
    console.error("Error:", err);
  } finally {
    setTimeout(() => process.exit(), 1000);
  }
}

checkAdmins();
