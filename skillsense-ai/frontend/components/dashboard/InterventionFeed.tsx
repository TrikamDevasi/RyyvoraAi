'use client';

import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import type { Intervention } from '../../types/charts';
import { useDashboardStore } from '../../store/dashboardStore';

interface Props {
    items?: Intervention[];
    maxVisible?: number;
}

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const SEVERITY_CONFIG = {
    high: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', icon: '!', border: 'rgba(239,68,68,0.3)' },
    medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: '~', border: 'rgba(245,158,11,0.3)' },
    low: { color: MUTED, bg: 'rgba(255,255,255,0.04)', icon: '-', border: 'rgba(255,255,255,0.12)' },
    success: { color: '#22c55e', bg: 'rgba(34,197,94,0.08)', icon: '+', border: 'rgba(34,197,94,0.3)' },
};

const TYPE_ICONS: Record<Intervention['type'], string> = {
    'skill-gap': 'GAP',
    'placement-alert': 'JOB',
    'dropout-risk': 'RISK',
    achievement: 'WIN',
};

const SAMPLE_INTERVENTIONS: Intervention[] = [
    {
        id: 'iv1',
        studentName: 'Amit Jha',
        type: 'dropout-risk',
        message: 'Attendance dropped to 62% — 3 consecutive absences this week.',
        severity: 'high',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        actionRequired: true,
    },
    {
        id: 'iv2',
        studentName: 'Sunita Yadav',
        type: 'skill-gap',
        message: 'Skill gap in TypeScript (68) vs industry benchmark (80).',
        severity: 'medium',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        actionRequired: true,
    },
    {
        id: 'iv3',
        studentName: 'Anjali Verma',
        type: 'placement-alert',
        message: 'New opening at Flipkart matches 92% of her profile.',
        severity: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        actionRequired: false,
    },
    {
        id: 'iv4',
        studentName: 'Priya Sharma',
        type: 'achievement',
        message: 'Completed React.js Advanced certification — score 91.',
        severity: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        actionRequired: false,
    },
    {
        id: 'iv5',
        type: 'skill-gap',
        message: 'Department-wide gap in Cloud Computing — 67% of DevOps batch below threshold.',
        severity: 'high',
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        actionRequired: true,
    },
];

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export default function InterventionFeed({ items, maxVisible = 6 }: Props) {
    const { dismissIntervention } = useDashboardStore();
    const displayItems = (items ?? SAMPLE_INTERVENTIONS).slice(0, maxVisible);

    return (
        <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {displayItems.map((item) => {
                const cfg = SEVERITY_CONFIG[item.severity];
                return (
                    <div
                        key={item.id}
                        className="data-row-hover"
                        style={{
                            background: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                            borderRadius: 10,
                            padding: '12px 14px',
                            display: 'flex',
                            gap: 12,
                            alignItems: 'flex-start',
                        }}
                    >
                        {/* Icon */}
                        <span style={{ fontSize: 10, fontWeight: 800, flexShrink: 0, width: 28, height: 28, borderRadius: 6, background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cfg.color }}>{TYPE_ICONS[item.type]}</span>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                <p style={{ margin: 0, fontSize: 13, color: WHITE, lineHeight: 1.4 }}>
                                    {item.studentName && (
                                        <span style={{ color: GOLD, fontWeight: 600 }}>{item.studentName} — </span>
                                    )}
                                    {item.message}
                                </p>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dismissIntervention(item.id);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: MUTED,
                                        cursor: 'pointer',
                                        padding: '0 0 0 8px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                    title="Dismiss"
                                    aria-label="Dismiss intervention"
                                >
                                    <X size={14} aria-hidden="true" />
                                </button>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    marginTop: 6,
                                }}
                            >
                                <span style={{ fontSize: 10, color: cfg.color, textTransform: 'uppercase', fontWeight: 600 }}>
                                    {item.type.replace('-', ' ')}
                                </span>
                                <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
                                <span style={{ fontSize: 11, color: MUTED }}>{timeAgo(item.timestamp)}</span>
                                {item.actionRequired && (
                                    <>
                                        <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
                                        <span style={{ fontSize: 11, color: '#f59e0b' }}>Action required</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {displayItems.length === 0 && (
                <div
                    style={{
                        padding: '32px 20px',
                        textAlign: 'center',
                        color: MUTED,
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                    }}
                >
                    <CheckCircle2 size={15} style={{ color: '#10b981' }} aria-hidden="true" />
                    <span>No active interventions</span>
                </div>
            )}
        </div>
    );
}
