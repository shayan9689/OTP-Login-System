const crypto = require('crypto');

/**
 * Generate a secure 6-digit numeric OTP.
 */
function generateOTP() {
  const bytes = crypto.randomBytes(4);
  const num = bytes.readUInt32BE(0);
  return String((num % 1000000) + 1000000).slice(-6);
}

module.exports = { generateOTP };
