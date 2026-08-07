const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connection successful!');
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}
check();
