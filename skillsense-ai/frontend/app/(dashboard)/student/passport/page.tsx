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
        </div>

        {/* ── Loading State ── */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="card-linear" style={{ padding: '16px 18px', borderRadius: 12 }}>
                <div style={{ height: 14, width: 100, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 12 }} />
                <div style={{ height: 24, width: 120, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }} />
              </div>
            ))}
          </div>
        )}

        {/* ── Error / Empty State ── */}
        {!loading && (error || !activeStudent) && (
          <div className="card-linear" style={{ padding: 40, borderRadius: 16, textAlign: 'center' }}>
            <Award size={36} style={{ color: 'var(--gold)', marginBottom: 12 }} />
            <h2 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
              {error ? 'Unable to Load Passport' : 'No Skill Passport Yet'}
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 16px', lineHeight: 1.6 }}>
              {error
                ? 'We could not retrieve your passport. Check your connection and try again.'
                : 'Complete assessments and skill diagnostic evaluations to generate your cryptographically sealed skill passport.'}
            </p>
            <button onClick={loadProfile} className="btn-gold" style={{ fontSize: 13, padding: '9px 20px', cursor: 'pointer' }}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {!loading && !error && activeStudent && (
        <>
        {/* ── Key Trust Badges ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Issuing Authority', value: 'Govt of Maharashtra', sub: 'MSDE & NSQF Certified', icon: Building, color: 'var(--gold)' },
            { label: 'Ledger Status', value: activeStudent.passportHash ? 'Immutable Signature' : 'Not Sealed', sub: activeStudent.passportHash ? 'SHA-256 HMAC Seal' : 'Complete assessment to seal', icon: ShieldCheck, color: '#10b981' },
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
        {activeStudent.skills.length > 0 ? (
          <SkillPassport student={activeStudent as any} />
        ) : (
          <div className="card-linear" style={{ padding: 28, borderRadius: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0 }}>
              No assessed competencies available yet. Take an assessment to populate your passport.
            </p>
          </div>
        )}
        </>
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}
