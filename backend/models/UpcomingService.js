const mongoose = require('mongoose');

const upcomingServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'auto_awesome' },
  category: { type: String, default: 'General' },
  status: { 
    type: String, 
    enum: ['in_development', 'testing', 'planned', 'released'], 
    default: 'in_development' 
  },
  progress: { type: Number, default: 50, min: 0, max: 100 },
  expectedDate: { type: String, default: 'Q3 2026' },
  isPublished: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  subscribers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('UpcomingService', upcomingServiceSchema);
