'use client';

import React, { useState } from 'react';
import type { RegionData } from '../../types/charts';
import { getScoreTierColor } from '../../lib/chartColors';

interface RegionHeatmapProps {
    data: RegionData[];
}

const STATE_POSITIONS: Record<string, { x: number; y: number }> = {
    'Jammu & Kashmir': { x: 28, y: 6 },
    'Himachal Pradesh': { x: 34, y: 12 },
    'Punjab': { x: 28, y: 16 },
    'Uttarakhand': { x: 42, y: 16 },
    'Haryana': { x: 33, y: 20 },
    'Delhi': { x: 36, y: 22 },
    'Rajasthan': { x: 25, y: 30 },
    'Uttar Pradesh': { x: 46, y: 28 },
    'Bihar': { x: 58, y: 30 },
    'West Bengal': { x: 66, y: 36 },
    'Sikkim': { x: 70, y: 24 },
    'Assam': { x: 78, y: 28 },
    'Meghalaya': { x: 76, y: 32 },
    'Manipur': { x: 82, y: 36 },
    'Tripura': { x: 76, y: 36 },
    'Mizoram': { x: 79, y: 40 },
    'Nagaland': { x: 84, y: 30 },
    'Arunachal Pradesh': { x: 85, y: 22 },
    'Jharkhand': { x: 60, y: 36 },
    'Odisha': { x: 60, y: 44 },
    'Chhattisgarh': { x: 52, y: 40 },
    'Madhya Pradesh': { x: 40, y: 38 },
    'Gujarat': { x: 18, y: 38 },
    'Maharashtra': { x: 30, y: 48 },
    'Telangana': { x: 42, y: 54 },
    'Andhra Pradesh': { x: 46, y: 60 },
    'Karnataka': { x: 34, y: 62 },
    'Kerala': { x: 30, y: 74 },
    'Tamil Nadu': { x: 38, y: 72 },
    'Goa': { x: 24, y: 60 },
};

export default function RegionHeatmap({ data }: RegionHeatmapProps) {
    const [tooltip, setTooltip] = useState<RegionData | null>(null);

    return (
        <div style={{ width: '100%' }}>
            {/* State dot map */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '90%',
                    background: 'var(--bg-surface-elevated, #1A2234)',
                    borderRadius: 10,
                    border: '1px solid var(--border-default, rgba(255,255,255,0.10))',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <svg viewBox="0 0 100 95" style={{ width: '100%', height: '100%' }}>
                        {/* India rough outline lines */}
                        <path
                            d="M30,10 Q45,5 65,10 Q85,20 88,35 Q82,55 70,70 Q55,85 40,80 Q25,78 20,65 Q12,50 18,35 Q22,20 30,10Z"
                            fill="none"
                            stroke="var(--border-subtle, rgba(255,255,255,0.06))"
                            strokeWidth="0.6"
                        />

                        {/* State dots */}
                        {data.map((region) => {
                            const pos = STATE_POSITIONS[region.state];
                            if (!pos) return null;
                            const tierColor = getScoreTierColor(region.skillScore, true);
                            return (
                                <g key={region.state}>
                                    <circle
                                        cx={pos.x}
                                        cy={pos.y}
                                        r={3.2}
                                        fill={tierColor}
                                        stroke="rgba(0,0,0,0.5)"
                                        strokeWidth={0.5}
                                        style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                                        onMouseEnter={() => setTooltip(region)}
                                        onMouseLeave={() => setTooltip(null)}
                                    />
                                    <text
                                        x={pos.x}
                                        y={pos.y + 5.2}
                                        textAnchor="middle"
                                        fill="var(--text-muted, #94A3B8)"
                                        fontSize="2.1"
                                        pointerEvents="none"
                                        style={{ fontFamily: 'inherit', fontWeight: 500 }}
                                    >
                                        {region.state.split(' ')[0].slice(0, 6)}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>

                    {/* Floating tooltip on hover */}
                    {tooltip && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 16,
                                left: 16,
                                background: 'var(--bg-surface, #111827)',
                                border: '1px solid var(--border-default, rgba(255,255,255,0.10))',
                                borderRadius: '8px',
                                padding: '12px 14px',
                                boxShadow: 'var(--shadow-md)',
                                minWidth: 200,
                                zIndex: 10,
                                pointerEvents: 'none',
                            }}
                        >
                            <p style={{ color: 'var(--brand-gold, #F59E0B)', fontWeight: 700, fontSize: '13.5px', marginBottom: '8px' }}>
                                {tooltip.state}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <p style={{ color: 'var(--text-primary, #F8FAFC)', fontSize: '12.5px', margin: 0 }}>
                                    Skill Score: <span style={{ color: getScoreTierColor(tooltip.skillScore, true), fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{tooltip.skillScore}%</span>
                                </p>
                                <p style={{ color: 'var(--text-primary, #F8FAFC)', fontSize: '12.5px', margin: 0 }}>
                                    Placement Rate: <span style={{ color: 'var(--text-primary, #F8FAFC)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{tooltip.placementRate}%</span>
                                </p>
                                <p style={{ color: 'var(--text-primary, #F8FAFC)', fontSize: '12.5px', margin: 0 }}>
                                    Candidates: <span style={{ color: 'var(--text-primary, #F8FAFC)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{tooltip.studentCount.toLocaleString('en-IN')}</span>
                                </p>
                                {tooltip.criticalGaps.length > 0 && (
                                    <p style={{ 
                                        color: 'var(--error, #EF4444)', 
                                        fontSize: '11.5px', 
                                        marginTop: '6px',
                                        paddingTop: '6px',
                                        borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.06))',
                                        fontWeight: 600 
                                    }}>
                                        Deficit: {tooltip.criticalGaps.join(', ')}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Strict 5-Tier Color Legend */}
            <div style={{ display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                {[
                    { label: '≥85% Surplus', color: '#10B981' },
                    { label: '75–84% Strong', color: '#06B6D4' },
                    { label: '65–74% Equilibrium', color: '#F59E0B' },
                    { label: '50–64% Deficit', color: '#F97316' },
                    { label: '<50% Critical', color: '#EF4444' },
                ].map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: item.color,
                            }}
                        />
                        <span style={{ color: 'var(--text-secondary, #94A3B8)', fontSize: 11, fontWeight: 500 }}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
