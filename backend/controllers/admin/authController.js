const Admin = require('../../models/Admin');
const { generateToken, sendResponse } = require('../../utils/helpers');
const bcrypt = require('bcryptjs');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    const AuditLog = require('../../models/AuditLog');
    
    if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
      if (admin.twoFactorEnabled) {
        return sendResponse(res, 200, true, { requires2FA: true, adminId: admin._id });
      }

      const token = generateToken(admin._id, true, admin.role);
      await AuditLog.create({
        actorId: admin._id,
        actorType: 'admin',
        actorModel: 'Admin',
        action: 'ADMIN_LOGIN_SUCCESS',
        level: 'info',
        source: 'admin_panel',
        details: `Admin ${email} logged in successfully`
      });
      return sendResponse(res, 200, true, { _id: admin._id, name: admin.name, email: admin.email, role: admin.role, twoFactorEnabled: admin.twoFactorEnabled, token });
    }
    
    await AuditLog.create({
      actorId: admin ? admin._id : undefined,
      actorType: 'system',
      actorModel: 'Admin',
      action: 'ADMIN_LOGIN_FAILED',
      level: 'warning',
      source: 'admin_panel',
      details: `Failed admin login attempt for email: ${email}`
    });
    
    return sendResponse(res, 401, false, 'Invalid credentials');
  } catch (error) { next(error); }
};

const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

exports.verify2FA = async (req, res, next) => {
  try {
    const { adminId, code } = req.body;
    const admin = await Admin.findById(adminId);
    if (!admin) return sendResponse(res, 404, false, 'Admin not found');

    const cleanCode = String(code).trim().replace(/\s/g, '');
    const verified = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: 'base32',
      token: cleanCode,
      window: 2 // Allow slight time drift
    });

    if (verified) {
      const token = generateToken(admin._id, true, admin.role);
      const AuditLog = require('../../models/AuditLog');
      await AuditLog.create({
        actorId: admin._id,
        actorType: 'admin',
        actorModel: 'Admin',
        action: 'ADMIN_LOGIN_SUCCESS_2FA',
        level: 'info',
        source: 'admin_panel',
        details: `Admin ${admin.email} logged in successfully with 2FA`
      });
      return sendResponse(res, 200, true, { _id: admin._id, name: admin.name, email: admin.email, role: admin.role, twoFactorEnabled: admin.twoFactorEnabled, token });
    } else {
      return sendResponse(res, 400, false, 'Invalid 2FA code');
    }
  } catch (error) { next(error); }
};

exports.setup2FA = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    const secret = speakeasy.generateSecret({ name: `HananData Admin (${admin.email})` });
    
    // Temporarily save secret until verified
    admin.twoFactorSecret = secret.base32;
    await admin.save();

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) return sendResponse(res, 500, false, 'Failed to generate QR code');
      return sendResponse(res, 200, true, { secret: secret.base32, qrCode: data_url });
    });
  } catch (error) { next(error); }
};

exports.enable2FA = async (req, res, next) => {
  try {
    const { code } = req.body;
    const admin = await Admin.findById(req.admin._id);

    const cleanCode = String(code).trim().replace(/\s/g, '');
    const verified = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: 'base32',
      token: cleanCode,
      window: 2
    });

    if (verified) {
      admin.twoFactorEnabled = true;
      await admin.save();
      return sendResponse(res, 200, true, { message: '2FA enabled successfully' });
    } else {
      return sendResponse(res, 400, false, 'Invalid 2FA code');
    }
  } catch (error) { next(error); }
};

exports.disable2FA = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    admin.twoFactorEnabled = false;
    admin.twoFactorSecret = undefined;
    await admin.save();
    return sendResponse(res, 200, true, { message: '2FA disabled successfully' });
  } catch (error) { next(error); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) return sendResponse(res, 401, false, 'Incorrect current password');

    const salt = await bcrypt.genSalt(10);
    admin.passwordHash = await bcrypt.hash(newPassword, salt);
    await admin.save();

    return sendResponse(res, 200, true, { message: 'Password changed successfully' });
  } catch (error) { next(error); }
};