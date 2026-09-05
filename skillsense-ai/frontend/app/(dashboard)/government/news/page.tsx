'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Newspaper,
  Landmark,
  FileText,
  Calendar,
  ExternalLink,
  Search,
  Download,
  Filter,
  Sparkles,
  Award,
  ShieldCheck,
  TrendingUp,
  Bookmark,
  Share2,
  Tag,
  Check,
  IndianRupee,
  GraduationCap,
  Briefcase,
  Lock,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';

interface PolicyArticle {
  id: string;
  title: string;
  summary: string;
  category: 'GAZETTE' | 'NSQF_NCVET' | 'FUNDING' | 'APPRENTICESHIP' | 'DPDP_PRIVACY';
  categoryLabel: string;
  authority: string;
  publishDate: string;
  readTime: string;
  grNumber?: string;
  highlights: string[];
  sourceUrl: string;
  isFeatured?: boolean;
}

const POLICY_NEWS: PolicyArticle[] = [
  {
    id: 'gr_2026_01',
    title: 'Maharashtra Cabinet Approves ₹1,200 Cr State ITI & Vocational Polytechnic Modernization Package',
    summary: 'The Government of Maharashtra has sanctioned a state-wide infrastructure overhaul across 142 technical institutes, integrating Next.js, Cloud Native DevOps, and Applied AI workbenches into standard vocational curricula.',
    category: 'FUNDING',
    categoryLabel: 'State Budget & GR',
    authority: 'Dept of Skill Development, Employment & Innovation · Govt of Maharashtra',
    publishDate: 'March 14, 2026',
    readTime: '4 min read',
    grNumber: 'GR-MSDE/2026/FIN-1049/CR-82',
    highlights: [
      'Direct allocation of ₹8.4 Cr per district vocational center in Marathwada & Vidarbha',
      'Mandatory NSQF Level 5 calibration for all computer engineering curricula',
      'Integration with Ryyvora AI decentralized workforce telemetry ledger',
    ],
    sourceUrl: 'https://skillsense-ai-seven.vercel.app/government',
    isFeatured: true,
  },
  {
    id: 'ncvet_2026_02',
    title: 'NCVET Releases National Micro-Credential & Blockchain Skill Passport Mandate',
    summary: 'National Council for Vocational Education & Training mandates all state-funded technical diplomas to issue cryptographically signed SHA-256 HMAC digital credentials directly verifiable by enterprise recruiters.',
    category: 'NSQF_NCVET',
    categoryLabel: 'NCVET Regulatory Directive',
    authority: 'National Council for Vocational Education and Training (NCVET)',
    publishDate: 'March 11, 2026',
    readTime: '3 min read',
    grNumber: 'NCVET/REG/2026/CRED-88',
    highlights: [
      'Elimination of physical paper certificate verification delays',
      'Interoperability with DigiLocker and National Academic Depository (NAD)',
      '1-click recruiter verification via public HMAC verification hashes',
    ],
    sourceUrl: 'https://skillsense-ai-seven.vercel.app/student/passport',
  },
  {
    id: 'pmkvy_2026_03',
    title: 'PMKVY 4.0 Expands ₹4,500/Month Stipend Direct Benefit Transfer (DBT) Scheme',
    summary: 'Ministry of Skill Development & Entrepreneurship expands monthly direct benefit allowances for candidates undertaking verified 6-month full-stack engineering apprenticeships across Maharashtra IT corridors.',
    category: 'APPRENTICESHIP',
    categoryLabel: 'Apprenticeship DBT',
    authority: 'Ministry of Skill Development and Entrepreneurship (MSDE)',
    publishDate: 'March 08, 2026',
    readTime: '5 min read',
    grNumber: 'MSDE-PMKVY/4.0/DBT-2026/512',
    highlights: [
      'Monthly direct stipend crediting via Aadhaar-enabled bank accounts',
      'Mandatory 30-day onboarding and 90-day retention employer check-ins',
      'Participating hiring partners include Swiggy, TCS, Razorpay, and Infosys',
    ],
    sourceUrl: 'https://skillsense-ai-seven.vercel.app/government/fund-targeting',
  },
  {
    id: 'dpdp_2026_04',
    title: 'Data Protection Board Issues DPDP Act 2023 Implementation Advisory for Skilling Portals',
    summary: 'Strict regulatory guidelines enforced requiring educational platforms to maintain immutable consent logs, granular purpose opt-ins, and automated candidate privacy data exports under Article 12.',
    category: 'DPDP_PRIVACY',
    categoryLabel: 'DPDP Privacy Governance',
    authority: 'Data Protection Board of India · MeitY',
    publishDate: 'March 04, 2026',
    readTime: '3 min read',
    grNumber: 'DPB/ADV/2026/EDU-CONSENT-19',
    highlights: [
      'Prohibition of unauthorized candidate PII sharing with unverified recruiters',
      '100% sovereign right for trainees to revoke tracking or export records in JSON',
      'Ryyvora AI certified as fully compliant with Section 6 & 12 safeguards',
    ],
    sourceUrl: 'https://skillsense-ai-seven.vercel.app/student/consent',
  },
  {
    id: 'nasscom_2026_05',
    title: 'NASSCOM & Maharashtra IT Dept Announce 85,000 Cloud & GenAI Industry Hiring Alliance',
    summary: 'Major corporate consortium establishes fast-track hiring pipelines for certified NSQF Level 5 & 6 graduates in Pune, Mumbai, and Nagpur tech corridors with starting compensation averaging ₹7.80 LPA.',
    category: 'APPRENTICESHIP',
    categoryLabel: 'Industry Alliance',
    authority: 'NASSCOM IT-ITeS Sector Skill Council',
    publishDate: 'February 28, 2026',
    readTime: '4 min read',
    grNumber: 'NASSCOM-MH/2026/ALLIANCE-04',
    highlights: [
      'Hiring targets focused on React 19, Python AI, and Kubernetes platform engineering',
      'Zero-cost credential screening for verified Ryyvora digital passport holders',
      'Co-funding of final semester capstone projects with corporate mentors',
    ],
    sourceUrl: 'https://skillsense-ai-seven.vercel.app/employer',
  },
];

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  FUNDING: { bg: 'rgba(245,158,11,0.12)', color: 'var(--gold)' },
  NSQF_NCVET: { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  APPRENTICESHIP: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  DPDP_PRIVACY: { bg: 'rgba(192,132,252,0.12)', color: '#C084FC' },
  GAZETTE: { bg: 'rgba(245,158,11,0.12)', color: 'var(--gold)' },
};

export default function GovernmentNewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  const handleBookmarkToggle = (id: string) => {
    setBookmarked((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
    toast.success('Policy brief bookmarked for offline review');
  };

  const handleDownloadDossier = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify(
        {
          title: 'Government of Maharashtra · Skilling Policy & Gazette Digest',
          exportedAt: new Date().toISOString(),
          articles: POLICY_NEWS,
          officialPortal: 'Ryyvora AI Governance Center',
        },
        null,
        2
      )
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = dataStr;
    downloadAnchor.download = `maharashtra_policy_gazette_digest_${Date.now()}.json`;
    downloadAnchor.click();
    toast.success('Official Policy & Gazette Digest downloaded!');
  };

  const filteredNews = POLICY_NEWS.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authority.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = POLICY_NEWS.find((p) => p.isFeatured) || POLICY_NEWS[0];

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1140, margin: '0 auto', paddingBottom: 60 }}>
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
              <AIBadge type="nsqf" label="STATE POLICY & GAZETTE WIRE" />
              <AIBadge type="live" label="OFFICIAL POLICY GAZETTE (DEMO REPOSITORY)" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Government Skilling <span style={{ color: 'var(--gold)' }}>Policy & Gazette Intelligence</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Curated official policy resolutions (GRs), NCVET regulatory mandates, vocational budget allocations, and DPDP Act compliance advisories for Maharashtra officials.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleDownloadDossier}
              className="btn-secondary"
              style={{ fontSize: 12.5, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Download size={14} /> Download Policy Digest (JSON)
            </button>
          </div>
        </div>

        {/* ── Featured Government Resolution (GR) Callout ── */}
        {featured && (
          <div
            className="card-linear"
            style={{
              padding: 26,
              borderRadius: 16,
              marginBottom: 24,
              borderLeft: '4px solid var(--gold)',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(15,17,26,0.98) 100%)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 4, background: 'var(--gold)', color: '#090a0f', textTransform: 'uppercase' }}>
                  FEATURED STATE RESOLUTION
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{featured.grNumber}</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{featured.publishDate}</span>
            </div>

            <h2 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: '4px 0 8px', lineHeight: 1.4 }}>
              {featured.title}
            </h2>

            <p style={{ fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 14 }}>
              {featured.summary}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              {featured.highlights.map((hl, idx) => (
                <div key={idx} style={{ fontSize: 12.5, color: '#e2e8f0', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <Check size={14} style={{ color: 'var(--gold)', marginTop: 2, flexShrink: 0 }} />
                  <span>{hl}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
              <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                Issued by: <strong style={{ color: '#f8fafc' }}>{featured.authority}</strong>
              </span>

              <Link
                href="/government/fund-targeting"
                className="btn-gold"
                style={{ fontSize: 12.5, padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span>Inspect Fund Allocation Matrix</span>
                <ExternalLink size={13} />
              </Link>
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
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Policy News', icon: Newspaper },
              { id: 'FUNDING', label: 'State Grants & GRs', icon: IndianRupee },
              { id: 'NSQF_NCVET', label: 'NSQF & NCVET', icon: GraduationCap },
              { id: 'APPRENTICESHIP', label: 'Apprenticeship DBT', icon: Briefcase },
              { id: 'DPDP_PRIVACY', label: 'DPDP Privacy', icon: Lock },
            ].map((cat) => {
              const TabIcon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    background: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? 'var(--gold)' : 'var(--border)'}`,
                    color: isActive ? '#090a0f' : '#cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <TabIcon size={13} color={isActive ? '#090a0f' : 'currentColor'} />
                  <span>{cat.label}</span>
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
              placeholder="Search policies, GRs..."
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

        {/* ── Policy Articles Feed Grid ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredNews.map((article) => {
            const badge = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.GAZETTE;
            const isSaved = bookmarked.includes(article.id);

            return (
              <div
                key={article.id}
                className="card-linear"
                style={{
                  padding: 20,
                  borderRadius: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: badge.bg,
                        color: badge.color,
                        textTransform: 'uppercase',
                      }}
                    >
                      {article.categoryLabel}
                    </span>
                    {article.grNumber && (
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {article.grNumber}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{article.publishDate}</span>
                    <button
                      type="button"
                      onClick={() => handleBookmarkToggle(article.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: isSaved ? 'var(--gold)' : 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                      title="Bookmark brief"
                    >
                      <Bookmark size={15} fill={isSaved ? 'var(--gold)' : 'none'} />
                    </button>
                  </div>
                </div>

                <h3 className="font-display" style={{ fontSize: 16.5, fontWeight: 800, color: '#f8fafc', margin: 0, lineHeight: 1.4 }}>
                  {article.title}
                </h3>

                <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.55, margin: 0 }}>
                  {article.summary}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                  {article.highlights.map((hl, idx) => (
                    <div key={idx} style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gold)', marginTop: 6, flexShrink: 0 }} />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 10, marginTop: 4, flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                    Authority: <strong style={{ color: '#e2e8f0' }}>{article.authority}</strong> · {article.readTime}
                  </span>

                  <Link
                    href={article.sourceUrl}
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--gold)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>Inspect Policy Impact</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </FadeIn>
    </ErrorBoundary>
  );
}
