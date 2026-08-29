'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { FadeIn } from '@/components/shared/FadeIn';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Users, Search } from 'lucide-react';

const GOLD = '#F59E0B';
const MUTED = '#94A3B8';
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
                        <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center' }}>
                            <Users size={26} style={{ color: GOLD, marginRight: 10 }} /> Institutional <span style={{ color: GOLD, marginLeft: 6 }}>Student Roster</span>
                        </h1>
                        <p style={{ color: MUTED, fontSize: 14, marginTop: 4 }}>
                            Manage enrolled student cohorts, NSQF certification tiers, and placement progress
                        </p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 20 }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED }} />
                        <input
                            type="text"
                            placeholder="Search enrolled candidates by name or program..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="input-base"
                            style={{ paddingLeft: 36 }}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as any)}
                        className="input-base"
                        style={{ width: 180 }}
                    >
                        <option value="all">All Statuses</option>
                        <option value="seeking">Seeking Employment</option>
                        <option value="placed">Placed</option>
                        <option value="studying">In Training</option>
                    </select>
                </div>

                {loading ? (
                    <Skeleton height={200} width="100%" />
                ) : filtered.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>No student records matching your filter criteria.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Candidate Name</th>
                                    <th>Program / Domain</th>
                                    <th>NSQF Level</th>
                                    <th>Score</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((s, idx) => (
                                    <tr key={s._id || idx}>
                                        <td style={{ fontWeight: 600 }}>{s.userId?.name || s.name || `Candidate #${idx + 1}`}</td>
                                        <td style={{ color: MUTED }}>{s.program || 'Technology & Engineering'}</td>
                                        <td>Level {s.nsqfLevel || 4} Certified</td>
                                        <td style={{ color: GOLD, fontWeight: 700 }}>{s.overallScore || 78}%</td>
                                        <td>
                                            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: s.placementStatus === 'placed' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)', color: s.placementStatus === 'placed' ? '#22c55e' : GOLD }}>
                                                {s.placementStatus === 'placed' ? 'Placed & Verified' : 'Seeking Direct Hire'}
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
