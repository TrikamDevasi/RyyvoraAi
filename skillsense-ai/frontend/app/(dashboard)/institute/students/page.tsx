'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { FadeIn } from '@/components/shared/FadeIn';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#F59E0B';
const MUTED = '#94a3b8';
const WHITE = '#FFFFFF';

export default function StudentsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'placed' | 'studying' | 'seeking'>('all');
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/students')
            .then(res => {
                const data = res.data?.data;
                setStudents(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = students.filter((s) => {
        const name = s.userId?.name || s.name || '';
        const program = s.program || '';
        const matchSearch = search === '' || name.toLowerCase().includes(search.toLowerCase()) || program.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || s.placementStatus === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <ErrorBoundary>
            <FadeIn>
                <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="font-display text-gradient-gold" style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>
                            Institution Student Roster
                        </h1>
                        <p style={{ color: MUTED, fontSize: 14, marginTop: 4 }}>
                            Manage enrolled student cohorts, NSQF certification tiers, and placement progress
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                    <input
                        type="text"
                        placeholder="Search enrolled students..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ flex: 1, padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13 }}
                    />
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as any)}
                        style={{ padding: '10px 14px', borderRadius: 8, background: '#0d0a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13 }}
                    >
                        <option value="all">All Placement Statuses</option>
                        <option value="seeking">Seeking Employment</option>
                        <option value="placed">Placed</option>
                        <option value="studying">In Training</option>
                    </select>
                </div>

                {loading ? (
                    <Skeleton height={200} width="100%" />
                ) : filtered.length === 0 ? (
                    <div style={{ padding: 32, textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ color: MUTED, fontSize: 14 }}>No students found matching the selected filter.</p>
                    </div>
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, color: '#fff' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Student Name</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Program</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>NSQF Level</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Overall Score</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((s, idx) => (
                                    <tr key={s._id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{s.userId?.name || s.name || `Student #${idx + 1}`}</td>
                                        <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{s.program || 'Technology'}</td>
                                        <td style={{ padding: '12px 16px' }}>Level {s.nsqfLevel || 4}</td>
                                        <td style={{ padding: '12px 16px', color: GOLD, fontWeight: 700 }}>{s.overallScore || 78}%</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: s.placementStatus === 'placed' ? 'rgba(34,197,94,0.15)' : 'rgba(212,168,67,0.15)', color: s.placementStatus === 'placed' ? '#22c55e' : GOLD }}>
                                                {s.placementStatus || 'seeking'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </FadeIn>
        </ErrorBoundary>
    );
}
