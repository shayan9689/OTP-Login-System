import { kv } from '@vercel/kv';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^\d{6}$/;

function isValidEmail(email) {
  return email && typeof email === 'string' && EMAIL_REGEX.test(email.trim());
}

function isValidOTP(otp) {
  if (otp === undefined || otp === null) return false;
  return OTP_REGEX.test(String(otp).trim());
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { email, otp } = body || {};

    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Please provide a valid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidOTP(otp)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Please provide a valid 6-digit OTP.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otpStr = String(otp).trim();
    const kvKey = `otp:${normalizedEmail}`;

    let storedOtp;
    try {
      storedOtp = await kv.get(kvKey);
    } catch (kvErr) {
      console.error('KV get error:', kvErr);
      return new Response(
        JSON.stringify({ success: false, message: 'Storage not configured. Add Vercel KV in project settings.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (storedOtp == null) {
      return new Response(
        JSON.stringify({ success: false, message: 'No OTP found for this email. Please request a new one.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (String(storedOtp) !== otpStr) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid OTP. Please try again.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await kv.del(kvKey).catch(() => {});

    return new Response(
      JSON.stringify({ success: true, message: 'Login Successful' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Verify OTP error:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Verification failed. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
