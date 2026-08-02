const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  agent: { type: String, enum: ['bot', 'admin'], default: 'bot' },
  assignedAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
