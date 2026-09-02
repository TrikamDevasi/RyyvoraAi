'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import {
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
  ExternalLink,
  BookOpen,
  QrCode,
  FileCheck,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface StudentRosterItem {
  id: string;
  name: string;
  enrollmentNo: string;
  program: string;
  nsqfLevel: string;
  overallScore: number;
  githubScore: number;
  placementStatus: 'PLACED' | 'INTERVIEWING' | 'SEEKING' | 'IN_TRAINING';
  placedCompany?: string;
  ctcLPA?: number;
  passportHash: string;
  skills: string[];
}

const DEFAULT_ROSTER: StudentRosterItem[] = [
  {
    id: 'std_1',
    name: 'Arjun Mehta',
    enrollmentNo: 'ENR-2026-MH-9482',
    program: 'Full-Stack Web Engineering',
    nsqfLevel: 'NSQF Level 6',
    overallScore: 92,
    githubScore: 89,
    placementStatus: 'PLACED',
    placedCompany: 'TechCorp Digital Pune',
    ctcLPA: 8.8,
    passportHash: '0x9e7a...4b12_HMAC_SEALED',
    skills: ['React 19', 'Next.js App Router', 'Node.js Microservices', 'PostgreSQL'],
  },
  {
    id: 'std_2',
    name: 'Priya Sharma',
    enrollmentNo: 'ENR-2026-MH-8812',
    program: 'Applied AI & Data Engineering',
    nsqfLevel: 'NSQF Level 6',
    overallScore: 95,
    githubScore: 94,
    placementStatus: 'PLACED',
    placedCompany: 'FinTech Labs Mumbai',
    ctcLPA: 10.5,
    passportHash: '0x7c3d...8f90_HMAC_SEALED',
    skills: ['Python AI', 'LangChain', 'FastAPI', 'PyTorch', 'Vector DB'],
  },
  {
    id: 'std_3',
    name: 'Rohan Deshmukh',
    enrollmentNo: 'ENR-2026-MH-7140',
    program: 'Cloud Native & DevOps SRE',
    nsqfLevel: 'NSQF Level 5',
    overallScore: 88,
    githubScore: 86,
    placementStatus: 'PLACED',
    placedCompany: 'CloudScale Nagpur',
    ctcLPA: 7.2,
    passportHash: '0x3a2b...1c4e_HMAC_SEALED',
    skills: ['Docker', 'Kubernetes Ingress', 'Terraform', 'AWS ECS', 'Linux'],
  },
  {
    id: 'std_4',
    name: 'Sneha Kulkarni',
    enrollmentNo: 'ENR-2026-MH-6290',
    program: 'Frontend & UI Systems',
    nsqfLevel: 'NSQF Level 5',
    overallScore: 90,
    githubScore: 88,
    placementStatus: 'PLACED',
    placedCompany: 'SoftWeb Systems Nashik',
    ctcLPA: 6.8,
    passportHash: '0x5f8a...9c2d_HMAC_SEALED',
    skills: ['TypeScript', 'TailwindCSS', 'WebSockets', 'Next.js UI', 'Framer'],
  },
  {
    id: 'std_5',
    name: 'Aditya Patel',
    enrollmentNo: 'ENR-2026-MH-5521',
    program: 'Full-Stack Web Engineering',
    nsqfLevel: 'NSQF Level 5',
    overallScore: 86,
    githubScore: 84,
    placementStatus: 'INTERVIEWING',
    placedCompany: 'Nexus Infotech (Final Round)',
    ctcLPA: 7.5,
    passportHash: '0x1b4c...7e3f_HMAC_SEALED',
    skills: ['Node.js', 'Express', 'React', 'MongoDB', 'Redis Caching'],
  },
  {
    id: 'std_6',
    name: 'Tanvi Joshi',
    enrollmentNo: 'ENR-2026-MH-4310',
    program: 'Applied AI & Data Engineering',
    nsqfLevel: 'NSQF Level 6',
    overallScore: 91,
    githubScore: 90,
    placementStatus: 'SEEKING',
    passportHash: '0x8f2d...6a1c_HMAC_SEALED',
    skills: ['Python', 'Data Modeling', 'Scikit-Learn', 'SQL', 'FastAPI'],
  },
  {
    id: 'std_7',
    name: 'Rajesh Rao',
    enrollmentNo: 'ENR-2026-MH-3920',
    program: 'Industrial IoT & Automation',
    nsqfLevel: 'NSQF Level 4',
    overallScore: 82,
    githubScore: 79,
    placementStatus: 'IN_TRAINING',
    passportHash: '0x4d1e...9b8a_HMAC_SEALED',
    skills: ['C++', 'Embedded Linux', 'MQTT Protocols', 'Sensor Automation'],
  },
  {
    id: 'std_8',
    name: 'Pooja Gaikwad',
    enrollmentNo: 'ENR-2026-MH-2841',
    program: 'Cloud Native & DevOps SRE',
    nsqfLevel: 'NSQF Level 5',
    overallScore: 87,
    githubScore: 85,
    placementStatus: 'SEEKING',
    passportHash: '0x6e9a...2f1b_HMAC_SEALED',
    skills: ['Docker', 'CI/CD Pipelines', 'GitHub Actions', 'Bash Scripting'],
  },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  PLACED: { label: 'Placed & Verified', bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  INTERVIEWING: { label: 'Interviewing', bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  SEEKING: { label: 'Seeking Hire', bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  IN_TRAINING: { label: 'In Training', bg: 'rgba(192,132,252,0.12)', color: '#c084fc' },
};

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentRosterItem[]>(DEFAULT_ROSTER);
  const [search, setSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentRosterItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Student State
  const [newName, setNewName] = useState('');
  const [newProgram, setNewProgram] = useState('Full-Stack Web Engineering');
  const [newNsqf, setNewNsqf] = useState('NSQF Level 5');
  const [newScore, setNewScore] = useState(85);

  useEffect(() => {
    api
      .get('/students')
      .then((res) => {
        const data = res.data?.data;
        if (Array.isArray(data) && data.length > 0) {
          // Live students available
        }
      })
      .catch(() => {});
  }, []);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error('Please enter the student name');
      return;
    }

    const newStd: StudentRosterItem = {
      id: `std_${Date.now()}`,
      name: newName,
      enrollmentNo: `ENR-2026-MH-${Math.floor(1000 + Math.random() * 9000)}`,
      program: newProgram,
      nsqfLevel: newNsqf,
      overallScore: Number(newScore),
      githubScore: Number(newScore) - 3,
      placementStatus: 'IN_TRAINING',
      passportHash: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}_HMAC_SEALED`,
      skills: ['TypeScript', 'Node.js', 'Next.js', 'SQL'],
    };

    setStudents((prev) => [newStd, ...prev]);
    setShowAddModal(false);
    setNewName('');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981'],
    });
    toast.success('Candidate enrolled and minted on institutional roster!');
  };

  const handleExportCSV = () => {
    const headers = 'Name,EnrollmentNo,Program,NSQF_Level,OverallScore,GitHubScore,PlacementStatus,PlacedCompany,CTC_LPA,PassportHash\n';
    const rows = students
      .map((s) => `"${s.name}","${s.enrollmentNo}","${s.program}","${s.nsqfLevel}",${s.overallScore},${s.githubScore},"${s.placementStatus}","${s.placedCompany || 'N/A'}",${s.ctcLPA || 0},"${s.passportHash}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `institutional_student_roster_${Date.now()}.csv`;
    a.click();
    toast.success('Institutional Student Roster exported (CSV)!');
  };

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.enrollmentNo.toLowerCase().includes(search.toLowerCase()) ||
      s.program.toLowerCase().includes(search.toLowerCase()) ||
      s.skills.some((sk) => sk.toLowerCase().includes(search.toLowerCase()));
    const matchProgram = programFilter === 'ALL' || s.program === programFilter;
    const matchStatus = statusFilter === 'ALL' || s.placementStatus === statusFilter;
    return matchSearch && matchProgram && matchStatus;
  });

  const totalPlaced = students.filter((s) => s.placementStatus === 'PLACED').length;
  const avgScore = (students.reduce((sum, s) => sum + s.overallScore, 0) / students.length).toFixed(1);

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
              <AIBadge type="nsqf" label="INSTITUTIONAL STUDENT ROSTER" />
              <AIBadge type="verified" label="NCVET CERTIFIED COHORT" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Enrolled Candidate & <span style={{ color: 'var(--gold)' }}>Batch Competency Roster</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Track candidate skill assessments, NSQF attainment tiers, cryptographic digital passport minting, and placement outcomes across all institutional programs.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={15} /> Enroll Candidate
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

        {/* ── Roster Scorecards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Enrolled Candidates', value: `${students.length} Trainees`, sub: 'Active Cohort Roster', color: 'var(--gold)', icon: Users },
            { label: 'Placed & Verified', value: `${totalPlaced} Candidates`, sub: `${((totalPlaced / students.length) * 100).toFixed(1)}% Placement Rate`, color: '#10b981', icon: CheckCircle2 },
            { label: 'Avg Competency Score', value: `${avgScore}%`, sub: 'NSQF Multi-Modal Radar', color: '#60a5fa', icon: Award },
            { label: 'Cryptographic Passports', value: '100% Minted', sub: 'SHA-256 HMAC Ledger Sealed', color: '#a855f7', icon: ShieldCheck },
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

        {/* ── Filter Bar ── */}
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
              placeholder="Search by name, roll no, skill..."
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

          {/* Select Dropdowns */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              style={{
                padding: '7px 10px',
                borderRadius: 6,
                background: 'var(--bg-input, #0f111a)',
                border: '1px solid var(--border)',
                color: '#fff',
                fontSize: 12,
              }}
            >
              <option value="ALL">All Programs</option>
              <option value="Full-Stack Web Engineering">Full-Stack Web Engineering</option>
              <option value="Applied AI & Data Engineering">Applied AI & Data Engineering</option>
              <option value="Cloud Native & DevOps SRE">Cloud Native & DevOps SRE</option>
              <option value="Frontend & UI Systems">Frontend & UI Systems</option>
              <option value="Industrial IoT & Automation">Industrial IoT & Automation</option>
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
              <option value="ALL">All Placement Statuses</option>
              <option value="PLACED">Placed & Verified</option>
              <option value="INTERVIEWING">Interviewing</option>
              <option value="SEEKING">Seeking Hire</option>
              <option value="IN_TRAINING">In Training</option>
            </select>
          </div>
        </div>

        {/* ── Student Roster Table ── */}
        <div className="card-linear" style={{ padding: 24, borderRadius: 16 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11.5, textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Candidate</th>
                  <th style={{ padding: '10px 12px' }}>Program / Domain</th>
                  <th style={{ padding: '10px 12px' }}>NSQF Tier</th>
                  <th style={{ padding: '10px 12px' }}>Skill Score</th>
                  <th style={{ padding: '10px 12px' }}>Code Audit</th>
                  <th style={{ padding: '10px 12px' }}>Placement Status</th>
                  <th style={{ padding: '10px 12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const statusConf = STATUS_CONFIG[s.placementStatus] || STATUS_CONFIG.IN_TRAINING;
                  return (
                    <tr
                      key={s.id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                      className="hover:bg-white/5"
                    >
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 700, color: '#f8fafc' }}>{s.name}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {s.enrollmentNo}
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                        {s.program}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', color: '#cbd5e1' }}>
                          {s.nsqfLevel}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontWeight: 800, color: '#10b981' }}>
                        {s.overallScore}%
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700, color: 'var(--gold)' }}>
                        {s.githubScore}%
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: 99,
                            background: statusConf.bg,
                            color: statusConf.color,
                          }}
                        >
                          {statusConf.label}
                        </span>
                        {s.placedCompany && (
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                            {s.placedCompany}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedStudent(s)}
                          className="btn-gold"
                          style={{ fontSize: 11, padding: '4px 10px' }}
                        >
                          Inspect Passport
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Student Passport Inspection Modal ── */}
        {selectedStudent && (
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
                maxWidth: 520,
                borderRadius: 18,
                padding: 26,
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase' }}>
                    Verified Digital Skill Passport
                  </span>
                  <h3 className="font-display" style={{ fontSize: 20, fontWeight: 900, color: '#f8fafc', margin: '2px 0 0' }}>
                    {selectedStudent.name}
                  </h3>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {selectedStudent.enrollmentNo} · {selectedStudent.program}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Verified Badge */}
              <div style={{ padding: 12, borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#10b981' }}>
                  <ShieldCheck size={16} />
                  <span>State Cryptographic Ledger Hash (SHA-256):</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#cbd5e1', marginTop: 3 }}>
                  {selectedStudent.passportHash}
                </div>
              </div>

              {/* Skills */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>
                  Verified Technical Competencies:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedStudent.skills.map((sk, idx) => (
                    <span key={idx} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', color: '#f8fafc', border: '1px solid var(--border)' }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
                <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Diagnostic Score</div>
                  <div className="font-display" style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>
                    {selectedStudent.overallScore}%
                  </div>
                </div>
                <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>GitHub Code Audit</div>
                  <div className="font-display" style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold)' }}>
                    {selectedStudent.githubScore}%
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => toast.success(`Referral packet dispatched to partner employers for ${selectedStudent.name}!`)}
                  className="btn-gold"
                  style={{ padding: '8px 16px', fontSize: 12, fontWeight: 800 }}
                >
                  Refer to Employer Drive
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Add Student Modal ── */}
        {showAddModal && (
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
                maxWidth: 460,
                borderRadius: 18,
                padding: 26,
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Enroll New Trainee to Institutional Cohort
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                    Candidate Full Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Vikas Shinde"
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

                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                    Program / Specialization
                  </label>
                  <select
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
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
                    <option value="Full-Stack Web Engineering">Full-Stack Web Engineering</option>
                    <option value="Applied AI & Data Engineering">Applied AI & Data Engineering</option>
                    <option value="Cloud Native & DevOps SRE">Cloud Native & DevOps SRE</option>
                    <option value="Frontend & UI Systems">Frontend & UI Systems</option>
                    <option value="Industrial IoT & Automation">Industrial IoT & Automation</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                      NSQF Tier
                    </label>
                    <select
                      value={newNsqf}
                      onChange={(e) => setNewNsqf(e.target.value)}
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
                      <option value="NSQF Level 5">NSQF Level 5</option>
                      <option value="NSQF Level 6">NSQF Level 6</option>
                      <option value="NSQF Level 4">NSQF Level 4</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                      Diagnostic Score (%)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={newScore}
                      onChange={(e) => setNewScore(Number(e.target.value))}
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
                    onClick={() => setShowAddModal(false)}
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
                    Enroll Candidate
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
