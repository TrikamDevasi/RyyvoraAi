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

interface Props {
    data: PlacementData[];
}

const GOLD = '#F59E0B';
const MUTED = '#94a3b8';
const WHITE = '#FFFFFF';
const AMBER = '#FBBF24';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        const d = payload[0].payload as PlacementData;
        return (
            <div style={{
                background: 'rgba(10, 10, 20, 0.95)',
                border: '1px solid rgba(212, 168, 67, 0.4)',
                borderRadius: '10px',
                padding: '12px 16px',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                minWidth: '200px'
            }}>
                <p style={{
                    color: '#F59E0B',
                    fontWeight: 700,
                    fontSize: '14px',
                    marginBottom: '8px'
                }}>{label}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p style={{ color: '#ffffff', fontSize: '13px', margin: 0 }}>
                        Placed: <span style={{ color: '#F59E0B', fontWeight: 600 }}>{d.placedCount}</span>
                    </p>
                    <p style={{ color: '#ffffff', fontSize: '13px', margin: 0 }}>
                        Avg Salary: <span style={{ color: '#F59E0B', fontWeight: 600 }}>&#8377;{(d.avgSalary || 0).toLocaleString('en-IN')}</span>
                    </p>
                    {d.placementRate !== undefined && (
                        <p style={{ color: '#ffffff', fontSize: '13px', margin: 0 }}>
                            Rate: <span style={{ color: '#22c55e', fontWeight: 700 }}>{d.placementRate}%</span>
                        </p>
                    )}
                    {d.topSector !== undefined && d.topSector !== null && (
                        <p style={{
                            color: '#94a3b8',
                            fontSize: '11px',
                            marginTop: '8px',
                            paddingTop: '8px',
                            borderTop: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            Top: {d.topSector}{d.femalePercent !== undefined ? ` • Female ${d.femalePercent}%` : ''}
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
    return <Dot cx={cx} cy={cy} r={4} fill={GOLD} stroke="rgba(212,168,67,0.4)" strokeWidth={3} />;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GoldActiveDot = (props: any) => {
    const { cx, cy } = props;
    return (
        <g>
            <circle cx={cx} cy={cy} r={10} fill="rgba(212,168,67,0.2)" />
            <circle cx={cx} cy={cy} r={6} fill={GOLD} />
            <circle cx={cx} cy={cy} r={3} fill={WHITE} />
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
                            <stop offset="5%" stopColor={GOLD} stopOpacity={0.35} />
                            <stop offset="95%" stopColor={GOLD} stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: MUTED, fontSize: 11 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: MUTED, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="placedCount"
                        stroke={GOLD}
                        strokeWidth={2.5}
                        fill="url(#goldGradient)"
                        dot={<GoldDot />}
                        activeDot={<GoldActiveDot />}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
