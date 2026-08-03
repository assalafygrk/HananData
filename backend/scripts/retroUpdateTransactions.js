const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const Transaction = require('../models/Transaction');
const PricingConfig = require('../models/PricingConfig');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    const txns = await Transaction.find({ status: 'success', type: { $ne: 'wallet-funding' } });
    let updated = 0;
    
    for (let t of txns) {
      if (!t.apiCost) {
        let actualApiCost = t.amount * 0.90; // Default fallback
        let pricingConfig;
        
        if (t.type === 'data' || t.type === 'cable') {
          pricingConfig = await PricingConfig.findOne({ category: t.type, network: t.network });
        } else {
          pricingConfig = await PricingConfig.findOne({ category: t.type, network: t.network });
        }
        
        if (pricingConfig) {
          if (t.type === 'data' || t.type === 'cable') {
             let exactConfig = await PricingConfig.findOne({ category: t.type, network: t.network, $or: [{ userPrice: t.amount }, { vendorPrice: t.amount }] });
             if (exactConfig) actualApiCost = exactConfig.apiCost;
          } else if (t.type === 'airtime') {
             actualApiCost = Math.round(t.amount * pricingConfig.apiCost);
          } else if (t.type === 'electricity') {
             actualApiCost = t.amount - 50;
          }
        }
        
        t.apiCost = actualApiCost;
        t.profit = t.amount - actualApiCost;
        await t.save();
        updated++;
      }
    }
    
    console.log(`Updated ${updated} transactions.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
