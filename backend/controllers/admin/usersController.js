const User = require('../../models/User');
const Admin = require('../../models/Admin');
const AuditLog = require('../../models/AuditLog');
const PlatformSettings = require('../../models/PlatformSettings');
const bcrypt = require('bcryptjs');
const { sendResponse } = require('../../utils/helpers');
const Transaction = require('../../models/Transaction');
const crypto = require('crypto');

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
    const { amount, note, adminPassword } = req.body;
    if (!adminPassword) return sendResponse(res, 400, false, 'Admin password is required');

    const admin = await Admin.findById(req.admin._id);
    const isMatch = await bcrypt.compare(adminPassword, admin.passwordHash);
    if (!isMatch) return sendResponse(res, 401, false, 'Invalid admin password');

    const settings = await PlatformSettings.findOne();
    if (!settings || settings.poolBalance < amount) {
      return sendResponse(res, 400, false, 'Insufficient pool balance to credit user');
    }

    const user = await User.findById(req.params.id);
    user.walletBalance += amount;
    await user.save();

    settings.poolBalance -= amount;
    await settings.save();

    await AuditLog.create({ actorId: req.admin._id, actorModel: 'Admin', actorType: 'admin', action: 'credit_user', targetType: 'User', targetId: user._id, note, details: `Credited user ${user.email} with ₦${amount}` });
    
    await Transaction.create({
      userId: user._id,
      type: 'admin-credit',
      network: 'Admin Funding',
      amount: amount,
      status: 'success',
      refId: 'HND' + crypto.randomBytes(4).toString('hex').toUpperCase(),
      resolvedBy: req.admin._id,
      resolvedNote: note || 'Admin Credit'
    });
    
    return sendResponse(res, 200, true, user);
  } catch (error) { next(error); }
};

exports.debitUser = async (req, res, next) => {
  try {
    const { amount, note, adminPassword } = req.body;
    if (!adminPassword) return sendResponse(res, 400, false, 'Admin password is required');

    const admin = await Admin.findById(req.admin._id);
    const isMatch = await bcrypt.compare(adminPassword, admin.passwordHash);
    if (!isMatch) return sendResponse(res, 401, false, 'Invalid admin password');

    const user = await User.findById(req.params.id);
    if (user.walletBalance < amount) return sendResponse(res, 400, false, 'Insufficient balance');
    
    user.walletBalance -= amount;
    await user.save();

    // Optionally add the debited amount back to the pool
    const settings = await PlatformSettings.findOne();
    if (settings) {
      settings.poolBalance += amount;
      await settings.save();
    }

    await AuditLog.create({ actorId: req.admin._id, actorModel: 'Admin', actorType: 'admin', action: 'debit_user', targetType: 'User', targetId: user._id, note, details: `Debited user ${user.email} with ₦${amount}` });
    
    await Transaction.create({
      userId: user._id,
      type: 'admin-debit',
      network: 'Admin Deduction',
      amount: amount,
      status: 'success',
      refId: 'HND' + crypto.randomBytes(4).toString('hex').toUpperCase(),
      resolvedBy: req.admin._id,
      resolvedNote: note || 'Admin Debit'
    });
    
    return sendResponse(res, 200, true, user);
  } catch (error) { next(error); }
};