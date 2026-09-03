'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { NAVIGATION_CONFIG, NavGroup, RouteItem } from '@/config/navigation';
import { useNavigationStore, NavigationStyle } from '@/store/navigationStore';
import {
  Brain,
  Award,
  CheckSquare,
  Compass,
  FileCode,
  Briefcase,
  TrendingUp,
  Trophy,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Layout,
  Sidebar as SidebarIcon,
  ShieldCheck,
  Building,
  Landmark,
  Settings,
  ChevronDown,
  Lightbulb,
  CreditCard,
  Lock,
} from 'lucide-react';
import { FeatureTipsGuideModal } from '@/components/shared/FeatureTipsGuide';
import ThemeToggle from '@/components/shared/ThemeToggle';
import NotificationDropdown from '@/components/dashboard/NotificationDropdown';
import UserProfileDropdown from '@/components/dashboard/UserProfileDropdown';

function VerificationBanner() {
  const { user } = useAuth();
  if (!user || user.isVerified) return null;

  return (
    <div
      style={{
        background: 'var(--gold-muted)',
        borderBottom: '1px solid var(--gold-border)',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 12.5,
        color: 'var(--gold)',
        fontWeight: 600,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)' }} />
        <span>Verification Pending · Complete your profile to activate cryptographically verified NSQF ledger credentials.</span>
      </div>
      <Link
        href="/student/passport"
        style={{
          color: 'var(--gold)',
          textDecoration: 'underline',
          fontWeight: 700,
        }}
      >
        View Passport →
      </Link>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const {
    navigationStyle,
    sidebarCollapsed,
    setNavigationStyle,
    setSidebarCollapsed,
    toggleSidebar,
    initPreferences,
    isHydrated,
  } = useNavigationStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize navigation preferences on mount
  useEffect(() => {
    setMounted(true);
    initPreferences();
  }, [initPreferences]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close mobile drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine active role configuration
  const role = (user?.role || 'student').toLowerCase();
  const navGroups: NavGroup[] = NAVIGATION_CONFIG[role] || NAVIGATION_CONFIG.student;
  const allRoutes = navGroups.flatMap((g) => g.routes);

  const isRouteActive = (href: string) => {
    if (
      href === '/student' ||
      href === '/institute' ||
      href === '/industry' ||
      href === '/employer' ||
      href === '/government' ||
      href === '/admin'
    ) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    if (logout) await logout();
    router.push('/auth');
  };

  // Human-readable breadcrumb segment
  const pathSegments = pathname.split('/').filter(Boolean);
  const activeSection = pathSegments[0] || 'workspace';
  const activePage = pathSegments[1] ? pathSegments[1].replace(/-/g, ' ') : 'Overview';

  return (
    <div
      suppressHydrationWarning
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text-primary)',
        flexDirection: mounted && navigationStyle === 'navbar' ? 'column' : 'row',
      }}
    >
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* ── 1. SIDEBAR MODE (Desktop: Left Vertical Navigation) ─────────────────── */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {(!mounted || navigationStyle === 'sidebar') && (
        <aside
          aria-label="Primary application sidebar"
          style={{
            width: sidebarCollapsed ? 76 : 264,
            minWidth: sidebarCollapsed ? 76 : 264,
            background: 'var(--bg-surface)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            height: '100vh',
            zIndex: 40,
            transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="hidden md:flex"
        >
          {/* Top Brand Header */}
          <div>
            <div
              style={{
                height: 64,
                padding: sidebarCollapsed ? '0 16px' : '0 18px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: sidebarCollapsed ? 'center' : 'space-between',
              }}
            >
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: 13,
                    color: '#090a0f',
                    flexShrink: 0,
                    boxShadow: '0 2px 10px rgba(245,158,11,0.25)',
                  }}
                >
                  SK
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <span className="font-display" style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                      SkillSense <span style={{ color: 'var(--gold)' }}>AI</span>
                    </span>
                    <div style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {role} Intelligence
                    </div>
                  </div>
                )}
              </Link>

              <button
                type="button"
                onClick={toggleSidebar}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {sidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={16} />}
              </button>
            </div>

            {/* Navigation Groups */}
            <div
              style={{
                padding: sidebarCollapsed ? '14px 8px' : '14px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 140px)',
              }}
            >
              {navGroups.map((group, gIdx) => (
                <div key={gIdx}>
                  {!sidebarCollapsed ? (
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        padding: '0 8px',
                        marginBottom: 6,
                      }}
                    >
                      {group.group}
                    </div>
                  ) : (
                    gIdx > 0 && <div style={{ borderTop: '1px solid var(--border)', margin: '8px 4px' }} />
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {group.routes.map((route) => {
                      const Icon = route.icon;
                      const active = isRouteActive(route.href);

                      return (
                        <Link
                          key={route.href}
                          href={route.href}
                          className={sidebarCollapsed ? 'sidebar-item-collapsed' : undefined}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            minHeight: 40,
                            padding: sidebarCollapsed ? '8px 0' : '8px 10px',
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: active ? 700 : 500,
                            color: active ? 'var(--gold)' : 'var(--text-secondary)',
                            background: active ? 'var(--gold-muted)' : 'transparent',
                            borderLeft: active ? '3px solid var(--gold)' : '3px solid transparent',
                            textDecoration: 'none',
                            transition: 'all 0.15s ease',
                          }}
                          aria-label={route.label}
                          aria-current={active ? 'page' : undefined}
                        >
                          <Icon
                            size={17}
                            style={{
                              color: active ? 'var(--gold)' : 'currentColor',
                              flexShrink: 0,
                            }}
                          />

                          {!sidebarCollapsed ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, minWidth: 0 }}>
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {route.label}
                              </span>
                              {route.badge && (
                                <span
                                  style={{
                                    fontSize: 9,
                                    fontWeight: 800,
                                    padding: '1px 5px',
                                    borderRadius: 4,
                                    background: route.badge === 'AI' ? 'rgba(245,158,11,0.2)' : 'var(--bg-surface-elevated)',
                                    color: route.badge === 'AI' ? 'var(--gold)' : 'var(--text-muted)',
                                    border: '1px solid var(--border)',
                                    flexShrink: 0,
                                  }}
                                >
                                  {route.badge}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="sidebar-tooltip">
                              {route.label}
                              {route.badge && (
                                <span style={{ marginLeft: 6, fontSize: 9.5, color: 'var(--gold)', fontWeight: 800 }}>
                                  ({route.badge})
                                </span>
                              )}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Footer & Expand/Collapse Trigger */}
          <div style={{ padding: sidebarCollapsed ? '10px 8px' : '12px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
            {sidebarCollapsed ? (
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Expand sidebar"
                title="Expand sidebar"
                style={{
                  width: '100%',
                  padding: '8px 0',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <ChevronRight size={17} />
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link
                  href="/student/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    textDecoration: 'none',
                    minWidth: 0,
                    flex: 1,
                    padding: '3px 4px',
                    borderRadius: 8,
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-elevated)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  title="View Profile & Settings"
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: '#090a0f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 11,
                      boxShadow: '0 2px 6px rgba(245, 158, 11, 0.25)',
                      flexShrink: 0,
                    }}
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', maxWidth: 105, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.name || 'Verified User'}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {role}
                    </div>
                  </div>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <ThemeToggle variant="icon" style={{ width: 26, height: 26 }} />
                  <Link
                    href="/student/profile"
                    aria-label="Profile Settings"
                    style={{ color: 'var(--text-muted)', padding: 5, borderRadius: 6, display: 'flex', alignItems: 'center' }}
                  >
                    <Settings size={14} />
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Sign out"
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 5, borderRadius: 6 }}
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* ── 2. NAVBAR MODE (Desktop: Horizontal Top Navigation Bar) ─────────────── */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {mounted && navigationStyle === 'navbar' && (
        <header
          aria-label="Primary top application navigation"
          style={{
            height: 68,
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            boxShadow: 'var(--shadow-sm)',
          }}
          className="hidden md:block"
        >
          <div
            style={{
              maxWidth: 1440,
              margin: '0 auto',
              padding: '0 20px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            {/* 1. LEFT: Brand Logo (clean single line, flex-shrink: 0) */}
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, minWidth: 175 }}>
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: 14,
                    color: '#090a0f',
                    boxShadow: '0 2px 8px rgba(245,158,11,0.25)',
                    flexShrink: 0,
                  }}
                >
                  SK
                </div>
                <span
                  className="font-display"
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  SkillSense <span style={{ color: 'var(--gold)' }}>AI</span>
                </span>
              </Link>
            </div>

            {/* 2. CENTER: Main Navigation (flex: 1, centered, clean gap, concise non-wrapping labels) */}
            <nav
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(4px, 0.8vw, 8px)',
                overflow: 'hidden',
              }}
            >
              {allRoutes.slice(0, 6).map((route) => {
                const Icon = route.icon;
                const active = isRouteActive(route.href);

                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    title={route.label}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                      padding: '7px 12px',
                      height: 38,
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: active ? 700 : 500,
                      color: active ? 'var(--gold)' : 'var(--text-secondary)',
                      background: active ? 'var(--gold-muted)' : 'transparent',
                      border: active ? '1px solid var(--gold-border)' : '1px solid transparent',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'var(--bg-surface-elevated)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    <Icon size={16} style={{ color: active ? 'var(--gold)' : 'currentColor', flexShrink: 0 }} />
                    <span className="hidden xl:inline">{route.label}</span>
                    <span className="inline xl:hidden">{route.shortLabel || route.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 3. RIGHT: Controls & Profile (flex-shrink: 0, 38px standardized height buttons) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {/* Compact Toggle Sidebar Button (38x38 icon-only with tooltip) */}
              <button
                type="button"
                onClick={() => setNavigationStyle('sidebar')}
                aria-label="Toggle Sidebar"
                title="Toggle Sidebar (Switch to Sidebar Layout)"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.borderColor = 'var(--gold)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <SidebarIcon size={18} />
              </button>

              <NotificationDropdown />
              <ThemeToggle variant="icon" style={{ width: 38, height: 38 }} />
              <UserProfileDropdown />
            </div>
          </div>
        </header>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* ── 3. MAIN DASHBOARD CONTENT AREA & TOPBAR ─────────────────────────────── */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Sticky Header (in Sidebar mode or on Mobile) */}
        <header
          style={{
            height: 60,
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border)',
            padding: '0 12px',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            boxShadow: 'var(--shadow-sm)',
            width: '100%',
          }}
          className={mounted && navigationStyle === 'navbar' ? 'md:hidden sm:px-6' : 'sm:px-6'}
        >
          {/* Left: Mobile Toggle & Brand Logo */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0, whiteSpace: 'nowrap' }}>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open mobile navigation drawer"
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              className="md:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Mobile Logo Brand */}
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 7, flexShrink: 0, whiteSpace: 'nowrap' }} className="md:hidden">
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 12,
                  color: '#090a0f',
                  flexShrink: 0,
                }}
              >
                SK
              </div>
              <span className="font-display" style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                SkillSense <span style={{ color: 'var(--gold)' }}>AI</span>
              </span>
            </div>

            {/* Desktop Breadcrumbs in Sidebar mode */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--text-muted)' }}>SkillSense</span>
              <span>/</span>
              <span style={{ textTransform: 'capitalize', color: 'var(--text-muted)' }}>{activeSection}</span>
              <span>/</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700, textTransform: 'capitalize' }}>
                {activePage}
              </span>
            </div>
          </div>

          {/* Right: Telemetry, Notifications, Theme & Profile */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0, whiteSpace: 'nowrap' }}>
            {/* Stakeholder Workspace Switcher (Desktop Only) */}
            <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 3, background: 'var(--bg-surface-elevated)', padding: 3, borderRadius: 8, border: '1px solid var(--border)' }}>
              {[
                { role: 'student', label: 'Student', href: '/student' },
                { role: 'institute', label: 'College', href: '/institute' },
                { role: 'employer', label: 'Employer', href: '/employer' },
                { role: 'government', label: 'Gov', href: '/government' },
              ].map((sw) => {
                const isCur = pathname.startsWith(sw.href);
                return (
                  <Link
                    key={sw.role}
                    href={sw.href}
                    style={{
                      fontSize: 11,
                      fontWeight: isCur ? 700 : 500,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: isCur ? 'var(--gold-muted)' : 'transparent',
                      color: isCur ? 'var(--gold)' : 'var(--text-muted)',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {sw.label}
                  </Link>
                );
              })}
            </div>

            {/* Live AI Telemetry Pill */}
            <Link
              href="/ai-health"
              className="hidden sm:inline-flex"
              style={{
                alignItems: 'center',
                gap: 5,
                padding: '4px 9px',
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: 99,
                fontSize: 10.5,
                fontWeight: 700,
                color: '#10b981',
                textDecoration: 'none',
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', animation: 'pulse-slow 2s infinite' }} />
              <span>LIVE TELEMETRY</span>
            </Link>

            {/* UI Guide Button */}
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="hidden sm:inline-flex"
              style={{
                fontSize: 11.5,
                padding: '5px 9px',
                alignItems: 'center',
                gap: 5,
                color: 'var(--gold)',
                border: '1px solid var(--gold-border)',
                background: 'var(--gold-muted)',
                borderRadius: 8,
                cursor: 'pointer',
              }}
              title="UI Feature Guide & Tips"
              aria-label="Open UI Feature Guide and Pro Tips"
            >
              <Lightbulb size={13} color="var(--gold)" />
              <span>UI Guide</span>
            </button>

            {/* Notification Dropdown */}
            <NotificationDropdown />

            {/* Theme Mode Toggle */}
            <ThemeToggle variant="icon" style={{ width: 38, height: 38 }} />

            {/* User Profile Dropdown */}
            <UserProfileDropdown />
          </div>
        </header>

        {/* Verification banner if applicable */}
        <VerificationBanner />

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            padding: '16px',
            maxWidth: 1400,
            width: '100%',
            margin: '0 auto',
          }}
          className="sm:p-5 md:p-7"
        >
          {children}
        </main>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* ── 4. MOBILE RESPONSIVE DRAWER ────────────────────────────────────────── */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(6px)',
                zIndex: 49,
              }}
              className="md:hidden"
            />

            {/* Slide-out Drawer */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: 300,
                maxWidth: '85vw',
                background: 'var(--bg-surface)',
                borderRight: '1px solid var(--border)',
                zIndex: 50,
                padding: '18px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-lg)',
              }}
              className="md:hidden"
            >
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#090a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12 }}>
                      SK
                    </div>
                    <span className="font-display" style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
                      SkillSense AI
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close navigation drawer"
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Workspace Role Switcher */}
                <div style={{ marginBottom: 14, background: 'var(--bg-surface-elevated)', padding: 3, borderRadius: 8, border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                  {[
                    { role: 'student', label: 'Student', href: '/student' },
                    { role: 'institute', label: 'College', href: '/institute' },
                    { role: 'employer', label: 'Employer', href: '/employer' },
                    { role: 'government', label: 'Gov', href: '/government' },
                  ].map((sw) => {
                    const isCur = pathname.startsWith(sw.href);
                    return (
                      <Link
                        key={sw.role}
                        href={sw.href}
                        onClick={() => setMobileOpen(false)}
                        style={{
                          fontSize: 10.5,
                          fontWeight: isCur ? 700 : 500,
                          padding: '5px 2px',
                          borderRadius: 6,
                          textAlign: 'center',
                          background: isCur ? 'var(--gold-muted)' : 'transparent',
                          color: isCur ? 'var(--gold)' : 'var(--text-muted)',
                          textDecoration: 'none',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {sw.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Navigation Links */}
                <div className="no-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', flex: 1, paddingRight: 4 }}>
                  {navGroups.map((group, gIdx) => (
                    <div key={gIdx}>
                      <div style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, paddingLeft: 4 }}>
                        {group.group}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {group.routes.map((route) => {
                          const Icon = route.icon;
                          const active = isRouteActive(route.href);

                          return (
                            <Link
                              key={route.href}
                              href={route.href}
                              onClick={() => setMobileOpen(false)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                minHeight: 42,
                                padding: '8px 10px',
                                borderRadius: 8,
                                fontSize: 13,
                                fontWeight: active ? 700 : 500,
                                color: active ? 'var(--gold)' : 'var(--text-primary)',
                                background: active ? 'var(--gold-muted)' : 'transparent',
                                borderLeft: active ? '3px solid var(--gold)' : '3px solid transparent',
                                textDecoration: 'none',
                              }}
                            >
                              <Icon size={16} style={{ color: active ? 'var(--gold)' : 'var(--text-secondary)' }} />
                              <span>{route.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile UI Guide Button */}
                <div style={{ padding: '8px 0', borderTop: '1px solid var(--border)' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setGuideOpen(true);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 8,
                      background: 'var(--gold-muted)',
                      border: '1px solid var(--gold-border)',
                      color: 'var(--gold)',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <Lightbulb size={14} />
                    <span>UI Feature Guide & Tips</span>
                  </button>
                </div>

                {/* Mobile Drawer Footer */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link
                      href="/student/profile"
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        textDecoration: 'none',
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          color: '#090a0f',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: 11,
                          flexShrink: 0,
                        }}
                      >
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 700, maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user?.name || 'Verified User'}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                          {role} · Profile →
                        </div>
                      </div>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ThemeToggle variant="icon" style={{ width: 30, height: 30 }} />
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="btn-ghost"
                        style={{ fontSize: 11, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <LogOut size={12} /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Interactive Feature Guide & Tips Modal ── */}
      <FeatureTipsGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
}
