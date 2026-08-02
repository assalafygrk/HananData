const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderModel: { type: String, enum: ['User', 'Admin', 'System'], required: true },
  text: { type: String, required: true },
  isBot: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
