// frontend/lib/api.ts
// Central Axios API instance with automatic JWT Authorization headers and 401 handling.

import axios from 'axios';
import { removeTokens } from './auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') 
    || 'http://localhost:5000/api/v1',
  withCredentials: true,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Authorization token to outgoing requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ryyvora_token') || localStorage.getItem('skillsense_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 Unauthorized globally without breaking demo sessions or loops
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      const token = localStorage.getItem('ryyvora_token') || localStorage.getItem('skillsense_token');
      const isDemo = token?.startsWith('demo_') || token?.includes('demo');
      const pathname = window.location.pathname;

      if (!isDemo && !pathname.startsWith('/auth')) {
        const isProtectedRoute =
          pathname.startsWith('/student') ||
          pathname.startsWith('/admin') ||
          pathname.startsWith('/employer') ||
          pathname.startsWith('/institute') ||
          pathname.startsWith('/industry') ||
          pathname.startsWith('/government');

        // Only redirect if explicit auth failure on protected routes
        if (isProtectedRoute && error.config?.url?.includes('/auth/me')) {
          removeTokens();
          window.location.href = `/auth?redirect=${encodeURIComponent(pathname)}`;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
