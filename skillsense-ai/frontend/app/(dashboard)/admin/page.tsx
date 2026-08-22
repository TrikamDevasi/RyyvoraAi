'use client';

import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { sampleFairnessMetrics } from '@/data/sampleFairnessMetrics';
import FairnessDistribution from '@/components/charts/FairnessDistribution';

const GOLD = '#D4A843';
const GOLD_L = '#F0C05A';
const AMBER = '#F59E0B';
import api from '@/lib/api';

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

const Tip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload?.length) {
        return (
            <div style={{
                background: 'rgba(10, 10, 20, 0.95)',
                border: '1px solid rgba(212, 168, 67, 0.4)',
                borderRadius: '10px',
                padding: '12px 16px',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                minWidth: '160px'
            }}>
                <p style={{
                    color: '#F59E0B',
                    fontWeight: 700,
                    fontSize: '13px',
                    marginBottom: '6px'
                }}>{label}</p>
                {payload.map((entry: any, i: number) => (
                    <p key={i} style={{
                        color: '#ffffff',
                        fontSize: '13px',
                        margin: '2px 0'
                    }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const activityData = [
    { day: 'Mon', logins: 1240, analyses: 890 },
    { day: 'Tue', logins: 1380, analyses: 1020 },
    { day: 'Wed', logins: 1560, analyses: 1180 },
    { day: 'Thu', logins: 1290, analyses: 950 },
    { day: 'Fri', logins: 1720, analyses: 1340 },
    { day: 'Sat', logins: 980, analyses: 720 },
    { day: 'Sun', logins: 760, analyses: 540 },
];

const recentUsers = [
    { name: 'Arjun Mehta', role: 'Student', org: 'NIIT University', status: 'active', joined: '2h ago' },
    { name: 'Dr. Priya Sharma', role: 'Institute', org: 'Aptech Delhi', status: 'active', joined: '4h ago' },
    { name: 'Rajesh Kumar', role: 'Industry', org: 'Razorpay', status: 'pending', joined: '6h ago' },
    { name: 'Anita Singh', role: 'Government', org: 'MeitY', status: 'active', joined: '1d ago' },
    { name: 'Vikram Nair', role: 'Student', org: 'IIIT Kochi', status: 'active', joined: '1d ago' },
];

const roleColor: Record<string, string> = {
    Student: GOLD, Institute: '#a78bfa', Industry: '#34d399', Government: AMBER,
};

const services = [
    { name: 'AI Analysis Engine', status: 'Operational', uptime: '99.9%' },
    { name: 'Authentication API', status: 'Operational', uptime: '100%' },
    { name: 'Database Cluster', status: 'Operational', uptime: '99.8%' },
    { name: 'Resume Parser', status: 'Operational', uptime: '99.7%' },
    { name: 'GitHub Analyzer', status: 'Operational', uptime: '99.5%' },
    { name: 'Notification Service', status: 'Degraded', uptime: '97.2%' },
];

interface Inquiry {
    _id: string;
    company: string;
    contactName: string;
    email: string;
    phone?: string;
    teamSize: string;
    plan: string;
    message?: string;
    status: 'new' | 'contacted' | 'converted';
    createdAt: string;
}

const SAMPLE_INQUIRIES: Inquiry[] = [
    { _id: '1', company: 'Tata Consultancy Services', contactName: 'Ravi Shankar', email: 'ravi.shankar@tcs.com', phone: '+91 98765 43210', teamSize: '1000+', plan: 'Enterprise', message: 'Looking for workforce analytics at scale.', status: 'new', createdAt: '2026-03-14T10:30:00' },
    { _id: '2', company: 'Infosys', contactName: 'Meena Patel', email: 'meena.p@infosys.com', teamSize: '201-1000', plan: 'Professional', status: 'contacted', createdAt: '2026-03-13T14:20:00' },
    { _id: '3', company: 'Wipro', contactName: 'Suresh Reddy', email: 'suresh.r@wipro.com', phone: '+91 87654 32109', teamSize: '201-1000', plan: 'Professional', message: 'Need skill passport integration.', status: 'new', createdAt: '2026-03-12T09:15:00' },
    { _id: '4', company: 'Startup Hub Jaipur', contactName: 'Aisha Khan', email: 'aisha@startuphub.in', teamSize: '11-50', plan: 'Starter', status: 'converted', createdAt: '2026-03-10T16:45:00' },
    { _id: '5', company: 'Razorpay', contactName: 'Deepak Gupta', email: 'deepak.g@razorpay.com', teamSize: '51-200', plan: 'Professional', message: 'Interested in AI candidate screening.', status: 'contacted', createdAt: '2026-03-09T11:00:00' },
    { _id: '6', company: 'Freshworks', contactName: 'Lakshmi Narayan', email: 'lakshmi@freshworks.com', teamSize: '201-1000', plan: 'Enterprise', status: 'new', createdAt: '2026-03-08T08:30:00' },
    { _id: '7', company: 'Zoho', contactName: 'Kumar Swamy', email: 'kumar.s@zoho.com', phone: '+91 76543 21098', teamSize: '1000+', plan: 'Enterprise', message: 'Want custom dashboards for HR team.', status: 'new', createdAt: '2026-03-07T13:00:00' },
];

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
    const fairnessData = sampleFairnessMetrics;
    const [activeTab, setActiveTab] = useState<'overview' | 'inquiries'>('overview');
    const [inquiries, setInquiries] = useState<Inquiry[]>(SAMPLE_INQUIRIES);

    // Try to fetch from API
    useEffect(() => {
        if (activeTab === 'inquiries') {
            api.get('/contact/industry')
                .then(r => { if (r.data?.data?.inquiries?.length) setInquiries(r.data.data.inquiries); })
                .catch(() => { /* use demo data */ });
        }
    }, [activeTab]);

    const toggleStatus = async (id: string) => {
        setInquiries(prev => prev.map(inq => {
            if (inq._id === id) {
                const newStatus = statusCycle[inq.status];
                // Try API update
                api.patch(`/contact/industry/${id}`, { status: newStatus }).catch(() => { /* update only locally */ });
                return { ...inq, status: newStatus };
            }
            return inq;
        }));
    };

    const tabs = [
        { key: 'overview' as const, label: 'Overview' },
        { key: 'inquiries' as const, label: 'Industry Inquiries', count: inquiries.filter(i => i.status === 'new').length },
    ];

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>Admin Control Panel</h1>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>System overview and user management</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid rgba(212,168,67,0.08)', paddingBottom: 0 }}>
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
                <>
                    {/* KPI row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                        {[
                            { label: 'Total Users', value: '48,291', color: '#ef4444', sub: '+1.2K today' },
                            { label: 'Institutes', value: '342', color: GOLD, sub: '+8 this week' },
                            { label: 'AI Analyses Run', value: '2.4M', color: '#a78bfa', sub: '+12K today' },
                            { label: 'System Health', value: '99.8%', color: '#22c55e', sub: 'All systems OK' },
                        ].map((stat, i) => (
                            <div key={i} className="stat-card">
                                <div style={{ width: 4, height: 28, borderRadius: 2, background: stat.color, marginBottom: 14 }} />
                                <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{stat.label}</div>
                                <div style={{ fontSize: 11, color: '#22c55e', marginTop: 4 }}>{stat.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Weekly activity chart */}
                    <div className="stat-card" style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                            <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Weekly Platform Activity</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={230}>
                            <BarChart data={activityData} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,67,0.07)" />
                                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<Tip />} />
                                <Bar dataKey="logins" fill={GOLD} fillOpacity={0.85} radius={[4, 4, 0, 0]} name="Logins" />
                                <Bar dataKey="analyses" fill="rgba(212,168,67,0.28)" radius={[4, 4, 0, 0]} name="AI Analyses" />
                            </BarChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                            {[{ label: 'Logins', color: GOLD }, { label: 'AI Analyses', color: 'rgba(212,168,67,0.45)' }].map(l => (
                                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 12, height: 3, background: l.color, borderRadius: 2 }} />
                                    <span style={{ fontSize: 11, color: '#64748b' }}>{l.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent users table */}
                    <div className="stat-card" style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 4, height: 18, borderRadius: 2, background: AMBER }} />
                            <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Recent User Registrations</h3>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(212,168,67,0.1)' }}>
                                    {['User', 'Role', 'Organization', 'Status', 'Joined'].map(h => (
                                        <th key={h} style={{ textAlign: 'left', fontSize: 11, color: '#64748b', padding: '8px 24px 8px 0', fontWeight: 600 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map((user, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(212,168,67,0.06)', transition: 'background 0.15s' }}
                                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.03)')}
                                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                                        <td style={{ padding: '13px 24px 13px 0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #D4A843, #F0C05A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#08060f' }}>
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{user.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '13px 24px 13px 0' }}>
                                            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 700, background: `${roleColor[user.role] ?? '#64748b'}18`, color: roleColor[user.role] ?? '#64748b' }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '13px 24px 13px 0', fontSize: 13, color: '#64748b' }}>{user.org}</td>
                                        <td style={{ padding: '13px 24px 13px 0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: user.status === 'active' ? '#22c55e' : AMBER }}>
                                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: user.status === 'active' ? '#22c55e' : AMBER }} />
                                                {user.status === 'active' ? 'Active' : 'Pending'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '13px 24px 13px 0', fontSize: 12, color: '#475569' }}>{user.joined}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Bottom panels */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                        {/* Fairness */}
                        <div className="stat-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <div style={{ width: 4, height: 28, borderRadius: 2, background: GOLD }} />
                                <div>
                                    <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Fairness Overview</h3>
                                    <p style={{ fontSize: 11, color: '#64748b' }}>{fairnessData.period}</p>
                                </div>
                                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                    <div className="font-display gradient-text" style={{ fontSize: 28, fontWeight: 800 }}>
                                        {fairnessData.overallFairnessScore}
                                    </div>
                                    <div style={{ fontSize: 10, color: '#64748b' }}>/ 100</div>
                                </div>
                            </div>
                            <div style={{ marginBottom: 14, padding: '10px 14px', background: 'rgba(239,68,68,0.06)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.12)' }}>
                                <p style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>
                                    {fairnessData.flags.filter(f => f.severity === 'high').length} High Severity Issues detected
                                </p>
                            </div>
                            <FairnessDistribution data={fairnessData} />
                        </div>

                        {/* System services */}
                        <div className="stat-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <div style={{ width: 4, height: 18, borderRadius: 2, background: '#22c55e' }} />
                                <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>System Services</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                                {services.map((svc, i) => (
                                    <div key={i} className="glass" style={{ padding: '12px 14px', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{svc.name}</div>
                                            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{svc.uptime} uptime</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: svc.status === 'Operational' ? '#22c55e' : AMBER }}>
                                            <div style={{
                                                width: 7, height: 7, borderRadius: '50%',
                                                background: svc.status === 'Operational' ? '#22c55e' : AMBER,
                                                boxShadow: svc.status === 'Operational' ? '0 0 5px #22c55e' : `0 0 5px ${AMBER}`,
                                            }} />
                                            {svc.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
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
                                        const sc = statusColors[inq.status];
                                        const planColor = planBadgeColors[inq.plan] || '#64748b';
                                        return (
                                            <tr key={inq._id}
                                                style={{ borderBottom: '1px solid rgba(212,168,67,0.06)', transition: 'background 0.15s' }}
                                                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.03)')}
                                                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                                            >
                                                <td style={{ padding: '14px 16px 14px 0' }}>
                                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{inq.company}</div>
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
                    </div>
                </>
            )}
        </div>
    );
}
