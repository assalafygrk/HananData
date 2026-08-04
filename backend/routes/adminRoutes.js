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
router.post('/auth/verify-password', requireRole(['Super Admin']), miscCtrl.verifyPassword);

// Dashboard
router.get('/dashboard/stats', dashboardCtrl.getStats);
router.get('/analytics/pnl', requireRole(['Super Admin', 'Finance']), dashboardCtrl.getPnl);

// Users
router.get('/users', usersCtrl.getUsers);
router.get('/users/:id', usersCtrl.getUser);
router.put('/users/:id/status', requireRole(['Super Admin', 'Support']), usersCtrl.toggleUserStatus);
router.post('/users/:id/credit', requireRole(['Super Admin', 'Finance']), usersCtrl.creditUser);
router.post('/users/:id/debit', requireRole(['Super Admin', 'Finance']), usersCtrl.debitUser);

// Misc (Transactions, Providers, Pricing, Settings)
router.get('/transactions', miscCtrl.getTransactions);
router.get('/transactions/:id', miscCtrl.getTransaction);
router.post('/transactions/:id/action', requireRole(['Super Admin', 'Support']), miscCtrl.actionTransaction);
router.get('/providers', miscCtrl.getProviders);
router.post('/providers', requireRole(['Super Admin']), miscCtrl.addProvider);
router.put('/providers/:id', requireRole(['Super Admin']), miscCtrl.updateProvider);
router.delete('/providers/:id', requireRole(['Super Admin']), miscCtrl.deleteProvider);
router.get('/pricing', miscCtrl.getPricing);
router.post('/pricing', requireRole(['Super Admin']), miscCtrl.createPricing);
router.post('/pricing/sync', requireRole(['Super Admin']), miscCtrl.syncPricing);
router.put('/pricing/:id', requireRole(['Super Admin']), miscCtrl.updatePricing);
router.get('/settings', miscCtrl.getSettings);
router.put('/settings', requireRole(['Super Admin']), miscCtrl.updateSettings);

router.get('/search', requireRole(['Super Admin']), miscCtrl.globalSearch);

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