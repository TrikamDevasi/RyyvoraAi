'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import VerificationBanner from '@/components/shared/VerificationBanner';

const GOLD = '#D4A843';
const AMBER = '#F59E0B';
const GOLD_L = '#F0C05A';

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
        group: 'Institute', accent: GOLD_L || '#F0C05A', routes: [
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
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [userAvatar, setUserAvatar] = useState('');
    const [isVerified, setIsVerified] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('ss_user');
            if (stored) {
                const parsed = JSON.parse(stored);
                setUserName(parsed.name || 'User');
                setUserRole(parsed.role || '');
                setUserAvatar(parsed.avatar || '');
            }
        } catch { }

        // Listen for avatar updates from profile page
        const handleAvatarUpdate = () => {
            try {
                const stored = localStorage.getItem('ss_user');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setUserName(parsed.name || 'User');
                    setUserRole(parsed.role || '');
                    setUserAvatar(parsed.avatar || '');
                    setIsVerified(parsed.isVerified || false);
                }
            } catch { }
        };
        window.addEventListener('avatar-updated', handleAvatarUpdate);
        window.addEventListener('storage', handleAvatarUpdate);
        // Also poll periodically for cross-component updates
        const interval = setInterval(handleAvatarUpdate, 2000);
        return () => {
            window.removeEventListener('avatar-updated', handleAvatarUpdate);
            window.removeEventListener('storage', handleAvatarUpdate);
            clearInterval(interval);
        };
    }, []);

    // Auto-collapse for mobile screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
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

    const handleLogout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        localStorage.clear();
        router.push('/auth');
    };

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

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#08060f', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

            {/* Sidebar */}
            <aside style={{
                width: collapsed ? 56 : 218, flexShrink: 0,
                background: 'rgba(212,168,67,0.02)',
                borderRight: '1px solid rgba(212,168,67,0.08)',
                display: 'flex', flexDirection: 'column',
                transition: 'width 0.25s ease', overflowX: 'hidden',
            }}>
                {/* Logo row */}
                <div style={{
                    padding: collapsed ? '18px 0' : '18px 16px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    borderBottom: '1px solid rgba(245,158,11,0.1)', flexShrink: 0,
                    justifyContent: collapsed ? 'center' : undefined,
                }}>
                    <motion.div 
                        animate={{ boxShadow: ["0 0 0px #F59E0B00", "0 0 15px #F59E0B44", "0 0 0px #F59E0B00"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                            background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                                stroke="#08060f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.div>
                    {!collapsed && (
                        <span className="font-display text-gradient-gold" style={{ fontWeight: 900, fontSize: 16, color: '#fff', whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>
                            SkillSense AI
                        </span>
                    )}
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto', overflowX: 'hidden' }}>
                    {filteredNav.map(({ group, accent, routes }) => {
                        const isOpen = openGroups.includes(group);
                        const isGroupActive = routes.some(r => pathname === r.href || pathname.startsWith(r.href + '/'));
                        return (
                            <div key={group}>
                                <button
                                    onClick={() => !collapsed && toggleGroup(group)}
                                    style={{
                                        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                                        padding: collapsed ? '8px 0' : '7px 16px',
                                        border: 'none', background: 'transparent', cursor: 'pointer',
                                        color: isGroupActive ? accent : '#94a3b8',
                                        justifyContent: collapsed ? 'center' : 'space-between',
                                        transition: 'color 0.15s',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 6, height: 6, borderRadius: '50%',
                                            background: isGroupActive ? accent : '#334155', flexShrink: 0,
                                        }} />
                                        {!collapsed && (
                                            <span className="font-display" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                                {group}
                                            </span>
                                        )}
                                    </div>
                                    {!collapsed && (
                                        <span style={{ fontSize: 10, opacity: 0.4, marginLeft: 'auto' }}>{isOpen ? '▾' : '▸'}</span>
                                    )}
                                </button>

                                {!collapsed && isOpen && routes.map(route => {
                                    const active = pathname === route.href;
                                    const badge = (route as { badge?: string }).badge;
                                    return (
                                        <Link key={route.href} href={route.href} style={{
                                            display: 'flex', alignItems: 'center',
                                            padding: '8px 16px 8px 28px', textDecoration: 'none',
                                            background: active ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                                            borderLeft: active ? `3px solid #F59E0B` : '3px solid transparent',
                                            color: active ? '#fff' : '#94a3b8',
                                            fontSize: 13, fontWeight: active ? 700 : 500,
                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', 
                                            whiteSpace: 'nowrap',
                                            gap: 8,
                                            boxShadow: active ? 'inset 10px 0 20px -10px rgba(245, 158, 11, 0.15)' : 'none'
                                        }}>
                                            <motion.span whileHover={{ scale: 1.05, x: 2 }}>
                                                {route.label}
                                            </motion.span>
                                            {badge && (
                                                <span className="badge" style={{
                                                    fontSize: 8, fontWeight: 800, padding: '2px 6px', borderRadius: 99,
                                                    background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B',
                                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                                    letterSpacing: '0.05em',
                                                }}>{badge}</span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        );
                    })}
                </nav>

                {/* Sidebar bottom: Logout */}
                {!collapsed && (
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '10px 16px', background: 'transparent', border: 'none',
                            borderTop: '1px solid rgba(212,168,67,0.08)', cursor: 'pointer',
                            color: '#ef4444', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8,
                            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600,
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                )}

                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(c => !c)}
                    style={{
                        padding: '12px', background: 'transparent', border: 'none',
                        borderTop: '1px solid rgba(212,168,67,0.08)', cursor: 'pointer',
                        color: '#334155', fontSize: 10, display: 'flex', alignItems: 'center', gap: 8,
                        justifyContent: collapsed ? 'center' : undefined,
                        paddingLeft: collapsed ? 0 : 16, transition: 'all 0.15s',
                    }}
                >
                    <span>{collapsed ? '»' : '«'}</span>
                    {!collapsed && <span className="font-display" style={{ fontWeight: 600, fontSize: 11 }}>Collapse</span>}
                </button>
            </aside>

            {/* Main area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Sticky header */}
                <header style={{
                    position: 'sticky', top: 0, zIndex: 50,
                    background: 'rgba(8,6,15,0.85)', backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(212,168,67,0.08)',
                    padding: '0 28px', height: 52,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>
                        {crumb || 'Dashboard'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {userName && <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{userName}</span>}
                        <span style={{ fontSize: 12, color: '#475569' }}>
                            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>

                        {/* Avatar with dropdown */}
                        <div ref={dropdownRef} style={{ position: 'relative' }}>
                            <div
                                onClick={() => setShowDropdown(p => !p)}
                                style={{
                                    width: 30, height: 30, borderRadius: '50%',
                                    background: userAvatar ? 'transparent' : 'linear-gradient(135deg, #D4A843, #F0C05A)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontWeight: 800, color: '#08060f', cursor: 'pointer',
                                    transition: 'box-shadow 0.2s',
                                    boxShadow: showDropdown ? '0 0 0 2px #D4A843' : 'none',
                                    overflow: 'hidden',
                                    border: userAvatar ? '2px solid #D4A843' : 'none',
                                }}
                            >
                                {userAvatar ? (
                                    <Image src={userAvatar} alt="Avatar" width={30} height={30} style={{ objectFit: 'cover' }} />
                                ) : (
                                    initials
                                )}
                            </div>

                            {showDropdown && (
                                <div style={{
                                    position: 'absolute', top: '100%', right: 0, marginTop: 8,
                                    background: '#111', border: '1px solid rgba(212,168,67,0.12)',
                                    borderRadius: 12, padding: '6px', minWidth: 180,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                    animation: 'fadeIn 0.15s ease',
                                }}>
                                    <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(212,168,67,0.08)', marginBottom: 4 }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{userName}</div>
                                        <div style={{ fontSize: 11, color: '#475569', textTransform: 'capitalize' }}>{userRole || 'Student'}</div>
                                    </div>
                                    <Link href="/student/profile" onClick={() => setShowDropdown(false)} style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        padding: '8px 12px', textDecoration: 'none',
                                        color: '#94a3b8', fontSize: 13, borderRadius: 8,
                                        transition: 'background 0.15s',
                                    }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,168,67,0.06)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                        </svg>
                                        View Profile
                                    </Link>
                                    <button onClick={() => { setShowDropdown(false); handleLogout(); }} style={{
                                        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                                        padding: '8px 12px', background: 'transparent', border: 'none',
                                        color: '#ef4444', fontSize: 13, cursor: 'pointer', borderRadius: 8,
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        transition: 'background 0.15s',
                                    }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                            <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                    <VerificationBanner />
                    <div style={{ padding: '28px' }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                style={{ minHeight: '100%' }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
}
