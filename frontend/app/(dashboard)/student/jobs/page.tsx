'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Search } from 'lucide-react';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#D4A843';
const WHITE = '#FFFFFF';
const MUTED = '#94a3b8';

interface DemandSignal {
    _id?: string;
    name: string;
    domain?: string;
    nsqfLevel?: number;
    industryDemandScore: number;
    marketInsight?: string | null;
}

interface SkillMatch {
    signal: DemandSignal;
    matches: string[];
    count: number;
}

export default function FindJobsPage() {
    const [search, setSearch] = useState('');
    const [matches, setMatches] = useState<SkillMatch[]>([]);
    const [mySkillCount, setMySkillCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const profile: StudentProfile | null = await studentApi.getMyProfile();
                const mySkills = (profile?.skills || [])
                    .map((s: any) => (typeof s.skillId === 'object' && s.skillId?.name) ? s.skillId.name : s.skill || s.skillId)
                    .filter(Boolean)
                    .map((s: string) => s.toLowerCase());

                const res = await api.get('/industry/demand-signals');
                const demands = res.data?.data;
                if (cancelled) return;

                if (!Array.isArray(demands) || demands.length === 0) {
                    setError('No demand signals are currently available.');
                    setLoading(false);
                    return;
                }

                const computed: SkillMatch[] = demands
                    .filter((d: any) => d && d.name && typeof d.industryDemandScore === 'number')
                    .map((d: any): SkillMatch => {
                        const name = String(d.name).toLowerCase();
                        const related = [...(mySkills)].filter((s) => s.includes(name) || name.includes(s));
                        return { signal: { name: d.name, domain: d.domain, nsqfLevel: d.nsqfLevel, industryDemandScore: d.industryDemandScore, marketInsight: d.marketInsight ?? null }, matches: related, count: related.length };
                    })
                    .sort((a, b) => b.signal.industryDemandScore - a.signal.industryDemandScore);

                setMatches(computed);
                setMySkillCount(mySkills.length);
            } catch {
                if (!cancelled) setError('Market signals are currently unavailable. Please try again.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const filtered = matches.filter((m) => {
        const q = search.toLowerCase();
        return q === '' || m.signal.name.toLowerCase().includes(q) || (m.signal.domain || '').toLowerCase().includes(q);
    });

    return (
        <ErrorBoundary>
            <div style={{ color: WHITE, maxWidth: 1100 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                        <TrendingUp size={28} style={{ color: GOLD, marginRight: 10 }} /> Market <span style={{ color: GOLD, marginLeft: 6 }}>Demand Signals</span>
                    </h1>
                    <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                        Top in-demand skill areas mapped against your verified Skill Passport ({mySkillCount} verified skills).
                    </p>
                </div>

                {loading ? (
                    <Skeleton height={250} width="100%" />
                ) : error && matches.length === 0 ? (
                    <div style={{ padding: 32, textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ color: MUTED, fontSize: 14 }}>{error}</p>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: 20 }}>
                            <input
                                type="text"
                                placeholder="Filter by skill or domain..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, outline: 'none' }}
                            />
                        </div>

                        {filtered.length === 0 ? (
                            <div style={{ padding: 32, textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                                <p style={{ color: MUTED, fontSize: 14 }}>No demand signals match your search.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                                {filtered.map((m, idx) => (
                                    <div key={m.signal.name || idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                                <div>
                                                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#fff' }}>{m.signal.name}</h3>
                                                    <p style={{ margin: '2px 0 0', fontSize: 12, color: MUTED }}>
                                                        {m.signal.domain || 'General'} {m.signal.nsqfLevel ? `• NSQF L${m.signal.nsqfLevel}` : ''}
                                                    </p>
                                                </div>
                                                <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                                                    Demand {m.signal.industryDemandScore}
                                                </span>
                                            </div>
                                            {m.signal.marketInsight && (
                                                <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.5, margin: '10px 0' }}>{m.signal.marketInsight}</p>
                                            )}
                                            <p style={{ fontSize: 12, color: m.count > 0 ? '#22c55e' : MUTED, margin: '4px 0 8px' }}>
                                                {m.count > 0
                                                    ? `Your passport covers this area via: ${m.matches.join(', ')}`
                                                    : 'No verified skills aligned with this area yet.'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ marginTop: 20, padding: 14, borderRadius: 10, background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.25)' }}>
                            <p style={{ margin: 0, fontSize: 12.5, color: MUTED, lineHeight: 1.6 }}>
                                This view reflects verified market demand from industry signals — it is not a live job board.
                                Direct hiring flows are being onboarded at partner institutions; applications will be listed here as they become available.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </ErrorBoundary>
    );
}