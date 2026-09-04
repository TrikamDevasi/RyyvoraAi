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
  phoneVerified?: boolean;
  profileCompleted?: boolean;
  avatar?: string;
  institutionId?: string;
  authProvider?: 'local' | 'google' | 'github' | 'mobile';
  isVerified: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface MobileAuthState {
  phone: string;
  maskedPhone: string;
  cooldownRemaining: number;
  registrationToken?: string;
  devOtp?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  mobileState: MobileAuthState | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  sendMobileOtp: (phone: string) => Promise<{ phone: string; maskedPhone: string; cooldownRemaining: number; devOtp?: string }>;
  verifyMobileOtp: (phone: string, otp: string) => Promise<{ isNewUser: boolean; registrationToken?: string; user?: AuthUser; token?: string }>;
  completeMobileRegistration: (registrationToken: string, name: string, role: UserRole) => Promise<{ user: AuthUser; token: string }>;
  setMobileState: (data: Partial<MobileAuthState> | null) => void;
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

function getStoredMobileState(): MobileAuthState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem('ss_mobile_auth');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistMobileState(data: MobileAuthState | null) {
  if (typeof window === 'undefined') return;
  if (!data) {
    sessionStorage.removeItem('ss_mobile_auth');
  } else {
    sessionStorage.setItem('ss_mobile_auth', JSON.stringify(data));
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
  mobileState: getStoredMobileState(),

  setMobileState: (data: Partial<MobileAuthState> | null) => {
    if (!data) {
      persistMobileState(null);
      set({ mobileState: null });
      return;
    }
    const current = get().mobileState || { phone: '', maskedPhone: '', cooldownRemaining: 0 };
    const updated = { ...current, ...data };
    persistMobileState(updated);
    set({ mobileState: updated });
  },

  sendMobileOtp: async (phone: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/mobile/send-otp', { phone });
      const { phone: normalizedPhone, maskedPhone, cooldownRemaining, _devOtp } = response.data.data;
      const stateObj: MobileAuthState = {
        phone: normalizedPhone,
        maskedPhone,
        cooldownRemaining: cooldownRemaining || 60,
        devOtp: _devOtp,
        registrationToken: get().mobileState?.registrationToken,
      };
      persistMobileState(stateObj);
      set({ loading: false, mobileState: stateObj });
      return { phone: normalizedPhone, maskedPhone, cooldownRemaining, devOtp: _devOtp };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to send OTP code.';
      set({ loading: false, error: message });
      throw err;
    }
  },

  verifyMobileOtp: async (phone: string, otp: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/mobile/verify-otp', { phone, otp });
      const data = response.data.data;

      if (data.isNewUser) {
        const updatedMobile: MobileAuthState = {
          phone: data.phone,
          maskedPhone: data.maskedPhone,
          cooldownRemaining: 0,
          registrationToken: data.registrationToken,
        };
        persistMobileState(updatedMobile);
        set({ loading: false, mobileState: updatedMobile });
        return { isNewUser: true, registrationToken: data.registrationToken };
      } else {
        const { user, token } = data;
        setTokens(token, user.role);
        persistUser(user);
        persistMobileState(null);
        set({ user, accessToken: token, loading: false, isAuthenticated: true, mobileState: null });
        return { isNewUser: false, user, token };
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Verification failed.';
      set({ loading: false, error: message });
      throw err;
    }
  },

  completeMobileRegistration: async (registrationToken: string, name: string, role: UserRole) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/mobile/complete-profile', {
        registrationToken,
        name,
        role,
      });
      const { user, token } = response.data.data;
      setTokens(token, user.role);
      persistUser(user);
      persistMobileState(null);
      set({ user, accessToken: token, loading: false, isAuthenticated: true, mobileState: null });
      return { user, token };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Profile completion failed.';
      set({ loading: false, error: message });
      throw err;
    }
  },

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
      const response = await api.post('/auth/demo-login', { role }, { timeout: 600 });
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
