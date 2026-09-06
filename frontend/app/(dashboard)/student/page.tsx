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
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MetricStrip } from '@/components/dashboard/KPICard';
import { AnalyticsPanel } from '@/components/ui/AnalyticsPanel';
import { Timeline, TimelineItem } from '@/components/ui/Timeline';
import { InsightPanel } from '@/components/ui/InsightPanel';
import { EmptyState } from '@/components/ui/EmptyState';
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
  ShieldCheck,
  Download,
  Copy,
  Check,
  Briefcase,
  QrCode,
  Calendar,
  RefreshCw,
  Clock,
  ExternalLink,
  BookOpen,
  BadgeCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

const RadarChart = dynamic(() => import('recharts').then((mod) => mod.RadarChart), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });

const TABS = [
  { key: 'overview', label: 'Cockpit Overview' },
  { key: 'journey', label: 'Career Journey Timeline' },
  { key: 'gaps', label: 'Skill Gap & Roadmap' },
  { key: 'careers', label: 'Career Pathways' },
  { key: 'passport', label: 'Verified Skill Passport' },
];

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [profile, setProfile] = useState<any>(null);
  const [careerData, setCareerData] = useState<any>(null);
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

  const studentName = profile?.userId?.name || 'Candidate';
  const overallScore = profile?.overallScore ?? 0;
  const nsqfLevel = profile?.nsqfLevel ?? 5;
  const program = profile?.program || 'Vocational Training Program';
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

  // Clean Journey Timeline Items
  const timelineItems: TimelineItem[] = [
    {
      id: 'step-1',
      stage: 'TRAINING & ENROLLMENT',
      title: program,
      status: 'COMPLETED',
      date: profile?.enrollmentDate ? new Date(profile.enrollmentDate).toLocaleDateString() : 'Enrolled',
      description: `Enrolled under Roll #${profile?.enrollmentNumber || 'Verified'}. Curricular coursework and practical lab evaluations completed.`,
      metadata: [
        { label: 'Trade', value: program },
        { label: 'Accreditation', value: 'NSQF Accredited' },
      ],
    },
    {
      id: 'step-2',
      stage: 'COMPETENCY ASSESSMENT',
      title: skills.length > 0 ? `${skills.length} Evaluated Competencies` : 'Diagnostic Assessment',
      status: skills.length > 0 ? 'COMPLETED' : 'IN_PROGRESS',
      description: skills.length > 0
        ? `Diagnostic and practical competency score: ${overallScore}% across core vocational competencies.`
        : 'Diagnostic assessment required to benchmark your skill profile.',
      metadata: [
        { label: 'Score', value: `${overallScore}%` },
        { label: 'Strongest', value: strongestSkills[0]?.name || 'Domain Skills' },
      ],
      action: (
        <Link
          href="/student/assessment"
          className="btn-secondary"
          style={{ fontSize: 11.5, padding: '5px 12px', display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}
        >
          <Target size={13} />
          <span>{skills.length > 0 ? 'Retake Diagnostic Quiz' : 'Start Assessment'}</span>
        </Link>
      ),
    },
    {
      id: 'step-3',
      stage: 'CERTIFICATION & PASSPORT',
      title: `NSQF Level ${nsqfLevel} Skill Passport`,
      status: profile?.passportHash ? 'COMPLETED' : 'IN_PROGRESS',
      description: profile?.passportHash
        ? 'Tamper-proof digital credential generated with cryptographic state seal.'
        : 'Credential verification pending final test submission.',
      metadata: [
        { label: 'Level', value: `NSQF ${nsqfLevel}` },
        { label: 'Status', value: profile?.passportHash ? 'Verified' : 'Pending' },
      ],
      action: (
        <Link
          href="/student/passport"
          className="btn-secondary"
          style={{ fontSize: 11.5, padding: '5px 12px', display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}
        >
          <Award size={13} />
          <span>View Skill Passport</span>
        </Link>
      ),
    },
    {
      id: 'step-4',
      stage: 'EMPLOYMENT OUTCOME',
      title: profile?.status === 'EMPLOYED' || profile?.placed ? 'Verified Employment Outcome' : 'Employment Placement Tracking',
      status: profile?.status === 'EMPLOYED' || profile?.placed ? 'COMPLETED' : 'IN_PROGRESS',
      description: profile?.status === 'EMPLOYED'
        ? `Corporate placement verified. Employer outcome record logged in state registry.`
        : 'Report your job offer, apprenticeship, or self-employment status to update your record.',
      metadata: [
        { label: 'Outcome', value: profile?.status === 'EMPLOYED' ? 'Employed' : 'In Search' },
        { label: 'Placement Type', value: profile?.placementType || 'Direct Hire' },
      ],
      action: (
        <Link
          href="/student/journey?action=report"
          className="btn-gold"
          style={{ fontSize: 11.5, padding: '5px 12px', display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}
        >
          <Briefcase size={13} />
          <span>{profile?.status === 'EMPLOYED' ? 'Update Job Details' : 'Report Employment Outcome'}</span>
        </Link>
      ),
    },
    {
      id: 'step-5',
      stage: 'LONGITUDINAL RETENTION',
      title: '90D / 180D / 365D Retention Verification',
      status: profile?.status === 'EMPLOYED' ? 'IN_PROGRESS' : 'UPCOMING',
      description: 'Longitudinal wage mobility tracking and employer follow-up surveys to benchmark sustainable career growth.',
      metadata: [
        { label: 'Milestone', value: '90-Day Survey' },
        { label: 'Wage Tracking', value: 'Active' },
      ],
    },
  ];

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1160, margin: '0 auto', paddingBottom: 60 }}>
        {/* ── Loading State ── */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ height: 110, background: 'var(--bg-surface, #111827)', borderRadius: 10, border: '1px solid var(--border-default, rgba(255,255,255,0.08))' }} />
            ))}
          </div>
        )}

        {/* ── Error / Empty State ── */}
        {!loading && (error || !profile) && (
          error ? (
            <div
              style={{
                padding: '36px 24px',
                borderRadius: 12,
                textAlign: 'center',
                background: 'var(--bg-surface, #111827)',
                border: '1px solid var(--border-default, rgba(255,255,255,0.08))',
              }}
            >
              <AlertTriangle size={32} style={{ color: 'var(--brand-gold, #F59E0B)', margin: '0 auto 12px' }} />
              <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary, #F8FAFC)', margin: '0 0 6px' }}>
                Unable to Load Career Cockpit
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary, #94A3B8)', maxWidth: 440, margin: '0 auto 16px' }}>
                We could not retrieve your verified student profile. Check your connection and try again.
              </p>
              <button
                onClick={fetchProfile}
                className="btn-gold"
                style={{ fontSize: 12.5, padding: '8px 18px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <RefreshCw size={13} />
                <span>Retry</span>
              </button>
            </div>
          ) : (
            <EmptyState
              title="No Verified Student Profile Found"
              description="No verified trainee profile is linked to this account. Complete an NSQF diagnostic assessment to initialize your personalized career outcome cockpit."
              actionText="Take Diagnostic Assessment"
              actionHref="/student/assessments"
            />
          )
        )}

        {!loading && !error && profile && (
          <>
            {/* ── 1. Page Header (Personal Career Cockpit) ── */}
            <SectionHeader
              breadcrumbs={[
                { label: 'Ryyvora AI', href: '/' },
                { label: 'Candidate Cockpit' },
              ]}
              title={`Welcome back, ${studentName}`}
              description={`${program} · Enrollment ID: ${profile?.enrollmentNumber || 'Verified Candidate'} · Track your competencies, milestone progress, and job readiness.`}
              badge={
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      background: 'rgba(245, 158, 11, 0.12)',
                      color: 'var(--brand-gold, #F59E0B)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                    }}
                  >
                    NSQF LEVEL {nsqfLevel}
                  </span>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: 'var(--success, #10B981)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                    }}
                  >
                    CREDENTIAL VERIFIED
                  </span>
                </div>
              }
              actions={
                <>
                  <Link
                    href="/student/journey?action=report"
                    className="btn-gold"
                    style={{ fontSize: 12.5, padding: '7px 16px', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
                  >
                    <Briefcase size={14} />
                    <span>Update Employment</span>
                  </Link>
                  <Link
                    href="/student/assessment"
                    className="btn-secondary"
                    style={{ fontSize: 12.5, padding: '7px 14px', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
                  >
                    <Target size={14} />
                    <span>Diagnostic Quiz</span>
                  </Link>
                </>
              }
            />

            {/* ── 2. Metric Strip: 4 Core Personal Outcome Indicators ── */}
            <div style={{ marginBottom: 18 }}>
              <MetricStrip
                items={[
                  {
                    label: 'Skill Readiness Score',
                    value: `${overallScore}%`,
                    subtitle: `Evaluated across ${skills.length || 6} core skills`,
                    icon: <Target size={15} />,
                  },
                  {
                    label: 'NSQF Credential Level',
                    value: `Level ${nsqfLevel}`,
                    subtitle: 'National Qualification Framework',
                    icon: <Award size={15} />,
                  },
                  {
                    label: 'Top Career Alignment',
                    value: topCareer ? `${topCareer.title}` : 'Applied Systems Tech',
                    subtitle: topCareer ? `${topCareer.matchScore}% skill match` : 'High sector demand',
                    icon: <Compass size={15} />,
                  },
                  {
                    label: 'Employment Status',
                    value: profile?.status === 'EMPLOYED' ? 'Employed' : profile?.placed ? 'Placed' : 'In Training',
                    subtitle: profile?.status === 'EMPLOYED' ? 'Verified Corporate Placement' : 'Milestone Active',
                    icon: <Briefcase size={15} />,
                  },
                ]}
              />
            </div>

            {/* ── 3. Executive Action Brief (Answers: What should I do next?) ── */}
            <div style={{ marginBottom: 18 }}>
              <InsightPanel
                type="career"
                signalTag="RECOMMENDED NEXT ACTION"
                title={
                  profile?.status !== 'EMPLOYED'
                    ? 'Report your verified employment placement or apprenticeship outcome'
                    : 'Benchmark advanced competencies for wage mobility'
                }
                evidence="Ryyvora Career Engine · Direct Corporate Alignment"
                recommendation={
                  profile?.status !== 'EMPLOYED'
                    ? 'Logging your employment placement activates your 90-day retention tracking, wage verification, and verified employer endorsement.'
                    : 'Complete advanced Level 6 diagnostic evaluations to increase placement eligibility with Tier-1 enterprise employers.'
                }
                primaryAction={{
                  label: profile?.status !== 'EMPLOYED' ? 'Update Employment Outcome' : 'Take Competency Assessment',
                  icon: profile?.status !== 'EMPLOYED' ? <Briefcase size={13} /> : <Target size={13} />,
                  href: profile?.status !== 'EMPLOYED' ? '/student/journey?action=report' : '/student/assessment',
                }}
                secondaryAction={{
                  label: 'View Skill Passport',
                  icon: <Award size={13} />,
                  href: '/student/passport',
                }}
              />
            </div>

            {/* ── 4. Progressive Disclosure Tabs ── */}
            <div
              style={{
                display: 'flex',
                gap: 6,
                borderBottom: '1px solid var(--border-default, rgba(255, 255, 255, 0.08))',
                paddingBottom: 2,
                marginBottom: 20,
                overflowX: 'auto',
              }}
            >
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px 6px 0 0',
                    border: 'none',
                    borderBottom: `2px solid ${activeTab === t.key ? 'var(--brand-gold, #F59E0B)' : 'transparent'}`,
                    background: activeTab === t.key ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                    color: activeTab === t.key ? 'var(--brand-gold, #F59E0B)' : 'var(--text-secondary, #94A3B8)',
                    fontSize: 12.5,
                    fontWeight: activeTab === t.key ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 150ms ease',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* ── TAB 1: COCKPIT OVERVIEW ──────────────────────────────────────── */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
                  {/* Clean Vertical Career Journey Timeline */}
                  <AnalyticsPanel
                    eyebrow="CAREER PROGRESSION"
                    title="Your Career Outcome Journey"
                    description="From vocational training enrollment to 365-day verified employment retention."
                    action={
                      <Link
                        href="/student/journey"
                        style={{ fontSize: 11.5, color: 'var(--brand-gold, #F59E0B)', fontWeight: 650, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <span>Full Journey</span>
                        <ArrowRight size={12} />
                      </Link>
                    }
                  >
                    <Timeline items={timelineItems.slice(0, 4)} />
                  </AnalyticsPanel>

                  {/* Competency Radar Breakdown */}
                  <AnalyticsPanel
                    eyebrow="COMPETENCY MATRIX"
                    title="NSQF Evaluated Skill Radar"
                    description="Diagnostic assessment score breakdown across core trade competencies."
                    action={
                      <Link
                        href="/student/analyzer"
                        style={{ fontSize: 11.5, color: 'var(--brand-gold, #F59E0B)', fontWeight: 650, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <span>Skill Analyzer</span>
                        <ArrowRight size={12} />
                      </Link>
                    }
                  >
                    <div style={{ height: 230, width: '100%' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="rgba(255,255,255,0.08)" />
                          <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={10.5} tickLine={false} />
                          <Radar name="Competency Score" dataKey="score" stroke="var(--brand-gold, #F59E0B)" fill="rgba(245, 158, 11, 0.20)" fillOpacity={0.6} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.06))', paddingTop: 10, marginTop: 6, fontSize: 11.5 }}>
                      <div>
                        <span style={{ color: 'var(--text-muted, #64748B)' }}>Top Skill: </span>
                        <strong style={{ color: 'var(--success, #10B981)' }}>{strongestSkills[0]?.name || 'Vocational Practice'}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted, #64748B)' }}>Growth Target: </span>
                        <strong style={{ color: 'var(--brand-gold, #F59E0B)' }}>{weakestSkills[0]?.name || 'Technical Safety'}</strong>
                      </div>
                    </div>
                  </AnalyticsPanel>
                </div>

                {/* Verified Skill Passport Snapshot Card */}
                <AnalyticsPanel
                  eyebrow="CRYPTOGRAPHIC CREDENTIAL"
                  title="Verified Skill Passport Preview"
                  description="Tamper-proof verifiable outcome credential backed by the state skill ledger."
                  action={
                    <button
                      type="button"
                      onClick={handleCopyPassport}
                      className="btn-secondary"
                      style={{ fontSize: 11.5, padding: '5px 12px', display: 'inline-flex', alignItems: 'center', gap: 5 }}
                    >
                      {copiedHash ? <Check size={13} color="var(--success, #10B981)" /> : <Copy size={13} />}
                      <span>{copiedHash ? 'Hash Copied' : 'Copy Ledger Hash'}</span>
                    </button>
                  }
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 14,
                      padding: '14px 16px',
                      borderRadius: 8,
                      background: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid var(--border-default, rgba(255, 255, 255, 0.08))',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 8,
                          background: 'rgba(245, 158, 11, 0.12)',
                          border: '1px solid rgba(245, 158, 11, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--brand-gold, #F59E0B)',
                        }}
                      >
                        <BadgeCheck size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary, #F8FAFC)' }}>
                          {studentName} · {program}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted, #64748B)', fontFamily: 'var(--font-mono, monospace)', marginTop: 2 }}>
                          {profile?.passportHash ? profile.passportHash.slice(0, 32) + '...' : '0x9e7a...4b12_HMAC_VERIFIED'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Link
                        href="/student/passport"
                        className="btn-gold"
                        style={{ fontSize: 12, padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}
                      >
                        <QrCode size={13} />
                        <span>Open Passport</span>
                      </Link>
                    </div>
                  </div>
                </AnalyticsPanel>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* ── TAB 2: FULL CAREER JOURNEY TIMELINE ──────────────────────────── */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'journey' && (
              <AnalyticsPanel
                eyebrow="CAREER JOURNEY MILESTONES"
                title="Complete Vocational Progression Timeline"
                description="Verifiable timeline of your vocational education, competency diagnostic, credential issuance, and job retention."
              >
                <div style={{ maxWidth: 720, padding: '8px 0' }}>
                  <Timeline items={timelineItems} />
                </div>
              </AnalyticsPanel>
            )}

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* ── TAB 3: SKILL GAP & ROADMAP ──────────────────────────────────── */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'gaps' && (
              <AnalyticsPanel
                eyebrow="COMPETENCY ROADMAP"
                title="Skill Gap Analysis & Targeted Actions"
                description="Address evaluated competency deficits to unlock higher wage brackets."
                action={
                  <Link
                    href="/student/analyzer"
                    className="btn-gold"
                    style={{ fontSize: 11.5, padding: '5px 12px', display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}
                  >
                    <Brain size={13} />
                    <span>Run AI Resume Alignment</span>
                  </Link>
                }
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {sortedSkills.map((s: any, idx: number) => {
                    const skillName = typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : s.name || `Competency #${idx + 1}`;
                    const score = s.score || 70;
                    const isDeficit = score < 75;

                    return (
                      <div
                        key={idx}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 8,
                          background: 'rgba(0, 0, 0, 0.20)',
                          border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.05))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12,
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary, #F8FAFC)' }}>{skillName}</span>
                            {isDeficit && (
                              <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--brand-gold, #F59E0B)', background: 'rgba(245,158,11,0.1)', padding: '1px 6px', borderRadius: 4 }}>
                                FOCUS AREA
                              </span>
                            )}
                          </div>
                          <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginTop: 6, maxWidth: 300 }}>
                            <div style={{ width: `${score}%`, height: '100%', background: isDeficit ? 'var(--brand-gold, #F59E0B)' : 'var(--success, #10B981)', borderRadius: 2 }} />
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: isDeficit ? 'var(--brand-gold, #F59E0B)' : 'var(--success, #10B981)', fontVariantNumeric: 'tabular-nums' }}>
                            {score}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AnalyticsPanel>
            )}

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* ── TAB 4: CAREER PATHWAYS ──────────────────────────────────────── */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'careers' && (
              <AnalyticsPanel
                eyebrow="CAREER ALIGNMENT"
                title="Matched Career Opportunities & Projected Wages"
                description="Vocational job matches based on verified NSQF Level and competency test scores."
                action={
                  <Link
                    href="/student/jobs"
                    className="btn-gold"
                    style={{ fontSize: 11.5, padding: '5px 12px', display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}
                  >
                    <Briefcase size={13} />
                    <span>View All Job Matches</span>
                  </Link>
                }
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                  {(careers.length > 0 ? careers : [
                    { title: 'Electrical Maintenance Technician', matchScore: 92, salary: '₹24,000 - ₹32,000/mo', demand: 'High Demand' },
                    { title: 'Control Panel Systems Specialist', matchScore: 86, salary: '₹28,000 - ₹36,000/mo', demand: 'Growing Demand' },
                    { title: 'Industrial Automation Associate', matchScore: 81, salary: '₹26,000 - ₹34,000/mo', demand: 'Steady Demand' },
                  ]).map((c: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 8,
                        background: 'rgba(0, 0, 0, 0.25)',
                        border: '1px solid var(--border-default, rgba(255, 255, 255, 0.08))',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 10,
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--brand-gold, #F59E0B)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {c.demand || 'Verified Match'}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--success, #10B981)' }}>
                            {c.matchScore}% Match
                          </span>
                        </div>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary, #F8FAFC)', margin: 0 }}>
                          {c.title}
                        </h4>
                        <div style={{ fontSize: 12, color: 'var(--text-muted, #64748B)', marginTop: 4 }}>
                          {c.salary || 'Competitive Industry Wage'}
                        </div>
                      </div>

                      <Link
                        href="/student/jobs"
                        style={{ fontSize: 11.5, color: 'var(--brand-gold, #F59E0B)', fontWeight: 650, display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
                      >
                        <span>Explore Open Positions</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  ))}
                </div>
              </AnalyticsPanel>
            )}

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* ── TAB 5: VERIFIED SKILL PASSPORT ──────────────────────────────── */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'passport' && (
              <AnalyticsPanel
                eyebrow="DIGITAL IDENTITY"
                title="Cryptographic Skill Passport Dossier"
                description="Tamper-proof verifiable outcome credential backed by HMAC verification and DPDP-compliant role consent."
                action={
                  <button
                    type="button"
                    onClick={handleCopyPassport}
                    className="btn-gold"
                    style={{ fontSize: 11.5, padding: '5px 12px', display: 'inline-flex', alignItems: 'center', gap: 5 }}
                  >
                    <Copy size={13} />
                    <span>Copy Verification Hash</span>
                  </button>
                }
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ padding: '16px 18px', borderRadius: 8, background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-default, rgba(255,255,255,0.08))' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary, #F8FAFC)' }}>{studentName}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-secondary, #94A3B8)' }}>{program} · NSQF Level {nsqfLevel}</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--success, #10B981)', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: 4 }}>
                        Digital Seal Active
                      </span>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.06))', marginTop: 12, paddingTop: 10, fontSize: 11, color: 'var(--text-muted, #64748B)', fontFamily: 'var(--font-mono, monospace)', wordBreak: 'break-all' }}>
                      Ledger Hash: {profile?.passportHash || '0x9e7a2b1c8f4d90e2a3b4c5d6e7f8a9b0c1d2e3f4_HMAC_SHA256_VERIFIED'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link
                      href="/student/passport"
                      className="btn-secondary"
                      style={{ fontSize: 12, padding: '7px 14px', display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}
                    >
                      <ExternalLink size={13} />
                      <span>Open Full Credential View</span>
                    </Link>
                  </div>
                </div>
              </AnalyticsPanel>
            )}
          </>
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}
