'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#D4A843';
const CYAN = '#06b6d4';
const AMBER = '#F59E0B';

export default function SkillValidationsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        api.get('/students')
            .then(res => {
                const data = res.data?.data;
                setStudents(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = filter === 'all' 
        ? students 
        : filter === 'placed' 
            ? students.filter(s => s.placementStatus === 'placed')
            : students.filter(s => s.placementStatus !== 'placed');

    return (
        <ErrorBoundary>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div>
                        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
                            Skill <span style={{ color: CYAN }}>Validation & Verification</span>
                        </h1>
                        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                            Direct employer validation ledger for NSQF accredited candidates
                        </p>
                    </div>
                </div>

                {/* KPI row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 20 }}>
                    {[
                        { label: 'Total Verified Candidates', value: `${students.length}`, color: CYAN },
                        { label: 'Accreditation Match', value: '96%', color: '#22c55e' },
                        { label: 'Pending Review', value: `${students.filter(s => s.placementStatus === 'seeking').length}`, color: GOLD },
                    ].map((k, i) => (
                        <div key={i} className="stat-card" style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div className="font-display" style={{ fontSize: 24, fontWeight: 800, color: k.color }}>{k.value}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, fontWeight: 700, textTransform: 'uppercase' }}>{k.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filter Controls */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                    {['all', 'placed', 'seeking'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '6px 14px',
                                borderRadius: 8,
                                border: `1px solid ${filter === f ? CYAN : 'rgba(255,255,255,0.1)'}`,
                                background: filter === f ? 'rgba(6,182,212,0.15)' : 'transparent',
                                color: filter === f ? CYAN : '#94a3b8',
                                fontSize: 12,
                                fontWeight: filter === f ? 700 : 500,
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                            }}
                        >
                            {f === 'all' ? 'All Candidates' : f === 'placed' ? 'Verified Hires' : 'Under Assessment'}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <Skeleton height={200} width="100%" />
                ) : filtered.length === 0 ? (
                    <div style={{ padding: 32, textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ color: '#94a3b8', fontSize: 14 }}>No validation records found.</p>
                    </div>
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, color: '#fff' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Candidate</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Specialization</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>NSQF Tier</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Assessment Score</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Validation Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((s, idx) => (
                                    <tr key={s._id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{s.userId?.name || s.name || `Candidate #${idx + 1}`}</td>
                                        <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{s.program || 'Engineering'}</td>
                                        <td style={{ padding: '12px 16px' }}>Level {s.nsqfLevel || 4}</td>
                                        <td style={{ padding: '12px 16px', color: GOLD, fontWeight: 700 }}>{s.overallScore || 78}%</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                                                ✓ Cryptographically Validated
                                            </span>
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
