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

  try {
    const res = await fetch(url, options);
    return res;
  } catch (err) {
    console.warn(`Relative fetch to ${url} failed (${err.message}). Retrying with host ${BACKEND_URL}...`);
    const fallbackUrl = `${BACKEND_URL}${url.startsWith('/api') ? url : `/api${url}`}`;
    return await fetch(fallbackUrl, options);
  }
}
