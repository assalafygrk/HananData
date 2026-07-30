const Transaction = require('../../models/Transaction');
const Provider = require('../../models/Provider');
const PricingConfig = require('../../models/PricingConfig');
const PlatformSettings = require('../../models/PlatformSettings');
const { sendResponse } = require('../../utils/helpers');

// Quick mocks for the rest of admin routes for the sake of completeness
exports.getTransactions = async (req, res, next) => {
  try {
    const { user } = req.query;
    const query = user ? { userId: user } : {};
    const tx = await Transaction.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(50);
    return sendResponse(res, 200, true, tx);
  } catch (error) { next(error); }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const tx = await Transaction.findById(req.params.id).populate('userId', 'name email phone');
    if (!tx) return sendResponse(res, 404, false, 'Transaction not found');
    return sendResponse(res, 200, true, tx);
  } catch (error) { next(error); }
};

exports.actionTransaction = async (req, res, next) => {
  try {
    const { action, note } = req.body;
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return sendResponse(res, 404, false, 'Transaction not found');
    
    let newStatus = tx.status;
    if (action === 'resolve') newStatus = 'success';
    if (action === 'refund') newStatus = 'failed';
    if (action === 'retry') newStatus = 'pending';
    
    tx.status = newStatus;
    tx.adminNote = (tx.adminNote ? tx.adminNote + ' | ' : '') + `Admin [${action}]: ${note}`;
    await tx.save();
    
    return sendResponse(res, 200, true, tx);
  } catch (error) { next(error); }
};

exports.getProviders = async (req, res, next) => {
  try {
    const providers = await Provider.find();
    return sendResponse(res, 200, true, providers);
  } catch (error) { next(error); }
};

exports.updateProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!provider) return sendResponse(res, 404, false, 'Provider not found');
    return sendResponse(res, 200, true, provider);
  } catch (error) { next(error); }
};

exports.getPricing = async (req, res, next) => {
  try {
    const pricing = await PricingConfig.find();
    return sendResponse(res, 200, true, pricing);
  } catch (error) { next(error); }
};

exports.updatePricing = async (req, res, next) => {
  try {
    const pricing = await PricingConfig.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pricing) return sendResponse(res, 404, false, 'Pricing config not found');
    return sendResponse(res, 200, true, pricing);
  } catch (error) { next(error); }
};

exports.getSettings = async (req, res, next) => {
  try {
    const settings = await PlatformSettings.findOne();
    return sendResponse(res, 200, true, settings);
  } catch (error) { next(error); }
};