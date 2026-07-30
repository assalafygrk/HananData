const jwt = require('jsonwebtoken');

const generateToken = (id, isAdmin = false, role = null) => {
  const secret = isAdmin ? process.env.JWT_ADMIN_SECRET : process.env.JWT_SECRET;
  const payload = isAdmin ? { id, role } : { id };
  return jwt.sign(payload, secret, { expiresIn: '30d' });
};

const sendResponse = (res, statusCode, success, dataOrMessage) => {
  if (success) {
    return res.status(statusCode).json({
      success: true,
      data: dataOrMessage,
    });
  } else {
    return res.status(statusCode).json({
      success: false,
      message: dataOrMessage,
    });
  }
};

module.exports = {
  generateToken,
  sendResponse,
};
