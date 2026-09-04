'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  Brain,
  Compass,
  Award,
  Bot,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
} from 'lucide-react';
import { FeatureTipsGuideModal } from './FeatureTipsGuide';

export function QuickTipsSegment() {
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <div
        className="card-linear"
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(15, 17, 26, 0.95) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 14,
          padding: '14px 18px',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 20,
        }}
      >
        {/* Glow Accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 4,
            height: '100%',
            background: 'linear-gradient(180deg, #f59e0b, #d97706)',
          }}
        />

        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Lightbulb size={16} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="font-display" style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>
                  Platform Pro Tips & UI Guide
                </span>
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: 99,
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#f59e0b',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  NEW GUIDE
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', margin: '1px 0 0' }}>
                Discover key capabilities: AI Analyzer, Career Matching, Verifiable Passports, and Copilot.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn-gold"
              style={{
                fontSize: 11.5,
                padding: '5px 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Compass size={12} /> Explore Platform Features
            </button>

            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              aria-label={expanded ? 'Collapse tips' : 'Expand tips'}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px 6px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss tips banner"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
              }}
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {expanded && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 10,
              marginTop: 14,
              paddingTop: 12,
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Quick Tip 1: AI Skill Analyzer */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 10,
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Brain size={14} color="#f59e0b" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>
                    1. AI Skill Analyzer
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 11.5, color: '#94a3b8', lineHeight: 1.45 }}>
                  Benchmark your technical skills against NSQF standards and discover targeted gap closures.
                </p>
              </div>
              <Link
                href="/student/analyzer"
                style={{
                  fontSize: 11,
                  color: 'var(--gold)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <span>Run Analyzer</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            {/* Quick Tip 2: Career Pathways */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 10,
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Compass size={14} color="#10b981" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>
                    2. Career Match
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 11.5, color: '#94a3b8', lineHeight: 1.45 }}>
                  See role compatibility (Full-Stack, Cloud) with realistic INR salaries & hiring company trends.
                </p>
              </div>
              <Link
                href="/student/career"
                style={{
                  fontSize: 11,
                  color: '#34d399',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <span>View Pathways</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            {/* Quick Tip 3: Skill Passport */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 10,
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Award size={14} color="#60a5fa" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>
                    3. Skill Passport
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 11.5, color: '#94a3b8', lineHeight: 1.45 }}>
                  Export tamper-proof SHA-256 verified credentials for employers and LinkedIn.
                </p>
              </div>
              <Link
                href="/student/passport"
                style={{
                  fontSize: 11,
                  color: '#60a5fa',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <span>Open Passport</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            {/* Quick Tip 4: AI Copilot */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 10,
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Bot size={14} color="#f59e0b" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>
                    4. AI Career Copilot
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 11.5, color: '#94a3b8', lineHeight: 1.45 }}>
                  Ask real-time questions about interview prep, tech roadmaps, and salary negotiations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                style={{
                  fontSize: 11,
                  color: 'var(--gold)',
                  background: 'transparent',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <span>How to use</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Modal */}
      <FeatureTipsGuideModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
