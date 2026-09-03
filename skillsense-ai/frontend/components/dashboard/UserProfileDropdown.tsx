'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Settings,
  CreditCard,
  Lock,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Sun,
  Moon,
  Check,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStore } from '@/store/themeStore';

export default function UserProfileDropdown() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const role = (user?.role || 'student').toLowerCase();
  const initials = user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

  // Outside click & ESC dismissal
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    if (logout) await logout();
    router.push('/auth');
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User profile menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '4px 10px 4px 5px',
          height: 40,
          borderRadius: 10,
          background: isOpen ? 'var(--bg-surface-elevated)' : 'transparent',
          border: '1px solid',
          borderColor: isOpen ? 'var(--border)' : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.background = 'var(--bg-surface-elevated)';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.background = 'transparent';
        }}
      >
        {/* Avatar (36px) */}
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#090a0f',
            fontWeight: 800,
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)',
            flexShrink: 0,
          }}
        >
          {initials}
        </div>

        {/* Name & Role on Desktop */}
        <div className="hidden sm:block" style={{ textAlign: 'left', lineHeight: 1.25 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text-primary)',
              maxWidth: 130,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user?.name || 'Aarav Deshmukh'}
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              textTransform: 'capitalize',
            }}
          >
            {role}
          </div>
        </div>

        <ChevronDown
          size={15}
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
            width: 260,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            padding: '6px',
            animation: 'dropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* User Snapshot Card */}
          <div
            style={{
              padding: '10px 12px',
              borderBottom: '1px solid var(--border)',
              marginBottom: 4,
              background: 'var(--bg-surface-elevated)',
              borderRadius: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#090a0f',
                  fontWeight: 800,
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
                  {user?.email || 'user@skillsense.ai'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span
                style={{
                  fontSize: 10,
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
                    fontSize: 10,
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

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Link
              href="/student/profile"
              onClick={() => setIsOpen(false)}
              role="menuitem"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '8px 10px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 500,
                color: 'var(--text-primary)',
                textDecoration: 'none',
                transition: 'background 0.12s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-elevated)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <User size={15} style={{ color: 'var(--text-secondary)' }} />
              <span>Profile & Preferences</span>
            </Link>

            <Link
              href="/settings/billing"
              onClick={() => setIsOpen(false)}
              role="menuitem"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '8px 10px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 500,
                color: 'var(--text-primary)',
                textDecoration: 'none',
                transition: 'background 0.12s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-elevated)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <CreditCard size={15} style={{ color: 'var(--text-secondary)' }} />
              <span>Billing & Plan</span>
            </Link>

            <Link
              href="/student/consent"
              onClick={() => setIsOpen(false)}
              role="menuitem"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '8px 10px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 500,
                color: 'var(--text-primary)',
                textDecoration: 'none',
                transition: 'background 0.12s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-elevated)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Lock size={15} style={{ color: 'var(--text-secondary)' }} />
              <span>Security & Consent</span>
            </Link>

            {/* Theme Toggle within Menu */}
            <button
              type="button"
              onClick={() => toggleTheme()}
              role="menuitem"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '8px 10px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 500,
                color: 'var(--text-primary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.12s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-elevated)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
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

          <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />

          {/* Sign Out */}
          <button
            type="button"
            onClick={handleLogout}
            role="menuitem"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              width: '100%',
              padding: '8px 10px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 600,
              color: '#ef4444',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.12s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
