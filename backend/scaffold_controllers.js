const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'controllers');
const routesDir = path.join(__dirname, 'routes');

[controllersDir, routesDir, path.join(controllersDir, 'admin'), path.join(routesDir, 'admin')].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const files = {
  // --- CUSTOMER CONTROLLERS ---
  'controllers/authController.js': `
const User = require('../models/User');
const { generateToken, sendResponse } = require('../utils/helpers');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) return sendResponse(res, 400, false, 'User already exists');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Generate a simple referral code
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const user = await User.create({ name, email, phone, passwordHash, referralCode });
    const token = generateToken(user._id);

    return sendResponse(res, 201, true, { _id: user._id, name: user.name, email: user.email, phone: user.phone, token });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or phone
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const token = generateToken(user._id);
      return sendResponse(res, 200, true, { _id: user._id, name: user.name, email: user.email, phone: user.phone, token });
    }
    return sendResponse(res, 401, false, 'Invalid credentials');
  } catch (error) { next(error); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    // TODO: implement real OTP sending
    return sendResponse(res, 200, true, { message: 'OTP sent successfully (mocked)' });
  } catch (error) { next(error); }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { identifier, otp, newPassword } = req.body;
    // TODO: implement real OTP verification
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user) return sendResponse(res, 404, false, 'User not found');
    
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    return sendResponse(res, 200, true, { message: 'Password reset successful' });
  } catch (error) { next(error); }
};
`,
  'controllers/profileController.js': `
const User = require('../models/User');
const { sendResponse } = require('../utils/helpers');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    return sendResponse(res, 200, true, user);
  } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    await user.save();
    return sendResponse(res, 200, true, user);
  } catch (error) { next(error); }
};

exports.getWalletBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return sendResponse(res, 200, true, { balance: user.walletBalance });
  } catch (error) { next(error); }
};

exports.fundWallet = async (req, res, next) => {
  try {
    const { amount } = req.body;
    // TODO: replace with real Paystack/Monnify webhook initialization
    return sendResponse(res, 200, true, { message: 'Pending transaction created (mock)', amount });
  } catch (error) { next(error); }
};
`,
  'controllers/servicesController.js': `
const Transaction = require('../models/Transaction');
const User = require('../models/User');
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
`,
  'controllers/miscController.js': `
const Transaction = require('../models/Transaction');
const KYCSubmission = require('../models/KYCSubmission');
const Broadcast = require('../models/Broadcast');
const ReferralHistory = require('../models/ReferralHistory');
const { sendResponse } = require('../utils/helpers');

exports.getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    return sendResponse(res, 200, true, transactions);
  } catch (error) { next(error); }
};

exports.submitKYC = async (req, res, next) => {
  try {
    const { type, documentUrl } = req.body;
    const kyc = await KYCSubmission.create({ userId: req.user._id, type, documentUrl });
    return sendResponse(res, 201, true, kyc);
  } catch (error) { next(error); }
};

exports.getReferrals = async (req, res, next) => {
  try {
    const history = await ReferralHistory.find({ referrerId: req.user._id }).populate('referredUserId', 'name');
    return sendResponse(res, 200, true, history);
  } catch (error) { next(error); }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const broadcasts = await Broadcast.find({ status: 'sent' }).sort({ sentAt: -1 }).limit(20);
    return sendResponse(res, 200, true, broadcasts);
  } catch (error) { next(error); }
};
`,
  // --- ADMIN CONTROLLERS ---
  'controllers/admin/authController.js': `
const Admin = require('../../models/Admin');
const { generateToken, sendResponse } = require('../../utils/helpers');
const bcrypt = require('bcryptjs');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
      const token = generateToken(admin._id, true, admin.role);
      return sendResponse(res, 200, true, { _id: admin._id, name: admin.name, email: admin.email, role: admin.role, token });
    }
    return sendResponse(res, 401, false, 'Invalid credentials');
  } catch (error) { next(error); }
};
`,
  'controllers/admin/dashboardController.js': `
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
`,
  'controllers/admin/usersController.js': `
const User = require('../../models/User');
const AuditLog = require('../../models/AuditLog');
const { sendResponse } = require('../../utils/helpers');

exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = search ? { $or: [{ email: new RegExp(search, 'i') }, { phone: new RegExp(search, 'i') }] } : {};
    const users = await User.find(query).select('-passwordHash').skip((page - 1) * limit).limit(parseInt(limit));
    const total = await User.countDocuments(query);
    return sendResponse(res, 200, true, { users, total, page, limit });
  } catch (error) { next(error); }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return sendResponse(res, 404, false, 'User not found');
    return sendResponse(res, 200, true, user);
  } catch (error) { next(error); }
};

exports.creditUser = async (req, res, next) => {
  try {
    const { amount, note } = req.body;
    const user = await User.findById(req.params.id);
    user.walletBalance += amount;
    await user.save();

    await AuditLog.create({ actorId: req.admin._id, actorType: 'admin', action: 'credit_user', targetType: 'User', targetId: user._id, note });
    return sendResponse(res, 200, true, user);
  } catch (error) { next(error); }
};

exports.debitUser = async (req, res, next) => {
  try {
    const { amount, note } = req.body;
    const user = await User.findById(req.params.id);
    if (user.walletBalance < amount) return sendResponse(res, 400, false, 'Insufficient balance');
    user.walletBalance -= amount;
    await user.save();

    await AuditLog.create({ actorId: req.admin._id, actorType: 'admin', action: 'debit_user', targetType: 'User', targetId: user._id, note });
    return sendResponse(res, 200, true, user);
  } catch (error) { next(error); }
};
`,
  'controllers/admin/miscController.js': `
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
`,
  // --- ROUTES ---
  'routes/userRoutes.js': `
const express = require('express');
const router = express.Router();
const { authLimiter } = require('../middleware/rateLimit');
const { authenticateUser } = require('../middleware/auth');
const authCtrl = require('../controllers/authController');
const profileCtrl = require('../controllers/profileController');
const servicesCtrl = require('../controllers/servicesController');
const miscCtrl = require('../controllers/miscController');

// Auth
router.post('/auth/signup', authLimiter, authCtrl.signup);
router.post('/auth/login', authLimiter, authCtrl.login);
router.post('/auth/forgot-password', authLimiter, authCtrl.forgotPassword);
router.post('/auth/verify-otp', authLimiter, authCtrl.verifyOtp);

// Profile
router.use(authenticateUser);
router.get('/profile', profileCtrl.getProfile);
router.put('/profile', profileCtrl.updateProfile);
router.get('/wallet/balance', profileCtrl.getWalletBalance);
router.post('/wallet/fund', profileCtrl.fundWallet);

// Services
router.post('/services/airtime', servicesCtrl.purchaseService('airtime'));
router.post('/services/data', servicesCtrl.purchaseService('data'));
router.post('/services/cable', servicesCtrl.purchaseService('cable'));
router.post('/services/electricity', servicesCtrl.purchaseService('electricity'));
router.post('/services/airtime-to-cash', servicesCtrl.airtimeToCash);

// Misc
router.get('/transactions/history', miscCtrl.getTransactions);
router.post('/kyc/submit', miscCtrl.submitKYC);
router.get('/referrals/my-history', miscCtrl.getReferrals);
router.get('/notifications', miscCtrl.getNotifications);

module.exports = router;
`,
  'routes/adminRoutes.js': `
const express = require('express');
const router = express.Router();
const { authLimiter } = require('../middleware/rateLimit');
const { authenticateAdmin, requireRole } = require('../middleware/auth');
const authCtrl = require('../controllers/admin/authController');
const dashboardCtrl = require('../controllers/admin/dashboardController');
const usersCtrl = require('../controllers/admin/usersController');
const miscCtrl = require('../controllers/admin/miscController');

// Auth
router.post('/auth/login', authLimiter, authCtrl.login);

router.use(authenticateAdmin);

// Dashboard
router.get('/dashboard/stats', dashboardCtrl.getStats);
router.get('/analytics/pnl', requireRole(['Super Admin', 'Finance']), dashboardCtrl.getPnl);

// Users
router.get('/users', usersCtrl.getUsers);
router.get('/users/:id', usersCtrl.getUser);
router.post('/users/:id/credit', requireRole(['Super Admin', 'Finance']), usersCtrl.creditUser);
router.post('/users/:id/debit', requireRole(['Super Admin', 'Finance']), usersCtrl.debitUser);

// Misc (Transactions, Providers, Pricing, Settings)
router.get('/transactions', miscCtrl.getTransactions);
router.get('/providers', miscCtrl.getProviders);
router.get('/pricing', miscCtrl.getPricing);
router.get('/settings', miscCtrl.getSettings);

module.exports = router;
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filename), content.trim());
}
console.log('Controllers and routes scaffolded successfully');
