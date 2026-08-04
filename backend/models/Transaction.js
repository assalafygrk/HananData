const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['airtime', 'data', 'cable', 'electricity', 'airtime-to-cash', 'exam-pin', 'wallet-funding', 'admin-credit', 'admin-debit'], required: true },
  network: { type: String },
  amount: { type: Number, required: true },
  apiCost: { type: Number, default: 0 },
  profit: { type: Number, default: 0 },
  fee: { type: Number, default: 0 },
  status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
  refId: { type: String, required: true, unique: true },
  failureReason: { type: String },
  token: { type: String },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  resolvedNote: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
