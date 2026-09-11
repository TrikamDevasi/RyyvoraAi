'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Search,
  Lock,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ExternalLink,
  Building2,
  MapPin,
  TrendingUp,
  Filter,
} from 'lucide-react';
import api from '@/lib/api';
import { getAllDomains } from '@/lib/domains';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import toast from 'react-hot-toast';

const GOLD = '#D4A843';
const ALL_DOMAINS = getAllDomains();

interface RankedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  domain: string;
  salaryRange: string;
  nsqfMinLevel: number;
  experience: string;
  employmentType: string;
  description: string;
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  matchScore: number;
  applyUrl: string;
}

export default function FindJobsPage() {
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [currentTier, setCurrentTier] = useState('free');
  const [jobs, setJobs] = useState<RankedJob[]>([]);
  const [previewJobs, setPreviewJobs] = useState<any[]>([]);
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      setLoading(true);
      try {
        const res = await api.get('/jobs/matches', {
          params: { domain: selectedDomain !== 'ALL' ? selectedDomain : undefined },
        });

        const data = res.data?.data;
        if (cancelled) return;

        if (data?.locked) {
          setIsLocked(true);
          setCurrentTier(data.currentTier || 'free');
          setPreviewJobs(data.previewJobs || []);
        } else {
          setIsLocked(false);
          setCurrentTier(data?.currentTier || 'starter');
          setJobs(data?.jobs || []);
        }
      } catch (err: any) {
        if (cancelled) return;
        console.error('Error fetching job matches:', err);
        toast.error('Unable to load jobs stream. Showing demo requisitions.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadJobs();
    return () => {
      cancelled = true;
    };
  }, [selectedDomain]);

  const filteredJobs = jobs.filter((job) => {
    const q = search.toLowerCase();
    return (
      q === '' ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q)
    );
  });

  return (
    <ErrorBoundary>
      <div style={{ maxWidth: 1100, color: '#fff', margin: '0 auto', paddingBottom: 60 }}>
        {/* Header Bar */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(212,168,67,0.12)',
                border: '1px solid rgba(212,168,67,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold)',
              }}
            >
              <Briefcase size={18} />
            </div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
              AI Verified <span style={{ color: 'var(--gold)' }}>Job Matches</span>
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>
            Direct employment requisitions ranked dynamically against your cryptographic Skill Passport competencies.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Skeleton height={180} width="100%" />
            <Skeleton height={180} width="100%" />
          </div>
        ) : isLocked ? (
          /* ── LOCKED SCREEN FOR FREE TIER ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(212,168,67,0.06) 0%, rgba(15,17,26,0.95) 100%)',
                border: '2px solid rgba(212,168,67,0.35)',
                borderRadius: 20,
                padding: '40px 32px',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.85)',
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'rgba(212,168,67,0.12)',
                  border: '2px solid var(--gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: 'var(--gold)',
                }}
              >
                <Lock size={32} />
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 99,
                  background: 'rgba(212,168,67,0.1)',
                  border: '1px solid rgba(212,168,67,0.3)',
                  color: 'var(--gold)',
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 14,
                }}
              >
                <Sparkles size={13} />
                <span>PREMIUM SUITE FEATURE</span>
              </div>

              <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 10px' }}>
                Direct Job Matching Engine is Locked on the Free Tier
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14.5, maxWidth: 640, margin: '0 auto 28px', lineHeight: 1.6 }}>
                Your current plan includes verified credentials and foundational diagnostics. Unlock live automated candidate routing to over 150+ verified enterprise hiring partners.
              </p>

              {/* Tier Comparison Table */}
              <div
                style={{
                  maxWidth: 680,
                  margin: '0 auto 32px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  overflow: 'hidden',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1fr 1fr',
                    padding: '12px 18px',
                    background: 'var(--bg-surface-elevated)',
                    borderBottom: '1px solid var(--border)',
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                  }}
                >
                  <div>Capability</div>
                  <div style={{ textAlign: 'center' }}>Free (Current)</div>
                  <div style={{ textAlign: 'center', color: 'var(--gold)' }}>Starter (₹1,999/mo)</div>
                </div>

                {[
                  { feature: 'Digital Skill Passport', free: true, starter: true },
                  { feature: 'Adaptive Skills Assessment', free: true, starter: true },
                  { feature: 'Direct AI Job Match Engine', free: false, starter: true },
                  { feature: 'Priority Employer Placement Routing', free: false, starter: true },
                  { feature: 'NSQF Endorsement Certificate Export', free: false, starter: true },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.5fr 1fr 1fr',
                      padding: '12px 18px',
                      borderBottom: idx < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      fontSize: 13,
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ color: '#fff', fontWeight: 500 }}>{row.feature}</div>
                    <div style={{ textAlign: 'center' }}>
                      {row.free ? <CheckCircle2 size={16} color="var(--emerald)" style={{ margin: '0 auto' }} /> : <XCircle size={16} color="#ef4444" style={{ margin: '0 auto' }} />}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <CheckCircle2 size={16} color="var(--gold)" style={{ margin: '0 auto' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Upgrade CTA */}
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  href="/pricing?tier=starter"
                  style={{
                    padding: '12px 28px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, var(--gold), #f59e0b)',
                    color: '#08060f',
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  Upgrade to Starter Plan <ArrowRight size={16} />
                </Link>

                <button
                  onClick={() => {
                    // Demo override for testing
                    setSelectedDomain('CSE');
                    window.location.href = '/student/jobs?forceTier=starter';
                  }}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Test Starter Tier (Hackathon Demo)
                </button>
              </div>
            </div>

            {/* Blurred Teaser Preview of Enterprise Jobs */}
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 14px', color: 'var(--text-muted)' }}>
                Sample Active Requisitions from Verified Employers
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, filter: 'blur(2px)', opacity: 0.65 }}>
                {(previewJobs.length > 0
                  ? previewJobs
                  : [
                      { title: 'Full-Stack Cloud Engineer', company: 'Tata Consultancy Services', location: 'Pune', salaryRange: '₹8,50,000 - ₹13,00,000 / yr' },
                      { title: 'DevOps Associate', company: 'Infosys Cloud', location: 'Mumbai', salaryRange: '₹7,50,000 - ₹11,50,000 / yr' },
                      { title: 'Junior ML Engineer', company: 'Reliance Jio AI', location: 'Navi Mumbai', salaryRange: '₹9,00,000 - ₹14,00,000 / yr' },
                    ]
                ).map((pj, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                      padding: 18,
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{pj.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--gold)', marginTop: 4 }}>{pj.company}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{pj.location} · {pj.salaryRange}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── UNLOCKED JOBS STREAM ── */
          <div>
            {/* Filter Controls Bar */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 14,
                marginBottom: 24,
              }}
            >
              {/* Search */}
              <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: 11 }} />
                <input
                  type="text"
                  placeholder="Search by job title, company, or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: 8,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    color: '#fff',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Domain Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Filter size={15} color="var(--text-muted)" />
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="ALL">All Disciplines</option>
                  {ALL_DOMAINS.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Cards Grid */}
            {filteredJobs.length === 0 ? (
              <div
                style={{
                  padding: 40,
                  textAlign: 'center',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                }}
              >
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No job requisitions found matching your filter.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 16,
                      padding: '24px 28px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    {/* Header: Title, Company, Match Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>{job.title}</h2>
                          <span
                            style={{
                              fontSize: 11,
                              padding: '2px 8px',
                              borderRadius: 6,
                              background: 'rgba(212,168,67,0.1)',
                              border: '1px solid rgba(212,168,67,0.25)',
                              color: 'var(--gold)',
                              fontWeight: 700,
                            }}
                          >
                            {job.domain}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Building2 size={14} color="var(--gold)" /> {job.company}
                          </span>
                          <span>•</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MapPin size={14} color="var(--emerald)" /> {job.location}
                          </span>
                          <span>•</span>
                          <span>{job.salaryRange}</span>
                        </div>
                      </div>

                      {/* Match Score Gauge */}
                      <div
                        style={{
                          padding: '8px 14px',
                          borderRadius: 10,
                          background: job.matchScore >= 80 ? 'rgba(16,185,129,0.12)' : 'rgba(212,168,67,0.12)',
                          border: `1px solid ${job.matchScore >= 80 ? 'var(--emerald)' : 'var(--gold)'}`,
                          textAlign: 'right',
                        }}
                      >
                        <div style={{ fontSize: 18, fontWeight: 900, color: job.matchScore >= 80 ? 'var(--emerald)' : 'var(--gold)' }}>
                          {job.matchScore}% Match
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>AI Passport Ranking</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      {job.description}
                    </p>

                    {/* Skills Breakdown */}
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>
                        Competencies Assessment:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {job.matchedSkills.map((s, idx) => (
                          <span
                            key={idx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '3px 8px',
                              borderRadius: 6,
                              background: 'rgba(16,185,129,0.1)',
                              border: '1px solid rgba(16,185,129,0.3)',
                              color: 'var(--emerald)',
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            <CheckCircle2 size={11} /> {s}
                          </span>
                        ))}
                        {job.missingSkills.map((s, idx) => (
                          <span
                            key={idx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '3px 8px',
                              borderRadius: 6,
                              background: 'rgba(245,158,11,0.08)',
                              border: '1px solid rgba(245,158,11,0.25)',
                              color: 'var(--gold)',
                              fontSize: 11,
                            }}
                          >
                            Suggested: {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        Min Requirement: NSQF Level {job.nsqfMinLevel} · {job.employmentType}
                      </div>

                      <button
                        onClick={() => {
                          toast.success(`Application submitted to ${job.company} via your Verified Skill Passport!`);
                        }}
                        style={{
                          padding: '8px 18px',
                          borderRadius: 8,
                          background: 'linear-gradient(135deg, var(--emerald), #059669)',
                          color: '#090a0f',
                          fontSize: 13,
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        Apply with Skill Passport <ExternalLink size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}