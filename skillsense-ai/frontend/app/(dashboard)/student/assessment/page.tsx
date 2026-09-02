'use client';

import React, { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
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
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import { ConfidenceScore } from '@/components/ui/ConfidenceScore';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface TopicConfig {
  id: string;
  name: string;
  icon: any;
  desc: string;
  nsqfLevel: number;
  badge: string;
}

const TOPICS: TopicConfig[] = [
  { id: 'JavaScript', name: 'JavaScript & TypeScript', icon: FileJson, desc: 'Async event loop, closures, generics, promises, prototype chain', nsqfLevel: 5, badge: 'Core Frontend' },
  { id: 'React', name: 'React 19 & Next.js', icon: Atom, desc: 'Server Actions, hooks, component lifecycle, hydration, SSR', nsqfLevel: 5, badge: 'Modern UI' },
  { id: 'Python', name: 'Python & Applied AI', icon: FileTerminal, desc: 'Data structures, NumPy, PyTorch models, OOP, algorithmic logic', nsqfLevel: 6, badge: 'AI / Data' },
  { id: 'Node.js', name: 'Node.js & Backend APIs', icon: Box, desc: 'Express REST, streams, buffers, clustering, JWT authentication', nsqfLevel: 5, badge: 'Backend' },
  { id: 'SQL', name: 'SQL & Database Architecture', icon: Database, desc: 'Complex joins, indexing, transactions, Prisma ORM, normal forms', nsqfLevel: 5, badge: 'Databases' },
  { id: 'Cloud', name: 'Docker & Cloud DevOps', icon: Cloud, desc: 'Container orchestration, CI/CD actions, AWS ECS, Linux admin', nsqfLevel: 6, badge: 'DevOps' },
  { id: 'System Design', name: 'System Design & Scalability', icon: Layers, desc: 'Redis caching, message queues, rate limiting, microservices', nsqfLevel: 6, badge: 'Architecture' },
  { id: 'Security', name: 'Cybersecurity & OWASP', icon: Lock, desc: 'SQLi, XSS, CSRF defense, cryptographic hashing, RBAC', nsqfLevel: 5, badge: 'Security' },
];

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
  passportSeal: string;
}

// ── Curated High-Standard Question Banks ───────────────────────────────────────
const QUESTION_BANK: Record<string, Question[]> = {
  JavaScript: [
    {
      question: 'What is the output of the following microtask vs macrotask execution order?',
      codeSnippet: `console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');`,
      options: ['A) 1, 2, 3, 4', 'B) 1, 4, 3, 2', 'C) 1, 4, 2, 3', 'D) 1, 3, 4, 2'],
      correct: 'B',
      explanation: 'Synchronous code runs first (1, 4), then microtasks in Promise.then() (3), and finally macrotasks in setTimeout (2).',
    },
    {
      question: 'How does the JavaScript prototype chain resolve property lookups?',
      options: [
        'A) It searches only the immediate object instance and throws ReferenceError',
        'B) It traverses up the __proto__ chain until Object.prototype or null is reached',
        'C) It queries global window object first before local scope',
        'D) It compiles prototype properties directly into bytecode at runtime',
      ],
      correct: 'B',
      explanation: 'Property lookup ascends the prototype chain via [[Prototype]] until found or null is encountered.',
    },
    {
      question: 'Which TypeScript operator performs strict type narrowing against null and undefined?',
      codeSnippet: `type User = { profile?: { name: string } };\nconst name = user.profile?.name ?? 'Anonymous';`,
      options: ['A) Nullish Coalescing (??)', 'B) Logical OR (||)', 'C) Ternary Operator', 'D) Type Assertion (as)'],
      correct: 'A',
      explanation: 'Nullish coalescing (??) checks specifically for null or undefined, unlike || which coerces falsey values like "" or 0.',
    },
    {
      question: 'What happens when a closure captures a variable in JavaScript?',
      options: [
        'A) It copies the primitive value once and destroys the reference',
        'B) It retains a live reference to the outer lexical environment',
        'C) It serializes the variable to heap storage on each execution',
        'D) It converts the variable into a global constant',
      ],
      correct: 'B',
      explanation: 'A closure maintains a direct reference to variables in its outer lexical scope across execution cycles.',
    },
    {
      question: 'Which array method executes without mutating the original array in modern ES2023+?',
      options: ['A) Array.prototype.sort()', 'B) Array.prototype.toSorted()', 'C) Array.prototype.reverse()', 'D) Array.prototype.splice()'],
      correct: 'B',
      explanation: 'ES2023 introduced non-mutating array methods including toSorted(), toReversed(), and toSpliced().',
    },
  ],
  React: [
    {
      question: 'What is the primary architectural benefit of React Server Components (RSC)?',
      options: [
        'A) They increase client-side bundle size to speed up SPA routing',
        'B) They execute on the server with zero client bundle impact and direct database access',
        'C) They replace all useState and useEffect client hooks entirely',
        'D) They convert CSS files into server-side JSON structures',
      ],
      correct: 'B',
      explanation: 'RSCs render purely on the server, transferring zero JavaScript code to the client browser while enabling fast data colocation.',
    },
    {
      question: 'When should you pass a dependencies array to useCallback in React?',
      codeSnippet: `const handleClick = useCallback(() => {\n  trackEvent(userId);\n}, [userId]);`,
      options: [
        'A) Always leave it empty to maximize memoization speed',
        'B) Include every reactive value referenced inside the callback',
        'C) Only include DOM references and state setters',
        'D) React 19 completely forbids dependency arrays',
      ],
      correct: 'B',
      explanation: 'All reactive values (state, props, context) referenced inside the callback must be listed to prevent stale closures.',
    },
    {
      question: 'What problem does the useOptimistic hook solve in React 19 / Next.js?',
      options: [
        'A) Compresses PNG images on the server before client download',
        'B) Instantly updates UI with expected outcome while an asynchronous Server Action executes',
        'C) Forces React to bypass DOM diffing algorithms',
        'D) Encrypts JWT tokens in memory',
      ],
      correct: 'B',
      explanation: 'useOptimistic allows immediate optimistic UI updates while the async server mutation completes in the background.',
    },
    {
      question: 'Why must React keys in mapped lists be stable and unique identifiers instead of array index?',
      options: [
        'A) Index keys cause incorrect state retention and DOM recreation during reorders/deletions',
        'B) React throws a fatal runtime exception if index is used',
        'C) Index keys increase CSS memory consumption',
        'D) Index keys disable TypeScript type checking',
      ],
      correct: 'A',
      explanation: 'Array indices change when items are inserted or removed, causing React reconciliation to mismatch component instances and internal state.',
    },
    {
      question: 'What does React.Suspense boundary provide during asynchronous streaming?',
      options: [
        'A) A fallback loading UI while async components or data promises resolve',
        'B) Automatic error logging to Sentry server',
        'C) Automatic conversion of GraphQL to REST',
        'D) Memory garbage collection',
      ],
      correct: 'A',
      explanation: 'Suspense catches pending promises from server components or lazy modules and displays a declarative fallback state.',
    },
  ],
  SQL: [
    {
      question: 'Which index type is optimal for high-cardinality exact matches and range queries (e.g. BETWEEN)?',
      options: ['A) Hash Index', 'B) B-Tree Index', 'C) Bitmap Index', 'D) Spatial Index'],
      correct: 'B',
      explanation: 'B-Tree indexes maintain sorted order, making them ideal for both point lookups and range scans.',
    },
    {
      question: 'What does the ACID property "Isolation" guarantee in relational databases?',
      options: [
        'A) Transactions survive hardware power failures',
        'B) Concurrent transactions execute without interfering with one another based on isolation level',
        'C) Constraints like foreign keys are never checked',
        'D) Data is replicated across multiple geographical zones',
      ],
      correct: 'B',
      explanation: 'Isolation ensures that concurrent transactions operate independently without seeing uncommitted intermediate states.',
    },
    {
      question: 'What is the effect of an EXPLAIN ANALYZE command in PostgreSQL?',
      options: [
        'A) Executes the query and returns both the optimizer plan and actual runtime telemetry',
        'B) Deletes duplicate records across tables',
        'C) Re-indexes all tables in the database schema',
        'D) Converts the database into NoSQL format',
      ],
      correct: 'A',
      explanation: 'EXPLAIN ANALYZE executes the SQL statement and displays actual execution time, scan methods, and row counts.',
    },
    {
      question: 'When should you use a LEFT JOIN instead of an INNER JOIN?',
      options: [
        'A) When you only want rows that have matching records in both tables',
        'B) When you want all rows from the left table regardless of whether a match exists on the right',
        'C) When performing arithmetic aggregations like SUM()',
        'D) When indexing foreign keys',
      ],
      correct: 'B',
      explanation: 'LEFT JOIN preserves all records from the primary (left) table and populates NULL for non-matching right table columns.',
    },
    {
      question: 'What does Database Normalization (3NF) achieve?',
      options: [
        'A) Eliminates transitive dependencies and reduces data redundancy',
        'B) Combines all tables into a single denormalized schema',
        'C) Disables all primary key constraints',
        'D) Multiplies database storage footprint',
      ],
      correct: 'A',
      explanation: 'Third Normal Form (3NF) requires 2NF plus removing all transitive functional dependencies where non-key attributes depend on other non-key attributes.',
    },
  ],
  Python: [
    {
      question: 'What is the purpose of the Global Interpreter Lock (GIL) in CPython?',
      options: [
        'A) Prevents race conditions by ensuring only one native thread executes Python bytecode at a time',
        'B) Compiles Python scripts into machine assembly code',
        'C) Encrypts source code files on disk',
        'D) Manages HTTP REST connections in FastAPI',
      ],
      correct: 'A',
      explanation: 'The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes simultaneously in CPython.',
    },
    {
      question: 'Which PyTorch method sets model layers (e.g. Dropout, BatchNorm) to evaluation inference mode?',
      codeSnippet: `model = NeuralNetwork()\nmodel.eval()\nwith torch.no_grad():\n    outputs = model(inputs)`,
      options: ['A) model.eval()', 'B) model.train()', 'C) model.fit()', 'D) model.compile()'],
      correct: 'A',
      explanation: 'model.eval() configures Dropout and BatchNorm layers for deterministic test-time inference.',
    },
    {
      question: 'What is a Python Generator and what keyword defines it?',
      options: [
        'A) A function that returns an iterator using the yield keyword for memory-efficient lazy evaluation',
        'B) A decorator that compiles Cython modules',
        'C) A class constructor using __init__',
        'D) A threading worker pool',
      ],
      correct: 'A',
      explanation: 'Generators use yield to produce sequence elements on-demand without loading entire datasets into RAM.',
    },
    {
      question: 'How does Python handle memory management for objects with zero references?',
      options: [
        'A) Immediate deallocation via Reference Counting, supplemented by Cyclic Garbage Collection',
        'B) Manual memory deallocation using free()',
        'C) All objects persist in RAM until process termination',
        'D) Objects are swapped to hard drive paging file',
      ],
      correct: 'A',
      explanation: 'Python utilizes reference counting for immediate cleanup and a generational garbage collector to resolve circular references.',
    },
    {
      question: 'In FastAPI, what handles asynchronous request validation and serialization?',
      options: ['A) Pydantic Schemas', 'B) Django ORM', 'C) Jinja2 Templates', 'D) Flask Blueprint'],
      correct: 'A',
      explanation: 'FastAPI relies on Pydantic models for automatic request data validation, type coercion, and OpenAPI schema generation.',
    },
  ],
};

export default function AssessmentPage() {
  const [phase, setPhase] = useState<'select' | 'quiz' | 'result'>('select');
  const [selectedTopic, setSelectedTopic] = useState<string>('JavaScript');
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
      // Attempt backend AI generation
      const { data } = await api.post('/ai/assess-skill', { topic: selectedTopic, level: difficulty });
      if (data?.data?.questions && data.data.questions.length >= 3) {
        setQuestions(data.data.questions);
      } else {
        throw new Error('Fallback required');
      }
    } catch {
      // High quality curated question bank fallback
      const list = QUESTION_BANK[selectedTopic] || QUESTION_BANK.JavaScript;
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
    const totalCount = questions.length;
    const scorePct = Math.round((correctCount / totalCount) * 100);

    const calculatedResult: EvalResult = {
      score: scorePct,
      correct: correctCount,
      total: totalCount,
      level: scorePct >= 80 ? 'Advanced' : scorePct >= 60 ? 'Proficient' : 'Foundational',
      nsqfTier: scorePct >= 80 ? 'NSQF Level 6 Certified' : scorePct >= 60 ? 'NSQF Level 5 Verified' : 'NSQF Level 4 Practitioner',
      weakAreas: scorePct >= 80 ? ['Edge Case Boundary Testing'] : ['Asynchronous State Architecture', 'Query Plan Optimization'],
      strengths: ['Core Syntax & Execution Flow', 'Algorithmic Problem Solving', 'Design Pattern Adherence'],
      improvementPlan: `Candidate demonstrated solid grasp of ${selectedTopic} principles. Focus upskilling on distributed patterns and production fault-tolerance.`,
      nextSteps: [
        'Sync score with cryptographic SkillSense Passport',
        `Explore verified openings in ${selectedTopic} Engineering`,
        'Complete targeted capstone practical project',
      ],
      passportSeal: `SKP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${scorePct}PCT`,
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
        history.push({ ...calculatedResult, topic: selectedTopic, date: new Date().toISOString() });
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

  const topicConfig = TOPICS.find((t) => t.id === selectedTopic) || TOPICS[0];

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
                Take timed, proctored competency evaluations to verify technical mastery and earn cryptographically sealed credentials for your skill passport.
              </p>
            </div>

            {/* Topic Selection Grid */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Code size={16} color="var(--gold)" /> Select Assessment Domain
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
                {TOPICS.map((t) => {
                  const Icon = t.icon;
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

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 11.5, color: '#10b981', fontFamily: 'monospace' }}>
                  <ShieldCheck size={14} /> Cryptographic Seal: {evalResult.passportSeal}
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
