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
  Area,
} from 'recharts';
import {
  School,
  Users,
  Award,
  TrendingUp,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Building2,
  ArrowUpRight,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { instituteApi, InstituteDashboard, PlacementTrendPoint } from '@/lib/api/institute.api';
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
const AreaChart = dynamic(
  () => import('recharts').then((m) => m.AreaChart),
  { ssr: false }
);

export default function InstitutePage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<InstituteDashboard | null>(null);
  const [placementTrend, setPlacementTrend] = useState<PlacementTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const instId = instituteApi.getInstitutionId(user);
    if (!instId) {
      setLoading(false);
      setError('No institution is linked to this account.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await instituteApi.getDashboard(instId);
      setDashboard(result);
      try {
        const trend = await instituteApi.getPlacementTrend(instId);
        setPlacementTrend(trend || []);
      } catch {
        setPlacementTrend([]);
      }
    } catch (err: any) {
      const msg = err?.response?.status === 404
        ? 'No verified institution profile is linked to this account.'
        : 'Unable to load the institutional dashboard. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user?.institutionId, user?._id, user?.id]);

  const inst = dashboard?.institution;
  const stats = dashboard?.stats;

  const handleExportROIDossier = () => {
    if (!inst || !stats) return;
    const dossierData = {
      institution: inst.name,
      type: inst.type,
      location: `${inst.district || ''}, ${inst.state || ''}`.trim(),
      nsqfTier: inst.nsqfAffiliation || 'NSQF Certified',
      metrics: {
        totalEnrolled: stats.studentCount,
        placedStudents: stats.placedCount,
        placementRate: `${stats.placementRate}%`,
        averageScore: `${stats.avgScore} / 100`,
      },
      programs: stats.topPrograms,
      placementTrend,
      generatedAt: new Date().toISOString(),
      accreditedBy: 'Maharashtra NCVET State Board · SkillSense AI Engine',
    };

    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `institutional_roi_dossier_${inst._id}.json`;
    a.click();
    toast.success('Institutional ROI Dossier (JSON) exported!');
  };

  const placementTrendChart = placementTrend.map((p) => ({ month: p.month, placed: p.placed }));

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
              <AIBadge type="nsqf" label={inst?.nsqfAffiliation || 'NSQF CERTIFIED'} />
              <AIBadge type="verified" label="NCVET ACCREDITED INSTITUTION" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              {inst?.name || 'Institution'} · <span style={{ color: 'var(--gold)' }}>Performance Intelligence</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              {inst?.type || 'Training Institute'} — Live cohort skill competency audits and institutional placement ROI tracking.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              disabled
              title="Batch passport minting is handled by the SkillPass admin module"
              className="btn-secondary"
              style={{ fontSize: 12.5, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6, opacity: 0.6, cursor: 'not-allowed' }}
            >
              <Lock size={14} /> Batch Mint Passports
            </button>
            <button
              type="button"
              onClick={handleExportROIDossier}
              disabled={!stats}
              className="btn-secondary"
              style={{ fontSize: 12.5, padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Download size={14} /> Export ROI Dossier
            </button>
          </div>
        </div>

        {/* ── Loading state ── */}
        {loading && (
          <div className="card-linear" style={{ padding: 32, borderRadius: 14, textAlign: 'center' }}>
            <RefreshCw size={26} style={{ color: 'var(--gold)', animation: 'spin 1.5s linear infinite', marginBottom: 8 }} />
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Loading institutional intelligence...</p>
          </div>
        )}

        {/* ── Error state ── */}
        {!loading && error && (
          <div className="card-linear" style={{ padding: 32, borderRadius: 14, textAlign: 'center', marginBottom: 20 }}>
            <AlertTriangle size={28} style={{ color: 'var(--gold)', marginBottom: 8 }} />
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 12px' }}>{error}</p>
            <button onClick={load} className="btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        )}

        {/* ── Empty state when no dashboard data ── */}
        {!loading && !error && !stats && (
          <div className="card-linear" style={{ padding: 32, borderRadius: 14, textAlign: 'center', marginBottom: 20 }}>
            <School size={32} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
            <p style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', margin: '0 0 4px' }}>
              No institutional metrics available yet
            </p>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 12px' }}>
              Cohort statistics will appear here once students are enrolled and assessments are verified.
            </p>
            <Link href="/institute/students" className="btn-outline" style={{ fontSize: 12.5, padding: '8px 18px', textDecoration: 'none' }}>
              View Student Roster
            </Link>
          </div>
        )}

        {!loading && !error && stats && (
        <>
        {/* ── Institutional Scorecards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Enrolled Trainees', value: `${stats.studentCount.toLocaleString('en-IN')}`, sub: 'Registered Cohort Size', color: 'var(--gold)', icon: Users },
            { label: 'Verified Placements', value: `${stats.placedCount.toLocaleString('en-IN')}`, sub: `${stats.placementRate}% Placement Rate`, color: '#10b981', icon: CheckCircle2 },
            { label: 'Avg Skill Competency', value: `${(stats.avgScore || 0).toFixed(1)} / 100`, sub: 'NSQF Calibrated Score', color: '#60a5fa', icon: Award },
            { label: 'Enrolled Rate', value: `${stats.placementRate}%`, sub: 'Verified Placement Rate', color: '#a855f7', icon: TrendingUp },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="card-linear" style={{ padding: '16px 18px', borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {stat.label}
                  </span>
                  <div style={{ padding: 6, borderRadius: 6, background: 'rgba(255,255,255,0.04)', color: stat.color }}>
                    <Icon size={16} />
                  </div>
                </div>
                <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {stat.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Charts Grid: Program Competencies & Placement Trajectory ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20, marginBottom: 24 }}>
          {/* Program Distribution & Competency */}
          <div className="card-linear" style={{ padding: 22, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 className="font-display" style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Program Enrollment
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Student count by department.
                </p>
              </div>
              <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>Active Cohorts</span>
            </div>

            {stats.topPrograms.length === 0 ? (
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', padding: '40px 0', textAlign: 'center' }}>
                No program breakdown available yet.
              </p>
            ) : (
              <div style={{ height: 230, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topPrograms} layout="vertical" barSize={12}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="program" type="category" tick={{ fill: '#cbd5e1', fontSize: 10.5 }} axisLine={false} tickLine={false} width={150} />
                    <Tooltip
                      contentStyle={{
                        background: '#0f111a',
                        border: '1px solid rgba(245,158,11,0.3)',
                        borderRadius: 8,
                        fontSize: 12,
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="count" fill="var(--gold)" radius={[0, 4, 4, 0]} name="Students" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Monthly Placed Candidates Velocity */}
          <div className="card-linear" style={{ padding: 22, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 className="font-display" style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Monthly Placement Velocity
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Placed graduates across seasonal campus drives.
                </p>
              </div>
            </div>

            {placementTrendChart.length === 0 ? (
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', padding: '40px 0', textAlign: 'center' }}>
                No placement trend data available yet.
              </p>
            ) : (
              <div style={{ height: 230, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={placementTrendChart}>
                    <defs>
                      <linearGradient id="instGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--gold)" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10.5 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10.5 }} />
                    <Tooltip
                      contentStyle={{
                        background: '#0f111a',
                        border: '1px solid rgba(245,158,11,0.3)',
                        borderRadius: 8,
                        fontSize: 12,
                        color: '#fff',
                      }}
                    />
                    <Area type="monotone" dataKey="placed" stroke="var(--gold)" fill="url(#instGrad)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* ── Curriculum Gap Auditing (no backend source yet) ── */}
        <div className="card-linear" style={{ padding: 24, borderRadius: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={17} color="var(--gold)" /> Curriculum Skill Gap Audit
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Algorithmic alignment with current industry tech stack demands and NCVET standards.
              </p>
            </div>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', padding: '24px 0', textAlign: 'center', margin: 0 }}>
            Curriculum gap analysis will appear once the SkillGap analyzer is run across verified cohorts.
          </p>
        </div>
        </>
        )}

        {/* ── Quick Action Nav Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {[
            { title: 'Student Batch Management', desc: 'Inspect individual candidate rosters, marks, and test completion.', href: '/institute/students', icon: Users },
            { title: 'Bulk Trainee Upload', desc: 'Onboard fresh cohort spreadsheets via CSV or institutional LMS sync.', href: '/institute/upload', icon: Upload },
            { title: 'Placement Drives & Registry', desc: 'Coordinate campus drives with verified partner tech employers.', href: '/institute/placement', icon: Building2 },
            { title: 'Institutional ROI Analysis', desc: 'Evaluate department salary multiplier vs state education grant.', href: '/institute/roi', icon: TrendingUp },
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                href={action.href}
                className="card-linear hover:border-gold"
                style={{
                  padding: 18,
                  borderRadius: 14,
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 12,
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div style={{ padding: 8, borderRadius: 8, background: 'rgba(245,158,11,0.1)', color: 'var(--gold)', width: 'fit-content', marginBottom: 10 }}>
                    <Icon size={18} />
                  </div>
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>{action.title}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{action.desc}</p>
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>Open Portal</span>
                  <ArrowUpRight size={13} />
                </div>
              </Link>
            );
          })}
        </div>
      </FadeIn>
    </ErrorBoundary>
  );
}