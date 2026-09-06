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
    ReferenceLine,
} from 'recharts';
import type { ForecastEntry } from '../../types/charts';
import { useChartTheme } from '../../lib/chartColors';

interface Props {
    data: ForecastEntry[];
    currentMonthIndex?: number; // index where forecast starts
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        return (
            <div style={{
                background: 'var(--bg-surface, #111827)',
                border: '1px solid var(--border-strong, rgba(255,255,255,0.12))',
                borderRadius: '8px',
                padding: '10px 14px',
                boxShadow: 'var(--shadow-md)',
                minWidth: '160px'
            }}>
                <p style={{
                    color: 'var(--brand-gold, #D97706)',
                    fontWeight: 700,
                    fontSize: '13px',
                    marginBottom: '6px'
                }}>{label}</p>
                {payload.map((p: any, i: number) => {
                    const isActual = p.name === 'actual';
                    const color = isActual ? 'var(--brand-gold, #D97706)' : 'var(--info, #0E7490)';
                    return (
                        <p key={i} style={{
                            color: 'var(--text-primary, #0F172A)',
                            fontSize: '12.5px',
                            margin: '3px 0'
                        }}>
                            {isActual ? 'Actual' : 'AI Forecast'}: <span style={{ color, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{p.value?.toFixed(1)}%</span>
                        </p>
                    );
                })}
            </div>
        );
    }
    return null;
};

export default function SkillForecastArea({ data, currentMonthIndex }: Props) {
    const theme = useChartTheme();

    // Determine split index — first entry with only forecast (no actual)
    const splitIdx =
        currentMonthIndex ??
        data.findIndex((d) => d.actual === undefined && d.forecast !== undefined);

    const splitLabel = splitIdx >= 0 && splitIdx < data.length ? data[splitIdx].month : undefined;

    return (
        <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.series.primary} stopOpacity={0.25} />
                            <stop offset="95%" stopColor={theme.series.primary} stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.series.telemetry} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={theme.series.telemetry} stopOpacity={0.0} />
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
                        tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />

                    {splitLabel && (
                        <ReferenceLine
                            x={splitLabel}
                            stroke={theme.series.telemetry}
                            strokeDasharray="4 3"
                            label={{
                                value: 'AI Projection →',
                                fill: theme.series.telemetry,
                                fontSize: 11,
                                fontWeight: 600,
                                position: 'insideTopRight',
                            }}
                        />
                    )}

                    <Area
                        type="monotone"
                        dataKey="actual"
                        stroke={theme.series.primary}
                        strokeWidth={2}
                        fill="url(#actualGradient)"
                        dot={false}
                        connectNulls={false}
                    />
                    <Area
                        type="monotone"
                        dataKey="forecast"
                        stroke={theme.series.telemetry}
                        strokeWidth={2}
                        strokeDasharray="5 3"
                        fill="url(#forecastGradient)"
                        dot={false}
                        connectNulls={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
