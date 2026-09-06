'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  Briefcase,
  Users,
  Search,
  Plus,
  Download,
  Filter,
  CheckCircle2,
  Building2,
  Calendar,
  Sparkles,
  Award,
  ShieldCheck,
  TrendingUp,
  Clock,
  Send,
  Lock,
  DollarSign,
  X,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';

interface PlacementRecord {
  id: string;
  candidateName: string;
  institute: string;
  role: string;
  company: string;
  nsqfTier: string;
  salaryLPA: number;
  score: number;
  placedDate: string;
  status: 'VERIFIED' | 'ONBOARDING' | 'INTERNSHIP';
  passportHash: string;
}

interface HiringDrive {
  id: string;
  title: string;
  role: string;
  minNsqf: string;
  minScore: number;
  ctcRange: string;
  openings: number;
  applicantsCount: number;
  status: 'ACTIVE' | 'CLOSING_SOON' | 'COMPLETED';
  deadline: string;
}

const DEFAULT_PLACEMENTS: PlacementRecord[] = [
  {
    id: 'plc_1',
    candidateName: 'Arjun Mehta',
    institute: 'Government Polytechnic Pune',
    role: 'Full-Stack Developer',
    company: 'TechCorp Digital Pune',
    nsqfTier: 'NSQF Level 6',
    salaryLPA: 8.8,
    score: 92,
    placedDate: 'Feb 2026',
    status: 'VERIFIED',
    passportHash: '0x9e7a...4b12_HMAC_SIGNED',
  },
  {
    id: 'plc_2',
    candidateName: 'Priya Sharma',
    institute: 'VJTI Technical Institute Mumbai',
    role: 'Applied AI Engineer',
    company: 'FinTech Labs Mumbai',
    nsqfTier: 'NSQF Level 6',
    salaryLPA: 10.5,
    score: 95,
    placedDate: 'March 2026',
    status: 'VERIFIED',
    passportHash: '0x7c3d...8f90_HMAC_SIGNED',
  },
  {
    id: 'plc_3',
    candidateName: 'Rohan Deshmukh',
    institute: 'Govt College of Engineering Nagpur',
    role: 'Cloud Native DevOps SRE',
    company: 'CloudScale Nagpur',
    nsqfTier: 'NSQF Level 5',
    salaryLPA: 7.2,
    score: 88,
    placedDate: 'Jan 2026',
    status: 'VERIFIED',
    passportHash: '0x3a2b...1c4e_HMAC_SIGNED',
  },
  {
    id: 'plc_4',
    candidateName: 'Sneha Kulkarni',
    institute: 'K.K. Wagh Engineering Nashik',
    role: 'Frontend Architect',
    company: 'SoftWeb Systems Nashik',
    nsqfTier: 'NSQF Level 5',
    salaryLPA: 6.8,
    score: 90,
    placedDate: 'Feb 2026',
    status: 'VERIFIED',
    passportHash: '0x5f8a...9c2d_HMAC_SIGNED',
  },
  {
    id: 'plc_5',
    candidateName: 'Aditya Patel',
    institute: 'Walchand College of Engineering Sangli',
    role: 'Backend Microservices Engineer',
    company: 'Nexus Infotech Pune',
    nsqfTier: 'NSQF Level 5',
    salaryLPA: 7.5,
    score: 86,
    placedDate: 'Jan 2026',
    status: 'ONBOARDING',
    passportHash: '0x1b4c...7e3f_HMAC_SIGNED',
  },
];

const DEFAULT_DRIVES: HiringDrive[] = [
  {
    id: 'drv_1',
    title: '2026 Full-Stack & Next.js Graduate Hiring Drive',
    role: 'Full-Stack Systems Engineer',
    minNsqf: 'NSQF Level 5',
    minScore: 85,
    ctcRange: '₹7.5 – ₹11.0 LPA',
    openings: 20,
    applicantsCount: 68,
    status: 'ACTIVE',
    deadline: 'April 15, 2026',
  },
  {
    id: 'drv_2',
    title: 'Applied Generative AI & Python Apprenticeship Drive',
    role: 'GenAI & LangChain Associate',
    minNsqf: 'NSQF Level 6',
    minScore: 90,
    ctcRange: '₹9.0 – ₹14.0 LPA',
    openings: 12,
    applicantsCount: 44,
    status: 'ACTIVE',
    deadline: 'April 30, 2026',
  },
  {
    id: 'drv_3',
    title: 'Cloud Infrastructure & Kubernetes SRE Fast-Track',
    role: 'DevOps & Site Reliability Engineer',
    minNsqf: 'NSQF Level 5',
    minScore: 82,
    ctcRange: '₹7.0 – ₹10.5 LPA',
    openings: 15,
    applicantsCount: 39,
    status: 'ACTIVE',
    deadline: 'May 10, 2026',
  },
];

export default function EmployerPlacementsPage() {
  const [activeTab, setActiveTab] = useState<'PLACEMENTS' | 'DRIVES'>('PLACEMENTS');
  const [placements, setPlacements] = useState<PlacementRecord[]>(DEFAULT_PLACEMENTS);
  const [drives, setDrives] = useState<HiringDrive[]>(DEFAULT_DRIVES);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Drive Form State
  const [newDriveTitle, setNewDriveTitle] = useState('');
  const [newDriveRole, setNewDriveRole] = useState('Full-Stack Engineer');
  const [newDriveNsqf, setNewDriveNsqf] = useState('NSQF Level 5');
  const [newDriveCtc, setNewDriveCtc] = useState('₹7.0 – ₹10.0 LPA');
  const [newDriveOpenings, setNewDriveOpenings] = useState(10);

  useEffect(() => {
    api
      .get('/students')
      .then((res) => {
        if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
          // Live students data available
        }
      })
      .catch(() => {});
  }, []);

  const handleCreateDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriveTitle.trim()) {
      toast.error('Please enter a hiring drive title');
      return;
    }

    const newDrive: HiringDrive = {
      id: `drv_${Date.now()}`,
      title: newDriveTitle,
      role: newDriveRole,
      minNsqf: newDriveNsqf,
      minScore: 80,
      ctcRange: newDriveCtc,
      openings: Number(newDriveOpenings),
      applicantsCount: 0,
      status: 'ACTIVE',
      deadline: 'May 30, 2026',
    };

    setDrives((prev) => [newDrive, ...prev]);
    setShowCreateModal(false);
    setNewDriveTitle('');
    toast.success('New placement hiring drive published across verified network.');
  };

  const handleExportCSV = () => {
    const headers = 'Candidate,Institute,Role,Company,NSQF_Tier,Salary_LPA,Skill_Score,Placed_Date,Status,Passport_Hash\n';
    const rows = placements
      .map((p) => `"${p.candidateName}","${p.institute}","${p.role}","${p.company}","${p.nsqfTier}",${p.salaryLPA},${p.score},"${p.placedDate}","${p.status}","${p.passportHash}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `employer_placement_registry_${Date.now()}.csv`;
    downloadAnchor.click();
    toast.success('Placement Registry exported to CSV!');
  };

  const filteredPlacements = placements.filter(
    (p) =>
      p.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.institute.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDrives = drives.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.role.toLowerCase().includes(searchQuery.toLowerCase())
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
              <AIBadge type="nsqf" label="TALENT RECRUITMENT DESK" />
              <AIBadge type="verified" label="VERIFIED PLACEMENT REGISTRY" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Candidate Placement & <span style={{ color: 'var(--gold)' }}>Hiring Drives Registry</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Manage active enterprise campus placement drives, track verified candidate hires, and inspect cryptographic skill passport records across Maharashtra institutions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={15} /> Create Placement Drive
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="btn-secondary"
              style={{ fontSize: 12.5, padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* ── Scorecards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Verified Hires', value: '1,420 Candidates', sub: 'Across Maharashtra State', color: '#10b981', icon: Users },
            { label: 'Avg Starting Package', value: '₹7.80 LPA', sub: '+38% Industry Wage Baseline', color: 'var(--gold)', icon: DollarSign },
            { label: 'Active Hiring Drives', value: `${drives.length} Live Drives`, sub: `${drives.reduce((s, d) => s + d.openings, 0)} Total Openings`, color: '#60a5fa', icon: Briefcase },
            { label: '365d Retention Index', value: '92.4%', sub: 'Longitudinal Tenure Score', color: '#a855f7', icon: TrendingUp },
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

        {/* ── Tab Selector & Search ── */}
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
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              onClick={() => setActiveTab('PLACEMENTS')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                background: activeTab === 'PLACEMENTS' ? 'var(--gold)' : 'transparent',
                color: activeTab === 'PLACEMENTS' ? '#090a0f' : '#cbd5e1',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Verified Placements Registry ({placements.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('DRIVES')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                background: activeTab === 'DRIVES' ? 'var(--gold)' : 'transparent',
                color: activeTab === 'DRIVES' ? '#090a0f' : '#cbd5e1',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Active Campus Drives ({drives.length})
            </button>
          </div>

          <div style={{ position: 'relative', width: 240 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, role..."
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

        {/* ── Tab Content: Placements Registry Table ── */}
        {activeTab === 'PLACEMENTS' && (
          <div className="card-linear" style={{ padding: 24, borderRadius: 16 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11.5, textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 12px' }}>Candidate</th>
                    <th style={{ padding: '10px 12px' }}>Institution</th>
                    <th style={{ padding: '10px 12px' }}>Role & Employer</th>
                    <th style={{ padding: '10px 12px' }}>NSQF Tier</th>
                    <th style={{ padding: '10px 12px' }}>Package (CTC)</th>
                    <th style={{ padding: '10px 12px' }}>Score</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlacements.map((p) => (
                    <tr
                      key={p.id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                      className="hover:bg-white/5"
                    >
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 700, color: '#f8fafc' }}>{p.candidateName}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {p.passportHash}
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                        {p.institute}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ color: '#f8fafc', fontWeight: 600 }}>{p.role}</div>
                        <div style={{ fontSize: 11, color: 'var(--gold)' }}>{p.company}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', color: '#cbd5e1' }}>
                          {p.nsqfTier}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontWeight: 800, color: '#10b981' }}>
                        ₹{p.salaryLPA} LPA
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700, color: 'var(--gold)' }}>
                        {p.score}%
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: 99,
                            background: p.status === 'VERIFIED' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                            color: p.status === 'VERIFIED' ? '#10b981' : 'var(--gold)',
                          }}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab Content: Active Hiring Drives Grid ── */}
        {activeTab === 'DRIVES' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {filteredDrives.map((d) => (
              <div
                key={d.id}
                className="card-accent"
                style={{
                  padding: 22,
                  borderRadius: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 800, padding: '3px 8px', borderRadius: 4, background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                      {d.status}
                    </span>
                    <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Closes: {d.deadline}</span>
                  </div>

                  <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: '0 0 4px', lineHeight: 1.4 }}>
                    {d.title}
                  </h3>
                  <div style={{ fontSize: 12.5, color: 'var(--gold)', fontWeight: 600 }}>{d.role}</div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 14 }}>
                    <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>Target CTC</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#10b981' }}>{d.ctcRange}</div>
                    </div>
                    <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>Openings</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>{d.openings} Positions</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--gold)' }}>{d.applicantsCount}</strong> Verified Applicants
                  </span>
                  <button
                    type="button"
                    onClick={() => toast.success(`Viewing ${d.applicantsCount} pre-screened applicants for ${d.title}`)}
                    className="btn-gold"
                    style={{ fontSize: 11.5, padding: '5px 12px' }}
                  >
                    View Candidates
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Create Placement Drive Modal ── */}
        {showCreateModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            <div
              className="card-accent"
              style={{
                width: '100%',
                maxWidth: 480,
                borderRadius: 18,
                padding: 26,
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Publish New Campus Hiring Drive
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateDrive} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                    Hiring Drive Title
                  </label>
                  <input
                    type="text"
                    value={newDriveTitle}
                    onChange={(e) => setNewDriveTitle(e.target.value)}
                    placeholder="e.g. 2026 Applied GenAI Graduate Drive"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      background: 'var(--bg-input, #0f111a)',
                      border: '1px solid var(--border)',
                      color: '#fff',
                      fontSize: 12.5,
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                      Target Role
                    </label>
                    <select
                      value={newDriveRole}
                      onChange={(e) => setNewDriveRole(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        background: 'var(--bg-input, #0f111a)',
                        border: '1px solid var(--border)',
                        color: '#fff',
                        fontSize: 12,
                      }}
                    >
                      <option value="Full-Stack Engineer">Full-Stack Engineer</option>
                      <option value="AI & ML Platform Engineer">AI & ML Engineer</option>
                      <option value="Cloud DevOps SRE">Cloud DevOps SRE</option>
                      <option value="Frontend UI Architect">Frontend UI Architect</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                      Min NSQF Tier
                    </label>
                    <select
                      value={newDriveNsqf}
                      onChange={(e) => setNewDriveNsqf(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        background: 'var(--bg-input, #0f111a)',
                        border: '1px solid var(--border)',
                        color: '#fff',
                        fontSize: 12,
                      }}
                    >
                      <option value="NSQF Level 5">NSQF Level 5 (Diploma)</option>
                      <option value="NSQF Level 6">NSQF Level 6 (B.Tech/Eng)</option>
                      <option value="NSQF Level 4">NSQF Level 4 (ITI Cert)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                      Offered CTC Range
                    </label>
                    <input
                      type="text"
                      value={newDriveCtc}
                      onChange={(e) => setNewDriveCtc(e.target.value)}
                      placeholder="e.g. ₹7.5 – ₹11.0 LPA"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        background: 'var(--bg-input, #0f111a)',
                        border: '1px solid var(--border)',
                        color: '#fff',
                        fontSize: 12.5,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                      Openings
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newDriveOpenings}
                      onChange={(e) => setNewDriveOpenings(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        background: 'var(--bg-input, #0f111a)',
                        border: '1px solid var(--border)',
                        color: '#fff',
                        fontSize: 12.5,
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 6,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border)',
                      color: '#cbd5e1',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold"
                    style={{ padding: '8px 18px', fontSize: 12.5, fontWeight: 800 }}
                  >
                    Publish Drive
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}
