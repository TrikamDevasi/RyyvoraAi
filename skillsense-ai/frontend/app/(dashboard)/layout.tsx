'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import VerificationBanner from '@/components/shared/VerificationBanner';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  Award,
  Brain,
  FileCode,
  CheckSquare,
  Trophy,
  Briefcase,
  Compass,
  TrendingUp,
  User,
  Newspaper,
  Building,
  Landmark,
  Shield,
  Activity,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';

interface RouteItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  group: string;
  role: string;
  routes: RouteItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: 'Student Intelligence',
    role: 'student',
    routes: [
      { label: 'Overview', href: '/student', icon: LayoutDashboard },
      { label: 'AI Skill Analyzer', href: '/student/analyzer', icon: Brain, badge: 'AI' },
      { label: 'Skill Passport', href: '/student/passport', icon: Award, badge: 'VERIFIED' },
      { label: 'Assessments', href: '/student/assessment', icon: CheckSquare },
      { label: 'Career Predictor', href: '/student/career', icon: Compass },
      { label: 'My Submissions', href: '/student/submissions', icon: FileCode },
      { label: 'Find Jobs', href: '/student/jobs', icon: Briefcase, badge: 'NEW' },
      { label: 'Market Demand', href: '/student/market', icon: TrendingUp },
      { label: 'Leaderboard', href: '/student/leaderboard', icon: Trophy },
      { label: 'Profile', href: '/student/profile', icon: User },
      { label: 'Latest News', href: '/student/news', icon: Newspaper },
    ],
  },
  {
    group: 'Institute Workspace',
    role: 'institute',
    routes: [
      { label: 'Overview', href: '/institute', icon: LayoutDashboard },
      { label: 'Students Directory', href: '/institute/students', icon: User },
      { label: 'Evaluations Ledger', href: '/institute/evaluations', icon: CheckSquare },
      { label: 'Placement Pipeline', href: '/institute/placement', icon: Briefcase },
      { label: 'Program ROI', href: '/institute/roi', icon: TrendingUp },
      { label: 'Upload Cohort Data', href: '/institute/upload', icon: FileCode },
      { label: 'Latest News', href: '/institute/news', icon: Newspaper },
    ],
  },
  {
    group: 'Employer Hub',
    role: 'employer',
    routes: [
      { label: 'Overview', href: '/employer', icon: LayoutDashboard },
      { label: 'Feedback Ledgers', href: '/employer/feedback', icon: CheckSquare },
      { label: 'Skill Validation', href: '/employer/validations', icon: Shield },
      { label: 'Candidate Placement', href: '/employer/placements', icon: Briefcase },
    ],
  },
  {
    group: 'Industry Portal',
    role: 'industry',
    routes: [
      { label: 'Overview', href: '/industry', icon: LayoutDashboard },
      { label: 'Talent Pool', href: '/industry/talent', icon: User },
      { label: 'Demand Signals', href: '/industry/demand', icon: TrendingUp },
      { label: 'Campus Connect', href: '/industry/campus', icon: Building },
      { label: 'Latest News', href: '/industry/news', icon: Newspaper },
    ],
  },
  {
    group: 'Government / Regulatory',
    role: 'government',
    routes: [
      { label: 'Overview', href: '/government', icon: LayoutDashboard },
      { label: 'Regional Heatmap', href: '/government/heatmap', icon: Landmark },
      { label: 'Fund Targeting', href: '/government/fund-targeting', icon: TrendingUp },
      { label: 'NSQF Compliance', href: '/government/compliance', icon: Shield },
      { label: 'Latest News', href: '/government/news', icon: Newspaper },
    ],
  },
  {
    group: 'Admin Control Center',
    role: 'admin',
    routes: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'User Directory', href: '/admin/users', icon: User },
      { label: 'Institutes', href: '/admin/institutes', icon: Building },
      { label: 'AI Fairness Audit', href: '/admin/fairness', icon: Shield },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: Activity },
      { label: 'Institutional Reports', href: '/admin/reports', icon: FileCode },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const checkAuth = useAuthStore((s) => s.checkAuth);

  const userName = user?.name || 'Candidate';
  const userRole = user?.role || 'student';
  const userEmail = user?.email || '';

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle responsive collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Filter navigation for the user's role
  const activeNav = NAV_GROUPS.find((n) => n.role === userRole) || NAV_GROUPS[0];

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const initials = userName
    ? userName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'SK';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)' }}>
      {/* ── Sidebar (Desktop) ── */}
      <aside
        style={{
          width: collapsed ? 72 : 248,
          minWidth: collapsed ? 72 : 248,
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
        }}
        className="hidden md:flex"
      >
        <div>
          {/* Brand Header */}
          <div
            style={{
              padding: collapsed ? '18px 12px' : '18px 16px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'space-between',
            }}
          >
            <Link
              href={activeNav.routes[0].href}
              style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff' }}
            >
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
                  boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
                }}
              >
                SK
              </div>
              {!collapsed && (
                <div>
                  <div className="font-display" style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' }}>
                    SkillSense <span style={{ color: 'var(--gold)' }}>AI</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {activeNav.role} platform
                  </div>
                </div>
              )}
            </Link>

            {!collapsed && (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 4,
                }}
                title="Collapse sidebar"
              >
                <ChevronLeft size={16} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <div style={{ padding: '14px 8px', overflowY: 'auto', maxHeight: 'calc(100vh - 160px)' }}>
            {!collapsed && (
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '4px 10px 8px',
                }}
              >
                {activeNav.group}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {activeNav.routes.map((route) => {
                const Icon = route.icon;
                const isActive = pathname === route.href || (route.href !== '/student' && pathname.startsWith(route.href));

                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: collapsed ? '10px 0' : '8px 12px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#f8fafc' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--gold)' : '3px solid transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                    title={collapsed ? route.label : undefined}
                  >
                    <Icon size={16} color={isActive ? '#f59e0b' : 'currentColor'} />
                    {!collapsed && (
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
        </div>

        {/* Bottom User Area */}
        <div
          style={{
            padding: collapsed ? '12px 6px' : '12px 12px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-surface)',
          }}
        >
          {collapsed ? (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              style={{
                width: '100%',
                padding: '8px 0',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
              }}
              title="Expand sidebar"
            >
              <ChevronRight size={16} />
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {initials}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {userName}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {userRole}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 6,
                  borderRadius: 6,
                }}
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header
          style={{
            height: 56,
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--text-muted)' }}>SkillSense</span>
              <span>/</span>
              <span style={{ color: '#f8fafc', fontWeight: 600, textTransform: 'capitalize' }}>
                {pathname.split('/')[2] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Live AI Telemetry Pill */}
            <Link
              href="/ai-health"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 700,
                color: '#34d399',
                textDecoration: 'none',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse-slow 2s infinite' }} />
              <span>AI TELEMETRY LIVE</span>
            </Link>

            <Link
              href="/student/analyzer"
              className="btn-gold hidden sm:inline-flex"
              style={{ fontSize: 12, padding: '5px 12px' }}
            >
              <Sparkles size={13} /> Analyzer
            </Link>
          </div>
        </header>

        {/* Verification banner if applicable */}
        <VerificationBanner />

        {/* Page View Container */}
        <main style={{ flex: 1, padding: '24px 28px', maxWidth: 1400, width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -260 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -260 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: 260,
              background: 'var(--bg-surface)',
              borderRight: '1px solid var(--border)',
              zIndex: 50,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div className="font-display" style={{ fontSize: 16, fontWeight: 800 }}>
                  SkillSense <span style={{ color: 'var(--gold)' }}>AI</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {activeNav.routes.map((route) => {
                  const Icon = route.icon;
                  const isActive = pathname === route.href;
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        borderRadius: 8,
                        fontSize: 13.5,
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#f8fafc' : 'var(--text-secondary)',
                        background: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                        textDecoration: 'none',
                      }}
                    >
                      <Icon size={16} color={isActive ? '#f59e0b' : 'currentColor'} />
                      <span>{route.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
