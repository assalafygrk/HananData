const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/helpers');
const Admin = require('../models/Admin');
const User = require('../models/User');

const authenticateAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
      
      const admin = await Admin.findById(decoded.id).select('-passwordHash');
      if (!admin) {
        return sendResponse(res, 401, false, 'Not authorized, admin not found');
      }

      req.admin = admin;
      next();
    } catch (error) {
      console.error(error);
      return sendResponse(res, 401, false, 'Not authorized, token failed');
    }
  }

  if (!token) {
    return sendResponse(res, 401, false, 'Not authorized, no token');
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return sendResponse(res, 403, false, 'Forbidden, insufficient permissions');
    }
    next();
  };
};

const authenticateUser = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (!user) {
        return sendResponse(res, 401, false, 'Not authorized, user not found');
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return sendResponse(res, 401, false, 'Not authorized, token failed');
    }
  }

  if (!token) {
    return sendResponse(res, 401, false, 'Not authorized, no token');
  }
};

module.exports = { authenticateAdmin, requireRole, authenticateUser };
