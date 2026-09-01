'use client';

import React, { useState, useEffect } from 'react';
import RegionHeatmap from '@/components/charts/RegionHeatmap';
import type { RegionData } from '@/types/charts';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

// Approximate coordinates and region grouping used to place state-level data on the map.
const STATE_META: Record<string, { region: string; lat: number; lng: number }> = {
    'Jammu & Kashmir': { region: 'North', lat: 34.0, lng: 76.5 },
    'Himachal Pradesh': { region: 'North', lat: 31.1, lng: 77.2 },
    'Punjab': { region: 'North', lat: 31.5, lng: 75.3 },
    'Uttarakhand': { region: 'North', lat: 30.0, lng: 79.0 },
    'Haryana': { region: 'North', lat: 29.0, lng: 76.1 },
    'Delhi': { region: 'North', lat: 28.6, lng: 77.2 },
    'Rajasthan': { region: 'North', lat: 26.9, lng: 75.8 },
    'Uttar Pradesh': { region: 'North', lat: 26.8, lng: 80.9 },
    'Bihar': { region: 'East', lat: 25.1, lng: 85.3 },
    'West Bengal': { region: 'East', lat: 22.9, lng: 88.4 },
    'Sikkim': { region: 'East', lat: 27.5, lng: 88.5 },
    'Assam': { region: 'East', lat: 26.2, lng: 92.9 },
    'Meghalaya': { region: 'East', lat: 25.5, lng: 91.4 },
    'Manipur': { region: 'East', lat: 24.7, lng: 93.9 },
    'Tripura': { region: 'East', lat: 23.8, lng: 91.3 },
    'Mizoram': { region: 'East', lat: 23.2, lng: 92.9 },
    'Nagaland': { region: 'East', lat: 25.7, lng: 94.1 },
    'Arunachal Pradesh': { region: 'East', lat: 28.2, lng: 94.7 },
    'Jharkhand': { region: 'East', lat: 23.6, lng: 85.3 },
    'Odisha': { region: 'East', lat: 20.9, lng: 84.9 },
    'Chhattisgarh': { region: 'Central', lat: 21.3, lng: 81.6 },
    'Madhya Pradesh': { region: 'Central', lat: 23.2, lng: 77.4 },
    'Gujarat': { region: 'West', lat: 22.3, lng: 72.1 },
    'Maharashtra': { region: 'West', lat: 19.1, lng: 75.7 },
    'Telangana': { region: 'South', lat: 17.1, lng: 79.0 },
    'Andhra Pradesh': { region: 'South', lat: 16.5, lng: 79.9 },
    'Karnataka': { region: 'South', lat: 15.3, lng: 75.7 },
    'Kerala': { region: 'South', lat: 10.9, lng: 76.3 },
    'Tamil Nadu': { region: 'South', lat: 11.1, lng: 78.6 },
    'Goa': { region: 'West', lat: 15.5, lng: 73.9 },
};

export default function HeatmapPage() {
    const [heatmapData, setHeatmapData] = useState<RegionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get('/analytics/national-heatmap')
            .then(res => {
                const data = res.data?.data;
                if (Array.isArray(data) && data.length > 0) {
                    const mapped = data
                        .filter((d) => STATE_META[d.state])
                        .map((d) => ({
                            region: STATE_META[d.state].region,
                            state: d.state,
                            lat: STATE_META[d.state].lat,
                            lng: STATE_META[d.state].lng,
                            skillScore: Math.round(d.avgScore ?? 0),
                            placementRate: Math.round(d.placementRate ?? 0),
                            studentCount: d.studentCount ?? 0,
                            criticalGaps: [],
                        }));
                    setHeatmapData(mapped);
                }
                setLoading(false);
            })
            .catch(() => {
                setError('National heatmap data is currently unavailable. Please try again.');
                setLoading(false);
            });
    }, []);

    const avgScore = heatmapData.length
        ? Math.round(heatmapData.reduce((s, r) => s + r.skillScore, 0) / heatmapData.length)
        : 0;
    const totalStudents = heatmapData.reduce((s, r) => s + r.studentCount, 0);

    return (
        <ErrorBoundary>
            <div style={{ color: WHITE, maxWidth: 1000 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                        National Region <span style={{ color: GOLD }}>Heatmap</span>
                    </h1>
                    <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                        Live geographic telemetry of regional skill competence and employment velocity
                    </p>
                </div>

                {loading ? (
                    <Skeleton height={250} width="100%" />
                ) : error ? (
                    <div style={{ padding: 24, borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: 13, textAlign: 'center' }}>
                        ⚠ {error}
                    </div>
                ) : heatmapData.length === 0 ? (
                    <div style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: 13, textAlign: 'center' }}>
                        No regional student data available yet. Reports will appear here as institutions onboard students.
                    </div>
                ) : (
                    <>
                        {/* Summary stats */}
                        <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
                            {[
                                { label: 'Regions Tracked', value: heatmapData.length },
                                { label: 'Average Score', value: avgScore > 0 ? `${avgScore}/100` : '—' },
                                { label: 'At-Risk Territories', value: heatmapData.filter((r) => r.skillScore > 0 && r.skillScore < 65).length },
                                { label: 'Total Monitored Cohort', value: totalStudents > 0 ? totalStudents.toLocaleString('en-IN') : '—' },
                            ].map((s) => (
                                <div key={s.label} style={{ padding: '12px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
                                    <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: GOLD }}>{s.value}</p>
                                    <p style={{ margin: '2px 0 0', fontSize: 12, color: MUTED }}>{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Heatmap visual component */}
                        <RegionHeatmap data={heatmapData} />
                    </>
                )}
            </div>
        </ErrorBoundary>
    );
}
