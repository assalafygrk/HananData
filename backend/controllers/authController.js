const User = require('../models/User');
const ReferralHistory = require('../models/ReferralHistory');
const ReferralConfig = require('../models/ReferralConfig');
const { generateToken, sendResponse } = require('../utils/helpers');
const bcrypt = require('bcryptjs');

const sanitizeIdentifier = (id) => {
  if (!id) return '';
  const trimmed = id.trim();
  return trimmed.includes('@') ? trimmed.toLowerCase() : trimmed.replace(/[^\d+]/g, '');
};

exports.signup = async (req, res, next) => {
  try {
    let { name, email, phone, password, referralCode } = req.body;
    email = sanitizeIdentifier(email);
    phone = sanitizeIdentifier(phone);

    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) return sendResponse(res, 400, false, 'User already exists');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Generate a simple referral code for the new user
    const newReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const user = await User.create({ name, email, phone, passwordHash, referralCode: newReferralCode });

    // Handle referral tracking
    if (referralCode) {
      const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
      if (referrer) {
        let config = await ReferralConfig.findOne();
        const bonusAmount = config ? config.bonusAmount : 500;
        await ReferralHistory.create({
          referrerId: referrer._id,
          referredUserId: user._id,
          bonusPaid: bonusAmount,
          status: 'pending' // Paid after first funding
        });
      }
    }

    const token = generateToken(user._id);

    return sendResponse(res, 201, true, { _id: user._id, name: user.name, email: user.email, phone: user.phone, token });
  } catch (error) { next(error); }
};

exports.checkUser = async (req, res, next) => {
  try {
    const identifier = sanitizeIdentifier(req.body.identifier);
    if (!identifier) return sendResponse(res, 400, false, 'Identifier required');
    const userExists = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    return sendResponse(res, 200, true, { exists: !!userExists });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const identifier = sanitizeIdentifier(req.body.identifier);
    const { password } = req.body;
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
    const identifier = sanitizeIdentifier(req.body.identifier);
    // TODO: implement real OTP sending
    return sendResponse(res, 200, true, { message: 'OTP sent successfully (mocked)' });
  } catch (error) { next(error); }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const identifier = sanitizeIdentifier(req.body.identifier);
    const { otp, newPassword } = req.body;
    // TODO: implement real OTP verification
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user) return sendResponse(res, 404, false, 'User not found');
    
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    return sendResponse(res, 200, true, { message: 'Password reset successful' });
  } catch (error) { next(error); }
};