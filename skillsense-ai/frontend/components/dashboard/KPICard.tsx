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
            className="card-kpi card-interactive"
            style={{
                borderRadius: compact ? 8 : 10,
                padding: compact ? '14px 16px' : '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
            }}
        >
            {/* Header row: Label + subtle icon */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <p
                    style={{
                        color: 'var(--text-secondary)',
                        fontSize: compact ? 12 : 12.5,
                        fontWeight: 600,
                        margin: 0,
                        lineHeight: 1.3,
                    }}
                >
                    {label}
                </p>
                {icon && (
                    <span
                        style={{
                            fontSize: compact ? 14 : 16,
                            color: 'var(--text-muted)',
                            opacity: 0.85,
                            flexShrink: 0,
                        }}
                        aria-hidden="true"
                    >
                        {icon}
                    </span>
                )}
            </div>

            {/* Metric Value with Tabular Numerals */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 2 }}>
                <span
                    className="font-display tabular-numbers"
                    style={{
                        color: 'var(--text-primary)',
                        fontSize: compact ? 22 : 28,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        fontVariantNumeric: 'tabular-nums',
                    }}
                >
                    {displayValue}
                </span>
                {unit && (
                    <span style={{ color: 'var(--gold)', fontSize: compact ? 12 : 13.5, fontWeight: 650 }}>
                        {unit}
                    </span>
                )}
            </div>

            {/* Trend & Context row */}
            {(trend !== undefined || subtitle) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    {trend !== undefined && (
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                                padding: '1px 6px',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 650,
                                fontVariantNumeric: 'tabular-nums',
                                background:
                                    trendDirection === 'up'
                                        ? 'var(--success-bg)'
                                        : trendDirection === 'down'
                                        ? 'var(--error-bg)'
                                        : 'var(--bg-surface-elevated)',
                                color:
                                    trendDirection === 'up'
                                        ? 'var(--success)'
                                        : trendDirection === 'down'
                                        ? 'var(--error)'
                                        : 'var(--text-muted)',
                                border: `1px solid ${
                                    trendDirection === 'up'
                                        ? 'var(--success-border)'
                                        : trendDirection === 'down'
                                        ? 'var(--error-border)'
                                        : 'var(--border)'
                                }`,
                            }}
                        >
                            {trendDirection === 'up' ? (
                                <TrendingUp size={11} aria-hidden="true" />
                            ) : trendDirection === 'down' ? (
                                <TrendingDown size={11} aria-hidden="true" />
                            ) : (
                                <Minus size={11} aria-hidden="true" />
                            )}
                            <span>{Math.abs(trend)}%</span>
                        </span>
                    )}
                    <span style={{ color: 'var(--text-muted)', fontSize: 11.5 }}>
                        {subtitle || 'vs baseline'}
                    </span>
                </div>
            )}
            {/* Gold bottom accent indicator */}
            <div
                className="kpi-gold-bar"
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: 2,
                    width: '35%',
                    background: 'linear-gradient(90deg, var(--gold), transparent)',
                }}
            />
        </div>
    );
}
