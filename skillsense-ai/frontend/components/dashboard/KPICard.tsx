'use client';

import React from 'react';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import type { KPIData } from '../../types/charts';

interface KPICardProps extends KPIData {
    compact?: boolean;
}

const GOLD = '#F59E0B';
const MUTED = '#94A3B8';
const WHITE = '#FFFFFF';

const TREND_COLORS = {
    up: '#22c55e',
    down: '#ef4444',
    neutral: MUTED,
};

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
            style={{
                background: 'linear-gradient(135deg, rgba(212,168,67,0.08) 0%, rgba(20,15,5,0.95) 100%)',
                border: '1px solid rgba(212,168,67,0.2)',
                borderRadius: compact ? 10 : 14,
                padding: compact ? '14px 18px' : '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.25s, transform 0.2s',
                cursor: 'default',
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,168,67,0.5)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,168,67,0.2)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
        >
            {/* Background glow */}
            <div
                style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(212,168,67,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p
                    style={{
                        color: MUTED,
                        fontSize: compact ? 11 : 12,
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        margin: 0,
                    }}
                >
                    {label}
                </p>
                {icon && (
                    <span style={{ fontSize: compact ? 16 : 20, opacity: 0.7 }}>{icon}</span>
                )}
            </div>

            {/* Value */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span
                    style={{
                        background: 'linear-gradient(135deg, #FFF 0%, #FBBF24 50%, #F59E0B 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontSize: compact ? 22 : 30,
                        fontWeight: 800,
                        lineHeight: 1,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                    }}
                >
                    {displayValue}
                </span>
                {unit && (
                    <span style={{ color: '#FBBF24', fontSize: compact ? 12 : 15, fontWeight: 600 }}>
                        {unit}
                    </span>
                )}
            </div>

            {/* Trend */}
            {trend !== undefined && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span
                        style={{
                            color: TREND_COLORS[trendDirection],
                            fontSize: 12,
                            fontWeight: 600,
                        }}
                    >
                        {trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : '→'}
                        {' '}{Math.abs(trend)}%
                    </span>
                    <span style={{ color: MUTED, fontSize: 11 }}>vs last period</span>
                </div>
            )}

            {/* Gold bottom bar */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: 2,
                    width: '40%',
                    background: `linear-gradient(90deg, ${GOLD}, transparent)`,
                }}
            />
        </div>
    );
}
