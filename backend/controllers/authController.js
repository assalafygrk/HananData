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

const SignupOTP = require('../models/SignupOTP');

exports.signupInit = async (req, res, next) => {
  try {
    let { name, email, phone, referralCode } = req.body;
    email = sanitizeIdentifier(email);
    phone = sanitizeIdentifier(phone);

    const PlatformSettings = require('../models/PlatformSettings');
    const settings = await PlatformSettings.findOne();
    if (settings && settings.disableRegistration) {
      return sendResponse(res, 403, false, 'New user registrations are temporarily disabled.');
    }

    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) return sendResponse(res, 400, false, 'User already exists');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    // Upsert the pending signup record
    await SignupOTP.findOneAndUpdate(
      { email },
      { name, email, phone, referralCode, otp: otpHash, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    const sendEmail = require('../utils/mailer');
    try {
      await sendEmail({
        email,
        subject: 'HananData - Email Verification OTP',
        message: `Welcome to HananData! Your email verification OTP is ${otp}. It expires in 24 hours.`
      });
    } catch (err) {
      console.error('Error sending OTP email:', err.message);
    }

    return sendResponse(res, 200, true, { message: 'OTP sent to email. Please verify.' });
  } catch (error) { next(error); }
};

exports.signupVerify = async (req, res, next) => {
  try {
    let { email, otp } = req.body;
    email = sanitizeIdentifier(email);

    const pendingUser = await SignupOTP.findOne({ email });
    if (!pendingUser) return sendResponse(res, 404, false, 'Signup request not found or expired.');

    const isMatch = await bcrypt.compare(otp.toString(), pendingUser.otp);
    if (!isMatch) return sendResponse(res, 400, false, 'Invalid OTP.');

    // We keep the record for the final step, but we can signal success to the client
    return sendResponse(res, 200, true, { message: 'OTP verified successfully. Please set your account PIN.' });
  } catch (error) { next(error); }
};

exports.signupComplete = async (req, res, next) => {
  try {
    let { email, pin } = req.body;
    email = sanitizeIdentifier(email);

    const pendingUser = await SignupOTP.findOne({ email });
    if (!pendingUser) return sendResponse(res, 404, false, 'Signup request not found or expired. Start over.');

    const userExists = await User.findOne({ $or: [{ email }, { phone: pendingUser.phone }] });
    if (userExists) return sendResponse(res, 400, false, 'User already exists');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(pin.toString(), salt);
    
    // Generate a simple referral code for the new user
    const newReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const user = await User.create({ 
      name: pendingUser.name, 
      email: pendingUser.email, 
      phone: pendingUser.phone, 
      passwordHash, 
      referralCode: newReferralCode 
    });

    // Handle referral tracking
    if (pendingUser.referralCode) {
      const referrer = await User.findOne({ referralCode: pendingUser.referralCode.toUpperCase() });
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

    // Auto-create virtual account immediately
    try {
      const Provider = require('../models/Provider');
      const PaymentPointClient = require('../utils/paymentpointClient');
      const providerConfig = await Provider.findOne({ type: 'payment-gateway', status: 'active', name: { $regex: /paymentpoint/i } });
      
      if (providerConfig && providerConfig.apiKeyEncrypted && providerConfig.secretKeyEncrypted && providerConfig.businessId) {
        const client = new PaymentPointClient(providerConfig.apiKeyEncrypted.trim(), providerConfig.secretKeyEncrypted.trim(), providerConfig.businessId.trim());
        const resData = await client.createVirtualAccount({
          email: user.email,
          name: user.name,
          phoneNumber: user.phone
        });

        if (resData && resData.status === true && resData.data?.bankAccounts?.length > 0) {
          const bankAccount = resData.data.bankAccounts[0];
          user.virtualAccount = {
            bankName: bankAccount.bankName || bankAccount.bankCode || 'Palmpay',
            accountNumber: bankAccount.accountNumber,
            accountName: bankAccount.accountName || `HananData - ${user.name}`,
            provider: 'PaymentPoint'
          };
          await user.save();
        }
      }
    } catch (err) {
      console.error('Auto-Virtual Account Creation Error:', err.message);
      // We don't fail the signup if VA creation fails, they can do it later
    }

    // Clean up pending signup record
    await SignupOTP.deleteOne({ _id: pendingUser._id });

    // We don't return token here, the app redirects to Login page as requested
    return sendResponse(res, 201, true, { message: 'Account created successfully. Please login.' });
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
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user) return sendResponse(res, 404, false, 'User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = await bcrypt.hash(otp, 10);
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const sendEmail = require('../utils/mailer');
    try {
      await sendEmail({
        email: user.email,
        subject: 'HananData - Password Reset OTP',
        message: `Your OTP to reset your account password is ${otp}. It expires in 10 minutes.`
      });
    } catch (err) {
      console.error('Error sending OTP email:', err.message);
    }

    return sendResponse(res, 200, true, { message: 'OTP sent successfully to your email.' });
  } catch (error) { next(error); }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const identifier = sanitizeIdentifier(req.body.identifier);
    const { otp, newPassword } = req.body;
    
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user) return sendResponse(res, 404, false, 'User not found');
    
    if (!user.resetOtp || !user.resetOtpExpires || user.resetOtpExpires < Date.now()) {
      return sendResponse(res, 400, false, 'OTP expired or not requested.');
    }

    const isMatch = await bcrypt.compare(otp.toString(), user.resetOtp);
    if (!isMatch) {
      return sendResponse(res, 400, false, 'Invalid OTP.');
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    return sendResponse(res, 200, true, { message: 'Password reset successful' });
  } catch (error) { next(error); }
};