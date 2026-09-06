// frontend/lib/constants/theme.ts
// Ryyvora AI — Centralized Design System Tokens

export const THEME = {
  colors: {
    // Brand Gold / Amber Primary
    primary: '#F59E0B',
    primaryHover: '#D97706',
    primaryDim: '#D4A843',
    primaryLight: '#FBBF24',
    primaryGlow: 'rgba(245, 158, 11, 0.15)',

    // Background & Surfaces (Obsidian Dark System)
    bgBase: '#08060F',
    bgSecondary: '#0D0B1D',
    bgSurface: 'rgba(255, 255, 255, 0.02)',
    bgSurfaceHover: 'rgba(255, 255, 255, 0.05)',
    bgCard: 'rgba(255, 255, 255, 0.025)',
    bgCardHover: 'rgba(255, 255, 255, 0.04)',

    // Borders & Dividers
    borderSubtle: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(255, 255, 255, 0.16)',
    borderGold: 'rgba(245, 158, 11, 0.25)',
    borderGoldActive: 'rgba(245, 158, 11, 0.45)',

    // Typography
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textDark: '#0A0A14',

    // Status & Feedback
    success: '#22C55E',
    successBg: 'rgba(34, 197, 94, 0.12)',
    successBorder: 'rgba(34, 197, 94, 0.3)',

    warning: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.12)',
    warningBorder: 'rgba(245, 158, 11, 0.3)',

    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.12)',
    errorBorder: 'rgba(239, 68, 68, 0.3)',

    info: '#3B82F6',
    infoBg: 'rgba(59, 130, 246, 0.12)',
    infoBorder: 'rgba(59, 130, 246, 0.3)',

    accentViolet: '#8B5CF6',
    accentCyan: '#06B6D4',
  },

  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '18px',
    pill: '9999px',
  },

  typography: {
    fontDisplay: "'Space Grotesk', sans-serif",
    fontBody: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },

  shadows: {
    subtle: '0 4px 20px rgba(0, 0, 0, 0.25)',
    goldGlow: '0 0 25px rgba(245, 158, 11, 0.12)',
    card: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  },
} as const;

export default THEME;
