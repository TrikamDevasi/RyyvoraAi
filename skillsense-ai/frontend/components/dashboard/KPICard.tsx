'use client';

import React from 'react';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import type { KPIData } from '../../types/charts';

interface KPICardProps extends KPIData {
    compact?: boolean;
}

export default function KPICard({
    label,
    value,
    unit,
    trend,
    trendDirection = 'neutral',
    icon,
    compact = false,
}: KPICardProps) {
    const numericValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
    const isNumeric = typeof value === 'number';
    const animated = useAnimatedCounter(numericValue);

    const displayValue = isNumeric
        ? animated.toLocaleString('en-IN')
        : value;

    return (
        <div
            className="card-kpi card-interactive card-3d card-hover-icon-parent"
            style={{
                borderRadius: compact ? 'var(--radius-md)' : 'var(--radius-lg)',
                padding: compact ? '14px 16px' : '18px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
            }}
        >
            {/* Background subtle radial glow */}
            <div
                style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--gold-muted) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p
                    style={{
                        color: 'var(--text-muted)',
                        fontSize: compact ? 11 : 11.5,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        margin: 0,
                    }}
                >
                    {label}
                </p>
                {icon && (
                    <div
                        className="card-icon-container interactive-icon hover-scale-icon"
                        style={{
                            width: compact ? 28 : 34,
                            height: compact ? 28 : 34,
                            borderRadius: compact ? 'var(--radius-sm)' : 'var(--radius-md)',
                        }}
                    >
                        <span style={{ fontSize: compact ? 13 : 15, fontWeight: 700 }}>{icon}</span>
                    </div>
                )}
            </div>

            {/* Value */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span
                    className="font-display"
                    style={{
                        color: 'var(--text-primary)',
                        fontSize: compact ? 22 : 28,
                        fontWeight: 800,
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                    }}
                >
                    {displayValue}
                </span>
                {unit && (
                    <span style={{ color: 'var(--gold)', fontSize: compact ? 12 : 14, fontWeight: 700 }}>
                        {unit}
                    </span>
                )}
            </div>

            {/* Trend indicator */}
            {trend !== undefined && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '2px 7px',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: 11,
                            fontWeight: 700,
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
                        <span className="interactive-arrow">{trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : '→'}</span>
                        {' '}{Math.abs(trend)}%
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>vs previous</span>
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
