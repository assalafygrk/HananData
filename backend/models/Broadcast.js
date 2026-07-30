const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema({
  message: { type: String, required: true },
  targetSegment: { type: String, enum: ['all', 'active', 'suspended', 'tier0', 'tier1', 'tier2'], default: 'all' },
  scheduledAt: { type: Date },
  sentAt: { type: Date },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  status: { type: String, enum: ['pending', 'sent', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Broadcast', broadcastSchema);
