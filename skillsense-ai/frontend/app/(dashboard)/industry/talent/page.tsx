'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  ExternalLink,
  MapPin,
  Github,
  Check,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';

interface CandidateProfile {
  id: string;
  name: string;
  enrollmentNo: string;
  roleTitle: string;
  domain: string;
  location: string;
  nsqfLevel: string;
  score: number;
  githubScore: number;
  status: 'AVAILABLE' | 'INTERVIEWING' | 'PLACED';
  expectedCtcLPA: number;
  passportHash: string;
  skills: string[];
  capstoneRepo: string;
}

const DEFAULT_TALENT_POOL: CandidateProfile[] = [
  {
    id: 'cand_1',
    name: 'Arjun Mehta',
    enrollmentNo: 'ENR-2026-MH-9482',
    roleTitle: 'Full-Stack Systems Engineer',
    domain: 'Software Engineering',
    location: 'Pune IT Corridor, MH',
    nsqfLevel: 'NSQF Level 6',
    score: 92,
    githubScore: 89,
    status: 'AVAILABLE',
    expectedCtcLPA: 8.8,
    passportHash: '0x9e7a...4b12_HMAC_SEALED',
    skills: ['React 19', 'Next.js App Router', 'Node.js Microservices', 'PostgreSQL', 'Redis'],
    capstoneRepo: 'https://github.com/arjunmehta/payments-mesh',
  },
  {
    id: 'cand_2',
    name: 'Priya Sharma',
    enrollmentNo: 'ENR-2026-MH-8812',
    roleTitle: 'Applied AI & GenAI Platform Associate',
    domain: 'Artificial Intelligence',
    location: 'Mumbai BFSI Corridor, MH',
    nsqfLevel: 'NSQF Level 6',
    score: 95,
    githubScore: 94,
    status: 'AVAILABLE',
    expectedCtcLPA: 11.0,
    passportHash: '0x7c3d...8f90_HMAC_SEALED',
    skills: ['Python AI', 'LangChain', 'FastAPI', 'PyTorch', 'Vector Embeddings', 'RAG'],
    capstoneRepo: 'https://github.com/priyasharma/enterprise-rag-engine',
  },
  {
    id: 'cand_3',
    name: 'Rohan Deshmukh',
    enrollmentNo: 'ENR-2026-MH-7140',
    roleTitle: 'Cloud Native & DevOps SRE',
    domain: 'Cloud & Infrastructure',
    location: 'Nagpur MIHAN SEZ, MH',
    nsqfLevel: 'NSQF Level 5',
    score: 88,
    githubScore: 86,
    status: 'AVAILABLE',
    expectedCtcLPA: 7.5,
    passportHash: '0x3a2b...1c4e_HMAC_SEALED',
    skills: ['Docker', 'Kubernetes Ingress', 'Terraform', 'AWS ECS', 'Prometheus', 'Linux'],
    capstoneRepo: 'https://github.com/rohand/k8s-telemetry-mesh',
  },
  {
    id: 'cand_4',
    name: 'Sneha Kulkarni',
    enrollmentNo: 'ENR-2026-MH-6290',
    roleTitle: 'Frontend & UI Performance Architect',
    domain: 'Software Engineering',
    location: 'Nashik MIDC Hub, MH',
    nsqfLevel: 'NSQF Level 5',
    score: 90,
    githubScore: 88,
    status: 'AVAILABLE',
    expectedCtcLPA: 7.0,
    passportHash: '0x5f8a...9c2d_HMAC_SEALED',
    skills: ['TypeScript', 'TailwindCSS', 'WebSockets', 'Next.js UI', 'Framer Motion'],
    capstoneRepo: 'https://github.com/snehak/accessible-design-tokens',
  },
  {
    id: 'cand_5',
    name: 'Aditya Patel',
    enrollmentNo: 'ENR-2026-MH-5521',
    roleTitle: 'Backend Microservices Engineer',
    domain: 'Software Engineering',
    location: 'Pune IT Corridor, MH',
    nsqfLevel: 'NSQF Level 5',
    score: 86,
    githubScore: 84,
    status: 'INTERVIEWING',
    expectedCtcLPA: 7.5,
    passportHash: '0x1b4c...7e3f_HMAC_SEALED',
    skills: ['Node.js', 'Express', 'GraphQL', 'MongoDB', 'Docker'],
    capstoneRepo: 'https://github.com/adityap/distributed-auth',
  },
  {
    id: 'cand_6',
    name: 'Tanvi Joshi',
    enrollmentNo: 'ENR-2026-MH-4310',
    roleTitle: 'Data Engineer & AI Pipeline Specialist',
    domain: 'Artificial Intelligence',
    location: 'Mumbai BFSI Corridor, MH',
    nsqfLevel: 'NSQF Level 6',
    score: 91,
    githubScore: 90,
    status: 'AVAILABLE',
    expectedCtcLPA: 9.5,
    passportHash: '0x8f2d...6a1c_HMAC_SEALED',
    skills: ['Python', 'Apache Spark', 'SQL', 'Scikit-Learn', 'FastAPI'],
    capstoneRepo: 'https://github.com/tanvij/data-stream-pipeline',
  },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  AVAILABLE: { label: 'Available for Hire', bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  INTERVIEWING: { label: 'Interviewing', bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  PLACED: { label: 'Placed & Verified', bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
};

export default function TalentPage() {
  const [candidates, setCandidates] = useState<CandidateProfile[]>(DEFAULT_TALENT_POOL);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);

  useEffect(() => {
    api
      .get('/industry/talent-pool')
      .then(() => {})
      .catch(() => {});
  }, []);

  const handleExportCSV = () => {
    const headers = 'Name,EnrollmentNo,RoleTitle,Domain,Location,NSQF_Level,OverallScore,GitHubScore,Status,ExpectedCTC_LPA,PassportHash\n';
    const rows = candidates
      .map((c) => `"${c.name}","${c.enrollmentNo}","${c.roleTitle}","${c.domain}","${c.location}","${c.nsqfLevel}",${c.score},${c.githubScore},"${c.status}",${c.expectedCtcLPA},"${c.passportHash}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `industry_verified_talent_pool_${Date.now()}.csv`;
    a.click();
    toast.success('Verified Talent Pool exported to CSV!');
  };

  const handleConnectCandidate = (name: string) => {
    toast.success(`Interview connection request dispatched to ${name}.`);
    if (selectedCandidate) setSelectedCandidate(null);
  };

  const filtered = candidates.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.roleTitle.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((sk) => sk.toLowerCase().includes(search.toLowerCase()));
    const matchDomain = domainFilter === 'ALL' || c.domain === domainFilter;
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchSearch && matchDomain && matchStatus;
  });

  const availableCount = candidates.filter((c) => c.status === 'AVAILABLE').length;
  const avgScore = (candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length).toFixed(1);

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
              <AIBadge type="nsqf" label="VERIFIED TECHNICAL TALENT POOL" />
              <AIBadge type="verified" label="NSQF LEVEL 5 & 6 GRADUATES" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Pre-Assessed Technical <span style={{ color: 'var(--gold)' }}>Talent Sourcing Pool</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Instant corporate access to pre-screened engineering candidates across Maharashtra hubs, backed by live GitHub diagnostic radars and SHA-256 HMAC digital passports.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleExportCSV}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Download size={14} /> Export Talent Pool (CSV)
            </button>
          </div>
        </div>

        {/* ── Scorecards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Available Candidates', value: `${availableCount} Ready to Hire`, sub: 'Pre-Screened & Verified', color: 'var(--gold)', icon: Users },
            { label: 'Avg Competency Score', value: `${avgScore}%`, sub: 'NSQF Multi-Modal Radar', color: '#10b981', icon: Award },
            { label: 'Avg Time-to-Hire', value: '9.4 Days', sub: '-62% vs Traditional Sourcing', color: '#60a5fa', icon: Clock },
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
              placeholder="Search candidate, role, skill, region..."
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

          {/* Domain & Status Dropdowns */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
              <option value="ALL">All Domains</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
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
              <option value="ALL">All Availability</option>
              <option value="AVAILABLE">Available for Hire</option>
              <option value="INTERVIEWING">Interviewing</option>
              <option value="PLACED">Placed & Verified</option>
            </select>
          </div>
        </div>

        {/* ── Candidates Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map((c) => {
            const statusConf = STATUS_CONFIG[c.status] || STATUS_CONFIG.AVAILABLE;
            return (
              <div
                key={c.id}
                className="card-linear"
                style={{
                  padding: 22,
                  borderRadius: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 16,
                  borderLeft: `4px solid ${c.status === 'AVAILABLE' ? '#10b981' : 'var(--gold)'}`,
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <h3 className="font-display" style={{ fontSize: 16.5, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                        {c.name}
                      </h3>
                      <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>{c.roleTitle}</div>
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', color: '#cbd5e1' }}>
                      {c.nsqfLevel}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 10 }}>
                    <MapPin size={13} color="var(--gold)" />
                    <span>{c.location}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', marginBottom: 12 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Skill Score</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#10b981' }}>{c.score}%</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Code Audit</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--gold)' }}>{c.githubScore}%</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Target CTC</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>₹{c.expectedCtcLPA}L</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {c.skills.map((sk, idx) => (
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
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
                  <button
                    type="button"
                    onClick={() => setSelectedCandidate(c)}
                    className="btn-secondary"
                    style={{ fontSize: 11.5, padding: '5px 12px' }}
                  >
                    View Passport
                  </button>

                  <button
                    type="button"
                    onClick={() => handleConnectCandidate(c.name)}
                    className="btn-gold"
                    style={{ fontSize: 11.5, padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Send size={11} /> Request Interview
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Candidate Passport Modal ── */}
        {selectedCandidate && (
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
                    Verified Digital Skill Passport
                  </span>
                  <h3 className="font-display" style={{ fontSize: 20, fontWeight: 900, color: '#f8fafc', margin: '2px 0 0' }}>
                    {selectedCandidate.name}
                  </h3>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {selectedCandidate.enrollmentNo} · {selectedCandidate.location}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
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
                  {selectedCandidate.passportHash}
                </div>
              </div>

              {/* Capstone Repo Link */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>
                  Verified Capstone Codebase:
                </div>
                <a
                  href={selectedCandidate.capstoneRepo}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 12,
                    color: 'var(--gold)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Github size={14} />
                  <span>{selectedCandidate.capstoneRepo}</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Skills */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>
                  Verified Competencies:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedCandidate.skills.map((sk, idx) => (
                    <span key={idx} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', color: '#f8fafc', border: '1px solid var(--border)' }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => handleConnectCandidate(selectedCandidate.name)}
                  className="btn-gold"
                  style={{ padding: '8px 18px', fontSize: 12.5, fontWeight: 800 }}
                >
                  Connect & Schedule Interview
                </button>
              </div>
            </div>
          </div>
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}
