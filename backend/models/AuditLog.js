const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, refPath: 'actorModel' },
  actorType: { type: String, enum: ['admin', 'system'], required: true },
  actorModel: { type: String, required: true, enum: ['Admin', 'User', 'System'], default: 'Admin' },
  action: { type: String, required: true },
  targetType: { type: String },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  note: { type: String },
  level: { type: String, enum: ['info', 'warning', 'error', 'critical'], default: 'info' },
  source: { type: String, enum: ['admin_panel', 'mobile_app', 'system', 'webhook', 'paymentpoint_webhook'], default: 'admin_panel' },
  details: { type: String }
}, { timestamps: { createdAt: 'timestamp', updatedAt: false } });

auditLogSchema.post('save', async function(doc) {
  if (global.io) {
    try {
      await doc.populate('actorId', 'email name');
      const formatted = {
        id: doc._id,
        actor: doc.actorId ? (doc.actorId.name || doc.actorId.email) : (doc.actorType === 'system' ? 'System' : 'Unknown Admin'),
        action: doc.action,
        level: doc.level || 'info',
        source: doc.source || 'system',
        details: doc.details || doc.note || 'No details provided',
        timestamp: doc.timestamp || new Date()
      };
      global.io.emit('new-log', formatted);
    } catch (err) {
      console.error('Error emitting new log via socket:', err);
    }
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
