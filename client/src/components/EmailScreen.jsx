import { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailScreen({ onSendOTP, onBack, loading, error, onClearError }) {
  const [email, setEmail] = useState('');

  const isValid = email.trim() && EMAIL_REGEX.test(email.trim());

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || loading) return;
    onClearError?.();
    onSendOTP(email.trim());
  }

  return (
    <div className="content-screen-wrap">
      <div className="content-screen">
        {onBack && (
          <button type="button" className="screen-back" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
        )}
        <h2 className="screen-title">Continue With Email</h2>
      <p className="screen-subtitle">
        We will send <strong>One time password</strong> on this email
      </p>
      <div className="screen-illustration" aria-hidden>
        <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="10" width="80" height="60" rx="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
          <path d="M20 25 L60 45 L100 25" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
          <circle cx="60" cy="55" r="12" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
      <form onSubmit={handleSubmit} className="screen-form">
        <label htmlFor="email" className="screen-label">Enter your email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="screen-input"
          disabled={loading}
        />
        {error && <p className="screen-error">{error}</p>}
        <button type="submit" className="btn-content btn-primary-content" disabled={!isValid || loading}>
          {loading ? 'Sending…' : 'Get OTP'}
          <span className="btn-arrow">→</span>
        </button>
      </form>
      </div>
    </div>
  );
}
