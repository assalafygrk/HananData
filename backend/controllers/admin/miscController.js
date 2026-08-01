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

exports.addProvider = async (req, res, next) => {
  try {
    const { name, type, apiKeyEncrypted, baseUrl, webhookUrl, username } = req.body;
    if (!name || !type) return sendResponse(res, 400, false, 'Name and type are required');
    const newProvider = await Provider.create({ name, type, apiKeyEncrypted, baseUrl, webhookUrl, username });
    return sendResponse(res, 201, true, newProvider);
  } catch (error) { next(error); }
};

exports.getPricing = async (req, res, next) => {
  try {
    const pricing = await PricingConfig.find();
    return sendResponse(res, 200, true, pricing);
  } catch (error) { next(error); }
};

exports.createPricing = async (req, res, next) => {
  try {
    const newConfig = new PricingConfig(req.body);
    await newConfig.save();
    return sendResponse(res, 201, true, newConfig);
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
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await PlatformSettings.findOne();
    if (!settings) {
      settings = new PlatformSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    return sendResponse(res, 200, true, settings);
  } catch (error) { next(error); }
};

exports.getLogs = async (req, res, next) => {
  try {
    const AuditLog = require('../../models/AuditLog');
    let logs = await AuditLog.find().populate('actorId', 'email name').sort({ timestamp: -1 }).limit(100);
    logs = logs.map(l => {
       const doc = l.toJSON();
       return {
         id: doc._id,
         actor: doc.actorId ? (doc.actorId.name || doc.actorId.email) : (doc.actorType === 'system' ? 'System' : 'Unknown Admin'),
         action: doc.action,
         level: doc.level || 'info',
         source: doc.source || 'system',
         details: doc.details || doc.note || 'No details provided',
         timestamp: doc.timestamp
       }
    });
    return sendResponse(res, 200, true, logs);
  } catch (error) { next(error); }
};

exports.getRoles = async (req, res, next) => {
  try {
    const Admin = require('../../models/Admin');
    const roles = await Admin.find().select('-password');
    return sendResponse(res, 200, true, roles);
  } catch (error) { next(error); }
};

exports.addRole = async (req, res, next) => {
  try {
    const Admin = require('../../models/Admin');
    const newAdmin = new Admin(req.body);
    await newAdmin.save();
    return sendResponse(res, 201, true, newAdmin);
  } catch (error) { next(error); }
};

exports.getReferrals = async (req, res, next) => {
  try {
    const ReferralHistory = require('../../models/ReferralHistory');
    const referrals = await ReferralHistory.find().populate('referrer referredUser', 'name email').sort({ createdAt: -1 }).limit(100);
    return sendResponse(res, 200, true, referrals);
  } catch (error) { next(error); }
};

exports.getBroadcasts = async (req, res, next) => {
  try {
    const Broadcast = require('../../models/Broadcast');
    const broadcasts = await Broadcast.find().sort({ createdAt: -1 }).limit(50);
    return sendResponse(res, 200, true, broadcasts);
  } catch (error) { next(error); }
};

exports.sendBroadcast = async (req, res, next) => {
  try {
    const Broadcast = require('../../models/Broadcast');
    const broadcast = new Broadcast({ ...req.body, createdBy: req.admin.id });
    await broadcast.save();
    return sendResponse(res, 201, true, broadcast);
  } catch (error) { next(error); }
};
