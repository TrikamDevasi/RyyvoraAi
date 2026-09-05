'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Newspaper,
  Building2,
  TrendingUp,
  FileText,
  Calendar,
  ExternalLink,
  Search,
  Download,
  Filter,
  Sparkles,
  Award,
  ShieldCheck,
  Bookmark,
  Share2,
  Tag,
  Briefcase,
  Handshake,
  Check,
  IndianRupee,
  Lock,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';

interface IndustryNewsArticle {
  id: string;
  title: string;
  summary: string;
  category: 'ALLIANCE' | 'SUBSIDY' | 'NOS_STANDARDS' | 'WAGE_SURGE' | 'DPDP_PRIVACY';
  categoryLabel: string;
  source: string;
  publishDate: string;
  readTime: string;
  referenceNumber?: string;
  highlights: string[];
  actionLink: string;
  actionText: string;
  isFeatured?: boolean;
}

const INDUSTRY_ARTICLES: IndustryNewsArticle[] = [
  {
    id: 'ind_2026_01',
    title: 'NASSCOM IT-ITeS SSC & Maharashtra IT Dept Form 85,000 GenAI & Cloud Apprenticeship Alliance',
    summary: 'A landmark multi-enterprise consortium spanning 40+ Tier-1 technology companies has established fast-track campus recruitment channels for certified NSQF Level 5 & 6 polytechnic and engineering graduates.',
    category: 'ALLIANCE',
    categoryLabel: 'Corporate Hiring Alliance',
    source: 'NASSCOM IT-ITeS Sector Skill Council',
    publishDate: 'March 14, 2026',
    readTime: '4 min read',
    referenceNumber: 'NASSCOM-MH/2026/ALLIANCE-04',
    highlights: [
      'Direct hiring pipelines across Pune, Mumbai, and Nagpur tech corridors',
      'Target roles focused on Next.js 15, Python AI, and Kubernetes Platform SRE',
      'Co-funded corporate onboarding bootcamps with 100% placement assurance',
    ],
    actionLink: '/industry/campus',
    actionText: 'Schedule Campus Recruitment Drive',
    isFeatured: true,
  },
  {
    id: 'ind_2026_02',
    title: 'MSDE Expands 50% Apprenticeship Stipend Co-Funding Scheme for Maharashtra Enterprises',
    summary: 'Under PMKVY 4.0 guidelines, registered corporate employers receive a 50% direct benefit transfer (DBT) subsidy on trainee monthly stipends for candidates verified via SkillSense AI digital passports.',
    category: 'SUBSIDY',
    categoryLabel: 'Corporate Subsidy & DBT',
    source: 'Ministry of Skill Development and Entrepreneurship (MSDE)',
    publishDate: 'March 11, 2026',
    readTime: '3 min read',
    referenceNumber: 'MSDE/PMKVY-4.0/IND-COFUND-88',
    highlights: [
      'Monthly subsidy reimbursement of up to ₹4,500 per apprentice',
      'Automated 30-day onboarding and 90-day retention employer check-ins',
      'Simplified digital GST reconciliation and single-window approval',
    ],
    actionLink: '/industry/talent',
    actionText: 'Inspect Verified Talent Pool',
  },
  {
    id: 'ind_2026_03',
    title: 'NCVET Releases Revised 2026 National Occupational Standards (NOS) for Software & AI',
    summary: 'National Occupational Standards (NOS) updated with new micro-credential units for vector search architectures, Next.js server components, zero-trust security, and prompt engineering.',
    category: 'NOS_STANDARDS',
    categoryLabel: 'NOS Qualification Pack',
    source: 'National Council for Vocational Education & Training (NCVET)',
    publishDate: 'March 08, 2026',
    readTime: '5 min read',
    referenceNumber: 'NCVET/NOS-REV/2026/COMP-512',
    highlights: [
      'Accredited qualification packs SSC/Q0501, SSC/Q0702, and SSC/Q0801 revised',
      'Direct integration with SkillSense SHA-256 HMAC cryptographic skill passports',
      'Recognition of hands-on practical code execution as formal coursework',
    ],
    actionLink: '/industry/demand',
    actionText: 'View NOS Deficit Matrix',
  },
  {
    id: 'ind_2026_04',
    title: 'Maharashtra Tech Corridor Report: +44% Starting Salary Surge for Verified Skill Passport Holders',
    summary: 'Longitudinal wage tracking across 12,400 hires demonstrates that candidates with cryptographically sealed diagnostic skill passports earn starting packages averaging ₹8.96 LPA vs ₹6.20 LPA baseline.',
    category: 'WAGE_SURGE',
    categoryLabel: 'Wage Intelligence',
    source: 'Maharashtra Workforce & Wage Observatory',
    publishDate: 'March 04, 2026',
    readTime: '3 min read',
    referenceNumber: 'MWWO-REPORT/2026/Q1-WAGE',
    highlights: [
      'Peak salary appreciation observed in Applied Generative AI (+58% YoY)',
      'Employer time-to-hire reduced from 24.6 days down to 9.4 days',
      '92.4% 365-day retention index among verified apprentice cohorts',
    ],
    actionLink: '/industry/demand',
    actionText: 'Inspect 24-Month Wage Curves',
  },
  {
    id: 'ind_2026_05',
    title: 'DPDP Act 2023 Compliance Advisory for Enterprise Recruitment Portals',
    summary: 'Data Protection Board mandates enterprise recruiting platforms to maintain sovereign consent logs, purpose-bound access, and automated candidate data masking under Article 12 safeguards.',
    category: 'DPDP_PRIVACY',
    categoryLabel: 'DPDP Compliance',
    source: 'Data Protection Board of India · MeitY',
    publishDate: 'Feb 27, 2026',
    readTime: '4 min read',
    referenceNumber: 'DPB/ADV/2026/RECRUIT-09',
    highlights: [
      'Strict prohibition of unauthorized candidate PII sharing',
      'SkillSense AI certified as 100% DPDP sovereign compliant',
      'Instant candidate privacy package JSON export capability',
    ],
    actionLink: '/industry/talent',
    actionText: 'Review Compliant Sourcing Pool',
  },
];

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  ALLIANCE: { bg: 'rgba(245,158,11,0.12)', color: 'var(--gold)' },
  SUBSIDY: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  NOS_STANDARDS: { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  WAGE_SURGE: { bg: 'rgba(192,132,252,0.12)', color: '#c084fc' },
  DPDP_PRIVACY: { bg: 'rgba(236,72,153,0.12)', color: '#ec4899' },
};

export default function IndustryNewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  const handleBookmarkToggle = (id: string) => {
    setBookmarked((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
    toast.success('Industry brief bookmarked for executive review');
  };

  const handleDownloadDossier = () => {
    const reportData = {
      title: 'Sector Skill Council (SSC) & Maharashtra Industry Hiring Wire Digest',
      exportedAt: new Date().toISOString(),
      articles: INDUSTRY_ARTICLES,
      governingAuthority: 'SkillSense AI Industry Intelligence Center',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `industry_hiring_wire_${Date.now()}.json`;
    downloadAnchor.click();
    toast.success('Official Industry Hiring Wire Digest downloaded!');
  };

  const filteredNews = INDUSTRY_ARTICLES.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = INDUSTRY_ARTICLES.find((p) => p.isFeatured) || INDUSTRY_ARTICLES[0];

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1160, margin: '0 auto', paddingBottom: 60 }}>
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
              <AIBadge type="nsqf" label="SECTOR SKILL COUNCIL NEWS WIRE" />
              <AIBadge type="live" label="CORPORATE RECRUITMENT INTELLIGENCE" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Industry Hiring Wire & <span style={{ color: 'var(--gold)' }}>SSC Policy Intelligence</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Official corporate apprenticeship alliances, PMKVY stipend co-funding regulations, National Occupational Standards (NOS) releases, and Maharashtra tech hiring benchmarks.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleDownloadDossier}
              className="btn-secondary"
              style={{ fontSize: 12.5, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Download size={14} /> Download Hiring Wire (JSON)
            </button>
          </div>
        </div>

        {/* ── Featured Alliance Banner ── */}
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
                  FEATURED HIRING ALLIANCE
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{featured.referenceNumber}</span>
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
                Source: <strong style={{ color: '#f8fafc' }}>{featured.source}</strong>
              </span>

              <Link
                href={featured.actionLink}
                className="btn-gold"
                style={{ fontSize: 12.5, padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span>{featured.actionText}</span>
                <ExternalLink size={13} />
              </Link>
            </div>
          </div>
        )}

        {/* ── Search & Filter Tabs ── */}
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
              { id: 'ALL', label: 'All Industry Wire', icon: Newspaper },
              { id: 'ALLIANCE', label: 'Hiring Alliances', icon: Handshake },
              { id: 'SUBSIDY', label: 'Corporate Subsidies', icon: IndianRupee },
              { id: 'NOS_STANDARDS', label: 'NOS Qualification Packs', icon: FileText },
              { id: 'WAGE_SURGE', label: 'Wage Intelligence', icon: TrendingUp },
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
              placeholder="Search wire, regulations..."
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

        {/* ── Articles Feed ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredNews.map((article) => {
            const badge = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.ALLIANCE;
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
                    {article.referenceNumber && (
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {article.referenceNumber}
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
                    Source: <strong style={{ color: '#e2e8f0' }}>{article.source}</strong> · {article.readTime}
                  </span>

                  <Link
                    href={article.actionLink}
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
                    <span>{article.actionText}</span>
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
