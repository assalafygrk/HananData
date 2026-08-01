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
router.get('/transactions/:id', miscCtrl.getTransaction);
router.post('/transactions/:id/action', requireRole(['Super Admin', 'Support']), miscCtrl.actionTransaction);
router.get('/providers', miscCtrl.getProviders);
router.post('/providers', requireRole(['Super Admin']), miscCtrl.addProvider);
router.put('/providers/:id', requireRole(['Super Admin']), miscCtrl.updateProvider);
router.get('/pricing', miscCtrl.getPricing);
router.post('/pricing', requireRole(['Super Admin']), miscCtrl.createPricing);
router.put('/pricing/:id', requireRole(['Super Admin']), miscCtrl.updatePricing);
router.get('/settings', miscCtrl.getSettings);
router.put('/settings', requireRole(['Super Admin']), miscCtrl.updateSettings);

// Logs
router.get('/logs', requireRole(['Super Admin']), miscCtrl.getLogs);

// Roles
router.get('/roles', requireRole(['Super Admin']), miscCtrl.getRoles);
router.post('/roles', requireRole(['Super Admin']), miscCtrl.addRole);

// Referrals
router.get('/referrals', requireRole(['Super Admin', 'Marketing']), miscCtrl.getReferrals);

// Broadcasts
router.get('/broadcasts', requireRole(['Super Admin', 'Marketing']), miscCtrl.getBroadcasts);
router.post('/broadcasts', requireRole(['Super Admin', 'Marketing']), miscCtrl.sendBroadcast);

module.exports = router;