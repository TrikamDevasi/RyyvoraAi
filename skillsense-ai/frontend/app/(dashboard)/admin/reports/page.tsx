'use client';

import React, { useState, useEffect } from 'react';
import ReportGenerator from '@/components/dashboard/ReportGenerator';
import { downloadPageAsPDF } from '@/utils/downloadPDF';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

interface SystemSnapshot {
    counts: { users: number; students: number; institutions: number; assessments: number };
    usersByRole: { _id: string; count: number }[];
    placementDistribution: { _id: string; count: number }[];
}

const PLACEMENT_LABELS: Record<string, string> = { placed: 'Placed', seeking: 'Seeking', training: 'In Training' };

export default function ReportsPage() {
    const [snapshot, setSnapshot] = useState<SystemSnapshot | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = () => {
        setLoading(true);
        setError('');
        api.get('/admin/reports')
            .then((res) => {
                const data = res.data?.data;
                if (data && typeof data.counts === 'object') {
                    setSnapshot({
                        counts: data.counts,
                        usersByRole: Array.isArray(data.usersByRole) ? data.usersByRole : [],
                        placementDistribution: Array.isArray(data.placementDistribution) ? data.placementDistribution : [],
                    });
                } else {
                    setSnapshot(null);
                }
            })
            .catch(() => setError('System report data is currently unavailable. Please try again.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const statCards = snapshot ? [
        { label: 'Registered Users', value: snapshot.counts.users, color: GOLD },
        { label: 'Verified Students', value: snapshot.counts.students, color: '#60a5fa' },
        { label: 'Institutions', value: snapshot.counts.institutions, color: '#a78bfa' },
        { label: 'Assessments Logged', value: snapshot.counts.assessments, color: '#22c55e' },
    ] : [];

    return (
        <ErrorBoundary>
            <div style={{ color: WHITE, maxWidth: 1100 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                        Reports <span style={{ color: GOLD }}>Centre</span>
                    </h1>
                    <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                        Generate, export, and review live system snapshots
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
                    <ReportGenerator onGenerate={(config) => { downloadPageAsPDF('SkillSense-Report-' + config.type); }} />

                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,168,67,0.18)', borderRadius: 14, padding: '22px' }}>
                        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Live System Snapshot</h3>
                        {loading ? (
                            <Skeleton height={150} width="100%" />
                        ) : error ? (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <p style={{ margin: 0, fontSize: 13, color: '#f87171' }}>{error}</p>
                                <button type="button" className="btn-gold" style={{ marginTop: 14, padding: '7px 18px', fontSize: 12.5 }} onClick={load}>
                                    Retry
                                </button>
                            </div>
                        ) : snapshot ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    {statCards.map((s) => (
                                        <div key={s.label} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
                                            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: 11, color: MUTED }}>{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {snapshot.placementDistribution.length > 0 && (
                                    <div>
                                        <p style={{ margin: '0 0 6px', fontSize: 11.5, color: MUTED }}>Placement Distribution</p>
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                            {snapshot.placementDistribution.map((d) => (
                                                <span key={d._id} style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
                                                    {PLACEMENT_LABELS[d._id] || d._id}: {d.count}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button type="button" className="btn-gold" style={{ padding: '8px 14px', fontSize: 12.5, alignSelf: 'flex-start' }} onClick={() => downloadPageAsPDF('SkillSense-System-Snapshot.pdf')}>
                                    Download PDF (print view)
                                </button>
                            </div>
                        ) : (
                            <p style={{ margin: 0, fontSize: 13, color: MUTED }}>No system snapshot available yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}