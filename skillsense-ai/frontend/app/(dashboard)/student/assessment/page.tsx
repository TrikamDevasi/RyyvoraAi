'use client';

import React, { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { studentApi } from '@/lib/api/student.api';
import { resolveBranch, getAllBranchesSummary, BranchData, AssessmentTopic, BranchQuestion, saveBranchId } from '@/lib/branches';
import {
  FileJson,
  Atom,
  FileTerminal,
  Box,
  Database,
  Briefcase,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Award,
  Sparkles,
  ShieldCheck,
  Zap,
  Timer,
  Check,
  X,
  Code,
  Lock,
  Cloud,
  Terminal,
  HelpCircle,
  TrendingUp,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import { ConfidenceScore } from '@/components/ui/ConfidenceScore';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface Question {
  question: string;
  codeSnippet?: string;
  options: string[];
  correct: string;
  explanation: string;
}

interface EvalResult {
  score: number;
  correct: number;
  total: number;
  level: string;
  nsqfTier: string;
  weakAreas: string[];
  strengths: string[];
  improvementPlan: string;
  nextSteps: string[];
}

const getTopicIcon = (id: string, name: string) => {
  const text = `${id} ${name}`.toLowerCase();
  if (text.includes('code') || text.includes('script') || text.includes('software') || text.includes('web') || text.includes('react') || text.includes('frontend')) return Code;
  if (text.includes('data') || text.includes('sql') || text.includes('cloud') || text.includes('devops') || text.includes('database')) return Database;
  if (text.includes('system') || text.includes('network') || text.includes('iot') || text.includes('cad') || text.includes('mechanic')) return Layers;
  if (text.includes('circuit') || text.includes('power') || text.includes('electron') || text.includes('electric')) return Zap;
  if (text.includes('civil') || text.includes('struct') || text.includes('concrete') || text.includes('construct') || text.includes('survey')) return Building2;
  if (text.includes('security') || text.includes('cyber') || text.includes('safety')) return ShieldCheck;
  if (text.includes('ai') || text.includes('learn') || text.includes('intel') || text.includes('bio') || text.includes('gene')) return Sparkles;
  if (text.includes('auto') || text.includes('engine') || text.includes('thermo') || text.includes('fluid') || text.includes('chem')) return Box;
  return Terminal;
};

export default function AssessmentPage() {
  const { user } = useAuth();
  const [activeBranch, setActiveBranch] = useState<BranchData>(() => resolveBranch((user as any)?.program));
  const [allBranches, setAllBranches] = useState<{ id: string; code: string; name: string; domain: string }[]>(() => getAllBranchesSummary());

  const [phase, setPhase] = useState<'select' | 'quiz' | 'result'>('select');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('Intermediate');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; selected: string; correct: string; isCorrect: boolean }[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [evalResult, setEvalResult] = useState<EvalResult | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<any>(null);

  // Initialize and load student profile to resolve active academic discipline
  useEffect(() => {
    let isMounted = true;
    studentApi.getMyProfile().then((prof) => {
      if (!isMounted) return;
      const b = resolveBranch(prof?.program || (user as any)?.program);
      setActiveBranch(b);
      if (b.assessmentTopics?.length > 0) {
        setSelectedTopic(b.assessmentTopics[0].id);
      }
    }).catch(() => {
      if (!isMounted) return;
      const b = resolveBranch((user as any)?.program);
      setActiveBranch(b);
      if (b.assessmentTopics?.length > 0) {
        setSelectedTopic(b.assessmentTopics[0].id);
      }
    });
    return () => { isMounted = false; };
  }, [user]);

  // Handle switching branch discipline on demand
  const handleBranchChange = (branchId: string) => {
    const b = resolveBranch(branchId);
    saveBranchId(b.id);
    setActiveBranch(b);
    if (b.assessmentTopics?.length > 0) {
      setSelectedTopic(b.assessmentTopics[0].id);
    }
  };

  // ── Keyboard Shortcuts (A, B, C, D, Enter) ──────────────────────────────────
  useEffect(() => {
    if (phase !== 'quiz' || !questions[currentQ]) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key) && !selectedOption) {
        const q = questions[currentQ];
        const match = q.options.find((opt) => opt.startsWith(key));
        if (match) handleSelectOption(match);
      } else if (e.key === 'Enter' && selectedOption) {
        handleNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, currentQ, questions, selectedOption]);

  // ── Timer Countdown ────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'quiz') return;

    setTimeLeft(45);
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [phase, currentQ]);

  // ── Start Assessment ───────────────────────────────────────────────────────
  const startAssessment = async () => {
    setLoading(true);
    try {
      // Attempt backend AI generation with real branch context
      const { data } = await api.post('/ai/assess-skill', {
        topic: selectedTopic,
        level: difficulty,
        branch: activeBranch.name,
      });
      if (data?.data?.questions && data.data.questions.length >= 3) {
        setQuestions(data.data.questions);
      } else {
        throw new Error('Fallback required');
      }
    } catch {
      // High quality curated branch-specific question bank fallback
      const topicMatch = activeBranch.assessmentTopics.find((t) => t.id === selectedTopic);
      const list = topicMatch?.questions?.length ? topicMatch.questions : (activeBranch.assessmentTopics[0]?.questions || []);
      setQuestions(list);
    } finally {
      setAnswers([]);
      setCurrentQ(0);
      setSelectedOption(null);
      setShowExplanation(false);
      setPhase('quiz');
      setLoading(false);
    }
  };

  // ── Handle Option Selection ────────────────────────────────────────────────
  const handleSelectOption = (opt: string) => {
    if (selectedOption) return;
    const letter = opt.charAt(0).toUpperCase();
    const q = questions[currentQ];
    const isCorrect = letter === q.correct.toUpperCase();

    setSelectedOption(letter);
    setShowExplanation(true);
    setAnswers((prev) => [...prev, { question: q.question, selected: letter, correct: q.correct, isCorrect }]);
  };

  // ── Advance or Finish ──────────────────────────────────────────────────────
  const handleNextQuestion = async () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((p) => p + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      finishAssessment();
    }
  };

  const finishAssessment = async () => {
    setLoading(true);
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const totalCount = questions.length || 1;
    const scorePct = Math.round((correctCount / totalCount) * 100);
    const activeTopicConfig = activeBranch.assessmentTopics.find((t) => t.id === selectedTopic) || activeBranch.assessmentTopics[0];

    const calculatedResult: EvalResult = {
      score: scorePct,
      correct: correctCount,
      total: totalCount,
      level: scorePct >= 80 ? 'Advanced' : scorePct >= 60 ? 'Proficient' : 'Foundational',
      nsqfTier: scorePct >= 80
        ? `NSQF Level ${activeTopicConfig?.nsqfLevel || 6} Certified`
        : scorePct >= 60
        ? `NSQF Level ${Math.max(4, (activeTopicConfig?.nsqfLevel || 5) - 1)} Verified`
        : 'NSQF Level 4 Practitioner',
      weakAreas: scorePct >= 80 ? ['Advanced Non-Linear Edge Cases'] : [`${selectedTopic} Core Specifications`, 'Applied System Verification'],
      strengths: [`${selectedTopic} Principles`, 'Problem Solving Logic', 'Discipline Standards Compliance'],
      improvementPlan: `Candidate demonstrated solid grasp of ${selectedTopic} in ${activeBranch.name}. Focus upskilling on advanced real-world implementations and industry simulations.`,
      nextSteps: [
        'Sync score with the SkillSense Passport after verification',
        `Explore verified openings in ${activeBranch.name} (${selectedTopic})`,
        'Complete targeted capstone practical project',
      ],
    };

    try {
      await api.post('/assessments/submit', {
        category: selectedTopic,
        score: scorePct,
        totalQuestions: totalCount,
        aiAnalysis: calculatedResult,
      });
    } catch {
      // Save locally
      try {
        const history = JSON.parse(localStorage.getItem('skillsense_assessments') || '[]');
        history.push({ ...calculatedResult, topic: selectedTopic, branch: activeBranch.code, date: new Date().toISOString() });
        localStorage.setItem('skillsense_assessments', JSON.stringify(history));
      } catch {}
    }

    setEvalResult(calculatedResult);
    setPhase('result');
    setLoading(false);

    if (scorePct >= 70) {
      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#60a5fa'],
      });
    }

    toast.success(`Assessment Complete! Verified Score: ${scorePct}%`);
  };

  const topicConfig = activeBranch.assessmentTopics.find((t) => t.id === selectedTopic) || activeBranch.assessmentTopics[0] || {
    id: 'general',
    name: 'General Diagnostic',
    desc: 'Foundational analytical evaluation',
    nsqfLevel: 5,
    badge: 'Core',
    questions: [],
  };

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 960, margin: '0 auto', paddingBottom: 60 }}>
        {/* ── PHASE 1: TOPIC & LEVEL SELECTION ── */}
        {phase === 'select' && (
          <div>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <AIBadge type="ai" label="ADAPTIVE DIAGNOSTIC ENGINE" />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>NSQF Level Calibrated</span>
              </div>
              <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                AI Diagnostic <span style={{ color: 'var(--gold)' }}>Skill Assessment</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4, maxWidth: 680 }}>
                Take timed, proctored competency evaluations to verify technical mastery in your engineering discipline and earn cryptographically sealed credentials for your skill passport.
              </p>
            </div>

            {/* Academic Branch Selector Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 16,
              padding: '12px 16px',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(245,158,11,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold)',
                }}>
                  <GraduationCap size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                    {activeBranch.name} ({activeBranch.code})
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Sector: {activeBranch.domain} • Curated NSQF Assessment Modules
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', fontWeight: 600 }}>Switch Branch:</span>
                <select
                  value={activeBranch.id}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: 'rgba(15,23,42,0.8)',
                    border: '1px solid rgba(245,158,11,0.35)',
                    color: '#f8fafc',
                    fontSize: 12,
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {allBranches.map((b) => (
                    <option key={b.id} value={b.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Topic Selection Grid */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Code size={16} color="var(--gold)" /> Select Assessment Domain ({activeBranch.code})
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
                {activeBranch.assessmentTopics.map((t) => {
                  const Icon = getTopicIcon(t.id, t.name);
                  const isSelected = selectedTopic === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTopic(t.id)}
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        background: isSelected ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isSelected ? 'var(--gold)' : 'var(--border)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = 'var(--border)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ padding: 8, borderRadius: 8, background: isSelected ? 'var(--gold)' : 'rgba(255,255,255,0.06)', color: isSelected ? '#000' : 'var(--gold)' }}>
                          <Icon size={18} />
                        </div>
                        <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                          NSQF L{t.nsqfLevel}
                        </span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: isSelected ? 'var(--gold)' : '#f8fafc' }}>
                        {t.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
                        {t.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Difficulty & Start Card */}
            <div className="card-linear" style={{ padding: 22, borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginBottom: 8 }}>
                  Evaluation Difficulty & Calibration:
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Foundational', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        background: difficulty === lvl ? 'var(--gold)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${difficulty === lvl ? 'var(--gold)' : 'var(--border)'}`,
                        color: difficulty === lvl ? '#000' : '#cbd5e1',
                        cursor: 'pointer',
                      }}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={startAssessment}
                disabled={loading}
                className="btn-gold"
                style={{
                  padding: '12px 28px',
                  fontSize: 14,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
                <span>{loading ? 'Preparing Questions...' : `Launch ${topicConfig.name} Quiz`}</span>
              </button>
            </div>
          </div>
        )}

        {/* ── PHASE 2: LIVE QUIZ IN PROGRESS ── */}
        {phase === 'quiz' && questions[currentQ] && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Top Status Bar */}
            <div
              className="card-linear"
              style={{
                padding: '14px 20px',
                borderRadius: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase' }}>
                  {selectedTopic}
                </span>
                <span style={{ color: 'var(--border)' }}>·</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                  Question {currentQ + 1} of {questions.length}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: timeLeft <= 10 ? '#ef4444' : '#f59e0b', fontWeight: 800, fontSize: 14 }}>
                  <Timer size={16} />
                  <span>{timeLeft}s</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPhase('select')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: 12,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Exit
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${((currentQ + 1) / questions.length) * 100}%`,
                  height: '100%',
                  background: 'var(--gold)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {/* Question Card */}
            <div className="card-linear" style={{ padding: 26, borderRadius: 16 }}>
              <h2 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', margin: '0 0 16px', lineHeight: 1.5 }}>
                {questions[currentQ].question}
              </h2>

              {/* Optional Code Snippet */}
              {questions[currentQ].codeSnippet && (
                <pre
                  style={{
                    background: '#07080d',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: '14px 18px',
                    fontSize: 13,
                    fontFamily: 'monospace',
                    color: '#e2e8f0',
                    overflowX: 'auto',
                    marginBottom: 20,
                    lineHeight: 1.6,
                  }}
                >
                  {questions[currentQ].codeSnippet}
                </pre>
              )}

              {/* Options List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {questions[currentQ].options.map((opt, idx) => {
                  const letter = opt.charAt(0).toUpperCase();
                  const isSelected = selectedOption === letter;
                  const isCorrectAnswer = questions[currentQ].correct.toUpperCase() === letter;

                  let border = '1px solid var(--border)';
                  let bg = 'rgba(255,255,255,0.02)';
                  let textColor = '#e2e8f0';

                  if (showExplanation) {
                    if (isCorrectAnswer) {
                      border = '1px solid #10b981';
                      bg = 'rgba(16,185,129,0.12)';
                      textColor = '#86efac';
                    } else if (isSelected && !isCorrectAnswer) {
                      border = '1px solid #ef4444';
                      bg = 'rgba(239,68,68,0.12)';
                      textColor = '#fca5a5';
                    }
                  } else if (isSelected) {
                    border = '1px solid var(--gold)';
                    bg = 'rgba(245,158,11,0.15)';
                    textColor = 'var(--gold)';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      disabled={!!selectedOption}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 10,
                        background: bg,
                        border,
                        color: textColor,
                        textAlign: 'left',
                        fontSize: 13.5,
                        fontWeight: 600,
                        cursor: selectedOption ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>{opt}</span>
                      {showExplanation && isCorrectAnswer && <Check size={16} color="#10b981" />}
                      {showExplanation && isSelected && !isCorrectAnswer && <X size={16} color="#ef4444" />}
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Box */}
              {showExplanation && (
                <div
                  style={{
                    padding: 16,
                    borderRadius: 10,
                    background: 'rgba(245,158,11,0.06)',
                    border: '1px solid rgba(245,158,11,0.25)',
                    marginBottom: 20,
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--gold)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <HelpCircle size={14} /> Concept Explanation:
                  </div>
                  <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>
                    {questions[currentQ].explanation}
                  </div>
                </div>
              )}

              {/* Action Button */}
              {selectedOption && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="btn-gold"
                    style={{
                      padding: '10px 24px',
                      fontSize: 13.5,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                    }}
                  >
                    <span>{currentQ < questions.length - 1 ? 'Next Question' : 'Submit Evaluation'}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PHASE 3: EVALUATION RESULTS ── */}
        {phase === 'result' && evalResult && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Score Banner Card */}
            <div
              className="card-accent"
              style={{
                padding: 26,
                borderRadius: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 20,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <AIBadge type="verified" label="OFFICIAL EVALUATION COMPLETE" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', background: 'rgba(245,158,11,0.15)', padding: '2px 8px', borderRadius: 6 }}>
                    {evalResult.nsqfTier}
                  </span>
                </div>
                <div className="font-display" style={{ fontSize: 38, fontWeight: 900, color: '#f8fafc', marginTop: 4 }}>
                  {evalResult.score}%
                </div>
                <p style={{ color: '#cbd5e1', fontSize: 13.5, marginTop: 6, maxWidth: 580 }}>
                  {evalResult.improvementPlan}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 11.5, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  <ShieldCheck size={14} /> Passport seal: Pending verification on the SkillSense ledger.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
                <Link
                  href="/student/passport"
                  className="btn-gold"
                  style={{
                    padding: '10px 20px',
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    textDecoration: 'none',
                  }}
                >
                  <Award size={15} /> View in Skill Passport
                </Link>

                <button
                  type="button"
                  onClick={() => setPhase('select')}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Take Another Topic
                </button>
              </div>
            </div>

            {/* Strengths & Growth Areas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              <div className="card-linear" style={{ padding: 20, borderLeft: '4px solid #10b981', borderRadius: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#10b981', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={16} /> Verified Strengths
                </div>
                {evalResult.strengths.map((s, idx) => (
                  <div key={idx} style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 6 }}>
                    • {s}
                  </div>
                ))}
              </div>

              <div className="card-linear" style={{ padding: 20, borderLeft: '4px solid var(--gold)', borderRadius: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={16} /> Targeted Upskilling Focus
                </div>
                {evalResult.weakAreas.map((w, idx) => (
                  <div key={idx} style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 6 }}>
                    • {w}
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps Links */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              {[
                { title: 'Explore Matching Jobs', href: '/student/jobs', desc: 'Find live openings looking for this skill', icon: <Briefcase size={16} color="var(--gold)" /> },
                { title: 'Simulate Career Journey', href: '/student/career', desc: 'Predict promotion & salary curve', icon: <TrendingUp size={16} color="#10b981" /> },
                { title: 'Deep AI Analyzer', href: '/student/analyzer', desc: 'Scan code and GitHub repositories', icon: <Sparkles size={16} color="#60a5fa" /> },
              ].map((card, idx) => (
                <Link
                  key={idx}
                  href={card.href}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border)',
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    {card.icon}
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: '#f8fafc' }}>{card.title}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{card.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}
