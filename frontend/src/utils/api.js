// API helper that tries relative proxy endpoint first, and falls back gracefully.

const BACKEND_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? window.location.origin
  : 'http://localhost:5000';

export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : endpoint.startsWith('/api') 
      ? endpoint 
      : `/api${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  let res;
  try {
    res = await fetch(url, options);
  } catch (err) {
    console.warn(`Relative fetch to ${url} failed (${err.message}). Retrying with host ${BACKEND_URL}...`);
    const fallbackUrl = `${BACKEND_URL}${url.startsWith('/api') ? url : `/api${url}`}`;
    res = await fetch(fallbackUrl, options);
  }

  // Intercept res.json() to safely handle non-JSON / HTML response bodies without throwing SyntaxError
  const originalJson = res.json.bind(res);
  res.json = async () => {
    try {
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (parseErr) {
        console.error('Failed to parse JSON response text:', text);
        return {
          ok: false,
          message: 'Server connection error. Please try again in a few seconds.',
        };
      }
    } catch (err) {
      console.error('Error reading response body text:', err);
      return { ok: false, message: 'Server response error.' };
    }
  };

  return res;
}
