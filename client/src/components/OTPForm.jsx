import { useState, useEffect } from 'react';
import OTPInput from './OTPInput';

const OTP_EXPIRY_SECONDS = 60;

export default function OTPForm({ email, onSuccess, onVerifyOTP, onBack }) {
  const [otp, setOtp] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
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

  return (
    <form onSubmit={handleVerify} className="form">
      <p className="otp-email">Code sent to <strong>{email}</strong></p>
      <label className="label">Enter 6-digit code</label>
      <OTPInput value={otp} onChange={setOtp} disabled={expired || loading} />
      <div className="timer">
        {expired ? (
          <span className="timer-expired">Code expired</span>
        ) : (
          <span>Valid for {secondsLeft}s</span>
        )}
      </div>
      {error && <p className="error">{error}</p>}
      <div className="button-row">
        <button type="button" className="btn btn-secondary" onClick={onBack} disabled={loading}>
          Back
        </button>
        <button type="submit" className="btn btn-primary" disabled={!canVerify}>
          {loading ? 'Verifying…' : 'Verify'}
        </button>
      </div>
    </form>
  );
}
