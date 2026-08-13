const Transaction = require('../../models/Transaction');
const Provider = require('../../models/Provider');
const PricingConfig = require('../../models/PricingConfig');
const PlatformSettings = require('../../models/PlatformSettings');
const { sendResponse } = require('../../utils/helpers');
const Admin = require('../../models/Admin');
const bcrypt = require('bcryptjs');

exports.verifyPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) return sendResponse(res, 400, false, 'Password is required');
    
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return sendResponse(res, 404, false, 'Admin not found');
    
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) return sendResponse(res, 401, false, 'Incorrect password');
    
    return sendResponse(res, 200, true, { message: 'Password verified' });
  } catch (error) { next(error); }
};

// Quick mocks for the rest of admin routes for the sake of completeness
exports.globalSearch = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    if (!q || q.length < 2) return sendResponse(res, 200, true, []);

    const regex = new RegExp(q, 'i');
    const User = require('../../models/User');
    
    const [users, txs, providers] = await Promise.all([
      User.find({
        $or: [{ name: regex }, { email: regex }, { phone: regex }]
      }).limit(5).lean(),
      Transaction.find({
        $or: [{ refId: regex }, { type: regex }]
      }).limit(5).lean(),
      Provider.find({
        $or: [{ name: regex }, { type: regex }]
      }).limit(5).lean()
    ]);

    const results = [];
    users.forEach(u => results.push({ type: 'user', id: u._id, title: u.name, subtitle: u.email }));
    txs.forEach(t => results.push({ type: 'transaction', id: t._id, title: `Transaction ${t.refId}`, subtitle: `${t.type} - ₦${t.amount}` }));
    providers.forEach(p => results.push({ type: 'provider', id: p._id, title: p.name, subtitle: `Provider (${p.type})` }));

    return sendResponse(res, 200, true, results);
  } catch (error) { next(error); }
};
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

    // If resolving an airtime-to-cash transaction, credit user's wallet with net cash value
    if (tx.type === 'airtime-to-cash' && action === 'resolve' && tx.status !== 'success') {
      const User = require('../../models/User');
      const user = await User.findById(tx.userId);
      if (user) {
        const netCash = tx.amount - (tx.fee || 0);
        user.walletBalance = (user.walletBalance || 0) + netCash;
        await user.save();
      }
    }
    
    tx.status = newStatus;
    tx.adminNote = (tx.adminNote ? tx.adminNote + ' | ' : '') + `Admin [${action}]: ${note}`;
    await tx.save();
    
    return sendResponse(res, 200, true, tx);
  } catch (error) { next(error); }
};

exports.getProviders = async (req, res, next) => {
  try {
    const providers = await Provider.find();
    
    // Attempt to fetch live balances for active VTU providers
    const SubandgainClient = require('../../utils/subandgainClient');
    
    const updatedProviders = await Promise.all(providers.map(async (p) => {
      if (p.type === 'vtu' && p.status === 'active' && p.apiKeyEncrypted && p.username) {
        try {
          const client = new SubandgainClient(p.username, p.apiKeyEncrypted);
          const balanceRes = await client.checkBalance();
          console.log(`Balance check for ${p.name}:`, balanceRes);
          
          let balanceValue = undefined;
          if (balanceRes) {
            if (balanceRes.balance !== undefined) balanceValue = balanceRes.balance;
            else if (balanceRes.data && balanceRes.data.balance !== undefined) balanceValue = balanceRes.data.balance;
            else if (balanceRes.wallet_balance !== undefined) balanceValue = balanceRes.wallet_balance;
          }

          if (balanceValue !== undefined) {
            p.liveBalance = parseFloat(balanceValue);
            p.lastPingAt = new Date();
            await p.save();
          } else if (balanceRes && typeof balanceRes === 'string' && !balanceRes.includes('error')) {
            // Some APIs just return the raw number or string representation
            const parsed = parseFloat(balanceRes);
            if (!isNaN(parsed)) {
              p.liveBalance = parsed;
              p.lastPingAt = new Date();
              await p.save();
            }
          }
        } catch (err) {
          console.error(`Failed to fetch balance for provider ${p.name}:`, err.message);
        }
      }
      return p;
    }));

    return sendResponse(res, 200, true, updatedProviders);
  } catch (error) { next(error); }
};

exports.updateProvider = async (req, res, next) => {
  try {
    const { password, ...updateData } = req.body;
    if (!password) {
      return sendResponse(res, 400, false, 'Admin password is required to update provider');
    }

    const admin = await Admin.findById(req.admin._id);
    if (!admin) return sendResponse(res, 404, false, 'Admin profile not found');

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return sendResponse(res, 401, false, 'Incorrect admin password');
    }

    const provider = await Provider.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!provider) return sendResponse(res, 404, false, 'Provider not found');
    return sendResponse(res, 200, true, provider);
  } catch (error) { next(error); }
};

exports.deleteProvider = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) {
      return sendResponse(res, 400, false, 'Admin password is required to delete provider');
    }

    const admin = await Admin.findById(req.admin._id);
    if (!admin) return sendResponse(res, 404, false, 'Admin profile not found');

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return sendResponse(res, 401, false, 'Incorrect admin password');
    }

    const provider = await Provider.findByIdAndDelete(req.params.id);
    if (!provider) return sendResponse(res, 404, false, 'Provider not found');
    
    // Cascade delete any pricing configurations tied to this provider
    await PricingConfig.deleteMany({ providerId: req.params.id });

    return sendResponse(res, 200, true, { message: 'Provider and associated configurations deleted successfully' });
  } catch (error) { next(error); }
};

exports.addProvider = async (req, res, next) => {
  try {
    const { name, type, apiKeyEncrypted, secretKeyEncrypted, businessId, baseUrl, webhookUrl, username } = req.body;
    if (!name || !type) return sendResponse(res, 400, false, 'Name and type are required');
    const newProvider = await Provider.create({ name, type, apiKeyEncrypted, secretKeyEncrypted, businessId, baseUrl, webhookUrl, username });
    
    // Automatically trigger sync if it's a VTU provider
    if (type === 'vtu') {
      const { fetchAndSyncPrices } = require('../../../scripts/priceSync');
      fetchAndSyncPrices().catch(err => console.error(`Error auto-syncing pricing: ${err.message}`));
    }

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

exports.syncPricing = async (req, res, next) => {
  try {
    const { fetchAndSyncPrices } = require('../../../scripts/priceSync');
    
    // Execute asynchronously so it doesn't block
    fetchAndSyncPrices().catch(err => console.error(`Error in manual sync: ${err.message}`));

    return sendResponse(res, 200, true, { message: 'Pricing synchronization started in the background.' });
  } catch (error) { next(error); }
};

exports.getReferrals = async (req, res, next) => {
  try {
    const ReferralHistory = require('../../models/ReferralHistory');
    const histories = await ReferralHistory.find()
      .populate('referrerId referredUserId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
      
    const referrals = histories.map(h => {
      const doc = h.toObject();
      doc.referrer = doc.referrerId;
      doc.referredUser = doc.referredUserId;
      return doc;
    });
    
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
    const broadcast = new Broadcast({ ...req.body, createdBy: req.admin.id, status: 'sent', sentAt: new Date() });
    await broadcast.save();
    return sendResponse(res, 201, true, broadcast);
  } catch (error) { next(error); }
};
