'use client';

import React, { useState, useEffect } from 'react';
import ProgramROIBar from '@/components/charts/ProgramROIBar';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { useAuth } from '@/hooks/useAuth';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

interface ROIRow {
    program: string;
    roi: number;
}

export default function ROIPage() {
    const { user } = useAuth();
    const institutionId = user?._id;

    const [roiRows, setRoiRows] = useState<ROIRow[]>([]);
    const [placementRate, setPlacementRate] = useState<number | null>(null);
    const [studentCount, setStudentCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = () => {
        if (!institutionId) {
            setError('No linked institution found for this account.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError('');
        Promise.all([
            api.get(`/institutes/${institutionId}/dashboard`),
            api.get(`/institutes/${institutionId}/roi`),
        ])
            .then(([dashRes, roiRes]) => {
                const dash = dashRes.data?.data;
                setPlacementRate(dash?.stats?.placementRate ?? null);
                setStudentCount(dash?.stats?.studentCount ?? null);
                const roi = roiRes.data?.data;
                if (Array.isArray(roi)) {
                    setRoiRows(roi.filter((r: any) => r && typeof r.roi === 'number'));
                } else {
                    setRoiRows([]);
                }
            })
            .catch(() => setError('ROI analytics are currently unavailable. Please try again.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [institutionId]);

    const avgROI = roiRows.length > 0
        ? Math.round(roiRows.reduce((s, r) => s + r.roi, 0) / roiRows.length)
        : null;

    return (
        <ErrorBoundary>
            <div style={{ color: WHITE, maxWidth: 1000 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                        Program <span style={{ color: GOLD }}>ROI & Impact Analytics</span>
                    </h1>
                    <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                        Declared program ROI and placement velocity for your institution
                    </p>
                </div>

                {loading ? (
                    <Skeleton height={250} width="100%" />
                ) : error ? (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 40, textAlign: 'center' }}>
                        <p style={{ color: '#f87171', fontSize: 13.5, margin: 0 }}>{error}</p>
                        {institutionId && (
                            <button type="button" className="btn-gold" style={{ marginTop: 16, padding: '8px 20px', fontSize: 13 }} onClick={load}>
                                Retry
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                            {[
                                { label: 'Average Program ROI', value: avgROI != null ? `${avgROI}%` : '—', color: GOLD },
                                { label: 'Programs with ROI Reported', value: `${roiRows.length}`, color: WHITE },
                                { label: 'Placement Rate', value: placementRate != null ? `${placementRate}%` : '—', color: '#22c55e' },
                                { label: 'Students Tracked', value: studentCount != null ? String(studentCount) : '—', color: '#22c55e' },
                            ].map((s) => (
                                <div key={s.label} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, minWidth: 160 }}>
                                    <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</p>
                                    <p style={{ margin: '2px 0 0', fontSize: 12, color: MUTED }}>{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Chart */}
                        <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#fff' }}>
                                Program ROI Yield
                            </h3>
                            {roiRows.length > 0 ? (
                                <ProgramROIBar data={roiRows} />
                            ) : (
                                <div style={{ padding: '30px 10px', textAlign: 'center' }}>
                                    <p style={{ color: MUTED, fontSize: 13.5, margin: 0 }}>
                                        No program ROI scores have been reported for this institution yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </ErrorBoundary>
    );
}