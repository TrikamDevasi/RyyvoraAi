'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#D4A843';
const MUTED = '#94a3b8';
const WHITE = '#FFFFFF';

export default function InstructorEvaluationsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [gradingId, setGradingId] = useState<string | null>(null);
    const [gradeScore, setGradeScore] = useState('85');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        api.get('/students')
            .then(res => {
                const data = res.data?.data;
                setStudents(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleGradeSubmit = async (e: React.FormEvent, studentId: string) => {
        e.preventDefault();
        try {
            await api.put(`/students/${studentId}`, {
                overallScore: parseInt(gradeScore) || 85,
            });
            setSuccessMsg('✓ Student assessment successfully evaluated and committed to ledger!');
            setGradingId(null);
            // Refresh list
            api.get('/students').then(res => setStudents(res.data?.data || []));
            setTimeout(() => setSuccessMsg(''), 3500);
        } catch {
            setSuccessMsg('Failed to update student score.');
        }
    };

    return (
        <ErrorBoundary>
            <div style={{ color: WHITE, maxWidth: 1100 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                        Instructor <span style={{ color: GOLD }}>Evaluations & Grading</span>
                    </h1>
                    <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                        Assess candidate practical submissions, certify competencies, and commit scores to the ledger
                    </p>
                </div>

                {successMsg && (
                    <div style={{ padding: 12, background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e', borderRadius: 8, color: '#86efac', marginBottom: 18, fontSize: 13 }}>
                        {successMsg}
                    </div>
                )}

                {loading ? (
                    <Skeleton height={250} width="100%" />
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Candidate</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Program</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>NSQF Tier</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Current Score</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'right', color: '#94a3b8' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s, idx) => (
                                    <tr key={s._id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{s.userId?.name || s.name || `Candidate #${idx + 1}`}</td>
                                        <td style={{ padding: '12px 16px', color: MUTED }}>{s.program || 'Engineering'}</td>
                                        <td style={{ padding: '12px 16px' }}>Level {s.nsqfLevel || 4}</td>
                                        <td style={{ padding: '12px 16px', color: GOLD, fontWeight: 700 }}>{s.overallScore || 75}%</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                            {gradingId === s._id ? (
                                                <form onSubmit={(e) => handleGradeSubmit(e, s._id)} style={{ display: 'inline-flex', gap: 6 }}>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={gradeScore}
                                                        onChange={(e) => setGradeScore(e.target.value)}
                                                        style={{ width: 60, padding: '4px 8px', borderRadius: 4, background: '#0a0a14', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 12 }}
                                                    />
                                                    <button type="submit" className="btn-gold" style={{ padding: '4px 10px', fontSize: 12 }}>Save</button>
                                                    <button type="button" onClick={() => setGradingId(null)} style={{ padding: '4px 8px', borderRadius: 4, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#94a3b8', fontSize: 12 }}>Cancel</button>
                                                </form>
                                            ) : (
                                                <button onClick={() => { setGradingId(s._id); setGradeScore(String(s.overallScore || 85)); }} style={{ padding: '6px 14px', borderRadius: 6, background: 'rgba(212,168,67,0.15)', border: `1px solid ${GOLD}`, color: GOLD, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                                    Grade Candidate
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
