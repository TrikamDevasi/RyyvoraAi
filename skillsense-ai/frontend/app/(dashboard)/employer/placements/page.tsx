'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#D4A843';
const MUTED = '#94a3b8';
const WHITE = '#FFFFFF';

export default function EmployerPlacementsPage() {
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/students')
            .then(res => {
                const data = res.data?.data;
                const students = Array.isArray(data) ? data : [];
                setRecords(students);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <ErrorBoundary>
            <div style={{ color: WHITE, maxWidth: 1100 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                        Candidate <span style={{ color: GOLD }}>Placement Registry</span>
                    </h1>
                    <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                        Verified placement logs and enterprise employment verifications
                    </p>
                </div>

                {loading ? (
                    <Skeleton height={250} width="100%" />
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Candidate</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Program / Specialization</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>NSQF Tier</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Verified Status</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'right', color: '#94a3b8' }}>Skill Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((r, idx) => (
                                    <tr key={r._id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{r.userId?.name || r.name || `Candidate #${idx + 1}`}</td>
                                        <td style={{ padding: '12px 16px', color: MUTED }}>{r.program || 'Engineering'}</td>
                                        <td style={{ padding: '12px 16px' }}>Level {r.nsqfLevel || 4}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                                                {r.placementStatus === 'placed' ? 'Placed & Verified' : 'Direct Opportunity'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: GOLD }}>
                                            {r.overallScore || 80}%
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
