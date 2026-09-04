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
    LabelList,
    Cell,
} from 'recharts';
import type { ProgramROI } from '../../types/charts';
import { CHART_THEMES } from '../../lib/chartColors';

interface Props {
    data: ProgramROI[];
}

const theme = CHART_THEMES.dark;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        return (
            <div style={{
                background: 'var(--bg-surface, #111827)',
                border: '1px solid var(--border-default, rgba(255,255,255,0.10))',
                borderRadius: '8px',
                padding: '12px 14px',
                boxShadow: 'var(--shadow-md)',
                minWidth: '180px'
            }}>
                <p style={{
                    color: 'var(--brand-gold, #F59E0B)',
                    fontWeight: 700,
                    fontSize: '13px',
                    marginBottom: '6px'
                }}>{label}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p style={{ color: 'var(--text-primary, #F8FAFC)', fontSize: '12.5px', margin: 0 }}>
                        Return on Investment: <span style={{ color: 'var(--brand-gold, #F59E0B)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{payload[0].value}%</span>
                    </p>
                    <p style={{ 
                        color: 'var(--text-muted, #94A3B8)', 
                        fontSize: '11px', 
                        marginTop: '6px',
                        paddingTop: '6px',
                        borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.06))' 
                    }}>
                        &#8377;1 invested → &#8377;{(payload[0].value / 100 + 1).toFixed(2)} return
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TopLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
        <text
            x={x + width / 2}
            y={y - 6}
            textAnchor="middle"
            fill="var(--brand-gold, #F59E0B)"
            fontSize={11}
            fontWeight={600}
        >
            {value}%
        </text>
    );
};

export default function ProgramROIBar({ data }: Props) {
    const sorted = [...data].sort((a, b) => b.roi - a.roi);
    const maxRoi = Math.max(...sorted.map((d) => d.roi), 100);

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={sorted}
                    margin={{ top: 28, right: 20, left: 10, bottom: 40 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.grid.stroke} vertical={false} />
                    <XAxis
                        dataKey="program"
                        tick={{ fill: theme.axis.tick, fontSize: 10 }}
                        axisLine={{ stroke: theme.grid.stroke }}
                        tickLine={false}
                        angle={-30}
                        textAnchor="end"
                        interval={0}
                    />
                    <YAxis
                        tick={{ fill: theme.axis.tick, fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}%`}
                        domain={[0, maxRoi + 50]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="roi" radius={[4, 4, 0, 0]} maxBarSize={36}>
                        {sorted.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={theme.series.primary}
                                fillOpacity={0.7 + (0.3 * (sorted.length - index)) / sorted.length}
                            />
                        ))}
                        <LabelList content={<TopLabel />} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
