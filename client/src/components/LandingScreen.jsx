export default function LandingScreen({ onContinueWithGmail }) {
  return (
    <div className="landing-screen-wrap">
    <div className="landing-screen">
      <h1 className="landing-logo">OTP Login</h1>

      <div className="landing-hero">
        <p className="landing-tagline">Sign in quickly and securely with a one-time code sent to your email.</p>
        <ul className="landing-features">
          <li>
            <span className="landing-feature-icon">✓</span>
            No password to remember
          </li>
          <li>
            <span className="landing-feature-icon">✓</span>
            Instant verification
          </li>
          <li>
            <span className="landing-feature-icon">✓</span>
            Secure & private
          </li>
        </ul>
        <div className="landing-visual" aria-hidden>
          <svg viewBox="0 0 140 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="30" y="10" width="80" height="60" rx="8" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.85" />
            <path d="M30 28 L70 48 L110 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
            <circle cx="70" cy="58" r="8" fill="currentColor" opacity="0.6" />
          </svg>
        </div>
      </div>

      <div className="landing-bottom">
        <button
          type="button"
          className="btn-landing btn-primary-landing"
          onClick={onContinueWithGmail}
        >
          Continue with Gmail
        </button>
        <p className="landing-terms">
          By continuing, you agree that you have read and accepted our{' '}
          <a href="#terms">T&C&apos;s</a> and <a href="#privacy">Privacy Policy</a>.
        </p>
      </div>
    </div>
    </div>
  );
}
