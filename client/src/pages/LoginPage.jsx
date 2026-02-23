import { useState } from 'react';
import { sendOTP, verifyOTP } from '../api/authApi';
import LandingScreen from '../components/LandingScreen';
import EmailScreen from '../components/EmailScreen';
import OTPScreen from '../components/OTPScreen';
import './LoginPage.css';

export default function LoginPage() {
  const [step, setStep] = useState('landing'); // 'landing' | 'email' | 'otp' | 'success'
  const [email, setEmail] = useState('');
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState('');

  function handleContinueWithGmail() {
    setSendError('');
    setStep('email');
  }

  async function handleSendOTP(emailAddress) {
    setSendError('');
    setSendLoading(true);
    try {
      await sendOTP(emailAddress);
      setEmail(emailAddress);
      setStep('otp');
    } catch (err) {
      setSendError(err.message || 'Failed to send OTP');
    } finally {
      setSendLoading(false);
    }
  }

  async function handleResendOTP(emailAddress) {
    await sendOTP(emailAddress);
  }

  async function handleVerifyOTP(emailAddress, otp) {
    await verifyOTP(emailAddress, otp);
  }

  function handleVerifySuccess() {
    setStep('success');
  }

  function handleBack() {
    setStep('email');
    setSendError('');
  }

  function handleBackToLanding() {
    setStep('landing');
    setSendError('');
  }

  return (
    <div className={`login-page step-${step}`}>
      {step === 'landing' && (
        <LandingScreen onContinueWithGmail={handleContinueWithGmail} />
      )}

      {step === 'email' && (
        <EmailScreen
          onSendOTP={handleSendOTP}
          onBack={handleBackToLanding}
          loading={sendLoading}
          error={sendError}
          onClearError={() => setSendError('')}
        />
      )}

      {step === 'otp' && (
        <OTPScreen
          email={email}
          onVerifyOTP={handleVerifyOTP}
          onResendOTP={handleResendOTP}
          onSuccess={handleVerifySuccess}
          onBack={handleBack}
        />
      )}

      {step === 'success' && (
        <div className="content-screen-wrap">
          <div className="content-screen success-screen">
            <button type="button" className="screen-back" onClick={handleBackToLanding} aria-label="Back to start">
              ← Back to start
            </button>
            <div className="success-icon">✓</div>
            <h2 className="screen-title">Login Successful</h2>
            <p className="screen-subtitle">You have been authenticated successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
}
