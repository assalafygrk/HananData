const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const bcrypt = require('bcryptjs');
const { sendResponse } = require('../utils/helpers');

const PlatformSettings = require('../models/PlatformSettings');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash -transactionPinHash');
    const settings = await PlatformSettings.findOne() || {};
    return sendResponse(res, 200, true, { ...user.toObject(), settings });
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

exports.setTransactionPin = async (req, res, next) => {
  try {
    const { pin, newPin, oldPin } = req.body;
    const targetPin = newPin || pin;

    // Validate PIN: must be exactly 4 digits
    if (!targetPin || !/^\d{4}$/.test(targetPin.toString())) {
      return sendResponse(res, 400, false, 'Transaction PIN must be exactly 4 digits.');
    }

    const user = await User.findById(req.user._id);

    // If PIN is already set, require and verify oldPin
    if (user.transactionPinHash) {
      if (!oldPin) {
        return sendResponse(res, 400, false, 'Old PIN is required to change your transaction PIN.');
      }
      const isMatch = await bcrypt.compare(oldPin.toString(), user.transactionPinHash);
      if (!isMatch) {
        return sendResponse(res, 401, false, 'Current transaction PIN is incorrect.');
      }
    }

    // Hash the new PIN before saving — never store raw PINs
    const salt = await bcrypt.genSalt(10);
    user.transactionPinHash = await bcrypt.hash(targetPin.toString(), salt);
    await user.save();

    await AuditLog.create({
      actorId: user._id,
      actorType: 'system',
      actorModel: 'User',
      action: 'SET_TRANSACTION_PIN',
      level: 'info',
      source: 'mobile_app',
      details: 'Transaction PIN updated'
    });

    return sendResponse(res, 200, true, { message: 'Transaction PIN updated successfully.' });
  } catch (error) { next(error); }
};