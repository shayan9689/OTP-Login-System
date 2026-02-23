const API_BASE = import.meta.env.VITE_API_URL || '/api';
const REQUEST_TIMEOUT_MS = 25000;

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await res.json().catch(() => ({})) : {};

    if (!res.ok) {
      const message =
        data.message ||
        data.error ||
        (res.status >= 500 ? 'Server error. Check Vercel logs and env (RESEND_API_KEY, KV).' : `Request failed (${res.status})`);
      throw new Error(message);
    }
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Check your connection or try again.');
    }
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Network error. Check your connection and that the app is deployed.');
    }
    throw err;
  }
}

export async function sendOTP(email) {
  return request('/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function verifyOTP(email, otp) {
  return request('/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
}
