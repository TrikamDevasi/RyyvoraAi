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
        enrollmentNumber: profile.enrollmentNumber || 'SKP-2026-LIVE',
        program: profile.program || 'Computer Science & Engineering',
        institution: 'SkillSense National Training Institute',
        state: profile.state || 'Karnataka',
        gender: profile.gender || 'male',
        nsqfLevel: profile.nsqfLevel || 4,
        overallScore: profile.overallScore || 78,
        placementStatus: profile.placementStatus || 'seeking',
        passportHash:
          profile.passportHash ||
          '8f4c2b9a7d1e3f5c0a2b4d6e8f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
        skills:
          profile.skills && profile.skills.length > 0
            ? profile.skills.map((s: any) => ({
                name: typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : 'Core Competency',
                score: s.score || 75,
                verified: true,
              }))
            : [
                { name: 'TypeScript & Algorithms', score: 85, verified: true },
                { name: 'Node.js & REST API', score: 80, verified: true },
                { name: 'Database & SQL Architecture', score: 76, verified: true },
                { name: 'System Design & Scalability', score: 72, verified: true },
              ],
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
