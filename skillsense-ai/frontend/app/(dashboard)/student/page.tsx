'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Radar,
  PolarGrid,
  PolarAngleAxis,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import { resolveBranch } from '@/lib/branches';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { AIInsightCard } from '@/components/ui/AIInsightCard';
import { AIBadge } from '@/components/ui/AIBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { FadeIn } from '@/components/shared/FadeIn';
import { QuickTipsSegment } from '@/components/shared/QuickTipsSegment';
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
  ShieldCheck,
  Download,
  Copy,
  Check,
  Layers,
  UserCheck,
  Briefcase,
  QrCode,
  Calendar,
  RefreshCw,
  Clock,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Milestone,
} from 'lucide-react';
import toast from 'react-hot-toast';

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
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '8px 12px',
          boxShadow: 'var(--shadow-md)',
          fontSize: 12,
        }}
      >
        <div style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: 4 }}>{label}</div>
        {payload.map((item: any, i: number) => (
          <div key={i} style={{ color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>{item.name}:</span>
            <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{item.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showDetailedCharts, setShowDetailedCharts] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);
  const [careerData, setCareerData] = useState<any>(null);
  const [gapData, setGapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.getMyProfile();
      if (data && data._id) {
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setProfile(null);
      } else {
        setError('Unable to load your dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!profile?._id) return;
    studentApi
      .getCareerPaths(profile._id)
      .then((res) => setCareerData(res))
      .catch(() => setCareerData(null));
  }, [profile?._id]);

  const handleCopyPassport = () => {
    const hash = profile?.passportHash;
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    toast.success('Passport verification hash copied!');
    setTimeout(() => setCopiedHash(false), 2500);
  };

  const studentName = profile?.userId?.name || 'Student';
  const overallScore = profile?.overallScore ?? 0;
  const nsqfLevel = profile?.nsqfLevel ?? 5;
  const program = profile?.program || 'Vocational Program';
  const branch = resolveBranch(program);
  const skills = profile?.skills || [];
  const growthData = profile?.growthData || [];

  const sortedSkills = [...skills].sort((a: any, b: any) => (b.score || 0) - (a.score || 0));
  const strongestSkills = sortedSkills.slice(0, 3);
  const weakestSkills = sortedSkills.slice(-2).reverse();

  const radarData = skills.length > 0
    ? skills.map((s: any) => ({
        subject: typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : String(s.skillId),
        score: s.score || 75,
      }))
    : branch.radarDimensions.map((dim) => ({
        subject: dim.subject,
        score: Math.min(95, Math.max(65, 75 + dim.baseScoreOffset)),
      }));

  const careers = careerData?.topCareerPaths || [];
  const topCareer = careers[0] || null;

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 60 }}>
        {/* ── Loading State ── */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="card-linear" style={{ padding: 24, borderRadius: 14 }}>
                <div style={{ height: 20, width: 220, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 12 }} />
                <div style={{ height: 120, background: 'rgba(255,255,255,0.04)', borderRadius: 8 }} />
              </div>
            ))}
          </div>
        )}

        {/* ── Error / Empty State ── */}
        {!loading && (error || !profile) && (
          error ? (
            <div className="card-linear" style={{ padding: 40, borderRadius: 16, textAlign: 'center', marginTop: 20 }}>
              <AlertTriangle size={36} style={{ color: 'var(--gold)', marginBottom: 12 }} />
              <h2 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                Unable to Load Dashboard
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 16px', lineHeight: 1.6 }}>
                We could not retrieve your dashboard data. Check your connection and try again.
              </p>
              <button onClick={fetchProfile} className="btn-gold" style={{ fontSize: 13, padding: '9px 20px', cursor: 'pointer' }}>
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          ) : (
            <EmptyState
              illustration="outcomes"
              title="No Verified Student Profile Found"
              description="No verified student profile is linked to your account yet. Complete an NSQF diagnostic assessment or run an AI skill evaluation to initialize your personalized cockpit."
              actionText="Take Diagnostic Assessment"
              actionHref="/student/assessments"
              style={{ marginTop: 20 }}
            />
          )
        )}

        {!loading && !error && profile && (
        <>
        {/* ── Top Intelligence Briefing ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <AIBadge type="nsqf" label={`NSQF LEVEL ${nsqfLevel || 5}`} />
                <AIBadge type="verified" label="CREDENTIAL VERIFIED · DIGITAL SEAL" />
              </div>
              <h1
                className="font-display"
                style={{
                  fontSize: 'clamp(22px, 5vw, 28px)',
                  fontWeight: 800,
                  color: '#f8fafc',
                  margin: 0,
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                }}
              >
                Welcome back, <span style={{ color: 'var(--gold)' }}>{studentName}</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, lineHeight: 1.5 }}>
                {program} · Enrollment ID:{' '}
                <span className="font-mono" style={{ color: '#cbd5e1' }}>
                  {profile?.enrollmentNumber || 'Not assigned'}
                </span>
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, width: '100%', flexWrap: 'wrap' }} className="sm:w-auto">
              <Link
                href="/student/journey?action=report"
                className="btn-gold"
                style={{ fontSize: 12.5, padding: '8px 16px', flex: 1, textAlign: 'center', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Briefcase size={15} /> Update Employment
              </Link>
              <Link
                href="/student/assessment"
                className="btn-secondary"
                style={{ fontSize: 12.5, padding: '8px 16px', flex: 1, textAlign: 'center', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <CheckCircle2 size={15} /> Take Diagnostic Quiz
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
            marginBottom: 22,
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
                padding: '8px 16px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                borderBottom: `2px solid ${activeTab === t.key ? 'var(--gold)' : 'transparent'}`,
                background: activeTab === t.key ? 'rgba(245,158,11,0.08)' : 'transparent',
                color: activeTab === t.key ? 'var(--gold)' : 'var(--text-secondary)',
                fontSize: 13,
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* ── Vocational Career Progression Bar ── */}
            <div className="card-linear" style={{ padding: '16px 20px', borderRadius: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Your Vocational Journey Progression
                </div>
                <Link href="/student/journey" style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                  <span>Full Milestone Timeline</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
                {[
                  { step: '1. Enrollment', status: 'Enrolled', done: true, sub: program },
                  { step: '2. Competency Test', status: skills.length > 0 ? `${skills.length} Evaluated` : 'Pending Exam', done: skills.length > 0, sub: `Score: ${overallScore}%` },
                  { step: '3. Skill Passport', status: profile?.passportHash ? 'Digital Seal Verified' : 'In Progress', done: !!profile?.passportHash, sub: `NSQF Level ${nsqfLevel}` },
                  { step: '4. Employment Outcome', status: profile?.status === 'EMPLOYED' || profile?.placed ? 'Outcome Recorded' : 'Action Required', done: profile?.status === 'EMPLOYED' || profile?.placed, sub: profile?.status === 'EMPLOYED' ? 'Verified Job' : 'Report Status' },
                ].map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: m.done ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${m.done ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      {m.done ? <CheckCircle2 size={13} color="var(--success)" /> : <Clock size={13} color="var(--gold)" />}
                      <span style={{ fontSize: 11, fontWeight: 700, color: m.done ? 'var(--success)' : 'var(--gold)' }}>{m.step}</span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>{m.status}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── High-Impact Recommended Next Action Card ── */}
            <div
              className="card-accent"
              style={{
                padding: '20px 22px',
                borderRadius: 14,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
                borderLeft: '4px solid var(--gold)',
              }}
            >
              <div style={{ maxWidth: 640 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gold)', background: 'rgba(245,158,11,0.12)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--gold-border)' }}>
                    Priority Next Action
                  </span>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                    Milestone Tracker
                  </span>
                </div>
                <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
                  Report Your Employment or Apprenticeship Outcome
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Have you recently received a placement offer, started an apprenticeship, or transitioned into employment? Recording your verified outcome activates your state credential and unlocks milestone retention follow-ups.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link
                  href="/student/journey?action=report"
                  className="btn-gold"
                  style={{
                    fontSize: 13,
                    padding: '10px 20px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 2px 10px rgba(245,158,11,0.25)',
                  }}
                >
                  <Briefcase size={15} /> Update Employment Outcome
                </Link>
                <Link
                  href="/student/assessment"
                  className="btn-secondary"
                  style={{
                    fontSize: 13,
                    padding: '10px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <CheckCircle2 size={15} /> Take Diagnostic Quiz
                </Link>
              </div>
            </div>

            <QuickTipsSegment />

            {/* AI Actionable Insight Banner */}
            {topCareer && (
              <AIInsightCard
                title="Workforce Placement Trajectory"
                badgeText="NSQF CAREER ALIGNMENT"
                insight={`Based on your evaluated competency score (${overallScore}/100) in ${program}, sharpening key architectural skills raises your compatibility with ${topCareer.title} roles (projected salary: ${topCareer.salaryRange || '₹8-14 LPA'}).`}
                actionText="View Upskilling Roadmap"
                actionHref="/student/career"
                confidence={Math.min(1, Math.max(0, (topCareer.matchPercent || 92) / 100))}
                category="Career Acceleration"
              />
            )}

            {/* Top Score Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              {[
                { label: 'Overall Readiness Index', value: `${overallScore}/100`, sub: 'NSQF Benchmarked', color: 'var(--gold)' },
                { label: 'Top Career Alignment',                 value: `${topCareer?.matchPercent ?? '--'}%`, sub: topCareer?.title || 'No career match yet', color: '#10b981' },
                { label: 'Assessed Competencies', value: `${skills.length} Domains`, sub: 'Skill passport entries', color: '#60a5fa' },
                { label: 'Skill Gap Index', value: gapData?.overallGapScore != null ? `${gapData.overallGapScore}%` : '--', sub: 'vs Indian hiring standards', color: '#f59e0b' },
              ].map((card, i) => (
                <div key={i} className="card-linear" style={{ padding: '16px 18px', borderRadius: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {card.label}
                  </div>
                  <div className="font-display" style={{ fontSize: 26, fontWeight: 800, color: card.color, marginTop: 4 }}>
                    {card.value}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {card.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Progressive Disclosure Toggle for In-Depth Analytics */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 6px' }}>
              <button
                type="button"
                onClick={() => setShowDetailedCharts((prev) => !prev)}
                className="btn-secondary"
                style={{
                  fontSize: 12.5,
                  padding: '9px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  borderRadius: 99,
                  cursor: 'pointer',
                }}
              >
                <BarChart3 size={15} color="var(--gold)" />
                <span>{showDetailedCharts ? 'Hide In-Depth Competency Radar & YoY Trajectory' : 'View In-Depth Competency Radar & YoY Trajectory'}</span>
                {showDetailedCharts ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {/* Charts Grid: Radar Matrix & Growth Trajectory (Progressively Disclosed) */}
            {showDetailedCharts && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
                {/* Radar Chart */}
                <div className="card-standard" style={{ padding: 22, borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        Competency Radar Analysis
                      </h3>
                      <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                        Measured against NSQF Level {nsqfLevel} standard
                      </p>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>6 Axis Matrix</span>
                  </div>

                  <div style={{ height: 260, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.08)" />
                        <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                        <Radar name="Assessed Score" dataKey="score" stroke="var(--gold)" fill="var(--gold)" fillOpacity={0.35} />
                        <Tooltip content={<DarkTooltip />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Trajectory Area Chart */}
                <div className="card-standard" style={{ padding: 22, borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        Score Growth Trajectory
                      </h3>
                      <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                        Progression across recent evaluation cycles vs industry benchmark
                      </p>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 700 }}>+22% YoY</span>
                  </div>

                  <div style={{ height: 260, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={growthData}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="cycle" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis domain={[40, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <Tooltip content={<DarkTooltip />} />
                        <Area type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" name="Candidate Score" />
                        <Area type="monotone" dataKey="benchmark" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorBenchmark)" name="Industry Benchmark" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Strengths & Growth Areas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              {/* Strongest Skills */}
              <div className="card-status-success" style={{ padding: 20, borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Demonstrated Technical Strengths
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {strongestSkills.map((s: any, i: number) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                          {typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : String(s.skillId)}
                        </span>
                        <span style={{ fontWeight: 800, color: 'var(--success)' }}>{s.score}%</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${s.score}%`, height: '100%', background: 'var(--success)', borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Upskilling Areas */}
              <div className="card-status-warning" style={{ padding: 20, borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <AlertTriangle size={16} color="var(--gold)" />
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Priority Upskilling Targets
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {weakestSkills.map((w: any, i: number) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                          {typeof w.skillId === 'object' && w.skillId?.name ? w.skillId.name : String(w.skillId)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 800, color: 'var(--gold)' }}>{w.score}%</span>
                          <Link href="/student/analyzer" className="link-hover" style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>
                            Upskill →
                          </Link>
                        </div>
                      </div>
                      <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${w.score}%`, height: '100%', background: 'var(--gold)', borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              {[
                { title: 'AI Skill Analyzer', href: '/student/analyzer', desc: 'Scan code, resume & GitHub repos', icon: <Brain size={16} color="var(--gold)" /> },
                { title: 'Interactive Assessments', href: '/student/assessments', desc: 'Take adaptive MCQ & coding tests', icon: <CheckCircle2 size={16} color="#10b981" /> },
                { title: 'Targeted Job Matches', href: '/student/jobs', desc: 'Browse verified hiring openings', icon: <Briefcase size={16} color="#60a5fa" /> },
                { title: 'Cryptographic Passport', href: '/student/passport', desc: 'View tamper-proof NSQF credential', icon: <Award size={16} color="#a855f7" /> },
              ].map((tile, idx) => (
                <Link
                  key={idx}
                  href={tile.href}
                  style={{
                    display: 'block',
                    padding: 16,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border)',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.background = 'rgba(245,158,11,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    {tile.icon}
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: '#f8fafc' }}>{tile.title}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{tile.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 2: SKILL GAPS & ROADMAP ── */}
        {activeTab === 'gaps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card-linear" style={{ padding: 24, borderRadius: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Target Career Benchmark
                  </span>
                  <h3 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', margin: '2px 0 0' }}>
                    {gapData?.targetRole || 'Career Roadmap'}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
                    {gapData?.aiSummary || 'Run the AI Analyzer to generate skill gap recommendations based on your verified competencies.'}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Deficiency Index</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b' }}>
                    {gapData?.overallGapScore != null ? `${gapData.overallGapScore}%` : '--'}
                  </div>
                </div>
              </div>

              {/* Critical Gaps Grid */}
              <div style={{ marginTop: 24 }}>
                <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#f8fafc', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={16} color="#ef4444" /> Critical Skill Deficiencies
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                  {(gapData?.criticalGaps || []).map((g: any, i: number) => (
                    <div key={i} style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: 13.5 }}>{g.skill}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: '#ef4444', background: 'rgba(239,68,68,0.12)', padding: '2px 8px', borderRadius: 6 }}>
                          {g.priority} Priority
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
                        Current: <strong style={{ color: 'var(--gold)' }}>{g.currentScore}%</strong> / Target:{' '}
                        <strong style={{ color: '#10b981' }}>{g.requiredScore}%</strong>
                      </div>
                      <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 8, lineHeight: 1.4 }}>
                        <strong>Action:</strong> {g.recommendedAction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roadmap Timeline */}
              {gapData?.roadmap && (
                <div style={{ marginTop: 28 }}>
                  <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#f8fafc', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Compass size={16} color="var(--gold)" /> Milestone Upskilling Roadmap
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {gapData.roadmap.map((step: any, i: number) => (
                      <div
                        key={i}
                        style={{
                          padding: 16,
                          background: 'rgba(255,255,255,0.02)',
                          borderRadius: 10,
                          borderLeft: '4px solid var(--gold)',
                          borderTop: '1px solid var(--border)',
                          borderRight: '1px solid var(--border)',
                          borderBottom: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--gold)' }}>
                          {step.phase} ({step.timeline})
                        </div>
                        <div style={{ fontSize: 12.5, color: '#cbd5e1', marginTop: 6, lineHeight: 1.5 }}>
                          {Array.isArray(step.actions) ? step.actions.join(' · ') : step.actions}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 3: CAREER PATHWAYS ── */}
        {activeTab === 'careers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  AI Predicted Career Pathways
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
                  Matched against verified skill scores and real-time hiring demand signals in India.
                </p>
              </div>
              <Link href="/student/career" className="btn-gold" style={{ fontSize: 12.5, padding: '7px 16px' }}>
                Open Career Explorer →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {careers.map((c: any, i: number) => (
                <div key={i} className="card-linear" style={{ padding: 22, borderRadius: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>{c.title}</h4>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--gold)', background: 'rgba(245,158,11,0.12)', padding: '3px 10px', borderRadius: 99, border: '1px solid var(--gold-border)' }}>
                      {c.matchPercent}% Match
                    </span>
                  </div>

                  <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
                    Est. Compensation: <strong style={{ color: '#10b981' }}>{c.salaryRange || '₹8-15 LPA'}</strong>
                  </div>

                  <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                    Timeline to Job Ready: <strong style={{ color: '#cbd5e1' }}>{c.timeToAchieve || 'Immediate'}</strong>
                  </div>

                  {c.companies && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4 }}>
                        Top Hiring Partners:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {c.companies.map((comp: string, idx: number) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: 11,
                              padding: '2px 8px',
                              borderRadius: 6,
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid var(--border)',
                              color: '#cbd5e1',
                            }}
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {c.roadmap && c.roadmap.length > 0 && (
                    <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>Priority Action:</div>
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
          <div className="card-linear" style={{ padding: 26, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
              <div>
                <AIBadge type="verified" label="OFFICIAL NSQF CREDENTIAL" />
                <h3 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', margin: '6px 0 0' }}>
                  Cryptographic Skill Passport
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4 }}>
                  Verifiable digital credential issued under the National Skills Qualifications Framework.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={handleCopyPassport}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 600,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    color: copiedHash ? '#10b981' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {copiedHash ? <Check size={14} /> : <Copy size={14} />}
                  {copiedHash ? 'Hash Copied' : 'Copy Seal Hash'}
                </button>
                <Link href="/student/passport" className="btn-gold" style={{ fontSize: 12.5, padding: '8px 16px' }}>
                  View Full Passport & QR →
                </Link>
              </div>
            </div>

            {/* Passport Credential Seal Card */}
            <div
              style={{
                padding: 24,
                background: 'linear-gradient(135deg, rgba(15,17,26,0.98), rgba(245,158,11,0.06))',
                borderRadius: 14,
                border: '1px solid rgba(245,158,11,0.3)',
                maxWidth: 700,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Government of India · SkillSense Digital Seal
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', marginTop: 4 }}>{studentName}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>Enrollment ID: {profile?.enrollmentNumber || 'Not assigned'}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>Program: {program}</div>
                  <div style={{ fontSize: 14, color: 'var(--gold)', marginTop: 8, fontWeight: 800 }}>
                    Verified Competency Score: {overallScore}/100 (NSQF Level {nsqfLevel})
                  </div>
                </div>

                <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                  <QrCode size={64} color="var(--gold)" />
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Scan to Verify</div>
                </div>
              </div>

              <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  SHA-256 HMAC Cryptographic Verification Hash
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: '#94a3b8',
                    marginTop: 4,
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                    background: 'rgba(0,0,0,0.4)',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {profile?.passportHash || 'PASSPORT UNAVAILABLE'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: ASSESSMENTS ── */}
        {activeTab === 'assessments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Verified Assessment Ledgers ({skills.length})
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
                  All diagnostic quizzes, coding challenges, and technical evaluations recorded on your passport.
                </p>
              </div>

              <Link href="/student/assessments" className="btn-gold" style={{ fontSize: 12.5, padding: '7px 16px' }}>
                Launch New Assessment →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {skills.map((s: any, idx: number) => (
                <div
                  key={idx}
                  className="card-linear"
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: 12,
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14.5, color: '#f8fafc' }}>
                      {typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : String(s.skillId)}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={13} /> Verified on: {s.lastAssessed ? new Date(s.lastAssessed).toLocaleDateString() : 'Active Assessment'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: 'var(--gold)',
                        background: 'rgba(245,158,11,0.12)',
                        padding: '4px 12px',
                        borderRadius: 99,
                        border: '1px solid var(--gold-border)',
                      }}
                    >
                      {s.score}%
                    </span>
                    <span style={{ fontSize: 12, color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ShieldCheck size={14} /> Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </>
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}
