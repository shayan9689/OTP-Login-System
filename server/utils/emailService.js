const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (!transporter) {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    if (!user || !pass) {
      throw new Error('EMAIL_USER and EMAIL_PASS must be set in .env');
    }
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user, pass },
      requireTLS: true,
    });
  }
  return transporter;
}

async function sendOTPEmail(toEmail, otp) {
  const transport = getTransporter();
  await transport.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Your Login OTP Code',
    text: `Your OTP code is: ${otp}. It is valid for 60 seconds.`,
    html: `<p>Your OTP code is: <strong>${otp}</strong>. It is valid for 60 seconds.</p>`,
  });
}

module.exports = { sendOTPEmail };
