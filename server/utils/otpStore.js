/**
 * In-memory OTP store.
 * Each entry: { email, otp, expiresAt }
 */
const otpStore = new Map();

const OTP_EXPIRY_SECONDS = 60;

function setOTP(email, otp) {
  const expiresAt = Date.now() + OTP_EXPIRY_SECONDS * 1000;
  otpStore.set(email.toLowerCase().trim(), { otp, expiresAt });
}

function getOTP(email) {
  return otpStore.get(email.toLowerCase().trim()) || null;
}

function deleteOTP(email) {
  otpStore.delete(email.toLowerCase().trim());
}

function isExpired(entry) {
  return Date.now() > entry.expiresAt;
}

module.exports = {
  setOTP,
  getOTP,
  deleteOTP,
  isExpired,
  OTP_EXPIRY_SECONDS,
};
