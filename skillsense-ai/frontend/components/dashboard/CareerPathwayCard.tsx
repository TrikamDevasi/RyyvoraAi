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
            style={{
                background: pathway.isRecommended
                    ? 'linear-gradient(145deg, rgba(212,168,67,0.12), rgba(10,8,2,0.97))'
                    : 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(10,8,2,0.97))',
                border: `1px solid ${pathway.isRecommended ? 'rgba(212,168,67,0.4)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 14,
                padding: '18px 20px',
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.2s',
                position: 'relative',
                overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,168,67,0.6)';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = pathway.isRecommended
                    ? 'rgba(212,168,67,0.4)'
                    : 'rgba(255,255,255,0.1)';
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
                        background: GOLD,
                        color: '#1a0f00',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 20,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
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
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: WHITE }}>
                        {pathway.title}
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: 13, color: GOLD }}>
                        {pathway.role} {pathway.organization && `@ ${pathway.organization}`}
                    </p>

                    {/* Meta info */}
                    <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                        {pathway.growth && (
                            <span style={{ fontSize: 11, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <TrendingUp size={12} /> {pathway.growth} Growth
                            </span>
                        )}
                        <span style={{ fontSize: 11, color: MUTED, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Briefcase size={12} /> {pathway.timeToAchieve}
                        </span>
                    </div>

                    {/* Skills */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                        {pathway.requiredSkills.slice(0, 5).map((skill: string) => (
                            <span
                                key={skill}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#cbd5e1',
                                    fontSize: 10,
                                    padding: '2px 8px',
                                    borderRadius: 4,
                                }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>

                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 10, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Estimated Salary
                            </p>
                            <p style={{ margin: '2px 0 0', fontSize: 14, color: WHITE, fontWeight: 700 }}>
                                {pathway.salaryLabel || `₹${(pathway.salaryRange.min / 100000).toFixed(1)}L - ${(pathway.salaryRange.max / 100000).toFixed(1)}L/yr`}
                            </p>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: GOLD, fontWeight: 600 }}>
                            {isExpanded ? 'Hide Roadmap' : 'View Roadmap'}
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Roadmap Expansion */}
            {isExpanded && pathway.roadmap && (
                <div style={{ marginTop: 20, padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: 10, border: '1px solid rgba(212,168,67,0.2)' }} className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <h5 style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: GOLD, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapIcon size={14} /> AI-Generated Roadmap
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {pathway.roadmap.map((step: string, i: number) => (
                            <div key={i} style={{ display: 'flex', gap: 12 }}>
                                <div style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: GOLD, color: '#000', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {i + 1}
                                </div>
                                <p style={{ margin: 0, fontSize: 12, color: '#cbd5e1', lineHeight: 1.5 }}>{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
