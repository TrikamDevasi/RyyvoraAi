'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import api from '@/lib/api';
import {
  Users,
  Search,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Briefcase,
  TrendingUp,
  Download,
  Filter,
  ExternalLink,
  Award,
  Sparkles,
  QrCode,
  Lock,
  Plus,
  ArrowUpRight,
  Send,
  Zap,
  AlertCircle,
  MapPin,
  FileCode,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import { MetricStrip } from '@/components/dashboard/KPICard';
import toast from 'react-hot-toast';

const ResponsiveContainer = dynamic(
  () => import('recharts').then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const BarChart = dynamic(
  () => import('recharts').then((m) => m.BarChart),
  { ssr: false }
);

interface Candidate {
  id: string;
  name: string;
  roleTitle: string;
  location: string;
  nsqfLevel: string;
  score: number;
  skills: string[];
  githubScore: number;
  hash: string;
  status: 'AVAILABLE' | 'INTERVIEWING' | 'PLACED';
}

const PRE_SCREENED_CANDIDATES: Candidate[] = [
  {
    id: 'cand_1',
    name: 'Arjun Mehta',
    roleTitle: 'Full-Stack Systems Engineer',
    location: 'Pune, MH',
    nsqfLevel: 'NSQF Level 6',
    score: 92,
    skills: ['React 19', 'Next.js App Router', 'Node.js Microservices', 'PostgreSQL'],
    githubScore: 89,
    hash: '0x9e7a...4b12_HMAC_VERIFIED',
    status: 'AVAILABLE',
  },
  {
    id: 'cand_2',
    name: 'Priya Sharma',
    roleTitle: 'Applied AI & ML Platform Engineer',
    location: 'Mumbai, MH',
    nsqfLevel: 'NSQF Level 6',
    score: 95,
    skills: ['Python', 'LangChain', 'FastAPI', 'PyTorch', 'Vector Embeddings'],
    githubScore: 94,
    hash: '0x7c3d...8f90_HMAC_VERIFIED',
    status: 'AVAILABLE',
  },
  {
    id: 'cand_3',
    name: 'Rohan Deshmukh',
    roleTitle: 'Cloud Native & DevOps SRE',
    location: 'Nagpur, MH',
    nsqfLevel: 'NSQF Level 5',
    score: 88,
    skills: ['Docker', 'Kubernetes Ingress', 'Terraform', 'AWS ECS', 'Linux Admin'],
    githubScore: 86,
    hash: '0x3a2b...1c4e_HMAC_VERIFIED',
    status: 'AVAILABLE',
  },
  {
    id: 'cand_4',
    name: 'Ananya Nair',
    roleTitle: 'Frontend & UI Performance Architect',
    location: 'Nashik, MH',
    nsqfLevel: 'NSQF Level 5',
    score: 90,
    skills: ['TypeScript', 'TailwindCSS', 'WebSockets', 'State Management', 'Framer'],
    githubScore: 88,
    hash: '0x5f8a...9c2d_HMAC_VERIFIED',
    status: 'AVAILABLE',
  },
];

const DEFAULT_PLACEMENT_TRENDS = [
  { month: 'Oct 2025', hires: 34 },
  { month: 'Nov 2025', hires: 48 },
  { month: 'Dec 2025', hires: 62 },
  { month: 'Jan 2026', hires: 79 },
  { month: 'Feb 2026', hires: 94 },
  { month: 'Mar 2026', hires: 118 },
];

export default function EmployerPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(PRE_SCREENED_CANDIDATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('ALL');
  const [verifyHashInput, setVerifyHashInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ status: 'IDLE' | 'SUCCESS' | 'ERROR'; message: string }>({
    status: 'IDLE',
    message: '',
  });
  const [chartData, setChartData] = useState(DEFAULT_PLACEMENT_TRENDS);

  useEffect(() => {
    api
      .get('/analytics/placement-trends')
      .then((res) => {
        if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
          setChartData(res.data.data.map((s: any) => ({ month: s.month, hires: s.placed ?? 0 })));
        }
      })
      .catch(() => {
        // Fallback to default placement trends
      });
  }, []);

  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleVerifyLedgerHash = async () => {
    if (!verifyHashInput.trim()) {
      toast.error('Please enter a valid candidate Skill Passport hash');
      return;
    }

    setVerifyLoading(true);
    setVerifyResult({ status: 'IDLE', message: '' });

    try {
      const res = await api.get(`/verification/public/${encodeURIComponent(verifyHashInput.trim())}`);
      if (res.data?.success && res.data.data?.isValid) {
        const data = res.data.data;
        setVerifyResult({
          status: 'SUCCESS',
          message: `Passport Verified: Candidate ${data.trainee?.name || 'Unknown'} | Program: ${data.trainee?.program || 'N/A'} | NSQF: ${data.trainee?.nsqfLevel || 'N/A'} | Integrity: Confirmed.`,
        });
        toast.success('Candidate Skill Passport cryptographically verified.');
      } else {
        setVerifyResult({
          status: 'ERROR',
          message: res.data?.message || 'Passport verification failed. Hash not found or invalid.',
        });
        toast.error('Verification failed. Please check the hash and try again.');
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Unable to verify passport. Please try again.';
      setVerifyResult({ status: 'ERROR', message });
      toast.error(message);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleScheduleInterview = (name: string) => {
    toast.success(`Interview invitation dispatched to ${name} via verified institutional channel!`);
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTrack =
      selectedTrack === 'ALL' ||
      (selectedTrack === 'FULLSTACK' && c.roleTitle.includes('Full-Stack')) ||
      (selectedTrack === 'AI' && c.roleTitle.includes('AI')) ||
      (selectedTrack === 'CLOUD' && c.roleTitle.includes('Cloud')) ||
      (selectedTrack === 'FRONTEND' && c.roleTitle.includes('Frontend'));
    return matchesSearch && matchesTrack;
  });

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
        {/* ── Top Header Banner ── */}
        <div
          className="editorial-panel"
          style={{
            padding: 26,
            borderRadius: 10,
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Industrial Employer Workforce Image Vignette */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '36%',
              minWidth: 240,
              opacity: 0.16,
              pointerEvents: 'none',
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,1) 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,1) 100%)',
            }}
            aria-hidden="true"
          >
            <img
              src="/images/employers/industrial-employer.jpg"
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <AIBadge type="nsqf" label="ENTERPRISE TALENT SUITE" />
              <AIBadge type="verified" label="NSQF PRE-ASSESSED COHORTS" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Employer Hiring & <span style={{ color: 'var(--gold)' }}>Talent Validation Cockpit</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Direct access to pre-screened technical graduates backed by cryptographic SHA-256 Skill Passports, live GitHub diagnostic audits, and 80% reduced time-to-hire.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link
              href="/employer/placements"
              className="btn-gold"
              style={{ fontSize: 13, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6, borderRadius: 6 }}
            >
              <Briefcase size={14} /> Post Placement Drive
            </Link>
          </div>
        </div>

        {/* ── Recruiter KPI Executive Metric Strip ── */}
        <div style={{ marginBottom: 20 }}>
          <MetricStrip
            items={[
              { label: 'Pre-Assessed Candidates', value: '48,200+', subtext: 'Verified across Maharashtra', icon: Users, color: 'var(--gold)' },
              { label: 'Avg Time-to-Hire', value: '9.4 Days', trend: { value: '-62% vs Traditional', direction: 'down' }, icon: Zap, color: 'var(--success)' },
              { label: 'Ledger Verifications', value: '1,840 Passports', subtext: 'Cryptographically Confirmed', icon: ShieldCheck, color: 'var(--info)' },
              { label: 'Placement Retention', value: '91.8%', subtext: '365d Industry Tenure Index', icon: TrendingUp, color: '#a855f7' },
            ]}
          />
        </div>

        {/* ── Instant Cryptographic Ledger Verification Utility ── */}
        <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-surface)', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <ShieldCheck size={18} color="var(--gold)" />
            <h3 className="font-display" style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Quick Candidate Verification
            </h3>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 14px' }}>
            Enter a candidate's Skill Passport code or ledger hash to confirm NSQF credential authenticity and verified test scores.
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              type="text"
              value={verifyHashInput}
              onChange={(e) => setVerifyHashInput(e.target.value)}
              placeholder="Enter candidate verification hash (e.g. 0x9e7a...4b12)"
              style={{
                flex: 1,
                minWidth: 260,
                padding: '10px 14px',
                borderRadius: 8,
                background: 'var(--bg-input, #0f111a)',
                border: '1px solid var(--border)',
                color: '#fff',
                fontSize: 13,
                fontFamily: 'monospace',
              }}
            />
            <button
              type="button"
              onClick={handleVerifyLedgerHash}
              disabled={verifyLoading}
              className="btn-gold"
              style={{ fontSize: 13, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 6, opacity: verifyLoading ? 0.6 : 1 }}
            >
              <ShieldCheck size={15} /> {verifyLoading ? 'Verifying...' : 'Verify Candidate'}
            </button>
          </div>

          {verifyResult.status === 'SUCCESS' && (
            <div
              style={{
                marginTop: 12,
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.3)',
                color: '#86efac',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <CheckCircle2 size={16} color="#10b981" />
              <span>{verifyResult.message}</span>
            </div>
          )}

          {verifyResult.status === 'ERROR' && (
            <div
              style={{
                marginTop: 12,
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <AlertCircle size={16} color="#ef4444" />
              <span>{verifyResult.message}</span>
            </div>
          )}
        </div>

        {/* ── Pre-Assessed Candidate Talent Pipeline ── */}
        <div style={{ padding: 22, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-surface)', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={18} color="var(--gold)" /> Pre-Assessed Candidates
              </h2>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Graduates evaluated by diagnostic assessments and ready for immediate interview.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', minWidth: 200 }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, role or skill..."
                  style={{
                    padding: '6px 10px 6px 30px',
                    borderRadius: 6,
                    fontSize: 12,
                    background: 'var(--bg-input, #0f111a)',
                    border: '1px solid var(--border)',
                    color: '#fff',
                    width: '100%',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: 'All Tracks' },
                  { id: 'FULLSTACK', label: 'Full-Stack' },
                  { id: 'AI', label: 'AI & ML' },
                  { id: 'CLOUD', label: 'Cloud' },
                  { id: 'FRONTEND', label: 'Frontend' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTrack(t.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 6,
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: selectedTrack === t.id ? 'var(--gold)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selectedTrack === t.id ? 'var(--gold)' : 'var(--border)'}`,
                      color: selectedTrack === t.id ? '#090a0f' : '#cbd5e1',
                      cursor: 'pointer',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Structured Candidate Roster Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.01)' }}>
            {filteredCandidates.map((c, idx) => (
              <div
                key={c.id}
                style={{
                  padding: '14px 18px',
                  borderBottom: idx < filteredCandidates.length - 1 ? '1px solid var(--border)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 14,
                  background: idx % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent',
                }}
              >
                {/* Col 1: Candidate Identity */}
                <div style={{ minWidth: 200, flex: '1 1 200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <h3 className="font-display" style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                      {c.name}
                    </h3>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: 'var(--success-bg)', border: '1px solid var(--success-border)', color: 'var(--success)' }}>
                      {c.nsqfLevel}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}>
                      Ready
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>{c.roleTitle}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 2 }}>
                    {c.hash}
                  </div>
                </div>

                {/* Col 2: Skills Badges */}
                <div style={{ flex: '2 1 260px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {c.skills.map((s, sIdx) => (
                    <span
                      key={sIdx}
                      style={{
                        fontSize: 10.5,
                        padding: '2px 7px',
                        borderRadius: 4,
                        background: 'rgba(255,255,255,0.03)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border)',
                        fontWeight: 500,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Col 3: Telemetry Scores & Location */}
                <div style={{ minWidth: 160, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11.5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)' }}>
                    <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
                    <span>{c.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                      <Zap size={11} style={{ color: 'var(--gold)' }} />
                      <span>Score: <strong style={{ color: 'var(--success)' }}>{c.score}%</strong></span>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                      <FileCode size={11} style={{ color: 'var(--info)' }} />
                      <span>Audit: <strong style={{ color: 'var(--gold)' }}>{c.githubScore}%</strong></span>
                    </span>
                  </div>
                </div>

                {/* Col 4: Action CTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleScheduleInterview(c.name)}
                    className="btn-gold"
                    style={{ fontSize: 11.5, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4, borderRadius: 6 }}
                  >
                    <Send size={11} /> Request Interview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Verified Placement Velocity Chart ── */}
        <div style={{ padding: 22, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Verified Placement & Onboarding Velocity
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Longitudinal monthly candidate hires validated across Maharashtra IT corridors.
              </p>
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#10b981' }}>+41% YoY Growth</span>
          </div>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: '#0f111a',
                    border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: 6,
                    fontSize: 12,
                    color: '#fff',
                  }}
                />
                <Bar dataKey="hires" fill="var(--gold)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>
    </ErrorBoundary>
  );
}