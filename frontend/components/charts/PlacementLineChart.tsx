'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Dot,
} from 'recharts';
import type { PlacementData } from '../../types/charts';
import { CHART_THEMES } from '../../lib/chartColors';

interface Props {
    data: PlacementData[];
}

const theme = CHART_THEMES.dark;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        const d = payload[0].payload as PlacementData;
        return (
            <div style={{
                background: 'var(--bg-surface, #111827)',
                border: '1px solid var(--border-default, rgba(255,255,255,0.10))',
                borderRadius: '8px',
                padding: '12px 14px',
                boxShadow: 'var(--shadow-md)',
                minWidth: '190px'
            }}>
                <p style={{
                    color: 'var(--brand-gold, #F59E0B)',
                    fontWeight: 700,
                    fontSize: '13px',
                    marginBottom: '8px'
                }}>{label}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p style={{ color: 'var(--text-primary, #F8FAFC)', fontSize: '12.5px', margin: 0 }}>
                        Placed: <span style={{ color: 'var(--brand-gold, #F59E0B)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{d.placedCount}</span>
                    </p>
                    <p style={{ color: 'var(--text-primary, #F8FAFC)', fontSize: '12.5px', margin: 0 }}>
                        Avg Package: <span style={{ color: 'var(--brand-gold, #F59E0B)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>&#8377;{(d.avgSalary || 0).toLocaleString('en-IN')}</span>
                    </p>
                    {d.placementRate !== undefined && (
                        <p style={{ color: 'var(--text-primary, #F8FAFC)', fontSize: '12.5px', margin: 0 }}>
                            Rate: <span style={{ color: 'var(--success, #10B981)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{d.placementRate}%</span>
                        </p>
                    )}
                    {d.topSector !== undefined && d.topSector !== null && (
                        <p style={{
                            color: 'var(--text-muted, #94A3B8)',
                            fontSize: '11px',
                            marginTop: '6px',
                            paddingTop: '6px',
                            borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.06))'
                        }}>
                            Top Sector: {d.topSector}{d.femalePercent !== undefined ? ` • Female ${d.femalePercent}%` : ''}
                        </p>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GoldDot = (props: any) => {
    const { cx, cy } = props;
    return <Dot cx={cx} cy={cy} r={3.5} fill={theme.series.primary} stroke={theme.tooltip.background} strokeWidth={2} />;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GoldActiveDot = (props: any) => {
    const { cx, cy } = props;
    return (
        <g>
            <circle cx={cx} cy={cy} r={6} fill={theme.series.primary} />
            <circle cx={cx} cy={cy} r={2.5} fill="#FFFFFF" />
        </g>
    );
};

export default function PlacementLineChart({ data }: Props) {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.series.primary} stopOpacity={0.25} />
                            <stop offset="95%" stopColor={theme.series.primary} stopOpacity={0.0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.grid.stroke} vertical={false} />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: theme.axis.tick, fontSize: 11 }}
                        axisLine={{ stroke: theme.grid.stroke }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: theme.axis.tick, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="placedCount"
                        stroke={theme.series.primary}
                        strokeWidth={2}
                        fill="url(#goldGradient)"
                        dot={<GoldDot />}
                        activeDot={<GoldActiveDot />}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
