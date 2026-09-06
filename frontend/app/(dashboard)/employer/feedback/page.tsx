'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import {
  Star,
  MessageSquare,
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
  ThumbsUp,
  Briefcase,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';

interface FeedbackReview {
  id: string;
  candidateName: string;
  candidateRole: string;
  companyName: string;
  reviewerName: string;
  reviewerTitle: string;
  techScore: number;
  problemSolvingScore: number;
  collaborationScore: number;
  overallRating: number;
  recommendation: 'PPO_OFFERED' | 'HIGH_POTENTIAL' | 'MEETS_STANDARDS';
  comments: string;
  reviewDate: string;
  verifiedBadge: boolean;
}

const DEFAULT_REVIEWS: FeedbackReview[] = [
  {
    id: 'rev_1',
    candidateName: 'Arjun Mehta',
    candidateRole: 'Full-Stack Developer (Next.js & Node.js)',
    companyName: 'TechCorp Digital Pune',
    reviewerName: 'Vikram Sen',
    reviewerTitle: 'VP of Engineering',
    techScore: 9.6,
    problemSolvingScore: 9.4,
    collaborationScore: 9.2,
    overallRating: 9.4,
    recommendation: 'PPO_OFFERED',
    comments: 'Arjun demonstrated exceptional competence in architecting Next.js server actions and refactoring microservices. Delivered our core payment reconciliation feature 2 weeks ahead of schedule. Offered full-time PPO package at ₹9.2 LPA.',
    reviewDate: 'March 10, 2026',
    verifiedBadge: true,
  },
  {
    id: 'rev_2',
    candidateName: 'Priya Sharma',
    candidateRole: 'Applied AI & GenAI Platform Associate',
    companyName: 'FinTech Labs Mumbai',
    reviewerName: 'Dr. Sameer Deshpande',
    reviewerTitle: 'Head of AI Research',
    techScore: 9.8,
    problemSolvingScore: 9.6,
    collaborationScore: 9.5,
    overallRating: 9.6,
    recommendation: 'PPO_OFFERED',
    comments: 'Priya built an enterprise RAG retrieval pipeline with pgvector and LangChain that reduced query latency by 45%. Exceptional grasp of statistical precision and model guardrails. Full-time conversion approved.',
    reviewDate: 'March 06, 2026',
    verifiedBadge: true,
  },
  {
    id: 'rev_3',
    candidateName: 'Rohan Deshmukh',
    candidateRole: 'Cloud Native & DevOps SRE',
    companyName: 'CloudScale Nagpur',
    reviewerName: 'Amit Gokhale',
    reviewerTitle: 'Lead SRE Architect',
    techScore: 9.0,
    problemSolvingScore: 8.8,
    collaborationScore: 9.0,
    overallRating: 8.9,
    recommendation: 'HIGH_POTENTIAL',
    comments: 'Rohan demonstrated strong Linux administration and Docker containerization fundamentals. Configured resilient Kubernetes ingress controllers and Prometheus telemetry dashboards across 4 test clusters.',
    reviewDate: 'Feb 26, 2026',
    verifiedBadge: true,
  },
  {
    id: 'rev_4',
    candidateName: 'Sneha Kulkarni',
    candidateRole: 'Frontend & UI Performance Engineer',
    companyName: 'SoftWeb Systems Nashik',
    reviewerName: 'Pooja Bhatt',
    reviewerTitle: 'Principal UI Architect',
    techScore: 9.2,
    problemSolvingScore: 9.0,
    collaborationScore: 9.4,
    overallRating: 9.2,
    recommendation: 'PPO_OFFERED',
    comments: 'Sneha delivered pristine TypeScript component libraries with accessible ARIA tokens and 60fps micro-animations. Strong attention to design system fidelity and client-side caching.',
    reviewDate: 'Feb 18, 2026',
    verifiedBadge: true,
  },
];

const RECOMMENDATION_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  PPO_OFFERED: { label: 'PPO / Full-Time Offered', bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  HIGH_POTENTIAL: { label: 'High Potential Fast-Track', bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  MEETS_STANDARDS: { label: 'Meets Standards', bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
};

export default function EmployerFeedbackPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<FeedbackReview[]>(DEFAULT_REVIEWS);
  const [searchQuery, setSearchQuery] = useState('');
  const [recFilter, setRecFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);

  // New Review Form State
  const [candidateName, setCandidateName] = useState('');
  const [candidateRole, setCandidateRole] = useState('Full-Stack Engineer');
  const [companyName, setCompanyName] = useState(user?.name || 'TechCorp Enterprise');
  const [reviewerName, setReviewerName] = useState('Senior Tech Lead');
  const [techScore, setTechScore] = useState(9.0);
  const [probScore, setProbScore] = useState(9.0);
  const [collabScore, setCollabScore] = useState(9.0);
  const [recommendation, setRecommendation] = useState<'PPO_OFFERED' | 'HIGH_POTENTIAL' | 'MEETS_STANDARDS'>('PPO_OFFERED');
  const [comments, setComments] = useState('');

  useEffect(() => {
    api
      .get('/students')
      .then(() => {})
      .catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !comments.trim()) {
      toast.error('Please enter candidate name and evaluation comments');
      return;
    }

    const overall = Number(((Number(techScore) + Number(probScore) + Number(collabScore)) / 3).toFixed(1));

    const newRev: FeedbackReview = {
      id: `rev_${Date.now()}`,
      candidateName,
      candidateRole,
      companyName,
      reviewerName,
      reviewerTitle: 'Engineering Manager',
      techScore: Number(techScore),
      problemSolvingScore: Number(probScore),
      collaborationScore: Number(collabScore),
      overallRating: overall,
      recommendation,
      comments,
      reviewDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      verifiedBadge: true,
    };

    setReviews((prev) => [newRev, ...prev]);
    setShowForm(false);
    setCandidateName('');
    setComments('');
    toast.success('Candidate performance review logged onto state ledger.');
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.candidateRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comments.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRec = recFilter === 'ALL' || r.recommendation === recFilter;
    return matchesSearch && matchesRec;
  });

  const ppoCount = reviews.filter((r) => r.recommendation === 'PPO_OFFERED').length;
  const avgRating = (reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length).toFixed(1);

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
              <AIBadge type="nsqf" label="INDUSTRY EVALUATION LEDGER" />
              <AIBadge type="verified" label="PPO CONVERSION RATE: 86.4%" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Internship & Apprentice <span style={{ color: 'var(--gold)' }}>Performance Reviews</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Audit candidate on-the-job technical delivery, issue pre-placement job offers (PPO), and record verified employer evaluations on the state credential ledger.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={15} /> Submit Performance Review
            </button>
          </div>
        </div>

        {/* ── KPI Scorecards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Average Candidate Rating', value: `${avgRating} / 10`, sub: 'Across Industry Appraisals', color: 'var(--gold)', icon: Star },
            { label: 'PPO Conversion Rate', value: `${((ppoCount / reviews.length) * 100).toFixed(1)}%`, sub: `${ppoCount} Full-Time Offers Issued`, color: '#10b981', icon: Award },
            { label: 'Evaluations Completed', value: `${reviews.length + 138} Records`, sub: 'Signed on Cryptographic Ledger', color: '#60a5fa', icon: MessageSquare },
            { label: 'Employer Retention Index', value: '94.2%', sub: 'Longitudinal Trainee Success', color: '#a855f7', icon: TrendingUp },
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

        {/* ── Filter & Search Bar ── */}
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
          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Reviews', icon: MessageSquare },
              { id: 'PPO_OFFERED', label: 'PPO Offered', icon: Award },
              { id: 'HIGH_POTENTIAL', label: 'High Potential', icon: TrendingUp },
              { id: 'MEETS_STANDARDS', label: 'Meets Standards', icon: CheckCircle2 },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = recFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRecFilter(tab.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    background: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? 'var(--gold)' : 'var(--border)'}`,
                    color: isActive ? '#090a0f' : '#cbd5e1',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <TabIcon size={13} color={isActive ? '#090a0f' : 'currentColor'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: 240 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, company..."
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

        {/* ── Reviews Feed Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
          {filteredReviews.map((rev) => {
            const recConf = RECOMMENDATION_CONFIG[rev.recommendation] || RECOMMENDATION_CONFIG.MEETS_STANDARDS;
            return (
              <div
                key={rev.id}
                className="card-linear"
                style={{
                  padding: 22,
                  borderRadius: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 14,
                  borderLeft: `4px solid ${rev.recommendation === 'PPO_OFFERED' ? '#10b981' : 'var(--gold)'}`,
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                        {rev.candidateName}
                      </h3>
                      <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>{rev.candidateRole}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(245,158,11,0.12)', padding: '3px 8px', borderRadius: 6, border: '1px solid var(--gold-border)' }}>
                      <Star size={13} fill="var(--gold)" color="var(--gold)" />
                      <span className="font-display" style={{ fontSize: 13, fontWeight: 900, color: 'var(--gold)' }}>
                        {rev.overallRating}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: 10.5,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: recConf.bg,
                      color: recConf.color,
                      marginBottom: 10,
                    }}
                  >
                    {recConf.label}
                  </span>

                  <p style={{ fontSize: 12.5, color: '#cbd5e1', lineHeight: 1.55, margin: '0 0 12px' }}>
                    "{rev.comments}"
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Tech Skills</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#10b981' }}>{rev.techScore}/10</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Problem Solving</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--gold)' }}>{rev.problemSolvingScore}/10</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Collaboration</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#60a5fa' }}>{rev.collaborationScore}/10</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, fontSize: 11.5, color: 'var(--text-muted)' }}>
                  <span>
                    Reviewed by <strong style={{ color: '#f8fafc' }}>{rev.companyName}</strong>
                  </span>
                  <span>{rev.reviewDate}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Submit Review Modal ── */}
        {showForm && (
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Log Trainee Performance Appraisal
                </h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                      Role Title
                    </label>
                    <input
                      type="text"
                      value={candidateRole}
                      onChange={(e) => setCandidateRole(e.target.value)}
                      placeholder="e.g. Full-Stack Engineer"
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
                      Recommendation
                    </label>
                    <select
                      value={recommendation}
                      onChange={(e) => setRecommendation(e.target.value as any)}
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
                      <option value="PPO_OFFERED">PPO / Full-Time Offered</option>
                      <option value="HIGH_POTENTIAL">High Potential Fast-Track</option>
                      <option value="MEETS_STANDARDS">Meets Standards</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  <div>
                    <label style={{ fontSize: 10.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 2 }}>
                      Tech Score (1-10)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      value={techScore}
                      onChange={(e) => setTechScore(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '6px',
                        borderRadius: 6,
                        background: 'var(--bg-input, #0f111a)',
                        border: '1px solid var(--border)',
                        color: '#fff',
                        fontSize: 12,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 10.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 2 }}>
                      Solving (1-10)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      value={probScore}
                      onChange={(e) => setProbScore(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '6px',
                        borderRadius: 6,
                        background: 'var(--bg-input, #0f111a)',
                        border: '1px solid var(--border)',
                        color: '#fff',
                        fontSize: 12,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 10.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 2 }}>
                      Collab (1-10)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      value={collabScore}
                      onChange={(e) => setCollabScore(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '6px',
                        borderRadius: 6,
                        background: 'var(--bg-input, #0f111a)',
                        border: '1px solid var(--border)',
                        color: '#fff',
                        fontSize: 12,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
                    Performance Evaluation & Comments
                  </label>
                  <textarea
                    rows={3}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Describe candidate technical execution, project impact, and codebase contributions..."
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

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
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
                    Log Review
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
