import { useState, useEffect } from 'react';
import OTPInput from './OTPInput';

const OTP_EXPIRY_SECONDS = 60;

function maskEmail(email) {
  if (!email || !email.includes('@')) return '***';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return '***@' + domain;
  return local.slice(0, 2) + '***@' + domain;
}

export default function OTPScreen({ email, onVerifyOTP, onResendOTP, onSuccess, onBack }) {
  const [otp, setOtp] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const expired = secondsLeft === 0;
  const canVerify = otp.length === 6 && !expired && !loading;

  async function handleVerify(e) {
    e.preventDefault();
    if (!canVerify) return;
    setError('');
    setLoading(true);
    try {
      await onVerifyOTP(email, otp);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendLoading) return;
    setError('');
    setResendLoading(true);
    try {
      await onResendOTP(email);
      setSecondsLeft(OTP_EXPIRY_SECONDS);
      setOtp('');
    } catch (err) {
      setError(err.message || 'Failed to resend');
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="content-screen-wrap">
      <div className="content-screen">
        {onBack && (
          <button type="button" className="screen-back" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
        )}
        <h2 className="screen-title">Verify Email</h2>
      <p className="screen-subtitle">
        We have sent a verification code to {maskEmail(email)}. Enter the code in below boxes.
      </p>
      <div className="screen-illustration screen-illustration-small" aria-hidden>
        <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="30" r="20" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
          <path d="M28 30 L36 38 L52 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        </svg>
      </div>
      <form onSubmit={handleVerify} className="screen-form">
        <OTPInput value={otp} onChange={setOtp} disabled={expired || loading} />
        <p className="resend-line">
          Did not receive OTP?{' '}
          <button
            type="button"
            className="link-resend"
            onClick={handleResend}
            disabled={resendLoading}
          >
            Resend OTP
          </button>
        </p>
        <p className="screen-timer">
          {expired ? (
            <span className="timer-expired">Code expired</span>
          ) : (
            <span>{secondsLeft} Seconds</span>
          )}
        </p>
        {error && <p className="screen-error">{error}</p>}
        <button type="submit" className="btn-content btn-primary-content" disabled={!canVerify}>
          {loading ? 'Verifying…' : 'Verify & Proceed'}
          <span className="btn-arrow">→</span>
        </button>
      </form>
      </div>
    </div>
  );
}
