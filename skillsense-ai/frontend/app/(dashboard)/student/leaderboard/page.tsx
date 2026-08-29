'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Award, Star, Flame } from 'lucide-react';
import api from '@/lib/api';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';

const GOLD = '#D4A843';
const WHITE = '#FFFFFF';
const MUTED = '#94a3b8';

interface RankedStudent {
    rank: number;
    id: string;
    name: string;
    program: string;
    overallScore: number;
    nsqfLevel: number;
    isCurrentUser?: boolean;
}

export default function LeaderboardPage() {
    const [rankings, setRankings] = useState<RankedStudent[]>([]);
    const [myProfile, setMyProfile] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.allSettled([
            studentApi.getMyProfile(),
            api.get('/students'),
        ]).then(([profileRes, studentsRes]) => {
            const profile = profileRes.status === 'fulfilled' ? profileRes.value : null;
            setMyProfile(profile);

            let list: any[] = [];
            if (studentsRes.status === 'fulfilled' && Array.isArray(studentsRes.value.data?.data)) {
                list = studentsRes.value.data.data;
            }

            if (list.length === 0 && profile) {
                list = [profile];
            }

            // Sort by overallScore descending
            list.sort((a, b) => (b.overallScore || 75) - (a.overallScore || 75));

            const formatted: RankedStudent[] = list.map((s, idx) => ({
                rank: idx + 1,
                id: s._id || s.id,
                name: s.userId?.name || s.name || `Candidate #${idx + 1}`,
                program: s.program || 'Technology & Engineering',
                overallScore: s.overallScore || 78,
                nsqfLevel: s.nsqfLevel || 4,
                isCurrentUser: profile?._id === s._id,
            }));

            setRankings(formatted);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return (
        <ErrorBoundary>
            <div style={{ color: WHITE, maxWidth: 1000 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                        <Trophy size={28} style={{ color: GOLD, marginRight: 10 }} /> National <span style={{ color: GOLD, marginLeft: 6 }}>Skill Leaderboard</span>
                    </h1>
                    <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                        Live candidate rankings computed from verified NSQF assessments & competency ledgers
                    </p>
                </div>

                {loading ? (
                    <Skeleton height={250} width="100%" />
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: GOLD, width: 80 }}>Rank</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Candidate</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Program / Domain</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>NSQF Tier</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'right', color: '#94a3b8' }}>Overall Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankings.map((r) => (
                                    <tr
                                        key={r.id || r.rank}
                                        style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                                            background: r.isCurrentUser ? 'rgba(212,168,67,0.1)' : 'transparent',
                                        }}
                                    >
                                        <td style={{ padding: '12px 16px', fontWeight: 800, color: r.rank === 1 ? '#eab308' : r.rank === 2 ? '#94a3b8' : r.rank === 3 ? '#b45309' : '#fff' }}>
                                            #{r.rank} {r.rank === 1 && '🥇'} {r.rank === 2 && '🥈'} {r.rank === 3 && '🥉'}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                                            {r.name} {r.isCurrentUser && <span style={{ fontSize: 11, color: GOLD, marginLeft: 6 }}>(You)</span>}
                                        </td>
                                        <td style={{ padding: '12px 16px', color: MUTED }}>{r.program}</td>
                                        <td style={{ padding: '12px 16px' }}>Level {r.nsqfLevel}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 800, color: GOLD }}>
                                            {r.overallScore}%
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
