// frontend/lib/api.ts
// Central axios instance — all frontend API calls go through here.

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') 
    || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request Interceptor: attach JWT from localStorage ─────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('skillsense_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Response Interceptor: handle 401 globally ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== 'undefined' &&
      error.response?.status === 401 &&
      !window.location.pathname.startsWith('/auth')
    ) {
      localStorage.removeItem('skillsense_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;
