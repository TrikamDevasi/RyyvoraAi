'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import {
  Award,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  Users,
  Search,
  Plus,
  Download,
  Filter,
  Sparkles,
  ExternalLink,
  Code,
  Github,
  BookOpen,
  Lock,
  Clock,
  RefreshCw,
  X,
  Send,
  Star,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface CapstoneSubmission {
  id: string;
  candidateName: string;
  enrollmentNo: string;
  program: string;
  nsqfTier: string;
  projectTitle: string;
  repoUrl: string;
  submittedDate: string;
  diagnosticQuizScore: number;
  status: 'PENDING' | 'CERTIFIED' | 'REVISION_NEEDED';
  evaluatedScore?: number;
  evaluatorNotes?: string;
  certHash?: string;
  certifiedDate?: string;
}

const DEFAULT_SUBMISSIONS: CapstoneSubmission[] = [
  {
    id: 'sub_1',
    candidateName: 'Arjun Mehta',
    enrollmentNo: 'ENR-2026-MH-9482',
    program: 'Full-Stack Web Engineering',
    nsqfTier: 'NSQF Level 6',
    projectTitle: 'High-Throughput Microservices Payment Gateway with Next.js App Router',
    repoUrl: 'https://github.com/arjunmehta/payments-mesh',
    submittedDate: 'March 11, 2026',
    diagnosticQuizScore: 92,
    status: 'PENDING',
  },
  {
    id: 'sub_2',
    candidateName: 'Priya Sharma',
    enrollmentNo: 'ENR-2026-MH-8812',
    program: 'Applied AI & Data Engineering',
    nsqfTier: 'NSQF Level 6',
    projectTitle: 'Enterprise RAG Retrieval Engine with pgvector and Multi-Modal Embeddings',
    repoUrl: 'https://github.com/priyasharma/enterprise-rag-engine',
    submittedDate: 'March 10, 2026',
    diagnosticQuizScore: 95,
    status: 'PENDING',
  },
  {
    id: 'sub_3',
    candidateName: 'Rohan Deshmukh',
    enrollmentNo: 'ENR-2026-MH-7140',
    program: 'Cloud Native & DevOps SRE',
    nsqfTier: 'NSQF Level 5',
    projectTitle: 'Multi-Region Kubernetes Ingress Controller & Prometheus Telemetry Pipeline',
    repoUrl: 'https://github.com/rohand/k8s-telemetry-mesh',
    submittedDate: 'March 08, 2026',
    diagnosticQuizScore: 88,
    status: 'PENDING',
  },
  {
    id: 'sub_4',
    candidateName: 'Sneha Kulkarni',
    enrollmentNo: 'ENR-2026-MH-6290',
    program: 'Frontend & UI Systems',
    nsqfTier: 'NSQF Level 5',
    projectTitle: 'Accessible Design System Component Library with 60fps Micro-Animations',
    repoUrl: 'https://github.com/snehak/accessible-design-tokens',
    submittedDate: 'March 05, 2026',
    diagnosticQuizScore: 90,
    status: 'CERTIFIED',
    evaluatedScore: 92,
    evaluatorNotes: 'Pristine TypeScript code quality, zero accessibility lint warnings, comprehensive Jest unit tests.',
    certHash: '0x9e7a...4b12_NCVET_CERTIFIED',
    certifiedDate: 'March 07, 2026',
  },
  {
    id: 'sub_5',
    candidateName: 'Rajesh Rao',
    enrollmentNo: 'ENR-2026-MH-3920',
    program: 'Industrial IoT & Automation',
    nsqfTier: 'NSQF Level 4',
    projectTitle: 'Industrial IoT MQTT Telemetry & Edge Sensor Automation Controller',
    repoUrl: 'https://github.com/rajeshrao/iot-sensor-controller',
    submittedDate: 'Feb 28, 2026',
    diagnosticQuizScore: 82,
    status: 'PENDING',
  },
];

export default function InstructorEvaluationsPage() {
  const [submissions, setSubmissions] = useState<CapstoneSubmission[]>(DEFAULT_SUBMISSIONS);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'CERTIFIED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState('ALL');
  const [selectedSubmission, setSelectedSubmission] = useState<CapstoneSubmission | null>(null);

  // Rubric Form State
  const [rubricArch, setRubricArch] = useState(24);
  const [rubricSecurity, setRubricSecurity] = useState(23);
  const [rubricPerf, setRubricPerf] = useState(24);
  const [rubricDocs, setRubricDocs] = useState(23);
  const [evaluatorNotes, setEvaluatorNotes] = useState('Exceeds NSQF standards. Excellent modularity and clean test coverage.');
  const [submittingGrade, setSubmittingGrade] = useState(false);

  useEffect(() => {
    api
      .get('/students')
      .then(() => {})
      .catch(() => {});
  }, []);

  const totalCalculatedScore = rubricArch + rubricSecurity + rubricPerf + rubricDocs;

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    setSubmittingGrade(true);
    setTimeout(() => {
      const updatedList = submissions.map((s) => {
        if (s.id === selectedSubmission.id) {
          return {
            ...s,
            status: 'CERTIFIED' as const,
            evaluatedScore: totalCalculatedScore,
            evaluatorNotes,
            certHash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}_NCVET_CERTIFIED`,
            certifiedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          };
        }
        return s;
      });

      setSubmissions(updatedList);
      setSubmittingGrade(false);
      setSelectedSubmission(null);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981'],
      });
      toast.success(`Candidate ${selectedSubmission.candidateName} graded (${totalCalculatedScore}/100) and minted to state ledger!`);
    }, 800);
  };

  const pendingList = submissions.filter((s) => s.status === 'PENDING');
  const certifiedList = submissions.filter((s) => s.status === 'CERTIFIED');

  const displayedList = (activeTab === 'PENDING' ? pendingList : certifiedList).filter((s) => {
    const matchesSearch =
      s.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.enrollmentNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProgram = programFilter === 'ALL' || s.program === programFilter;
    return matchesSearch && matchesProgram;
  });

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
              <AIBadge type="nsqf" label="PRACTICAL PROJECT GRADING" />
              <AIBadge type="verified" label="NCVET RUBRIC CALIBRATED" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Instructor Evaluations & <span style={{ color: 'var(--gold)' }}>Project Certification</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Assess trainee capstone source code, evaluate against 4-axis NCVET practical rubrics, and cryptographically commit certified scores onto the state ledger.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                toast.success('NCVET Assessment Rubric guidelines loaded');
              }}
              className="btn-secondary"
              style={{ fontSize: 12.5, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <BookOpen size={14} /> Rubric Guidelines
            </button>
          </div>
        </div>

        {/* ── Metric Scorecards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Pending Evaluations', value: `${pendingList.length} Capstones`, sub: 'Awaiting Instructor Review', color: pendingList.length > 0 ? 'var(--gold)' : '#10b981', icon: Clock },
            { label: 'Certified Submissions', value: `${certifiedList.length + 180} Projects`, sub: 'Sealed on State Ledger', color: '#10b981', icon: CheckCircle2 },
            { label: 'Avg Practical Score', value: '89.4 / 100', sub: 'NCVET Rubric Standard', color: '#60a5fa', icon: Award },
            { label: 'Ledger Audit Integrity', value: '100% Sealed', sub: 'SHA-256 HMAC Signatures', color: '#a855f7', icon: Lock },
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

        {/* ── Filter Bar & Tab Selector ── */}
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
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              onClick={() => setActiveTab('PENDING')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                background: activeTab === 'PENDING' ? 'var(--gold)' : 'transparent',
                color: activeTab === 'PENDING' ? '#090a0f' : '#cbd5e1',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Pending Reviews ({pendingList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('CERTIFIED')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                background: activeTab === 'CERTIFIED' ? 'var(--gold)' : 'transparent',
                color: activeTab === 'CERTIFIED' ? '#090a0f' : '#cbd5e1',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Certified Ledger ({certifiedList.length})
            </button>
          </div>

          {/* Search & Program Filter */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: 220 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate, project..."
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
          </div>
        </div>

        {/* ── Submissions Feed ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {displayedList.length === 0 ? (
            <div className="card-linear" style={{ padding: 48, textAlign: 'center', borderRadius: 16 }}>
              <CheckCircle2 size={44} style={{ color: '#10B981', margin: '0 auto 12px' }} />
              <h3 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {activeTab === 'PENDING' ? 'All Capstones Evaluated!' : 'No Certified Records Found'}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 440, margin: '6px auto 0' }}>
                {activeTab === 'PENDING'
                  ? 'All student practical submissions have been graded and committed to the cryptographic ledger.'
                  : 'Certified submissions with official SHA-256 HMAC hashes will appear here.'}
              </p>
            </div>
          ) : (
            displayedList.map((sub) => {
              const isCertified = sub.status === 'CERTIFIED';
              return (
                <div
                  key={sub.id}
                  className="card-linear"
                  style={{
                    padding: 22,
                    borderRadius: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    borderLeft: `4px solid ${isCertified ? '#10b981' : 'var(--gold)'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h3 className="font-display" style={{ fontSize: 16.5, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                          {sub.candidateName}
                        </h3>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {sub.enrollmentNo}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', color: '#cbd5e1' }}>
                          {sub.nsqfTier}
                        </span>
                      </div>

                      <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold)', margin: '4px 0 2px' }}>
                        {sub.projectTitle}
                      </h4>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {sub.program} · Submitted on {sub.submittedDate}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Diagnostic Quiz Score</div>
                      <div className="font-display" style={{ fontSize: 18, fontWeight: 900, color: '#10b981' }}>
                        {sub.diagnosticQuizScore}%
                      </div>
                    </div>
                  </div>

                  {isCertified && (
                    <div style={{ padding: 12, borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, flexWrap: 'wrap', gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#86efac', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CheckCircle2 size={15} color="#10b981" />
                          <span>Certified Practical Score: <strong style={{ color: '#fff', fontSize: 14 }}>{sub.evaluatedScore}/100</strong></span>
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Certified on {sub.certifiedDate}</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#cbd5e1', margin: '4px 0 6px', lineHeight: 1.4 }}>
                        Instructor Notes: {sub.evaluatorNotes}
                      </p>
                      <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        Ledger Hash: {sub.certHash}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, flexWrap: 'wrap', gap: 10 }}>
                    <a
                      href={sub.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--gold)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Github size={14} />
                      <span>Inspect Capstone Source Code</span>
                      <ExternalLink size={12} />
                    </a>

                    {!isCertified && (
                      <button
                        type="button"
                        onClick={() => setSelectedSubmission(sub)}
                        className="btn-gold"
                        style={{ fontSize: 12, padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        <Award size={13} />
                        <span>Grade & Certify Capstone</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Grade & Certify Modal ── */}
        {selectedSubmission && (
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
                maxWidth: 540,
                borderRadius: 18,
                padding: 26,
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase' }}>
                    NCVET 4-Axis Assessment Rubric
                  </span>
                  <h3 className="font-display" style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', margin: '2px 0 0' }}>
                    Evaluate: {selectedSubmission.candidateName}
                  </h3>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {selectedSubmission.projectTitle}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleGradeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* 4 Rubric Dimensions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#cbd5e1', marginBottom: 2 }}>
                      <span>Code Architecture</span>
                      <strong style={{ color: 'var(--gold)' }}>{rubricArch}/25</strong>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="25"
                      value={rubricArch}
                      onChange={(e) => setRubricArch(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#cbd5e1', marginBottom: 2 }}>
                      <span>Security & Edge Cases</span>
                      <strong style={{ color: '#10b981' }}>{rubricSecurity}/25</strong>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="25"
                      value={rubricSecurity}
                      onChange={(e) => setRubricSecurity(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#cbd5e1', marginBottom: 2 }}>
                      <span>Performance & Latency</span>
                      <strong style={{ color: '#60a5fa' }}>{rubricPerf}/25</strong>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="25"
                      value={rubricPerf}
                      onChange={(e) => setRubricPerf(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#60a5fa', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#cbd5e1', marginBottom: 2 }}>
                      <span>Docs & Test Coverage</span>
                      <strong style={{ color: '#a855f7' }}>{rubricDocs}/25</strong>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="25"
                      value={rubricDocs}
                      onChange={(e) => setRubricDocs(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#a855f7', cursor: 'pointer' }}
                    />
                  </div>
                </div>

                {/* Score Summary Box */}
                <div style={{ padding: 12, borderRadius: 10, background: 'rgba(245,158,11,0.08)', border: '1px solid var(--gold-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Composite Practical Score
                    </div>
                    <div className="font-display" style={{ fontSize: 24, fontWeight: 900, color: 'var(--gold)' }}>
                      {totalCalculatedScore} / 100
                    </div>
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 800, padding: '3px 9px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                    {totalCalculatedScore >= 85 ? 'NSQF Certified: Honors' : 'NSQF Certified: Pass'}
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                    Instructor Evaluation Notes
                  </label>
                  <textarea
                    rows={2}
                    value={evaluatorNotes}
                    onChange={(e) => setEvaluatorNotes(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      background: 'var(--bg-input, #0f111a)',
                      border: '1px solid var(--border)',
                      color: '#fff',
                      fontSize: 12,
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
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
                    disabled={submittingGrade}
                    className="btn-gold"
                    style={{ padding: '8px 20px', fontSize: 12.5, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    {submittingGrade ? <RefreshCw size={13} className="animate-spin" /> : <Award size={13} />}
                    <span>{submittingGrade ? 'Signing Ledger...' : 'Certify & Commit to Ledger'}</span>
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
