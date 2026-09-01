'use client';

import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import api from '@/lib/api';

const GOLD = '#D4A843';
const GOLD_L = '#F0C05A';
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
                        fontSize: '12px',
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

interface PublicStats {
    totalUsers?: number;
    totalStudents?: number;
    partnersCount?: number;
    coursesCount?: number;
}

interface HeatmapRow {
    state: string;
    studentCount: number;
    avgScore: number;
    placementRate: number;
}

interface SkillGapRow {
    skillId: string;
    name: string;
    domain: string;
    avgStudentScore: number;
    industryDemandScore: number;
    gap: number;
    studentCount: number;
}

const round1 = (n: number): number => Math.round(n * 10) / 10;

export default function GovernmentPage() {
    const [stats, setStats] = useState<PublicStats>({});
    const [heatmap, setHeatmap] = useState<HeatmapRow[]>([]);
    const [skillGaps, setSkillGaps] = useState<SkillGapRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = () => {
        setLoading(true);
        setError('');
        Promise.all([
            api.get('/auth/stats'),
            api.get('/analytics/national-heatmap'),
            api.get('/analytics/skill-gaps'),
        ])
            .then(([statsRes, heatRes, gapRes]) => {
                setStats(statsRes.data?.data ?? {});
                setHeatmap(Array.isArray(heatRes.data?.data) ? heatRes.data.data : []);
                setSkillGaps(Array.isArray(gapRes.data?.data) ? gapRes.data.data : []);
            })
            .catch(() => setError('Analytics are currently unavailable. Please try again.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const hasData = heatmap.length > 0 || skillGaps.length > 0 || (stats.totalStudents ?? 0) > 0;

    // ── KPI derivation (honest: only from real records) ──
    const totalStudents = stats.totalStudents ?? null;
    const partnersCount = stats.partnersCount ?? null;
    const coursesCount = stats.coursesCount ?? null;
    const statesCovered = heatmap.length;
    const avgPlacementRate = heatmap.length > 0
        ? round1(heatmap.reduce((sum, h) => sum + h.placementRate, 0) / heatmap.length)
        : null;
    const avgGapIndex = skillGaps.length > 0
        ? Math.round(skillGaps.reduce((sum, s) => sum + s.gap, 0) / skillGaps.length)
        : null;

    // ── Derived charts (real data only) ──
    const stateChart = heatmap.map((h) => ({
        state: h.state,
        'Employment %': h.placementRate,
        'Skill Score': h.avgScore,
    }));

    const demandByDomain: { sector: string; demand: number; supply: number }[] = [];
    for (const row of skillGaps) {
        const key = row.domain || 'General';
        const existing = demandByDomain.find((d) => d.sector === key);
        if (existing) {
            existing.demand += row.industryDemandScore;
            existing.supply += row.avgStudentScore;
        } else {
            demandByDomain.push({ sector: key, demand: row.industryDemandScore, supply: row.avgStudentScore });
        }
    }
    demandByDomain.forEach((d) => {
        const count = skillGaps.filter((s) => (s.domain || 'General') === d.sector).length;
        d.demand = Math.round(d.demand / count);
        d.supply = Math.round(d.supply / count);
    });
    demandByDomain.sort((a, b) => b.demand - a.demand);

    const topDemandSkills = [...skillGaps]
        .sort((a, b) => b.industryDemandScore - a.industryDemandScore)
        .slice(0, 7);

    if (loading) {
        return (
            <div>
                <div style={{ marginBottom: 24 }}>
                    <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>National Skill Intelligence</h1>
                    <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Ministry of Skill Development — Workforce Analytics Platform</p>
                </div>
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} style={{ height: 120, background: 'rgba(255,255,255,0.03)', borderRadius: 12, marginBottom: 16, animation: 'pulse 1.5s ease-in-out infinite' }} />
                ))}
            </div>
        );
    }

    if (!hasData) {
        return (
            <div>
                <div style={{ marginBottom: 24 }}>
                    <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>National Skill Intelligence</h1>
                    <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Ministry of Skill Development — Workforce Analytics Platform</p>
                </div>
                <div className="stat-card" style={{ padding: 40, textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>
                        {error || 'No verified workforce data entered yet. Government analytics will appear here as students, skills, and placements are recorded.'}
                    </p>
                    <button
                        type="button"
                        className="btn-gold"
                        style={{ marginTop: 16, padding: '8px 20px', fontSize: 13 }}
                        onClick={load}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>National Skill Intelligence</h1>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Ministry of Skill Development — Workforce Analytics Platform</p>
            </div>

            {error && (
                <div className="stat-card" style={{ marginBottom: 16, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: '#f87171', fontSize: 12.5 }}>{error}</span>
                    <button type="button" className="btn-secondary" style={{ fontSize: 12, padding: '6px 14px' }} onClick={load}>Retry</button>
                </div>
            )}

            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                {[
                    { label: 'Total Students Tracked', value: totalStudents != null ? totalStudents.toLocaleString() : '—', color: AMBER },
                    { label: 'Employment Rate', value: avgPlacementRate != null ? `${avgPlacementRate}%` : '—', color: '#22c55e' },
                    { label: 'Skill Gap Index', value: avgGapIndex != null ? `${avgGapIndex}` : '—', color: '#ef4444' },
                    { label: 'States Covered', value: statesCovered > 0 ? String(statesCovered) : '—', color: GOLD },
                ].map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <div style={{ width: 4, height: 28, borderRadius: 2, background: stat.color }} />
                        </div>
                        <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* State bar chart */}
            {stateChart.length > 0 && (
                <div className="stat-card" style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: AMBER }} />
                        <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>State-wise Employment and Skill Scores</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={stateChart} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,67,0.07)" />
                            <XAxis dataKey="state" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<Tip />} />
                            <Bar dataKey="Employment %" fill={AMBER} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Skill Score" fill="rgba(245,158,11,0.25)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Sector demand + Top in-demand skills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
                {demandByDomain.length > 0 && (
                    <div className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 4, height: 18, borderRadius: 2, background: ORANGE }} />
                            <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Sector Demand vs Student Proficiency</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={demandByDomain} layout="vertical" barSize={11}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,67,0.07)" horizontal={false} />
                                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                                <YAxis dataKey="sector" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={110} />
                                <Tooltip content={<Tip />} />
                                <Bar dataKey="demand" fill={AMBER} radius={[0, 4, 4, 0]} name="Demand Score" />
                                <Bar dataKey="supply" fill="rgba(245,158,11,0.25)" radius={[0, 4, 4, 0]} name="Proficiency Score" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {topDemandSkills.length > 0 && (
                    <div className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                            <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>National Top Demand Skills</h3>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            {topDemandSkills.map((skill, i) => (
                                <div key={i} className="glass" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99 }}>
                                    <span className="font-display" style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>#{i + 1}</span>
                                    <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 600 }}>{skill.name}</span>
                                    <span style={{ fontSize: 11, color: GOLD }}>{skill.industryDemandScore}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Program & partner coverage */}
            <div className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                    <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Platform Coverage</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                    {[
                        { label: 'Skills / Programs', value: coursesCount != null ? String(coursesCount) : '—' },
                        { label: 'Verified Partner Institutions', value: partnersCount != null ? String(partnersCount) : '—' },
                        { label: 'Students Tracked', value: totalStudents != null ? totalStudents.toLocaleString() : '—' },
                        { label: 'States with Records', value: statesCovered > 0 ? String(statesCovered) : '—' },
                    ].map((c, i) => (
                        <div key={i} style={{ padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: `1px solid ${i % 2 === 0 ? `rgba(212,168,67,0.25)` : 'rgba(212,168,67,0.12)'}` }}>
                            <div className="font-display" style={{ fontSize: 18, fontWeight: 800, color: GOLD_L }}>{c.value}</div>
                            <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 4 }}>{c.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}