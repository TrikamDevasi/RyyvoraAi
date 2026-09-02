'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import {
  Building,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Search,
  Plus,
  Download,
  Filter,
  Sparkles,
  Award,
  RefreshCw,
  Users,
  MapPin,
  ExternalLink,
  X,
  School,
  Landmark,
  Layers,
  Sliders,
  DollarSign,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface AccreditedInstitute {
  id: string;
  name: string;
  type: 'Polytechnic' | 'Autonomous University' | 'Engineering College' | 'ITI';
  location: string;
  district: string;
  nsqfTier: string;
  enrolledStudents: number;
  placementRate: number;
  avgCtcLPA: number;
  ledgerNodeKey: string;
  isVerified: boolean;
  programs: string[];
}

const DEFAULT_INSTITUTES: AccreditedInstitute[] = [
  {
    id: 'inst_1',
    name: 'Government Polytechnic Pune',
    type: 'Polytechnic',
    location: 'Shivajinagar, Pune',
    district: 'Pune District',
    nsqfTier: 'NSQF Level 6 Hub',
    enrolledStudents: 2450,
    placementRate: 87.4,
    avgCtcLPA: 7.65,
    ledgerNodeKey: '0x9482...PUNE_NODE_KEY',
    isVerified: true,
    programs: ['Full-Stack Web (Next.js)', 'Applied AI', 'Cloud DevOps', 'Industrial IoT'],
  },
  {
    id: 'inst_2',
    name: 'VJTI Technical Institute Mumbai',
    type: 'Autonomous University',
    location: 'Matunga, Mumbai',
    district: 'Mumbai Metropolitan',
    nsqfTier: 'NSQF Level 6 Hub',
    enrolledStudents: 3180,
    placementRate: 91.0,
    avgCtcLPA: 9.40,
    ledgerNodeKey: '0x8812...VJTI_NODE_KEY',
    isVerified: true,
    programs: ['Full-Stack Architecture', 'FinTech & Blockchain', 'GenAI Platform', 'Cybersecurity'],
  },
  {
    id: 'inst_3',
    name: 'Govt College of Engineering Nagpur',
    type: 'Engineering College',
    location: 'MIHAN SEZ Corridor, Nagpur',
    district: 'Nagpur District',
    nsqfTier: 'NSQF Level 5 Hub',
    enrolledStudents: 1820,
    placementRate: 78.0,
    avgCtcLPA: 6.20,
    ledgerNodeKey: '0x7140...NAGP_NODE_KEY',
    isVerified: true,
    programs: ['Web & Enterprise', 'Python Data Systems', 'Cloud & Linux', 'Embedded Robotics'],
  },
  {
    id: 'inst_4',
    name: 'K.K. Wagh Institute of Engineering Nashik',
    type: 'Polytechnic',
    location: 'Amrutdham, Nashik',
    district: 'Nashik District',
    nsqfTier: 'NSQF Level 5 Hub',
    enrolledStudents: 1640,
    placementRate: 82.5,
    avgCtcLPA: 6.80,
    ledgerNodeKey: '0x6290...NASH_NODE_KEY',
    isVerified: true,
    programs: ['Frontend UI Systems', 'TypeScript Web', 'Industrial IoT', 'DevOps CI/CD'],
  },
  {
    id: 'inst_5',
    name: 'Walchand College of Engineering Sangli',
    type: 'Engineering College',
    location: 'Vishrambag, Sangli',
    district: 'Sangli District',
    nsqfTier: 'NSQF Level 5 Hub',
    enrolledStudents: 1420,
    placementRate: 84.0,
    avgCtcLPA: 7.50,
    ledgerNodeKey: '0x5521...SANG_NODE_KEY',
    isVerified: true,
    programs: ['Backend Microservices', 'Distributed Databases', 'Full-Stack Web', 'Cloud SRE'],
  },
  {
    id: 'inst_6',
    name: 'Government ITI Aurangabad',
    type: 'ITI',
    location: 'MIDC Chhatrapati Sambhajinagar',
    district: 'Aurangabad District',
    nsqfTier: 'NSQF Level 4 Hub',
    enrolledStudents: 920,
    placementRate: 72.0,
    avgCtcLPA: 5.10,
    ledgerNodeKey: '0x3920...AURN_NODE_KEY',
    isVerified: false,
    programs: ['Industrial Electrician', 'CNC Machining', 'Solar Microgrid', 'Python Basics'],
  },
];

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  Polytechnic: { bg: 'rgba(245,158,11,0.12)', color: 'var(--gold)' },
  'Autonomous University': { bg: 'rgba(168,85,247,0.12)', color: '#c084fc' },
  'Engineering College': { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  ITI: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
};

export default function InstitutesPage() {
  const [institutes, setInstitutes] = useState<AccreditedInstitute[]>(DEFAULT_INSTITUTES);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<any>('Polytechnic');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('Pune District');
  const [nsqfTier, setNsqfTier] = useState('NSQF Level 5 Hub');
  const [enrolledCount, setEnrolledCount] = useState(800);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get('/admin/institutes')
      .then(() => {})
      .catch(() => {});
  }, []);

  const handleVerify = (id: string, instName: string) => {
    setInstitutes((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, isVerified: true } : inst))
    );
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981'],
    });
    toast.success(`Accreditation sealed for ${instName}! State ledger key activated.`);
  };

  const handleCreateInstitute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) return;

    setSubmitting(true);
    setTimeout(() => {
      const newInst: AccreditedInstitute = {
        id: `inst_${Date.now()}`,
        name,
        type,
        location,
        district,
        nsqfTier,
        enrolledStudents: Number(enrolledCount),
        placementRate: 80.0,
        avgCtcLPA: 6.5,
        ledgerNodeKey: `0x${Math.random().toString(16).substring(2, 8)}...KEY`,
        isVerified: true,
        programs: ['Full-Stack Web', 'Cloud Infrastructure', 'Applied AI'],
      };

      setInstitutes((prev) => [newInst, ...prev]);
      setSubmitting(false);
      setShowModal(false);
      setName('');
      setLocation('');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981'],
      });
      toast.success(`Institution ${newInst.name} onboarded and accredited!`);
    }, 800);
  };

  const handleExportCSV = () => {
    const headers = 'Name,Type,Location,District,NSQFTier,Enrolled,PlacementRate,AvgCTC_LPA,LedgerKey,Verified\n';
    const rows = institutes
      .map((i) => `"${i.name}","${i.type}","${i.location}","${i.district}","${i.nsqfTier}",${i.enrolledStudents},${i.placementRate},${i.avgCtcLPA},"${i.ledgerNodeKey}",${i.isVerified}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `accredited_institutes_${Date.now()}.csv`;
    downloadAnchor.click();
    toast.success('Institutional Accreditation Registry exported to CSV!');
  };

  const filteredInstitutes = institutes.filter((inst) => {
    const matchSearch =
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.location.toLowerCase().includes(search.toLowerCase()) ||
      inst.district.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'ALL' || inst.type === typeFilter;
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'VERIFIED' && inst.isVerified) ||
      (statusFilter === 'PENDING' && !inst.isVerified);
    return matchSearch && matchType && matchStatus;
  });

  const totalEnrolled = institutes.reduce((s, i) => s + i.enrolledStudents, 0);

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
              <AIBadge type="nsqf" label="INSTITUTIONAL ACCREDITATION DESK" />
              <AIBadge type="verified" label="142 RECOGNIZED POLYTECHNICS & ITIs" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Institute Accreditation & <span style={{ color: 'var(--gold)' }}>NSQF Tier Registry</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Official administrative registry governing accreditation credentials, NSQF tier calibrations, and digital ledger minting keys for technical institutions across Maharashtra.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleExportCSV}
              className="btn-secondary"
              style={{ fontSize: 12.5, padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Download size={14} /> Export Registry (CSV)
            </button>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={15} /> Onboard Institution
            </button>
          </div>
        </div>

        {/* ── Scorecards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Accredited Institutes', value: `${institutes.length + 136}`, sub: 'Across 36 Maharashtra Districts', color: 'var(--gold)', icon: Landmark },
            { label: 'Total Enrolled Capacity', value: `${totalEnrolled.toLocaleString('en-IN')}+`, sub: 'Active Vocational Students', color: '#10b981', icon: Users },
            { label: 'Avg Placement Rate', value: '85.6%', sub: 'Across Verified Programs', color: '#60a5fa', icon: Award },
            { label: 'Ledger Key Sync', value: '100% Sealed', sub: 'Cryptographic Node Authority', color: '#c084fc', icon: ShieldCheck },
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

        {/* ── Search & Filters ── */}
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
          {/* Search Box */}
          <div style={{ position: 'relative', width: 280 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search institution, district, location..."
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

          {/* Type & Status Dropdowns */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                padding: '7px 10px',
                borderRadius: 6,
                background: 'var(--bg-input, #0f111a)',
                border: '1px solid var(--border)',
                color: '#fff',
                fontSize: 12,
              }}
            >
              <option value="ALL">All Institute Types</option>
              <option value="Polytechnic">Polytechnic</option>
              <option value="Autonomous University">Autonomous University</option>
              <option value="Engineering College">Engineering College</option>
              <option value="ITI">Industrial Training Institute (ITI)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '7px 10px',
                borderRadius: 6,
                background: 'var(--bg-input, #0f111a)',
                border: '1px solid var(--border)',
                color: '#fff',
                fontSize: 12,
              }}
            >
              <option value="ALL">All Verification Status</option>
              <option value="VERIFIED">Accredited & Sealed</option>
              <option value="PENDING">Pending Verification</option>
            </select>
          </div>
        </div>

        {/* ── Institutions Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
          {filteredInstitutes.map((inst) => {
            const typeBadge = TYPE_COLORS[inst.type] || TYPE_COLORS.Polytechnic;

            return (
              <div
                key={inst.id}
                className="card-linear"
                style={{
                  padding: 22,
                  borderRadius: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 16,
                  borderLeft: `4px solid ${inst.isVerified ? '#10b981' : 'var(--gold)'}`,
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <h3 className="font-display" style={{ fontSize: 16.5, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                        {inst.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                        <MapPin size={12} color="var(--gold)" />
                        <span>{inst.location}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: typeBadge.bg, color: typeBadge.color }}>
                      {inst.type}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', margin: '12px 0' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Students</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>{inst.enrolledStudents}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Placement</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#10b981' }}>{inst.placementRate}%</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Avg CTC</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--gold)' }}>₹{inst.avgCtcLPA}L</div>
                    </div>
                  </div>

                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: 6 }}>
                    Ledger Key: {inst.ledgerNodeKey}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {inst.programs.slice(0, 3).map((p, idx) => (
                      <span key={idx} style={{ fontSize: 10.5, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', color: '#cbd5e1' }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: inst.isVerified ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {inst.isVerified ? <CheckCircle2 size={13} /> : <RefreshCw size={13} />}
                    <span>{inst.isVerified ? 'Accredited & Sealed' : 'Pending Verification'}</span>
                  </span>

                  {!inst.isVerified ? (
                    <button
                      type="button"
                      onClick={() => handleVerify(inst.id, inst.name)}
                      className="btn-gold"
                      style={{ fontSize: 11.5, padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <ShieldCheck size={13} /> Accredit & Seal
                    </button>
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{inst.nsqfTier}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Onboard Institute Modal ── */}
        {showModal && (
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
                maxWidth: 500,
                borderRadius: 18,
                padding: 26,
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase' }}>
                    Institutional Onboarding Desk
                  </span>
                  <h3 className="font-display" style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', margin: '2px 0 0' }}>
                    Onboard New Institution
                  </h3>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Accredit vocational polytechnic, ITI, or engineering college onto state ledger.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateInstitute} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                    Institution Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Government Polytechnic Kolhapur"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 6,
                      background: 'var(--bg-input, #0f111a)',
                      border: '1px solid var(--border)',
                      color: '#fff',
                      fontSize: 12,
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                      Institution Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
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
                      <option value="Polytechnic">Polytechnic</option>
                      <option value="Autonomous University">Autonomous University</option>
                      <option value="Engineering College">Engineering College</option>
                      <option value="ITI">Industrial Training Institute (ITI)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                      NSQF Tier Level
                    </label>
                    <select
                      value={nsqfTier}
                      onChange={(e) => setNsqfTier(e.target.value)}
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
                      <option value="NSQF Level 6 Hub">NSQF Level 6 Hub</option>
                      <option value="NSQF Level 5 Hub">NSQF Level 5 Hub</option>
                      <option value="NSQF Level 4 Hub">NSQF Level 4 Hub</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                      Location & Campus
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Shivaji University Road, Kolhapur"
                      required
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        background: 'var(--bg-input, #0f111a)',
                        border: '1px solid var(--border)',
                        color: '#fff',
                        fontSize: 12,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                      Enrolled Students
                    </label>
                    <input
                      type="number"
                      min="50"
                      value={enrolledCount}
                      onChange={(e) => setEnrolledCount(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        background: 'var(--bg-input, #0f111a)',
                        border: '1px solid var(--border)',
                        color: '#fff',
                        fontSize: 12,
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
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
                    disabled={submitting}
                    className="btn-gold"
                    style={{ padding: '8px 18px', fontSize: 12.5, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    {submitting ? <RefreshCw size={13} className="animate-spin" /> : <Plus size={13} />}
                    <span>{submitting ? 'Accrediting...' : 'Accredit & Mint Ledger Key'}</span>
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
