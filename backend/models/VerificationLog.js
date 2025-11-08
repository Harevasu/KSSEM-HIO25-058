const mongoose = require('mongoose');

// Includes SHA-256 hash field
const VerificationLogSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  verificationSteps: [
    {
      step: String, // e.g., 'AuthorityCheck', 'IntegrityCheck'
      status: String, // 'Success', 'Failed'
      details: Object,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  finalStatus: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('VerificationLog', VerificationLogSchema);
