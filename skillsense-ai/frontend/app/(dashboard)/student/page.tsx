'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Radar,
  PolarGrid,
  PolarAngleAxis,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { AIInsightCard } from '@/components/ui/AIInsightCard';
import { AIBadge } from '@/components/ui/AIBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { FadeIn } from '@/components/shared/FadeIn';
import { QuickTipsSegment } from '@/components/shared/QuickTipsSegment';
import { sampleStudents, SampleStudent } from '@/data/sampleStudents';
import {
  Brain,
  Award,
  Compass,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Target,
  FileCheck,
  Zap,
  Sparkles,
  ExternalLink,
  BookOpen,
  ShieldCheck,
  Download,
  Copy,
  Check,
  Layers,
  UserCheck,
  Briefcase,
  QrCode,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';

const RadarChart = dynamic(() => import('recharts').then((mod) => mod.RadarChart), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });

const TABS = [
  { key: 'overview', label: 'Intelligence Overview' },
  { key: 'gaps', label: 'Skill Gap & Roadmap' },
  { key: 'careers', label: 'Career Pathways' },
  { key: 'passport', label: 'Skill Passport' },
  { key: 'assessments', label: 'Verified Ledgers' },
];

const DarkTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#0f111a',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 8,
          padding: '8px 12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          fontSize: 12,
        }}
      >
        <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: 4 }}>{label}</div>
        {payload.map((item: any, i: number) => (
          <div key={i} style={{ color: '#f8fafc', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ color: '#94a3b8' }}>{item.name}:</span>
            <span style={{ fontWeight: 700 }}>{item.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ── Persona definitions for 1-click interactive demo mode ──────────────────────
const DEMO_PERSONAS = [
  {
    id: 'STU001',
    name: 'Arjun Mehta',
    program: 'Full-Stack Development',
    nsqfLevel: 5,
    enrollmentNumber: 'SKP-ND2025-0142',
    passportHash: 'e7f8a92b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
    overallScore: 84,
    skills: [
      { skillId: { name: 'React.js & Next.js' }, score: 88, lastAssessed: '2026-02-15' },
      { skillId: { name: 'Node.js & Express' }, score: 82, lastAssessed: '2026-02-18' },
      { skillId: { name: 'PostgreSQL & Prisma' }, score: 79, lastAssessed: '2026-02-22' },
      { skillId: { name: 'Docker & Microservices' }, score: 75, lastAssessed: '2026-02-25' },
      { skillId: { name: 'TypeScript Systems' }, score: 85, lastAssessed: '2026-03-01' },
      { skillId: { name: 'REST & GraphQL' }, score: 86, lastAssessed: '2026-03-02' },
    ],
    growthData: [
      { cycle: 'Q1 2025', score: 62, benchmark: 60 },
      { cycle: 'Q2 2025', score: 69, benchmark: 65 },
      { cycle: 'Q3 2025', score: 76, benchmark: 70 },
      { cycle: 'Q4 2025', score: 81, benchmark: 72 },
      { cycle: 'Current', score: 84, benchmark: 75 },
    ],
    careers: [
      {
        title: 'Full-Stack Software Engineer',
        matchPercent: 92,
        salaryRange: '₹7.5 - 14.0 LPA',
        timeToAchieve: 'Immediate (Job Ready)',
        companies: ['Swiggy', 'Zerodha', 'Razorpay', 'TCS Digital'],
        roadmap: ['Deploy production CI/CD microservice', 'Contribute to open-source Next.js libraries'],
      },
      {
        title: 'Frontend Platform Architect',
        matchPercent: 88,
        salaryRange: '₹9.0 - 16.5 LPA',
        timeToAchieve: '2-3 Months',
        companies: ['Flipkart', 'Cred', 'PhonePe'],
        roadmap: ['Master React 19 Server Actions & Streaming SSR', 'Benchmark Core Web Vitals at Scale'],
      },
      {
        title: 'Backend Systems Developer',
        matchPercent: 83,
        salaryRange: '₹8.0 - 15.0 LPA',
        timeToAchieve: '3-4 Months',
        companies: ['Zomato', 'Infosys', 'Groww'],
        roadmap: ['Implement Distributed Redis Caching & BullMQ', 'Master Database Query Indexing'],
      },
    ],
    gaps: {
      targetRole: 'Senior Full-Stack Engineer (NSQF Level 6)',
      overallGapScore: 18,
      aiSummary: 'Strong proficiency in modern JavaScript/TypeScript and relational schemas. Priority growth areas include distributed caching and automated end-to-end integration testing.',
      criticalGaps: [
        { skill: 'Distributed Caching (Redis)', currentScore: 64, requiredScore: 85, priority: 'High', recommendedAction: 'Complete Redis message queue & pub/sub architecture module' },
        { skill: 'Automated E2E Testing (Playwright)', currentScore: 58, requiredScore: 80, priority: 'High', recommendedAction: 'Build full test suite for authentication and payment flows' },
        { skill: 'Kubernetes Orchestration', currentScore: 68, requiredScore: 82, priority: 'Medium', recommendedAction: 'Deploy multi-pod containerized workload with ingress routing' },
      ],
      roadmap: [
        { phase: 'Phase 1: Testing & Reliability', timeline: 'Weeks 1-4', actions: ['Implement Playwright E2E tests', 'Configure GitHub Actions CI automated coverage checks'] },
        { phase: 'Phase 2: High Throughput Caching', timeline: 'Weeks 5-8', actions: ['Integrate Redis caching layer for top 5 API endpoints', 'Implement rate-limiting middleware'] },
        { phase: 'Phase 3: Production Capstone', timeline: 'Weeks 9-12', actions: ['Deploy full microservices cluster with Prometheus telemetry', 'Publish verified skill passport'] },
      ],
    },
  },
  {
    id: 'STU002',
    name: 'Priya Sharma',
    program: 'Data Science & Applied AI',
    nsqfLevel: 6,
    enrollmentNumber: 'SKP-AI2025-0891',
    passportHash: 'b4a5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123',
    overallScore: 88,
    skills: [
      { skillId: { name: 'Python & NumPy' }, score: 94, lastAssessed: '2026-02-20' },
      { skillId: { name: 'PyTorch & Deep Learning' }, score: 89, lastAssessed: '2026-02-24' },
      { skillId: { name: 'LLM Fine-Tuning & RAG' }, score: 86, lastAssessed: '2026-02-28' },
      { skillId: { name: 'SQL & Data Warehousing' }, score: 82, lastAssessed: '2026-03-01' },
      { skillId: { name: 'FastAPI Model Serving' }, score: 87, lastAssessed: '2026-03-02' },
      { skillId: { name: 'MLOps & Experiment Tracking' }, score: 78, lastAssessed: '2026-03-02' },
    ],
    growthData: [
      { cycle: 'Q1 2025', score: 68, benchmark: 60 },
      { cycle: 'Q2 2025', score: 75, benchmark: 65 },
      { cycle: 'Q3 2025', score: 82, benchmark: 70 },
      { cycle: 'Q4 2025', score: 85, benchmark: 72 },
      { cycle: 'Current', score: 88, benchmark: 75 },
    ],
    careers: [
      {
        title: 'Applied Machine Learning Engineer',
        matchPercent: 95,
        salaryRange: '₹10.0 - 20.0 LPA',
        timeToAchieve: 'Immediate (Job Ready)',
        companies: ['TCS AI Labs', 'Wipro AI', 'Persistent', 'Lenskart'],
        roadmap: ['Deploy LangChain RAG pipeline to cloud inference endpoints', 'Optimize quantization with vLLM'],
      },
      {
        title: 'Data Science Specialist',
        matchPercent: 90,
        salaryRange: '₹8.5 - 16.0 LPA',
        timeToAchieve: '1-2 Months',
        companies: ['Mu Sigma', 'Fractal Analytics', 'LatentView'],
        roadmap: ['Build real-time streaming ETL pipeline with Apache Kafka'],
      },
    ],
    gaps: {
      targetRole: 'Principal AI Systems Architect (NSQF Level 7)',
      overallGapScore: 14,
      aiSummary: 'Exceptional foundations in model architecture and fine-tuning. Opportunity to strengthen distributed model parallel training and low-latency inference quantization.',
      criticalGaps: [
        { skill: 'Distributed Model Training (DeepSpeed)', currentScore: 66, requiredScore: 85, priority: 'High', recommendedAction: 'Train multi-GPU transformer pipeline using DeepSpeed ZeRO-3' },
        { skill: 'vLLM / TensorRT Inference Engines', currentScore: 70, requiredScore: 88, priority: 'Medium', recommendedAction: 'Benchmark sub-50ms token latency under concurrent load' },
      ],
      roadmap: [
        { phase: 'Phase 1: Quantization & Compression', timeline: 'Weeks 1-4', actions: ['Implement AWQ and GGUF quantization', 'Deploy vLLM high-throughput server'] },
        { phase: 'Phase 2: Production MLOps', timeline: 'Weeks 5-8', actions: ['Set up MLflow model registry and drift monitoring alerts'] },
      ],
    },
  },
  {
    id: 'STU003',
    name: 'Ravi Kumar',
    program: 'Cloud Infrastructure & DevOps',
    nsqfLevel: 5,
    enrollmentNumber: 'SKP-CL2025-0453',
    passportHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    overallScore: 81,
    skills: [
      { skillId: { name: 'AWS Cloud Architecture' }, score: 85, lastAssessed: '2026-02-14' },
      { skillId: { name: 'Kubernetes & Docker' }, score: 84, lastAssessed: '2026-02-19' },
      { skillId: { name: 'Terraform IaC' }, score: 80, lastAssessed: '2026-02-23' },
      { skillId: { name: 'Linux System Admin' }, score: 88, lastAssessed: '2026-02-26' },
      { skillId: { name: 'CI/CD Pipelines (ArgoCD)' }, score: 76, lastAssessed: '2026-03-01' },
      { skillId: { name: 'Observability (Prometheus/Grafana)' }, score: 79, lastAssessed: '2026-03-02' },
    ],
    growthData: [
      { cycle: 'Q1 2025', score: 58, benchmark: 60 },
      { cycle: 'Q2 2025', score: 67, benchmark: 65 },
      { cycle: 'Q3 2025', score: 73, benchmark: 70 },
      { cycle: 'Q4 2025', score: 78, benchmark: 72 },
      { cycle: 'Current', score: 81, benchmark: 75 },
    ],
    careers: [
      {
        title: 'Cloud DevOps Engineer',
        matchPercent: 91,
        salaryRange: '₹8.0 - 16.0 LPA',
        timeToAchieve: 'Immediate (Job Ready)',
        companies: ['Wipro', 'HCLTech', 'Cognizant', 'Jio Platforms'],
        roadmap: ['Build GitOps deployment workflow using ArgoCD', 'Configure AWS Multi-Region failover'],
      },
      {
        title: 'Site Reliability Engineer (SRE)',
        matchPercent: 86,
        salaryRange: '₹9.0 - 18.0 LPA',
        timeToAchieve: '2-3 Months',
        companies: ['Paytm', 'MakeMyTrip', 'Ola'],
        roadmap: ['Implement SLO/SLI alerting and chaos engineering experiments with LitmusChaos'],
      },
    ],
    gaps: {
      targetRole: 'Lead SRE & Platform Engineer (NSQF Level 6)',
      overallGapScore: 20,
      aiSummary: 'Strong Linux kernel and container fundamentals. Priority upskilling targets include zero-trust security mesh and automated blue-green traffic management.',
      criticalGaps: [
        { skill: 'Service Mesh (Istio)', currentScore: 60, requiredScore: 82, priority: 'High', recommendedAction: 'Configure mTLS and canary traffic splitting with Istio Ingress' },
        { skill: 'Security Scanning & Compliance (Trivy)', currentScore: 65, requiredScore: 84, priority: 'Medium', recommendedAction: 'Integrate Trivy container image scanning into pre-commit pipeline' },
      ],
      roadmap: [
        { phase: 'Phase 1: Zero Trust Service Mesh', timeline: 'Weeks 1-4', actions: ['Deploy Istio on Kubernetes cluster', 'Enforce strict mutual TLS authentication'] },
        { phase: 'Phase 2: Chaos Engineering & SRE', timeline: 'Weeks 5-8', actions: ['Simulate pod network latency & node outages', 'Automate self-healing alerts'] },
      ],
    },
  },
];

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedPersonaIndex, setSelectedPersonaIndex] = useState<number>(0);
  const [profile, setProfile] = useState<any>(null);
  const [careerData, setCareerData] = useState<any>(null);
  const [gapData, setGapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingGaps, setLoadingGaps] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Load active profile from backend, or seamlessly activate rich interactive persona
  const fetchProfile = async (personaIdx = selectedPersonaIndex) => {
    setLoading(true);
    try {
      const data = await studentApi.getMyProfile();
      if (data && data._id && data.skills && data.skills.length > 0) {
        setProfile(data);
        setIsDemoMode(false);

        studentApi
          .getCareerPaths(data._id)
          .then((res) => setCareerData(res))
          .catch(() => setCareerData({ topCareerPaths: DEMO_PERSONAS[0].careers }));
      } else {
        // Fallback to active demo persona
        activateDemoPersona(personaIdx);
      }
    } catch {
      // Backend offline / unauthenticated demo visitor
      activateDemoPersona(personaIdx);
    } finally {
      setLoading(false);
    }
  };

  const activateDemoPersona = (idx: number) => {
    const persona = DEMO_PERSONAS[idx] || DEMO_PERSONAS[0];
    setProfile({
      _id: persona.id,
      userId: { name: persona.name, email: `${persona.id.toLowerCase()}@skillsense.gov.in`, isVerified: true },
      enrollmentNumber: persona.enrollmentNumber,
      program: persona.program,
      nsqfLevel: persona.nsqfLevel,
      state: 'Karnataka',
      placementStatus: 'seeking',
      overallScore: persona.overallScore,
      skills: persona.skills,
      passportHash: persona.passportHash,
      growthData: persona.growthData,
    });
    setCareerData({ topCareerPaths: persona.careers });
    setGapData(persona.gaps);
    setIsDemoMode(true);
  };

  const handleSwitchPersona = (idx: number) => {
    setSelectedPersonaIndex(idx);
    activateDemoPersona(idx);
    toast.success(`Switched to persona: ${DEMO_PERSONAS[idx].name}`);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleCopyPassport = () => {
    const hash = profile?.passportHash || DEMO_PERSONAS[0].passportHash;
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    toast.success('Passport verification hash copied!');
    setTimeout(() => setCopiedHash(false), 2500);
  };

  const studentName = profile?.userId?.name || DEMO_PERSONAS[selectedPersonaIndex].name;
  const overallScore = profile?.overallScore ?? DEMO_PERSONAS[selectedPersonaIndex].overallScore;
  const nsqfLevel = profile?.nsqfLevel ?? DEMO_PERSONAS[selectedPersonaIndex].nsqfLevel;
  const program = profile?.program || DEMO_PERSONAS[selectedPersonaIndex].program;
  const skills = profile?.skills || DEMO_PERSONAS[selectedPersonaIndex].skills;
  const growthData = profile?.growthData || DEMO_PERSONAS[selectedPersonaIndex].growthData;

  const sortedSkills = [...skills].sort((a: any, b: any) => (b.score || 0) - (a.score || 0));
  const strongestSkills = sortedSkills.slice(0, 3);
  const weakestSkills = sortedSkills.slice(-2).reverse();

  const radarData = skills.map((s: any) => ({
    subject: typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : String(s.skillId),
    score: s.score || 75,
  }));

  const careers = careerData?.topCareerPaths || DEMO_PERSONAS[selectedPersonaIndex].careers;
  const topCareer = careers[0] || null;

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 60 }}>
        {/* ── Demo Persona Switcher Banner ── */}
        <div
          style={{
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: 12,
            padding: '10px 16px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--gold)' }}>
            <Zap size={16} /> <span>Interactive Student Persona Switcher:</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {DEMO_PERSONAS.map((persona, idx) => (
              <button
                key={persona.id}
                type="button"
                onClick={() => handleSwitchPersona(idx)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  background: selectedPersonaIndex === idx ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${selectedPersonaIndex === idx ? 'var(--gold)' : 'var(--border)'}`,
                  color: selectedPersonaIndex === idx ? '#000' : '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <UserCheck size={13} /> {persona.name} ({persona.program.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* ── Top Intelligence Briefing ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <AIBadge type="nsqf" label={`NSQF LEVEL ${nsqfLevel || 5}`} />
                <AIBadge type="verified" label="CREDENTIAL VERIFIED · DIGITAL SEAL" />
                {isDemoMode && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#60a5fa',
                      background: 'rgba(96,165,250,0.12)',
                      padding: '2px 8px',
                      borderRadius: 6,
                      border: '1px solid rgba(96,165,250,0.25)',
                    }}
                  >
                    Interactive Mode
                  </span>
                )}
              </div>
              <h1
                className="font-display"
                style={{
                  fontSize: 'clamp(22px, 5vw, 28px)',
                  fontWeight: 800,
                  color: '#f8fafc',
                  margin: 0,
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                }}
              >
                Welcome back, <span style={{ color: 'var(--gold)' }}>{studentName}</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, lineHeight: 1.5 }}>
                {program} · Enrollment ID:{' '}
                <span className="font-mono" style={{ color: '#cbd5e1' }}>
                  {profile?.enrollmentNumber || 'SKP-ND2025-0142'}
                </span>
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, width: '100%', flexWrap: 'wrap' }} className="sm:w-auto">
              <Link
                href="/student/analyzer"
                className="btn-gold"
                style={{ fontSize: 12.5, padding: '8px 16px', flex: 1, textAlign: 'center', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Brain size={15} /> Run AI Analyzer
              </Link>
              <Link
                href="/student/assessments"
                className="btn-secondary"
                style={{ fontSize: 12.5, padding: '8px 16px', flex: 1, textAlign: 'center', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <CheckCircle2 size={15} /> Take Assessment
              </Link>
            </div>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div
          className="no-scrollbar touch-pan-x"
          style={{
            display: 'flex',
            gap: 6,
            borderBottom: '1px solid var(--border)',
            paddingBottom: 2,
            marginBottom: 22,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                borderBottom: `2px solid ${activeTab === t.key ? 'var(--gold)' : 'transparent'}`,
                background: activeTab === t.key ? 'rgba(245,158,11,0.08)' : 'transparent',
                color: activeTab === t.key ? 'var(--gold)' : 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: activeTab === t.key ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <QuickTipsSegment />

            {/* AI Actionable Insight Banner */}
            {topCareer && (
              <AIInsightCard
                title="Workforce Placement Trajectory"
                badgeText="NSQF CAREER ALIGNMENT"
                insight={`Based on your evaluated competency score (${overallScore}/100) in ${program}, sharpening key architectural skills raises your compatibility with ${topCareer.title} roles (projected salary: ${topCareer.salaryRange || '₹8-14 LPA'}).`}
                actionText="View Upskilling Roadmap"
                actionHref="/student/career"
                confidence={Math.min(1, Math.max(0, (topCareer.matchPercent || 92) / 100))}
                category="Career Acceleration"
              />
            )}

            {/* Top Score Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              {[
                { label: 'Overall Readiness Index', value: `${overallScore}/100`, sub: 'NSQF Benchmarked', color: 'var(--gold)' },
                { label: 'Top Career Alignment', value: `${topCareer?.matchPercent || 92}%`, sub: topCareer?.title || 'Software Engineer', color: '#10b981' },
                { label: 'Assessed Competencies', value: `${skills.length} Domains`, sub: 'Skill passport entries', color: '#60a5fa' },
                { label: 'Skill Gap Index', value: `${gapData?.overallGapScore || 18}%`, sub: 'vs Indian hiring standards', color: '#f59e0b' },
              ].map((card, i) => (
                <div key={i} className="card-linear" style={{ padding: '16px 18px', borderRadius: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {card.label}
                  </div>
                  <div className="font-display" style={{ fontSize: 26, fontWeight: 800, color: card.color, marginTop: 4 }}>
                    {card.value}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {card.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Grid: Radar Matrix & Growth Trajectory */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
              {/* Radar Chart */}
              <div className="card-linear" style={{ padding: 22, borderRadius: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                      Competency Radar Analysis
                    </h3>
                    <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Measured against NSQF Level {nsqfLevel} standard
                    </p>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>6 Axis Matrix</span>
                </div>

                <div style={{ height: 260, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                      <Radar name="Assessed Score" dataKey="score" stroke="var(--gold)" fill="var(--gold)" fillOpacity={0.35} />
                      <Tooltip content={<DarkTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Trajectory Area Chart */}
              <div className="card-linear" style={{ padding: 22, borderRadius: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                      Score Growth Trajectory
                    </h3>
                    <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Progression across recent evaluation cycles vs industry benchmark
                    </p>
                  </div>
                  <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>+22% YoY</span>
                </div>

                <div style={{ height: 260, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="cycle" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis domain={[40, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip content={<DarkTooltip />} />
                      <Area type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" name="Candidate Score" />
                      <Area type="monotone" dataKey="benchmark" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorBenchmark)" name="Industry Benchmark" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Strengths & Growth Areas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              {/* Strongest Skills */}
              <div className="card-linear" style={{ padding: 20, borderLeft: '4px solid #10b981', borderRadius: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    Demonstrated Technical Strengths
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {strongestSkills.map((s: any, i: number) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                        <span style={{ color: '#f8fafc', fontWeight: 600 }}>
                          {typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : String(s.skillId)}
                        </span>
                        <span style={{ fontWeight: 800, color: '#10b981' }}>{s.score}%</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${s.score}%`, height: '100%', background: '#10b981', borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Upskilling Areas */}
              <div className="card-linear" style={{ padding: 20, borderLeft: '4px solid var(--gold)', borderRadius: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <AlertTriangle size={16} color="var(--gold)" />
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    Priority Upskilling Targets
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {weakestSkills.map((w: any, i: number) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                        <span style={{ color: '#f8fafc', fontWeight: 600 }}>
                          {typeof w.skillId === 'object' && w.skillId?.name ? w.skillId.name : String(w.skillId)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 800, color: 'var(--gold)' }}>{w.score}%</span>
                          <Link href="/student/analyzer" style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>
                            Upskill →
                          </Link>
                        </div>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${w.score}%`, height: '100%', background: 'var(--gold)', borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              {[
                { title: 'AI Skill Analyzer', href: '/student/analyzer', desc: 'Scan code, resume & GitHub repos', icon: <Brain size={16} color="var(--gold)" /> },
                { title: 'Interactive Assessments', href: '/student/assessments', desc: 'Take adaptive MCQ & coding tests', icon: <CheckCircle2 size={16} color="#10b981" /> },
                { title: 'Targeted Job Matches', href: '/student/jobs', desc: 'Browse verified hiring openings', icon: <Briefcase size={16} color="#60a5fa" /> },
                { title: 'Cryptographic Passport', href: '/student/passport', desc: 'View tamper-proof NSQF credential', icon: <Award size={16} color="#a855f7" /> },
              ].map((tile, idx) => (
                <Link
                  key={idx}
                  href={tile.href}
                  style={{
                    display: 'block',
                    padding: 16,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border)',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.background = 'rgba(245,158,11,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    {tile.icon}
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: '#f8fafc' }}>{tile.title}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{tile.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 2: SKILL GAPS & ROADMAP ── */}
        {activeTab === 'gaps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card-linear" style={{ padding: 24, borderRadius: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Target Career Benchmark
                  </span>
                  <h3 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', margin: '2px 0 0' }}>
                    {gapData?.targetRole || 'Senior Full-Stack Engineer (NSQF Level 6)'}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
                    {gapData?.aiSummary || 'Analysis compares your verified competencies against contemporary Indian hiring benchmarks (TCS, Swiggy, Zerodha, Razorpay).'}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Deficiency Index</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b' }}>
                    {gapData?.overallGapScore || 18}%
                  </div>
                </div>
              </div>

              {/* Critical Gaps Grid */}
              <div style={{ marginTop: 24 }}>
                <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#f8fafc', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={16} color="#ef4444" /> Critical Skill Deficiencies
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                  {(gapData?.criticalGaps || []).map((g: any, i: number) => (
                    <div key={i} style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: 13.5 }}>{g.skill}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: '#ef4444', background: 'rgba(239,68,68,0.12)', padding: '2px 8px', borderRadius: 6 }}>
                          {g.priority} Priority
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
                        Current: <strong style={{ color: 'var(--gold)' }}>{g.currentScore}%</strong> / Target:{' '}
                        <strong style={{ color: '#10b981' }}>{g.requiredScore}%</strong>
                      </div>
                      <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 8, lineHeight: 1.4 }}>
                        <strong>Action:</strong> {g.recommendedAction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roadmap Timeline */}
              {gapData?.roadmap && (
                <div style={{ marginTop: 28 }}>
                  <h4 style={{ fontSize: 14.5, fontWeight: 700, color: '#f8fafc', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Compass size={16} color="var(--gold)" /> Milestone Upskilling Roadmap
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {gapData.roadmap.map((step: any, i: number) => (
                      <div
                        key={i}
                        style={{
                          padding: 16,
                          background: 'rgba(255,255,255,0.02)',
                          borderRadius: 10,
                          borderLeft: '4px solid var(--gold)',
                          borderTop: '1px solid var(--border)',
                          borderRight: '1px solid var(--border)',
                          borderBottom: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--gold)' }}>
                          {step.phase} ({step.timeline})
                        </div>
                        <div style={{ fontSize: 12.5, color: '#cbd5e1', marginTop: 6, lineHeight: 1.5 }}>
                          {Array.isArray(step.actions) ? step.actions.join(' · ') : step.actions}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 3: CAREER PATHWAYS ── */}
        {activeTab === 'careers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  AI Predicted Career Pathways
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
                  Matched against verified skill scores and real-time hiring demand signals in India.
                </p>
              </div>
              <Link href="/student/career" className="btn-gold" style={{ fontSize: 12.5, padding: '7px 16px' }}>
                Open Career Explorer →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {careers.map((c: any, i: number) => (
                <div key={i} className="card-linear" style={{ padding: 22, borderRadius: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>{c.title}</h4>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--gold)', background: 'rgba(245,158,11,0.12)', padding: '3px 10px', borderRadius: 99, border: '1px solid var(--gold-border)' }}>
                      {c.matchPercent}% Match
                    </span>
                  </div>

                  <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
                    Est. Compensation: <strong style={{ color: '#10b981' }}>{c.salaryRange || '₹8-15 LPA'}</strong>
                  </div>

                  <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                    Timeline to Job Ready: <strong style={{ color: '#cbd5e1' }}>{c.timeToAchieve || 'Immediate'}</strong>
                  </div>

                  {c.companies && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4 }}>
                        Top Hiring Partners:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {c.companies.map((comp: string, idx: number) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: 11,
                              padding: '2px 8px',
                              borderRadius: 6,
                              background: 'rgba(255,255,255,0.04)',
                              border: '1px solid var(--border)',
                              color: '#cbd5e1',
                            }}
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {c.roadmap && c.roadmap.length > 0 && (
                    <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>Priority Action:</div>
                      <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 2 }}>{c.roadmap[0]}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: SKILL PASSPORT ── */}
        {activeTab === 'passport' && (
          <div className="card-linear" style={{ padding: 26, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
              <div>
                <AIBadge type="verified" label="OFFICIAL NSQF CREDENTIAL" />
                <h3 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', margin: '6px 0 0' }}>
                  Cryptographic Skill Passport
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4 }}>
                  Verifiable digital credential issued under the National Skills Qualifications Framework.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={handleCopyPassport}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 600,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    color: copiedHash ? '#10b981' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {copiedHash ? <Check size={14} /> : <Copy size={14} />}
                  {copiedHash ? 'Hash Copied' : 'Copy Seal Hash'}
                </button>
                <Link href="/student/passport" className="btn-gold" style={{ fontSize: 12.5, padding: '8px 16px' }}>
                  View Full Passport & QR →
                </Link>
              </div>
            </div>

            {/* Passport Credential Seal Card */}
            <div
              style={{
                padding: 24,
                background: 'linear-gradient(135deg, rgba(15,17,26,0.98), rgba(245,158,11,0.06))',
                borderRadius: 14,
                border: '1px solid rgba(245,158,11,0.3)',
                maxWidth: 700,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Government of India · SkillSense Digital Seal
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', marginTop: 4 }}>{studentName}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>Enrollment ID: {profile?.enrollmentNumber || 'SKP-ND2025-0142'}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>Program: {program}</div>
                  <div style={{ fontSize: 14, color: 'var(--gold)', marginTop: 8, fontWeight: 800 }}>
                    Verified Competency Score: {overallScore}/100 (NSQF Level {nsqfLevel})
                  </div>
                </div>

                <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                  <QrCode size={64} color="var(--gold)" />
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Scan to Verify</div>
                </div>
              </div>

              <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  SHA-256 HMAC Cryptographic Verification Hash
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: '#94a3b8',
                    marginTop: 4,
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                    background: 'rgba(0,0,0,0.4)',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {profile?.passportHash || DEMO_PERSONAS[0].passportHash}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: ASSESSMENTS ── */}
        {activeTab === 'assessments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Verified Assessment Ledgers ({skills.length})
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
                  All diagnostic quizzes, coding challenges, and technical evaluations recorded on your passport.
                </p>
              </div>

              <Link href="/student/assessments" className="btn-gold" style={{ fontSize: 12.5, padding: '7px 16px' }}>
                Launch New Assessment →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {skills.map((s: any, idx: number) => (
                <div
                  key={idx}
                  className="card-linear"
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: 12,
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14.5, color: '#f8fafc' }}>
                      {typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : String(s.skillId)}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={13} /> Verified on: {s.lastAssessed ? new Date(s.lastAssessed).toLocaleDateString() : 'Active Assessment'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: 'var(--gold)',
                        background: 'rgba(245,158,11,0.12)',
                        padding: '4px 12px',
                        borderRadius: 99,
                        border: '1px solid var(--gold-border)',
                      }}
                    >
                      {s.score}%
                    </span>
                    <span style={{ fontSize: 12, color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ShieldCheck size={14} /> Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}
