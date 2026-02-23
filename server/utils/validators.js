const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^\d{6}$/;

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
}

function isValidOTP(otp) {
  if (otp === undefined || otp === null) return false;
  const str = String(otp).trim();
  return OTP_REGEX.test(str);
}

module.exports = { isValidEmail, isValidOTP };
