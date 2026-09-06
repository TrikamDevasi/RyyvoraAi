import { useThemeStore } from '../store/themeStore';

/**
 * Centralized Chart Color Architecture for Ryyvora AI
 * Sovereign Institutional Government + Enterprise Analytics Design System
 * 
 * Strict WCAG 2.1 AA/AAA compliance across Dark (#0B0F17) and Light (#F8FAFC) canvases.
 */

export interface ChartThemeConfig {
  series: {
    primary: string;      // #F59E0B / #D97706 - Brand / Primary metric
    benchmark: string;    // #3B82F6 / #2563EB - Comparative benchmark / Institutional Navy-Blue
    telemetry: string;    // #06B6D4 / #0E7490 - AI forecast / Telemetry projection
    baseline: string;     // #64748B / #64748B - Neutral baseline / Reference line
    positive: string;     // #10B981 / #047857 - Verified positive / Placement success
    warning: string;      // #EAB308 / #B45309 - Attention required
    critical: string;     // #EF4444 / #B91C1C - Severe deficit / Critical gap
  };
  tiers: {
    surplus: string;      // >= 85%: Institutional Emerald
    strong: string;       // 75-84%: Telemetry Cyan
    equilibrium: string;  // 65-74%: Restrained Amber
    deficit: string;      // 50-64%: Alert Orange
    critical: string;     // < 50%: Institutional Red
  };
  grid: {
    stroke: string;
    strokeDasharray: string;
  };
  axis: {
    tick: string;
    label: string;
  };
  tooltip: {
    background: string;
    border: string;
    text: string;
    textMuted: string;
  };
}

export const CHART_THEMES: { dark: ChartThemeConfig; light: ChartThemeConfig } = {
  dark: {
    series: {
      primary: '#F59E0B',
      benchmark: '#3B82F6',
      telemetry: '#06B6D4',
      baseline: '#64748B',
      positive: '#10B981',
      warning: '#EAB308',
      critical: '#EF4444',
    },
    tiers: {
      surplus: '#10B981',      // >= 85%
      strong: '#06B6D4',       // 75-84%
      equilibrium: '#F59E0B',  // 65-74%
      deficit: '#F97316',      // 50-64%
      critical: '#EF4444',     // < 50%
    },
    grid: {
      stroke: 'rgba(255, 255, 255, 0.07)',
      strokeDasharray: '3 3',
    },
    axis: {
      tick: '#64748B',
      label: '#94A3B8',
    },
    tooltip: {
      background: '#111827',
      border: 'rgba(255, 255, 255, 0.12)',
      text: '#F8FAFC',
      textMuted: '#94A3B8',
    },
  },
  light: {
    series: {
      primary: '#D97706',
      benchmark: '#2563EB',
      telemetry: '#0E7490',
      baseline: '#64748B',
      positive: '#047857',
      warning: '#B45309',
      critical: '#B91C1C',
    },
    tiers: {
      surplus: '#047857',      // >= 85%
      strong: '#0E7490',       // 75-84%
      equilibrium: '#D97706',  // 65-74%
      deficit: '#C2410C',      // 50-64%
      critical: '#B91C1C',     // < 50%
    },
    grid: {
      stroke: '#E2E8F0',
      strokeDasharray: '3 3',
    },
    axis: {
      tick: '#475569',
      label: '#334155',
    },
    tooltip: {
      background: '#FFFFFF',
      border: '#CBD5E1',
      text: '#0F172A',
      textMuted: '#64748B',
    },
  },
};

/**
 * Returns the theme config according to dark mode boolean.
 */
export function getChartTheme(isDark = true): ChartThemeConfig {
  return isDark ? CHART_THEMES.dark : CHART_THEMES.light;
}

/**
 * Reactive hook that provides the current chart theme based on theme store.
 */
export function useChartTheme(): ChartThemeConfig {
  const theme = useThemeStore((s) => s.theme);
  return theme === 'light' ? CHART_THEMES.light : CHART_THEMES.dark;
}

/**
 * Benchmark 5-Tier Metric Color Resolver
 * Strict government evaluation standards
 */
export function getScoreTierColor(score: number, isDark = true): string {
  const theme = getChartTheme(isDark);
  if (score >= 85) return theme.tiers.surplus;
  if (score >= 75) return theme.tiers.strong;
  if (score >= 65) return theme.tiers.equilibrium;
  if (score >= 50) return theme.tiers.deficit;
  return theme.tiers.critical;
}

/**
 * Returns semantic metadata for district / cohort evaluation
 */
export function getScoreTierMeta(score: number) {
  if (score >= 85) {
    return { label: 'Surplus', tier: 1, text: 'High Readiness', colorClass: 'tier-surplus' };
  }
  if (score >= 75) {
    return { label: 'Strong', tier: 2, text: 'Stable Growth', colorClass: 'tier-strong' };
  }
  if (score >= 65) {
    return { label: 'Equilibrium', tier: 3, text: 'Target Aligned', colorClass: 'tier-equilibrium' };
  }
  if (score >= 50) {
    return { label: 'Deficit', tier: 4, text: 'Intervention Req', colorClass: 'tier-deficit' };
  }
  return { label: 'Critical', tier: 5, text: 'Immediate Action', colorClass: 'tier-critical' };
}
