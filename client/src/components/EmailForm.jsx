import { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailForm({ onSendOTP, loading, error, onClearError }) {
  const [email, setEmail] = useState('');

  const isValid = email.trim() && EMAIL_REGEX.test(email.trim());

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || loading) return;
    onClearError?.();
    onSendOTP(email.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <label htmlFor="email" className="label">
        Email address
      </label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
        disabled={loading}
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={!isValid || loading}>
        {loading ? 'Sending…' : 'Send OTP'}
      </button>
    </form>
  );
}
