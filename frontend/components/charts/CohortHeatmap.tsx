'use client';

import React, { useState } from 'react';
import { getScoreTierColor } from '../../lib/chartColors';

interface CohortHeatmapProps {
    data: {
        cohort: string;
        skills: { skill: string; score: number }[];
    }[];
}

export default function CohortHeatmap({ data }: CohortHeatmapProps) {
    const [hoveredCell, setHoveredCell] = useState<{ cohort: string; skill: string; score: number } | null>(null);

    if (!data.length) return null;

    const skills = data[0].skills.map((s) => s.skill);

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            {/* Tooltip */}
            {hoveredCell && (
                <div
                    style={{
                        background: 'var(--bg-surface, #111827)',
                        border: '1px solid var(--border-default, rgba(255,255,255,0.10))',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        boxShadow: 'var(--shadow-md)',
                        marginBottom: 12,
                        display: 'inline-block',
                    }}
                >
                    <p style={{ color: 'var(--brand-gold, #F59E0B)', fontWeight: 700, fontSize: '13px', margin: 0 }}>
                        {hoveredCell.cohort}
                    </p>
                    <div style={{ marginTop: '4px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-secondary, #94A3B8)', fontSize: '12px' }}>{hoveredCell.skill}:</span>
                        <span style={{ color: getScoreTierColor(hoveredCell.score, true), fontWeight: 700, fontSize: '13px', fontVariantNumeric: 'tabular-nums' }}>
                            {hoveredCell.score}%
                        </span>
                    </div>
                </div>
            )}

            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
                <thead>
                    <tr>
                        <th
                            style={{
                                padding: '8px 12px',
                                textAlign: 'left',
                                color: 'var(--text-secondary, #94A3B8)',
                                fontWeight: 600,
                                borderBottom: '1px solid var(--border-default, rgba(255,255,255,0.10))',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Cohort
                        </th>
                        {skills.map((skill) => (
                            <th
                                key={skill}
                                style={{
                                    padding: '8px 10px',
                                    textAlign: 'center',
                                    color: 'var(--text-secondary, #94A3B8)',
                                    fontWeight: 600,
                                    borderBottom: '1px solid var(--border-default, rgba(255,255,255,0.10))',
                                    whiteSpace: 'nowrap',
                                    maxWidth: 90,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                                title={skill}
                            >
                                {skill.length > 12 ? skill.slice(0, 10) + '…' : skill}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.cohort}>
                            <td
                                style={{
                                    padding: '7px 12px',
                                    color: 'var(--text-primary, #F8FAFC)',
                                    fontWeight: 500,
                                    borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.06))',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {row.cohort}
                            </td>
                            {row.skills.map((cell) => {
                                const tierColor = getScoreTierColor(cell.score, true);
                                return (
                                    <td
                                        key={cell.skill}
                                        style={{
                                            padding: '7px 10px',
                                            textAlign: 'center',
                                            background: `${tierColor}22`,
                                            color: tierColor,
                                            fontWeight: 700,
                                            borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.06))',
                                            borderRadius: 4,
                                            cursor: 'pointer',
                                            transition: 'background 0.15s ease',
                                            fontVariantNumeric: 'tabular-nums',
                                        }}
                                        onMouseEnter={() => setHoveredCell({ cohort: row.cohort, skill: cell.skill, score: cell.score })}
                                        onMouseLeave={() => setHoveredCell(null)}
                                    >
                                        {cell.score}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Strict 5-Tier Legend */}
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
                                borderRadius: 2,
                                background: item.color,
                            }}
                        />
                        <span style={{ color: 'var(--text-secondary, #94A3B8)', fontSize: 11 }}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
