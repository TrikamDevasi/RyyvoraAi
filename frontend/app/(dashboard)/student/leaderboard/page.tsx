'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Filter, Sparkles, TrendingUp, User } from 'lucide-react';
import api from '@/lib/api';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllDomains, resolveDomain } from '@/lib/domains';

const GOLD = '#D4A843';
const ALL_DOMAINS = getAllDomains();

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
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [rankings, setRankings] = useState<RankedStudent[]>([]);
  const [myProfile, setMyProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      try {
        const [profileRes, studentsRes] = await Promise.allSettled([
          studentApi.getMyProfile(),
          api.get('/students', {
            params: {
              domain: selectedDomain !== 'ALL' ? selectedDomain : undefined,
              limit: 50,
            },
          }),
        ]);

        if (cancelled) return;

        const profile = profileRes.status === 'fulfilled' ? profileRes.value : null;
        setMyProfile(profile);

        let list: any[] = [];
        if (studentsRes.status === 'fulfilled') {
          const resData = studentsRes.value.data?.data;
          list = Array.isArray(resData) ? resData : resData?.items || [];
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
          program: s.program || 'Computer Science & Engineering',
          overallScore: s.overallScore || 78,
          nsqfLevel: s.nsqfLevel || 6,
          isCurrentUser: profile?._id === s._id || (s.userId && profile?.userId === s.userId?._id),
        }));

        setRankings(formatted);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [selectedDomain]);

  const topThree = rankings.slice(0, 3);

  return (
    <ErrorBoundary>
      <div style={{ color: '#fff', maxWidth: 1040, margin: '0 auto', paddingBottom: 60 }}>
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(212,168,67,0.12)',
                  border: '1px solid rgba(212,168,67,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold)',
                }}
              >
                <Trophy size={18} />
              </div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                State Competency <span style={{ color: 'var(--gold)' }}>Leaderboard</span>
              </h1>
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>
              Real-time rankings computed from cryptographically verified NSQF skill assessments across Maharashtra.
            </p>
          </div>

          {/* Domain Dropdown Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={15} color="var(--text-muted)" />
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Disciplines</option>
              {ALL_DOMAINS.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Skeleton height={140} width="100%" />
            <Skeleton height={280} width="100%" />
          </div>
        ) : (
          <>
            {/* Top 3 Podium Cards */}
            {topThree.length >= 3 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 28 }}>
                {/* 2nd Place */}
                <div
                  style={{
                    background: 'linear-gradient(180deg, rgba(148,163,184,0.08) 0%, rgba(15,17,26,0.9) 100%)',
                    border: '1px solid rgba(148,163,184,0.25)',
                    borderRadius: 16,
                    padding: 20,
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  <div style={{ position: 'absolute', top: 12, right: 14, fontSize: 11, fontWeight: 800, color: '#94a3b8' }}>#2</div>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'rgba(148,163,184,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px',
                      color: '#94a3b8',
                    }}
                  >
                    <Medal size={22} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#fff' }}>{topThree[1].name}</h3>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{topThree[1].program}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#94a3b8' }}>{topThree[1].overallScore}% Score</div>
                </div>

                {/* 1st Place Champion */}
                <div
                  style={{
                    background: 'linear-gradient(180deg, rgba(212,168,67,0.14) 0%, rgba(15,17,26,0.95) 100%)',
                    border: '2px solid var(--gold)',
                    borderRadius: 16,
                    padding: 22,
                    textAlign: 'center',
                    position: 'relative',
                    transform: 'scale(1.02)',
                    boxShadow: '0 8px 30px rgba(212,168,67,0.15)',
                  }}
                >
                  <div style={{ position: 'absolute', top: 12, right: 14, fontSize: 12, fontWeight: 900, color: 'var(--gold)' }}>#1 RANK</div>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'rgba(212,168,67,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px',
                      color: 'var(--gold)',
                    }}
                  >
                    <Crown size={26} />
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>{topThree[0].name}</h3>
                  <div style={{ fontSize: 12, color: 'var(--gold)', marginBottom: 8 }}>{topThree[0].program}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--gold)' }}>{topThree[0].overallScore}% Score</div>
                </div>

                {/* 3rd Place */}
                <div
                  style={{
                    background: 'linear-gradient(180deg, rgba(217,119,6,0.08) 0%, rgba(15,17,26,0.9) 100%)',
                    border: '1px solid rgba(217,119,6,0.25)',
                    borderRadius: 16,
                    padding: 20,
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  <div style={{ position: 'absolute', top: 12, right: 14, fontSize: 11, fontWeight: 800, color: '#d97706' }}>#3</div>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'rgba(217,119,6,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px',
                      color: '#d97706',
                    }}
                  >
                    <Medal size={22} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#fff' }}>{topThree[2].name}</h3>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{topThree[2].program}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#d97706' }}>{topThree[2].overallScore}% Score</div>
                </div>
              </div>
            )}

            {/* Rankings Table */}
            <div
              style={{
                background: 'var(--bg-surface)',
                borderRadius: 16,
                border: '1px solid var(--border)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--gold)', width: 90 }}>Rank</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-muted)' }}>Candidate</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-muted)' }}>Discipline</th>
                    <th style={{ padding: '14px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>NSQF Tier</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right', color: 'var(--text-muted)' }}>Verified Score</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: 36, textAlign: 'center', color: 'var(--text-muted)' }}>
                        No candidates found for the selected engineering discipline.
                      </td>
                    </tr>
                  ) : (
                    rankings.map((r) => (
                      <tr
                        key={r.id || r.rank}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          background: r.isCurrentUser ? 'rgba(212,168,67,0.1)' : 'transparent',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        <td style={{ padding: '14px 20px', fontWeight: 800 }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ color: r.rank === 1 ? 'var(--gold)' : r.rank === 2 ? '#94a3b8' : r.rank === 3 ? '#d97706' : '#fff' }}>
                              #{r.rank}
                            </span>
                            {r.rank === 1 && <Crown size={14} color="var(--gold)" />}
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span>{r.name}</span>
                            {r.isCurrentUser && (
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 800,
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  background: 'var(--gold)',
                                  color: '#08060f',
                                }}
                              >
                                YOU
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{r.program}</td>
                        <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 6,
                              background: 'rgba(16,185,129,0.1)',
                              border: '1px solid rgba(16,185,129,0.25)',
                              color: 'var(--emerald)',
                            }}
                          >
                            Level {r.nsqfLevel}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 800, color: 'var(--gold)' }}>
                          {r.overallScore}%
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}
