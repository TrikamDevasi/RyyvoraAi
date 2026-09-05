'use client';

import React, { useState, useEffect } from 'react';
import SkillPassport from '@/components/dashboard/SkillPassport';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { FadeIn } from '@/components/shared/FadeIn';
import { AIBadge } from '@/components/ui/AIBadge';
import { MetricStrip } from '@/components/dashboard/KPICard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AnalyticsPanel } from '@/components/ui/AnalyticsPanel';
import { InsightPanel } from '@/components/ui/InsightPanel';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  QrCode,
  Download,
  Share2,
  ExternalLink,
  Users,
  Check,
  Building,
  FileCheck2,
  Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PassportPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.getMyProfile();
      setProfile(data && data._id ? data : null);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setProfile(null);
      } else {
        setError('Unable to load your skill passport. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const activeStudent = profile
    ? {
        id: profile._id,
        name: profile.userId?.name || 'Student',
        enrollmentNumber: profile.enrollmentNumber || 'Not assigned',
        program: profile.program || 'Vocational Program',
        state: profile.state || '',
        gender: profile.gender || '',
        nsqfLevel: profile.nsqfLevel || 5,
        overallScore: profile.overallScore || 0,
        placementStatus: profile.placementStatus || 'studying',
        passportHash: profile.passportHash || '',
        skills:
          profile.skills && profile.skills.length > 0
            ? profile.skills.map((s: any) => ({
                name: typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : 'Core Competency',
                score: s.score || 0,
                verified: true,
              }))
            : [],
      }
    : null;

  const handleSharePassport = () => {
    if (activeStudent?.passportHash) {
      navigator.clipboard.writeText(
        `${window.location.origin}/verify/${encodeURIComponent(activeStudent.passportHash)}`
      );
      toast.success('Public verification link copied to clipboard!');
    } else {
      toast.error('Passport not yet sealed on state ledger.');
    }
  };

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 60 }}>
        {/* ── Section Header ── */}
        <SectionHeader
          breadcrumbs={[{ label: 'Career Cockpit', href: '/student' }, { label: 'Skill Passport Dossier' }]}
          badge={<AIBadge type="nsqf" label="NSQF DIGITAL WORKFORCE LEDGER" />}
          title="Official Verified Skill Passport"
          description="Tamper-proof, cryptographically signed workforce credential proving candidate competencies, real-time diagnostic performance, and employer attestation."
          actions={
            activeStudent && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleSharePassport}
                  className="btn-secondary"
                  style={{ fontSize: 13, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Share2 size={14} /> Share Ledger Link
                </button>
              </div>
            )
          }
        />

        {/* ── Loading State ── */}
        {loading && (
          <div
            style={{
              padding: 40,
              borderRadius: 10,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            <RefreshCw size={24} style={{ color: 'var(--gold)', animation: 'spin 1.5s linear infinite', marginBottom: 10 }} />
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
              Querying distributed state ledger for cryptographic signature...
            </p>
          </div>
        )}

        {/* ── Error / Empty State ── */}
        {!loading && (error || !activeStudent) && (
          <div
            style={{
              padding: 40,
              borderRadius: 10,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            <Award size={36} style={{ color: 'var(--gold)', marginBottom: 12 }} />
            <h2 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
              {error ? 'Unable to Load Passport' : 'No Skill Passport Generated Yet'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 16px', lineHeight: 1.6 }}>
              {error
                ? 'We could not retrieve your passport from the ledger node. Check your connection and try again.'
                : 'Complete diagnostic assessments and skill evaluations to generate your cryptographically sealed skill passport.'}
            </p>
            <button onClick={loadProfile} className="btn-gold" style={{ fontSize: 13, padding: '8px 20px', cursor: 'pointer' }}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {!loading && !error && activeStudent && (
          <>
            {/* ── Executive Metric Strip (Replacing 4 standalone cards) ── */}
            <div style={{ marginBottom: 20 }}>
              <MetricStrip
                items={[
                  {
                    label: 'Issuing Authority',
                    value: 'Govt of MH',
                    subtext: 'MSDE & NSQF Certified',
                    icon: Building,
                    color: 'var(--gold)',
                  },
                  {
                    label: 'Ledger Status',
                    value: activeStudent.passportHash ? 'Immutable HMAC' : 'Pending Seal',
                    subtext: activeStudent.passportHash ? 'SHA-256 Ledger Anchor' : 'Complete test to seal',
                    icon: ShieldCheck,
                    color: 'var(--success)',
                  },
                  {
                    label: 'Assessed Competencies',
                    value: `${activeStudent.skills.length} Modules`,
                    subtext: 'Proctored Diagnostics',
                    icon: Award,
                    color: 'var(--info)',
                  },
                  {
                    label: 'Composite Score',
                    value: `${activeStudent.overallScore}%`,
                    subtext: `Tier: NSQF Level ${activeStudent.nsqfLevel}`,
                    icon: FileCheck2,
                    color: '#a855f7',
                  },
                ]}
              />
            </div>

            {/* ── Skill Passport Interactive Dossier ── */}
            {activeStudent.skills.length > 0 ? (
              <div style={{ marginBottom: 20 }}>
                <SkillPassport student={activeStudent as any} />
              </div>
            ) : (
              <AnalyticsPanel
                eyebrow="PASSPORT READINESS"
                title="Awaiting Assessment Telemetry"
                description="Your passport will render here with cryptographically verified badges once competencies are assessed."
                style={{ marginBottom: 20 }}
              >
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                  No assessed competencies available yet. Complete a technical test in the assessment module to populate your passport.
                </p>
              </AnalyticsPanel>
            )}

            {/* ── Verification Policy Insight ── */}
            <InsightPanel
              title="DPDP Act 2023 & NCVET Sovereign Attestation"
              signalType="POSITIVE"
              evidence={[
                { label: 'Integrity Protocol', value: 'SHA-256 HMAC' },
                { label: 'Verification Type', value: 'Decentralized Proof' },
                { label: 'Employer Acceptance', value: 'Universal NCVET' },
              ]}
              recommendation="This passport is cryptographically signed and verifiable by any registered enterprise recruiter without sharing unredacted personal identifiers."
              actionText="Copy Public Verification Link"
              onAction={handleSharePassport}
            />
          </>
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}
