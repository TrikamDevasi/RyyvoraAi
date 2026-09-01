'use client';

import React, { useState, useEffect } from 'react';
import PlacementLineChart from '@/components/charts/PlacementLineChart';
import KPICard from '@/components/dashboard/KPICard';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import type { PlacementData } from '@/types/charts';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

interface TrendRow {
    month: string;
    placed: number;
    avgSalary: number;
}

export default function PlacementPage() {
    const [placementData, setPlacementData] = useState<PlacementData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = () => {
        setLoading(true);
        setError('');
        api.get('/analytics/placement-trends')
            .then((res) => {
                const data = res.data?.data;
                if (!Array.isArray(data)) {
                    setPlacementData([]);
                } else {
                    const rows: TrendRow[] = data.filter((d: any) => d && typeof d === 'object');
                    setPlacementData(rows.map((d) => ({
                        month: String(d.month ?? ''),
                        placedCount: Number(d.placed ?? 0),
                        avgSalary: Number(d.avgSalary ?? 0),
                    })));
                }
            })
            .catch(() => setError('Placement trends are currently unavailable. Please try again.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const latest = placementData.length > 0 ? placementData[placementData.length - 1] : undefined;
    const prev = placementData.length > 1 ? placementData[placementData.length - 2] : undefined;

    const pctChange = (curr: number | undefined, base: number | undefined): number | undefined => {
        if (curr === undefined || base === undefined || base === 0) return undefined;
        return Math.round(((curr - base) / base) * 100);
    };

    return (
        <ErrorBoundary>
            <div style={{ color: WHITE, maxWidth: 1100 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                        Placement <span style={{ color: GOLD }}>Analytics & Trends</span>
                    </h1>
                    <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                        Verified candidate placements by period
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
                ) : placementData.length === 0 ? (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 40, textAlign: 'center' }}>
                        <p style={{ color: MUTED, fontSize: 13.5, margin: 0 }}>
                            No verified placement records found yet. Placement trends will appear here as candidates are placed.
                        </p>
                        <button type="button" className="btn-secondary" style={{ marginTop: 16, padding: '8px 20px', fontSize: 13 }} onClick={load}>
                            Refresh
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                            <KPICard label="Placed This Cohort" value={latest!.placedCount} trend={pctChange(latest!.placedCount, prev?.placedCount)} trendDirection="up" icon="+" />
                            <KPICard label="Placement Rate" value="—" unit="%" icon="%" />
                            <KPICard label="Avg Package" value={latest!.avgSalary} unit="₹" trend={pctChange(latest!.avgSalary, prev?.avgSalary)} trendDirection="up" icon="₹" />
                            <KPICard label="Female Ratio" value="—" unit="%" icon="F" />
                            <KPICard label="Top Hiring Sector" value="—" icon="S" />
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,168,67,0.18)', borderRadius: 14, padding: '24px', marginBottom: 24 }}>
                            <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700 }}>Monthly Placement Trajectory</h3>
                            <p style={{ margin: '0 0 16px', fontSize: 12, color: MUTED }}>Verified candidate placements by period</p>
                            <PlacementLineChart data={placementData} />
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ background: 'rgba(212,168,67,0.08)' }}>
                                        {['Period', 'Placed Students', 'Average Package'].map((h) => (
                                            <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...placementData].reverse().map((row, i) => (
                                        <tr key={row.month || i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                                            <td style={{ padding: '10px 14px', color: i === 0 ? GOLD : WHITE, fontWeight: i === 0 ? 700 : 400, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.month}{i === 0 && ' (latest)'}</td>
                                            <td style={{ padding: '10px 14px', color: WHITE, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.placedCount}</td>
                                            <td style={{ padding: '10px 14px', color: MUTED, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>₹{(row.avgSalary || 0).toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p style={{ margin: 0, padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 11.5, color: MUTED }}>
                                Gender equity and sector granularity are not reported in the current placement trend source.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </ErrorBoundary>
    );
}