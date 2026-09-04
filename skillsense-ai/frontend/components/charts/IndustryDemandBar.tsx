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
import type { IndustryDemandData } from '../../types/charts';
import { CHART_THEMES } from '../../lib/chartColors';

interface Props {
    data: IndustryDemandData[];
    showTop?: number;
}

const theme = CHART_THEMES.dark;

const GAP_COLORS: Record<string, string> = {
    critical: 'var(--error, #EF4444)',
    moderate: 'var(--warning, #EAB308)',
    stable: 'var(--success, #10B981)',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
        const d = payload[0].payload as IndustryDemandData;
        return (
            <div style={{
                background: 'var(--bg-surface, #111827)',
                border: '1px solid var(--border-default, rgba(255,255,255,0.10))',
                borderRadius: '8px',
                padding: '12px 14px',
                boxShadow: 'var(--shadow-md)',
                minWidth: '210px'
            }}>
                <p style={{
                    color: 'var(--brand-gold, #F59E0B)',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    marginBottom: '8px'
                }}>{d.skill}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p style={{ color: 'var(--text-secondary, #94A3B8)', fontSize: '12px', margin: 0 }}>
                        Domain: <span style={{ color: 'var(--text-primary, #F8FAFC)' }}>{d.domain}</span>
                    </p>
                    <p style={{ color: 'var(--text-primary, #F8FAFC)', fontSize: '12.5px', margin: 0 }}>
                        Current Demand: <span style={{ color: 'var(--brand-gold, #F59E0B)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{d.currentDemand.toLocaleString('en-IN')}</span>
                    </p>
                    <p style={{ color: 'var(--text-primary, #F8FAFC)', fontSize: '12.5px', margin: 0 }}>
                        2026 Forecast: <span style={{ color: 'var(--info, #06B6D4)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{d.projectedDemand2026.toLocaleString('en-IN')}</span>
                    </p>
                    <p style={{ color: 'var(--text-primary, #F8FAFC)', fontSize: '12.5px', margin: 0 }}>
                        Growth: <span style={{ color: d.growthPercent >= 0 ? 'var(--success, #10B981)' : 'var(--error, #EF4444)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                            {d.growthPercent >= 0 ? '+' : ''}{d.growthPercent}%
                        </span>
                    </p>
                    <p style={{ color: 'var(--text-primary, #F8FAFC)', fontSize: '12.5px', margin: 0 }}>
                        Avg Package: <span style={{ color: 'var(--text-primary, #F8FAFC)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>&#8377;{d.avgSalary.toLocaleString('en-IN')}</span>
                    </p>
                    <p style={{ 
                        fontSize: '11.5px', 
                        marginTop: '6px', 
                        paddingTop: '6px',
                        borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.06))',
                        color: GAP_COLORS[d.supplyGap] || 'var(--text-muted)',
                        fontWeight: 700
                    }}>
                        Supply Status: {d.supplyGap.toUpperCase()}
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function IndustryDemandBar({ data, showTop = 10 }: Props) {
    const sorted = [...data]
        .sort((a, b) => b.currentDemand - a.currentDemand)
        .slice(0, showTop);

    return (
        <div style={{ width: '100%', height: Math.max(300, sorted.length * 38) }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={sorted}
                    layout="vertical"
                    margin={{ top: 5, right: 80, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.grid.stroke} horizontal={false} />
                    <XAxis
                        type="number"
                        tick={{ fill: theme.axis.tick, fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) =>
                            v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`
                        }
                    />
                    <YAxis
                        type="category"
                        dataKey="skill"
                        width={150}
                        tick={{ fill: theme.axis.label, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="currentDemand" radius={[0, 4, 4, 0]} maxBarSize={20}>
                        {sorted.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={theme.series.primary} fillOpacity={0.85} />
                        ))}
                        <LabelList
                            dataKey="currentDemand"
                            position="right"
                            formatter={(v: number) =>
                                v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`
                            }
                            style={{ fill: theme.axis.tick, fontSize: 11, fontVariantNumeric: 'tabular-nums' }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
