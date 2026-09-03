// frontend/store/authStore.ts
// Zustand auth store — handles login, register, logout, and session rehydration.

import { create } from 'zustand';
import api from '@/lib/api';
import { setTokens, removeTokens } from '@/lib/auth';

export type UserRole = 'student' | 'employer' | 'institute' | 'industry' | 'government' | 'admin';

export interface AuthUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  institutionId?: string;
  authProvider?: 'local' | 'google' | 'github';
  isVerified: boolean;
  isActive?: boolean;
  createdAt?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<AuthUser>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (partialUser: Partial<AuthUser>) => void;
  resendVerification: (email: string) => Promise<void>;
  clearError: () => void;
  setToken: (token: string) => void;
  setAuth: (user: AuthUser, token: string) => void;
}

function persistUser(user: AuthUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ss_user', JSON.stringify(user));
}

function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('ss_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getStoredUser(),
  accessToken:
    typeof window !== 'undefined' ? localStorage.getItem('skillsense_token') : null,
  isAuthenticated:
    typeof window !== 'undefined' ? !!localStorage.getItem('skillsense_token') : false,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;

      setTokens(token, user.role);
      persistUser(user);

      set({ user, accessToken: token, loading: false, isAuthenticated: true });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed.';
      set({ loading: false, error: message });
      throw err;
    }
  },

  register: async (name: string, email: string, password: string, role: UserRole) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const { user, token } = response.data.data;

      setTokens(token, user.role);
      persistUser(user);

      set({ user, accessToken: token, loading: false, isAuthenticated: true });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed.';
      set({ loading: false, error: message });
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      removeTokens();
      set({ user: null, accessToken: null, isAuthenticated: false, loading: false });
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
    }
  },

  demoLogin: async (role: UserRole) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/demo-login', { role });
      const { user, token } = response.data.data;
      setTokens(token, user.role);
      persistUser(user);
      set({ user, accessToken: token, loading: false, isAuthenticated: true });
      return user;
    } catch {
      // If backend is unreachable, activate seamless persistent local demo session
      const demoNames: Record<UserRole, string> = {
        student: 'Aarav Deshmukh',
        employer: 'Tata Consultancy Services (TCS)',
        institute: 'MSSDS Pune Regional Training Center',
        government: 'Maharashtra Skilling Directorate',
        industry: 'Sector Skill Council Intelligence Lead',
        admin: 'System Admin',
      };
      const demoEmails: Record<UserRole, string> = {
        student: 'trainee@skillsense.demo',
        employer: 'employer@skillsense.demo',
        institute: 'provider@skillsense.demo',
        government: 'government@skillsense.demo',
        industry: 'industry@skillsense.demo',
        admin: 'admin@skillsense.demo',
      };
      const demoUser: AuthUser = {
        _id: `demo_${role}_001`,
        id: `demo_${role}_001`,
        name: demoNames[role] || 'Demo User',
        email: demoEmails[role] || `${role}.demo@skillsense.demo`,
        role,
        isVerified: true,
        authProvider: 'local',
      };
      const demoToken = `demo_token_${role}_${Date.now()}`;
      setTokens(demoToken, role);
      persistUser(demoUser);
      set({ user: demoUser, accessToken: demoToken, loading: false, isAuthenticated: true });
      return demoUser;
    }
  },

  checkAuth: async () => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('skillsense_token')
      : null;

    if (!token || get().loading) return;

    const isDemo = token.startsWith('demo_') || token.includes('demo');
    if (isDemo) {
      const storedUser = getStoredUser();
      if (storedUser) {
        setTokens(token, storedUser.role);
        set({ user: storedUser, accessToken: token, loading: false, isAuthenticated: true });
        return;
      }
    }

    set({ loading: true });
    try {
      const response = await api.get('/auth/me');
      const { user } = response.data.data;

      setTokens(token, user.role);
      persistUser(user);

      set({ user, accessToken: token, loading: false, isAuthenticated: true });
    } catch {
      const storedUser = getStoredUser();
      if (storedUser && isDemo) {
        set({ user: storedUser, accessToken: token, loading: false, isAuthenticated: true });
      } else {
        removeTokens();
        set({ user: null, accessToken: null, loading: false, isAuthenticated: false });
      }
    }
  },

  updateUser: (partialUser: Partial<AuthUser>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updated = { ...currentUser, ...partialUser };
      persistUser(updated);
      set({ user: updated });
    }
  },

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

  clearError: () => set({ error: null }),

  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillsense_token', token);
    }
    set({ accessToken: token });
  },

  setAuth: (user: AuthUser, token: string) => {
    setTokens(token, user.role);
    persistUser(user);
    set({ user, accessToken: token, isAuthenticated: true, loading: false });
  },
}));
