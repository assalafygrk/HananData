const { sendResponse } = require('../utils/helpers');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: error.errors
    });
  }
};

module.exports = { validate };
