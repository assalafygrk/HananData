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