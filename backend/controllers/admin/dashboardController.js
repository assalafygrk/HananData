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
    const { startDate, endDate } = req.query;
    let dateFilter = {};
    
    if (startDate || endDate) {
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        dateFilter.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
    } else {
      // Default fallback if no dates provided (e.g. 7 days)
      const past = new Date(); 
      past.setDate(past.getDate() - 7);
      dateFilter = { $gte: past };
    }

    const query = { status: 'success', type: { $ne: 'wallet-funding' } };
    if (Object.keys(dateFilter).length > 0) query.createdAt = dateFilter;

    const transactions = await Transaction.find(query);
    
    let grossRevenue = 0;
    let totalApiCosts = 0;
    let totalNetProfit = 0;
    const groupedByDate = {};

    transactions.forEach(t => {
      const amount = t.amount || 0;
      grossRevenue += amount;
      
      // If transaction has apiCost recorded, use it, else fallback to 90% estimate
      const cost = typeof t.apiCost === 'number' ? t.apiCost : (amount * 0.90);
      const profit = typeof t.profit === 'number' ? t.profit : (amount - cost);
      
      totalApiCosts += cost;
      totalNetProfit += profit;

      const dateStr = t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      if (!groupedByDate[dateStr]) {
        groupedByDate[dateStr] = { date: dateStr, revenue: 0, cost: 0, profit: 0 };
      }
      groupedByDate[dateStr].revenue += amount;
      groupedByDate[dateStr].cost += cost;
      groupedByDate[dateStr].profit += profit;
    });

    const margin = grossRevenue > 0 ? ((totalNetProfit / grossRevenue) * 100).toFixed(1) + '%' : '0%';
    const chartData = Object.values(groupedByDate).sort((a, b) => new Date(a.date) - new Date(b.date));

    return sendResponse(res, 200, true, {
      grossRevenue,
      apiCosts: totalApiCosts,
      netProfit: totalNetProfit,
      margin,
      chartData
    });
  } catch (error) { next(error); }
};