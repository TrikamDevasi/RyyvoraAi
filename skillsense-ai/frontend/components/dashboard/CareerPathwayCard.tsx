import React from 'react';
import type { CareerPathway } from '@/types/charts';
import { Briefcase, TrendingUp, Map as MapIcon, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
    pathway: CareerPathway;
    onSelect?: (id: string) => void;
}

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

function MatchRing({ percent }: { percent: number }) {
    const r = 22;
    const circ = 2 * Math.PI * r;
    const filled = (percent / 100) * circ;
    const color = percent >= 80 ? '#22c55e' : percent >= 60 ? GOLD : '#ef4444';

    return (
        <svg width={56} height={56} viewBox="0 0 56 56">
            <circle cx={28} cy={28} r={r} fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth={3} />
            <circle
                cx={28}
                cy={28}
                r={r}
                fill="transparent"
                stroke={color}
                strokeWidth={3}
                strokeDasharray={`${filled} ${circ - filled}`}
                strokeDashoffset={circ / 4}
                strokeLinecap="round"
            />
            <text x={28} y={33} textAnchor="middle" fill={color} fontSize={12} fontWeight={700}>
                {percent}%
            </text>
        </svg>
    );
}

export default function CareerPathwayCard({ pathway, onSelect }: Props) {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <div
            className="interactive-card card-3d"
            style={{
                background: pathway.isRecommended
                    ? 'linear-gradient(145deg, var(--gold-muted) 0%, var(--bg-surface) 60%)'
                    : 'var(--bg-surface)',
                border: `1px solid ${pathway.isRecommended ? 'var(--gold-border)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '18px 20px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
            }}
            onClick={() => {
                if (onSelect) onSelect(pathway.id);
                else setIsExpanded(!isExpanded);
            }}
        >
            {/* Recommended badge */}
            {pathway.isRecommended && (
                <div
                    style={{
                        position: 'absolute',
                        top: 12,
                        right: 16,
                        background: 'linear-gradient(135deg, var(--gold), #d97706)',
                        color: '#090a0f',
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        boxShadow: '0 2px 6px rgba(245, 158, 11, 0.25)',
                    }}
                >
                    ★ Recommended
                </div>
            )}

            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0 }}>
                    <MatchRing percent={pathway.matchPercent} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 className="font-display" style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {pathway.title}
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>
                        {pathway.role} {pathway.organization && `@ ${pathway.organization}`}
                    </p>

                    {/* Meta info */}
                    <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                        {pathway.growth && (
                            <span style={{ fontSize: 11, color: 'var(--success)', background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '2px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                                <TrendingUp size={12} /> {pathway.growth} Growth
                            </span>
                        )}
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Briefcase size={12} /> {pathway.timeToAchieve}
                        </span>
                    </div>

                    {/* Skills */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                        {pathway.requiredSkills.slice(0, 5).map((skill: string) => (
                            <span
                                key={skill}
                                style={{
                                    background: 'var(--bg-surface-elevated)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-secondary)',
                                    fontSize: 10.5,
                                    padding: '2px 8px',
                                    borderRadius: 4,
                                    fontWeight: 500,
                                }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>

                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                Estimated Salary
                            </p>
                            <p className="font-display" style={{ margin: '2px 0 0', fontSize: 14, color: 'var(--text-primary)', fontWeight: 800 }}>
                                {pathway.salaryLabel || `₹${(pathway.salaryRange.min / 100000).toFixed(1)}L - ${(pathway.salaryRange.max / 100000).toFixed(1)}L/yr`}
                            </p>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--gold)', fontWeight: 700 }}>
                            {isExpanded ? 'Hide Roadmap' : 'View Roadmap'}
                            {isExpanded ? <ChevronUp size={16} className="interactive-arrow" /> : <ChevronDown size={16} className="interactive-arrow" />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Roadmap Expansion */}
            {isExpanded && pathway.roadmap && (
                <div style={{ marginTop: 20, padding: '16px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gold-border)' }} className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <h5 className="font-display" style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapIcon size={14} /> AI-Generated Roadmap
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {pathway.roadmap.map((step: string, i: number) => (
                            <div key={i} style={{ display: 'flex', gap: 12 }}>
                                <div style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: 'var(--gold)', color: '#090a0f', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {i + 1}
                                </div>
                                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
