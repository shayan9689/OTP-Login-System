const { isValidEmail, isValidOTP } = require('../utils/validators');
const { generateOTP } = require('../utils/generateOTP');
const { setOTP, getOTP, deleteOTP, isExpired } = require('../utils/otpStore');
const { sendOTPEmail } = require('../utils/emailService');

async function sendOTP(req, res) {
  try {
    const { email } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otp = generateOTP();
    setOTP(normalizedEmail, otp);

    await sendOTPEmail(normalizedEmail, otp);

    return res.status(200).json({
      success: true,
      message: 'OTP sent to your email.',
    });
  } catch (err) {
    console.error('Send OTP error:', err.message || err);
    const userMessage = err.message || 'Failed to send OTP. Please try again later.';
    return res.status(500).json({
      success: false,
      message: userMessage,
    });
  }
}

async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (!isValidOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 6-digit OTP.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otpStr = String(otp).trim();
    const entry = getOTP(normalizedEmail);

    if (!entry) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found for this email. Please request a new one.',
      });
    }

    if (isExpired(entry)) {
      deleteOTP(normalizedEmail);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    if (entry.otp !== otpStr) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.',
      });
    }

    deleteOTP(normalizedEmail);

    return res.status(200).json({
      success: true,
      message: 'Login Successful',
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({
      success: false,
      message: 'Verification failed. Please try again later.',
    });
  }
}

module.exports = { sendOTP, verifyOTP };
