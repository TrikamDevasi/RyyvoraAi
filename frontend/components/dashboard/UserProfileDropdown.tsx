'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  CreditCard,
  Lock,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStore } from '@/store/themeStore';

const ROLE_PROFILE_LABELS: Record<string, string> = {
  student: 'Student Profile & Settings',
  employer: 'Company Profile & Settings',
  institute: 'Institute Profile & Settings',
  industry: 'Organization Profile & Settings',
  government: 'Directorate Profile & Settings',
  admin: 'Administrator Profile & Settings',
};

export default function UserProfileDropdown() {
  const router = useRouter();
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const role = (user?.role || 'student').toLowerCase();
  const initials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const profileLabel = ROLE_PROFILE_LABELS[role] || 'Profile & Preferences';
  const canonicalProfileHref = `/${role}/profile`;

  // Outside click & ESC dismissal
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Deterministic router navigation that guarantees page change without race condition
  const handleNavigate = useCallback(
    (href: string) => {
      setIsOpen(false);
      router.push(href);
    },
    [router]
  );

  const handleLogout = useCallback(async () => {
    setIsOpen(false);
    if (logout) {
      await logout();
    } else {
      router.push('/auth');
    }
  }, [logout, router]);

  // Loading skeleton while auth rehydrates
  if (isLoading) {
    return (
      <div
        aria-hidden="true"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '4px 10px',
          height: 38,
          borderRadius: 10,
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--border)',
            animation: 'pulse 1.5s infinite',
          }}
        />
        <div className="hidden sm:block" style={{ width: 68, height: 12, background: 'var(--border)', borderRadius: 4 }} />
      </div>
    );
  }

  // Unauthenticated fallback
  if (!isAuthenticated && !user) {
    return (
      <button
        type="button"
        onClick={() => router.push('/auth')}
        className="btn-gold"
        style={{
          fontSize: 12,
          padding: '6px 14px',
          height: 38,
          borderRadius: 8,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <User size={14} />
        <span>Sign In</span>
      </button>
    );
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`User account menu for ${user?.name || 'User'}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="icon-btn-hover"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          padding: '4px 10px 4px 6px',
          height: 38,
          borderRadius: 10,
          background: isOpen ? 'var(--bg-surface-elevated)' : 'transparent',
          border: '1px solid',
          borderColor: isOpen ? 'var(--border)' : 'transparent',
          cursor: 'pointer',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#090a0f',
            fontWeight: 800,
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(245, 158, 11, 0.25)',
            flexShrink: 0,
            transition: 'transform 0.18s ease',
          }}
        >
          {initials}
        </div>

        {/* User Identity on Desktop */}
        <div className="hidden sm:block" style={{ textAlign: 'left', lineHeight: 1.2 }}>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: 'var(--text-primary)',
              maxWidth: 120,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user?.name || 'Verified User'}
          </div>
          <div
            style={{
              fontSize: 10.5,
              color: 'var(--text-muted)',
              textTransform: 'capitalize',
            }}
          >
            {role}
          </div>
        </div>

        <ChevronDown
          size={14}
          style={{
            color: 'var(--text-secondary)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            marginLeft: 2,
          }}
        />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-label="User Account Menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 270,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            boxShadow: 'var(--shadow-lg)',
            zIndex: 100,
            padding: '8px',
            animation: 'dropdownFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* User Snapshot Card */}
          <div
            style={{
              padding: '10px 12px',
              borderBottom: '1px solid var(--border)',
              marginBottom: 6,
              background: 'var(--bg-surface-elevated)',
              borderRadius: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#090a0f',
                  fontWeight: 800,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.name || 'Verified User'}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.email || 'user@ryyvora.ai'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: 'var(--gold-muted)',
                  color: 'var(--gold)',
                  border: '1px solid var(--gold-border)',
                }}
              >
                {role}
              </span>
              {user?.isVerified && (
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: 'rgba(16,185,129,0.1)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <ShieldCheck size={11} /> Verified
                </span>
              )}
            </div>
          </div>

          {/* Action Links with Deterministic Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleNavigate(canonicalProfileHref)}
              className="menu-item-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 10px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 600,
                color: 'var(--text-primary)',
                background: 'transparent',
                border: 'none',
                width: '100%',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <User size={15} style={{ color: 'var(--gold)', flexShrink: 0 }} />
              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {profileLabel}
              </span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => handleNavigate('/settings/billing')}
              className="menu-item-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 10px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 500,
                color: 'var(--text-primary)',
                background: 'transparent',
                border: 'none',
                width: '100%',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <CreditCard size={15} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
              <span>Billing & Subscription</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => handleNavigate('/student/consent')}
              className="menu-item-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 10px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 500,
                color: 'var(--text-primary)',
                background: 'transparent',
                border: 'none',
                width: '100%',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Lock size={15} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
              <span>Security & DPDP Consent</span>
            </button>

            {/* Quick Theme Switcher */}
            <button
              type="button"
              role="menuitem"
              onClick={() => toggleTheme()}
              className="menu-item-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '9px 10px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 500,
                color: 'var(--text-primary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {theme === 'dark' ? (
                  <Sun size={15} style={{ color: 'var(--gold)' }} />
                ) : (
                  <Moon size={15} style={{ color: 'var(--info)' }} />
                )}
                <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Switch
              </span>
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', margin: '5px 0' }} />

          {/* Sign Out Action */}
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="menu-item-danger-hover"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '9px 10px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 600,
              color: '#ef4444',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
