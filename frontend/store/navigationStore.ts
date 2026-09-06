// frontend/store/navigationStore.ts
import { create } from 'zustand';
import api from '@/lib/api';

export type NavigationStyle = 'sidebar' | 'navbar';

interface NavigationState {
  navigationStyle: NavigationStyle;
  sidebarCollapsed: boolean;
  isHydrated: boolean;
  setNavigationStyle: (style: NavigationStyle, persistRemote?: boolean) => Promise<void>;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  initPreferences: () => Promise<void>;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  navigationStyle: 'sidebar',
  sidebarCollapsed: false,
  isHydrated: false,

  initPreferences: async () => {
    // 1. First hydrate from localStorage for instant client rendering
    if (typeof window !== 'undefined') {
      const storedStyle = localStorage.getItem('ss_nav_style') as NavigationStyle | null;
      const storedCollapsed = localStorage.getItem('ss_nav_collapsed') === 'true';

      set({
        navigationStyle: storedStyle === 'navbar' ? 'navbar' : 'sidebar',
        sidebarCollapsed: storedCollapsed,
        isHydrated: true,
      });

      // 2. Fetch server preferences if authenticated
      try {
        const token = localStorage.getItem('ryyvora_token') || localStorage.getItem('skillsense_token');
        if (token && token !== 'null') {
          const res = await api.get('/auth/preferences');
          if (res.data?.data?.preferences) {
            const { navigationStyle, sidebarCollapsed } = res.data.data.preferences;
            if (navigationStyle) {
              localStorage.setItem('ss_nav_style', navigationStyle);
              set({ navigationStyle });
            }
            if (sidebarCollapsed !== undefined) {
              localStorage.setItem('ss_nav_collapsed', String(sidebarCollapsed));
              set({ sidebarCollapsed });
            }
          }
        }
      } catch {
        // Fallback to local storage values silently
      }
    }
  },

  setNavigationStyle: async (style: NavigationStyle, persistRemote = true) => {
    const prevStyle = get().navigationStyle;
    set({ navigationStyle: style });

    if (typeof window !== 'undefined') {
      localStorage.setItem('ss_nav_style', style);
    }

    if (persistRemote) {
      try {
        const token = localStorage.getItem('ryyvora_token') || localStorage.getItem('skillsense_token');
        if (token && token !== 'null') {
          await api.patch('/auth/preferences', { navigationStyle: style });
        }
      } catch (err) {
        console.warn('Failed to persist navigation preference to server:', err);
      }
    }
  },

  setSidebarCollapsed: (collapsed: boolean) => {
    set({ sidebarCollapsed: collapsed });
    if (typeof window !== 'undefined') {
      localStorage.setItem('ss_nav_collapsed', String(collapsed));
    }
  },

  toggleSidebar: () => {
    const next = !get().sidebarCollapsed;
    set({ sidebarCollapsed: next });
    if (typeof window !== 'undefined') {
      localStorage.setItem('ss_nav_collapsed', String(next));
    }
  },
}));
