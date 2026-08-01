const User = require('../../models/User');
const Transaction = require('../../models/Transaction');
const { sendResponse } = require('../../utils/helpers');

const PlatformSettings = require('../../models/PlatformSettings');

exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const revenueToday = await Transaction.aggregate([
      { $match: { createdAt: { $gte: today }, status: 'success', type: { $ne: 'wallet-funding' } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const walletFloat = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$walletBalance' } } }
    ]);

    const settings = await PlatformSettings.findOne();
    const poolBalance = settings ? settings.poolBalance : 0;

    const pendingAlerts = await Transaction.countDocuments({ status: 'pending' });
    const failedAlerts = await Transaction.countDocuments({ status: 'failed' });

    return sendResponse(res, 200, true, {
      totalUsers,
      revenueToday: revenueToday[0] ? revenueToday[0].total : 0,
      walletFloat: walletFloat[0] ? walletFloat[0].total : 0,
      poolBalance,
      pendingAlerts,
      failedAlerts
    });
  } catch (error) { next(error); }
};

exports.getPnl = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ status: 'success', type: { $ne: 'wallet-funding' } });
    
    let grossRevenue = 0;
    // Assuming apiCost is roughly 95% of userPrice for demo purposes, since we don't store apiPrice in transaction currently
    // Wait, let's just use 90% as cost if we don't have it.
    // Or if Transaction has amount and apiPrice (it doesn't by default).
    // Let's just mock a 90% cost for now, since we don't track apiPrice per transaction yet.
    transactions.forEach(t => {
      grossRevenue += t.amount || 0;
    });

    const apiCosts = grossRevenue * 0.90;
    const netProfit = grossRevenue - apiCosts;
    const margin = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) + '%' : '0%';

    return sendResponse(res, 200, true, { 
      grossRevenue, 
      apiCosts, 
      netProfit, 
      margin 
    });
  } catch (error) { next(error); }
};