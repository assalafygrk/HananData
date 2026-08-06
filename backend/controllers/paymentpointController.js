const User = require('../models/User');
const Transaction = require('../models/Transaction');
const PlatformSettings = require('../models/PlatformSettings');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const PaymentPointClient = require('../utils/paymentpointClient');
const { sendResponse } = require('../utils/helpers');

exports.getOrCreateVirtualAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return sendResponse(res, 404, false, 'User not found');

    if (user.virtualAccount && user.virtualAccount.accountNumber) {
      return sendResponse(res, 200, true, user.virtualAccount);
    }

    const settings = await PlatformSettings.findOne();
    const apiKey = settings?.paymentPointApiKey;
    const apiSecret = settings?.paymentPointApiSecret;
    const businessId = settings?.paymentPointBusinessId;

    if (apiKey && apiSecret && businessId) {
      const client = new PaymentPointClient(apiKey, apiSecret, businessId);
      const resData = await client.createVirtualAccount({
        email: user.email || `${user.phone}@hanandata.ng`,
        name: user.name,
        phoneNumber: user.phone || '08000000000'
      });

      if (resData && (resData.status === true || resData.bankCode || resData.accountNumber)) {
        const accountDetails = {
          bankName: resData.bankName || resData.bank || 'Palmpay / Wema Bank',
          accountNumber: resData.accountNumber || resData.account_number || resData.data?.accountNumber,
          accountName: resData.accountName || resData.account_name || `HananData - ${user.name}`,
          provider: 'PaymentPoint'
        };

        if (accountDetails.accountNumber) {
          user.virtualAccount = accountDetails;
          await user.save();
          return sendResponse(res, 200, true, user.virtualAccount);
        }
      }

      return sendResponse(res, 200, false, 'Failed to create virtual account. Please try again later.');
    }

    // Gateway not configured by admin yet
    return sendResponse(res, 200, false, 'Bank transfer is not available yet. Please check back later.');
  } catch (error) { next(error); }
};

exports.handleWebhook = async (req, res, next) => {
  try {
    const payload = req.body || {};
    console.log('💳 PaymentPoint Webhook Payload:', JSON.stringify(payload));

    const amount = Number(payload.amount || payload.settledAmount || payload.data?.amount || 0);
    const refId = payload.transactionRef || payload.reference || payload.data?.transactionRef || 'PP-' + Date.now();
    const accountNumber = payload.accountNumber || payload.virtualAccountNumber || payload.data?.accountNumber;
    const customerEmail = payload.email || payload.customerEmail || payload.data?.email;
    const customerPhone = payload.phone || payload.customerPhone || payload.data?.phone;

    if (amount <= 0) {
      return res.status(200).json({ status: true, message: 'Ignored zero amount' });
    }

    // Check duplicate
    const existing = await Transaction.findOne({ refId });
    if (existing) {
      return res.status(200).json({ status: true, message: 'Transaction already processed' });
    }

    // Find user by accountNumber or email or phone
    let user = null;
    if (accountNumber) {
      user = await User.findOne({ 'virtualAccount.accountNumber': accountNumber });
    }
    if (!user && customerEmail) {
      user = await User.findOne({ email: customerEmail });
    }
    if (!user && customerPhone) {
      user = await User.findOne({ phone: customerPhone });
    }

    if (!user) {
      console.warn('⚠️ Webhook received but matching user not found:', { accountNumber, customerEmail, customerPhone });
      return res.status(200).json({ status: true, message: 'User not found for account' });
    }

    // Credit user wallet
    user.walletBalance = (user.walletBalance || 0) + amount;
    await user.save();

    // Record transaction
    await Transaction.create({
      userId: user._id,
      type: 'wallet-funding',
      amount,
      status: 'success',
      refId,
      network: 'PaymentPoint Bank Transfer',
      failureReason: `Bank Deposit to ${user.virtualAccount?.bankName || 'Virtual Account'}`
    });

    await AuditLog.create({
      actorId: user._id,
      actorType: 'system',
      actorModel: 'User',
      action: 'WALLET_AUTO_FUNDED',
      level: 'info',
      source: 'paymentpoint_webhook',
      details: `Wallet auto-funded with ₦${amount} via PaymentPoint`
    });

    await Notification.create({
      userId: user._id,
      title: 'Wallet Funded Successfully',
      message: `Your wallet has been credited with ₦${amount} via Bank Transfer.`,
      type: 'transaction',
      relatedId: refId
    });

    return res.status(200).json({ status: true, message: 'Wallet credited successfully' });
  } catch (error) {
    console.error('PaymentPoint Webhook Error:', error.message);
    return res.status(500).json({ status: false, error: error.message });
  }
};
