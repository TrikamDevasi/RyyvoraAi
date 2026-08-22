// frontend/store/authStore.ts
// Zustand auth store — handles login, register, logout, and session rehydration.

import { create } from 'zustand';
import api from '@/lib/api';
import { setTokens, removeTokens } from '@/lib/auth';

export type UserRole = 'student' | 'institute' | 'industry' | 'government' | 'admin';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  authProvider?: 'local' | 'google' | 'github';
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  clearError: () => void;
  setToken: (token: string) => void;
  setAuth: (user: AuthUser, token: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken:
    typeof window !== 'undefined' ? localStorage.getItem('skillsense_token') : null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // ── Login ─────────────────────────────────────────────────────────────────
  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      
      setTokens(token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('skillsense_token', token);
        localStorage.setItem('ss_user', JSON.stringify({ 
          name: user.name, 
          role: user.role, 
          email: user.email,
          isVerified: user.isVerified 
        }));
      }
      set({ user, accessToken: token, loading: false, isAuthenticated: true });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed.';
      set({ loading: false, error: message });
      throw err;
    }
  },

  // ── Register ──────────────────────────────────────────────────────────────
  register: async (name: string, email: string, password: string, role: UserRole) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const { user, token } = response.data.data;

      setTokens(token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('skillsense_token', token);
        localStorage.setItem('ss_user', JSON.stringify({ 
          name: user.name, 
          role: user.role, 
          email: user.email,
          isVerified: user.isVerified 
        }));
      }
      set({ user, accessToken: token, loading: false, isAuthenticated: true });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed.';
      set({ loading: false, error: message });
      throw err;
    }
  },

  // ── Logout ────────────────────────────────────────────────────────────────
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore
    } finally {
      removeTokens();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('skillsense_token');
        localStorage.removeItem('token');
        localStorage.removeItem('ss_user');
        window.location.href = '/auth';
      }
      set({ user: null, accessToken: null });
    }
  },

  // ── Check Auth (rehydrate on page load) ───────────────────────────────────
  checkAuth: async () => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('skillsense_token')
      : null;
    
    if (!token) return;

    set({ loading: true });
    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { user } = response.data.data;
      
      setTokens(token);
      set({ user, accessToken: token, loading: false });
    } catch {
      removeTokens();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('skillsense_token');
        localStorage.removeItem('ss_user');
      }
      set({ user: null, accessToken: null, loading: false });
    }
  },

  // ── Resend Verification ──────────────────────────────────────────────────
  resendVerification: async (email: string) => {
    set({ loading: true, error: null });
    try {
      await api.post('/auth/resend-verification', { email });
      set({ loading: false });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to resend verification.';
      set({ loading: false, error: message });
      throw err;
    }
  },

  // ── Helpers ───────────────────────────────────────────────────────────────
  clearError: () => set({ error: null }),

  // ── setToken (used by OAuth callback) ─────────────────────────────────────
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillsense_token', token);
    }
    set({ accessToken: token });
  },

  // ── setAuth (Standard way to hydrate) ───────────────────────────────────
  setAuth: (user: AuthUser, token: string) => {
    setTokens(token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillsense_token', token);
      localStorage.setItem('ss_user', JSON.stringify({ 
        name: user.name, 
        role: user.role, 
        email: user.email,
        isVerified: user.isVerified 
      }));
    }
    set({ user, accessToken: token, isAuthenticated: true });
  },
}));
