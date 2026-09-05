'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { instituteApi, InstituteStudent } from '@/lib/api/institute.api';
import {
  Users,
  Search,
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
  RefreshCw,
  AlertTriangle,
  Upload,
  UserCheck,
  CheckCircle,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';

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

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  PLACED: { label: 'Placed & Verified', bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  INTERVIEWING: { label: 'Interviewing', bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  SEEKING: { label: 'Seeking Hire', bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  IN_TRAINING: { label: 'In Training', bg: 'rgba(192,132,252,0.12)', color: '#c084fc' },
};

const STATUS_MAP: Record<string, StudentRosterItem['placementStatus']> = {
  placed: 'PLACED',
  seeking: 'SEEKING',
  studying: 'IN_TRAINING',
  higher_education: 'SEEKING',
};

function mapStudent(s: InstituteStudent): StudentRosterItem {
  return {
    id: s._id,
    name: s.userId?.name || 'Unnamed Trainee',
    enrollmentNo: s.enrollmentNumber || 'Not assigned',
    program: s.program || 'General',
    nsqfLevel: `NSQF Level ${s.nsqfLevel || 5}`,
    overallScore: s.overallScore || 0,
    githubScore: s.overallScore || 0,
    placementStatus: STATUS_MAP[s.placementStatus] || 'IN_TRAINING',
    placedCompany: s.placementStatus === 'placed' ? 'Verified Placement' : undefined,
    ctcLPA: s.salary ? Math.round((s.salary / 1000000) * 10) / 10 : undefined,
    passportHash: s.passportHash || 'Passport not issued',
    skills: (s.skills || [])
      .map((k: any) => (typeof k.skillId === 'object' && k.skillId?.name ? k.skillId.name : String(k.skillId || '')))
      .filter((x) => x),
  };
}

export default function StudentsPage() {
  const { user } = useAuth();
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentRosterItem[]>([]);
  const [search, setSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentRosterItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [programs, setPrograms] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    program: '',
    nsqfLevel: 5,
    gender: 'male',
    batch: '2025-2026',
  });
  const [submittingStudent, setSubmittingStudent] = useState(false);
  const [enrollMode, setEnrollMode] = useState<'form' | 'csv'>('form');

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionId) {
      toast.error('No institution linked to this account.');
      return;
    }
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please enter candidate name and email.');
      return;
    }
    setSubmittingStudent(true);
    try {
      await instituteApi.createStudent(institutionId, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        program: formData.program.trim() || (programs[0] || 'MSSDS Advanced Web Engineering'),
        nsqfLevel: Number(formData.nsqfLevel) || 5,
        gender: formData.gender,
        batch: formData.batch,
      });
      toast.success('Candidate enrolled & SHA-256 Skill Passport generated!');
      setFormData({
        name: '',
        email: '',
        program: '',
        nsqfLevel: 5,
        gender: 'male',
        batch: '2025-2026',
      });
      setShowAddModal(false);
      loadStudents();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Enrollment failed. Please verify candidate details.');
    } finally {
      setSubmittingStudent(false);
    }
  };

  const loadStudents = async () => {
    const instId = instituteApi.getInstitutionId(user);
    if (!instId) {
      setLoading(false);
      setError('No institution is linked to this account.');
      return;
    }
    setInstitutionId(instId);
    setLoading(true);
    setError(null);
    try {
      const data = await instituteApi.getStudents(instId, { limit: 200 });
      setStudents(data.map(mapStudent));
      setPrograms(Array.from(new Set(data.map((s) => s.program || 'General'))));
    } catch (err: any) {
      const msg = err?.response?.status === 404
        ? 'No institution roster found for this account.'
        : 'Unable to load the student roster. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [user?.institutionId, user?._id, user?.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!institutionId) {
      toast.error('No institution linked to this account.');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post(`/institutes/${institutionId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Cohort roster uploaded successfully!');
      loadStudents();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExportCSV = () => {
    const headers = 'Name,EnrollmentNo,Program,NSQF_Level,OverallScore,PlacementStatus,PassportHash\n';
    const rows = students
      .map((s) => `"${s.name}","${s.enrollmentNo}","${s.program}","${s.nsqfLevel}",${s.overallScore},"${s.placedCompany || ''}","${s.passportHash}"`)
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
  const avgScore = students.length ? (students.reduce((sum, s) => sum + s.overallScore, 0) / students.length).toFixed(1) : '0';

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
              Track candidate skill assessments, NSQF attainment tiers, and placement outcomes across all institutional programs.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6, cursor: uploading ? 'not-allowed' : 'pointer' }}
            >
              <Upload size={15} /> {uploading ? 'Uploading...' : 'Bulk Upload CSV'}
            </button>
            <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileUpload} />
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={students.length === 0}
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
            { label: 'Placed & Verified', value: `${totalPlaced} Candidates`, sub: students.length ? `${((totalPlaced / students.length) * 100).toFixed(1)}% Placement Rate` : 'No placements yet', color: '#10b981', icon: CheckCircle2 },
            { label: 'Avg Competency Score', value: `${avgScore}%`, sub: 'NSQF Multi-Modal Radar', color: '#60a5fa', icon: Award },
            { label: 'Cryptographic Passports', value: `${students.filter((s) => s.passportHash && s.passportHash !== 'Passport not issued').length} Sealed`, sub: 'SHA-256 HMAC Ledger', color: '#a855f7', icon: ShieldCheck },
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

        {/* ── Loading / Error / Empty states ── */}
        {loading && (
          <div className="card-linear" style={{ padding: 32, borderRadius: 14, textAlign: 'center' }}>
            <RefreshCw size={26} style={{ color: 'var(--gold)', animation: 'spin 1.5s linear infinite', marginBottom: 8 }} />
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Loading institutional roster...</p>
          </div>
        )}

        {!loading && error && (
          <div className="card-linear" style={{ padding: 32, borderRadius: 14, textAlign: 'center', marginBottom: 20 }}>
            <AlertTriangle size={28} style={{ color: 'var(--gold)', marginBottom: 8 }} />
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 12px' }}>{error}</p>
            <button onClick={loadStudents} className="btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        )}

        {!loading && !error && students.length === 0 && (
          <div className="card-linear" style={{ padding: 32, borderRadius: 14, textAlign: 'center', marginBottom: 20 }}>
            <Users size={32} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
            <p style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', margin: '0 0 4px' }}>No students in this roster yet</p>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 12px' }}>Upload a CSV cohort to populate your institutional roster.</p>
            <button onClick={() => fileInputRef.current?.click()} className="btn-gold" style={{ fontSize: 12.5, padding: '8px 18px' }}>
              <Upload size={14} /> Bulk Upload CSV
            </button>
          </div>
        )}

        {!loading && !error && students.length > 0 && (
        <>

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
              {programs.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
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
        </>
        )}

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

        {/* ── Enrollment Modal (Interactive Form & CSV Upload) ── */}
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
                maxWidth: 520,
                borderRadius: 18,
                padding: 26,
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <UserCheck size={18} color="var(--gold)" /> Enroll Candidate
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 18, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                <button
                  type="button"
                  onClick={() => setEnrollMode('form')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: 'none',
                    background: enrollMode === 'form' ? 'rgba(212,175,55,0.15)' : 'transparent',
                    color: enrollMode === 'form' ? 'var(--gold)' : 'var(--text-muted)',
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Direct Enrollment
                </button>
                <button
                  type="button"
                  onClick={() => setEnrollMode('csv')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: 'none',
                    background: enrollMode === 'csv' ? 'rgba(212,175,55,0.15)' : 'transparent',
                    color: enrollMode === 'csv' ? 'var(--gold)' : 'var(--text-muted)',
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Upload size={13} /> Bulk Cohort CSV
                </button>
              </div>

              {enrollMode === 'form' ? (
                <form onSubmit={handleEnrollStudent} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohini Patil"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        color: '#f8fafc',
                        fontSize: 13,
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rohini.patil@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        color: '#f8fafc',
                        fontSize: 13,
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase' }}>
                        Program
                      </label>
                      <select
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'rgba(15,23,42,0.95)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          color: '#f8fafc',
                          fontSize: 12.5,
                          outline: 'none',
                        }}
                      >
                        <option value="">Select or default...</option>
                        {programs.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase' }}>
                        NSQF Level
                      </label>
                      <select
                        value={formData.nsqfLevel}
                        onChange={(e) => setFormData({ ...formData, nsqfLevel: Number(e.target.value) })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'rgba(15,23,42,0.95)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          color: '#f8fafc',
                          fontSize: 12.5,
                          outline: 'none',
                        }}
                      >
                        <option value={3}>Level 3 (Certificate)</option>
                        <option value={4}>Level 4 (Vocational Diploma)</option>
                        <option value={5}>Level 5 (Advanced Diploma)</option>
                        <option value={6}>Level 6 (B.Voc / Technical)</option>
                        <option value={7}>Level 7 (Post-Graduate)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase' }}>
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'rgba(15,23,42,0.95)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          color: '#f8fafc',
                          fontSize: 12.5,
                          outline: 'none',
                        }}
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase' }}>
                        Academic Batch
                      </label>
                      <input
                        type="text"
                        value={formData.batch}
                        onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          color: '#f8fafc',
                          fontSize: 13,
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      style={{
                        padding: '10px 16px',
                        borderRadius: 8,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border)',
                        color: '#cbd5e1',
                        fontSize: 12.5,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingStudent}
                      className="btn-gold"
                      style={{
                        padding: '10px 20px',
                        fontSize: 12.5,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        opacity: submittingStudent ? 0.7 : 1,
                        cursor: submittingStudent ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {submittingStudent ? (
                        <>
                          <RefreshCw size={14} className="spin" /> Generating Passport...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} /> Enroll Candidate & Generate Passport
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                    Upload a cohort roster CSV with columns: <code>name, email, program, nsqfLevel, gender, batch</code>. Ryyvora AI automatically parses the records, validates DPDP consent boundaries, and generates SHA-256 verifiable credentials.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#cbd5e1', fontSize: 12, cursor: 'pointer' }}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowAddModal(false); fileInputRef.current?.click(); }}
                      className="btn-gold"
                      style={{ padding: '8px 18px', fontSize: 12.5, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <Upload size={14} /> Select & Upload CSV
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}
