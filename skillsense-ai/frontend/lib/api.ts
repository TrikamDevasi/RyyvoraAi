// frontend/lib/api.ts
// Central Axios API instance with automatic JWT Authorization headers and 401 handling.

import axios from 'axios';
import { removeTokens } from './auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') 
    || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Authorization token to outgoing requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('skillsense_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      removeTokens();

      const isProtectedRoute =
        window.location.pathname.startsWith('/student') ||
        window.location.pathname.startsWith('/admin') ||
        window.location.pathname.startsWith('/employer') ||
        window.location.pathname.startsWith('/institute') ||
        window.location.pathname.startsWith('/industry') ||
        window.location.pathname.startsWith('/government');

      if (isProtectedRoute && !window.location.pathname.startsWith('/auth')) {
        window.location.href = `/auth?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
