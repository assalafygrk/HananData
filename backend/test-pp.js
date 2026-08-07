const mongoose = require('mongoose');
const Provider = require('./models/Provider');
require('dotenv').config({ path: './.env' });

async function check() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hanandata');
  const providerConfig = await Provider.findOne({ type: 'payment-gateway', status: 'active', name: { $regex: /paymentpoint/i } });
  if (providerConfig) {
    console.log('API Key:', providerConfig.apiKeyEncrypted);
    console.log('API Secret:', providerConfig.secretKeyEncrypted);
    console.log('Business ID:', providerConfig.businessId);
  } else {
    console.log('PaymentPoint not found in Providers!');
  }
  process.exit(0);
}
check();
