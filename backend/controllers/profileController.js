const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { sendResponse } = require('../utils/helpers');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    return sendResponse(res, 200, true, user);
  } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, pushNotifs, emailNotifs, smsNotifs } = req.body;
    const user = await User.findById(req.user._id);
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (pushNotifs !== undefined) user.pushNotifs = pushNotifs;
    if (emailNotifs !== undefined) user.emailNotifs = emailNotifs;
    if (smsNotifs !== undefined) user.smsNotifs = smsNotifs;
    await user.save();

    await AuditLog.create({
      actorId: user._id,
      actorType: 'system',
      actorModel: 'User',
      action: 'UPDATE_PROFILE',
      level: 'info',
      source: 'mobile_app',
      details: `Profile updated`
    });

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
    const user = await User.findById(req.user._id);

    await AuditLog.create({
      actorId: user._id,
      actorType: 'system',
      actorModel: 'User',
      action: 'FUND_WALLET_INITIATED',
      level: 'info',
      source: 'mobile_app',
      details: `Initiated wallet funding of ${amount}`
    });

    // TODO: replace with real Paystack/Monnify webhook initialization
    return sendResponse(res, 200, true, { message: 'Pending transaction created (mock)', amount });
  } catch (error) { next(error); }
};