const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const Transaction = require('../models/Transaction');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const transactions = await Transaction.find({ status: 'success', type: { $ne: 'wallet-funding' } });
    
    let grossRevenue = 0;
    let totalApiCosts = 0;
    let totalNetProfit = 0;

    transactions.forEach(t => {
      const amount = t.amount || 0;
      grossRevenue += amount;
      
      const cost = typeof t.apiCost === 'number' ? t.apiCost : (amount * 0.90);
      const profit = typeof t.profit === 'number' ? t.profit : (amount - cost);
      
      totalApiCosts += cost;
      totalNetProfit += profit;
    });

    const margin = grossRevenue > 0 ? ((totalNetProfit / grossRevenue) * 100).toFixed(1) + '%' : '0%';

    console.log({
      grossRevenue,
      apiCosts: totalApiCosts,
      netProfit: totalNetProfit,
      margin
    });
    process.exit(0);
  });
