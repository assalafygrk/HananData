const mongoose = require('mongoose');
const Provider = require('./backend/models/Provider');
require('dotenv').config({ path: './backend/.env' });

async function check() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hanandata');
  const providerConfig = await Provider.findOne({ type: 'payment-gateway', status: 'active', name: { $regex: /paymentpoint/i } });
  if (providerConfig) {
    console.log('API Key:', providerConfig.apiKeyEncrypted?.substring(0, 5) + '...');
    console.log('API Secret:', providerConfig.secretKeyEncrypted?.substring(0, 5) + '...');
    console.log('Business ID:', providerConfig.businessId?.substring(0, 5) + '...');
  } else {
    console.log('PaymentPoint not found in Providers!');
  }
  process.exit(0);
}
check();
