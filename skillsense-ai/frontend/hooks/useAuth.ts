'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const { 
    user, 
    loading: isLoading, 
    accessToken, 
    checkAuth, 
    logout 
  } = useAuthStore();

  const isAuthenticated = !!accessToken || useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Only fetch if we have a token but no user data yet
    if (accessToken && !user && !isLoading) {
      checkAuth();
    }
  }, [accessToken, user, isLoading, checkAuth]);

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
  };
}
