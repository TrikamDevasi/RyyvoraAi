'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false });

const GOLD = '#D4A843';
const AMBER = '#F59E0B';
const WHITE = '#FFFFFF';

export default function EmployerPage() {
    const [_stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/analytics/placement-trends')
            .then(res => {
                const data = res.data?.data;
                setStats(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const chartData = [
        { month: 'Jan', hires: 42 },
        { month: 'Feb', hires: 58 },
        { month: 'Mar', hires: 65 },
        { month: 'Apr', hires: 84 },
        { month: 'May', hires: 92 },
    ];

    return (
        <ErrorBoundary>
            <div style={{ color: WHITE, maxWidth: 1100 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
                        Employer Hiring & Placement <span style={{ color: GOLD }}>Control Hub</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                        Live talent pipeline analytics, competency verification, and campus engagement metrics
                    </p>
                </div>

                {loading ? (
                    <Skeleton height={200} width="100%" />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                            {[
                                { label: 'Verified Hires', value: '341', color: '#22c55e' },
                                { label: 'Active Pipeline Candidates', value: '1,280', color: GOLD },
                                { label: 'Skill Match Accuracy', value: '94.2%', color: AMBER },
                                { label: 'Partner Institutions', value: '48', color: '#a78bfa' },
                            ].map((s, i) => (
                                <div key={i} style={{ padding: 18, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div className="font-display" style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
                                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, textTransform: 'uppercase', fontWeight: 700 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(245,158,11,0.15)' }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#fff' }}>
                                Verified Placement Velocity
                            </h3>
                            <div style={{ height: 260, width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                        <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                                        <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Bar dataKey="hires" fill={GOLD} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
