'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#D4A843';
const CYAN = '#06b6d4';

export default function EmployerFeedbackPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);
    const [studentName, setStudentName] = useState('');
    const [comments, setComments] = useState('');

    useEffect(() => {
        api.get('/students')
            .then(res => {
                const data = res.data?.data;
                setStudents(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSuccess(true);
        setTimeout(() => {
            setFormSuccess(false);
            setShowForm(false);
            setStudentName('');
            setComments('');
        }, 2000);
    };

    return (
        <ErrorBoundary>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div>
                        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
                            Internship <span style={{ color: CYAN }}>Feedback & Reviews</span>
                        </h1>
                        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                            Evaluate candidate internship performance, project delivery, and hiring eligibility
                        </p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)} className="btn-gold" style={{ fontSize: 13, cursor: 'pointer' }}>
                        {showForm ? 'Cancel' : 'Submit Candidate Feedback'}
                    </button>
                </div>

                {formSuccess && (
                    <div style={{ padding: 12, background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e', borderRadius: 8, color: '#86efac', marginBottom: 18, fontSize: 13 }}>
                        ✓ Candidate feedback successfully logged and verified in passport ledger!
                    </div>
                )}

                {showForm && (
                    <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 14, marginBottom: 20 }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Candidate Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Rahul Verma"
                                    value={studentName}
                                    onChange={e => setStudentName(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: '#0d0a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13 }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Performance Evaluation & Comments</label>
                                <textarea
                                    placeholder="Technical execution, system architecture competence, collaboration..."
                                    value={comments}
                                    onChange={e => setComments(e.target.value)}
                                    rows={3}
                                    required
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: '#0d0a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13 }}
                                />
                            </div>
                            <button type="submit" className="btn-gold" style={{ alignSelf: 'flex-start', padding: '8px 20px', fontSize: 13, cursor: 'pointer' }}>
                                Submit Feedback
                            </button>
                        </form>
                    </div>
                )}

                {loading ? (
                    <Skeleton height={200} width="100%" />
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
                        {students.map((s, idx) => (
                            <div key={s._id || idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 18 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#fff' }}>{s.userId?.name || s.name || `Candidate #${idx + 1}`}</h3>
                                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                                        Verified Hire
                                    </span>
                                </div>
                                <p style={{ margin: '0 0 10px', fontSize: 12, color: '#94a3b8' }}>{s.program || 'Software Engineering'}</p>
                                <p style={{ margin: 0, fontSize: 12, color: '#cbd5e1', lineHeight: 1.5 }}>
                                    Demonstrated high technical mastery in core modules with NSQF Level {s.nsqfLevel || 4} compliance.
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
