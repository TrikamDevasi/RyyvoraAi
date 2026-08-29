'use client';

import React, { useState, useEffect } from 'react';
import RegionHeatmap from '@/components/charts/RegionHeatmap';
import { Flag } from 'lucide-react';
import type { RegionData } from '@/types/charts';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const DEFAULT_REGION_DATA: RegionData[] = [
    { region: 'West', state: 'Gujarat', lat: 22.3, lng: 72.1, skillScore: 83, placementRate: 86, studentCount: 45000, criticalGaps: [] },
    { region: 'West', state: 'Maharashtra', lat: 19.1, lng: 75.7, skillScore: 78, placementRate: 80, studentCount: 120000, criticalGaps: ['Cloud Computing'] },
    { region: 'South', state: 'Karnataka', lat: 15.3, lng: 75.7, skillScore: 82, placementRate: 81, studentCount: 88000, criticalGaps: [] },
    { region: 'South', state: 'Tamil Nadu', lat: 11.1, lng: 78.6, skillScore: 79, placementRate: 74, studentCount: 95000, criticalGaps: ['Cybersecurity'] },
    { region: 'North', state: 'Delhi', lat: 28.6, lng: 77.2, skillScore: 77, placementRate: 82, studentCount: 55000, criticalGaps: ['DevOps'] },
    { region: 'North', state: 'Uttar Pradesh', lat: 26.8, lng: 80.9, skillScore: 64, placementRate: 61, studentCount: 180000, criticalGaps: ['Full-Stack Dev'] },
];

export default function HeatmapPage() {
    const [heatmapData, setHeatmapData] = useState<RegionData[]>(DEFAULT_REGION_DATA);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/analytics/national-heatmap')
            .then(res => {
                const data = res.data?.data;
                if (Array.isArray(data) && data.length > 0) {
                    setHeatmapData(data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const avgScore = Math.round(heatmapData.reduce((s, r) => s + (r.skillScore || 75), 0) / heatmapData.length);
    const totalStudents = heatmapData.reduce((s, r) => s + (r.studentCount || 1000), 0);

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
                ) : (
                    <>
                        {/* Summary stats */}
                        <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
                            {[
                                { label: 'Regions Tracked', value: heatmapData.length },
                                { label: 'Average Score', value: `${avgScore}/100` },
                                { label: 'At-Risk Territories', value: heatmapData.filter((r) => r.skillScore < 65).length },
                                { label: 'Total Monitored Cohort', value: `${(totalStudents / 1000).toFixed(0)}k+` },
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
