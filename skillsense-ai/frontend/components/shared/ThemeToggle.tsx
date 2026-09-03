'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

interface ThemeToggleProps {
  variant?: 'icon' | 'compact' | 'full';
  className?: string;
  style?: React.CSSProperties;
}

export function ThemeToggle({ variant = 'icon', className = '', style }: ThemeToggleProps) {
  const { theme, toggleTheme, initTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initTheme();
  }, [initTheme]);

  if (!mounted) {
    // Render placeholder with same dimensions to avoid layout shift
    return (
      <div
        style={{
          width: variant === 'full' ? '100%' : 32,
          height: 32,
          ...style,
        }}
        className={className}
      />
    );
  }

  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={label}
        title={label}
        className={`btn-secondary ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '8px 12px',
          fontSize: 12.5,
          cursor: 'pointer',
          borderRadius: 'var(--radius-md, 8px)',
          ...style,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isDark ? (
            <Sun size={15} style={{ color: 'var(--gold, #f59e0b)' }} />
          ) : (
            <Moon size={15} style={{ color: 'var(--info, #3b82f6)' }} />
          )}
          <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
        </div>
        <span
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            fontWeight: 700,
            letterSpacing: '0.05em',
            padding: '2px 6px',
            borderRadius: 4,
            background: 'var(--bg-surface-elevated)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
          }}
        >
          {theme}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        padding: 0,
        borderRadius: 8,
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0,
        ...style,
      }}
      className={`theme-toggle-btn ${className}`}
    >
      {isDark ? (
        <Sun
          size={16}
          style={{
            color: 'var(--gold)',
            transform: 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        />
      ) : (
        <Moon
          size={16}
          style={{
            color: 'var(--text-primary)',
            transform: 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        />
      )}
    </button>
  );
}

export default ThemeToggle;
