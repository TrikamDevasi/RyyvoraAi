'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import {
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  ShieldCheck,
  ArrowLeft,
  Cpu,
  Terminal,
  Radio,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { AIBadge } from '@/components/ui/AIBadge';

interface ProviderHealthInfo {
  name: string;
  configured: boolean;
  healthy: boolean;
  model: string;
  latencyMs: number;
  message: string;
  lastChecked?: string;
}

interface AIStatus {
  success: boolean;
  data: Record<string, ProviderHealthInfo>;
}

export default function AIHealthPage() {
  const [status, setStatus] = useState<AIStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastProbed, setLastProbed] = useState<Date | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<AIStatus>('/ai-health');
      setStatus(response.data);
      setLastProbed(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend AI diagnostics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const providers = [
    {
      key: 'groq',
      name: 'Groq Cloud SDK',
      badge: 'Primary LLM Engine',
      description: 'Ultra-low latency inference for skill assessments, competency scoring, and real-time copilot streaming.',
      icon: <Zap size={18} style={{ color: '#F59E0B' }} />,
      accentColor: '#F59E0B',
    },
    {
      key: 'openai',
      name: 'OpenAI (GPT-4o)',
      badge: 'Secondary Fallback',
      description: 'Comprehensive reasoning engine for career matching, fairness auditing, and complex curriculum mapping.',
      icon: <Activity size={18} style={{ color: '#10B981' }} />,
      accentColor: '#10B981',
    },
    {
      key: 'perplexity',
      name: 'Perplexity Sonar',
      badge: 'Market Intelligence',
      description: 'Real-time live web grounding for Indian tech hiring demand signals and salary benchmarks.',
      icon: <Server size={18} style={{ color: '#6366F1' }} />,
      accentColor: '#6366F1',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#090A0F',
        color: '#F8FAFC',
        padding: '36px 20px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
        
        {/* ── Top Navigation Bar ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: '#94A3B8',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowLeft size={15} /> Back to SkillSense AI
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10B981',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                }}
              />
              Telemetry Live
            </span>
          </div>
        </div>

        {/* ── Hero Banner ── */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 20,
            padding: '32px 36px',
            background: 'linear-gradient(135deg, #111422 0%, #171D30 50%, #101424 100%)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 240,
              height: 240,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, position: 'relative', zIndex: 2 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '3px 9px',
                    borderRadius: 6,
                    background: 'rgba(245,158,11,0.15)',
                    color: '#F59E0B',
                    border: '1px solid rgba(245,158,11,0.3)',
                  }}
                >
                  Diagnostic Hub
                </span>
                <span style={{ fontSize: 12, color: '#64748B' }}>•</span>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>Multi-Provider Failover Architecture</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(24px, 3.2vw, 34px)',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                  margin: '4px 0 8px',
                }}
              >
                AI Provider Telemetry & Health
              </h1>

              <p style={{ color: '#94A3B8', fontSize: 14, maxWidth: 640, lineHeight: 1.6, margin: 0 }}>
                Live multi-provider diagnostic status, round-trip latency measurements, active model routes, and seamless automatic failover circuits.
              </p>
            </div>

            <button
              onClick={checkHealth}
              disabled={loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 22px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 800,
                color: '#090A0F',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                border: 'none',
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.35)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Probing Latency...' : 'Re-probe AI Telemetry'}
            </button>
          </div>
        </div>

        {/* ── Providers 3-Card Grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 20,
          }}
        >
          {providers.map((p, idx) => {
            const info = status?.data ? status.data[p.key] : null;
            const isHealthy = info?.healthy;
            const isConfigured = info?.configured;

            return (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                style={{
                  background: '#10131E',
                  borderRadius: 16,
                  border: isHealthy
                    ? '1px solid rgba(16, 185, 129, 0.35)'
                    : isConfigured
                    ? '1px solid rgba(245, 158, 11, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  position: 'relative',
                }}
              >
                <div>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {p.icon}
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>{p.name}</span>
                    </div>

                    {/* Status Badge */}
                    {isHealthy ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '3px 9px',
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 800,
                          background: 'rgba(16, 185, 129, 0.12)',
                          color: '#10B981',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        <CheckCircle2 size={12} /> Active
                      </span>
                    ) : isConfigured ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '3px 9px',
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 800,
                          background: 'rgba(245, 158, 11, 0.12)',
                          color: '#F59E0B',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                        }}
                      >
                        <AlertTriangle size={12} /> Degraded
                      </span>
                    ) : (
                      <span
                        style={{
                          padding: '3px 9px',
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 700,
                          background: 'rgba(100, 116, 139, 0.12)',
                          color: '#94A3B8',
                          border: '1px solid rgba(100, 116, 139, 0.25)',
                        }}
                      >
                        Offline
                      </span>
                    )}
                  </div>

                  {/* Provider Role Pill */}
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#F59E0B',
                      marginBottom: 8,
                    }}
                  >
                    {p.badge}
                  </div>

                  <p style={{ fontSize: 12.5, color: '#94A3B8', lineHeight: 1.55, marginBottom: 20 }}>
                    {p.description}
                  </p>
                </div>

                {/* Telemetry Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      fontSize: 12,
                      fontFamily: "'JetBrains Mono', monospace",
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                      <span>Active Model:</span>
                      <span style={{ color: '#F8FAFC', fontWeight: 700 }}>{info?.model || 'Auto-Negotiated'}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                      <span>Roundtrip Latency:</span>
                      <span style={{ color: info?.latencyMs && info.latencyMs > 0 ? '#10B981' : '#64748B', fontWeight: 700 }}>
                        {info?.latencyMs ? `${info.latencyMs} ms` : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Diagnostic Console Box */}
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: isHealthy
                        ? 'rgba(16, 185, 129, 0.05)'
                        : 'rgba(15, 23, 42, 0.6)',
                      border: isHealthy
                        ? '1px solid rgba(16, 185, 129, 0.2)'
                        : '1px solid rgba(255, 255, 255, 0.06)',
                      fontSize: 11,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: isHealthy ? '#6EE7B7' : '#94A3B8',
                      lineHeight: 1.45,
                      wordBreak: 'break-word',
                      minHeight: 48,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {loading ? (
                      <span style={{ color: '#F59E0B' }}>Probing provider endpoint...</span>
                    ) : (
                      info?.message || 'Awaiting status probe...'
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Security & Confidentiality Footer ── */}
        <div
          style={{
            padding: 24,
            borderRadius: 16,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F59E0B',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', margin: '0 0 2px' }}>
                Server-Side Secret & Inference Isolation
              </h3>
              <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>
                All provider API credentials remain strictly protected on the Express backend and are never exposed to browser bundles.
              </p>
            </div>
          </div>

          {lastProbed && (
            <span style={{ fontSize: 11, color: '#64748B', fontFamily: "'JetBrains Mono', monospace" }}>
              Last probe: {lastProbed.toLocaleTimeString()}
            </span>
          )}
        </div>

        {error && (
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#FCA5A5',
              fontSize: 13,
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

      </div>
    </div>
  );
}
