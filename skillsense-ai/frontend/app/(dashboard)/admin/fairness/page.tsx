'use client';

import React, { useState, useEffect } from 'react';
import FairnessDistribution from '@/components/charts/FairnessDistribution';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

export default function FairnessPage() {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = () => {
        setLoading(true);
        setError('');
        api.get('/admin/fairness-dashboard')
            .then((res) => {
                const data = res.data?.data;
                setMetrics(data && typeof data === 'object' ? data : null);
            })
            .catch(() => setError('Fairness audit data is currently unavailable. Please try again.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const overallScore: number | null = typeof metrics?.overallFairnessScore === 'number' ? metrics.overallFairnessScore : null;

    const genderGap: number | null =
        typeof metrics?.genderGap?.male === 'number' && typeof metrics?.genderGap?.female === 'number'
            ? Math.abs(metrics.genderGap.male - metrics.genderGap.female)
            : null;

    const regionGap: number | null = (() => {
        const r = metrics?.regionGap;
        if (!r) return null;
        const values = ['north', 'south', 'east', 'west', 'central'].map((k) => r[k]).filter((v) => typeof v === 'number');
        if (values.length < 2) return null;
        return Math.max(...values) - Math.min(...values);
    })();

    return (
        <ErrorBoundary>
            <div style={{ color: WHITE, maxWidth: 1100 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                        Fairness & <span style={{ color: GOLD }}>Equity Telemetry</span>
                    </h1>
                    <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                        Algorithmic disparate impact audits, demographic parity, and regional parity tracking
                    </p>
                </div>

                {loading ? (
                    <Skeleton height={250} width="100%" />
                ) : error ? (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 40, textAlign: 'center' }}>
                        <p style={{ color: '#f87171', fontSize: 13.5, margin: 0 }}>{error}</p>
                        <button type="button" className="btn-gold" style={{ marginTop: 16, padding: '8px 20px', fontSize: 13 }} onClick={load}>
                            Retry
                        </button>
                    </div>
                ) : !metrics ? (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 40, textAlign: 'center' }}>
                        <p style={{ color: MUTED, fontSize: 13.5, margin: 0 }}>
                            No fairness audit has been computed yet — add assessed students to generate demographic parity metrics.
                        </p>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
                            <div style={{ padding: '20px', background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.3)', borderRadius: 14 }}>
                                <p style={{ margin: '0 0 4px', fontSize: 12, color: MUTED, textTransform: 'uppercase' }}>Equity Score</p>
                                <p style={{ margin: 0, fontSize: 38, fontWeight: 800, color: (overallScore ?? 0) >= 80 ? '#22c55e' : GOLD }}>
                                    {overallScore != null ? `${overallScore} / 100` : '—'}
                                </p>
                            </div>
                            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14 }}>
                                <p style={{ margin: '0 0 4px', fontSize: 12, color: MUTED, textTransform: 'uppercase' }}>Gender Disparity Gap</p>
                                <p style={{ margin: 0, fontSize: 38, fontWeight: 800, color: '#22c55e' }}>
                                    {genderGap != null ? `${genderGap.toFixed(1)}%` : '—'}
                                </p>
                            </div>
                            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14 }}>
                                <p style={{ margin: '0 0 4px', fontSize: 12, color: MUTED, textTransform: 'uppercase' }}>Regional Parity Variance</p>
                                <p style={{ margin: 0, fontSize: 38, fontWeight: 800, color: GOLD }}>
                                    {regionGap != null ? `${regionGap.toFixed(1)}%` : '—'}
                                </p>
                            </div>
                        </div>

                        {metrics.flags && metrics.flags.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                                {metrics.flags.map((f: any, i: number) => (
                                    <div key={i} style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', fontSize: 12.5, color: '#fca5a5' }}>
                                        <strong>{f.title}</strong> — {f.description}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,168,67,0.18)', borderRadius: 14, padding: '20px' }}>
                            <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700 }}>Demographic Score Distribution</h3>
                            <p style={{ margin: '0 0 14px', fontSize: 12, color: MUTED }}>Mean scores by gender and region</p>
                            <FairnessDistribution data={metrics} />
                        </div>
                    </>
                )}
            </div>
        </ErrorBoundary>
    );
}