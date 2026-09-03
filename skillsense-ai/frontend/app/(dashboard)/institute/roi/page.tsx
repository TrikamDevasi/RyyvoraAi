'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  TrendingUp,
  Users,
  RefreshCw,
  AlertTriangle,
  School,
  FileDown,
  Calculator,
  CheckCircle2,
  DollarSign,
  Info,
} from 'lucide-react';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { instituteApi } from '@/lib/api/institute.api';
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

export interface ProgramROIItem {
  program: string;
  roi: number | null;
  status?: string;
  isSufficientData?: boolean;
  sampleSize?: number;
  placedCount?: number;
  avgSalaryMonthly?: number;
  annualWageUplift?: number;
  threeYearReturn?: number;
  costPerTrainee?: number;
  message?: string;
}

export default function ROIPage() {
  const { user } = useAuth();
  const [scores, setScores] = useState<ProgramROIItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insufficientDataNotice, setInsufficientDataNotice] = useState<string | null>(null);

  // Prospective Cohort Simulator state
  const [simCohortSize, setSimCohortSize] = useState<number>(60);
  const [simPlacementRate, setSimPlacementRate] = useState<number>(80);
  const [simAvgSalary, setSimAvgSalary] = useState<number>(28000);

  const load = async () => {
    const instId = instituteApi.getInstitutionId(user);
    if (!instId) {
      setLoading(false);
      setError('No institution is linked to this account.');
      return;
    }
    setLoading(true);
    setError(null);
    setInsufficientDataNotice(null);

    try {
      const res = await instituteApi.getROI(instId);
      if (Array.isArray(res)) {
        setScores(res.map((r: any) => ({
          program: r.program,
          roi: r.roi,
          status: 'SUFFICIENT_DATA',
          isSufficientData: true,
        })));
      } else if (res && res.programs) {
        if (!res.isSufficientData) {
          setInsufficientDataNotice(res.message || 'Insufficient data for reliable ROI calculation (minimum cohort size of 5 required).');
        }
        setScores(res.programs || []);
      } else {
        setScores([]);
      }
    } catch (err: any) {
      const msg = err?.response?.status === 404
        ? 'No ROI analysis is available for this institution yet.'
        : 'Unable to load the ROI analysis. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user?.institutionId, user?._id, user?.id]);

  const validScores = scores.filter((p) => p.roi !== null && p.roi !== undefined && (p.status !== 'INSUFFICIENT_DATA'));
  const totalOutput = validScores.reduce((sum, p) => sum + (p.roi || 0), 0);
  const avgMultiplier = validScores.length ? (totalOutput / validScores.length).toFixed(1) : '0';

  const chartData = validScores.map((p) => ({
    name: p.program.split(' ').slice(0, 2).join(' '),
    roi: p.roi,
  }));

  // Simulator calculation
  const simPlacedCount = Math.round((simCohortSize * simPlacementRate) / 100);
  const baselineMonthly = 10000;
  const simAnnualUplift = simPlacedCount * (simAvgSalary - baselineMonthly) * 12;
  const unitCostNorm = 25000;
  const simTotalCost = simCohortSize * unitCostNorm;
  const simThreeYearReturn = simAnnualUplift * 3;
  const simMultiplier = simTotalCost > 0 ? (simThreeYearReturn / simTotalCost).toFixed(1) : '0';

  const handleExportDossier = () => {
    if (scores.length === 0) return;
    const report = {
      title: 'Institutional ROI & Vocational Wage Impact Analysis',
      generatedAt: new Date().toISOString(),
      metrics: {
        programCount: scores.length,
        avgRoiMultiplier: `${avgMultiplier}x`,
        cumulativeRoi: `${totalOutput.toFixed(1)}x`,
      },
      programs: scores,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `institutional_roi_impact_report_${Date.now()}.json`;
    a.click();
    toast.success('Official ROI Impact Dossier (JSON) exported!');
  };

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
              <AIBadge type="nsqf" label="VOCATIONAL FISCAL GOVERNANCE" />
              <AIBadge type="verified" label="DYNAMIC LONGITUDINAL ROI" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Institutional Return-on-Investment <span style={{ color: 'var(--gold)' }}>&amp; Wage Yield</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Quantitative longitudinal analysis of vocational outcomes, wage gains above baseline, and fiscal multipliers.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleExportDossier}
              disabled={scores.length === 0}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <FileDown size={14} /> Export Fiscal Dossier
            </button>
            <button
              type="button"
              onClick={load}
              className="btn-secondary"
              style={{ fontSize: 12.5, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <RefreshCw size={13} className={loading ? 'spin' : ''} />
            </button>
          </div>
        </div>

        {/* ── Insufficient Data Alert ── */}
        {insufficientDataNotice && (
          <div
            className="card-linear"
            style={{
              padding: '16px 20px',
              borderRadius: 12,
              marginBottom: 20,
              background: 'rgba(245,158,11,0.06)',
              border: '1px solid rgba(245,158,11,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Info size={20} color="var(--gold)" />
            <p style={{ fontSize: 13, color: '#f8fafc', margin: 0 }}>
              <strong>Statistical Boundary Notice:</strong> {insufficientDataNotice}
            </p>
          </div>
        )}

        {/* ── Loading state ── */}
        {loading && (
          <div className="card-linear" style={{ padding: 32, borderRadius: 14, textAlign: 'center' }}>
            <RefreshCw size={26} style={{ color: 'var(--gold)', animation: 'spin 1.5s linear infinite', marginBottom: 8 }} />
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Calculating dynamic longitudinal ROI...</p>
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

        {/* ── Empty state ── */}
        {!loading && !error && scores.length === 0 && (
          <div className="card-linear" style={{ padding: 40, borderRadius: 14, textAlign: 'center' }}>
            <School size={36} style={{ color: 'var(--text-muted)', marginBottom: 10 }} />
            <p style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', margin: '0 0 6px' }}>
              No ROI analysis available yet
            </p>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, maxWidth: 520, lineHeight: 1.6, display: 'inline-block' }}>
              Program-level return-on-investment figures will be dynamically calculated once verified placement and wage data is associated with your cohort programs.
            </p>
          </div>
        )}

        {!loading && !error && scores.length > 0 && (
          <>
            {/* ── Metric Scorecards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
              {[
                { label: 'Avg Economic Multiplier', value: `${avgMultiplier}x ROI`, sub: '3-year cumulative yield ratio', color: 'var(--gold)', icon: TrendingUp },
                { label: 'Programs Evaluated', value: `${scores.length}`, sub: 'Tracked vocational tracks', color: 'var(--gold)', icon: Users },
                { label: 'Cumulative Yield', value: `${totalOutput.toFixed(1)}x`, sub: 'Total measured program ROI', color: '#10b981', icon: TrendingUp },
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

            {/* ── ROI Chart ── */}
            {validScores.length > 0 && (
              <div className="card-linear" style={{ padding: 22, borderRadius: 16, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h3 className="font-display" style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                      Program Economic Multiplier (3-Year Fiscal ROI)
                    </h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Calculated from real placed wages versus state standard training cost (₹25,000 unit cost norm).
                    </p>
                  </div>
                </div>

                <div style={{ height: 260, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10.5 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10.5 }} unit="x" />
                      <Tooltip
                        contentStyle={{
                          background: '#0f111a',
                          border: '1px solid rgba(245,158,11,0.3)',
                          borderRadius: 8,
                          fontSize: 12,
                          color: '#fff',
                        }}
                      />
                      <Bar dataKey="roi" fill="var(--gold)" radius={[4, 4, 0, 0]} name="ROI Multiplier (x)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* ── Prospective Cohort Fiscal Yield Simulator ── */}
            <div className="card-accent" style={{ padding: 24, borderRadius: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Calculator size={18} color="var(--gold)" />
                <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Interactive Cohort Fiscal Yield Simulator
                </h3>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 16px', lineHeight: 1.6 }}>
                Simulate state-level economic value creation for prospective training cohorts. Calibrate batch volume, target placement rate, and projected wages to estimate total cumulative economic yield.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>
                    Cohort Enrolled (Trainees): {simCohortSize}
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={200}
                    step={5}
                    value={simCohortSize}
                    onChange={(e) => setSimCohortSize(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--gold)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>
                    Target Placement Rate: {simPlacementRate}%
                  </label>
                  <input
                    type="range"
                    min={30}
                    max={100}
                    step={5}
                    value={simPlacementRate}
                    onChange={(e) => setSimPlacementRate(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--gold)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>
                    Projected Wage: ₹{simAvgSalary.toLocaleString('en-IN')}/mo
                  </label>
                  <input
                    type="range"
                    min={15000}
                    max={60000}
                    step={1000}
                    value={simAvgSalary}
                    onChange={(e) => setSimAvgSalary(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--gold)' }}
                  />
                </div>
              </div>

              {/* Simulation Result Outputs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Projected Placed</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc' }}>{simPlacedCount} Candidates</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Annual Wage Uplift</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>₹{(simAnnualUplift / 100000).toFixed(2)} Lakhs</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>3-Year Economic Yield</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold)' }}>₹{(simThreeYearReturn / 100000).toFixed(2)} Lakhs</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Projected Fiscal Multiplier</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#60a5fa' }}>{simMultiplier}x ROI</div>
                </div>
              </div>
            </div>

            {/* ── Detailed Program ROI Table ── */}
            <div className="card-linear" style={{ padding: 24, borderRadius: 16 }}>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: '0 0 16px' }}>
                Program ROI &amp; Longitudinal Wage Ledger
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11.5, textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px 12px' }}>Program</th>
                      <th style={{ padding: '10px 12px' }}>Enrolled Cohort</th>
                      <th style={{ padding: '10px 12px' }}>Placed</th>
                      <th style={{ padding: '10px 12px' }}>Avg Salary</th>
                      <th style={{ padding: '10px 12px' }}>Annual Uplift</th>
                      <th style={{ padding: '10px 12px' }}>3-Year ROI Multiplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((p, idx) => {
                      const isInsufficient = p.status === 'INSUFFICIENT_DATA' || p.roi === null;
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '12px', fontWeight: 700, color: '#f8fafc' }}>
                            {p.program}
                          </td>
                          <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                            {p.sampleSize ?? '—'}
                          </td>
                          <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                            {p.placedCount ?? '—'}
                          </td>
                          <td style={{ padding: '12px', color: '#f8fafc' }}>
                            {p.avgSalaryMonthly ? `₹${p.avgSalaryMonthly.toLocaleString('en-IN')}/mo` : '—'}
                          </td>
                          <td style={{ padding: '12px', color: '#10b981' }}>
                            {p.annualWageUplift ? `+₹${p.annualWageUplift.toLocaleString('en-IN')}` : '—'}
                          </td>
                          <td style={{ padding: '12px' }}>
                            {isInsufficient ? (
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  padding: '3px 8px',
                                  borderRadius: 99,
                                  background: 'rgba(245,158,11,0.1)',
                                  color: 'var(--gold)',
                                  border: '1px solid rgba(245,158,11,0.3)',
                                }}
                              >
                                Insufficient Data (N &lt; 3 Placed)
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 800,
                                  padding: '4px 10px',
                                  borderRadius: 99,
                                  background: 'rgba(16,185,129,0.15)',
                                  color: '#10b981',
                                  border: '1px solid rgba(16,185,129,0.3)',
                                }}
                              >
                                {p.roi}x Multiplier
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}
