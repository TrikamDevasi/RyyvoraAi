'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import type { FairnessMetrics } from '../../types/charts';

interface Props {
    data: FairnessMetrics;
}

const GOLD = '#F59E0B';
const WARN = '#ef4444';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        const gap = payload.length === 2 ? Math.abs((payload[0]?.value ?? 0) - (payload[1]?.value ?? 0)) : 0;
        return (
            <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px 14px',
                boxShadow: 'var(--shadow-md)',
                minWidth: '180px'
            }}>
                <p style={{
                    color: 'var(--gold)',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    marginBottom: '6px'
                }}>{label}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} style={{
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        margin: '2px 0'
                    }}>
                        {p.name}: <span style={{ color: p.fill, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{p.value?.toFixed(1)}</span>
                    </p>
                ))}
                {payload.length === 2 && (
                    <p style={{
                        color: gap > 10 ? WARN : gap > 5 ? '#f59e0b' : 'var(--success)',
                        fontSize: 11.5,
                        marginTop: 8,
                        borderTop: '1px solid var(--border)',
                        paddingTop: 6,
                        fontWeight: 600,
                        fontVariantNumeric: 'tabular-nums'
                    }}>
                        Disparity Gap: {gap.toFixed(1)}% {gap > 10 ? '(High Disparity)' : gap > 5 ? '(Moderate)' : '(Compliant)'}
                    </p>
                )}
            </div>
        );
    }
    return null;
};

export default function FairnessDistribution({ data }: Props) {
    const chartData = [
        { category: 'Male', score: data.genderGap.male, group: 'Gender' },
        { category: 'Female', score: data.genderGap.female, group: 'Gender' },
        { category: 'North', score: data.regionGap.north, group: 'Region' },
        { category: 'South', score: data.regionGap.south, group: 'Region' },
        { category: 'East', score: data.regionGap.east, group: 'Region' },
        { category: 'West', score: data.regionGap.west, group: 'Region' },
        { category: 'Central', score: data.regionGap.central, group: 'Region' },
    ];

    const avgScore =
        chartData.reduce((s, d) => s + d.score, 0) / chartData.length;

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
                    barSize={28}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} vertical={false} />
                    <XAxis
                        dataKey="category"
                        tick={{ fill: 'var(--text-secondary)', fontSize: 11.5 }}
                        axisLine={{ stroke: 'var(--border)' }}
                        tickLine={false}
                    />
                    <YAxis
                        domain={[50, 100]}
                        tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine
                        y={avgScore}
                        stroke="var(--text-muted)"
                        strokeDasharray="4 2"
                        strokeOpacity={0.5}
                        label={{
                            value: `Avg ${avgScore.toFixed(1)}`,
                            fill: 'var(--text-secondary)',
                            fontSize: 10.5,
                            position: 'insideTopRight',
                        }}
                    />
                    <Bar
                        dataKey="score"
                        radius={[4, 4, 0, 0]}
                        fill={GOLD}
                        fillOpacity={0.85}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
