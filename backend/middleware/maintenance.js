const PlatformSettings = require('../models/PlatformSettings');
const { sendResponse } = require('../utils/helpers');

const checkMaintenanceMode = async (req, res, next) => {
  try {
    const settings = await PlatformSettings.findOne();
    if (settings && settings.maintenanceMode) {
      return sendResponse(res, 503, false, 'Platform is currently undergoing maintenance. Please try again later.');
    }
    next();
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    next();
  }
};

module.exports = { checkMaintenanceMode };
