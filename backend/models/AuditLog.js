const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'actorModel' },
  actorType: { type: String, enum: ['admin', 'system'], required: true },
  actorModel: { type: String, required: true, enum: ['Admin', 'User', 'System'], default: 'Admin' },
  action: { type: String, required: true },
  targetType: { type: String },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  note: { type: String },
  level: { type: String, enum: ['info', 'warning', 'error', 'critical'], default: 'info' },
  source: { type: String, enum: ['admin_panel', 'mobile_app', 'system'], default: 'admin_panel' },
  details: { type: String }
}, { timestamps: { createdAt: 'timestamp', updatedAt: false } });

module.exports = mongoose.model('AuditLog', auditLogSchema);
