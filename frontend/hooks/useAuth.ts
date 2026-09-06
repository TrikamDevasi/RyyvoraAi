'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * useAuth — central hook for reading auth state.
 *
 * On mount, if a token exists in localStorage but Zustand has no user yet
 * (fresh page load / navigation), triggers checkAuth to rehydrate the store
 * from the backend. This ensures the dashboard stays authenticated after refresh.
 */
export function useAuth() {
  const user = useAuthStore(s => s.user);
  const isLoading = useAuthStore(s => s.loading);
  const accessToken = useAuthStore(s => s.accessToken);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const checkAuth = useAuthStore(s => s.checkAuth);
  const logout = useAuthStore(s => s.logout);

  // Track whether we already started a checkAuth call this mount
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return; // prevent double-fire in StrictMode

    // Check localStorage directly so this works even when accessToken state
    // hasn't hydrated yet (Zustand initial state runs server-side as null)
    const storedToken =
      typeof window !== 'undefined' ? (localStorage.getItem('ryyvora_token') || localStorage.getItem('skillsense_token')) : null;

    const needsHydration = storedToken && !user && !isLoading;

    if (needsHydration) {
      checkedRef.current = true;
      checkAuth();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Combined: either the store flag or the presence of a token
  const resolvedIsAuthenticated =
    isAuthenticated || (!!accessToken && !!user);

  return {
    user,
    isLoading,
    isAuthenticated: resolvedIsAuthenticated,
    logout,
  };
}
