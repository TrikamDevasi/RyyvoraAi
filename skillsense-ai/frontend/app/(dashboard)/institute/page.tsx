'use client';

import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area,
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { FadeIn } from '@/components/shared/FadeIn';

const GOLD = '#F59E0B';
const GOLD_L = '#FBBF24';
const AMBER = '#F59E0B';
const ORANGE = '#F97316';

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

export default function InstitutePage() {
    const { user, isLoading } = useAuth();
    const [dashboard, setDashboard] = useState<any>(null);
    const [trend, setTrend] = useState<any[]>([]);
    const [roi, setRoi] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const id = (user as any)?._id;
        if (!id || user?.role !== 'institute') {
            setLoading(false);
            setError(user?.role !== 'institute' ? 'Institute analytics are only available to institute accounts.' : null);
            return;
        }

        let cancelled = false;
        setLoading(true);
        Promise.all([
            api.get(`/institutes/${id}/dashboard`).then(r => r.data?.data),
            api.get(`/institutes/${id}/placement`).then(r => r.data?.data),
            api.get(`/institutes/${id}/roi`).then(r => r.data?.data),
        ])
            .then(([dash, tr, rg]) => {
                if (cancelled) return;
                setDashboard(dash);
                setTrend(Array.isArray(tr) ? tr : []);
                setRoi(Array.isArray(rg) ? rg : []);
                setLoading(false);
            })
            .catch(() => {
                if (cancelled) return;
                setError('Institute analytics are currently unavailable. Please try again.');
                setLoading(false);
            });
        return () => { cancelled = true; };
    }, [user]);

    const inst = dashboard?.institution;
    const stats = dashboard?.stats;

    const kpis = stats ? [
        { label: 'Total Students', value: (stats.studentCount ?? 0).toLocaleString('en-IN'), color: '#F59E0B' },
        { label: 'Placed Students', value: (stats.placedCount ?? 0).toLocaleString('en-IN'), color: '#22c55e' },
        { label: 'Placement Rate', value: `${stats.placementRate ?? 0}%`, color: GOLD },
        { label: 'Avg Skill Score', value: `${stats.avgScore ?? 0} / 100`, color: AMBER },
    ] : [];

    const placementChart = trend.map((t) => ({ month: t.month, placedCount: t.placed ?? 0 }));

    const toBarData = (items: { program?: string; _id?: string; count?: number }[]) =>
        (items || [])
            .map((p) => ({ skill: p.program || p._id || 'Program', students: p.count ?? 0 }));

    if (isLoading || (loading && !error)) {
        return (
            <FadeIn>
                <div style={{ padding: 24, color: '#64748b', fontSize: 13 }}>Loading institute analytics…</div>
            </FadeIn>
        );
    }

    if (error) {
        return (
            <FadeIn>
                <div style={{ padding: 24, borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: 13 }}>
                    ⚠ {error}
                </div>
            </FadeIn>
        );
    }

    if (!inst || !stats) {
        return (
            <FadeIn>
                <div style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: 13 }}>
                    No institution data linked to this account yet. Please have an administrator verify and link an institution profile.
                </div>
            </FadeIn>
        );
    }

    return (
        <FadeIn>
            <div style={{ marginBottom: 24 }}>
                <h1 className="font-display text-gradient-gold" style={{ fontSize: 32, fontWeight: 900 }}>Institute Analytics</h1>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                    {inst.name} — {inst.type} · {inst.state}
                </p>
            </div>

            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                {kpis.map((stat, i) => (
                    <div key={i} className="stat-card" style={{ borderTop: `2px solid ${stat.color}40` }}>
                        <div className="font-display text-gradient-gold" style={{ fontSize: 26, fontWeight: 900 }}>{stat.value}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 5, fontWeight: 600 }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
                <div className="stat-card glass">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                        <h3 className="font-display" style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Program Distribution</h3>
                    </div>
                    {toBarData(stats.topPrograms).length === 0 ? (
                        <p style={{ color: '#64748b', fontSize: 13, padding: '40px 0', textAlign: 'center' }}>No program data available yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={toBarData(stats.topPrograms)} layout="vertical" barSize={12}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,67,0.07)" horizontal={false} />
                                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis dataKey="skill" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={110} />
                                <Tooltip content={<Tip />} cursor={{ fill: 'rgba(245, 158, 11, 0.05)' }} />
                                <Bar dataKey="students" radius={[0, 4, 4, 0]} fill={GOLD} fillOpacity={0.85} name="Students" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="stat-card glass">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: AMBER }} />
                        <h3 className="font-display" style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Monthly Placement Trends</h3>
                    </div>
                    {placementChart.length === 0 ? (
                        <p style={{ color: '#64748b', fontSize: 13, padding: '40px 0', textAlign: 'center' }}>No placement records yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={placementChart}>
                                <defs>
                                    <linearGradient id="placG" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={GOLD} stopOpacity={0.30} />
                                        <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,67,0.07)" />
                                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<Tip />} />
                                <Area type="monotone" dataKey="placedCount" stroke={GOLD} fill="url(#placG)" strokeWidth={3} name="Placed" dot={{ r: 4, fill: GOLD, strokeWidth: 2, stroke: '#08060f' }} activeDot={{ r: 6, fill: '#fff', stroke: GOLD, strokeWidth: 2 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Program ROI */}
            <div className="stat-card glass">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                    <h3 className="font-display" style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Program ROI</h3>
                </div>
                {roi.length === 0 ? (
                    <p style={{ color: '#64748b', fontSize: 13 }}>No program ROI scores recorded yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {roi.map((p, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: 12, color: '#cbd5e1', width: 170, fontWeight: 500 }}>{p.program}</span>
                                <div style={{ flex: 1, height: 7, background: 'rgba(255,255,255,0.03)', borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ height: '100%', width: `${Math.min(100, p.roi ?? 0)}%`, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_L})`, borderRadius: 3 }} />
                                </div>
                                <span className="font-display" style={{ fontSize: 14, fontWeight: 800, color: GOLD, width: 44, textAlign: 'right' }}>{p.roi ?? 0}%</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </FadeIn>
    );
}