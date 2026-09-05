'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  DollarSign,
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
  Sliders,
  CheckCircle2,
  PieChart,
  Check,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';

interface AllocationItem {
  id: string;
  district: string;
  division: string;
  beneficiaries: number;
  gapScore: number;
  recommendedFundingCr: number;
  approvedFundingCr: number;
  expectedROI: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'OPTIMIZED';
  initiative: string;
}

const DEFAULT_ALLOCATIONS: AllocationItem[] = [
  {
    id: 'alloc_1',
    district: 'Chhatrapati Sambhajinagar',
    division: 'Marathwada Division',
    beneficiaries: 62000,
    gapScore: 78,
    recommendedFundingCr: 185,
    approvedFundingCr: 160,
    expectedROI: 3.4,
    priority: 'CRITICAL',
    initiative: 'Marathwada Cloud & Modern Web Vocational Acceleration Centers',
  },
  {
    id: 'alloc_2',
    district: 'Nanded',
    division: 'Marathwada Division',
    beneficiaries: 38000,
    gapScore: 82,
    recommendedFundingCr: 120,
    approvedFundingCr: 95,
    expectedROI: 3.6,
    priority: 'CRITICAL',
    initiative: 'Residential Technical ITI Upskilling Cohorts with Monthly Stipends',
  },
  {
    id: 'alloc_3',
    district: 'Solapur',
    division: 'Pune Division',
    beneficiaries: 42000,
    gapScore: 74,
    recommendedFundingCr: 130,
    approvedFundingCr: 110,
    expectedROI: 3.1,
    priority: 'HIGH',
    initiative: 'Rural Full-Stack Bootcamps across 8 Taluka Vocational Centers',
  },
  {
    id: 'alloc_4',
    district: 'Nagpur',
    division: 'Vidarbha Division',
    beneficiaries: 94000,
    gapScore: 68,
    recommendedFundingCr: 240,
    approvedFundingCr: 220,
    expectedROI: 2.9,
    priority: 'HIGH',
    initiative: 'MIHAN Special Economic Zone Enterprise Hiring Co-Funding',
  },
  {
    id: 'alloc_5',
    district: 'Amravati',
    division: 'Vidarbha Division',
    beneficiaries: 46000,
    gapScore: 76,
    recommendedFundingCr: 140,
    approvedFundingCr: 125,
    expectedROI: 3.2,
    priority: 'HIGH',
    initiative: 'Broadband Infrastructure & Digital Lab Subsidies for Poly-technics',
  },
  {
    id: 'alloc_6',
    district: 'Nashik',
    division: 'Nashik Division',
    beneficiaries: 78000,
    gapScore: 62,
    recommendedFundingCr: 190,
    approvedFundingCr: 180,
    expectedROI: 2.7,
    priority: 'MEDIUM',
    initiative: 'MIDC Industry 4.0 Industrial IoT & Microservices Co-op Labs',
  },
  {
    id: 'alloc_7',
    district: 'Kolhapur',
    division: 'Pune Division',
    beneficiaries: 54000,
    gapScore: 58,
    recommendedFundingCr: 140,
    approvedFundingCr: 135,
    expectedROI: 2.8,
    priority: 'MEDIUM',
    initiative: 'Pune-Kolhapur High-Speed Software Contractor Apprentice Program',
  },
  {
    id: 'alloc_8',
    district: 'Pune',
    division: 'Pune Division',
    beneficiaries: 184500,
    gapScore: 42,
    recommendedFundingCr: 380,
    approvedFundingCr: 380,
    expectedROI: 2.4,
    priority: 'OPTIMIZED',
    initiative: 'Tier-1 Enterprise Deep-Tech Finishing Schools in Hinjawadi',
  },
  {
    id: 'alloc_9',
    district: 'Mumbai Metropolitan',
    division: 'Konkan Division',
    beneficiaries: 220000,
    gapScore: 38,
    recommendedFundingCr: 420,
    approvedFundingCr: 420,
    expectedROI: 2.5,
    priority: 'OPTIMIZED',
    initiative: 'BFSI FinTech & Applied Generative AI Apprenticeship Clusters',
  },
];

const PRIORITY_BADGES: Record<string, { bg: string; color: string }> = {
  CRITICAL: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
  HIGH: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  MEDIUM: { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  OPTIMIZED: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
};

export default function FundTargetingPage() {
  const [allocations, setAllocations] = useState<AllocationItem[]>(DEFAULT_ALLOCATIONS);
  const [budgetCapCr, setBudgetCapCr] = useState<number>(2500);
  const [searchQuery, setSearchQuery] = useState('');
  const [simulating, setSimulating] = useState(false);

  const totalRecommended = allocations.reduce((s, a) => s + a.recommendedFundingCr, 0);
  const totalApproved = allocations.reduce((s, a) => s + a.approvedFundingCr, 0);
  const totalBeneficiaries = allocations.reduce((s, a) => s + a.beneficiaries, 0);
  const averageROI = (allocations.reduce((s, a) => s + a.expectedROI, 0) / allocations.length).toFixed(2);
  const fundingGap = totalRecommended - totalApproved;

  const handleSimulateOptimalBudget = () => {
    setSimulating(true);
    setTimeout(() => {
      // Re-distribute budget favoring high gap scores and high ROI
      const totalWeight = allocations.reduce((sum, a) => sum + (a.gapScore * a.expectedROI), 0);
      const updated = allocations.map((a) => {
        const weight = (a.gapScore * a.expectedROI) / totalWeight;
        const newAlloc = Math.round(budgetCapCr * weight);
        return {
          ...a,
          approvedFundingCr: newAlloc,
        };
      });
      setAllocations(updated);
      setSimulating(false);
      toast.success(`Budget optimization calibrated for ₹${budgetCapCr.toLocaleString('en-IN')} Cr.`);
    }, 900);
  };

  const handleApproveGrant = (id: string) => {
    setAllocations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, approvedFundingCr: a.recommendedFundingCr } : a))
    );
    toast.success('Grant allocation approved to full recommended quota!');
  };

  const handleExportCSV = () => {
    const headers = 'District,Division,Beneficiaries,GapScore,RecommendedFundingCr,ApprovedFundingCr,ExpectedROI,Priority,Initiative\n';
    const rows = allocations
      .map((a) => `"${a.district}","${a.division}",${a.beneficiaries},${a.gapScore},${a.recommendedFundingCr},${a.approvedFundingCr},${a.expectedROI},"${a.priority}","${a.initiative}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `state_fund_targeting_${Date.now()}.csv`;
    downloadAnchor.click();
    toast.success('Budget allocation dataset exported (CSV)');
  };

  const filteredAllocations = allocations.filter(
    (a) =>
      a.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.priority.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1180, margin: '0 auto', paddingBottom: 60 }}>
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
              <AIBadge type="nsqf" label="STATE SKILLING BUDGET COCKPIT" />
              <AIBadge type="verified" label="NEURAL ROI OPTIMIZER" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              State Skilling Fund <span style={{ color: 'var(--gold)' }}>Targeting & Allocation</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Algorithmic budget allocation modeling that directs Maharashtra vocational subsidies to high-impact district skill gaps, maximizing employment ROI and wage growth.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleExportCSV}
              className="btn-secondary"
              style={{ fontSize: 12.5, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Download size={14} /> Export Budget (CSV)
            </button>
          </div>
        </div>

        {/* ── Key Budget Scorecards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Recommended Need', value: `₹${totalRecommended.toLocaleString('en-IN')} Cr`, sub: 'Calculated by Ryyvora Engine', color: 'var(--gold)', icon: DollarSign },
            { label: 'Currently Approved Budget', value: `₹${totalApproved.toLocaleString('en-IN')} Cr`, sub: `${((totalApproved / totalRecommended) * 100).toFixed(1)}% Allocation Ratio`, color: '#10b981', icon: ShieldCheck },
            { label: 'Trainees Funded', value: `${(totalBeneficiaries / 1000).toFixed(0)}k Candidates`, sub: 'Across 36 Districts', color: '#60a5fa', icon: Users },
            { label: 'Projected Economic ROI', value: `${averageROI}x Multiplier`, sub: '₹8,420 Cr 3-Yr Wage Return', color: '#a855f7', icon: TrendingUp },
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

        {/* ── Interactive Budget Simulation Slider Card ── */}
        <div className="card-linear" style={{ padding: 24, borderRadius: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sliders size={17} color="var(--gold)" /> Neural Budget Optimization Simulator
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Adjust total annual state skilling pool to simulate optimal district grant allocations.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSimulateOptimalBudget}
              disabled={simulating}
              className="btn-gold"
              style={{
                padding: '8px 18px',
                fontSize: 12.5,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: simulating ? 'not-allowed' : 'pointer',
              }}
            >
              {simulating ? <RefreshCw size={14} className="animate-spin" /> : <TrendingUp size={14} />}
              <span>{simulating ? 'Optimizing Allocations...' : 'Re-calculate Optimal Grants'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 650, color: 'var(--text-primary)' }}>
                State Budget Cap: <strong style={{ color: 'var(--gold)', fontSize: 16, fontVariantNumeric: 'tabular-nums' }}>₹{budgetCapCr.toLocaleString('en-IN')} Cr</strong>
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Range: ₹500 Cr – ₹3,500 Cr</span>
            </div>

            <input
              type="range"
              min="500"
              max="3500"
              step="50"
              value={budgetCapCr}
              onChange={(e) => setBudgetCapCr(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--gold)',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>

        {/* ── Searchable District Allocation Table ── */}
        <div className="card-linear" style={{ padding: 24, borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                District Skilling Subsidy Allocations
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Targeted institutional funding allocations calibrated to regional deficit scores.
              </p>
            </div>

            <div style={{ position: 'relative', width: 260 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search district, division..."
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 32px',
                  borderRadius: 8,
                  background: 'var(--bg-input, #0f111a)',
                  border: '1px solid var(--border)',
                  color: '#fff',
                  fontSize: 12.5,
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11.5, textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>District & Division</th>
                  <th style={{ padding: '10px 12px' }}>Beneficiaries</th>
                  <th style={{ padding: '10px 12px' }}>Gap Score</th>
                  <th style={{ padding: '10px 12px' }}>Recommended</th>
                  <th style={{ padding: '10px 12px' }}>Approved</th>
                  <th style={{ padding: '10px 12px' }}>ROI</th>
                  <th style={{ padding: '10px 12px' }}>Priority</th>
                  <th style={{ padding: '10px 12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAllocations.map((item) => {
                  const badge = PRIORITY_BADGES[item.priority] || PRIORITY_BADGES.MEDIUM;
                  const isUnderFunded = item.approvedFundingCr < item.recommendedFundingCr;

                  return (
                    <tr
                      key={item.id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                      className="hover:bg-white/5"
                    >
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 700, color: '#f8fafc' }}>{item.district}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.division}</div>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                        {item.beneficiaries.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700, color: item.gapScore >= 75 ? '#ef4444' : 'var(--gold)' }}>
                        {item.gapScore}/100
                      </td>
                      <td style={{ padding: '12px', color: '#cbd5e1' }}>
                        ₹{item.recommendedFundingCr} Cr
                      </td>
                      <td style={{ padding: '12px', fontWeight: 800, color: '#10b981' }}>
                        ₹{item.approvedFundingCr} Cr
                      </td>
                      <td style={{ padding: '12px', color: 'var(--gold)', fontWeight: 700 }}>
                        {item.expectedROI}x
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: 99,
                            background: badge.bg,
                            color: badge.color,
                          }}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {isUnderFunded ? (
                          <button
                            type="button"
                            onClick={() => handleApproveGrant(item.id)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 700,
                              background: 'rgba(245,158,11,0.12)',
                              border: '1px solid var(--gold-border)',
                              color: 'var(--gold)',
                              cursor: 'pointer',
                            }}
                          >
                            Approve Full Grant
                          </button>
                        ) : (
                          <span style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Check size={12} /> Approved
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
      </FadeIn>
    </ErrorBoundary>
  );
}
