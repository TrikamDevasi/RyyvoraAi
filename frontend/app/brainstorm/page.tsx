'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  RefreshCw,
  Lightbulb,
  Compass,
  Briefcase,
  GraduationCap,
  Landmark,
  Bot,
  Copy,
  Check,
  ChevronRight,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import { getAllDomains, DomainDefinition } from '@/lib/domains';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface IdeaCategory {
  title: string;
  icon: any;
  prompts: string[];
}

const DOMAINS = getAllDomains();

const BRAINSTORM_TEMPLATES: Record<string, IdeaCategory[]> = {
  all: [
    {
      title: 'Strategic Career Paths',
      icon: Compass,
      prompts: [
        'Map the fastest path to an NSQF Level 6 System Architect role from a 3rd-year engineering background.',
        'Which emerging roles in Autonomous Systems and EV Technology offer the highest entry compensation in 2026?',
        'How can a Mechanical Engineering student pivot into Industrial Robotics and Smart Automation?',
      ],
    },
    {
      title: 'Technical Deep Dives',
      icon: Zap,
      prompts: [
        'Outline a 6-month hands-on project roadmap for microservices orchestration with Kubernetes and gRPC.',
        'What are the core cryptographic principles behind verifiable digital credentials and tamper-proof passports?',
        'Draft an end-to-end curriculum for Large Language Model fine-tuning and retrieval-augmented generation.',
      ],
    },
    {
      title: 'Hiring & Industry Signals',
      icon: Briefcase,
      prompts: [
        'What are the top 5 technical skills tested in tier-1 enterprise technical rounds this hiring season?',
        'How do recruiters verify practical competency vs memorized interview answers on modern platforms?',
        'Generate a candidate evaluation matrix for a Junior Full-Stack Developer with strict skill rubrics.',
      ],
    },
    {
      title: 'Institutional & Policy Insights',
      icon: Landmark,
      prompts: [
        'How can tier-2 engineering colleges improve 90-day placement retention rates above the 85% threshold?',
        'Summarize the key alignment gaps between typical Indian university CS curricula and global AI engineering standards.',
        'Design a district-level vocational skill initiative for rural youth in Vidarbha with verified micro-credentials.',
      ],
    },
  ],
};

export default function BrainstormPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>('CSE');
  const [selectedRole, setSelectedRole] = useState<'student' | 'institute' | 'employer' | 'government'>('student');
  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        '👋 Welcome to the **Ryyvora AI Brainstorm Studio**! Select your engineering domain and role, pick a strategic seed topic, or type any workforce intelligence prompt below to explore.',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeDomain = DOMAINS.find((d) => d.code === selectedDomain) || DOMAINS[0];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || loading) return;

    const userMessage: Message = { role: 'user', content: query };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputPrompt('');
    setLoading(true);

    try {
      // Build context for AI
      const promptWithContext = `[Domain: ${activeDomain.name} (${activeDomain.code})] [Role Perspective: ${selectedRole.toUpperCase()}]\n${query}`;

      const res = await api.post('/ai/chat', {
        message: promptWithContext,
        history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
      });

      const reply = res.data?.data?.reply || res.data?.reply || res.data?.message || 'Brainstorm generated successfully.';
      setMessages([...updatedMessages, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Unable to connect to AI Brainstorm service. Please try again.';
      toast.error(errMsg);
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: `⚠️ Error generating brainstorm response: ${errMsg}. Please ensure the backend is running.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />

      <main style={{ flex: 1, maxWidth: 1200, width: '100%', margin: '0 auto', padding: '120px 24px 60px' }}>
        {/* Header Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: 'var(--emerald)',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            <Sparkles size={14} />
            <span>AI Brainstorm & Career Strategy Studio</span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            Ideate, Plan & Explore With <span className="gold-text">Ryyvora AI</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 680, margin: '0 auto', lineHeight: 1.6 }}>
            Harness live NSQF framework intelligence, verified skill analytics, and engineering market trends to engineer your next career milestone.
          </p>
        </div>

        {/* Controls Toolbar: Domain & Role selector */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '16px 20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 32,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Domain Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Discipline:</span>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '8px 12px',
                color: 'var(--text-primary)',
                fontSize: 13,
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {DOMAINS.map((dom) => (
                <option key={dom.code} value={dom.code}>
                  {dom.name} ({dom.code})
                </option>
              ))}
            </select>
            <span
              style={{
                fontSize: 12,
                padding: '4px 8px',
                borderRadius: 6,
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                color: 'var(--gold)',
              }}
            >
              Core: {activeDomain.coreKeywords.slice(0, 3).join(', ')}
            </span>
          </div>

          {/* Role Perspective */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Perspective:</span>
            {(['student', 'institute', 'employer', 'government'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: selectedRole === r ? 'var(--emerald)' : 'var(--bg-surface-elevated)',
                  color: selectedRole === r ? '#090a0f' : 'var(--text-secondary)',
                  border: selectedRole === r ? '1px solid var(--emerald)' : '1px solid var(--border)',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Grid: Left Prompt Seeds, Right Live Interactive Copilot */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
          {/* Left Column: Curated Seed Prompts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lightbulb size={18} color="var(--gold)" />
                <span>Curated Brainstorm Seeds</span>
              </h2>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Click to run prompt</span>
            </div>

            {BRAINSTORM_TEMPLATES.all.map((cat, cIdx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cIdx}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gold)', fontSize: 14, fontWeight: 700 }}>
                    <Icon size={16} />
                    <span>{cat.title}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {cat.prompts.map((p, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSend(p)}
                        disabled={loading}
                        style={{
                          textAlign: 'left',
                          padding: '10px 12px',
                          borderRadius: 8,
                          background: 'var(--bg-surface-elevated)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          fontSize: 12.5,
                          lineHeight: 1.5,
                          cursor: loading ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: 10,
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                          e.currentTarget.style.background = 'rgba(245, 158, 11, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border)';
                          e.currentTarget.style.background = 'var(--bg-surface-elevated)';
                        }}
                      >
                        <span>{p}</span>
                        <ArrowUpRight size={14} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Interactive Chat Stream */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              height: 680,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {/* Chat Box Header */}
            <div
              style={{
                padding: '14px 18px',
                background: 'var(--bg-surface-elevated)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--emerald)',
                  }}
                >
                  <Bot size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Ryyvora AI Copilot</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Context: {activeDomain.name} · {selectedRole.toUpperCase()}
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  setMessages([
                    {
                      role: 'assistant',
                      content: 'Chat reset. Choose a prompt or ask another strategic question.',
                    },
                  ])
                }
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <RefreshCw size={12} /> Clear
              </button>
            </div>

            {/* Message Stream */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {messages.map((m, idx) => {
                const isAssistant = m.role === 'assistant';
                return (
                  <div
                    key={idx}
                    style={{
                      alignSelf: isAssistant ? 'flex-start' : 'flex-end',
                      maxWidth: '88%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: isAssistant ? '4px 14px 14px 14px' : '14px 14px 4px 14px',
                        background: isAssistant ? 'var(--bg-surface-elevated)' : 'linear-gradient(135deg, #10b981, #059669)',
                        color: isAssistant ? 'var(--text-primary)' : '#090a0f',
                        border: isAssistant ? '1px solid var(--border)' : 'none',
                        fontSize: 13,
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {m.content}
                    </div>

                    {isAssistant && (
                      <button
                        onClick={() => handleCopy(idx, m.content)}
                        style={{
                          alignSelf: 'flex-start',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          fontSize: 11,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '2px 4px',
                        }}
                      >
                        {copiedIndex === idx ? <Check size={11} color="var(--emerald)" /> : <Copy size={11} />}
                        <span>{copiedIndex === idx ? 'Copied' : 'Copy answer'}</span>
                      </button>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div
                  style={{
                    alignSelf: 'flex-start',
                    padding: '12px 16px',
                    borderRadius: '4px 14px 14px 14px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: 'var(--text-muted)',
                    fontSize: 13,
                  }}
                >
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Synthesizing intelligence...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{
                padding: '12px 16px',
                borderTop: '1px solid var(--border)',
                background: 'var(--bg-surface-elevated)',
                display: 'flex',
                gap: 10,
              }}
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={`Ask about ${activeDomain.name} careers, skills, or curriculum...`}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || loading}
                style={{
                  padding: '0 16px',
                  borderRadius: 10,
                  background: inputPrompt.trim() && !loading ? 'var(--emerald)' : 'var(--bg-surface-subtle)',
                  color: inputPrompt.trim() && !loading ? '#090a0f' : 'var(--text-muted)',
                  border: 'none',
                  fontWeight: 600,
                  cursor: inputPrompt.trim() && !loading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                }}
              >
                <Send size={14} />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
