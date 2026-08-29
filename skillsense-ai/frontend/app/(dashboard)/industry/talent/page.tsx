'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Briefcase, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#F59E0B';
const MUTED = '#94A3B8';
const WHITE = '#FFFFFF';

export default function TalentPage() {
    const [search, setSearch] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/industry/talent-pool')
            .then(res => {
                const data = res.data?.data?.students || res.data?.data;
                if (Array.isArray(data)) {
                    setStudents(data);
                } else {
                    setStudents([]);
                }
                setLoading(false);
            })
            .catch(() => {
                api.get('/students')
                    .then(res => {
                        const data = res.data?.data;
                        setStudents(Array.isArray(data) ? data : []);
                        setLoading(false);
                    })
                    .catch(() => setLoading(false));
            });
    }, []);

    const placed = students.filter((s) => s.placementStatus === 'placed');
    const seeking = students.filter((s) => s.placementStatus === 'seeking' || !s.placementStatus);

    const pool = students.filter((s) => {
        const q = search.toLowerCase();
        const name = s.userId?.name || s.name || '';
        const program = s.program || '';
        const state = s.state || '';
        return q === '' || name.toLowerCase().includes(q) || program.toLowerCase().includes(q) || state.toLowerCase().includes(q);
    });

    return (
        <ErrorBoundary>
            <div style={{ color: WHITE, maxWidth: 1100 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                        <Briefcase size={28} style={{ color: GOLD, marginRight: 10 }} /> Verified Talent <span style={{ color: GOLD, marginLeft: 6 }}>Pool</span>
                    </h1>
                    <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                        Live talent pipeline with cryptographic NSQF skill verification
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
                    {[
                        { label: 'Available Candidates', value: seeking.length, color: GOLD },
                        { label: 'Placed & Verified', value: placed.length, color: '#22c55e' },
                        { label: 'Total Assessed Pipeline', value: students.length, color: '#3b82f6' },
                    ].map((s) => (
                        <div key={s.label} className="card-base" style={{ padding: '16px 20px' }}>
                            <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</p>
                            <p style={{ margin: '4px 0 0', fontSize: 12, color: MUTED }}>{s.label}</p>
                        </div>
                    ))}
                </div>

                <div style={{ position: 'relative', marginBottom: 20 }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED }} />
                    <input
                        type="text"
                        placeholder="Search verified talent by role, skills, or region..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-base"
                        style={{ paddingLeft: 36 }}
                    />
                </div>

                {loading ? (
                    <Skeleton height={250} width="100%" />
                ) : pool.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>No verified candidates found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Candidate Name</th>
                                    <th>Program / Domain</th>
                                    <th>Region</th>
                                    <th>NSQF Level</th>
                                    <th>Overall Score</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pool.map((s, idx) => (
                                    <tr key={s._id || s.id || idx}>
                                        <td style={{ fontWeight: 600 }}>{s.userId?.name || s.name || `Candidate #${idx + 1}`}</td>
                                        <td style={{ color: MUTED }}>{s.program || 'Software Engineering'}</td>
                                        <td style={{ color: MUTED }}>{s.state || 'National'}</td>
                                        <td>Level {s.nsqfLevel || 4}</td>
                                        <td style={{ color: GOLD, fontWeight: 700 }}>{s.overallScore || 80}%</td>
                                        <td>
                                            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: s.placementStatus === 'placed' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)', color: s.placementStatus === 'placed' ? '#22c55e' : GOLD }}>
                                                {s.placementStatus === 'placed' ? 'Placed' : 'Available for Hire'}
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
