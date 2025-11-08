const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileHash: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'Uploaded', // Uploaded, In-Progress, Verified, Forgery-Detected, Rejected
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Document', DocumentSchema);
