'use client';

import React, { useState, useEffect } from 'react';
import FairnessDistribution from '@/components/charts/FairnessDistribution';
import api from '@/lib/api';

const GOLD = '#D4A843';
const GOLD_L = '#F0C05A';
const AMBER = '#F59E0B';

const roleColor: Record<string, string> = {
    Student: GOLD, Institute: '#a78bfa', Industry: '#34d399', Government: AMBER,
};

interface Stats {
    totalUsers: number;
    totalStudents: number;
    totalInstitutes: number;
    totalAdmins: number;
    newThisMonth: number;
    recentUsers: { name: string; email: string; role: string; createdAt: string; lastLogin?: string }[];
}

interface FairnessShape {
    period: string;
    overallFairnessScore: number;
    genderGap: { male: number; female: number };
    regionGap: { north: number; south: number; east: number; west: number; central: number };
    flags: { dimension: string; severity: 'high' | 'medium' | 'low' }[];
    lastAuditDate: string;
}

interface Inquiry {
    _id: string;
    companyName: string;
    contactName?: string;
    email: string;
    phone?: string;
    teamSize: string;
    plan: string;
    message?: string;
    status: 'new' | 'contacted' | 'converted';
    createdAt: string;
}

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
    new: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', label: 'New' },
    contacted: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', label: 'Contacted' },
    converted: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', label: 'Converted' },
};

const statusCycle: Record<string, 'new' | 'contacted' | 'converted'> = {
    new: 'contacted',
    contacted: 'converted',
    converted: 'new',
};

const planBadgeColors: Record<string, string> = {
    Starter: '#06b6d4',
    Professional: GOLD,
    Enterprise: '#a78bfa',
};

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'inquiries'>('overview');
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [fairness, setFairness] = useState<FairnessShape | null>(null);
    const [loading, setLoading] = useState(true);

    // Load overview stats + fairness
    useEffect(() => {
        if (activeTab !== 'overview') return;
        let cancelled = false;
        setLoading(true);
        Promise.all([
            api.get('/admin/stats').then((r) => r.data?.data),
            api.get('/admin/fairness-dashboard').then((r) => r.data?.data),
        ])
            .then(([statsRes, fairnessRes]) => {
                if (cancelled) return;
                if (statsRes) {
                    setStats(statsRes);
                }
                if (fairnessRes) {
                    const g = fairnessRes.placementByGender || {};
                    const r = fairnessRes.placementByRegion || {};
                    setFairness({
                        period: fairnessRes.period || 'Current Audit Period',
                        overallFairnessScore: Math.round(fairnessRes.overallFairnessScore ?? 0),
                        genderGap: { male: g.male ?? 0, female: g.female ?? 0 },
                        regionGap: {
                            north: r.north ?? 0, south: r.south ?? 0,
                            east: r.east ?? 0, west: r.west ?? 0, central: r.central ?? 0,
                        },
                        flags: (fairnessRes.flags || []).map((f: any) => ({
                            dimension: f.dimension,
                            severity: f.severity,
                        })),
                        lastAuditDate: fairnessRes.computedAt || '',
                    });
                }
                setLoading(false);
            })
            .catch(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [activeTab]);

    // Load inquiries
    useEffect(() => {
        if (activeTab !== 'inquiries') return;
        api.get('/contact/industry')
            .then((r) => {
                const data = r.data?.data;
                if (Array.isArray(data) && data.length > 0) {
                    setInquiries(data);
                }
            })
            .catch(() => {
                // No fake fallback — leave the table empty with an honest message.
            });
    }, [activeTab]);

    const toggleStatus = async (id: string) => {
        setInquiries(prev => prev.map(inq => {
            if (inq._id === id) {
                const newStatus = statusCycle[inq.status] || 'new';
                api.patch(`/contact/industry/${id}`, { status: newStatus }).catch(() => { /* keep local */ });
                return { ...inq, status: newStatus };
            }
            return inq;
        }));
    };

    const tabs = [
        { key: 'overview' as const, label: 'Overview' },
        { key: 'inquiries' as const, label: 'Industry Inquiries', count: inquiries.filter(i => i.status === 'new').length },
    ];

    const recentUsers = stats?.recentUsers || [];
    const statCards = stats ? [
        { label: 'Total Users', value: stats.totalUsers.toLocaleString('en-IN'), color: '#ef4444' },
        { label: 'Active Students', value: stats.totalStudents.toLocaleString('en-IN'), color: GOLD },
        { label: 'Institutes', value: stats.totalInstitutes.toLocaleString('en-IN'), color: '#a78bfa' },
        { label: 'New This Month', value: stats.newThisMonth.toLocaleString('en-IN'), color: '#22c55e' },
    ] : [];

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>Admin Control Panel</h1>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>System overview and user management</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid rgba(212,168,67,0.08)' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            padding: '10px 20px', background: 'transparent', border: 'none',
                            borderBottom: `2px solid ${activeTab === tab.key ? GOLD : 'transparent'}`,
                            color: activeTab === tab.key ? '#fff' : '#64748b',
                            fontSize: 13, fontWeight: activeTab === tab.key ? 700 : 500,
                            cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif",
                            transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
                        }}
                    >
                        {tab.label}
                        {tab.count !== undefined && tab.count > 0 && (
                            <span style={{
                                fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99,
                                background: 'rgba(245,158,11,0.15)', color: '#F59E0B',
                            }}>{tab.count}</span>
                        )}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                loading ? (
                    <div style={{ padding: 24, color: '#64748b', fontSize: 13 }}>Loading system overview…</div>
                ) : !stats ? (
                    <div style={{ padding: 24, borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: 13 }}>
                        ⚠ System statistics are currently unavailable. Please try again later.
                    </div>
                ) : (
                    <>
                        {/* KPI row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                            {statCards.map((stat, i) => (
                                <div key={i} className="stat-card">
                                    <div style={{ width: 4, height: 28, borderRadius: 2, background: stat.color, marginBottom: 14 }} />
                                    <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Recent users table */}
                        <div className="stat-card" style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <div style={{ width: 4, height: 18, borderRadius: 2, background: AMBER }} />
                                <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Recent User Registrations</h3>
                            </div>
                            {recentUsers.length === 0 ? (
                                <p style={{ color: '#64748b', fontSize: 13 }}>No recent user registrations found.</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(212,168,67,0.1)' }}>
                                            {['User', 'Role', 'Email', 'Joined'].map(h => (
                                                <th key={h} style={{ textAlign: 'left', fontSize: 11, color: '#64748b', padding: '8px 24px 8px 0', fontWeight: 600 }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentUsers.map((user, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid rgba(212,168,67,0.06)' }}>
                                                <td style={{ padding: '13px 24px 13px 0' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #D4A843, #F0C05A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#08060f' }}>
                                                            {(user.name || user.email || '?').split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('')}
                                                        </div>
                                                        <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{user.name || user.email}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '13px 24px 13px 0' }}>
                                                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 700, background: `${roleColor[user.role] ?? '#64748b'}18`, color: roleColor[user.role] ?? '#64748b' }}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '13px 24px 13px 0', fontSize: 13, color: '#64748b' }}>{user.email}</td>
                                                <td style={{ padding: '13px 24px 13px 0', fontSize: 12, color: '#475569' }}>
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Fairness */}
                        <div className="stat-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <div style={{ width: 4, height: 28, borderRadius: 2, background: GOLD }} />
                                <div>
                                    <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Fairness Overview</h3>
                                    <p style={{ fontSize: 11, color: '#64748b' }}>{fairness?.period || 'Current Audit Period'}</p>
                                </div>
                                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                    <div className="font-display gradient-text" style={{ fontSize: 28, fontWeight: 800 }}>
                                        {fairness?.overallFairnessScore ?? '—'}
                                    </div>
                                    <div style={{ fontSize: 10, color: '#64748b' }}>/ 100</div>
                                </div>
                            </div>
                            {fairness && (
                                <div style={{ marginBottom: 14, padding: '10px 14px', background: 'rgba(239,68,68,0.06)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.12)' }}>
                                    <p style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>
                                        {fairness.flags.filter(f => f.severity === 'high').length} High Severity Issues detected
                                    </p>
                                </div>
                            )}
                            {fairness ? (
                                <FairnessDistribution data={fairness as any} />
                            ) : (
                                <p style={{ color: '#64748b', fontSize: 13 }}>Fairness metrics are currently unavailable.</p>
                            )}
                        </div>
                    </>
                )
            )}

            {activeTab === 'inquiries' && (
                <>
                    {/* Inquiry KPIs */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                        {[
                            { label: 'Total Inquiries', value: inquiries.length.toString(), color: GOLD },
                            { label: 'New', value: inquiries.filter(i => i.status === 'new').length.toString(), color: '#F59E0B' },
                            { label: 'Contacted', value: inquiries.filter(i => i.status === 'contacted').length.toString(), color: '#3b82f6' },
                            { label: 'Converted', value: inquiries.filter(i => i.status === 'converted').length.toString(), color: '#22c55e' },
                        ].map((stat, i) => (
                            <div key={i} className="stat-card">
                                <div style={{ width: 4, height: 28, borderRadius: 2, background: stat.color, marginBottom: 14 }} />
                                <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Inquiries table */}
                    <div className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                            <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Industry Inquiries</h3>
                        </div>

                        {inquiries.length === 0 ? (
                            <p style={{ color: '#64748b', fontSize: 13 }}>No industry inquiries have been submitted yet.</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(212,168,67,0.1)' }}>
                                            {['Company', 'Plan', 'Team Size', 'Contact', 'Email', 'Date', 'Status'].map(h => (
                                                <th key={h} style={{ textAlign: 'left', fontSize: 11, color: '#64748b', padding: '10px 16px 10px 0', fontWeight: 600 }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inquiries.map(inq => {
                                            const sc = statusColors[inq.status] || statusColors.new;
                                            const planColor = planBadgeColors[inq.plan] || '#64748b';
                                            return (
                                                <tr key={inq._id} style={{ borderBottom: '1px solid rgba(212,168,67,0.06)' }}>
                                                    <td style={{ padding: '14px 16px 14px 0' }}>
                                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{inq.companyName}</div>
                                                        <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{inq.contactName}</div>
                                                    </td>
                                                    <td style={{ padding: '14px 16px 14px 0' }}>
                                                        <span style={{
                                                            fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                                                            background: `${planColor}15`, color: planColor,
                                                        }}>{inq.plan}</span>
                                                    </td>
                                                    <td style={{ padding: '14px 16px 14px 0', fontSize: 12, color: '#94a3b8' }}>{inq.teamSize}</td>
                                                    <td style={{ padding: '14px 16px 14px 0', fontSize: 12, color: '#94a3b8' }}>{inq.contactName}</td>
                                                    <td style={{ padding: '14px 16px 14px 0', fontSize: 12, color: '#64748b' }}>{inq.email}</td>
                                                    <td style={{ padding: '14px 16px 14px 0', fontSize: 12, color: '#475569' }}>
                                                        {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                    </td>
                                                    <td style={{ padding: '14px 16px 14px 0' }}>
                                                        <button
                                                            onClick={() => toggleStatus(inq._id)}
                                                            style={{
                                                                fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99,
                                                                background: sc.bg, color: sc.color,
                                                                border: 'none', cursor: 'pointer',
                                                                fontFamily: "'Space Grotesk', sans-serif",
                                                                transition: 'opacity 0.2s',
                                                            }}
                                                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                                                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                                                            title="Click to cycle status"
                                                        >
                                                            {sc.label}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}