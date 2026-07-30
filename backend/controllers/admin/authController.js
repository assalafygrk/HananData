const Admin = require('../../models/Admin');
const { generateToken, sendResponse } = require('../../utils/helpers');
const bcrypt = require('bcryptjs');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
      const token = generateToken(admin._id, true, admin.role);
      return sendResponse(res, 200, true, { _id: admin._id, name: admin.name, email: admin.email, role: admin.role, token });
    }
    return sendResponse(res, 401, false, 'Invalid credentials');
  } catch (error) { next(error); }
};