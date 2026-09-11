'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileCheck, Play, CheckCircle2 } from 'lucide-react';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';

const GOLD = '#D4A843';
const WHITE = '#FFFFFF';
const MUTED = '#94a3b8';

export default function AssessmentsPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        studentApi.getMyProfile()
            .then(data => {
                setProfile(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const skills = profile?.skills || [];
    const overallScore = profile?.overallScore !== undefined && profile.overallScore !== null ? profile.overallScore : null;

    return (
        <ErrorBoundary>
            <div style={{ color: WHITE, maxWidth: 1000 }}>
                {/* ── Unified Assessment Hub Sub-nav ── */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    <button
                        type="button"
                        onClick={() => router.push('/student/assessment')}
                        className="btn-secondary"
                        style={{ fontSize: 12.5, padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                    >
                        <span>← Launch Diagnostic Quiz Runner</span>
                    </button>
                    <span style={{ fontSize: 12, padding: '7px 14px', borderRadius: 8, background: 'rgba(245,158,11,0.12)', color: 'var(--gold)', border: '1px solid var(--gold-border)', fontWeight: 700 }}>
                        Verified Competency Ledgers
                    </span>
                </div>

                <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                            <FileCheck size={28} style={{ color: GOLD, marginRight: 10 }} /> Verified <span style={{ color: GOLD, marginLeft: 6 }}>Skill Assessments</span>
                        </h1>
                        <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                            National NSQF assessments calibrated to candidate competency ledgers
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/student/assessment')}
                        className="btn-gold"
                        style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                    >
                        <Play size={14} /> Start AI Diagnostic Quiz
                    </button>
                </div>

                {loading ? (
                    <Skeleton height={200} width="100%" />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Stats Overview */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                            {[
                                { label: 'Assessed Competencies', value: `${skills.length}`, color: '#22c55e' },
                                { label: 'Composite Skill Score', value: overallScore !== null ? `${overallScore}%` : 'Unassessed', color: GOLD },
                                { label: 'Certified Tier', value: `Level ${profile?.nsqfLevel || 4}`, color: '#a78bfa' },
                            ].map((stat, i) => (
                                <div key={i} style={{ padding: 18, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                                    <div style={{ fontSize: 11, color: MUTED, marginTop: 4, textTransform: 'uppercase', fontWeight: 700 }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Evaluated Skills Ledger */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: '#fff' }}>
                                Verified Assessment Ledgers
                            </h3>
                            {skills.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 24, color: MUTED }}>
                                    No assessments recorded yet. Click "Start AI Diagnostic Quiz" above to take your first test.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {skills.map((s, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>
                                                    {typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : `Technical Module ${idx + 1}`}
                                                </div>
                                                <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                                                    Last verified: {new Date(s.lastAssessed || Date.now()).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span style={{ fontSize: 13, fontWeight: 800, color: GOLD, background: 'rgba(212,168,67,0.15)', padding: '4px 10px', borderRadius: 99 }}>
                                                    {s.score}%
                                                </span>
                                                <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                    <CheckCircle2 size={13} />
                                                    <span>NSQF Certified</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
