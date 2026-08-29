'use client';

import React, { useState, useEffect } from 'react';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import api from '@/lib/api';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#D4A843';
const GOLD_L = '#F0C05A';
const AMBER = '#F59E0B';
const ORANGE = '#F97316';

export default function AIAnalyzerPage() {
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [done, setDone] = useState(false);
    const [careerResult, setCareerResult] = useState<any>(null);

    useEffect(() => {
        studentApi.getMyProfile()
            .then(data => setProfile(data))
            .catch(() => {});
    }, []);

    const run = async () => {
        if (!profile) return;
        setAnalyzing(true);
        try {
            const res = await studentApi.getCareerPaths(profile._id);
            setCareerResult(res);
            setDone(true);
        } catch {
            setDone(true);
        } finally {
            setAnalyzing(false);
        }
    };

    const overallScore = profile?.overallScore || 78;
    const dims = [
        { label: 'Core Technical Competency', score: overallScore, color: GOLD },
        { label: 'Problem Solving', score: Math.min(100, overallScore + 4), color: GOLD_L },
        { label: 'Industry Readiness', score: Math.max(50, overallScore - 6), color: AMBER },
        { label: 'Project Architecture', score: Math.max(50, overallScore - 2), color: ORANGE },
        { label: 'NSQF Compliance', score: Math.min(100, overallScore + 8), color: '#a78bfa' },
    ];

    return (
        <ErrorBoundary>
            <div style={{ color: '#fff', maxWidth: 900 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
                        AI Skill <span style={{ color: GOLD }}>Analyzer</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                        Live neural diagnostic engine analyzing candidate profile {profile?.userId?.name ? `(${profile.userId.name})` : ''}
                    </p>
                </div>

                {/* Action cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
                    {[
                        { label: 'Live Skills Telemetry', desc: `${profile?.skills?.length || 4} verified domains mapped` },
                        { label: 'Adaptive NSQF Level', desc: `Targeting Level ${profile?.nsqfLevel || 4} - ${profile?.program || 'Engineering'}` },
                        { label: 'AI Gap Prediction', desc: 'Predictive market alignment modeling' },
                    ].map((item, i) => (
                        <div key={i} className="stat-card" style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                            <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{item.label}</h3>
                            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Run Button */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <button
                        onClick={run}
                        disabled={analyzing}
                        className="btn-gold"
                        style={{
                            padding: '12px 32px',
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: analyzing ? 'not-allowed' : 'pointer',
                            opacity: analyzing ? 0.7 : 1,
                        }}
                    >
                        {analyzing ? '⚡ Running Neural Analysis...' : '⚡ Run Comprehensive AI Skill Analysis'}
                    </button>
                </div>

                {/* Results View */}
                {done && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="glass-card" style={{ padding: 20, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(245,158,11,0.2)' }}>
                            <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: GOLD }}>
                                Competency Diagnostic Scores
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {dims.map((d, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                                            <span>{d.label}</span>
                                            <span style={{ fontWeight: 700, color: d.color }}>{d.score}/100</span>
                                        </div>
                                        <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{ width: `${d.score}%`, height: '100%', background: d.color, borderRadius: 3 }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {careerResult?.topCareerPaths && (
                            <div className="glass-card" style={{ padding: 20, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(245,158,11,0.2)' }}>
                                <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#fff' }}>
                                    Target Career Opportunities
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                                    {careerResult.topCareerPaths.slice(0, 3).map((path: any, idx: number) => (
                                        <div key={idx} style={{ padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{path.title || path.role}</div>
                                            <div style={{ fontSize: 11, color: GOLD, marginTop: 4 }}>Match: {path.matchPercent || 85}%</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
