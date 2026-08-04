const User = require('../models/User');
const ReferralHistory = require('../models/ReferralHistory');
const ReferralConfig = require('../models/ReferralConfig');
const { generateToken, sendResponse } = require('../utils/helpers');
const bcrypt = require('bcryptjs');

const sanitizeIdentifier = (id) => {
  if (!id) return '';
  const trimmed = id.trim();
  if (trimmed.includes('@')) return trimmed.toLowerCase();

  let digits = trimmed.replace(/\D/g, '');
  if (digits.startsWith('234') && digits.length === 13) {
    digits = '0' + digits.substring(3);
  } else if (digits.length === 10 && !digits.startsWith('0')) {
    digits = '0' + digits;
  }
  return digits;
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
    const rawIdentifier = req.body.identifier.trim();
    const sanitized = sanitizeIdentifier(rawIdentifier);
    const { password } = req.body;
    
    // Look for raw input, sanitized input, or potential 13-digit if we append 234
    const altIdentifier = rawIdentifier.length === 10 ? `234${rawIdentifier}` : rawIdentifier;

    const user = await User.findOne({ 
      $or: [
        { email: sanitized }, 
        { phone: sanitized },
        { email: rawIdentifier },
        { phone: rawIdentifier },
        { phone: altIdentifier }
      ] 
    });
    
    const AuditLog = require('../models/AuditLog');

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const token = generateToken(user._id);
      
      await AuditLog.create({
        actorId: user._id,
        actorType: 'system',
        actorModel: 'User',
        action: 'USER_LOGIN_SUCCESS',
        level: 'info',
        source: 'mobile_app',
        details: `User ${rawIdentifier} logged in successfully`
      });

      return sendResponse(res, 200, true, { _id: user._id, name: user.name, email: user.email, phone: user.phone, walletBalance: user.walletBalance, token });
    }
    
    await AuditLog.create({
      actorId: user ? user._id : undefined,
      actorType: 'system',
      actorModel: 'User',
      action: 'USER_LOGIN_FAILED',
      level: 'warning',
      source: 'mobile_app',
      details: `Failed login attempt for identifier: ${rawIdentifier}`
    });

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