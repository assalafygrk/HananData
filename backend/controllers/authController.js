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

exports.checkUser = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return sendResponse(res, 400, false, 'Identifier required');
    const userExists = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    return sendResponse(res, 200, true, { exists: !!userExists });
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