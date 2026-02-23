import { Resend } from 'resend';
import { kv } from '@vercel/kv';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_EXPIRY_SEC = 60;

function generateOTP() {
  const num = Math.floor(Math.random() * 1000000) + 1000000;
  return String(num).slice(-6);
}

function isValidEmail(email) {
  return email && typeof email === 'string' && EMAIL_REGEX.test(email.trim());
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
    const email = body?.email;

    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Please provide a valid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resendKey = process.env.RESEND_API_KEY?.trim();
    if (!resendKey) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email not configured. Set RESEND_API_KEY in Vercel.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otp = generateOTP();
    const kvKey = `otp:${normalizedEmail}`;

    try {
      await kv.set(kvKey, otp, { ex: OTP_EXPIRY_SEC });
    } catch (kvErr) {
      console.error('KV set error:', kvErr);
      return new Response(
        JSON.stringify({ success: false, message: 'Storage not configured. Add Vercel KV in project settings.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(resendKey);
    const { error } = await resend.emails.send({
      from: 'OTP Login <onboarding@resend.dev>',
      to: [normalizedEmail],
      subject: 'Your Login OTP Code',
      html: `<p>Your OTP code is: <strong>${otp}</strong>. It is valid for 60 seconds.</p>`,
    });

    if (error) {
      await kv.del(kvKey).catch(() => {});
      return new Response(
        JSON.stringify({ success: false, message: error.message || 'Failed to send email.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'OTP sent to your email.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Send OTP error:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to send OTP. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
