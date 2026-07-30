const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const Admin = require('../models/Admin');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const PricingConfig = require('../models/PricingConfig');
const Provider = require('../models/Provider');
const PlatformSettings = require('../models/PlatformSettings');
const ReferralConfig = require('../models/ReferralConfig');

const importData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hanandata');
    console.log('MongoDB Connected!');

    await Admin.deleteMany();
    await User.deleteMany();
    await Transaction.deleteMany();
    await PricingConfig.deleteMany();
    await Provider.deleteMany();
    await PlatformSettings.deleteMany();
    await ReferralConfig.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // 1. Admins
    const admins = await Admin.insertMany([
      { name: 'Super Admin', email: 'super@hanandata.com', passwordHash, role: 'Super Admin' },
      { name: 'Support Admin', email: 'support@hanandata.com', passwordHash, role: 'Support' },
      { name: 'Finance Admin', email: 'finance@hanandata.com', passwordHash, role: 'Finance' }
    ]);

    // 2. Providers
    const providers = await Provider.insertMany([
      { name: 'MTN VTU', type: 'vtu', liveBalance: 50000, status: 'active' },
      { name: 'Paystack', type: 'payment-gateway', liveBalance: 120000, status: 'active' }
    ]);

    // 3. Settings & Config
    await PlatformSettings.create({ maintenanceMode: false, registrationEnabled: true });
    await ReferralConfig.create({ bonusAmount: 500, minFundingThreshold: 1000 });

    // 4. Users (15 sample users)
    const usersData = Array.from({ length: 15 }).map((_, i) => ({
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `08012345${i.toString().padStart(3, '0')}`,
      passwordHash,
      walletBalance: Math.floor(Math.random() * 10000),
      kycTier: i % 3,
      kycStatus: ['unverified', 'pending', 'verified'][i % 3],
      referralCode: `REF${i}XYZ`
    }));
    const users = await User.insertMany(usersData);

    // 5. Pricing Config
    const networks = ['MTN', 'AIRTEL', 'GLO', '9MOBILE'];
    const categories = ['airtime', 'data'];
    const pricingData = [];
    networks.forEach(network => {
      categories.forEach(category => {
        pricingData.push({
          network, category, planName: `1GB ${network} ${category}`, apiCost: 200, vendorPrice: 220, userPrice: 250, providerId: providers[0]._id, lastUpdatedBy: admins[0]._id
        });
      });
    });
    await PricingConfig.insertMany(pricingData);

    // 6. Transactions (30 sample transactions)
    const transactionTypes = ['airtime', 'data', 'cable', 'electricity', 'wallet-funding'];
    const statuses = ['success', 'pending', 'failed'];
    const txData = Array.from({ length: 30 }).map((_, i) => ({
      userId: users[i % 15]._id,
      type: transactionTypes[i % 5],
      network: networks[i % 4],
      amount: Math.floor(Math.random() * 5000) + 100,
      status: statuses[i % 3],
      refId: `TXN-${Date.now()}-${i}`,
      providerId: providers[0]._id
    }));
    await Transaction.insertMany(txData);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
