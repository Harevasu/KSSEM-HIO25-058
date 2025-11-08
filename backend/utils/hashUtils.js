const crypto = require('crypto');

// SHA-256 logging helper
function createHash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

module.exports = { createHash };
