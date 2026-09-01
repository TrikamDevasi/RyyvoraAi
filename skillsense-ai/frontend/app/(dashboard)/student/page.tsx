'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Radar, PolarGrid, PolarAngleAxis, Tooltip,
} from 'recharts';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { AIInsightCard } from '@/components/ui/AIInsightCard';
import { AIBadge } from '@/components/ui/AIBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { FadeIn } from '@/components/shared/FadeIn';
import {
  Brain,
  Award,
  Compass,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Target,
  FileCheck,
  Zap,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const RadarChart = dynamic(() => import('recharts').then((mod) => mod.RadarChart), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });

const TABS = [
  { key: 'overview', label: 'Intelligence Overview' },
  { key: 'gaps', label: 'Skill Gap & Roadmap' },
  { key: 'careers', label: 'Career Pathways' },
  { key: 'passport', label: 'Skill Passport' },
  { key: 'assessments', label: 'Verified Ledgers' },
];

const DarkTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#0f111a',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 8,
          padding: '8px 12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          fontSize: 12,
        }}
      >
        <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: 4 }}>{label}</div>
        {payload.map((item: any, i: number) => (
          <div key={i} style={{ color: '#f8fafc', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ color: '#94a3b8' }}>{item.name}:</span>
            <span style={{ fontWeight: 700 }}>{item.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [careerData, setCareerData] = useState<any>(null);
  const [gapData, setGapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingGaps, setLoadingGaps] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.getMyProfile();
      setProfile(data);

      if (data._id) {
        studentApi
          .getCareerPaths(data._id)
          .then((res) => setCareerData(res))
          .catch(() => {});
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to connect to student telemetry service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch skill gaps once profile is available
  useEffect(() => {
    if (profile?._id && !gapData) {
      setLoadingGaps(true);
      api
        .get(`/analytics/skill-gaps/${profile._id}`)
        .then(({ data }) => setGapData(data.data))
        .catch(() => {})
        .finally(() => setLoadingGaps(false));
    }
  }, [activeTab, profile, gapData]);

  const studentName = profile?.userId?.name || 'Student Candidate';
  const overallScore = profile?.overallScore ?? 0;
  const nsqfLevel = profile?.nsqfLevel ?? 0;
  const program = profile?.program || 'Program not yet specified';
  const skills = profile?.skills || [];

  // Sort skills to find strongest and weakest
  const sortedSkills = [...skills].sort((a: any, b: any) => (b.score || 0) - (a.score || 0));
  const strongestSkills = sortedSkills.slice(0, 3);
  const weakestSkills = sortedSkills.slice(-2).reverse();

  const radarData =
    skills.length > 0
      ? skills.map((s: any) => ({
          subject: typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : String(s.skillId),
          score: s.score || 0,
        }))
      : [];

  const careers = careerData?.topCareerPaths || [];
  const topCareer = careers[0] || null;

  if (error) {
    return (
      <div style={{ padding: '40px 0' }}>
        <ErrorState title="Student Telemetry Offline" error={error} onRetry={fetchProfile} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <FadeIn>
        {/* ── Top Intelligence Briefing ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <AIBadge type="nsqf" label={`NSQF LEVEL ${nsqfLevel || '—'}`} />
                <AIBadge type="verified" label={profile?.passportHash ? 'CREDENTIAL VERIFIED' : 'CREDENTIAL PENDING'} />
              </div>
              <h1
                className="font-display"
                style={{
                  fontSize: 'clamp(20px, 5vw, 26px)',
                  fontWeight: 800,
                  color: '#f8fafc',
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                Welcome back, <span style={{ color: 'var(--gold)' }}>{studentName}</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
                {program} · ID: <span className="font-mono" style={{ color: '#cbd5e1' }}>{profile?.enrollmentNumber || '—'}</span>
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, width: '100%', flexWrap: 'wrap' }} className="sm:w-auto">
              <Link
                href="/student/analyzer"
                className="btn-gold"
                style={{ fontSize: 12.5, padding: '7px 14px', flex: 1, textAlign: 'center', justifyContent: 'center' }}
              >
                <Brain size={14} /> Run AI Analyzer
              </Link>
              <Link
                href="/student/assessment"
                className="btn-secondary"
                style={{ fontSize: 12.5, padding: '7px 14px', flex: 1, textAlign: 'center', justifyContent: 'center' }}
              >
                <CheckCircle2 size={14} /> Take Assessment
              </Link>
            </div>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div
          className="no-scrollbar touch-pan-x"
          style={{
            display: 'flex',
            gap: 6,
            borderBottom: '1px solid var(--border)',
            paddingBottom: 2,
            marginBottom: 20,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                borderBottom: `2px solid ${activeTab === t.key ? 'var(--gold)' : 'transparent'}`,
                background: activeTab === t.key ? 'rgba(245,158,11,0.08)' : 'transparent',
                color: activeTab === t.key ? 'var(--gold)' : 'var(--text-secondary)',
                fontSize: 12.5,
                fontWeight: activeTab === t.key ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* AI Actionable Insight Banner */}
            {topCareer ? (
              <AIInsightCard
                title="Workforce Placement Recommendation"
                badgeText="NSQF CAREER BRIEF"
                insight={`Based on your evaluated competency score (${overallScore}/100) in ${program}, sharpening ${topCareer.missingSkills?.[0] || 'your priority skill gap'} can raise your alignment with ${topCareer.title} opportunities.`}
                actionText="View Targeted Upskilling Plan"
                actionHref="/student/career"
                confidence={Math.min(1, Math.max(0, (topCareer.matchPercent || 0) / 100))}
                category="Career Acceleration"
              />
            ) : (
              <div className="card-linear" style={{ padding: 16 }}>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  No verified assessments yet — run the AI skill analyzer to receive a workforce placement recommendation based on real competency data.
                </p>
                <Link href="/student/analyzer" className="btn-gold" style={{ marginTop: 12, display: 'inline-flex', fontSize: 12, padding: '6px 14px' }}>
                  <Brain size={14} /> Run AI Analyzer
                </Link>
              </div>
            )}

            {/* Top Score Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
              {[
                { label: 'Overall Readiness Index', value: overallScore > 0 ? `${overallScore}/100` : '—', sub: 'NSQF Benchmarked', color: 'var(--gold)' },
                { label: 'Top Career Alignment', value: careers[0]?.matchPercent != null ? `${careers[0].matchPercent}%` : '—', sub: topCareer?.title || 'No career analysis yet', color: '#10b981' },
                { label: 'Assessed Competencies', value: `${skills.length} Domains`, sub: 'Skill passport entries', color: '#60a5fa' },
                { label: 'Skill Gap Index', value: gapData?.overallGapScore != null ? `${gapData.overallGapScore}%` : '—', sub: 'vs current job benchmarks', color: '#f59e0b' },
              ].map((card, i) => (
                <div key={i} className="card-linear" style={{ padding: '16px 18px' }}>
                  {loading ? (
                    <Skeleton height={60} />
                  ) : (
                    <>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {card.label}
                      </div>
                      <div className="font-display" style={{ fontSize: 24, fontWeight: 800, color: card.color, marginTop: 4 }}>
                        {card.value}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                        {card.sub}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 18 }}>
              {/* Radar Chart */}
              <div className="card-linear" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                      Competency Radar Analysis
                    </h3>
                    <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Measured against NSQF Level {nsqfLevel} standard
                    </p>
                  </div>
                </div>

                {skills.length > 0 ? (
                  <div style={{ height: 260, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.08)" />
                        <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                        <Radar name="Assessed Score" dataKey="score" stroke="var(--gold)" fill="var(--gold)" fillOpacity={0.35} />
                        <Tooltip content={<DarkTooltip />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ padding: '30px 0', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
                      No assessed competencies yet. Run the AI analyzer or take an assessment to build your radar.
                    </p>
                  </div>
                )}
              </div>

              {/* Trajectory Area Chart */}
              <div className="card-linear" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                      Score Growth Trajectory
                    </h3>
                    <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Progression over recent evaluation cycles
                    </p>
                  </div>
                </div>

                <div style={{ padding: '30px 0', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
                    No historical evaluation cycles yet — your score growth trajectory will appear here after repeated assessments.
                  </p>
                </div>
              </div>
            </div>

            {/* Strengths & Growth Areas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              {/* Strongest Skills */}
              <div className="card-linear" style={{ padding: 18, borderLeft: '3px solid #10b981' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    Demonstrated Strengths
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(strongestSkills.length > 0 ? strongestSkills : []).map((s: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
                      <span style={{ color: '#cbd5e1' }}>{typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : String(s.skillId)}</span>
                      <span style={{ fontWeight: 800, color: '#10b981' }}>{s.score}%</span>
                    </div>
                  ))}
                  {strongestSkills.length === 0 && (
                    <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-muted)' }}>Complete an assessment to measure your demonstrated strengths.</p>
                  )}
                </div>
              </div>

              {/* Priority Upskilling Areas */}
              <div className="card-linear" style={{ padding: 18, borderLeft: '3px solid var(--gold)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <AlertTriangle size={16} color="var(--gold)" />
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    Priority Upskilling Targets
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(weakestSkills.length > 0 ? weakestSkills : []).map((w: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
                      <span style={{ color: '#cbd5e1' }}>{typeof w.skillId === 'object' && w.skillId?.name ? w.skillId.name : String(w.skillId)}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 800, color: 'var(--gold)' }}>{w.score}%</span>
                        <Link href="/student/analyzer" style={{ fontSize: 11, color: '#f59e0b', textDecoration: 'underline' }}>
                          Upskill →
                        </Link>
                      </div>
                    </div>
                  ))}
                  {weakestSkills.length === 0 && (
                    <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-muted)' }}>Complete an assessment to surface priority upskilling targets.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: SKILL GAPS & ROADMAP ── */}
        {activeTab === 'gaps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {loadingGaps ? (
              <Skeleton height={200} />
            ) : (
              <div className="card-linear" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Target Trajectory
                    </span>
                    <h3 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: '2px 0 0' }}>
                      {gapData?.targetRole || 'Target role not analyzed yet'}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
                      {gapData?.aiSummary || 'Run a skill-gap analysis to see your target trajectory and upskilling roadmap.'}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Deficiency Index</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#f59e0b' }}>
                      {gapData?.overallGapScore != null ? `${gapData.overallGapScore}%` : '—'}
                    </div>
                  </div>
                </div>

                {/* Visual Flow Stages */}
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 12 }}>
                    Critical Skill Deficiencies
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                    {gapData?.criticalGaps && gapData.criticalGaps.length > 0 ? gapData.criticalGaps.map((g: any, i: number) => (
                      <div key={i} style={{ padding: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: 13 }}>{g.skill}</span>
                          <span style={{ fontSize: 10, fontWeight: 800, color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                            {g.priority} Priority
                          </span>
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 4 }}>
                          Current: <strong style={{ color: 'var(--gold)' }}>{g.currentScore}%</strong> / Target: <strong style={{ color: '#10b981' }}>{g.requiredScore}%</strong>
                        </div>
                        <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 8 }}>
                          Action: {g.recommendedAction}
                        </div>
                      </div>
                    )) : (
                    <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-muted)' }}>
                      No critical skill gaps reported yet — run the skill-gap analysis to identify priorities.
                    </p>
                  )}
                  </div>
                </div>

                {/* Roadmap Timeline */}
                {gapData?.roadmap && (
                  <div style={{ marginTop: 28 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 12 }}>
                      Milestone Upskilling Roadmap
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {gapData.roadmap.map((step: any, i: number) => (
                        <div key={i} style={{ padding: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid var(--gold)' }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--gold)' }}>
                            {step.phase} ({step.timeline})
                          </div>
                          <div style={{ fontSize: 12.5, color: '#cbd5e1', marginTop: 4 }}>
                            {step.actions?.join(' · ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: CAREER PATHWAYS ── */}
        {activeTab === 'careers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  AI Predicted Career Pathways
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
                  Matched against verified skill scores and real-time hiring demand signals in India.
                </p>
              </div>
              <Link href="/student/career" className="btn-gold" style={{ fontSize: 12, padding: '6px 14px' }}>
                Open Career Explorer →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {careers.length === 0 ? (
                <EmptyState
                  title="No Career Pathways Yet"
                  description="Run the AI career match to see predicted roles based on your verified skills and real hiring demand."
                  actionText="Run Career Match"
                  actionHref="/student/career"
                />
              ) : careers.map((c: any, i: number) => (
                <div key={i} className="card-linear" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', margin: 0 }}>{c.title}</h4>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)', background: 'rgba(245,158,11,0.12)', padding: '2px 8px', borderRadius: 99 }}>
                      {c.matchPercent}% Match
                    </span>
                  </div>

                  <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--text-secondary)' }}>
                    Est. Salary: <strong style={{ color: '#10b981' }}>{c.salaryRange || 'Not reported'}</strong>
                  </div>

                  <div style={{ marginTop: 4, fontSize: 11.5, color: 'var(--text-muted)' }}>
                    Timeline to Job Ready: {c.timeToAchieve || 'Not reported'}
                  </div>

                  {c.roadmap && c.roadmap.length > 0 && (
                    <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>Next Action:</div>
                      <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 2 }}>{c.roadmap[0]}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: SKILL PASSPORT ── */}
        {activeTab === 'passport' && (
          <div className="card-linear" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <AIBadge type="verified" label="OFFICIAL NSQF CREDENTIAL" />
                <h3 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: '6px 0 0' }}>
                  Cryptographic Skill Passport
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
                  Verifiable digital credential issued under the National Skills Qualifications Framework.
                </p>
              </div>

              <Link href="/student/passport" className="btn-gold" style={{ fontSize: 12.5, padding: '7px 16px' }}>
                View Full Passport & QR →
              </Link>
            </div>

            <div style={{ padding: 20, background: '#090a0f', borderRadius: 12, border: '1px solid var(--border)', maxWidth: 640 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>Candidate: {studentName}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 4 }}>ID: {profile?.enrollmentNumber || '—'}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>Program: {program}</div>
<div style={{ fontSize: 13, color: 'var(--gold)', marginTop: 6, fontWeight: 700 }}>
                    Verified Score: {overallScore > 0 ? `${overallScore}/100` : 'Pending assessment'} (NSQF Level {nsqfLevel || '—'})
                  </div>

              <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  SHA-256 Verification Hash
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, fontFamily: 'monospace', wordBreak: 'break-all', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: 6 }}>
                  {profile?.passportHash || 'No verification hash issued yet'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: ASSESSMENTS ── */}
        {activeTab === 'assessments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Verified Assessment Ledgers ({skills.length})
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
                  All diagnostic quizzes and technical evaluations completed.
                </p>
              </div>

              <Link href="/student/assessment" className="btn-gold" style={{ fontSize: 12, padding: '6px 14px' }}>
                Launch New Quiz →
              </Link>
            </div>

            {skills.length === 0 ? (
              <EmptyState
                title="No Assessments Logged"
                description="Take an adaptive AI quiz to evaluate your technical skills and record verified scores on your passport."
                actionText="Start First Assessment"
                actionHref="/student/assessment"
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {skills.map((s: any, idx: number) => (
                  <div key={idx} className="card-linear" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#f8fafc' }}>
                        {typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : String(s.skillId)}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                        Verified on: {new Date(s.lastAssessed || Date.now()).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--gold)', background: 'rgba(245,158,11,0.12)', padding: '3px 10px', borderRadius: 99 }}>
                        {s.score}%
                      </span>
                      <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>✓ Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}
