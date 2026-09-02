'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import {
  Handshake,
  School,
  Building2,
  Users,
  Search,
  Plus,
  Download,
  Filter,
  CheckCircle2,
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
  MapPin,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface CampusInstitution {
  id: string;
  name: string;
  location: string;
  district: string;
  nsqfTier: string;
  enrolledStudents: number;
  placementRate: number;
  avgCtcLPA: number;
  programs: string[];
  driveStatus: 'READY_FOR_DRIVE' | 'ACTIVE_DRIVE' | 'SCHEDULED';
}

interface CampusDriveSchedule {
  id: string;
  institutionName: string;
  companyName: string;
  targetRole: string;
  driveDate: string;
  mode: 'ON_CAMPUS' | 'VIRTUAL' | 'HYBRID';
  headcount: number;
  status: 'CONFIRMED' | 'UNDER_REVIEW';
}

const DEFAULT_INSTITUTIONS: CampusInstitution[] = [
  {
    id: 'inst_pune',
    name: 'Government Polytechnic Pune',
    location: 'Shivajinagar, Pune',
    district: 'Pune District',
    nsqfTier: 'NSQF Level 6 Hub',
    enrolledStudents: 2450,
    placementRate: 87.4,
    avgCtcLPA: 7.65,
    programs: ['Full-Stack Web (Next.js)', 'Applied AI', 'Cloud Native DevOps', 'Industrial IoT'],
    driveStatus: 'READY_FOR_DRIVE',
  },
  {
    id: 'inst_mumbai',
    name: 'VJTI Technical Institute Mumbai',
    location: 'Matunga, Mumbai',
    district: 'Mumbai Metropolitan',
    nsqfTier: 'NSQF Level 6 Hub',
    enrolledStudents: 3180,
    placementRate: 91.0,
    avgCtcLPA: 9.40,
    programs: ['Full-Stack Architecture', 'FinTech & Blockchain', 'GenAI Platform', 'Cybersecurity'],
    driveStatus: 'ACTIVE_DRIVE',
  },
  {
    id: 'inst_nagpur',
    name: 'Govt College of Engineering Nagpur',
    location: 'MIHAN SEZ Corridor, Nagpur',
    district: 'Nagpur District',
    nsqfTier: 'NSQF Level 5 Hub',
    enrolledStudents: 1820,
    placementRate: 78.0,
    avgCtcLPA: 6.20,
    programs: ['Web & Enterprise', 'Python Data Systems', 'Cloud & Linux', 'Embedded Robotics'],
    driveStatus: 'READY_FOR_DRIVE',
  },
  {
    id: 'inst_nashik',
    name: 'K.K. Wagh Institute of Engineering Nashik',
    location: 'Amrutdham, Nashik',
    district: 'Nashik District',
    nsqfTier: 'NSQF Level 5 Hub',
    enrolledStudents: 1640,
    placementRate: 82.5,
    avgCtcLPA: 6.80,
    programs: ['Frontend UI Systems', 'TypeScript Web', 'Industrial IoT', 'DevOps CI/CD'],
    driveStatus: 'READY_FOR_DRIVE',
  },
  {
    id: 'inst_sangli',
    name: 'Walchand College of Engineering Sangli',
    location: 'Vishrambag, Sangli',
    district: 'Sangli District',
    nsqfTier: 'NSQF Level 5 Hub',
    enrolledStudents: 1420,
    placementRate: 84.0,
    avgCtcLPA: 7.50,
    programs: ['Backend Microservices', 'Distributed Databases', 'Full-Stack Web', 'Cloud SRE'],
    driveStatus: 'SCHEDULED',
  },
];

const DEFAULT_SCHEDULED_DRIVES: CampusDriveSchedule[] = [
  {
    id: 'sch_1',
    institutionName: 'Government Polytechnic Pune',
    companyName: 'TechCorp Digital Pune',
    targetRole: 'Full-Stack Systems Engineer',
    driveDate: 'April 08, 2026',
    mode: 'ON_CAMPUS',
    headcount: 25,
    status: 'CONFIRMED',
  },
  {
    id: 'sch_2',
    institutionName: 'VJTI Technical Institute Mumbai',
    companyName: 'FinTech Labs BKC',
    targetRole: 'Applied AI & LangChain Associate',
    driveDate: 'April 14, 2026',
    mode: 'HYBRID',
    headcount: 15,
    status: 'CONFIRMED',
  },
];

export default function CampusPage() {
  const [institutions, setInstitutions] = useState<CampusInstitution[]>(DEFAULT_INSTITUTIONS);
  const [scheduledDrives, setScheduledDrives] = useState<CampusDriveSchedule[]>(DEFAULT_SCHEDULED_DRIVES);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [selectedInst, setSelectedInst] = useState<CampusInstitution | null>(null);

  // Drive Scheduling Form State
  const [companyName, setCompanyName] = useState('TechCorp Enterprise');
  const [workEmail, setWorkEmail] = useState('recruiting@techcorp.in');
  const [targetRole, setTargetRole] = useState('Full-Stack Engineer');
  const [driveMode, setDriveMode] = useState<'ON_CAMPUS' | 'VIRTUAL' | 'HYBRID'>('ON_CAMPUS');
  const [headcount, setHeadcount] = useState(20);
  const [driveDate, setDriveDate] = useState('April 25, 2026');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get('/industry/campus-connect')
      .then(() => {})
      .catch(() => {});
  }, []);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInst) return;

    setSubmitting(true);
    setTimeout(() => {
      const newSchedule: CampusDriveSchedule = {
        id: `sch_${Date.now()}`,
        institutionName: selectedInst.name,
        companyName,
        targetRole,
        driveDate,
        mode: driveMode,
        headcount: Number(headcount),
        status: 'CONFIRMED',
      };

      setScheduledDrives((prev) => [newSchedule, ...prev]);
      setSubmitting(false);
      setSelectedInst(null);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981'],
      });
      toast.success(`Campus Drive scheduled with ${newSchedule.institutionName}! Institutional TPO notified.`);
    }, 800);
  };

  const filteredInstitutions = institutions.filter((inst) => {
    const matchSearch =
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.location.toLowerCase().includes(search.toLowerCase()) ||
      inst.programs.some((p) => p.toLowerCase().includes(search.toLowerCase()));
    const matchDistrict = districtFilter === 'ALL' || inst.district === districtFilter;
    return matchSearch && matchDistrict;
  });

  const totalStudents = institutions.reduce((s, i) => s + i.enrolledStudents, 0);

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
              <AIBadge type="nsqf" label="CAMPUS TALENT PARTNERSHIP DESK" />
              <AIBadge type="verified" label="142 ACCREDITED INSTITUTES" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Campus Drive Connect & <span style={{ color: 'var(--gold)' }}>Institutional Scouting</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Direct corporate interface to schedule on-campus & virtual hiring drives across accredited Maharashtra technical polytechnics and government engineering colleges.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                if (institutions[0]) setSelectedInst(institutions[0]);
              }}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={15} /> Schedule Campus Drive
            </button>
          </div>
        </div>

        {/* ── Scorecards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Accredited Campus Partners', value: `${institutions.length + 137} Institutes`, sub: 'Across 36 Maharashtra Districts', color: 'var(--gold)', icon: School },
            { label: 'Total Student Reach', value: `${totalStudents.toLocaleString('en-IN')}+`, sub: 'Pre-Screened Talent Pipeline', color: '#10b981', icon: Users },
            { label: 'Campus Placement Rate', value: '87.4%', sub: '+32% vs Off-Campus Baseline', color: '#60a5fa', icon: Award },
            { label: 'Active Scheduled Drives', value: `${scheduledDrives.length} Corporate Drives`, sub: 'TCS, Infosys, TechCorp', color: '#a855f7', icon: Handshake },
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

        {/* ── Active Campus Drives Table ── */}
        {scheduledDrives.length > 0 && (
          <div className="card-linear" style={{ padding: 22, borderRadius: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={17} color="var(--gold)" /> Scheduled Enterprise Campus Drives
              </h3>
              <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>Confirmed with TPO</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11.5, textTransform: 'uppercase' }}>
                    <th style={{ padding: '8px 12px' }}>Institution</th>
                    <th style={{ padding: '8px 12px' }}>Company</th>
                    <th style={{ padding: '8px 12px' }}>Target Role</th>
                    <th style={{ padding: '8px 12px' }}>Drive Date</th>
                    <th style={{ padding: '8px 12px' }}>Mode</th>
                    <th style={{ padding: '8px 12px' }}>Headcount</th>
                    <th style={{ padding: '8px 12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledDrives.map((d) => (
                    <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#f8fafc' }}>{d.institutionName}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--gold)' }}>{d.companyName}</td>
                      <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{d.targetRole}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{d.driveDate}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', color: '#cbd5e1' }}>
                          {d.mode}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#f8fafc' }}>{d.headcount} Openings</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
          {/* Search Box */}
          <div style={{ position: 'relative', width: 280 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search partner institute, program..."
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

          {/* District Filter Dropdown */}
          <div style={{ display: 'flex', gap: 10 }}>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: 6,
                background: 'var(--bg-input, #0f111a)',
                border: '1px solid var(--border)',
                color: '#fff',
                fontSize: 12,
              }}
            >
              <option value="ALL">All Maharashtra Districts</option>
              <option value="Pune District">Pune District</option>
              <option value="Mumbai Metropolitan">Mumbai Metropolitan</option>
              <option value="Nagpur District">Nagpur District</option>
              <option value="Nashik District">Nashik District</option>
              <option value="Sangli District">Sangli District</option>
            </select>
          </div>
        </div>

        {/* ── Institutions Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
          {filteredInstitutions.map((inst) => (
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
                borderLeft: '4px solid var(--gold)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <h3 className="font-display" style={{ fontSize: 16.5, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    {inst.name}
                  </h3>
                  <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                    {inst.nsqfTier}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                  <MapPin size={13} color="var(--gold)" />
                  <span>{inst.location}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', marginBottom: 14 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Cohort Size</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>{inst.enrolledStudents}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Placement %</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#10b981' }}>{inst.placementRate}%</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Avg CTC</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--gold)' }}>₹{inst.avgCtcLPA}L</div>
                  </div>
                </div>

                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>
                  Core Technical Specializations:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {inst.programs.map((p, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: 10.5,
                        padding: '2px 7px',
                        borderRadius: 4,
                        background: 'rgba(255,255,255,0.04)',
                        color: '#cbd5e1',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
                <span style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={13} /> Ready for Campus Drives
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedInst(inst)}
                  className="btn-gold"
                  style={{ fontSize: 11.5, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Handshake size={12} /> Schedule Drive
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Schedule Drive Modal ── */}
        {selectedInst && (
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
                    Schedule Campus Placement Drive
                  </span>
                  <h3 className="font-display" style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', margin: '2px 0 0' }}>
                    {selectedInst.name}
                  </h3>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {selectedInst.location} · {selectedInst.nsqfTier}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedInst(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
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
                      Work Email
                    </label>
                    <input
                      type="email"
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
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
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                      Target Hiring Role
                    </label>
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
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
                      <option value="Full-Stack Systems Engineer">Full-Stack Systems Engineer</option>
                      <option value="Applied AI & GenAI Associate">Applied AI & GenAI Associate</option>
                      <option value="Cloud Native DevOps SRE">Cloud Native DevOps SRE</option>
                      <option value="Frontend UI Architect">Frontend UI Architect</option>
                      <option value="Industrial IoT Systems">Industrial IoT Systems</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                      Drive Mode
                    </label>
                    <select
                      value={driveMode}
                      onChange={(e) => setDriveMode(e.target.value as any)}
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
                      <option value="ON_CAMPUS">On-Campus In-Person</option>
                      <option value="VIRTUAL">Virtual Proctored Drive</option>
                      <option value="HYBRID">Hybrid Hackathon Drive</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                      Target Headcount
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={headcount}
                      onChange={(e) => setHeadcount(Number(e.target.value))}
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
                      Proposed Date
                    </label>
                    <input
                      type="text"
                      value={driveDate}
                      onChange={(e) => setDriveDate(e.target.value)}
                      placeholder="e.g. May 12, 2026"
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
                    onClick={() => setSelectedInst(null)}
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
                    {submitting ? 'Dispatching...' : 'Confirm Drive Schedule'}
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
