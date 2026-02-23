import { useRef, useEffect, useCallback } from 'react';

const DIGITS = 6;

export default function OTPInput({ value, onChange, disabled }) {
  const inputRefs = useRef([]);

  const setRef = useCallback((el, i) => {
    inputRefs.current[i] = el;
  }, []);

  useEffect(() => {
    const digits = value.split('').slice(0, DIGITS);
    const firstEmpty = digits.findIndex((d) => d === '');
    const focusIndex = firstEmpty === -1 ? DIGITS - 1 : firstEmpty;
    const el = inputRefs.current[focusIndex];
    if (el) el.focus();
  }, [value]);

  function handleChange(i, e) {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const next = value.split('');
    next[i] = char;
    const joined = next.join('').slice(0, DIGITS);
    onChange(joined);
    if (char && i < DIGITS - 1) {
      inputRefs.current[i + 1]?.focus();
    }
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      const next = value.split('');
      next[i - 1] = '';
      onChange(next.join(''));
      inputRefs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, DIGITS);
    if (pasted) onChange(pasted);
  }

  const digits = value.split('').concat(Array(DIGITS).fill('')).slice(0, DIGITS);

  return (
    <div className="otp-row" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => setRef(el, i)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          disabled={disabled}
          className="otp-input"
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
