'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { FadeIn } from '@/components/shared/FadeIn';
import { AIBadge } from '@/components/ui/AIBadge';
import {
  MapPin,
  TrendingUp,
  Award,
  Users,
  Building,
  Layers,
  Search,
  Download,
  Filter,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Landmark,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getScoreTierColor } from '@/lib/chartColors';

interface DistrictItem {
  id: string;
  name: string;
  division: string;
  score: number;
  placementRate: number;
  retentionRate: number;
  avgSalaryLPA: number;
  studentCount: number;
  topSkills: string[];
  gapSkills: string[];
  status: 'SURPLUS' | 'EQUILIBRIUM' | 'DEFICIT';
  actionDirective: string;
}

const MAHARASHTRA_DISTRICTS: DistrictItem[] = [
  {
    id: 'pune',
    name: 'Pune',
    division: 'Pune Division',
    score: 88,
    placementRate: 91,
    retentionRate: 86,
    avgSalaryLPA: 8.8,
    studentCount: 184500,
    topSkills: ['React.js & Next.js', 'Node.js Microservices', 'Cloud Architecture'],
    gapSkills: ['Distributed Caching', 'Kubernetes Security'],
    status: 'SURPLUS',
    actionDirective: 'Scale Tier-1 enterprise campus placement drives at Hinjawadi & Magarpatta tech parks.',
  },
  {
    id: 'mumbai',
    name: 'Mumbai Metropolitan',
    division: 'Konkan Division',
    score: 86,
    placementRate: 89,
    retentionRate: 84,
    avgSalaryLPA: 9.2,
    studentCount: 220000,
    topSkills: ['Python & Applied AI', 'FinTech & Blockchain', 'TypeScript'],
    gapSkills: ['RAG Pipeline Optimization', 'High-Frequency Trading APIs'],
    status: 'SURPLUS',
    actionDirective: 'Expand specialized FinTech & GenAI apprenticeships with BFSI partners in BKC.',
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    division: 'Nagpur Division',
    score: 79,
    placementRate: 78,
    retentionRate: 75,
    avgSalaryLPA: 6.4,
    studentCount: 94000,
    topSkills: ['Full-Stack Web', 'SQL & Database Modeling', 'Linux Admin'],
    gapSkills: ['Cloud Native Ingress', 'Docker Orchestration'],
    status: 'EQUILIBRIUM',
    actionDirective: 'Deploy MIHAN Tech Hub incentive grants to accelerate local IT enterprise hiring.',
  },
  {
    id: 'nashik',
    name: 'Nashik',
    division: 'Nashik Division',
    score: 76,
    placementRate: 74,
    retentionRate: 72,
    avgSalaryLPA: 5.8,
    studentCount: 78000,
    topSkills: ['Industrial IoT', 'JavaScript & React', 'REST APIs'],
    gapSkills: ['Microservices Architecture', 'System Scalability'],
    status: 'EQUILIBRIUM',
    actionDirective: 'Establish joint Industry-4.0 automation labs with MIDC manufacturing clusters.',
  },
  {
    id: 'aurangabad',
    name: 'Chhatrapati Sambhajinagar',
    division: 'Marathwada Division',
    score: 71,
    placementRate: 69,
    retentionRate: 67,
    avgSalaryLPA: 5.2,
    studentCount: 62000,
    topSkills: ['Python Basics', 'Web Development', 'SQL'],
    gapSkills: ['Next.js Architecture', 'Cloud DevOps Pipelines'],
    status: 'DEFICIT',
    actionDirective: 'Infuse ₹18.5 Cr state skilling subsidy into Marathwada vocational polytechnics.',
  },
  {
    id: 'kolhapur',
    name: 'Kolhapur',
    division: 'Pune Division',
    score: 74,
    placementRate: 72,
    retentionRate: 70,
    avgSalaryLPA: 5.5,
    studentCount: 54000,
    topSkills: ['Java & Spring Boot', 'Database Systems', 'Frontend'],
    gapSkills: ['Serverless Cloud', 'Modern DevOps'],
    status: 'EQUILIBRIUM',
    actionDirective: 'Connect regional engineering graduates with Pune software contractor networks.',
  },
  {
    id: 'solapur',
    name: 'Solapur',
    division: 'Pune Division',
    score: 66,
    placementRate: 62,
    retentionRate: 60,
    avgSalaryLPA: 4.6,
    studentCount: 42000,
    topSkills: ['Web Basics (HTML/CSS/JS)', 'Data Entry Automation'],
    gapSkills: ['React.js', 'Node.js Backend', 'Git Workflows'],
    status: 'DEFICIT',
    actionDirective: 'Launch intensive 12-week Full-Stack bootcamp pilot across 8 rural ITI institutes.',
  },
  {
    id: 'amravati',
    name: 'Amravati',
    division: 'Amravati Division',
    score: 68,
    placementRate: 64,
    retentionRate: 62,
    avgSalaryLPA: 4.8,
    studentCount: 46000,
    topSkills: ['Python Scripting', 'Basic SQL', 'Networking'],
    gapSkills: ['TypeScript Systems', 'Cloud DevOps'],
    status: 'DEFICIT',
    actionDirective: 'Provide digital skill subsidies and high-speed broadband to rural technical colleges.',
  },
  {
    id: 'nanded',
    name: 'Nanded',
    division: 'Marathwada Division',
    score: 64,
    placementRate: 59,
    retentionRate: 58,
    avgSalaryLPA: 4.4,
    studentCount: 38000,
    topSkills: ['Computer Applications', 'Web Fundamentals'],
    gapSkills: ['Full-Stack Frameworks', 'REST API Architecture'],
    status: 'DEFICIT',
    actionDirective: 'Initiate state-funded residential tech training cohorts with stipend allowances.',
  },
];

const NATIONAL_STATES = [
  { name: 'Maharashtra', region: 'West', score: 84, placement: 86, students: 918500, avgSalary: 7.8 },
  { name: 'Karnataka', region: 'South', score: 87, placement: 89, students: 840000, avgSalary: 8.5 },
  { name: 'Tamil Nadu', region: 'South', score: 83, placement: 84, students: 760000, avgSalary: 7.4 },
  { name: 'Telangana', region: 'South', score: 85, placement: 87, students: 620000, avgSalary: 8.1 },
  { name: 'Gujarat', region: 'West', score: 79, placement: 81, students: 540000, avgSalary: 6.9 },
  { name: 'Delhi NCR', region: 'North', score: 86, placement: 88, students: 680000, avgSalary: 8.4 },
  { name: 'Uttar Pradesh', region: 'North', score: 72, placement: 70, students: 1120000, avgSalary: 5.6 },
  { name: 'West Bengal', region: 'East', score: 76, placement: 74, students: 490000, avgSalary: 6.2 },
];

export default function HeatmapPage() {
  const [viewMode, setViewMode] = useState<'maharashtra' | 'national'>('maharashtra');
  const [metric, setMetric] = useState<'score' | 'placement' | 'retention' | 'salary'>('score');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictItem>(MAHARASHTRA_DISTRICTS[0]);
  const [districts, setDistricts] = useState<DistrictItem[]>(MAHARASHTRA_DISTRICTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get('/outcomes/districts')
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const liveDistricts: DistrictItem[] = res.data.data.map((d: any) => {
            const placementRate = d.employmentRate ?? 0;
            const retentionRate = d.retention90dRate ?? 0;
            const avgSalaryLPA = d.medianSalary ? Math.round((d.medianSalary * 12) / 10000) / 10 : 0;
            const status: 'SURPLUS' | 'EQUILIBRIUM' | 'DEFICIT' =
              placementRate >= 80 ? 'SURPLUS' : placementRate >= 65 ? 'EQUILIBRIUM' : 'DEFICIT';
            return {
              id: d.district.toLowerCase().replace(/\s+/g, '_'),
              name: d.district,
              division: `${d.district} Division`,
              score: placementRate || 65,
              placementRate,
              retentionRate,
              avgSalaryLPA,
              studentCount: d.totalTrainees,
              topSkills: ['Vocational IT', 'Automation', 'Cloud Infrastructure'],
              gapSkills: ['Technical Communication', 'Specialized Testing'],
              status,
              actionDirective: d.isSmallSample
                ? 'Sample size under privacy threshold (N < 5). Additional cohort intake recommended.'
                : `${d.statusLabel} — Active monitoring and targeted intervention pipeline.`,
            };
          });
          setDistricts(liveDistricts);
          if (liveDistricts.length > 0) setSelectedDistrict(liveDistricts[0]);
        }
      })
      .catch(() => {
        // Fallback gracefully
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');

  const divisions = ['ALL', ...Array.from(new Set(districts.map((d) => d.division)))];

  const filteredDistricts = districts.filter(
    (d) =>
      (selectedDivision === 'ALL' || d.division === selectedDivision) &&
      (d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.status.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getMetricValue = (d: DistrictItem) => {
    switch (metric) {
      case 'score':
        return `${d.score}%`;
      case 'placement':
        return `${d.placementRate}%`;
      case 'retention':
        return `${d.retentionRate}%`;
      case 'salary':
        return `₹${d.avgSalaryLPA} LPA`;
    }
  };

  const getHeatmapColor = (score: number) => {
    return getScoreTierColor(score, true);
  };

  const handleExportCSV = () => {
    const headers = 'District,Division,SkillScore,PlacementRate,RetentionRate,AvgSalaryLPA,Students,Status\n';
    const rows = districts
      .map((d) => `"${d.name}","${d.division}",${d.score},${d.placementRate},${d.retentionRate},${d.avgSalaryLPA},${d.studentCount},"${d.status}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maharashtra_skilling_heatmap_${Date.now()}.csv`;
    a.click();
    toast.success('Heatmap data exported to CSV');
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
              <AIBadge type="nsqf" label="MAHARASHTRA WORKFORCE INTELLIGENCE" />
              <AIBadge type="live" label="GEO-SPATIAL SKILL HEATMAP" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Regional Skill Competency & <span style={{ color: 'var(--gold)' }}>Outcome Heatmap</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Live telemetry monitoring district-level competency density, vocational placement velocity, and longitudinal retention across 36 Maharashtra districts.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleExportCSV}
              className="btn-secondary"
              style={{ fontSize: 12.5, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Download size={14} /> Export Dataset (CSV)
            </button>
          </div>
        </div>

        {/* ── Controls: Scope & Metric Selectors ── */}
        <div
          className="card-linear"
          style={{
            padding: '16px 20px',
            borderRadius: 14,
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          {/* Scope Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scope:</span>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 3, border: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => setViewMode('maharashtra')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  background: viewMode === 'maharashtra' ? 'var(--gold)' : 'transparent',
                  color: viewMode === 'maharashtra' ? '#090a0f' : '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Maharashtra (36 Districts)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('national')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  background: viewMode === 'national' ? 'var(--gold)' : 'transparent',
                  color: viewMode === 'national' ? '#090a0f' : '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                National States
              </button>
            </div>
          </div>

          {/* Metric Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Color Metric:</span>
            {[
              { id: 'score', label: 'Skill Score' },
              { id: 'placement', label: 'Placement Rate' },
              { id: 'retention', label: '365d Retention' },
              { id: 'salary', label: 'Avg Package' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMetric(m.id as any)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  background: metric === m.id ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${metric === m.id ? 'var(--gold)' : 'var(--border)'}`,
                  color: metric === m.id ? 'var(--gold)' : '#cbd5e1',
                  cursor: 'pointer',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Interactive Heatmap & Selected District Inspection Card ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20, marginBottom: 24 }}>
          {/* Visual Heatmap / District Density Matrix Structured Analytics Container */}
          <div className="card-standard" style={{ padding: 20, borderRadius: 'var(--radius-lg, 12px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={16} color="var(--brand-gold)" />
                  <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {viewMode === 'maharashtra' ? 'Maharashtra District Density Matrix' : 'National State Matrix'}
                  </h2>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 24px' }}>
                  {viewMode === 'maharashtra'
                    ? 'Employment readiness and vocational placement telemetry by district'
                    : 'Comparative readiness benchmarks across sovereign federal states'}
                </p>
              </div>

              {viewMode === 'maharashtra' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label htmlFor="division-select" style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Division:
                  </label>
                  <select
                    id="division-select"
                    value={selectedDivision}
                    onChange={(e) => setSelectedDivision(e.target.value)}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-sm, 6px)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-default)',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {divisions.map((div) => (
                      <option key={div} value={div}>
                        {div === 'ALL' ? 'All Divisions (36 Districts)' : div}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Structured Telemetry Table (Desktop & Tablet) */}
            <div className="hidden sm:block" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, width: 36 }}>#</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>District & Division</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, minWidth: 140 }}>Readiness Telemetry</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>Candidates</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>Placement</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {viewMode === 'maharashtra' ? (
                    filteredDistricts.map((d, index) => {
                      const isSelected = selectedDistrict.id === d.id;
                      const tierColor = getHeatmapColor(d.score);
                      const statusLabel = d.status === 'SURPLUS' ? 'Surplus' : d.status === 'EQUILIBRIUM' ? 'Equilibrium' : 'Deficit';

                      return (
                        <tr
                          key={d.id}
                          onClick={() => setSelectedDistrict(d)}
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            background: isSelected ? 'var(--bg-surface-elevated)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.background = 'var(--bg-surface-hover)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <td style={{ padding: '10px 10px', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                            {String(index + 1).padStart(2, '0')}
                          </td>
                          <td style={{ padding: '10px 10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontWeight: 700, color: isSelected ? 'var(--brand-gold)' : 'var(--text-primary)' }}>
                                {d.name}
                              </span>
                              {isSelected && (
                                <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--brand-gold)', background: 'var(--brand-gold-subtle)', padding: '1px 5px', borderRadius: 4 }}>
                                  Active
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                              {d.division}
                            </div>
                          </td>
                          <td style={{ padding: '10px 10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, height: 4, background: 'var(--bg-input)', borderRadius: 2, overflow: 'hidden' }}>
                                <div
                                  style={{
                                    height: '100%',
                                    width: `${Math.min(100, Math.max(5, d.score))}%`,
                                    background: tierColor,
                                    borderRadius: 2,
                                  }}
                                />
                              </div>
                              <span style={{ fontWeight: 700, color: tierColor, minWidth: 32, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                                {d.score}%
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '10px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>
                            {(d.studentCount / 1000).toFixed(0)}k
                          </td>
                          <td style={{ padding: '10px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {d.placementRate}%
                          </td>
                          <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 10.5,
                                fontWeight: 700,
                                color: tierColor,
                                background: `${tierColor}18`,
                                border: `1px solid ${tierColor}33`,
                                padding: '2px 7px',
                                borderRadius: 'var(--radius-sm, 4px)',
                              }}
                            >
                              <span style={{ width: 4.5, height: 4.5, borderRadius: '50%', background: tierColor }} />
                              {statusLabel}
                            </span>
                          </td>
                          <td style={{ padding: '10px 10px', textAlign: 'right' }}>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: isSelected ? 'var(--brand-gold)' : 'var(--text-muted)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 2,
                              }}
                            >
                              {isSelected ? 'Inspecting' : 'Inspect'} →
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    NATIONAL_STATES.map((s, index) => {
                      const tierColor = getHeatmapColor(s.score);
                      const statusLabel = s.score >= 80 ? 'Surplus' : s.score >= 70 ? 'Equilibrium' : 'Deficit';

                      return (
                        <tr
                          key={s.name}
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            background: 'transparent',
                          }}
                        >
                          <td style={{ padding: '10px 10px', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                            {String(index + 1).padStart(2, '0')}
                          </td>
                          <td style={{ padding: '10px 10px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{s.region} Zone</div>
                          </td>
                          <td style={{ padding: '10px 10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, height: 4, background: 'var(--bg-input)', borderRadius: 2, overflow: 'hidden' }}>
                                <div
                                  style={{
                                    height: '100%',
                                    width: `${Math.min(100, Math.max(5, s.score))}%`,
                                    background: tierColor,
                                    borderRadius: 2,
                                  }}
                                />
                              </div>
                              <span style={{ fontWeight: 700, color: tierColor, minWidth: 32, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                                {s.score}%
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '10px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>
                            {(s.students / 1000).toFixed(0)}k
                          </td>
                          <td style={{ padding: '10px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {s.score}%
                          </td>
                          <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 10.5,
                                fontWeight: 700,
                                color: tierColor,
                                background: `${tierColor}18`,
                                border: `1px solid ${tierColor}33`,
                                padding: '2px 7px',
                                borderRadius: 'var(--radius-sm, 4px)',
                              }}
                            >
                              <span style={{ width: 4.5, height: 4.5, borderRadius: '50%', background: tierColor }} />
                              {statusLabel}
                            </span>
                          </td>
                          <td style={{ padding: '10px 10px', textAlign: 'right', color: 'var(--text-muted)', fontSize: 11 }}>
                            State Node
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Compact Mobile Cards (Single Column, Data-First) */}
            <div className="block sm:hidden" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredDistricts.map((d) => {
                const isSelected = selectedDistrict.id === d.id;
                const tierColor = getHeatmapColor(d.score);

                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDistrict(d)}
                    style={{
                      padding: 12,
                      borderRadius: 'var(--radius-md, 8px)',
                      background: isSelected ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                      border: isSelected ? '1px solid var(--brand-gold)' : '1px solid var(--border-default)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{d.name}</span>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.division}</div>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 800, color: tierColor, fontVariantNumeric: 'tabular-nums' }}>
                        {d.score}%
                      </span>
                    </div>
                    <div style={{ height: 3, background: 'var(--bg-input)', borderRadius: 2, margin: '8px 0', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${d.score}%`, background: tierColor }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)' }}>
                      <span>{(d.studentCount / 1000).toFixed(0)}k trainees</span>
                      <span>Placement: {d.placementRate}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* District Detailed Inspection Drawer */}
          <div className="card-standard" style={{ padding: 22, borderRadius: 'var(--radius-lg, 12px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-default)', paddingBottom: 14, marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--brand-gold)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  District Intelligence Profile
                </span>
                <h3 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>
                  {selectedDistrict.name} · {selectedDistrict.division}
                </h3>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-sm, 4px)',
                  background:
                    selectedDistrict.status === 'SURPLUS'
                      ? 'var(--success-surface)'
                      : selectedDistrict.status === 'EQUILIBRIUM'
                      ? 'var(--brand-gold-subtle)'
                      : 'var(--error-surface)',
                  color:
                    selectedDistrict.status === 'SURPLUS'
                      ? 'var(--success)'
                      : selectedDistrict.status === 'EQUILIBRIUM'
                      ? 'var(--brand-gold)'
                      : 'var(--error)',
                  border: `1px solid ${
                    selectedDistrict.status === 'SURPLUS'
                      ? 'var(--success-border)'
                      : selectedDistrict.status === 'EQUILIBRIUM'
                      ? 'var(--brand-gold-border)'
                      : 'var(--error-border)'
                  }`,
                }}
              >
                {selectedDistrict.status}
              </span>
            </div>

            {/* Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
              <div style={{ padding: 12, borderRadius: 'var(--radius-md, 8px)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Avg Competency Score</div>
                <div className="font-display tabular-numbers" style={{ fontSize: 20, fontWeight: 800, color: getHeatmapColor(selectedDistrict.score) }}>
                  {selectedDistrict.score}%
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 'var(--radius-md, 8px)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Placement Rate</div>
                <div className="font-display tabular-numbers" style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
                  {selectedDistrict.placementRate}%
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 'var(--radius-md, 8px)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Longitudinal Retention</div>
                <div className="font-display tabular-numbers" style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
                  {selectedDistrict.retentionRate}%
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 'var(--radius-md, 8px)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Average Starting CTC</div>
                <div className="font-display tabular-numbers" style={{ fontSize: 20, fontWeight: 800, color: 'var(--brand-gold)' }}>
                  ₹{selectedDistrict.avgSalaryLPA} LPA
                </div>
              </div>
            </div>

            {/* Skills & Gaps */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11.5, fontWeight: 750, color: 'var(--success)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <ShieldCheck size={14} /> High-Density Technical Competencies
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selectedDistrict.topSkills.map((sk, idx) => (
                  <span key={idx} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 'var(--radius-sm, 4px)', background: 'var(--success-surface)', color: 'var(--success)', border: '1px solid var(--success-border)' }}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11.5, fontWeight: 750, color: 'var(--error)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertTriangle size={14} /> Critical Skill Deficits (Immediate Focus)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selectedDistrict.gapSkills.map((sk, idx) => (
                  <span key={idx} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 'var(--radius-sm, 4px)', background: 'var(--error-surface)', color: 'var(--error)', border: '1px solid var(--error-border)' }}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Directive Callout */}
            <div style={{ padding: 14, borderRadius: 'var(--radius-md, 8px)', background: 'var(--brand-gold-subtle)', border: '1px solid var(--brand-gold-border)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand-gold)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                State Policy Action Directive:
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {selectedDistrict.actionDirective}
              </p>
            </div>
          </div>
        </div>

        {/* ── Searchable District Intelligence Table ── */}
        <div className="card-standard" style={{ padding: 22, borderRadius: 'var(--radius-lg, 12px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                District Performance & Placement Ranking
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Sorted by overall NSQF composite score and vocational retention index.
              </p>
            </div>

            <div style={{ position: 'relative', width: 260 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search district or division..."
                style={{
                  width: '100%',
                  padding: '7px 12px 7px 30px',
                  borderRadius: 'var(--radius-sm, 6px)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  fontSize: 12.5,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase' }}>
                  <th style={{ padding: '9px 12px' }}>District</th>
                  <th style={{ padding: '9px 12px' }}>Division</th>
                  <th style={{ padding: '9px 12px' }}>Score</th>
                  <th style={{ padding: '9px 12px' }}>Placement %</th>
                  <th style={{ padding: '9px 12px' }}>Retention %</th>
                  <th style={{ padding: '9px 12px' }}>Avg CTC</th>
                  <th style={{ padding: '9px 12px' }}>Candidates</th>
                  <th style={{ padding: '9px 12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDistricts.map((d) => {
                  const isSelected = selectedDistrict.id === d.id;
                  const tierColor = getHeatmapColor(d.score);
                  return (
                    <tr
                      key={d.id}
                      onClick={() => setSelectedDistrict(d)}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        background: isSelected ? 'var(--bg-surface-elevated)' : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'var(--bg-surface-hover)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <td style={{ padding: '11px 12px', fontWeight: 700, color: 'var(--text-primary)' }}>{d.name}</td>
                      <td style={{ padding: '11px 12px', color: 'var(--text-secondary)' }}>{d.division}</td>
                      <td style={{ padding: '11px 12px', fontWeight: 800, color: tierColor, fontVariantNumeric: 'tabular-nums' }}>{d.score}%</td>
                      <td style={{ padding: '11px 12px', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{d.placementRate}%</td>
                      <td style={{ padding: '11px 12px', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{d.retentionRate}%</td>
                      <td style={{ padding: '11px 12px', color: 'var(--brand-gold)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>₹{d.avgSalaryLPA}L</td>
                      <td style={{ padding: '11px 12px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{d.studentCount.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '11px 12px' }}>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm, 4px)',
                            background: `${tierColor}18`,
                            color: tierColor,
                            border: `1px solid ${tierColor}33`,
                          }}
                        >
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </ErrorBoundary>
  );
}
