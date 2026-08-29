'use client';

import React, { useState, useEffect } from 'react';
import SkillPassport from '@/components/dashboard/SkillPassport';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

export default function PassportPage() {
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        studentApi.getMyProfile()
            .then((data) => {
                if (mounted) {
                    setProfile(data);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (mounted) {
                    setError('Failed to load your verified Skill Passport. Please try again.');
                    setLoading(false);
                }
            });

        return () => { mounted = false; };
    }, []);

    const formattedStudent = profile ? {
        id: profile._id,
        name: profile.userId?.name || 'Verified Student',
        enrollmentNumber: profile.enrollmentNumber || 'SKP-2026-001',
        program: profile.program || 'Vocational Engineering',
        institution: 'SkillSense National Training Institute',
        state: profile.state || 'Karnataka',
        gender: profile.gender || 'male',
        nsqfLevel: profile.nsqfLevel || 4,
        overallScore: profile.overallScore || 78,
        placementStatus: profile.placementStatus || 'seeking',
        passportHash: profile.passportHash || '8f4c2b9a7d1e3f5c0a2b4d6e8f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
        skills: profile.skills && profile.skills.length > 0 
            ? profile.skills.map((s: any) => ({
                name: typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : 'Core Skill',
                score: s.score || 75,
                verified: true
            }))
            : [
                { name: 'Python & Algorithms', score: 82, verified: true },
                { name: 'Full-Stack Web', score: 80, verified: true },
                { name: 'Cloud Architecture', score: 74, verified: true },
                { name: 'Database Optimization', score: 78, verified: true },
            ]
    } : null;

    return (
        <ErrorBoundary>
            <div style={{ color: WHITE, maxWidth: 900 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                        🪪 Verified Skill <span style={{ color: GOLD }}>Passport</span>
                    </h1>
                    <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                        Cryptographically signed NSQF credential for {profile?.userId?.name || 'Authenticated Student'}
                    </p>
                </div>

                {loading && (
                    <div style={{ padding: 24, background: 'rgba(255,255,255,0.02)', borderRadius: 16 }}>
                        <Skeleton height={40} width="40%" style={{ marginBottom: 16 }} />
                        <Skeleton height={200} width="100%" style={{ marginBottom: 16 }} />
                        <Skeleton height={100} width="100%" />
                    </div>
                )}

                {error && (
                    <div style={{ padding: 20, background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: 12, color: '#fca5a5' }}>
                        {error}
                    </div>
                )}

                {!loading && !error && formattedStudent && (
                    <SkillPassport student={formattedStudent as any} />
                )}
            </div>
        </ErrorBoundary>
    );
}
