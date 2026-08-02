const Admin = require('../../models/Admin');
const { generateToken, sendResponse } = require('../../utils/helpers');
const bcrypt = require('bcryptjs');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    const AuditLog = require('../../models/AuditLog');
    
    if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
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
      return sendResponse(res, 200, true, { _id: admin._id, name: admin.name, email: admin.email, role: admin.role, token });
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