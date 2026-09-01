'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Activity, Zap, CheckCircle2, AlertTriangle, RefreshCw, Server, ShieldCheck, Clock } from 'lucide-react';

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

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<AIStatus>('/ai-health');
      setStatus(response.data);
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
      icon: <Zap className="text-amber-500" size={20} />,
      color: '#F59E0B',
    },
    {
      key: 'openai',
      name: 'OpenAI (GPT-4o)',
      badge: 'Secondary Fallback',
      description: 'Comprehensive reasoning engine for career matching, fairness auditing, and complex curriculum mapping.',
      icon: <Activity className="text-emerald-500" size={20} />,
      color: '#10B981',
    },
    {
      key: 'perplexity',
      name: 'Perplexity Sonar',
      badge: 'Market Intelligence',
      description: 'Real-time live web grounding for Indian tech hiring demand signals and salary benchmarks.',
      icon: <Server className="text-indigo-500" size={20} />,
      color: '#6366F1',
    },
  ];

  return (
    <div className="min-h-screen bg-[#08060f] text-white p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Activity size={24} />
            </div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              AI Provider Telemetry & Health
            </h1>
          </div>
          <p className="text-slate-400 text-sm">
            Live multi-provider diagnostic status, round-trip latency measurements, and failover health checks.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {providers.map((p) => {
            const info = status?.data ? status.data[p.key] : null;
            const isHealthy = info?.healthy;
            const isConfigured = info?.configured;

            return (
              <div
                key={p.key}
                className="bg-[#0f0d1c] border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl hover:border-amber-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        {p.icon}
                      </div>
                      <span className="font-bold text-base text-white">{p.name}</span>
                    </div>
                    {isHealthy ? (
                      <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20 font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    ) : isConfigured ? (
                      <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-full border border-amber-500/20 font-bold flex items-center gap-1">
                        <AlertTriangle size={12} /> Degraded
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-slate-500/10 text-slate-400 text-xs rounded-full border border-slate-500/20 font-bold">
                        Offline
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-amber-400/80 font-bold uppercase tracking-wider mb-2">
                    {p.badge}
                  </div>

                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div>
                  <div className="space-y-2 text-xs font-mono p-3 rounded-xl bg-slate-900/60 border border-white/5 mb-3">
                    <div className="flex justify-between text-slate-400">
                      <span>Active Model:</span>
                      <span className="text-white font-bold">{info?.model || 'Auto'}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Latency:</span>
                      <span className={info?.latencyMs && info.latencyMs > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                        {info?.latencyMs ? `${info.latencyMs}ms` : '—'}
                      </span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl text-xs font-mono break-words border ${isHealthy ? 'bg-green-500/5 text-green-300 border-green-500/20' : 'bg-slate-800/40 text-slate-400 border-white/5'}`}>
                    {loading ? 'Testing telemetry...' : info?.message || 'Awaiting status probe...'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} className="text-amber-500 shrink-0" />
            <div>
              <h3 className="font-bold text-white text-sm">Server-Side Secret Isolation</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                All provider API credentials remain strictly confidential on the Express server and are never sent to the browser.
              </p>
            </div>
          </div>

          <button
            onClick={checkHealth}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold text-sm rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap shadow-[0_0_20px_rgba(245,158,11,0.2)] cursor-pointer"
          >
            {loading ? <RefreshCw className="animate-spin" size={16} /> : <Activity size={16} />}
            {loading ? 'Testing Connectivity...' : 'Re-probe AI Telemetry'}
          </button>
        </div>

        {error && (
          <div className="mt-4 text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
