const UpcomingService = require('../../models/UpcomingService');
const { sendResponse } = require('../../utils/helpers');

exports.getUpcomingServicesAdmin = async (req, res, next) => {
  try {
    const services = await UpcomingService.find()
      .populate('subscribers.userId', 'name email phone kycTier')
      .sort({ order: 1, createdAt: -1 });
    return sendResponse(res, 200, true, services);
  } catch (error) { next(error); }
};

exports.createUpcomingService = async (req, res, next) => {
  try {
    const { title, description, icon, category, status, progress, expectedDate, isPublished } = req.body;
    if (!title || !description) {
      return sendResponse(res, 400, false, 'Title and description are required.');
    }
    const service = await UpcomingService.create({
      title,
      description,
      icon: icon || 'auto_awesome',
      category: category || 'General',
      status: status || 'in_development',
      progress: progress !== undefined ? Number(progress) : 50,
      expectedDate: expectedDate || 'Q3 2026',
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true
    });
    return sendResponse(res, 201, true, service);
  } catch (error) { next(error); }
};

exports.updateUpcomingService = async (req, res, next) => {
  try {
    const service = await UpcomingService.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('subscribers.userId', 'name email phone kycTier');
    if (!service) return sendResponse(res, 404, false, 'Upcoming service not found.');
    return sendResponse(res, 200, true, service);
  } catch (error) { next(error); }
};

exports.deleteUpcomingService = async (req, res, next) => {
  try {
    const service = await UpcomingService.findByIdAndDelete(req.params.id);
    if (!service) return sendResponse(res, 404, false, 'Upcoming service not found.');
    return sendResponse(res, 200, true, { message: 'Service deleted successfully.' });
  } catch (error) { next(error); }
};
