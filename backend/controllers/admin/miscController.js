const Transaction = require('../../models/Transaction');
const Provider = require('../../models/Provider');
const PricingConfig = require('../../models/PricingConfig');
const PlatformSettings = require('../../models/PlatformSettings');
const { sendResponse } = require('../../utils/helpers');

// Quick mocks for the rest of admin routes for the sake of completeness
exports.getTransactions = async (req, res, next) => {
  try {
    const tx = await Transaction.find().sort({ createdAt: -1 }).limit(50);
    return sendResponse(res, 200, true, tx);
  } catch (error) { next(error); }
};

exports.getProviders = async (req, res, next) => {
  try {
    const providers = await Provider.find();
    return sendResponse(res, 200, true, providers);
  } catch (error) { next(error); }
};

exports.getPricing = async (req, res, next) => {
  try {
    const pricing = await PricingConfig.find();
    return sendResponse(res, 200, true, pricing);
  } catch (error) { next(error); }
};

exports.getSettings = async (req, res, next) => {
  try {
    const settings = await PlatformSettings.findOne();
    return sendResponse(res, 200, true, settings);
  } catch (error) { next(error); }
};