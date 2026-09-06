'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Lightbulb,
  X,
  Search,
  Brain,
  Compass,
  Award,
  Sparkles,
  Layers,
  Activity,
  Bot,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Layout,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export interface FeatureTip {
  id: string;
  category: 'ai' | 'career' | 'credentials' | 'navigation' | 'copilot';
  title: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  whatItIs: string;
  howToUse: string[];
  actionLink?: string;
  actionText?: string;
  shortcutTip?: string;
}

export const PLATFORM_TIPS: FeatureTip[] = [
  {
    id: 'ai-analyzer',
    category: 'ai',
    title: 'AI Skill Analyzer',
    badge: 'Core AI Engine',
    badgeColor: '#f59e0b',
    icon: Brain,
    whatItIs: 'An intelligent neural evaluator that analyzes your uploaded resume, technical stack, or project repositories to compute verifiable competency benchmarks against Indian tech industry standards.',
    howToUse: [
      'Navigate to the "AI Skill Analyzer" from the top menu or quick action button.',
      'Paste your resume, GitHub profile link, or technical project summaries.',
      'Click "Run Comprehensive AI Analysis" to get NSQF level scores, radar charts, and pinpointed skill gap closures.',
    ],
    actionLink: '/student/analyzer',
    actionText: 'Open Skill Analyzer',
    shortcutTip: 'Use for instant resume diagnostic before applying to tech roles.',
  },
  {
    id: 'career-pathways',
    category: 'career',
    title: 'Predictive Career Pathways',
    badge: 'Market Intelligence',
    badgeColor: '#10b981',
    icon: Compass,
    whatItIs: 'Real-time job market matching engine that aligns your verified skill profile with in-demand roles (Full-Stack, Cloud Architect, AI Engineer) and provides INR salary brackets.',
    howToUse: [
      'Go to "Career Pathways" in your student navigation or click "View Targeted Upskilling Plan".',
      'Compare your compatibility percentage against live industry benchmarks (TCS, Infosys, Swiggy, Zerodha).',
      'View missing skills and step-by-step upskilling milestones needed to bridge the gap.',
    ],
    actionLink: '/student/career',
    actionText: 'Explore Career Pathways',
    shortcutTip: 'Identifies high-growth roles where your current skills give you the highest salary leverage.',
  },
  {
    id: 'skill-passport',
    category: 'credentials',
    title: 'Verifiable Skill Passport',
    badge: 'Cryptographic Ledger',
    badgeColor: '#60a5fa',
    icon: Award,
    whatItIs: 'A tamper-proof digital credential passport with SHA-256 ledger hashes, official NSQF competency levels, and shareable QR verification badges for hiring partners.',
    howToUse: [
      'Click on "Skill Passport" in the sidebar or top navigation.',
      'Verify your NSQF level certificate hash and view official competency seals.',
      'Export your verified credential transcript or copy your public verification link to paste into LinkedIn or resumes.',
    ],
    actionLink: '/student/passport',
    actionText: 'View Skill Passport',
    shortcutTip: 'Employers can independently verify your skills without third-party delay.',
  },
  {
    id: 'ai-copilot',
    category: 'copilot',
    title: 'AI Career Copilot',
    badge: 'Real-time Assistant',
    badgeColor: '#f59e0b',
    icon: Bot,
    whatItIs: 'A specialized, profile-aware conversational AI tuned with Google Gemini & Groq models for instant advice on Indian tech salaries, interview preparation, and step-by-step learning paths.',
    howToUse: [
      'Click the floating "AI Copilot" badge at the bottom-right of any screen.',
      'Pick a quick prompt chip (e.g. "Explain my skill gaps", "Interview prep for Full Stack") or type any question.',
      'Read structured cards with bold highlights and copy actionable advice directly with 1-click.',
    ],
    shortcutTip: 'Available on all pages for contextual guidance anytime.',
  },
  {
    id: 'workspace-switcher',
    category: 'navigation',
    title: 'Multi-Stakeholder Switcher',
    badge: 'Platform Architecture',
    badgeColor: '#a855f7',
    icon: Layers,
    whatItIs: 'Allows instant toggling between Student, College/Institute, Industry Employer, and Government Policy dashboards to preview how data flows across the entire ecosystem.',
    howToUse: [
      'Look at the top right of the topbar (or inside the mobile menu drawer).',
      'Click on "Student", "College", "Company", or "Gov" pills.',
      'Experience tailored analytics, institutional cohorts, placement pipelines, or state-level workforce metrics.',
    ],
    actionLink: '/institute',
    actionText: 'Preview College Dashboard',
    shortcutTip: 'Great for evaluating how Ryyvora AI connects students with colleges and employers.',
  },
  {
    id: 'layout-toggle',
    category: 'navigation',
    title: 'Customizable Navigation Modes',
    badge: 'UI Preference',
    badgeColor: '#ec4899',
    icon: Layout,
    whatItIs: 'Customizable workspace navigation supporting both sleek Top Navbar Mode and productivity-focused Left Sidebar Mode with persistent user preferences.',
    howToUse: [
      'Click "Navbar Mode" or "Sidebar Mode" in the topbar header.',
      'On desktop, choose horizontal top links or collapsable vertical side navigation.',
      'On mobile devices, a touch-friendly slide-out drawer automatically activates.',
    ],
    shortcutTip: 'Your chosen layout is saved automatically to your profile preferences.',
  },
  {
    id: 'ai-telemetry',
    category: 'ai',
    title: 'Live AI Health & Telemetry',
    badge: 'System Monitoring',
    badgeColor: '#10b981',
    icon: Activity,
    whatItIs: 'Real-time diagnostic monitor tracking LLM provider availability, inference latency, fallback resilience (Gemini / Groq / Ollama), and cache hit ratios.',
    howToUse: [
      'Click the green "AI LIVE" or "AI TELEMETRY" status badge in the header.',
      'View active LLM health metrics, request throughput, and fallback provider status.',
    ],
    actionLink: '/ai-health',
    actionText: 'View AI Diagnostics',
    shortcutTip: 'Guarantees 99.9% uptime by automatically routing queries to available providers.',
  },
];

interface FeatureTipsGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeatureTipsGuideModal({ isOpen, onClose }: FeatureTipsGuideProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTipId, setActiveTipId] = useState<string>(PLATFORM_TIPS[0].id);

  const filteredTips = useMemo(() => {
    return PLATFORM_TIPS.filter((tip) => {
      const matchCategory = selectedCategory === 'all' || tip.category === selectedCategory;
      const matchSearch =
        tip.title.toLowerCase().includes(search.toLowerCase()) ||
        tip.whatItIs.toLowerCase().includes(search.toLowerCase()) ||
        tip.badge.toLowerCase().includes(search.toLowerCase()) ||
        tip.howToUse.some((h) => h.toLowerCase().includes(search.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [search, selectedCategory]);

  const activeTip = PLATFORM_TIPS.find((t) => t.id === activeTipId) || filteredTips[0] || PLATFORM_TIPS[0];

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="UI Feature Guide and Tips"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'rgba(5, 10, 20, 0.85)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 920,
          maxHeight: 'calc(100vh - 32px)',
          background: '#0e111a',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 16,
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(245, 158, 11, 0.05))',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold)',
              }}
            >
              <Lightbulb size={18} />
            </div>
            <div>
              <h2 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Ryyvora AI — Feature Guide & Pro Tips
              </h2>
              <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Understand all intelligent features, verifiable tools, and workflows
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close feature guide"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div
          style={{
            padding: '12px 22px',
            borderBottom: '1px solid var(--border)',
            background: 'rgba(255, 255, 255, 0.02)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: 240, flex: 1 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search features (e.g. salary, passport, copilot, nsqf)..."
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                borderRadius: 8,
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                color: '#fff',
                fontSize: 12.5,
              }}
            />
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'All Features' },
              { key: 'ai', label: 'AI Engine' },
              { key: 'career', label: 'Careers' },
              { key: 'credentials', label: 'Passports' },
              { key: 'copilot', label: 'Copilot' },
              { key: 'navigation', label: 'Layout & Roles' },
            ].map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: selectedCategory === cat.key ? 700 : 500,
                  background: selectedCategory === cat.key ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${selectedCategory === cat.key ? 'rgba(245, 158, 11, 0.4)' : 'var(--border)'}`,
                  color: selectedCategory === cat.key ? 'var(--gold)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Split Pane */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 400 }}>
          {/* Left Column: Features List */}
          <div
            className="no-scrollbar"
            style={{
              width: '40%',
              minWidth: 260,
              maxWidth: 340,
              borderRight: '1px solid var(--border)',
              overflowY: 'auto',
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              background: 'rgba(0,0,0,0.2)',
            }}
          >
            {filteredTips.map((tip) => {
              const Icon = tip.icon;
              const isSelected = tip.id === activeTip.id;

              return (
                <button
                  key={tip.id}
                  type="button"
                  onClick={() => setActiveTipId(tip.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: `1px solid ${isSelected ? 'rgba(245, 158, 11, 0.35)' : 'rgba(255, 255, 255, 0.04)'}`,
                    background: isSelected ? 'rgba(245, 158, 11, 0.09)' : 'rgba(255, 255, 255, 0.02)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  className="hover:border-amber-500/30"
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      background: isSelected ? 'var(--gold)' : 'rgba(255, 255, 255, 0.06)',
                      color: isSelected ? '#090a0f' : '#cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Icon size={14} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? '#f8fafc' : '#cbd5e1' }}>
                        {tip.title}
                      </span>
                      <ChevronRight size={13} color={isSelected ? 'var(--gold)' : '#64748b'} />
                    </div>
                    <span style={{ fontSize: 10.5, color: tip.badgeColor, fontWeight: 600 }}>
                      {tip.badge}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredTips.length === 0 && (
              <div style={{ padding: '30px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12.5 }}>
                No features found matching "{search}". Try searching for "salary", "passport", or "nsqf".
              </div>
            )}
          </div>

          {/* Right Column: Detailed Guide & Steps */}
          <div
            className="no-scrollbar"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 20,
            }}
          >
            {activeTip && (
              <div>
                {/* Active Tip Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--gold)',
                    }}
                  >
                    {React.createElement(activeTip.icon, { size: 18 })}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                        {activeTip.title}
                      </h3>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: 99,
                          background: 'rgba(255,255,255,0.06)',
                          border: `1px solid ${activeTip.badgeColor}40`,
                          color: activeTip.badgeColor,
                        }}
                      >
                        {activeTip.badge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* What it is */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.025)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 10,
                    padding: '12px 16px',
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: '#cbd5e1',
                    marginBottom: 16,
                  }}
                >
                  <strong style={{ color: '#f8fafc', display: 'block', marginBottom: 3 }}>What this feature does:</strong>
                  {activeTip.whatItIs}
                </div>

                {/* Step by Step How to Use */}
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 13.5, fontWeight: 700, color: '#f8fafc', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={15} color="var(--gold)" /> How to use this feature:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {activeTip.howToUse.map((step, sIdx) => (
                      <div
                        key={sIdx}
                        style={{
                          display: 'flex',
                          gap: 10,
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.04)',
                          borderRadius: 8,
                          padding: '8px 12px',
                          fontSize: 12.5,
                          lineHeight: 1.5,
                          color: '#e2e8f0',
                        }}
                      >
                        <div
                          style={{
                            minWidth: 20,
                            height: 20,
                            borderRadius: 6,
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: 'var(--gold)',
                            fontSize: 11,
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 1,
                          }}
                        >
                          {sIdx + 1}
                        </div>
                        <div style={{ flex: 1 }}>{step}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro Shortcut Tip */}
                {activeTip.shortcutTip && (
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.06)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12,
                      color: '#fde68a',
                    }}
                  >
                    <Sparkles size={14} color="var(--gold)" />
                    <span><strong>Pro Tip:</strong> {activeTip.shortcutTip}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Footer */}
            {activeTip?.actionLink && (
              <div
                style={{
                  borderTop: '1px solid var(--border)',
                  paddingTop: 14,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Link
                  href={activeTip.actionLink}
                  onClick={onClose}
                  className="btn-gold"
                  style={{
                    fontSize: 12.5,
                    padding: '8px 18px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    textDecoration: 'none',
                  }}
                >
                  <span>{activeTip.actionText || 'Open Feature'}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
