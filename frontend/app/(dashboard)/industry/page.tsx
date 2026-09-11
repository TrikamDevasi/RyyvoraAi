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
  TrendingUp,
  Building2,
  Users,
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
  Target,
  Factory,
  CheckCircle2,
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

interface SkillGapItem {
  id: string;
  name: string;
  nosCode: string;
  domain: string;
  industryDemand: number;
  talentSupply: number;
  deficitPercent: number;
  openRequisitions: number;
  avgCtcLPA: number;
  urgency: 'CRITICAL' | 'HIGH' | 'MODERATE';
}

export default function IndustryPage() {
  const [skills, setSkills] = useState<SkillGapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [domainFilter, setDomainFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get('/analytics/industry-demand')
      .then((res) => {
        if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
          setSkills(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleExportForecast = () => {
    const report = {
      title: 'Sector Skill Council (SSC) & Maharashtra Industry Demand Forecast 2026',
      generatedAt: new Date().toISOString(),
      governingAuthority: 'NASSCOM IT-ITeS SSC & Maharashtra Skill Development Board',
      metrics: {
        totalOpenRequisitions: skills.reduce((s, g) => s + g.openRequisitions, 0),
        avgIndustryDemandScore: 93.6,
        netSupplyDeficit: '-25.6%',
        medianStartingCTC: '₹8.96 LPA',
      },
      skills,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `industry_demand_forecast_${Date.now()}.json`;
    a.click();
    toast.success('Industry Demand & NOS Forecast (JSON) exported!');
  };

  const filteredSkills = skills.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nosCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDomain = domainFilter === 'ALL' || s.domain === domainFilter;
    return matchSearch && matchDomain;
  });

  const chartData = skills.map((s) => ({
    name: s.name.split(' ')[0] + ' ' + (s.name.split(' ')[1] || ''),
    Demand: s.industryDemand,
    Supply: s.talentSupply,
  }));

  const totalRequisitions = skills.reduce((s, g) => s + g.openRequisitions, 0);

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
              <AIBadge type="nsqf" label="SECTOR SKILL COUNCIL INTELLIGENCE" />
              <AIBadge type="live" label="REAL-TIME TALENT DEFICIT RADAR" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Industry Demand & <span style={{ color: 'var(--gold)' }}>Talent Shortage Radar</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Macro intelligence matching live corporate job requisitions against Maharashtra technical talent pipelines, National Occupational Standards (NOS), and wage growth curves.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleExportForecast}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Download size={14} /> Export Demand Forecast
            </button>
          </div>
        </div>

        {/* ── Scorecards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Open Tech Requisitions', value: `${totalRequisitions.toLocaleString('en-IN')}+`, sub: 'Active Corporate Openings', color: 'var(--gold)', icon: Briefcase },
            { label: 'Net Supply Deficit', value: '-25.6%', sub: 'High-Growth Tech Shortage', color: '#ef4444', icon: AlertTriangle },
            { label: 'Avg Certified Package', value: '₹8.96 LPA', sub: '+44% vs Non-Certified Candidates', color: '#10b981', icon: TrendingUp },
            { label: 'Hiring Partners', value: '640+ Enterprises', sub: 'TCS, Infosys, Swiggy, Razorpay', color: '#60a5fa', icon: Factory },
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

        {/* ── Demand vs Supply Gap Comparison Chart ── */}
        <div className="card-linear" style={{ padding: 24, borderRadius: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Target size={17} color="var(--gold)" /> Skill Demand vs Talent Supply Density
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Comparing employer demand index against pre-screened talent supply across Maharashtra hubs.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 11.5, fontWeight: 700 }}>
              <span style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} /> Industry Demand
              </span>
              <span style={{ color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#60a5fa' }} /> Talent Supply
              </span>
            </div>
          </div>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} domain={[0, 100]} />
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
                <Bar dataKey="Demand" fill="var(--gold)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Supply" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── National Occupational Standards (NOS) & Skill Gaps Ledger ── */}
        <div className="card-linear" style={{ padding: 24, borderRadius: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                National Occupational Standards (NOS) Deficit Matrix
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Accredited Qualification Packs mapped to real-time hiring demand and median compensation.
              </p>
            </div>

            {/* Filter controls */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: 220 }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skill, NOS code..."
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

              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                style={{
                  padding: '7px 10px',
                  borderRadius: 6,
                  background: 'var(--bg-input, #0f111a)',
                  border: '1px solid var(--border)',
                  color: '#fff',
                  fontSize: 12,
                }}
              >
                <option value="ALL">All Tech Domains</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                <option value="Information Security">Information Security</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11.5, textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Qualification Pack (NOS)</th>
                  <th style={{ padding: '10px 12px' }}>Domain</th>
                  <th style={{ padding: '10px 12px' }}>Demand</th>
                  <th style={{ padding: '10px 12px' }}>Supply</th>
                  <th style={{ padding: '10px 12px' }}>Deficit Gap</th>
                  <th style={{ padding: '10px 12px' }}>Open Vacancies</th>
                  <th style={{ padding: '10px 12px' }}>Median CTC</th>
                  <th style={{ padding: '10px 12px' }}>Urgency</th>
                </tr>
              </thead>
              <tbody>
                {filteredSkills.map((item) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                    className="hover:bg-white/5"
                  >
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 700, color: '#f8fafc' }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'monospace' }}>
                        {item.nosCode}
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                      {item.domain}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 800, color: 'var(--gold)' }}>
                      {item.industryDemand}%
                    </td>
                    <td style={{ padding: '12px', color: '#60a5fa' }}>
                      {item.talentSupply}%
                    </td>
                    <td style={{ padding: '12px', fontWeight: 800, color: item.deficitPercent <= -30 ? '#ef4444' : '#f59e0b' }}>
                      {item.deficitPercent}%
                    </td>
                    <td style={{ padding: '12px', color: '#f8fafc', fontWeight: 600 }}>
                      {item.openRequisitions.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 800, color: '#10b981' }}>
                      ₹{item.avgCtcLPA} LPA
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 99,
                          background:
                            item.urgency === 'CRITICAL'
                              ? 'rgba(239,68,68,0.12)'
                              : item.urgency === 'HIGH'
                              ? 'rgba(245,158,11,0.12)'
                              : 'rgba(96,165,250,0.12)',
                          color:
                            item.urgency === 'CRITICAL'
                              ? '#ef4444'
                              : item.urgency === 'HIGH'
                              ? '#f59e0b'
                              : '#60a5fa',
                        }}
                      >
                        {item.urgency}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Quick Action Nav Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {[
            { title: 'Campus Talent Scouting', desc: 'Engage top technical polytechnics for seasonal campus placements.', href: '/industry/campus', icon: Building2 },
            { title: 'Talent Sourcing Registry', desc: 'Search pre-assessed candidates with SHA-256 verified passports.', href: '/industry/talent', icon: Users },
            { title: 'Industry Policy News Wire', desc: 'Review government apprentice subsidies and PMKVY regulations.', href: '/industry/news', icon: TrendingUp },
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
                  <span>Open Workspace</span>
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
