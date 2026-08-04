const express = require('express');
const router = express.Router();
const { authLimiter } = require('../middleware/rateLimit');
const { authenticateUser } = require('../middleware/auth');
const authCtrl = require('../controllers/authController');
const profileCtrl = require('../controllers/profileController');
const servicesCtrl = require('../controllers/servicesController');
const miscCtrl = require('../controllers/miscController');
const chatCtrl = require('../controllers/chatController');
const { securityGuardrail } = require('../middleware/guardrail');

// Auth
router.post('/auth/check', authLimiter, authCtrl.checkUser);
router.post('/auth/signup', authLimiter, authCtrl.signup);
router.post('/auth/login', authLimiter, authCtrl.login);
router.post('/auth/forgot-password', authLimiter, authCtrl.forgotPassword);
router.post('/auth/verify-otp', authLimiter, authCtrl.verifyOtp);

// Profile
router.use(authenticateUser);
router.get('/profile', profileCtrl.getProfile);
router.put('/profile', profileCtrl.updateProfile);
router.post('/profile/pin', profileCtrl.setTransactionPin);
router.post('/profile/forgot-pin', profileCtrl.forgotPin);
router.post('/profile/verify-pin-otp', profileCtrl.verifyPinOtp);
router.get('/wallet/balance', profileCtrl.getWalletBalance);
router.post('/wallet/fund', profileCtrl.fundWallet);

// Services
router.post('/services/airtime', servicesCtrl.purchaseService('airtime'));
router.post('/services/data', servicesCtrl.purchaseService('data'));
router.post('/services/cable', servicesCtrl.purchaseService('cable'));
router.post('/services/verify-electricity', servicesCtrl.verifyElectricityMeter);
router.post('/services/verify-cable', servicesCtrl.verifyCableSmartcard);
router.post('/services/electricity', servicesCtrl.purchaseService('electricity'));
router.post('/services/exam-pin', servicesCtrl.purchaseService('exam-pin'));
router.post('/services/airtime-to-cash', servicesCtrl.airtimeToCash);
router.get('/services/pricing', servicesCtrl.getPricing);
router.get('/services/upcoming', servicesCtrl.getUpcomingServices);

// Misc
router.get('/transactions/history', miscCtrl.getTransactions);
router.post('/kyc/submit', miscCtrl.submitKYC);
router.get('/referrals/my-history', miscCtrl.getReferrals);
router.get('/notifications', miscCtrl.getNotifications);
router.post('/notifications/:id/read', miscCtrl.markNotificationRead);

// Chat
const rateLimit = require('express-rate-limit');
const chatLimiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 10, message: 'Too many messages sent. Please wait.' });
router.post('/chat/message', chatLimiter, securityGuardrail, chatCtrl.sendMessage);

module.exports = router;