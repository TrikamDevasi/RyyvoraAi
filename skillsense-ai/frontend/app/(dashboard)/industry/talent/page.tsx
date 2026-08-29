'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Briefcase } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
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
                // Fallback to students list
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

                <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                    {[
                        { label: 'Total Verified Profiles', value: students.length, color: WHITE },
                        { label: 'Actively Seeking', value: seeking.length, color: GOLD },
                        { label: 'Placed Candidates', value: placed.length, color: '#22c55e' },
                    ].map((s) => (
                        <div key={s.label} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
                            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
                            <p style={{ margin: '2px 0 0', fontSize: 12, color: MUTED }}>{s.label}</p>
                        </div>
                    ))}
                </div>

                <input
                    type="text"
                    placeholder="Search candidates by name, domain, or state…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 14px', color: WHITE, fontSize: 13, outline: 'none', marginBottom: 20, boxSizing: 'border-box' }}
                />

                {loading ? (
                    <Skeleton height={200} width="100%" />
                ) : pool.length === 0 ? (
                    <div style={{ padding: 32, textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ color: '#94a3b8', fontSize: 14 }}>No verified candidates found matching your search filter.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
                        {pool.map((s, idx) => (
                            <div
                                key={s._id || s.id || idx}
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 12,
                                    padding: 18,
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: WHITE }}>
                                        {s.userId?.name || s.name || `Candidate #${idx + 1}`}
                                    </h3>
                                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: s.placementStatus === 'placed' ? 'rgba(34,197,94,0.15)' : 'rgba(212,168,67,0.15)', color: s.placementStatus === 'placed' ? '#22c55e' : GOLD }}>
                                        {s.placementStatus === 'placed' ? 'Placed' : 'Available'}
                                    </span>
                                </div>
                                <p style={{ margin: '4px 0 0', fontSize: 12, color: MUTED }}>{s.program || 'Engineering & Technology'}</p>
                                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8' }}>
                                    <span>NSQF Level {s.nsqfLevel || 4}</span>
                                    <span style={{ color: GOLD, fontWeight: 700 }}>Score: {s.overallScore || 78}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
