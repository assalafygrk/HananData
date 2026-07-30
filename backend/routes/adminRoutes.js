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