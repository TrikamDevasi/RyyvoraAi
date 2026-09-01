'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import {
  Search,
  TrendingUp,
  Globe,
  Zap,
  Briefcase,
  Building2,
  Wallet,
  Sparkles,
  ArrowRight,
  Layers,
  Award,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { AIBadge } from '@/components/ui/AIBadge';
import { ScanningState } from '@/components/ui/ScanningState';
import { AIInsightCard } from '@/components/ui/AIInsightCard';

const POPULAR_SKILLS = [
  'Full-Stack TypeScript',
  'Cloud DevOps & Docker',
  'Generative AI & LLMs',
  'System Architecture',
  'Next.js & React 19',
  'Distributed Caching & Redis',
];

export default function MarketIntelligence() {
  const { request } = useApi();
  const [skill, setSkill] = useState('Full-Stack TypeScript');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({
    skill: 'Full-Stack TypeScript & Cloud Microservices',
    demand: 'Exponential Growth (Rising)',
    avgSalary: '₹8,50,000 – ₹18,00,000 per annum (Estimated)',
    jobCount: '15,000+ active openings in India',
    topCompanies: ['Tata Consultancy Services', 'Infosys', 'Razorpay', 'Swiggy', 'Flipkart', 'Zomato'],
    trendingTopics: ['Next.js 16', 'Distributed Microservices', 'Docker CI/CD', 'Serverless APIs', 'Redis Caching'],
    summary:
      'Full-stack TypeScript engineers with microservices and containerization expertise continue to experience intense hiring demand across Bengaluru, Hyderabad, and Pune tech corridors.',
  });

  const fetchTrends = async (targetSkill?: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const querySkill = targetSkill || skill;
    if (!querySkill.trim()) return;

    setLoading(true);
    try {
      const res = await request('GET', `/ai/market-trends?skill=${encodeURIComponent(querySkill.trim())}`);
      if (res.data && res.data.success) {
        setData(res.data.data);
        toast.success(`Market research for ${querySkill} updated!`);
      } else {
        throw new Error('Failed to fetch market data');
      }
    } catch {
      toast.error('Could not retrieve market intelligence. Showing latest benchmark data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1040, margin: '0 auto' }}>
      {/* ── Search & Header Banner ── */}
      <div
        className="card-accent"
        style={{
          padding: '28px 24px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 16,
        }}
      >
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 720 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <AIBadge type="live" label="LIVE MARKET TELEMETRY" />
          </div>

          <h2 className="font-display" style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', margin: '0 0 6px' }}>
            Real-Time Workforce & Skill Demand Intelligence
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, margin: '0 0 20px', lineHeight: 1.5 }}>
            Real-time hiring demand signals, transparent compensation benchmarks in INR, and trending micro-specializations powered by Perplexity & Groq.
          </p>

          <form
            onSubmit={(e) => fetchTrends(skill, e)}
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
              <Search
                size={16}
                color="#94a3b8"
                style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="Search a technical skill (e.g. Next.js, Cloud DevOps, System Design)..."
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: 8,
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  color: '#fff',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !skill.trim()}
              className="btn-gold"
              style={{
                padding: '12px 24px',
                fontSize: 13,
                opacity: loading || !skill.trim() ? 0.6 : 1,
              }}
            >
              <Sparkles size={15} /> Analyze Live Market
            </button>
          </form>

          {/* Quick Suggestions Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>Popular:</span>
            {POPULAR_SKILLS.map((pop) => (
              <button
                key={pop}
                type="button"
                onClick={() => {
                  setSkill(pop);
                  fetchTrends(pop);
                }}
                style={{
                  padding: '3px 9px',
                  borderRadius: 99,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  color: '#cbd5e1',
                  fontSize: 11,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {pop}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scanning State during API call ── */}
      {loading && (
        <ScanningState
          title={`Analyzing Real-Time Market Demand for "${skill}"`}
          subtitle="Probing active job postings, employer compensation signals, and emerging requisitions across India..."
          stage="Perplexity Market Grounding Engine · Sonar"
        />
      )}

      {/* ── Results View ── */}
      {data && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Executive Summary Card */}
          <div className="card-linear" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Workforce Intelligence Brief
                </div>
                <h3 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: '2px 0 0' }}>
                  Demand Analysis: {data.skill}
                </h3>
              </div>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#10b981',
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  padding: '4px 10px',
                  borderRadius: 99,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <TrendingUp size={13} /> {data.demand}
              </span>
            </div>

            <p
              style={{
                color: '#cbd5e1',
                fontSize: 13.5,
                lineHeight: 1.6,
                background: 'rgba(255,255,255,0.02)',
                padding: '14px 16px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                margin: '0 0 20px',
              }}
            >
              "{data.summary}"
            </p>

            {/* Metrics Triplets */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Growth Trajectory
                </div>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold)', marginTop: 4 }}>
                  {data.demand || 'Rising Demand'}
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Compensation Benchmark
                </div>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', marginTop: 4 }}>
                  {data.avgSalary}
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Active National Requisitions
                </div>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 800, color: '#60a5fa', marginTop: 4 }}>
                  {data.jobCount}
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Grid: Top Employers & Trending Subtopics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
            {/* Top Employers */}
            <div className="card-linear" style={{ padding: 20 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Building2 size={16} color="#60a5fa" /> Top Enterprise & Startup Employers
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(data.topCompanies || ['TCS', 'Infosys', 'Razorpay', 'Swiggy', 'Flipkart']).map((company: string, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: 'rgba(59,130,246,0.15)',
                        color: '#60a5fa',
                        fontWeight: 800,
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {company.charAt(0)}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>{company}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Subtopics */}
            <div className="card-linear" style={{ padding: 20 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Layers size={16} color="var(--gold)" /> High-Growth Sub-Specializations
              </h4>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(data.trendingTopics || ['Cloud Microservices', 'RESTful API Design', 'Docker CI/CD', 'Redis Caching']).map(
                  (topic: string, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 99,
                        background: 'rgba(245,158,11,0.08)',
                        border: '1px solid rgba(245,158,11,0.2)',
                        color: 'var(--gold)',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      #{topic.replace(/\s+/g, '').toLowerCase()}
                    </div>
                  )
                )}
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Next Action
                </div>
                <p style={{ color: '#cbd5e1', fontSize: 12.5, marginTop: 4 }}>
                  Add these trending competencies to your study roadmap or verify them with an AI assessment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
