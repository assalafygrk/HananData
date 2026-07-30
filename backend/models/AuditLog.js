const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  actorType: { type: String, enum: ['admin', 'system'], required: true },
  action: { type: String, required: true },
  targetType: { type: String },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  note: { type: String }
}, { timestamps: { createdAt: 'timestamp', updatedAt: false } });

module.exports = mongoose.model('AuditLog', auditLogSchema);
