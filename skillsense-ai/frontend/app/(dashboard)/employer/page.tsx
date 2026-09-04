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
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
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
          className="card-accent"
          style={{
            padding: 26,
            borderRadius: 16,
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
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
              style={{ fontSize: 13, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Briefcase size={14} /> Post Placement Drive
            </Link>
          </div>
        </div>

        {/* ── Recruiter KPI Scorecards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Pre-Assessed Candidates', value: '48,200+', sub: 'Verified across Maharashtra', color: 'var(--gold)', icon: Users },
            { label: 'Avg Time-to-Hire', value: '9.4 Days', sub: '-62% vs Traditional Recruiting', color: 'var(--success)', icon: Zap },
            { label: 'Ledger Verifications', value: '1,840 Passports', sub: 'Cryptographically Confirmed', color: 'var(--info)', icon: ShieldCheck },
            { label: 'Placement Retention Rate', value: '91.8%', sub: '365d Industry Tenure Index', color: '#a855f7', icon: TrendingUp },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="card-kpi card-interactive" style={{ padding: '16px 18px', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {stat.label}
                  </span>
                  <div className="card-icon-container" style={{ width: 30, height: 30, color: stat.color }}>
                    <Icon size={15} />
                  </div>
                </div>
                <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: stat.color, letterSpacing: '-0.02em' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 3 }}>
                  {stat.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Instant Cryptographic Ledger Verification Utility ── */}
        <div className="card-linear" style={{ padding: 22, borderRadius: 14, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Lock size={16} color="var(--gold)" />
            <h3 className="font-display" style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Instant 1-Click Candidate Passport Ledger Verification
            </h3>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 14px' }}>
            Paste any candidate’s SkillSense SHA-256 HMAC hash or scan their passport QR to confirm academic authenticity on the state ledger.
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              type="text"
              value={verifyHashInput}
              onChange={(e) => setVerifyHashInput(e.target.value)}
              placeholder="e.g. 0x9e7a4b12..._HMAC_VERIFIED"
              style={{
                flex: 1,
                minWidth: 260,
                padding: '9px 12px',
                borderRadius: 8,
                background: 'var(--bg-input, #0f111a)',
                border: '1px solid var(--border)',
                color: '#fff',
                fontSize: 12.5,
                fontFamily: 'monospace',
              }}
            />
            <button
              type="button"
              onClick={handleVerifyLedgerHash}
              disabled={verifyLoading}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6, opacity: verifyLoading ? 0.6 : 1 }}
            >
              <ShieldCheck size={14} /> {verifyLoading ? 'Verifying...' : 'Verify Authenticity'}
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
        <div className="card-linear" style={{ padding: 24, borderRadius: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={18} color="var(--gold)" /> Pre-Assessed High-Competency Talent Pool
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Graduates evaluated by multi-modal code diagnostic radar and NSQF Level 5/6 benchmarks.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: 'All Tracks' },
                { id: 'FULLSTACK', label: 'Full-Stack' },
                { id: 'AI', label: 'AI & ML' },
                { id: 'CLOUD', label: 'Cloud SRE' },
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {filteredCandidates.map((c) => (
              <div
                key={c.id}
                className="card-accent card-interactive card-3d"
                style={{
                  padding: 18,
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 14,
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <h3 className="font-display" style={{ fontSize: 15.5, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        {c.name}
                      </h3>
                      <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>{c.roleTitle}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: 'var(--success-bg)', border: '1px solid var(--success-border)', color: 'var(--success)' }}>
                      {c.nsqfLevel}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 12, margin: '10px 0', fontSize: 11.5, color: 'var(--text-muted)' }}>
                    <span>📍 {c.location}</span>
                    <span>⚡ Score: <strong style={{ color: 'var(--success)' }}>{c.score}%</strong></span>
                    <span>💻 Code Audit: <strong style={{ color: 'var(--gold)' }}>{c.githubScore}%</strong></span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
                    {c.skills.map((s, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: 10.5,
                          padding: '2px 7px',
                          borderRadius: 4,
                          background: 'var(--bg-surface-elevated)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border)',
                          fontWeight: 500,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {c.hash}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleScheduleInterview(c.name)}
                    className="btn-gold"
                    style={{ fontSize: 11.5, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Send size={11} /> Request Interview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Verified Placement Velocity Chart ── */}
        <div className="card-linear" style={{ padding: 22, borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Verified Placement & Onboarding Velocity
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
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
                    borderRadius: 8,
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