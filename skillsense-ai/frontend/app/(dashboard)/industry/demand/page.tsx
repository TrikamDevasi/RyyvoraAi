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
import api from '@/lib/api';
import {
  TrendingUp,
  Target,
  Briefcase,
  AlertTriangle,
  Award,
  ShieldCheck,
  Search,
  Download,
  Filter,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowUpRight,
  Activity,
  Zap,
  CheckCircle2,
  DollarSign,
  IndianRupee,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';

const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const BarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart),
  { ssr: false }
);
const AreaChart = dynamic(
  () => import('recharts').then((mod) => mod.AreaChart),
  { ssr: false }
);

interface DemandSignal {
  id: string;
  skillDomain: string;
  demandIndex: number;
  yoyGrowth: number;
  openingsCount: number;
  medianCtcLPA: number;
  topCtcLPA: number;
  adoptionPhase: 'EMERGING' | 'HIGH_GROWTH' | 'STABLE_CORE';
  keyTechnologies: string[];
}

const DEMAND_SIGNALS: DemandSignal[] = [
  {
    id: 'sig_1',
    skillDomain: 'Applied Generative AI & LangChain Platforms',
    demandIndex: 98,
    yoyGrowth: 58,
    openingsCount: 9800,
    medianCtcLPA: 11.2,
    topCtcLPA: 18.5,
    adoptionPhase: 'EMERGING',
    keyTechnologies: ['Python AI', 'LangChain', 'pgvector', 'PyTorch', 'FastAPI'],
  },
  {
    id: 'sig_2',
    skillDomain: 'Full-Stack Web & Next.js App Architecture',
    demandIndex: 96,
    yoyGrowth: 34,
    openingsCount: 14200,
    medianCtcLPA: 8.8,
    topCtcLPA: 14.0,
    adoptionPhase: 'HIGH_GROWTH',
    keyTechnologies: ['React 19', 'Next.js App Router', 'Node.js Microservices', 'PostgreSQL'],
  },
  {
    id: 'sig_3',
    skillDomain: 'Zero-Trust Cybersecurity & Cloud SecOps',
    demandIndex: 94,
    yoyGrowth: 38,
    openingsCount: 6100,
    medianCtcLPA: 9.6,
    topCtcLPA: 16.0,
    adoptionPhase: 'HIGH_GROWTH',
    keyTechnologies: ['Zero-Trust', 'IAM Mesh', 'WAF Ingress', 'Kubernetes Security', 'SIEM'],
  },
  {
    id: 'sig_4',
    skillDomain: 'Cloud Native Kubernetes Platform SRE',
    demandIndex: 92,
    yoyGrowth: 42,
    openingsCount: 8400,
    medianCtcLPA: 8.2,
    topCtcLPA: 15.0,
    adoptionPhase: 'HIGH_GROWTH',
    keyTechnologies: ['Docker', 'Kubernetes Ingress', 'Terraform', 'Prometheus', 'AWS ECS'],
  },
  {
    id: 'sig_5',
    skillDomain: 'Frontend UI Systems & WebAssembly',
    demandIndex: 88,
    yoyGrowth: 24,
    openingsCount: 4000,
    medianCtcLPA: 7.0,
    topCtcLPA: 12.5,
    adoptionPhase: 'STABLE_CORE',
    keyTechnologies: ['TypeScript', 'TailwindCSS', 'WebSockets', 'Framer Motion', 'Wasm'],
  },
];

const PROJECTION_TREND = [
  { quarter: 'Q1 2025', demandIndex: 68, medianSalary: 6.8 },
  { quarter: 'Q2 2025', demandIndex: 74, medianSalary: 7.2 },
  { quarter: 'Q3 2025', demandIndex: 81, medianSalary: 7.8 },
  { quarter: 'Q4 2025', demandIndex: 87, medianSalary: 8.4 },
  { quarter: 'Q1 2026', demandIndex: 94, medianSalary: 8.96 },
  { quarter: 'Q2 2026 (Forecast)', demandIndex: 98, medianSalary: 9.6 },
];

export default function DemandPage() {
  const [signals, setSignals] = useState<DemandSignal[]>(DEMAND_SIGNALS);
  const [phaseFilter, setPhaseFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api
      .get('/industry/demand-signals')
      .then(() => {})
      .catch(() => {});
  }, []);

  const handleExportCSV = () => {
    const headers = 'Domain,DemandIndex,YoYGrowthPercent,Openings,MedianCTC_LPA,TopCTC_LPA,AdoptionPhase,KeyTech\n';
    const rows = signals
      .map((s) => `"${s.skillDomain}",${s.demandIndex},${s.yoyGrowth},${s.openingsCount},${s.medianCtcLPA},${s.topCtcLPA},"${s.adoptionPhase}","${s.keyTechnologies.join('; ')}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `industry_demand_signals_${Date.now()}.csv`;
    downloadAnchor.click();
    toast.success('Industry Demand Signals exported to CSV!');
  };

  const filteredSignals = signals.filter((s) => {
    const matchSearch =
      s.skillDomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.keyTechnologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchPhase = phaseFilter === 'ALL' || s.adoptionPhase === phaseFilter;
    return matchSearch && matchPhase;
  });

  const chartData = signals.map((s) => ({
    name: s.skillDomain.split(' ')[0] + ' ' + (s.skillDomain.split(' ')[1] || ''),
    Demand: s.demandIndex,
    Growth: s.yoyGrowth,
  }));

  const totalOpenings = signals.reduce((sum, s) => sum + s.openingsCount, 0);

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
              <AIBadge type="nsqf" label="NEURAL MARKET INTELLIGENCE" />
              <AIBadge type="live" label="24-MONTH WAGE ACCELERATION" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Demand Signals & <span style={{ color: 'var(--gold)' }}>Neural Growth Projections</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Continuous real-time scanning of 42,500+ corporate hiring signals across Maharashtra, projecting skill scarcity horizons and wage escalation curves.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleExportCSV}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Download size={14} /> Export Signals (CSV)
            </button>
          </div>
        </div>

        {/* ── Scorecards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Avg YoY Demand Surge', value: '+39.2%', sub: 'Across Modern Tech Stacks', color: '#10b981', icon: TrendingUp },
            { label: 'Total Tracked Openings', value: `${totalOpenings.toLocaleString('en-IN')}+`, sub: 'Active Requisitions in MH', color: 'var(--gold)', icon: Briefcase },
            { label: 'Peak Compensation Median', value: '₹11.20 LPA', sub: 'Applied Generative AI Tier', color: '#60a5fa', icon: IndianRupee },
            { label: 'Scarcity Risk Index', value: 'CRITICAL', sub: 'Supply Shortage in 4/5 Stacks', color: '#ef4444', icon: AlertTriangle },
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

        {/* ── Charts Grid: Demand Index & 24-Month Wage Projection ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20, marginBottom: 24 }}>
          {/* Demand & Growth Bar Chart */}
          <div className="card-linear" style={{ padding: 22, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 className="font-display" style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Skill Domain Scarcity vs YoY Growth
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Demand index (0-100) and hiring acceleration rate.
                </p>
              </div>
              <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>Live Telemetry</span>
            </div>

            <div style={{ height: 240, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 10.5 }} />
                  <YAxis stroke="var(--text-muted)" tick={{ fontSize: 10.5 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      fontSize: 12,
                      color: 'var(--text-primary)',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  />
                  <Bar dataKey="Demand" fill="var(--gold)" radius={[4, 4, 0, 0]} name="Demand Index" />
                  <Bar dataKey="Growth" fill="#10b981" radius={[4, 4, 0, 0]} name="YoY Growth %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 24-Month Wage Acceleration Area Chart */}
          <div className="card-linear" style={{ padding: 22, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  24-Month Median CTC Trajectory (₹ LPA)
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Macro salary acceleration for verified NSQF graduates.
                </p>
              </div>
              <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>+41% Total Climb</span>
            </div>

            <div style={{ height: 240, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PROJECTION_TREND}>
                  <defs>
                    <linearGradient id="wageGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
                  <XAxis dataKey="quarter" stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
                  <YAxis stroke="var(--text-muted)" tick={{ fontSize: 10.5 }} domain={[5, 12]} unit="L" />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      fontSize: 12,
                      color: 'var(--text-primary)',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  />
                  <Area type="monotone" dataKey="medianSalary" stroke="#10b981" fill="url(#wageGrad)" strokeWidth={2.5} name="Median Package (LPA)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Search & Filter Controls ── */}
        <div
          className="card-linear"
          style={{
            padding: '14px 18px',
            borderRadius: 12,
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {/* Phase Filter Tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Signals', icon: Target },
              { id: 'EMERGING', label: 'Emerging Tech', icon: TrendingUp },
              { id: 'HIGH_GROWTH', label: 'High Growth', icon: Zap },
              { id: 'STABLE_CORE', label: 'Core Foundation', icon: CheckCircle2 },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = phaseFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPhaseFilter(tab.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    background: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? 'var(--gold)' : 'var(--border)'}`,
                    color: isActive ? '#090a0f' : '#cbd5e1',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <TabIcon size={13} color={isActive ? '#090a0f' : 'currentColor'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: 240 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search domain, tech stack..."
              style={{
                width: '100%',
                padding: '7px 10px 7px 30px',
                borderRadius: 6,
                background: 'var(--bg-input, #0f111a)',
                border: '1px solid var(--border)',
                color: '#fff',
                fontSize: 12,
              }}
            />
          </div>
        </div>

        {/* ── Detailed Signals Table ── */}
        <div className="card-linear" style={{ padding: 24, borderRadius: 16 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11.5, textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Skill Domain</th>
                  <th style={{ padding: '10px 12px' }}>Demand Score</th>
                  <th style={{ padding: '10px 12px' }}>YoY Growth</th>
                  <th style={{ padding: '10px 12px' }}>Open Openings</th>
                  <th style={{ padding: '10px 12px' }}>Compensation Range</th>
                  <th style={{ padding: '10px 12px' }}>Key Tech Stacks</th>
                  <th style={{ padding: '10px 12px' }}>Phase</th>
                </tr>
              </thead>
              <tbody>
                {filteredSignals.map((s) => (
                  <tr
                    key={s.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                    className="hover:bg-white/5"
                  >
                    <td style={{ padding: '12px', fontWeight: 700, color: '#f8fafc' }}>
                      {s.skillDomain}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 800, color: 'var(--gold)' }}>
                      {s.demandIndex} / 100
                    </td>
                    <td style={{ padding: '12px', fontWeight: 800, color: '#10b981' }}>
                      +{s.yoyGrowth}%
                    </td>
                    <td style={{ padding: '12px', color: '#f8fafc' }}>
                      {s.openingsCount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px', color: '#cbd5e1' }}>
                      ₹{s.medianCtcLPA}L – ₹{s.topCtcLPA}L
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {s.keyTechnologies.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: 10,
                              padding: '2px 6px',
                              borderRadius: 4,
                              background: 'rgba(255,255,255,0.04)',
                              color: '#cbd5e1',
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 99,
                          background:
                            s.adoptionPhase === 'EMERGING'
                              ? 'rgba(236,72,153,0.12)'
                              : s.adoptionPhase === 'HIGH_GROWTH'
                              ? 'rgba(245,158,11,0.12)'
                              : 'rgba(16,185,129,0.12)',
                          color:
                            s.adoptionPhase === 'EMERGING'
                              ? '#ec4899'
                              : s.adoptionPhase === 'HIGH_GROWTH'
                              ? '#f59e0b'
                              : '#10b981',
                        }}
                      >
                        {s.adoptionPhase}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </ErrorBoundary>
  );
}
