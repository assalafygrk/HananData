const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const Transaction = require('../models/Transaction');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const txns = await Transaction.find({ status: 'success', type: { $ne: 'wallet-funding' } });
    console.log(txns.map(t => ({ id: t._id, amount: t.amount, apiCost: t.apiCost, profit: t.profit })));
    process.exit(0);
  });
