'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { FadeIn } from '@/components/shared/FadeIn';
import { AIBadge } from '@/components/ui/AIBadge';
import {
  Users,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Bot,
  Send,
  Building,
  Layers,
  Search,
  Filter,
  BarChart3,
  Info,
  X,
  Lock,
  UserCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false });

// ── Types ─────────────────────────────────────────────────────────────────────

interface FunnelStage {
  id: string;
  label: string;
  count: number;
  percent: number;
}

interface FunnelBreakdown {
  totalEnrolled: number;
  completed: number;
  certified: number;
  placed: number;
  salaried: number;
  selfEmployed: number;
  apprenticeship: number;
  retained30d: number;
  retained90d: number;
  retained180d: number;
  retained365d: number;
}

interface DistrictMetric {
  district: string;
  state: string;
  totalTrainees: number;
  isSmallSample: boolean;
  employmentRate: number | null;
  salariedRate: number | null;
  selfEmployedRate: number | null;
  apprenticeshipRate: number | null;
  retention90dRate: number | null;
  verificationRate: number | null;
  medianSalary: number | null;
  statusLabel: string;
}

interface WagePoint {
  milestone: string;
  medianSalary: number;
  verifiedAverage?: number;
}

interface WageSummary {
  avgInitialSalary: number;
  avgCurrentSalary: number;
  wageProgressionPercent: number;
  totalTrackedWithSalary: number;
}

interface ReasonItem {
  reason: string;
  rawReason?: string;
  count: number;
  pct?: number;
}

interface PolicyDirective {
  targetType: string;
  targetName: string;
  confidence: number;
  title: string;
  observation: string;
  recommendedAction: string;
}

interface CopilotResponse {
  answer: string;
  citedMetrics?: Array<{ label: string; value: string }>;
}

const SAMPLE_COPILOT_QUERIES = [
  '⚡ Which districts have high skill certification but low placement?',
  '⚡ What are the primary non-placement barriers in rural clusters?',
  '⚡ Compare wage growth across vocational programs',
  '⚡ How is 90-day job retention trending across Maharashtra?',
];

export default function GovernmentMacroDashboardPage() {
  // ── Core Analytics State (Live Database-Driven) ─────────────────────────
  const [funnelStages, setFunnelStages] = useState<FunnelStage[]>([]);
  const [funnelBreakdown, setFunnelBreakdown] = useState<FunnelBreakdown | null>(null);
  const [districtData, setDistrictData] = useState<DistrictMetric[]>([]);
  const [wageCurve, setWageCurve] = useState<WagePoint[]>([]);
  const [wageSummary, setWageSummary] = useState<WageSummary | null>(null);
  const [barrierData, setBarrierData] = useState<ReasonItem[]>([]);
  const [interventions, setInterventions] = useState<PolicyDirective[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'districts' | 'wages' | 'copilot'>('overview');

  // ── Filter State ────────────────────────────────────────────────────────
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedProgram, setSelectedProgram] = useState<string>('All');
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [programOptions, setProgramOptions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // ── Status State ────────────────────────────────────────────────────────
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ── AI Policy Copilot State ─────────────────────────────────────────────
  const [copilotQuery, setCopilotQuery] = useState<string>('');
  const [copilotLoading, setCopilotLoading] = useState<boolean>(false);
  const [copilotResponse, setCopilotResponse] = useState<CopilotResponse | null>(null);

  // ── Data Fetching Logic ─────────────────────────────────────────────────
  const loadDashboardData = useCallback(async (district = selectedDistrict, program = selectedProgram) => {
    setLoading(true);
    setError(null);

    try {
      const outcomeParams: Record<string, string> = {};
      if (district && district !== 'All') outcomeParams.district = district;
      if (program && program !== 'All') outcomeParams.program = program;

      const [fRes, dRes, wRes, bRes, iRes] = await Promise.all([
        api.get('/outcomes/funnel', { params: outcomeParams }).catch((e) => ({ error: e })),
        api.get('/outcomes/districts', { params: district && district !== 'All' ? { district } : {} }).catch((e) => ({ error: e })),
        api.get('/outcomes/wage-progression', { params: district && district !== 'All' ? { district } : {} }).catch((e) => ({ error: e })),
        api.get('/outcomes/relevance-and-gaps', { params: district && district !== 'All' ? { district } : {} }).catch((e) => ({ error: e })),
        api.get('/ai/interventions').catch((e) => ({ error: e })),
      ]);

      let hasSuccess = false;

      // 1. Funnel Pipeline
      if ('data' in fRes && fRes.data?.success && fRes.data.data) {
        setFunnelStages(fRes.data.data.stages || []);
        setFunnelBreakdown(fRes.data.data.breakdown || null);
        hasSuccess = true;
      }

      // 2. District Drill-down
      if ('data' in dRes && dRes.data?.success && Array.isArray(dRes.data.data)) {
        setDistrictData(dRes.data.data);
        // Extract distinct districts for dropdown filter if not yet populated
        setDistrictOptions((prev) => {
          if (prev.length > 0) return prev;
          const unique = Array.from(new Set(dRes.data.data.map((d: any) => d.district).filter(Boolean))) as string[];
          return unique.sort();
        });
        hasSuccess = true;
      }

      // 3. Wage Progression
      if ('data' in wRes && wRes.data?.success && wRes.data.data) {
        setWageCurve(wRes.data.data.progressionCurve || []);
        setWageSummary(wRes.data.data.summary || null);
        // Extract program list for course filter
        if (Array.isArray(wRes.data.data.courseBreakdown)) {
          setProgramOptions((prev) => {
            if (prev.length > 0) return prev;
            const progs = wRes.data.data.courseBreakdown.map((c: any) => c.program).filter(Boolean);
            return Array.from(new Set(progs)) as string[];
          });
        }
        hasSuccess = true;
      }

      // 4. Barriers & Attrition Reasons
      if ('data' in bRes && bRes.data?.success && bRes.data.data) {
        const rawBarriers = bRes.data.data.nonPlacementReasons || [];
        const total = rawBarriers.reduce((acc: number, item: any) => acc + (item.count || 0), 0);
        const formatted = rawBarriers.map((item: any) => ({
          ...item,
          pct: total > 0 ? Math.round((item.count / total) * 100) : 0,
        }));
        setBarrierData(formatted);
        hasSuccess = true;
      }

      // 5. Active Policy Interventions
      if ('data' in iRes && iRes.data?.success && Array.isArray(iRes.data.data)) {
        setInterventions(iRes.data.data);
        hasSuccess = true;
      }

      if (!hasSuccess) {
        setError('Unable to synchronize live state skilling telemetry. Please verify backend connectivity.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load government analytics data.');
      toast.error('Telemetry synchronization failed');
    } finally {
      setLoading(false);
    }
  }, [selectedDistrict, selectedProgram]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // ── Initial Grounded Policy Copilot Summary ─────────────────────────────
  useEffect(() => {
    let isMounted = true;
    api
      .post('/ai/policy-copilot', { query: 'Summarize key skilling outcome trends and retention in Maharashtra' })
      .then((res) => {
        if (isMounted && res.data?.success && res.data.data) {
          setCopilotResponse(res.data.data);
        }
      })
      .catch(() => {
        // Leave null; user can trigger query manually
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // ── District / Program Filter Handlers ──────────────────────────────────
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedDistrict(val);
    loadDashboardData(val, selectedProgram);
  };

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedProgram(val);
    loadDashboardData(selectedDistrict, val);
  };

  const handleResetFilters = () => {
    setSelectedDistrict('All');
    setSelectedProgram('All');
    loadDashboardData('All', 'All');
  };

  // ── Copilot Query Handler ───────────────────────────────────────────────
  const handleCopilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim() || copilotLoading) return;
    setCopilotLoading(true);

    try {
      const res = await api.post('/ai/policy-copilot', { query: copilotQuery.trim() });
      if (res.data?.success && res.data.data) {
        setCopilotResponse(res.data.data);
      } else {
        setCopilotResponse({
          answer: 'The Policy Copilot was unable to synthesize an evidence-grounded answer for this query.',
          citedMetrics: [],
        });
      }
    } catch (err: any) {
      toast.error('AI Policy Copilot service is currently unavailable.');
      setCopilotResponse({
        answer: 'Policy Copilot service is temporarily unreachable. Please check backend connection or try again shortly.',
        citedMetrics: [],
      });
    } finally {
      setCopilotLoading(false);
    }
  };

  // ── Filtered District Table Data ────────────────────────────────────────
  const filteredDistricts = useMemo(() => {
    return districtData.filter((d) =>
      d.district.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [districtData, searchTerm]);

  // ── Calculated KPI Values from Real Backend Responses ───────────────────
  const totalTraineesDisplay = useMemo(() => {
    if (loading) return '...';
    if (!funnelBreakdown || funnelBreakdown.totalEnrolled === 0) return 'Insufficient data';
    return funnelBreakdown.totalEnrolled.toLocaleString('en-IN');
  }, [loading, funnelBreakdown]);

  const placementRateDisplay = useMemo(() => {
    if (loading) return '...';
    if (!funnelBreakdown || funnelBreakdown.totalEnrolled === 0) return 'N/A';
    const rate = Math.round((funnelBreakdown.placed / funnelBreakdown.totalEnrolled) * 100);
    return `${rate}%`;
  }, [loading, funnelBreakdown]);

  const retentionRateDisplay = useMemo(() => {
    if (loading) return '...';
    if (!funnelBreakdown || funnelBreakdown.placed === 0) return 'N/A';
    const rate = Math.round((funnelBreakdown.retained90d / funnelBreakdown.placed) * 100);
    return `${rate}%`;
  }, [loading, funnelBreakdown]);

  const wageGrowthDisplay = useMemo(() => {
    if (loading) return '...';
    if (!wageSummary || wageSummary.avgInitialSalary === 0) return 'Insufficient data';
    const pct = wageSummary.wageProgressionPercent;
    return pct >= 0 ? `+${pct}%` : `${pct}%`;
  }, [loading, wageSummary]);

  const isFiltered = selectedDistrict !== 'All' || selectedProgram !== 'All';

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1140, margin: '0 auto', paddingBottom: 60 }}>
        {/* ── State Authority Header Banner ── */}
        <div
          className="card-accent"
          style={{
            padding: 24,
            borderRadius: 16,
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ flex: '1 1 500px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ flexShrink: 0, marginTop: 2 }} className="hidden sm:block">
              <img
                src="/images/brand/maharashtra-seal-emblem.svg"
                alt="Government of Maharashtra Official Emblem"
                style={{ width: 54, height: 54, borderRadius: '50%', boxShadow: '0 4px 16px rgba(245,158,11,0.25)' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <AIBadge type="nsqf" label="GOVERNMENT OF MAHARASHTRA" />
                <AIBadge type="verified" label="LONGITUDINAL COCKPIT · SIH26135" />
                {isFiltered && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'var(--gold)',
                      background: 'rgba(245,158,11,0.12)',
                      padding: '2px 8px',
                      borderRadius: 4,
                      border: '1px solid var(--gold-border)',
                    }}
                  >
                    FILTER ACTIVE
                  </span>
                )}
              </div>
              <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                State Longitudinal Skilling & <span style={{ color: 'var(--gold)' }}>Outcome Cockpit</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 6, lineHeight: 1.5, maxWidth: 720 }}>
                Live, database-grounded outcome intelligence tracking candidate transition from enrollment to 365-day retention, verified wage progression, and district skill deficits.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => loadDashboardData(selectedDistrict, selectedProgram)}
              disabled={loading}
              className="btn-gold"
              aria-label="Refresh telemetry data from backend"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 18px',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Synchronizing...' : 'Sync Telemetry'}</span>
            </button>
          </div>
        </div>

        {/* ── Filter Bar: District & Cohort Program Controls ── */}
        <div
          className="card-linear"
          style={{
            padding: '14px 20px',
            borderRadius: 12,
            marginBottom: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 12, fontWeight: 700 }}>
              <Filter size={14} color="var(--gold)" />
              <span>MACRO FILTERS:</span>
            </div>

            {/* District Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <label htmlFor="district-select" style={{ fontSize: 12, color: '#94a3b8' }}>
                District:
              </label>
              <select
                id="district-select"
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={loading}
                style={{
                  background: 'var(--bg-input, #0f111a)',
                  color: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  padding: '5px 10px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <option value="All">All Maharashtra Districts</option>
                {districtOptions.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Program / Cohort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <label htmlFor="program-select" style={{ fontSize: 12, color: '#94a3b8' }}>
                Program:
              </label>
              <select
                id="program-select"
                value={selectedProgram}
                onChange={handleProgramChange}
                disabled={loading}
                style={{
                  background: 'var(--bg-input, #0f111a)',
                  color: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  padding: '5px 10px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  maxWidth: 240,
                }}
              >
                <option value="All">All Skilling Programs</option>
                {programOptions.map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11.5,
                  padding: '4px 8px',
                  borderRadius: 6,
                  background: 'rgba(239,68,68,0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239,68,68,0.25)',
                  cursor: 'pointer',
                }}
              >
                <X size={12} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
            {selectedDistrict !== 'All' ? `Target District: ${selectedDistrict}` : 'Statewide Maharashtra Cohort'}
          </div>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 10,
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 13,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => loadDashboardData(selectedDistrict, selectedProgram)}
              style={{
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 4,
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Cockpit Progressive Disclosure Navigation Tabs ── */}
        <div
          className="no-scrollbar touch-pan-x"
          style={{
            display: 'flex',
            gap: 8,
            borderBottom: '1px solid var(--border)',
            paddingBottom: 2,
            marginBottom: 24,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {[
            { key: 'overview', label: 'Executive Summary', icon: Layers },
            { key: 'districts', label: 'District Intelligence & Pipeline', icon: Building, badge: districtData.length ? `${districtData.length} Districts` : undefined },
            { key: 'wages', label: 'Wage Progression & Barriers', icon: TrendingUp },
            { key: 'copilot', label: 'AI Policy Copilot & Directives', icon: Bot, badge: 'AI' },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key as any)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px 8px 0 0',
                  border: 'none',
                  borderBottom: `2px solid ${isActive ? 'var(--gold)' : 'transparent'}`,
                  background: isActive ? 'rgba(245,158,11,0.08)' : 'transparent',
                  color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={15} />
                <span>{t.label}</span>
                {t.badge && (
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: isActive ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)',
                      color: isActive ? 'var(--gold)' : 'var(--text-muted)',
                    }}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* ── TAB 1: EXECUTIVE SUMMARY ────────────────────────────────────────── */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div>
            {/* Top 4 Live KPI Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 14 }}>
              {/* Card 1: Total Enrolled */}
              <div className="card-kpi card-interactive" style={{ padding: '18px 20px', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Tracked Trainees
                  </span>
                  <div className="card-icon-container" style={{ width: 32, height: 32, background: 'var(--gold-muted)', border: '1px solid var(--gold-border)', color: 'var(--gold)' }}>
                    <Users size={16} />
                  </div>
                </div>
                <div className="font-display" style={{ fontSize: 26, fontWeight: 800, color: 'var(--gold)', letterSpacing: '-0.02em' }}>
                  {totalTraineesDisplay}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {funnelBreakdown
                    ? `${funnelBreakdown.certified.toLocaleString()} Certified (${funnelBreakdown.completed} Completed)`
                    : 'Real-time state enrollment ledger'}
                </div>
              </div>

              {/* Card 2: Placement / Transition Rate */}
              <div className="card-kpi card-interactive" style={{ padding: '18px 20px', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    State Transition Rate
                  </span>
                  <div className="card-icon-container" style={{ width: 32, height: 32, background: 'var(--success-bg)', border: '1px solid var(--success-border)', color: 'var(--success)' }}>
                    <Briefcase size={16} />
                  </div>
                </div>
                <div className="font-display" style={{ fontSize: 26, fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.02em' }}>
                  {placementRateDisplay}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {funnelBreakdown
                    ? `${funnelBreakdown.placed.toLocaleString()} Placed / Transitioned`
                    : 'No placement records'}
                </div>
              </div>

              {/* Card 3: 90-Day Retention */}
              <div className="card-kpi card-interactive" style={{ padding: '18px 20px', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    90-Day Retention
                  </span>
                  <div className="card-icon-container" style={{ width: 32, height: 32, background: 'var(--info-bg)', border: '1px solid var(--info-border)', color: 'var(--info)' }}>
                    <ShieldCheck size={16} />
                  </div>
                </div>
                <div className="font-display" style={{ fontSize: 26, fontWeight: 800, color: 'var(--info)', letterSpacing: '-0.02em' }}>
                  {retentionRateDisplay}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {funnelBreakdown
                    ? `${funnelBreakdown.retained90d.toLocaleString()} Verified Retained at 90d`
                    : 'Surveys pending response'}
                </div>
              </div>

              {/* Card 4: Wage Growth */}
              <div className="card-kpi card-interactive" style={{ padding: '18px 20px', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Median Salary Growth
                  </span>
                  <div className="card-icon-container" style={{ width: 32, height: 32, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', color: '#a855f7' }}>
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#a855f7', letterSpacing: '-0.02em' }}>
                  {wageGrowthDisplay}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {wageSummary && wageSummary.avgInitialSalary > 0
                    ? `₹${wageSummary.avgInitialSalary.toLocaleString('en-IN')} → ₹${wageSummary.avgCurrentSalary.toLocaleString('en-IN')}/mo`
                    : 'No verified compensation data'}
                </div>
              </div>
            </div>

            {/* Granular Outcome Breakdown Bar */}
            {funnelBreakdown && (
              <div
                className="card-linear"
                style={{
                  padding: '12px 18px',
                  borderRadius: 10,
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  background: 'rgba(255,255,255,0.02)',
                  fontSize: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, color: '#94a3b8' }}>Employment Modalities:</span>
                  <span style={{ color: '#f8fafc' }}>
                    Salaried: <strong>{funnelBreakdown.salaried}</strong>
                  </span>
                  <span style={{ color: 'var(--gold)' }}>
                    Self-Employed: <strong>{funnelBreakdown.selfEmployed}</strong>
                  </span>
                  <span style={{ color: '#60a5fa' }}>
                    Apprenticeship: <strong>{funnelBreakdown.apprenticeship}</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, color: '#94a3b8' }}>Retention Milestones:</span>
                  <span style={{ color: '#cbd5e1' }}>
                    30d: <strong>{funnelBreakdown.retained30d}</strong>
                  </span>
                  <span style={{ color: '#10b981' }}>
                    90d: <strong>{funnelBreakdown.retained90d}</strong>
                  </span>
                  <span style={{ color: '#60a5fa' }}>
                    180d: <strong>{funnelBreakdown.retained180d}</strong>
                  </span>
                  <span style={{ color: '#a855f7' }}>
                    365d: <strong>{funnelBreakdown.retained365d}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Priority Directives Summary Banner */}
            <div
              className="card-accent"
              style={{
                padding: '22px 24px',
                borderRadius: 14,
                marginBottom: 24,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
                borderLeft: '4px solid var(--gold)',
              }}
            >
              <div style={{ maxWidth: 680 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <AIBadge type="ai" label="PRIORITY POLICY TAKEAWAY" />
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                    State Workforce Telemetry
                  </span>
                </div>
                <h3 className="font-display" style={{ fontSize: 16.5, fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
                  {interventions[0]?.title || 'Evidence-Based Vocational Directives Active'}
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {interventions[0]?.observation || 'Longitudinal outcome tracking reveals rural clusters benefit most from apprenticeship subsidies. Review district breakdown or query AI Policy Copilot for targeted resource allocation.'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('copilot')}
                  className="btn-gold"
                  style={{ fontSize: 12.5, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Bot size={15} /> Open Policy Copilot
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('districts')}
                  className="btn-secondary"
                  style={{ fontSize: 12.5, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Building size={15} /> District Drill-down
                </button>
              </div>
            </div>

            {/* Quick Action Navigation Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              <div
                onClick={() => setActiveTab('districts')}
                className="card-linear hover:border-gold"
                style={{ padding: 20, borderRadius: 12, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}
              >
                <div>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(245,158,11,0.1)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                    <Building size={17} />
                  </div>
                  <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#f8fafc', margin: '0 0 4px' }}>
                    District Telemetry & Pipeline
                  </h4>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    Inspect individual district performance, 9-stage conversion funnels, and DPDP-protected metrics.
                  </p>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>Explore Districts</span>
                  <ArrowRight size={13} />
                </div>
              </div>

              <div
                onClick={() => setActiveTab('wages')}
                className="card-linear hover:border-gold"
                style={{ padding: 20, borderRadius: 12, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}
              >
                <div>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(168,85,247,0.1)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                    <TrendingUp size={17} />
                  </div>
                  <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#f8fafc', margin: '0 0 4px' }}>
                    Longitudinal Wage Analytics
                  </h4>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    Track verified candidate wage curves from 30 days to 365 days across vocational cohorts.
                  </p>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>View Wage Curves</span>
                  <ArrowRight size={13} />
                </div>
              </div>

              <div
                onClick={() => setActiveTab('copilot')}
                className="card-linear hover:border-gold"
                style={{ padding: 20, borderRadius: 12, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}
              >
                <div>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                    <Bot size={17} />
                  </div>
                  <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#f8fafc', margin: '0 0 4px' }}>
                    AI Policy Directives
                  </h4>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    Interact with grounded telemetry queries and evaluate {interventions.length} active policy interventions.
                  </p>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>Ask Policy Copilot</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* ── TAB 2: DISTRICT INTELLIGENCE & PIPELINE ─────────────────────────── */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'districts' && (
          <div>
            {/* Visual Section: Maharashtra 9-Stage Longitudinal Outcome Pipeline */}
            <div className="card-linear" style={{ padding: 24, borderRadius: 14, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid var(--border)', paddingBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Layers size={17} color="var(--gold)" /> Maharashtra Longitudinal Conversion Pipeline
                  </h2>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>
                    Live skilling conversion progression from candidate enrollment to 365-day employment retention.
                  </p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.12)', padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(16,185,129,0.25)' }}>
                  Live Telemetry Pipeline
                </span>
              </div>

              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: 8 }}>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} style={{ height: 75, background: 'rgba(255,255,255,0.03)', borderRadius: 10 }} />
                  ))}
                </div>
              ) : funnelStages.length === 0 ? (
                <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  No longitudinal stage progression data available for this filter.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: 8 }}>
                  {funnelStages.map((st) => (
                    <div
                      key={st.id}
                      style={{
                        padding: 12,
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: 10,
                        border: '1px solid var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 8,
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={st.label}>
                        {st.label}
                      </div>
                      <div className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc' }}>
                        {typeof st.count === 'number' ? st.count.toLocaleString() : st.count}
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${Math.min(100, Math.max(8, st.percent))}%`,
                            height: '100%',
                            background: 'var(--gold)',
                            borderRadius: 2,
                          }}
                        />
                      </div>
                      <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--gold)', textAlign: 'right' }}>
                        {st.percent}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* District Intelligence Table */}
            <div className="card-linear" style={{ padding: 24, borderRadius: 14, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Building size={17} color="var(--gold)" /> Maharashtra District Intelligence Drill-down
                  </h2>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '3px 0 0' }}>
                    District-level skilling telemetry with automatic DPDP Act small-sample privacy protection (N &lt; 5).
                  </p>
                </div>

                <div style={{ position: 'relative', width: 240 }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter district..."
                    aria-label="Filter district"
                    style={{
                      width: '100%',
                      padding: '7px 12px 7px 32px',
                      borderRadius: 6,
                      background: 'var(--bg-input, #0f111a)',
                      border: '1px solid var(--border)',
                      color: '#fff',
                      fontSize: 12,
                    }}
                  />
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.04em' }}>
                      <th style={{ padding: '10px 12px' }}>District Cluster</th>
                      <th style={{ padding: '10px 12px' }}>Trainees</th>
                      <th style={{ padding: '10px 12px' }}>Placement Rate</th>
                      <th style={{ padding: '10px 12px' }}>90-Day Retention</th>
                      <th style={{ padding: '10px 12px' }}>Median Salary</th>
                      <th style={{ padding: '10px 12px' }}>Employer Verified</th>
                      <th style={{ padding: '10px 12px' }}>Data Reliability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                          Loading district intelligence...
                        </td>
                      </tr>
                    ) : filteredDistricts.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                          No district telemetry records found matching your filter.
                        </td>
                      </tr>
                    ) : (
                      filteredDistricts.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s ease' }}>
                          <td style={{ padding: '12px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: row.isSmallSample ? '#ef4444' : 'var(--gold)' }} />
                            {row.district}
                          </td>
                          <td style={{ padding: '12px', fontFamily: 'monospace', color: '#cbd5e1' }}>
                            {row.totalTrainees.toLocaleString()}
                          </td>
                          <td style={{ padding: '12px', fontWeight: 800 }}>
                            {row.isSmallSample ? (
                              <span style={{ color: '#94a3b8', fontSize: 11 }} title="Suppressed under DPDP Act privacy guidelines (N < 5)">
                                Insufficient Data
                              </span>
                            ) : (
                              <span style={{ color: '#10b981' }}>{row.employmentRate}%</span>
                            )}
                          </td>
                          <td style={{ padding: '12px', fontWeight: 700 }}>
                            {row.isSmallSample ? (
                              <span style={{ color: '#94a3b8', fontSize: 11 }}>N/A</span>
                            ) : (
                              <span style={{ color: '#60a5fa' }}>{row.retention90dRate}%</span>
                            )}
                          </td>
                          <td style={{ padding: '12px', fontFamily: 'monospace' }}>
                            {row.isSmallSample || !row.medianSalary ? (
                              <span style={{ color: '#94a3b8', fontSize: 11 }}>N/A</span>
                            ) : (
                              <span style={{ color: '#f8fafc' }}>₹{row.medianSalary.toLocaleString('en-IN')}/mo</span>
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>
                            {row.isSmallSample ? (
                              <span style={{ color: '#94a3b8', fontSize: 11 }}>N/A</span>
                            ) : (
                              <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{row.verificationRate}% Verified</span>
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span
                              style={{
                                fontSize: 10.5,
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: 4,
                                background: row.isSmallSample ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                                color: row.isSmallSample ? '#ef4444' : '#10b981',
                                border: `1px solid ${row.isSmallSample ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}`,
                              }}
                            >
                              {row.statusLabel}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* ── TAB 3: WAGE PROGRESSION & ATTRITION ─────────────────────────────── */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'wages' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20, marginBottom: 24 }}>
            {/* Wage Progression Curve */}
            <div className="card-linear" style={{ padding: 22, borderRadius: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TrendingUp size={16} color="var(--gold)" /> Longitudinal Wage Progression Curve
                </h3>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: wageSummary && wageSummary.wageProgressionPercent >= 0 ? '#10b981' : '#94a3b8' }}>
                  {wageSummary && wageSummary.avgInitialSalary > 0
                    ? `${wageSummary.wageProgressionPercent >= 0 ? `+${wageSummary.wageProgressionPercent}%` : `${wageSummary.wageProgressionPercent}%`} Average Growth`
                    : 'No Wage Data'}
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
                Traces verified candidate salary evolution from initial placement across {wageSummary?.totalTrackedWithSalary || 0} tracked salary histories.
              </p>

              {loading ? (
                <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  Loading salary curve...
                </div>
              ) : wageCurve.length === 0 ? (
                <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  No wage progression data available for this selection.
                </div>
              ) : (
                <div style={{ height: 240, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={wageCurve}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="milestone" stroke="#64748b" fontSize={11} tick={{ fill: '#94a3b8' }} />
                      <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} tick={{ fill: '#94a3b8' }} />
                      <Tooltip
                        contentStyle={{ background: '#090A0F', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', fontSize: 12 }}
                        formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}/mo`, 'Median Salary']}
                      />
                      <Line
                        type="monotone"
                        dataKey="medianSalary"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        dot={{ fill: '#f59e0b', r: 4 }}
                        name="Median Salary (INR)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Non-Placement Barriers */}
            <div className="card-linear" style={{ padding: 22, borderRadius: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={16} color="#ef4444" /> Non-Placement & Attrition Reason Analysis
                </h3>
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Empirical Barriers</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
                Empirical candidate barriers identified through follow-up surveys and placement logs.
              </p>

              {loading ? (
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  Loading barrier analysis...
                </div>
              ) : barrierData.length === 0 ? (
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  No candidate non-placement barriers recorded for this cohort.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {barrierData.map((item, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                        <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{item.reason}</span>
                        <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                          {item.count} Cases ({item.pct}%)
                        </span>
                      </div>
                      <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${item.pct}%`,
                            height: '100%',
                            background: '#ef4444',
                            borderRadius: 3,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* ── TAB 4: AI POLICY COPILOT & INTERVENTIONS ────────────────────────── */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'copilot' && (
          <div>
            {/* AI Policy Copilot Interactive Query Panel */}
            <div className="card-linear" style={{ padding: 24, borderRadius: 14, marginBottom: 24, border: '1px solid rgba(245,158,11,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ padding: 8, borderRadius: 8, background: 'var(--gold)', color: '#000' }}>
                    <Bot size={18} />
                  </div>
                  <div>
                    <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                      AI Policy Copilot (Grounded in Verified Telemetry)
                    </h2>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Real-time query engine grounded in the live Maharashtra skilling database.
                    </p>
                  </div>
                </div>
                <AIBadge type="ai" label="AI Recommendation · Grounded" />
              </div>

              <form onSubmit={handleCopilotSubmit} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <input
                  type="text"
                  value={copilotQuery}
                  onChange={(e) => setCopilotQuery(e.target.value)}
                  placeholder="Ask policy questions e.g. 'Which districts have low employment outcomes and why?' or 'Compare wage growth across courses'"
                  aria-label="Policy query input"
                  style={{
                    flex: 1,
                    padding: '11px 16px',
                    borderRadius: 8,
                    background: 'var(--bg-input, #0f111a)',
                    border: '1px solid var(--border)',
                    color: '#fff',
                    fontSize: 13,
                  }}
                />
                <button
                  type="submit"
                  disabled={copilotLoading || !copilotQuery.trim()}
                  className="btn-gold"
                  aria-label="Submit policy query"
                  style={{
                    padding: '10px 20px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: copilotLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexShrink: 0,
                  }}
                >
                  {copilotLoading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                  <span>Analyze</span>
                </button>
              </form>

              {/* Quick Query Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {SAMPLE_COPILOT_QUERIES.map((sq, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const text = sq.replace('⚡ ', '');
                      setCopilotQuery(text);
                    }}
                    style={{
                      fontSize: 11.5,
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border)',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                    }}
                  >
                    {sq}
                  </button>
                ))}
              </div>

              {copilotResponse && (
                <div
                  style={{
                    padding: 16,
                    background: 'rgba(0,0,0,0.35)',
                    borderRadius: 10,
                    border: '1px solid rgba(245,158,11,0.2)',
                  }}
                >
                  <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.6, marginBottom: 12 }}>
                    {copilotResponse.answer}
                  </div>

                  {copilotResponse.citedMetrics && copilotResponse.citedMetrics.length > 0 && (
                    <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>
                        Verified Database Citations:
                      </span>
                      {copilotResponse.citedMetrics.map((cm, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: 11.5,
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: 'rgba(245,158,11,0.1)',
                            color: 'var(--gold)',
                            border: '1px solid var(--gold-border)',
                            fontWeight: 600,
                          }}
                        >
                          {cm.label}: <strong>{cm.value}</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Active Policy Interventions Panel ── */}
            <div className="card-linear" style={{ padding: 24, borderRadius: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid var(--border)', paddingBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sparkles size={17} color="var(--gold)" /> Evidence-Based Policy & Curriculum Directives
                  </h2>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '3px 0 0' }}>
                    AI-generated policy interventions grounded in verified skilling outcome gaps and employer verification telemetry.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AIBadge type="ai" label="AI Policy Directive" />
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
                    {interventions.length} Active Directives
                  </span>
                </div>
              </div>

              {loading ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading policy directives...
                </div>
              ) : interventions.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  No active policy directives registered in the state database.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                  {interventions.map((iv, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: 18,
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 4, background: 'rgba(245,158,11,0.12)', color: 'var(--gold)', border: '1px solid var(--gold-border)' }}>
                            {iv.targetType}: {iv.targetName}
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981', fontFamily: 'monospace' }}>
                            {Math.round(iv.confidence * 100)}% Confidence
                          </span>
                        </div>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', margin: '0 0 6px' }}>{iv.title}</h4>
                        <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>{iv.observation}</p>
                      </div>

                      <div style={{ padding: 12, borderRadius: 8, background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 2 }}>
                          Recommended State Directive:
                        </div>
                        <div style={{ fontSize: 12, color: '#f8fafc', lineHeight: 1.4 }}>{iv.recommendedAction}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}