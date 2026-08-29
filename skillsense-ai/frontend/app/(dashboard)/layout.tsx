'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import VerificationBanner from '@/components/shared/VerificationBanner';
import { useAuthStore } from '@/store/authStore';
import { Menu, X, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';

const GOLD = '#F59E0B';
const AMBER = '#F59E0B';
const GOLD_L = '#FBBF24';

const NAV = [
    {
        group: 'Student', accent: GOLD, routes: [
            { label: 'Overview', href: '/student' },
            { label: 'Skill Passport', href: '/student/passport' },
            { label: 'AI Analyzer', href: '/student/analyzer' },
            { label: 'Assessments', href: '/student/assessments' },
            { label: 'Find Jobs', href: '/student/jobs', badge: 'NEW' },
            { label: 'Leaderboard', href: '/student/leaderboard', badge: 'HOT' },
            { label: 'Career Path', href: '/student/career' },
            { label: 'Market Trends', href: '/student/market' },
            { label: 'My Submissions', href: '/student/submissions' },
            { label: 'Profile', href: '/student/profile' },
        ],
    },
    {
        group: 'Institute', accent: GOLD_L, routes: [
            { label: 'Overview', href: '/institute' },
            { label: 'Students', href: '/institute/students' },
            { label: 'Evaluations', href: '/institute/evaluations' },
            { label: 'Placements', href: '/institute/placement' },
            { label: 'Program ROI', href: '/institute/roi' },
            { label: 'Upload Data', href: '/institute/upload' },
            { label: 'Latest News', href: '/institute/news' },
        ],
    },
    {
        group: 'Employer', accent: AMBER, routes: [
            { label: 'Overview', href: '/employer' },
            { label: 'Feedback', href: '/employer/feedback' },
            { label: 'Skill Validation', href: '/employer/validations' },
            { label: 'Placements', href: '/employer/placements' },
        ],
    },
    {
        group: 'Industry', accent: GOLD, routes: [
            { label: 'Overview', href: '/industry' },
            { label: 'Talent Pool', href: '/industry/talent' },
            { label: 'Demand Signals', href: '/industry/demand' },
            { label: 'Campus Connect', href: '/industry/campus' },
            { label: 'Latest News', href: '/industry/news' },
        ],
    },
    {
        group: 'Government', accent: AMBER, routes: [
            { label: 'Overview', href: '/government' },
            { label: 'Region Heatmap', href: '/government/heatmap' },
            { label: 'Fund Targeting', href: '/government/fund-targeting' },
            { label: 'Compliance', href: '/government/compliance' },
            { label: 'Latest News', href: '/government/news' },
        ],
    },
    {
        group: 'Admin', accent: AMBER, routes: [
            { label: 'Overview', href: '/admin' },
            { label: 'Users', href: '/admin/users' },
            { label: 'Institutes', href: '/admin/institutes' },
            { label: 'Fairness', href: '/admin/fairness' },
            { label: 'Audit Logs', href: '/admin/audit-logs' },
            { label: 'Reports', href: '/admin/reports' },
        ],
    },
];

const ROLE_GROUP_MAP: Record<string, string> = {
    student: 'Student',
    institute: 'Institute',
    employer: 'Employer',
    industry: 'Industry',
    government: 'Government',
    admin: 'Admin',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const moreMenuRef = useRef<HTMLDivElement>(null);

    const user = useAuthStore(s => s.user);
    const logout = useAuthStore(s => s.logout);
    const checkAuth = useAuthStore(s => s.checkAuth);

    useEffect(() => {
        setMounted(true);
        checkAuth();
    }, [checkAuth]);

    const userName = (mounted && user?.name) ? user.name : 'User';
    const userRole = (mounted && user?.role) ? user.role : 'student';
    const isVerified = user?.isVerified ?? true;

    // Close menus on route change
    useEffect(() => {
        setMobileOpen(false);
        setShowMoreMenu(false);
        setShowDropdown(false);
    }, [pathname]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
            if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
                setShowMoreMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Filter NAV based on role
    const currentNavGroup = NAV.find(n => n.group === (ROLE_GROUP_MAP[userRole] || 'Student')) || NAV[0];
    const routes = currentNavGroup.routes;

    // Primary routes (first 6) and overflow routes
    const primaryRoutes = routes.slice(0, 6);
    const overflowRoutes = routes.slice(6);

    const initials = userName !== 'User'
        ? userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#08060f', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            
            <style jsx>{`
                .nav-desktop-container {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    flex-wrap: nowrap;
                }
                .mobile-toggle-btn {
                    display: none;
                }
                @media (max-width: 990px) {
                    .nav-desktop-container {
                        display: none !important;
                    }
                    .mobile-toggle-btn {
                        display: flex !important;
                    }
                }
            `}</style>

            {/* ── Proper Top Navigation Bar ── */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(8, 6, 15, 0.96)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(245, 158, 11, 0.15)',
            }}>
                <div style={{
                    maxWidth: 1360, margin: '0 auto', padding: '0 20px',
                    height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16
                }}>
                    
                    {/* Left: Brand Logo & Role Pill */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <Link href={`/${userRole}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: 8,
                                background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 14px rgba(245, 158, 11, 0.35)'
                            }}>
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                                        stroke="#08060f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="font-display text-gradient-gold" style={{ fontWeight: 900, fontSize: 16, color: '#fff', letterSpacing: '-0.02em' }}>
                                SkillSense AI
                            </span>
                        </Link>

                        {/* Active Role Badge */}
                        <span
                            suppressHydrationWarning
                            style={{
                                fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
                                background: 'rgba(245, 158, 11, 0.12)', color: GOLD,
                                border: '1px solid rgba(245, 158, 11, 0.25)',
                                textTransform: 'uppercase', letterSpacing: '0.06em'
                            }}
                        >
                            {currentNavGroup.group}
                        </span>
                    </div>

                    {/* Middle: Horizontal Nav Items (Desktop) */}
                    <nav className="nav-desktop-container">
                        {primaryRoutes.map(({ label, href, badge }: any) => {
                            const active = pathname === href || pathname === `${href}/`;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 5,
                                        padding: '6px 12px', borderRadius: 8,
                                        fontSize: 13, textDecoration: 'none',
                                        color: active ? '#FFFFFF' : '#94A3B8',
                                        fontWeight: active ? 700 : 500,
                                        background: active ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                                        border: active ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                                        transition: 'all 0.15s ease',
                                        whiteSpace: 'nowrap',
                                    }}
                                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#FFFFFF'; }}
                                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#94A3B8'; }}
                                >
                                    <span>{label}</span>
                                    {badge && (
                                        <span style={{
                                            fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4,
                                            background: badge === 'HOT' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                                            color: badge === 'HOT' ? '#ef4444' : GOLD,
                                        }}>
                                            {badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}

                        {/* More Menu Dropdown for Overflow Routes */}
                        {overflowRoutes.length > 0 && (
                            <div ref={moreMenuRef} style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 4,
                                        padding: '6px 12px', borderRadius: 8,
                                        fontSize: 13, color: '#94A3B8', fontWeight: 500,
                                        background: showMoreMenu ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                                        border: '1px solid transparent', cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <span>More</span>
                                    <ChevronDown size={13} />
                                </button>

                                {showMoreMenu && (
                                    <div style={{
                                        position: 'absolute', top: '100%', right: 0, marginTop: 6,
                                        width: 190, background: '#0d0b1d', border: '1px solid rgba(245, 158, 11, 0.25)',
                                        borderRadius: 10, padding: '6px', boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
                                        zIndex: 150,
                                    }}>
                                        {overflowRoutes.map(({ label, href, badge }: any) => {
                                            const active = pathname === href;
                                            return (
                                                <Link
                                                    key={href}
                                                    href={href}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                        padding: '8px 12px', borderRadius: 6,
                                                        fontSize: 13, textDecoration: 'none',
                                                        color: active ? '#FFFFFF' : '#94A3B8',
                                                        fontWeight: active ? 700 : 500,
                                                        background: active ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                                                    }}
                                                >
                                                    <span>{label}</span>
                                                    {badge && (
                                                        <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4, background: 'rgba(245,158,11,0.2)', color: GOLD }}>
                                                            {badge}
                                                        </span>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </nav>

                    {/* Right: User Profile & Mobile Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        
                        {/* Profile Dropdown */}
                        <div ref={dropdownRef} style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: 99, padding: '4px 10px 4px 4px', cursor: 'pointer',
                                }}
                            >
                                <div
                                    suppressHydrationWarning
                                    style={{
                                        width: 28, height: 28, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                                        color: '#08060F', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 11, fontWeight: 800,
                                    }}
                                >
                                    {initials}
                                </div>
                                <span suppressHydrationWarning style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                                    {userName.split(' ')[0]}
                                </span>
                                <ChevronDown size={13} color="#94A3B8" />
                            </button>

                            {showDropdown && (
                                <div style={{
                                    position: 'absolute', right: 0, top: '100%', marginTop: 8,
                                    width: 220, background: '#0d0b1d', border: '1px solid rgba(245, 158, 11, 0.25)',
                                    borderRadius: 12, padding: '8px', boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
                                    zIndex: 150,
                                }}>
                                    <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: 4 }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{userName}</div>
                                        <div style={{ fontSize: 11, color: '#94A3B8', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email}</div>
                                        <div style={{ fontSize: 10, color: GOLD, marginTop: 3, textTransform: 'capitalize', fontWeight: 600 }}>{userRole} Account</div>
                                    </div>
                                    <button
                                        onClick={() => logout()}
                                        style={{
                                            width: '100%', textAlign: 'left', padding: '8px 10px',
                                            background: 'transparent', border: 'none', color: '#ef4444',
                                            fontSize: 12, fontWeight: 600, cursor: 'pointer', borderRadius: 6,
                                            display: 'flex', alignItems: 'center', gap: 8,
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Hamburger Toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle navigation menu"
                            className="mobile-toggle-btn"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 8, padding: '7px', color: '#fff', cursor: 'pointer',
                                alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>

                {/* ── Mobile Navigation Dropdown ── */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                background: '#0d0b1d', borderTop: '1px solid rgba(245, 158, 11, 0.15)',
                                padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: 4,
                            }}
                        >
                            <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, textTransform: 'uppercase', padding: '4px 8px', letterSpacing: '0.06em' }}>
                                {currentNavGroup.group} Navigation
                            </div>
                            {routes.map(({ label, href, badge }: any) => {
                                const active = pathname === href || pathname === `${href}/`;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setMobileOpen(false)}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '10px 12px', borderRadius: 8,
                                            fontSize: 14, textDecoration: 'none',
                                            color: active ? '#FFFFFF' : '#94A3B8',
                                            fontWeight: active ? 700 : 500,
                                            background: active ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                                            borderLeft: active ? `3px solid ${GOLD}` : '3px solid transparent',
                                        }}
                                    >
                                        <span>{label}</span>
                                        {badge && (
                                            <span style={{
                                                fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 4,
                                                background: badge === 'HOT' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                                                color: badge === 'HOT' ? '#ef4444' : GOLD,
                                            }}>
                                                {badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {!isVerified && <VerificationBanner />}

            {/* ── Main Full-Width Content Container ── */}
            <main style={{
                flex: 1, width: '100%', maxWidth: 1360, margin: '0 auto',
                padding: '24px 20px', overflowY: 'auto'
            }}>
                {children}
            </main>
        </div>
    );
}
