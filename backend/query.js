const mongoose = require('mongoose');
const PricingConfig = require('./models/PricingConfig');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hanandata')
  .then(async () => {
    const prices = await PricingConfig.find({ category: 'electricity' });
    console.log(prices.map(p => p.network));
    process.exit();
  });
