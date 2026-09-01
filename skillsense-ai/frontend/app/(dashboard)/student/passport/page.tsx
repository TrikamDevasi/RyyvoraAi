'use client';

import React, { useState, useEffect } from 'react';
import SkillPassport from '@/components/dashboard/SkillPassport';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { FadeIn } from '@/components/shared/FadeIn';
import { AIBadge } from '@/components/ui/AIBadge';
import { ErrorState } from '@/components/ui/ErrorState';

export default function PassportPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = () => {
    setLoading(true);
    setError(null);
    studentApi
      .getMyProfile()
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err?.response?.data?.message || 'Failed to load your verified Skill Passport. Please try again.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const formattedStudent = profile
    ? {
        id: profile._id,
        name: profile.userId?.name || 'Candidate',
        enrollmentNumber: profile.enrollmentNumber || '',
        program: profile.program || '',
        state: profile.state || '',
        gender: profile.gender || '',
        nsqfLevel: profile.nsqfLevel || 0,
        overallScore: profile.overallScore || 0,
        placementStatus: profile.placementStatus || 'seeking',
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
      <FadeIn style={{ maxWidth: 1040, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <AIBadge type="verified" label="NSQF DIGITAL CREDENTIAL" />
          </div>
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Official Verified Skill Passport
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4 }}>
            Cryptographically signed workforce credential for {profile?.userId?.name || 'Authenticated Candidate'}.
          </p>
        </div>

        {loading && (
          <div style={{ padding: 24 }} className="card-linear">
            <Skeleton height={40} width="35%" style={{ marginBottom: 16 }} />
            <Skeleton height={200} width="100%" style={{ marginBottom: 16 }} />
            <Skeleton height={100} width="100%" />
          </div>
        )}

        {error && (
          <ErrorState
            title="Passport Verification Unavailable"
            error={error}
            onRetry={fetchProfile}
          />
        )}

        {!loading && !error && formattedStudent && (
          <SkillPassport student={formattedStudent as any} />
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}
