const User = require('../../models/User');
const Transaction = require('../../models/Transaction');
const { sendResponse } = require('../../utils/helpers');

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

    return sendResponse(res, 200, true, {
      totalUsers,
      revenueToday: revenueToday[0] ? revenueToday[0].total : 0,
      walletFloat: walletFloat[0] ? walletFloat[0].total : 0
    });
  } catch (error) { next(error); }
};

exports.getPnl = async (req, res, next) => {
  try {
    return sendResponse(res, 200, true, { grossRevenue: 50000, apiCosts: 45000, netProfit: 5000, margin: '10%' }); // Mock
  } catch (error) { next(error); }
};