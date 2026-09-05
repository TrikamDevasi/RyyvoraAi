'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import type { KPIData } from '../../types/charts';

interface KPICardProps extends KPIData {
    compact?: boolean;
    subtitle?: string;
}

export default function KPICard({
    label,
    value,
    unit,
    trend,
    trendDirection = 'neutral',
    icon,
    compact = false,
    subtitle,
}: KPICardProps) {
    const numericValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
    const isNumeric = typeof value === 'number';
    const animated = useAnimatedCounter(numericValue);

    const displayValue = isNumeric
        ? animated.toLocaleString('en-IN')
        : value;

    return (
        <div
            className="card-kpi"
            style={{
                borderRadius: compact ? 6 : 8,
                padding: compact ? '14px 16px' : '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 6,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
            }}
        >
            {/* Header row: Uppercase tracked label + discrete icon */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span
                    style={{
                        color: 'var(--text-muted)',
                        fontSize: compact ? 10.5 : 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        lineHeight: 1.3,
                    }}
                >
                    {label}
                </span>
                {icon && (
                    <span
                        style={{
                            fontSize: compact ? 13 : 15,
                            color: 'var(--text-muted)',
                            opacity: 0.8,
                            flexShrink: 0,
                        }}
                        aria-hidden="true"
                    >
                        {icon}
                    </span>
                )}
            </div>

            {/* Metric Value with Tabular Numerals */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '2px 0' }}>
                <span
                    className="font-display tabular-numbers"
                    style={{
                        color: 'var(--text-primary)',
                        fontSize: compact ? 20 : 26,
                        fontWeight: 800,
                        lineHeight: 1.15,
                        letterSpacing: '-0.025em',
                        fontVariantNumeric: 'tabular-nums',
                    }}
                >
                    {displayValue}
                </span>
                {unit && (
                    <span style={{ color: 'var(--text-secondary)', fontSize: compact ? 11.5 : 12.5, fontWeight: 600 }}>
                        {unit}
                    </span>
                )}
            </div>

            {/* Trend & Context row (Color only for trend, no heavy badge pill) */}
            {(trend !== undefined || subtitle) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    {trend !== undefined && (
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                                fontWeight: 700,
                                fontVariantNumeric: 'tabular-nums',
                                color:
                                    trendDirection === 'up'
                                        ? 'var(--success)'
                                        : trendDirection === 'down'
                                        ? 'var(--error)'
                                        : 'var(--text-muted)',
                            }}
                        >
                            {trendDirection === 'up' ? (
                                <TrendingUp size={12} aria-hidden="true" />
                            ) : trendDirection === 'down' ? (
                                <TrendingDown size={12} aria-hidden="true" />
                            ) : (
                                <Minus size={12} aria-hidden="true" />
                            )}
                            <span>{Math.abs(trend)}%</span>
                        </span>
                    )}
                    <span>{subtitle || 'vs previous period'}</span>
                </div>
            )}
        </div>
    );
}

export interface MetricStripItem {
    label: string;
    value: string | number;
    unit?: string;
    trend?: number | { value: string | number; direction?: 'up' | 'down' | 'neutral' };
    trendDirection?: 'up' | 'down' | 'neutral';
    subtitle?: string;
    subtext?: string;
    icon?: React.ReactNode | React.ElementType;
    color?: string;
}

export function MetricStrip({
    items,
    className,
    style,
}: {
    items: MetricStripItem[];
    className?: string;
    style?: React.CSSProperties;
}) {
    return (
        <div className={`metric-strip ${className || ''}`} style={style}>
            {items.map((item, idx) => {
                const effectiveTrend = typeof item.trend === 'object' ? item.trend.value : item.trend;
                const effectiveTrendDir = typeof item.trend === 'object' ? (item.trend.direction || 'neutral') : (item.trendDirection || 'neutral');
                const effectiveSub = item.subtext || item.subtitle;

                return (
                    <div key={idx} className="metric-strip-item">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    color: 'var(--text-muted)',
                                }}
                            >
                                {item.label}
                            </span>
                            {item.icon && (
                                <span style={{ color: item.color || 'var(--text-muted)', opacity: 0.85, display: 'inline-flex', alignItems: 'center' }} aria-hidden="true">
                                    {React.isValidElement(item.icon)
                                        ? item.icon
                                        : typeof item.icon === 'function'
                                        ? React.createElement(item.icon as React.ComponentType<{ size?: number }>, { size: 15 })
                                        : null}
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '4px 0' }}>
                            <span
                                className="font-display tabular-numbers"
                                style={{
                                    fontSize: 24,
                                    fontWeight: 800,
                                    color: item.color || 'var(--text-primary)',
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1.15,
                                }}
                            >
                                {item.value}
                            </span>
                            {item.unit && (
                                <span style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }}>
                                    {item.unit}
                                </span>
                            )}
                        </div>
                        {(effectiveTrend !== undefined || effectiveSub) && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)' }}>
                                {effectiveTrend !== undefined && (
                                    <span
                                        style={{
                                            color:
                                                effectiveTrendDir === 'up'
                                                    ? 'var(--success)'
                                                    : effectiveTrendDir === 'down'
                                                    ? 'var(--error)'
                                                    : 'var(--text-muted)',
                                            fontWeight: 700,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 2,
                                        }}
                                    >
                                        {effectiveTrendDir === 'up' ? (
                                            <TrendingUp size={11} />
                                        ) : effectiveTrendDir === 'down' ? (
                                            <TrendingDown size={11} />
                                        ) : (
                                            <Minus size={11} />
                                        )}
                                        <span>{typeof effectiveTrend === 'number' ? `${Math.abs(effectiveTrend)}%` : effectiveTrend}</span>
                                    </span>
                                )}
                                {effectiveSub && <span>{effectiveSub}</span>}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
