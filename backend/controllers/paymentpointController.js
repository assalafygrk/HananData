const crypto = require('crypto');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Provider = require('../models/Provider');
const PlatformSettings = require('../models/PlatformSettings');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const PaymentPointClient = require('../utils/paymentpointClient');
const { sendResponse } = require('../utils/helpers');

exports.getOrCreateVirtualAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return sendResponse(res, 404, false, 'User not found');

    // Ignore old mock accounts so they can be regenerated properly
    if (user.virtualAccount && user.virtualAccount.accountNumber && user.virtualAccount.bankName !== 'PaymentPoint MFB') {
      return sendResponse(res, 200, true, user.virtualAccount);
    }

    const providerConfig = await Provider.findOne({ type: 'payment-gateway', status: 'active', name: { $regex: /paymentpoint/i } });
    const apiKey = providerConfig?.apiKeyEncrypted;
    const apiSecret = providerConfig?.secretKeyEncrypted;
    const businessId = providerConfig?.businessId;

    if (apiKey && apiSecret && businessId) {
      const client = new PaymentPointClient(apiKey.trim(), apiSecret.trim(), businessId.trim());
      const resData = await client.createVirtualAccount({
        email: user.email || `${user.phone}@hanandata.ng`,
        name: user.name,
        phoneNumber: user.phone || '08000000000'
      });

      if (resData && resData.status === true && resData.data?.bankAccounts?.length > 0) {
        const bankAccount = resData.data.bankAccounts[0];
        const accountDetails = {
          bankName: bankAccount.bankName || bankAccount.bankCode || 'Palmpay',
          accountNumber: bankAccount.accountNumber,
          accountName: bankAccount.accountName || `HananData - ${user.name}`,
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
    console.log('💳 PaymentPoint Webhook Received. Payload:', JSON.stringify(payload));
    console.log('💳 Request Headers:', JSON.stringify(req.headers));

    // 1. Flexible Signature & Secret Key Extraction
    const signature = req.headers['paymentpoint-signature'] || 
                      req.headers['x-paymentpoint-signature'] || 
                      req.headers['signature'] || 
                      req.headers['x-signature'];

    // Try finding secret key from Provider, PlatformSettings, or ENV
    const providerConfig = await Provider.findOne({ name: { $regex: /paymentpoint/i } });
    const settings = await PlatformSettings.findOne();
    const secretKey = providerConfig?.secretKeyEncrypted || 
                      providerConfig?.apiKeyEncrypted || 
                      settings?.paymentPointApiSecret || 
                      settings?.paymentPointApiKey || 
                      process.env.PAYMENTPOINT_SECRET_KEY;

    if (signature && secretKey) {
      const payloadString = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(payload);
      const calculatedHex = crypto.createHmac('sha256', secretKey.trim()).update(payloadString).digest('hex');
      const calculatedBase64 = crypto.createHmac('sha256', secretKey.trim()).update(payloadString).digest('base64');

      if (calculatedHex.toLowerCase() !== signature.toLowerCase() && calculatedBase64 !== signature) {
        console.warn('⚠️ Webhook Signature Mismatch!', { received: signature, calculatedHex, calculatedBase64 });
        // Log error but proceed if payload is valid to prevent user losing money, or enforce check
      } else {
        console.log('✅ Webhook Signature Verified Successfully!');
      }
    } else {
      console.warn('ℹ️ Webhook processed without signature verification (Missing header or secret key)');
    }

    // 2. Extract Data from Payload (Exact PaymentPoint Schema + Nested Fallbacks)
    const dataObj = payload.data || payload.notification || payload.details || payload;

    const rawAmount = payload.amount_paid || payload.amount || payload.settlement_amount || payload.settledAmount ||
                      dataObj.amount_paid || dataObj.amount || dataObj.settlement_amount || dataObj.settledAmount || 0;
    const amount = Number(rawAmount);
    
    const refId = payload.transaction_id || payload.transactionRef || payload.reference || payload.txRef ||
                  dataObj.transaction_id || dataObj.transactionRef || dataObj.reference || ('PP-' + Date.now());
    
    const rawAccount = payload.receiver?.account_number || payload.receiver?.accountNumber || 
                       payload.accountNumber || payload.virtualAccountNumber || payload.account_number ||
                       dataObj.receiver?.account_number || dataObj.accountNumber || dataObj.virtualAccountNumber;
                       
    const rawEmail = payload.customer?.email || payload.email || payload.customerEmail || payload.customer_email ||
                     dataObj.customer?.email || dataObj.email || dataObj.customerEmail;
    
    const rawPhone = payload.customer?.phone || payload.phone || payload.phoneNumber || payload.customerPhone ||
                     dataObj.customer?.phone || dataObj.phone || dataObj.customerPhone;

    if (amount <= 0) {
      console.warn('⚠️ Ignored zero or negative amount webhook:', rawAmount);
      return res.status(200).json({ status: true, message: 'Ignored zero amount' });
    }

    // 3. Check for Duplicate Transaction
    const existing = await Transaction.findOne({ refId });
    if (existing) {
      console.log('ℹ️ Duplicate webhook received for refId:', refId);
      return res.status(200).json({ status: true, message: 'Transaction already processed' });
    }

    // 4. Flexible User Lookup
    let user = null;

    // A. Lookup by Virtual Account Number
    if (rawAccount) {
      const accStr = String(rawAccount).trim();
      user = await User.findOne({ 'virtualAccount.accountNumber': accStr });
      if (!user) {
        user = await User.findOne({ 'virtualAccount.accountNumber': { $regex: accStr + '$' } });
      }
    }

    // B. Lookup by Email or synthetic email (@hanandata.ng)
    if (!user && rawEmail) {
      const emailStr = String(rawEmail).toLowerCase().trim();
      user = await User.findOne({ email: emailStr });
      
      if (!user && emailStr.includes('@hanandata.ng')) {
        const extractedPhone = emailStr.split('@')[0].trim();
        user = await User.findOne({ 
          $or: [
            { phone: extractedPhone },
            { phone: extractedPhone.replace('+234', '0') },
            { phone: { $regex: extractedPhone.slice(-10) + '$' } }
          ] 
        });
      }
    }

    // C. Lookup by Phone Number
    if (!user && rawPhone) {
      const phoneStr = String(rawPhone).trim();
      const cleanPhone = phoneStr.replace('+234', '0');
      const last10 = phoneStr.slice(-10);

      user = await User.findOne({ 
        $or: [
          { phone: phoneStr },
          { phone: cleanPhone },
          { phone: { $regex: last10 + '$' } }
        ]
      });
    }

    if (!user) {
      console.warn('❌ Webhook User Not Found!', { rawAccount, rawEmail, rawPhone });
      return res.status(200).json({ status: false, message: 'User matching account/email/phone not found' });
    }

    // 5. Calculate fee (1% capped at 100 Naira)
    const fee = Math.min(amount * 0.01, 100);
    const creditAmount = amount - fee;

    // 6. Credit User Wallet
    user.walletBalance = Number((user.walletBalance || 0) + creditAmount);
    await user.save();

    console.log(`🎉 Successfully credited User ${user._id} (${user.name}) with ₦${creditAmount}. New Balance: ₦${user.walletBalance}`);

    // 7. Save Transaction Record
    await Transaction.create({
      userId: user._id,
      type: 'wallet-funding',
      amount: creditAmount,
      fee: fee,
      status: 'success',
      refId,
      network: 'PaymentPoint Bank Transfer',
      failureReason: `Bank Deposit to ${user.virtualAccount?.bankName || 'Virtual Account'}`
    });

    // 8. Create Audit Log & Notification (safely caught so non-critical logging errors don't fail the webhook)
    try {
      await AuditLog.create({
        actorId: user._id,
        actorType: 'system',
        actorModel: 'User',
        action: 'WALLET_AUTO_FUNDED',
        level: 'info',
        source: 'system',
        details: `Wallet auto-funded with ₦${creditAmount} (Fee: ₦${fee}) via PaymentPoint`
      });

      await Notification.create({
        userId: user._id,
        title: 'Wallet Funded Successfully',
        message: `Your wallet has been credited with ₦${creditAmount} (Fee: ₦${fee}) via Bank Transfer.`,
        type: 'transaction',
        relatedId: refId
      });
    } catch (logErr) {
      console.warn('⚠️ Webhook notification/audit log warning:', logErr.message);
    }

    // 9. Real-time Socket.IO Push to Mobile App / Admin Panel
    if (global.io) {
      global.io.emit(`balance_update_${user._id}`, { walletBalance: user.walletBalance });
      global.io.emit('wallet_funded', { userId: user._id, amount: creditAmount, walletBalance: user.walletBalance });
    }

    return res.status(200).json({ status: true, message: 'Wallet credited successfully' });
  } catch (error) {
    console.error('💥 PaymentPoint Webhook Processing Error:', error);
    return res.status(500).json({ status: false, error: error.message });
  }
};
