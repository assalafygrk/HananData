const Transaction = require('../models/Transaction');
const KYCSubmission = require('../models/KYCSubmission');
const Broadcast = require('../models/Broadcast');
const ReferralHistory = require('../models/ReferralHistory');
const PlatformSettings = require('../models/PlatformSettings');
const { sendResponse } = require('../utils/helpers');

exports.getPublicSettings = async (req, res, next) => {
  try {
    const settings = await PlatformSettings.findOne();
    if (!settings) return sendResponse(res, 200, true, {});
    return sendResponse(res, 200, true, {
      supportPhone: settings.supportPhone,
      supportEmail: settings.supportEmail,
      whatsapp: settings.whatsapp,
      apkDownloadUrl: settings.apkDownloadUrl
    });
  } catch (error) { next(error); }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    return sendResponse(res, 200, true, transactions);
  } catch (error) { next(error); }
};

exports.submitKYC = async (req, res, next) => {
  try {
    const { type, documentUrl } = req.body;
    const kyc = await KYCSubmission.create({ userId: req.user._id, type, documentUrl });
    return sendResponse(res, 201, true, kyc);
  } catch (error) { next(error); }
};

exports.getReferrals = async (req, res, next) => {
  try {
    const history = await ReferralHistory.find({ referrerId: req.user._id }).populate('referredUserId', 'name');
    return sendResponse(res, 200, true, history);
  } catch (error) { next(error); }
};

const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
  try {
    const user = await require('../models/User').findById(req.user._id);
    const readBroadcasts = user.readBroadcasts || [];

    const broadcasts = await Broadcast.find({ status: 'sent' }).sort({ sentAt: -1 }).limit(20);
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20);
    
    // Convert to plain objects to inject 'read' safely
    const broadcastList = broadcasts.map(b => ({
      ...b.toObject(),
      read: readBroadcasts.some(id => id.toString() === b._id.toString())
    }));

    // Merge and sort both
    const combined = [...broadcastList, ...notifications].sort((a, b) => {
      const dateA = new Date(a.sentAt || a.createdAt);
      const dateB = new Date(b.sentAt || b.createdAt);
      return dateB - dateA;
    }).slice(0, 30); // limit total to 30

    return sendResponse(res, 200, true, combined);
  } catch (error) { next(error); }
};

exports.markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Try to update standard notification
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    
    if (notification) {
      return sendResponse(res, 200, true, notification);
    }
    
    // If not found, it might be a broadcast
    const broadcast = await Broadcast.findById(id);
    if (broadcast) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { readBroadcasts: broadcast._id }
      });
      return sendResponse(res, 200, true, { ...broadcast.toObject(), read: true });
    }

    return sendResponse(res, 404, false, null, 'Notification not found');
  } catch (error) { next(error); }
};