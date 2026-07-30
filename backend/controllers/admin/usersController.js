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