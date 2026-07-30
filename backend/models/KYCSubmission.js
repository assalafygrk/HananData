const mongoose = require('mongoose');

const kycSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['BVN', 'NIN'], required: true },
  documentUrl: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  rejectionReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('KYCSubmission', kycSubmissionSchema);
