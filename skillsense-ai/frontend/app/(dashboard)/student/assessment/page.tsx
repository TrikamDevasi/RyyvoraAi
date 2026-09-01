'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { AssessmentHistory } from '@/types/api';
import toast from 'react-hot-toast';
import {
  FileJson,
  Atom,
  FileTerminal,
  Box,
  Database,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Award,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import { ConfidenceScore } from '@/components/ui/ConfidenceScore';
import { ScanningState } from '@/components/ui/ScanningState';

const TOPICS = [
  { id: 'JavaScript', icon: FileJson, desc: 'Async execution, ES6+, promises, event loop' },
  { id: 'React', icon: Atom, desc: 'Components, hooks, state lifecycle, memoization' },
  { id: 'Python', icon: FileTerminal, desc: 'OOP, data structures, backend libraries, algorithms' },
  { id: 'Node.js', icon: Box, desc: 'Express APIs, event emitters, stream pipelines' },
  { id: 'SQL', icon: Database, desc: 'Complex joins, indexing, query optimization, schemas' },
  { id: 'System Design', icon: Layers, desc: 'Caching, microservices, load balancing, sharding' },
];

interface Question {
  question: string;
  options: string[];
  correct: string;
  explanation?: string;
}

interface EvalResult {
  score: number;
  correct: number;
  total: number;
  level: string;
  weakAreas: string[];
  strengths: string[];
  improvementPlan: string;
  nextSteps: string[];
}

export default function AssessmentPage() {
  const { user } = useAuth();
  const { data: history, refetch } = useApi<AssessmentHistory[]>('/assessments/history');

  const [phase, setPhase] = useState<'select' | 'quiz' | 'result'>('select');
  const [topic, setTopic] = useState('JavaScript');
  const [level, setLevel] = useState('Intermediate');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; userAnswer: string; correctAnswer: string }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keyboard shortcut listener during quiz (A, B, C, D)
  useEffect(() => {
    if (phase !== 'quiz' || !questions[currentQ]) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const currentOptions = questions[currentQ].options;

      if (['A', 'B', 'C', 'D'].includes(key) && !selected) {
        const matchingOpt = currentOptions.find((opt) => opt.toUpperCase().startsWith(key));
        if (matchingOpt) {
          handleAnswer(matchingOpt);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, currentQ, questions, selected]);

  async function startAssessment() {
    if (!topic) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/ai/assess-skill', { topic, level });
      if (!data.data?.questions?.length) throw new Error('No questions generated');
      setQuestions(data.data.questions);
      setAnswers([]);
      setCurrentQ(0);
      setSelected(null);
      setPhase('quiz');
    } catch {
      setError('Failed to generate diagnostic quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleAnswer(opt: string) {
    if (selected) return;
    setSelected(opt);
    const q = questions[currentQ];
    const letter = opt.charAt(0).toUpperCase();
    const correctLetter = q.correct.charAt(0).toUpperCase();
    setAnswers((prev) => [...prev, { question: q.question, userAnswer: letter, correctAnswer: correctLetter }]);
  }

  async function nextOrFinish() {
    if (currentQ < questions.length - 1) {
      setCurrentQ((p) => p + 1);
      setSelected(null);
    } else {
      setLoading(true);
      try {
        const { data } = await api.post('/ai/assess-skill/evaluate', { topic, answers });
        const evalResult: EvalResult = data.data;
        setResult(evalResult);

        // Submit to assessment ledger
        await api.post('/assessments/submit', {
          category: topic,
          score: evalResult.score,
          totalQuestions: evalResult.total,
          aiAnalysis: evalResult,
        });

        toast.success(`Assessment Complete! Verified Score: ${evalResult.score}%`);
        setPhase('result');
        if (refetch) refetch();
      } catch {
        setError('Failed to evaluate assessment.');
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <AIBadge type="nsqf" label="NSQF DIAGNOSTIC ENGINE" />
          </div>
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Adaptive Skill Assessment & Verification
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4 }}>
            Standardized technical evaluations calibrated to NSQF national qualification levels.
          </p>
        </div>

        {/* ── PHASE 1: SELECT TOPIC & TIER ── */}
        {phase === 'select' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card-linear" style={{ padding: 22 }}>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 14 }}>
                1. Select Assessment Domain
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginBottom: 20 }}>
                {TOPICS.map((t) => {
                  const Icon = t.icon;
                  const isSelected = topic === t.id;

                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTopic(t.id)}
                      style={{
                        padding: 16,
                        borderRadius: 10,
                        background: isSelected ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isSelected ? 'var(--gold)' : 'var(--border)'}`,
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <div style={{ color: isSelected ? 'var(--gold)' : '#94a3b8' }}>
                          <Icon size={20} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 14, color: isSelected ? 'var(--gold)' : '#f8fafc' }}>
                          {t.id}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>
                        {t.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 10 }}>
                2. Calibration Level
              </h3>
              <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
                {['Beginner (NSQF 3)', 'Intermediate (NSQF 4-5)', 'Advanced (NSQF 6+)'].map((lvl) => {
                  const val = lvl.split(' ')[0];
                  const isSel = level === val;

                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(val)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 8,
                        fontSize: 12.5,
                        fontWeight: 600,
                        background: isSel ? 'rgba(245,158,11,0.12)' : 'transparent',
                        border: `1px solid ${isSel ? 'var(--gold)' : 'var(--border)'}`,
                        color: isSel ? 'var(--gold)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>

              {loading ? (
                <ScanningState
                  title="Generating Adaptive Quiz"
                  subtitle={`Creating 5 dynamic multiple-choice questions assessing ${level} knowledge of ${topic}...`}
                  stage="Question Synthesizer · Groq Cloud Engine"
                />
              ) : (
                <button
                  type="button"
                  onClick={startAssessment}
                  className="btn-gold"
                  style={{ padding: '10px 24px', fontSize: 13 }}
                >
                  <Sparkles size={14} /> Start {topic} Assessment (5 Questions)
                </button>
              )}
            </div>

            {/* History Ledger */}
            {history && history.length > 0 && (
              <div className="card-linear" style={{ padding: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 12 }}>
                  Your Verified Assessment History
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {history.slice(0, 5).map((h: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 13, color: '#f8fafc' }}>{h.category}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>
                          {new Date(h.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--gold)' }}>
                        {h.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PHASE 2: QUIZ TAKING ── */}
        {phase === 'quiz' && questions[currentQ] && (
          <div className="card-linear" style={{ padding: 26 }}>
            {/* Progress Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase' }}>
                Question {currentQ + 1} of {questions.length} · {topic} ({level})
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Press A, B, C, or D to select
              </span>
            </div>

            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 24, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${((currentQ + 1) / questions.length) * 100}%`,
                  height: '100%',
                  background: 'var(--gold)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {/* Question Text */}
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f8fafc', lineHeight: 1.5, marginBottom: 20 }}>
              {questions[currentQ].question}
            </h3>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {questions[currentQ].options.map((opt, idx) => {
                const isSelected = selected === opt;
                const letter = opt.charAt(0);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAnswer(opt)}
                    style={{
                      padding: '14px 18px',
                      borderRadius: 10,
                      background: isSelected ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isSelected ? 'var(--gold)' : 'var(--border)'}`,
                      color: isSelected ? '#f8fafc' : '#cbd5e1',
                      fontSize: 13.5,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: isSelected ? 'var(--gold)' : 'rgba(255,255,255,0.06)',
                        color: isSelected ? '#090a0f' : 'var(--text-secondary)',
                        fontWeight: 800,
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {letter}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setPhase('select')}
                className="btn-ghost"
                style={{ fontSize: 12 }}
              >
                Exit Quiz
              </button>

              <button
                type="button"
                disabled={!selected || loading}
                onClick={nextOrFinish}
                className="btn-gold"
                style={{
                  padding: '9px 24px',
                  fontSize: 13,
                  opacity: selected && !loading ? 1 : 0.5,
                  cursor: selected && !loading ? 'pointer' : 'not-allowed',
                }}
              >
                {loading ? (
                  <><RefreshCw size={14} className="animate-spin" /> Evaluating...</>
                ) : currentQ < questions.length - 1 ? (
                  <>Next Question <ArrowRight size={14} /></>
                ) : (
                  <>Complete & Score Assessment</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── PHASE 3: DIAGNOSTIC RESULTS ── */}
        {phase === 'result' && result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Score Card */}
            <div
              className="card-accent"
              style={{
                padding: 24,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div>
                <AIBadge type="verified" label="DIAGNOSTIC COMPLETE" />
                <h2 className="font-display" style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', margin: '6px 0 0' }}>
                  {topic} Competency Score
                </h2>
                <p style={{ color: '#cbd5e1', fontSize: 13, marginTop: 4 }}>
                  Answered {result.correct} of {result.total} questions correctly ({result.level} Tier).
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="font-display" style={{ fontSize: 36, fontWeight: 900, color: 'var(--gold)' }}>
                  {result.score}%
                </div>
                <div style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 2 }}>
                  <ShieldCheck size={13} /> Recorded to Skill Passport
                </div>
              </div>
            </div>

            {/* Diagnostic Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div className="card-linear" style={{ padding: 18, borderLeft: '3px solid #10b981' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={15} /> Verified Strengths
                </div>
                {result.strengths.map((s, idx) => (
                  <div key={idx} style={{ fontSize: 12.5, color: '#cbd5e1', marginBottom: 4 }}>• {s}</div>
                ))}
              </div>

              <div className="card-linear" style={{ padding: 18, borderLeft: '3px solid var(--gold)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={15} /> Targeted Improvement Areas
                </div>
                {result.weakAreas.map((w, idx) => (
                  <div key={idx} style={{ fontSize: 12.5, color: '#cbd5e1', marginBottom: 4 }}>• {w}</div>
                ))}
              </div>
            </div>

            {/* Improvement Plan */}
            <div className="card-linear" style={{ padding: 20 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>
                AI Recommended Improvement Action
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                {result.improvementPlan}
              </p>

              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <button
                  type="button"
                  onClick={() => { setPhase('select'); setResult(null); }}
                  className="btn-gold"
                  style={{ fontSize: 12.5, padding: '7px 18px' }}
                >
                  Take Another Assessment
                </button>

                <Link
                  href="/student/passport"
                  className="btn-secondary"
                  style={{ fontSize: 12.5, padding: '7px 18px' }}
                >
                  View Updated Passport →
                </Link>
              </div>
            </div>
          </div>
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}
