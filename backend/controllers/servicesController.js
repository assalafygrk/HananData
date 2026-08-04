const Transaction = require('../models/Transaction');
const User = require('../models/User');
const PricingConfig = require('../models/PricingConfig');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const { sendResponse } = require('../utils/helpers');

const bcrypt = require('bcryptjs');

const Provider = require('../models/Provider');
const SubandgainClient = require('../utils/subandgainClient');

exports.purchaseService = (type) => async (req, res, next) => {
  try {
    const { network, amount, phone, planId, provider: serviceProvider, pin } = req.body;
    const user = await User.findById(req.user._id);

    const refId = 'TXN-' + Date.now() + Math.floor(Math.random() * 1000);

    const recordFailedTxn = async (reason) => {
      const txn = await Transaction.create({
        userId: user._id,
        type,
        network: network || serviceProvider,
        amount: amount || 0,
        refId,
        status: 'failed',
        failureReason: reason
      });
      await Notification.create({
        userId: user._id,
        title: 'Transaction Failed',
        message: `Your purchase of ${network || serviceProvider || ''} ${type} for ₦${amount || 0} failed. Reason: ${reason}`,
        type: 'transaction',
        relatedId: refId
      });
      return txn;
    };

    if (!user.transactionPinHash) {
      await recordFailedTxn('Transaction PIN not set');
      return sendResponse(res, 400, false, 'Please set a transaction PIN in your settings first.');
    }

    if (!pin) {
      await recordFailedTxn('Transaction PIN is required');
      return sendResponse(res, 400, false, 'Transaction PIN is required.');
    }

    const isMatch = await bcrypt.compare(pin.toString(), user.transactionPinHash);
    if (!isMatch) {
      await recordFailedTxn('Incorrect transaction PIN');
      return sendResponse(res, 401, false, 'Incorrect transaction PIN.');
    }

    // Load active VTU provider
    const vtuProvider = await Provider.findOne({ type: 'vtu', status: 'active' });
    if (!vtuProvider || !vtuProvider.apiKeyEncrypted || !vtuProvider.username) {
      await recordFailedTxn('VTU Provider not configured');
      return sendResponse(res, 500, false, 'VTU Provider not configured correctly.');
    }

    // Load pricing config to calculate exact amount to debit
    let pricingConfig = null;
    let amountToDebit = amount; // Base fallback

    if (type === 'data' || type === 'cable' || type === 'exam-pin') {
      pricingConfig = await PricingConfig.findOne({ category: type, planId: planId, providerId: vtuProvider._id });
    } else {
      pricingConfig = await PricingConfig.findOne({ category: type, network: network || serviceProvider, providerId: vtuProvider._id });
    }

    let actualApiCost = 0;
    if (pricingConfig) {
      if (type === 'data' || type === 'cable' || type === 'exam-pin') {
        amountToDebit = user.role === 'Vendor' ? pricingConfig.vendorPrice : pricingConfig.userPrice;
        actualApiCost = pricingConfig.apiCost;
      } else if (type === 'airtime') {
        const multiplier = user.role === 'Vendor' ? pricingConfig.vendorPrice : pricingConfig.userPrice;
        amountToDebit = Math.round(amount * multiplier);
        actualApiCost = Math.round(amount * pricingConfig.apiCost);
      } else if (type === 'electricity') {
        const fee = user.role === 'Vendor' ? pricingConfig.vendorPrice : pricingConfig.userPrice;
        amountToDebit = amount + fee;
        actualApiCost = amount;
      }
    } else if (type === 'data' || type === 'cable' || type === 'exam-pin') {
      await recordFailedTxn('Pricing configuration not found');
      return sendResponse(res, 400, false, 'Pricing configuration not found for this service plan.');
    }

    if (user.walletBalance < amountToDebit) {
      await recordFailedTxn('Insufficient balance');
      return sendResponse(res, 400, false, 'Insufficient balance');
    }

    const profit = amountToDebit - actualApiCost;

    const apiClient = new SubandgainClient(vtuProvider.username, vtuProvider.apiKeyEncrypted);

    // Create pending transaction
    const transaction = await Transaction.create({
      userId: user._id,
      type,
      network: network || serviceProvider,
      amount: amountToDebit,
      apiCost: actualApiCost,
      profit,
      refId,
      status: 'pending'
    });

    let apiResponse = null;

    if (type === 'airtime') {
      apiResponse = await apiClient.purchaseAirtime({ network, phoneNumber: phone, amount });
    } else if (type === 'data') {
      apiResponse = await apiClient.purchaseData({ network, dataPlan: planId, phoneNumber: phone });
    } else if (type === 'cable') {
      const verifyRes = await apiClient.verifyCable({ service: serviceProvider, smartNumber: phone });
      if (verifyRes.error || verifyRes.status !== 'success') {
        transaction.status = 'failed';
        transaction.failureReason = verifyRes.description || 'Invalid Customer';
        await transaction.save();
        return sendResponse(res, 400, false, verifyRes.description || 'Invalid Customer');
      }
      apiResponse = await apiClient.purchaseCable({ service: serviceProvider, bills_code: planId, smartNumber: phone });
    } else if (type === 'electricity') {
      const meterType = (planId || 'PRE').toUpperCase().includes('POST') ? 'POST' : 'PRE';
      const verifyRes = await apiClient.verifyElectricity({ service: serviceProvider, meterNumber: phone, meterType });
      if (verifyRes.error || !verifyRes.accessToken) {
        transaction.status = 'failed';
        transaction.failureReason = verifyRes.description || 'Invalid Meter Number';
        await transaction.save();
        return sendResponse(res, 400, false, verifyRes.description || 'Invalid Meter Number');
      }
      apiResponse = await apiClient.purchaseElectricity({ 
        service: serviceProvider, 
        meterNumber: phone, 
        meterType, 
        accessToken: verifyRes.accessToken, 
        amount 
      });
    } else if (type === 'exam-pin') {
      apiResponse = await apiClient.purchaseEducation({ eduType: planId });
    }

    const statusStr = (apiResponse.status || '').toLowerCase();
    
    if (statusStr === 'approved' || statusStr === 'success' || statusStr === 'pending') {
      transaction.status = statusStr === 'pending' ? 'pending' : 'success';
      if (apiResponse.token) {
        transaction.token = apiResponse.token;
      }
      await transaction.save();

      user.walletBalance -= amountToDebit;
      await user.save();
      
      await AuditLog.create({
        actorId: user._id,
        actorType: 'system',
        actorModel: 'User',
        action: 'PURCHASE_SERVICE_SUCCESS',
        level: 'info',
        source: 'mobile_app',
        details: `Purchased ${type} successfully for ${amount}`
      });

      await Notification.create({
        userId: user._id,
        title: 'Transaction Successful',
        message: `Your purchase of ${network || serviceProvider || ''} ${type} for ₦${amount} was successful.${apiResponse.token ? ' PIN: ' + apiResponse.token : ''}`,
        type: 'transaction',
        relatedId: transaction.refId
      });

      return sendResponse(res, 200, true, transaction);
    } else {
      const errorMsg = apiResponse.description || apiResponse.error || 'Transaction failed at provider';
      transaction.status = 'failed';
      transaction.failureReason = errorMsg;
      await transaction.save();

      await AuditLog.create({
        actorId: user._id,
        actorType: 'system',
        actorModel: 'User',
        action: 'PURCHASE_SERVICE_FAILED',
        level: 'error',
        source: 'mobile_app',
        details: `Failed to purchase ${type} for ${amount}: ${errorMsg}`
      });

      await Notification.create({
        userId: user._id,
        title: 'Transaction Failed',
        message: `Your purchase of ${network || serviceProvider || ''} ${type} for ₦${amount} failed. Reason: ${errorMsg}`,
        type: 'transaction',
        relatedId: transaction.refId
      });

      return sendResponse(res, 400, false, errorMsg);
    }
  } catch (error) { next(error); }
};

exports.verifyElectricityMeter = async (req, res, next) => {
  try {
    const { provider, meterNumber, meterType } = req.body;
    if (!provider || !meterNumber || !meterType) {
      return sendResponse(res, 400, false, 'Provider, meter number, and meter type are required.');
    }

    const vtuProvider = await Provider.findOne({ type: 'vtu', status: 'active' });
    if (!vtuProvider || !vtuProvider.apiKeyEncrypted || !vtuProvider.username) {
      return sendResponse(res, 500, false, 'VTU Provider not configured correctly.');
    }

    const apiClient = new SubandgainClient(vtuProvider.username, vtuProvider.apiKeyEncrypted);
    const verifyRes = await apiClient.verifyElectricity({ 
      service: provider, 
      meterNumber, 
      meterType 
    });

    if (verifyRes.error || !verifyRes.accessToken) {
      return sendResponse(res, 400, false, verifyRes.description || 'Invalid Meter Number');
    }

    return sendResponse(res, 200, true, {
      customerName: verifyRes.customerName,
      accessToken: verifyRes.accessToken
    });
  } catch (error) { next(error); }
};

exports.airtimeToCash = async (req, res, next) => {
  try {
    const { network, amount, phone, pin } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.transactionPinHash) {
      return sendResponse(res, 400, false, 'Please set a transaction PIN in your settings first.');
    }
    if (!pin) {
      return sendResponse(res, 400, false, 'Transaction PIN is required.');
    }
    const isMatch = await bcrypt.compare(pin.toString(), user.transactionPinHash);
    if (!isMatch) {
      return sendResponse(res, 401, false, 'Incorrect transaction PIN.');
    }

    const refId = 'ATC-' + Date.now() + Math.floor(Math.random() * 1000);
    const numAmount = Number(amount);
    const fee = Math.round(numAmount * 0.25);

    const transaction = await Transaction.create({
      userId: user._id,
      type: 'airtime-to-cash',
      network,
      amount: numAmount,
      fee,
      refId,
      status: 'pending',
      failureReason: `Airtime transfer from ${phone}`
    });

    await AuditLog.create({
      actorId: user._id,
      actorType: 'system',
      actorModel: 'User',
      action: 'AIRTIME_TO_CASH_INITIATED',
      level: 'info',
      source: 'mobile_app',
      details: `Airtime to cash initiated for ${network} ₦${amount} from ${phone}`
    });

    return sendResponse(res, 200, true, transaction);
  } catch (error) { next(error); }
};

exports.getPricing = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const pricing = await PricingConfig.find(filter);
    return sendResponse(res, 200, true, pricing);
  } catch (error) { next(error); }
};
exports.verifyCableSmartcard = async (req, res, next) => {
  try {
    const { provider, smartNumber } = req.body;
    if (!provider || !smartNumber) {
      return sendResponse(res, 400, false, 'Provider and smartcard number are required.');
    }

    const vtuProvider = await Provider.findOne({ type: 'vtu', status: 'active' });
    if (!vtuProvider || !vtuProvider.apiKeyEncrypted || !vtuProvider.username) {
      return sendResponse(res, 500, false, 'VTU Provider not configured correctly.');
    }

    const apiClient = new SubandgainClient(vtuProvider.username, vtuProvider.apiKeyEncrypted);
    const verifyRes = await apiClient.verifyCable({ service: provider, smartNumber });

    if (verifyRes.error || verifyRes.status !== 'success') {
      return sendResponse(res, 400, false, verifyRes.description || 'Invalid Smartcard Number');
    }

    return sendResponse(res, 200, true, {
      customerName: verifyRes.customerName,
      smartNumber: verifyRes.smartNumber
    });
  } catch (error) { next(error); }
};
