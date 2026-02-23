const { Resend } = require('resend');

const FROM = 'OTP Login <onboarding@resend.dev>';

let client = null;

function getResend() {
  if (client) return client;
  let key = process.env.RESEND_API_KEY;
  if (key && typeof key === 'string') key = key.trim().replace(/^["']|["']$/g, '');
  if (!key) {
    throw new Error('RESEND_API_KEY must be set in .env. Get one at https://resend.com/api-keys');
  }
  client = new Resend(key);
  return client;
}

async function sendOTPEmail(toEmail, otp) {
  const resend = getResend();
  const { error } = await resend.emails.send({
    from: FROM,
    to: [toEmail],
    subject: 'Your Login OTP Code',
    html: `<p>Your OTP code is: <strong>${otp}</strong>. It is valid for 60 seconds.</p>`,
  });
  if (error) throw new Error(error.message || 'Resend failed');
}

module.exports = { sendOTPEmail };
