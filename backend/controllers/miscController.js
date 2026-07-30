const Transaction = require('../models/Transaction');
const KYCSubmission = require('../models/KYCSubmission');
const Broadcast = require('../models/Broadcast');
const ReferralHistory = require('../models/ReferralHistory');
const { sendResponse } = require('../utils/helpers');

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

exports.getNotifications = async (req, res, next) => {
  try {
    const broadcasts = await Broadcast.find({ status: 'sent' }).sort({ sentAt: -1 }).limit(20);
    return sendResponse(res, 200, true, broadcasts);
  } catch (error) { next(error); }
};