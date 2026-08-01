const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Admin = require('../models/Admin');
const User = require('../models/User');

const resetUsers = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hanandata');
    console.log('MongoDB Connected!');

    console.log('Dropping the entire database...');
    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped.');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    console.log('Creating new Super Admin...');
    const newAdmin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@hanandata.com',
      passwordHash,
      role: 'Super Admin'
    });
    
    const PlatformSettings = require('../models/PlatformSettings');
    await PlatformSettings.create({
      siteName: 'HananData',
      supportEmail: 'support@hanandata.com',
      supportPhone: '+2348000000000',
      poolBalance: 500000
    });
    
    console.log('New Admin created successfully!');
    console.log('Credentials:');
    console.log('Email: admin@hanandata.com');
    console.log('Password: admin123');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

resetUsers();
