'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import VerificationBanner from '@/components/shared/VerificationBanner';
import { useAuthStore } from '@/store/authStore';
import { Menu, X, ChevronDown, ChevronRight, LogOut, User as UserIcon } from 'lucide-react';

const GOLD = '#F59E0B';
const AMBER = '#F59E0B';
const GOLD_L = '#FBBF24';

const NAV = [
    {
        group: 'Student', accent: GOLD, routes: [
            { label: 'Overview', href: '/student' },
            { label: 'Skill Passport', href: '/student/passport' },
            { label: 'AI Analyzer', href: '/student/analyzer' },
            { label: 'My Submissions', href: '/student/submissions' },
            { label: 'Assessments', href: '/student/assessments' },
            { label: 'Tests', href: '/student/tests' },
            { label: 'Leaderboard', href: '/student/leaderboard', badge: 'HOT' },
            { label: 'Find Jobs', href: '/student/jobs', badge: 'NEW' },
            { label: 'Career Path', href: '/student/career' },
            { label: 'Market Trends', href: '/student/market' },
            { label: 'Profile', href: '/student/profile' },
            { label: 'Latest News', href: '/student/news' },
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
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const user = useAuthStore(s => s.user);
    const logout = useAuthStore(s => s.logout);
    const checkAuth = useAuthStore(s => s.checkAuth);

    const userName = user?.name || 'User';
    const userRole = user?.role || 'student';
    const isVerified = user?.isVerified ?? true;

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Handle screen resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCollapsed(true);
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

    // Filter NAV based on role
    const filteredNav = userRole
        ? NAV.filter(n => n.group === ROLE_GROUP_MAP[userRole])
        : NAV;

    const [openGroups, setOpenGroups] = useState<string[]>(filteredNav.map(n => n.group));

    useEffect(() => {
        setOpenGroups(filteredNav.map(n => n.group));
    }, [userRole]);

    const toggleGroup = (g: string) =>
        setOpenGroups(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

    const parts = pathname.split('/').filter(Boolean);
    const crumb = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ');

    const initials = userName
        ? userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    const renderNavContent = () => (
        <>
            {/* Logo row */}
            <div style={{
                padding: '18px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
                borderBottom: '1px solid rgba(245,158,11,0.1)', flexShrink: 0,
                justifyContent: collapsed && !mobileOpen ? 'center' : 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                        background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                                stroke="#08060f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    {(!collapsed || mobileOpen) && (
                        <span className="font-display text-gradient-gold" style={{ fontWeight: 900, fontSize: 16, color: '#fff', whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>
                            SkillSense AI
                        </span>
                    )}
                </div>
                {mobileOpen && (
                    <button onClick={() => setMobileOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Nav Links */}
            <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
                {filteredNav.map(({ group, accent, routes }) => {
                    const isOpen = openGroups.includes(group);
                    const isGroupActive = routes.some(r => pathname === r.href || pathname.startsWith(r.href + '/'));
                    return (
                        <div key={group}>
                            <button
                                onClick={() => (!collapsed || mobileOpen) && toggleGroup(group)}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                                    padding: collapsed && !mobileOpen ? '8px 0' : '7px 16px',
                                    border: 'none', background: 'transparent', cursor: 'pointer',
                                    color: isGroupActive ? accent : '#94a3b8',
                                    justifyContent: collapsed && !mobileOpen ? 'center' : 'space-between',
                                    transition: 'color 0.15s',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{
                                        width: 6, height: 6, borderRadius: '50%',
                                        background: isGroupActive ? accent : '#334155', flexShrink: 0,
                                    }} />
                                    {(!collapsed || mobileOpen) && (
                                        <span className="font-display" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                            {group}
                                        </span>
                                    )}
                                </div>
                                {(!collapsed || mobileOpen) && (
                                    <span style={{ fontSize: 10, opacity: 0.4, marginLeft: 'auto' }}>{isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}</span>
                                )}
                            </button>

                            {isOpen && (!collapsed || mobileOpen) && (
                                <div style={{ paddingBottom: 4 }}>
                                    {routes.map(({ label, href, badge }: any) => {
                                        const active = pathname === href || pathname === `${href}/`;
                                        return (
                                            <Link
                                                key={href}
                                                href={href}
                                                style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                    padding: '7px 16px 7px 30px',
                                                    fontSize: 13, textDecoration: 'none',
                                                    color: active ? '#fff' : '#94a3b8',
                                                    fontWeight: active ? 600 : 400,
                                                    background: active ? 'rgba(245,158,11,0.08)' : 'transparent',
                                                    borderLeft: active ? `2px solid ${accent}` : '2px solid transparent',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                <span>{label}</span>
                                                {badge && (
                                                    <span style={{
                                                        fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4,
                                                        background: badge === 'HOT' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                                                        color: badge === 'HOT' ? '#ef4444' : accent,
                                                    }}>
                                                        {badge}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Bottom user profile & collapse toggle */}
            <div style={{
                padding: '12px 16px',
                borderTop: '1px solid rgba(245,158,11,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                {(!collapsed || mobileOpen) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: 'rgba(245,158,11,0.2)', color: '#F59E0B',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 700,
                        }}>
                            {initials}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {userName}
                            </div>
                            <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'capitalize' }}>
                                {userRole}
                            </div>
                        </div>
                    </div>
                )}
                {!mobileOpen && (
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            background: 'transparent', border: 'none', color: '#94a3b8',
                            cursor: 'pointer', padding: 4, fontSize: 12,
                        }}
                    >
                        {collapsed ? '→' : '←'}
                    </button>
                )}
            </div>
        </>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#08060f', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

            {/* Desktop Sidebar (hidden on mobile, visible md+) */}
            <aside style={{
                width: collapsed ? 56 : 218, flexShrink: 0,
                background: 'rgba(245,158,11,0.02)',
                borderRight: '1px solid rgba(245,158,11,0.08)',
                display: 'flex', flexDirection: 'column',
                transition: 'width 0.25s ease', overflowX: 'hidden',
            }} className="hidden md:flex">
                {renderNavContent()}
            </aside>

            {/* Mobile Drawer Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                                backdropFilter: 'blur(6px)', zIndex: 90,
                            }}
                            className="md:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            style={{
                                position: 'fixed', left: 0, top: 0, bottom: 0, width: 260,
                                background: '#0d0b1d', borderRight: '1px solid rgba(245,158,11,0.2)',
                                zIndex: 100, display: 'flex', flexDirection: 'column',
                            }}
                            className="md:hidden"
                        >
                            {renderNavContent()}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#08060f' }}>
                {/* Topbar */}
                <header style={{
                    height: 56, flexShrink: 0,
                    borderBottom: '1px solid rgba(245,158,11,0.08)',
                    background: 'rgba(8,6,15,0.85)', backdropFilter: 'blur(12px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 16px', position: 'sticky', top: 0, zIndex: 40,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open Navigation Menu"
                            style={{
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 8, padding: '6px', color: '#fff', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                            className="md:hidden"
                        >
                            <Menu size={18} />
                        </button>
                        <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {crumb || 'Dashboard'}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div ref={dropdownRef} style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    background: 'transparent', border: 'none', cursor: 'pointer',
                                    padding: '4px', borderRadius: 8,
                                }}
                            >
                                <div style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                                    color: '#08060f', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 12, fontWeight: 800,
                                }}>
                                    {initials}
                                </div>
                            </button>

                            {showDropdown && (
                                <div style={{
                                    position: 'absolute', right: 0, top: '100%', marginTop: 8,
                                    width: 200, background: '#0f0d1c', border: '1px solid rgba(245,158,11,0.2)',
                                    borderRadius: 10, padding: '6px 0', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                    zIndex: 50,
                                }}>
                                    <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{userName}</div>
                                        <div style={{ fontSize: 11, color: '#94a3b8', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email}</div>
                                    </div>
                                    <button
                                        onClick={() => logout()}
                                        style={{
                                            width: '100%', textAlign: 'left', padding: '8px 16px',
                                            background: 'transparent', border: 'none', color: '#ef4444',
                                            fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: 6,
                                        }}
                                    >
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {!isVerified && <VerificationBanner />}

                {/* Page body */}
                <main style={{ flex: 1, padding: '18px 14px', overflowY: 'auto' }} className="md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
