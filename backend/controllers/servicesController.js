const Transaction = require('../models/Transaction');
const User = require('../models/User');
const PricingConfig = require('../models/PricingConfig');
const { sendResponse } = require('../utils/helpers');

// Placeholder VTU integration
const simulateProviderResponse = () => {
  // Random 80% success rate
  return Math.random() < 0.8 ? 'success' : 'failed';
};

exports.purchaseService = (type) => async (req, res, next) => {
  try {
    const { network, amount, phone, planId } = req.body;
    const user = await User.findById(req.user._id);

    if (user.walletBalance < amount) {
      return sendResponse(res, 400, false, 'Insufficient balance');
    }

    // Create pending transaction
    const transaction = await Transaction.create({
      userId: user._id,
      type,
      network,
      amount,
      refId: 'TXN-' + Date.now() + Math.floor(Math.random() * 1000)
    });

    // TODO: replace with real VTU aggregator integration
    const status = simulateProviderResponse();
    
    transaction.status = status;
    await transaction.save();

    if (status === 'success') {
      user.walletBalance -= amount;
      await user.save();
    }

    return sendResponse(res, 200, true, transaction);
  } catch (error) { next(error); }
};

exports.airtimeToCash = async (req, res, next) => {
  try {
    return sendResponse(res, 200, true, { message: 'Airtime to cash initiated' });
  } catch (error) { next(error); }
};

exports.getPricing = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const pricing = await PricingConfig.find(filter);
    return sendResponse(res, 200, true, pricing);
  } catch (error) { next(error); }
};