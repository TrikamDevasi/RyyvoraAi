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
} from 'lucide-react';
import { FeatureTipsGuideModal } from '@/components/shared/FeatureTipsGuide';

function VerificationBanner() {
  const { user } = useAuth();
  if (!user || user.isVerified) return null;

  return (
    <div
      style={{
        background: 'rgba(245, 158, 11, 0.08)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 12.5,
        color: '#f59e0b',
        fontWeight: 600,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
        <span>Verification Pending · Please complete your profile to activate official NSQF ledger credentials.</span>
      </div>
      <Link
        href="/student/passport"
        style={{
          color: '#f59e0b',
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);

  // Initialize navigation preferences on mount
  useEffect(() => {
    setMounted(true);
    initPreferences();
  }, [initPreferences]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Close mobile drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setActiveDropdown(null);
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
    if (href === '/student' || href === '/institute' || href === '/industry' || href === '/government' || href === '/admin') {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    if (logout) await logout();
    router.push('/auth');
  };

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
            width: sidebarCollapsed ? 72 : 248,
            minWidth: sidebarCollapsed ? 72 : 248,
            background: 'var(--bg-surface)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            height: '100vh',
            zIndex: 40,
            transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="hidden md:flex"
        >
          {/* Top Brand Header */}
          <div>
            <div
              style={{
                height: 60,
                padding: sidebarCollapsed ? '0 16px' : '0 20px',
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
                    fontSize: 14,
                    color: '#090a0f',
                    flexShrink: 0,
                    boxShadow: '0 2px 10px rgba(245,158,11,0.3)',
                  }}
                >
                  SK
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <span className="font-display" style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                      SkillSense <span style={{ color: 'var(--gold)' }}>AI</span>
                    </span>
                    <div style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {role} Workspace
                    </div>
                  </div>
                )}
              </Link>

              {!sidebarCollapsed && (
                <button
                  type="button"
                  onClick={toggleSidebar}
                  aria-label="Collapse sidebar"
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                >
                  <ChevronLeft size={16} />
                </button>
              )}
            </div>

            {/* Navigation Groups */}
            <div style={{ padding: sidebarCollapsed ? '16px 8px' : '16px 12px', display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto', maxHeight: 'calc(100vh - 150px)' }}>
              {navGroups.map((group, gIdx) => (
                <div key={gIdx}>
                  {!sidebarCollapsed && (
                    <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 8px', marginBottom: 6 }}>
                      {group.group}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {group.routes.map((route) => {
                      const Icon = route.icon;
                      const active = isRouteActive(route.href);

                      return (
                        <Link
                          key={route.href}
                          href={route.href}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: sidebarCollapsed ? '10px 0' : '8px 12px',
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: active ? 700 : 500,
                            color: active ? '#f8fafc' : 'var(--text-secondary)',
                            background: active ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                            borderLeft: active ? '3px solid var(--gold)' : '3px solid transparent',
                            textDecoration: 'none',
                            transition: 'all 0.15s ease',
                          }}
                          title={sidebarCollapsed ? route.label : undefined}
                          aria-label={route.label}
                        >
                          <Icon size={16} color={active ? '#f59e0b' : 'currentColor'} />
                          {!sidebarCollapsed && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                              <span>{route.label}</span>
                              {route.badge && (
                                <span
                                  style={{
                                    fontSize: 9,
                                    fontWeight: 800,
                                    padding: '1px 5px',
                                    borderRadius: 4,
                                    background: route.badge === 'AI' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)',
                                    color: route.badge === 'AI' ? '#f59e0b' : 'var(--text-secondary)',
                                  }}
                                >
                                  {route.badge}
                                </span>
                              )}
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Footer & Expand Button */}
          <div style={{ padding: sidebarCollapsed ? '10px 8px' : '12px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
            {sidebarCollapsed ? (
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Expand sidebar"
                style={{ width: '100%', padding: '6px 0', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
              >
                <ChevronRight size={18} />
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11 }}>
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc', maxWidth: 110, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.name || 'Candidate'}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {role}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 4 }}>
                  <Link
                    href="/student/profile"
                    aria-label="Settings"
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
            height: 60,
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
          className="hidden md:block"
        >
          <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: 13,
                    color: '#090a0f',
                    boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
                  }}
                >
                  SK
                </div>
                <span className="font-display" style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc' }}>
                  SkillSense <span style={{ color: 'var(--gold)' }}>AI</span>
                </span>
              </Link>

              {/* Horizontal Navigation Items */}
              <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {allRoutes.slice(0, 7).map((route) => {
                  const Icon = route.icon;
                  const active = isRouteActive(route.href);

                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontSize: 12.5,
                        fontWeight: active ? 700 : 500,
                        color: active ? 'var(--gold)' : 'var(--text-secondary)',
                        background: active ? 'rgba(245,158,11,0.1)' : 'transparent',
                        borderBottom: active ? '2px solid var(--gold)' : '2px solid transparent',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon size={14} />
                      <span>{route.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Quick Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* UI Guide & Feature Tips Button */}
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="btn-secondary"
                style={{
                  fontSize: 11.5,
                  padding: '5px 11px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  color: 'var(--gold)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  background: 'rgba(245,158,11,0.06)',
                }}
                aria-label="Open UI Feature Guide and Pro Tips"
              >
                <Lightbulb size={13} color="var(--gold)" />
                <span>UI Guide</span>
              </button>

              {/* Telemetry Pill */}
              <Link
                href="/ai-health"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 8px',
                  background: 'rgba(16,185,129,0.06)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: 99,
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: '#34d399',
                  textDecoration: 'none',
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', animation: 'pulse-slow 2s infinite' }} />
                <span>AI LIVE</span>
              </Link>

              {/* Layout Switcher */}
              <button
                type="button"
                onClick={() => setNavigationStyle('sidebar')}
                title="Switch layout to Sidebar mode"
                aria-label="Switch layout to Sidebar mode"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  padding: '4px 8px',
                  color: 'var(--text-secondary)',
                  fontSize: 11,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <SidebarIcon size={12} />
                <span>Sidebar</span>
              </button>

              {/* User Dropdown / Settings Link */}
              <Link
                href="/student/profile"
                className="btn-secondary"
                style={{ fontSize: 11.5, padding: '5px 10px' }}
                aria-label="Profile and Settings"
              >
                <Settings size={13} /> Settings
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="btn-ghost"
                style={{ fontSize: 11.5, padding: '5px 8px' }}
                aria-label="Logout"
              >
                <LogOut size={13} />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* ── 3. MAIN CONTENT CONTAINER ─────────────────────────────────────────── */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar: Rendered on Desktop in Sidebar mode, OR on Mobile for both modes */}
        <header
          style={{
            height: 56,
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
          className={mounted && navigationStyle === 'navbar' ? 'md:hidden flex' : 'flex'}
        >
          {/* Left: Mobile Toggle & App Identity or Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open mobile navigation drawer"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: 7,
                color: '#f8fafc',
                cursor: 'pointer',
                padding: '6px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="md:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Mobile Logo Brand */}
            <div className="flex md:hidden" style={{ alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 11,
                  color: '#090a0f',
                }}
              >
                SK
              </div>
              <span className="font-display" style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>
                SkillSense <span style={{ color: 'var(--gold)' }}>AI</span>
              </span>
            </div>

            {/* Desktop Breadcrumbs in Sidebar mode */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--text-muted)' }}>SkillSense</span>
              <span>/</span>
              <span style={{ color: '#f8fafc', fontWeight: 600, textTransform: 'capitalize' }}>
                {pathname.split('/')[2] || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Right: Workspace Switcher & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Stakeholder Workspace Switcher (Desktop Only) */}
            <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 3, background: 'rgba(255,255,255,0.03)', padding: 3, borderRadius: 8, border: '1px solid var(--border)' }}>
              {[
                { role: 'student', label: 'Student', href: '/student' },
                { role: 'institute', label: 'Institute', href: '/institute' },
                { role: 'industry', label: 'Industry', href: '/industry' },
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
                      background: isCur ? 'rgba(245,158,11,0.15)' : 'transparent',
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

            {/* Quick Layout Style Toggle Button in Desktop Topbar */}
            <button
              type="button"
              onClick={() => setNavigationStyle(navigationStyle === 'sidebar' ? 'navbar' : 'sidebar')}
              title={`Switch layout to ${navigationStyle === 'sidebar' ? 'Top Navbar' : 'Sidebar'}`}
              aria-label={`Switch layout to ${navigationStyle === 'sidebar' ? 'Top Navbar' : 'Sidebar'}`}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '4px 8px',
                color: 'var(--text-secondary)',
                fontSize: 11,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
              className="hidden md:flex"
            >
              <Layout size={12} />
              <span>{navigationStyle === 'sidebar' ? 'Navbar Mode' : 'Sidebar Mode'}</span>
            </button>

            {/* UI Guide Button */}
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="btn-secondary"
              style={{
                fontSize: 11,
                padding: '4px 9px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                color: 'var(--gold)',
                border: '1px solid rgba(245,158,11,0.3)',
                background: 'rgba(245,158,11,0.06)',
                cursor: 'pointer',
              }}
              title="UI Feature Guide & Tips"
              aria-label="Open UI Feature Guide and Pro Tips"
            >
              <Lightbulb size={12} color="var(--gold)" />
              <span className="hidden sm:inline">UI Guide</span>
            </button>

            {/* Live AI Telemetry Pill */}
            <Link
              href="/ai-health"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 8px',
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 99,
                fontSize: 10.5,
                fontWeight: 700,
                color: '#34d399',
                textDecoration: 'none',
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', animation: 'pulse-slow 2s infinite' }} />
              <span>AI LIVE</span>
            </Link>

            <Link
              href="/student/analyzer"
              className="btn-gold hidden sm:inline-flex"
              style={{ fontSize: 11.5, padding: '4px 10px' }}
            >
              <Sparkles size={12} /> Analyzer
            </Link>
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
                background: 'rgba(0,0,0,0.8)',
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
              initial={{ opacity: 0, x: -280 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -280 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: 290,
                maxWidth: '85vw',
                background: '#0e111a',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                zIndex: 50,
                padding: '18px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
              }}
              className="md:hidden"
            >
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--gold)', color: '#090a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12 }}>
                      SK
                    </div>
                    <span className="font-display" style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc' }}>
                      SkillSense AI
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close navigation drawer"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
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

                {/* Workspace Role Switcher Pills */}
                <div style={{ marginBottom: 16, background: 'rgba(255,255,255,0.03)', padding: 3, borderRadius: 8, border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                  {[
                    { role: 'student', label: 'Student', href: '/student' },
                    { role: 'institute', label: 'College', href: '/institute' },
                    { role: 'industry', label: 'Company', href: '/industry' },
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
                          background: isCur ? 'rgba(245,158,11,0.15)' : 'transparent',
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
                                padding: '8px 10px',
                                borderRadius: 8,
                                fontSize: 12.5,
                                fontWeight: active ? 700 : 500,
                                color: active ? 'var(--gold)' : '#cbd5e1',
                                background: active ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                                borderLeft: active ? '3px solid var(--gold)' : '3px solid transparent',
                                textDecoration: 'none',
                              }}
                            >
                              <Icon size={15} />
                              <span>{route.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile Feature Guide Button */}
                <div style={{ padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
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
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
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
                    <span>💡 UI Feature Guide & Tips</span>
                  </button>
                </div>

                {/* Mobile Drawer Footer */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#f8fafc', fontWeight: 700, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.name || 'Candidate'}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                        {role} account
                      </div>
                    </div>

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
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Interactive Feature Guide & Tips Modal ── */}
      <FeatureTipsGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
}
