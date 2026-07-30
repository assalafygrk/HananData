const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['airtime', 'data', 'cable', 'electricity', 'airtime-to-cash', 'wallet-funding'], required: true },
  network: { type: String },
  amount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
  refId: { type: String, required: true, unique: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  resolvedNote: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
