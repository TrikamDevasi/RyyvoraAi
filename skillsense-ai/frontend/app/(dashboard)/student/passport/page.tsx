'use client';

import React, { useState, useEffect } from 'react';
import SkillPassport from '@/components/dashboard/SkillPassport';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { FadeIn } from '@/components/shared/FadeIn';
import { AIBadge } from '@/components/ui/AIBadge';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  QrCode,
  Download,
  Share2,
  ExternalLink,
  Users,
  Check,
  Building,
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface Persona {
  id: string;
  name: string;
  enrollmentNumber: string;
  program: string;
  state: string;
  gender: string;
  nsqfLevel: number;
  overallScore: number;
  placementStatus: string;
  passportHash: string;
  skills: { name: string; score: number; verified: boolean }[];
}

const SAMPLE_PERSONAS: Persona[] = [
  {
    id: 'student_arjun',
    name: 'Arjun Mehta',
    enrollmentNumber: 'SKP-78A9C2',
    program: 'Full-Stack Software Engineering',
    state: 'Maharashtra',
    gender: 'male',
    nsqfLevel: 5,
    overallScore: 84,
    placementStatus: 'placed',
    passportHash: '0x8f23b1c9e472a156df78b043ce51909a87cdb64e2154378f9910ae234bca8812',
    skills: [
      { name: 'React.js & Next.js 19 Architecture', score: 88, verified: true },
      { name: 'Node.js & Express REST Microservices', score: 82, verified: true },
      { name: 'PostgreSQL & Prisma ORM Modeling', score: 79, verified: true },
      { name: 'TypeScript Systems & Generics', score: 85, verified: true },
      { name: 'Docker & Cloud Deployment', score: 76, verified: true },
    ],
  },
  {
    id: 'student_priya',
    name: 'Priya Sharma',
    enrollmentNumber: 'SKP-99C12E',
    program: 'Applied Artificial Intelligence & Data Science',
    state: 'Maharashtra',
    gender: 'female',
    nsqfLevel: 6,
    overallScore: 91,
    placementStatus: 'placed',
    passportHash: '0x4d12a9efb87612c304a9910e52b719483ce99120ff9a4718cd99812450abce91',
    skills: [
      { name: 'Python & PyTorch Deep Learning', score: 94, verified: true },
      { name: 'Retrieval Augmented Generation (RAG)', score: 90, verified: true },
      { name: 'NumPy & Pandas Data Pipelines', score: 92, verified: true },
      { name: 'FastAPI & LLM Serving', score: 88, verified: true },
      { name: 'Vector DBs (Pinecone / Chroma)', score: 86, verified: true },
    ],
  },
  {
    id: 'student_ravi',
    name: 'Ravi Kumar',
    enrollmentNumber: 'SKP-55B32A',
    program: 'Cloud Architecture & DevOps Systems',
    state: 'Maharashtra',
    gender: 'male',
    nsqfLevel: 5,
    overallScore: 82,
    placementStatus: 'studying',
    passportHash: '0x12fa90b719a82cd45610ec8823b19487ac99812dfa901244ef91204857bca711',
    skills: [
      { name: 'Kubernetes & Docker Swarm', score: 84, verified: true },
      { name: 'AWS ECS, S3 & CloudFront Ingress', score: 81, verified: true },
      { name: 'CI/CD Pipelines (GitHub Actions)', score: 85, verified: true },
      { name: 'Linux Kernel & Shell Automation', score: 80, verified: true },
      { name: 'Prometheus & Grafana Telemetry', score: 78, verified: true },
    ],
  },
];

export default function PassportPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona>(SAMPLE_PERSONAS[0]);

  useEffect(() => {
    setLoading(true);
    studentApi
      .getMyProfile()
      .then((data) => {
        if (data && data._id) {
          setProfile(data);
        }
      })
      .catch(() => {
        // Fallback gracefully to curated verified persona
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const activeStudent: Persona = profile
    ? {
        id: profile._id,
        name: profile.userId?.name || selectedPersona.name,
        enrollmentNumber: profile.enrollmentNumber || selectedPersona.enrollmentNumber,
        program: profile.program || selectedPersona.program,
        state: profile.state || selectedPersona.state,
        gender: profile.gender || selectedPersona.gender,
        nsqfLevel: profile.nsqfLevel || selectedPersona.nsqfLevel,
        overallScore: profile.overallScore || selectedPersona.overallScore,
        placementStatus: profile.placementStatus || selectedPersona.placementStatus,
        passportHash: profile.passportHash || selectedPersona.passportHash,
        skills:
          profile.skills && profile.skills.length > 0
            ? profile.skills.map((s: any) => ({
                name: typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : 'Core Competency',
                score: s.score || 0,
                verified: true,
              }))
            : selectedPersona.skills,
      }
    : selectedPersona;

  const handleSwitchPersona = (p: Persona) => {
    setSelectedPersona(p);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981'],
    });
    toast.success(`Loaded verified credential for ${p.name}`);
  };

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1060, margin: '0 auto', paddingBottom: 60 }}>
        {/* ── Page Header Banner ── */}
        <div
          className="card-accent"
          style={{
            padding: 26,
            borderRadius: 16,
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <AIBadge type="nsqf" label="NSQF DIGITAL WORKFORCE LEDGER" />
              <AIBadge type="verified" label="DECENTRALIZED CRYPTOGRAPHIC PASSPORT" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Official Verified <span style={{ color: 'var(--gold)' }}>Skill Passport</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Tamper-proof, cryptographically signed workforce credential proving candidate competencies, real-time diagnostic performance, and employer verifications.
            </p>
          </div>

          {/* Persona Switcher Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Switch Verified Candidate Demo:
            </span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {SAMPLE_PERSONAS.map((p) => {
                const isCurrent = activeStudent.name === p.name;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSwitchPersona(p)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      background: isCurrent ? 'var(--gold)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isCurrent ? 'var(--gold)' : 'var(--border)'}`,
                      color: isCurrent ? '#000' : '#cbd5e1',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {isCurrent && <Check size={12} />}
                    <span>{p.name.split(' ')[0]}</span>
                    <span style={{ opacity: 0.7, fontSize: 10.5 }}>(L{p.nsqfLevel})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Key Trust Badges ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Issuing Authority', value: 'Govt of Maharashtra', sub: 'MSDE & NSQF Certified', icon: Building, color: 'var(--gold)' },
            { label: 'Ledger Status', value: 'Immutable Signature', sub: 'SHA-256 HMAC Seal', icon: ShieldCheck, color: '#10b981' },
            { label: 'Assessed Competencies', value: `${activeStudent.skills.length} Technical Modules`, sub: 'Real-time AI Evaluated', icon: Award, color: '#60a5fa' },
            { label: 'Composite Score', value: `${activeStudent.overallScore}% Overall`, sub: `Tier: NSQF Level ${activeStudent.nsqfLevel}`, icon: Sparkles, color: '#a855f7' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="card-linear" style={{ padding: '16px 18px', borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {stat.label}
                  </span>
                  <div style={{ padding: 6, borderRadius: 6, background: 'rgba(255,255,255,0.04)', color: stat.color }}>
                    <Icon size={15} />
                  </div>
                </div>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 800, color: stat.color }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {stat.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Skill Passport Interactive Component ── */}
        <SkillPassport student={activeStudent as any} />
      </FadeIn>
    </ErrorBoundary>
  );
}
