'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, UserRole } from '@/store/authStore';
import {
  User,
  GraduationCap,
  Briefcase,
  Building2,
  Globe,
  Factory,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import '../../auth.css';

const AVAILABLE_ROLES: { key: UserRole; label: string; desc: string; icon: any; badge: string }[] = [
  {
    key: 'student',
    label: 'Student / Trainee',
    desc: 'NSQF Skill Passport & career pathways',
    icon: GraduationCap,
    badge: 'Candidate',
  },
  {
    key: 'employer',
    label: 'Employer / Recruiter',
    desc: 'Verified talent pipeline & hiring',
    icon: Briefcase,
    badge: 'Corporate',
  },
  {
    key: 'institute',
    label: 'Training Institute',
    desc: 'Curriculum delivery & placement metrics',
    icon: Building2,
    badge: 'Academia',
  },
  {
    key: 'government',
    label: 'Govt / Policy Official',
    desc: 'Regional skilling heatmaps & analytics',
    icon: Globe,
    badge: 'National',
  },
  {
    key: 'industry',
    label: 'Industry Association',
    desc: 'Sector Skill demand forecasting',
    icon: Factory,
    badge: 'Ecosystem',
  },
];

const ROLE_DASHBOARD: Record<string, string> = {
  student: '/student',
  employer: '/employer',
  institute: '/institute',
  government: '/government',
  industry: '/industry',
};

export default function MobileNamePage() {
  const router = useRouter();
  const { mobileState, completeMobileRegistration } = useAuthStore();

  const [name, setName] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Guard: Ensure user has a valid registrationToken
  useEffect(() => {
    if (!mobileState?.registrationToken) {
      toast.error('Session expired. Please verify your mobile number.');
      router.replace('/auth');
    }
  }, [mobileState, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      setError('Please enter a valid full name between 2 and 80 characters.');
      return;
    }

    if (!mobileState?.registrationToken) {
      setError('Verification session expired. Please verify your mobile number again.');
      return;
    }

    setLoading(true);

    try {
      const result = await completeMobileRegistration(
        mobileState.registrationToken,
        trimmedName,
        selectedRole
      );

      toast.success(`Welcome to SkillSense AI, ${result.user.name}!`);
      const destination = ROLE_DASHBOARD[selectedRole] || '/student';
      window.location.replace(destination);
    } catch (err: any) {
      setLoading(false);
      const msg = err.response?.data?.message || err.message || 'Failed to complete profile. Please try again.';
      setError(msg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-canvas">
        <div className="auth-bg-orb auth-bg-orb--1" />
        <div className="auth-bg-orb auth-bg-orb--2" />
        <div className="auth-bg-orb auth-bg-orb--3" />
        <div className="auth-bg-grid" />
      </div>

      <div className="auth-card" style={{ maxWidth: 480 }}>
        {/* ── HEADER ── */}
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: 22 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.3)',
              padding: '4px 12px',
              borderRadius: 99,
              marginBottom: 12,
            }}
          >
            <CheckCircle2 size={13} color="#10b981" />
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#10b981',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Number Verified · {mobileState?.maskedPhone || mobileState?.phone}
            </span>
          </div>

          <h1 className="auth-title" style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Complete Your Profile
          </h1>
          <p className="auth-subtitle" style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
            Enter your name and select your stakeholder role to customize your workspace
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* ── FULL NAME INPUT ── */}
          <div className="auth-field">
            <label className="auth-field-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Full Legal Name</span>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>e.g. Pooja Patil</span>
            </label>
            <div className="auth-input-wrap">
              <User className="auth-input-icon" size={17} />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter your full name"
                className="auth-input"
                autoFocus
                required
                disabled={loading}
                style={{ fontSize: 14 }}
              />
            </div>
          </div>

          {/* ── ROLE SELECTOR ── */}
          <div className="auth-field">
            <label className="auth-field-label">Choose Your Platform Role</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {AVAILABLE_ROLES.map(({ key, label, desc, icon: Icon, badge }) => {
                const isSelected = selectedRole === key;
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedRole(key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: isSelected ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isSelected ? 'var(--gold, #f59e0b)' : 'rgba(255,255,255,0.08)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        padding: 7,
                        borderRadius: 8,
                        background: isSelected ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)',
                        color: isSelected ? 'var(--gold, #f59e0b)' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={17} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: isSelected ? '#f8fafc' : '#cbd5e1',
                          }}
                        >
                          {label}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: isSelected ? 'var(--gold, #f59e0b)' : '#64748b',
                            background: isSelected ? 'rgba(245,158,11,0.18)' : 'rgba(255,255,255,0.04)',
                            padding: '1px 6px',
                            borderRadius: 4,
                          }}
                        >
                          {badge}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{desc}</div>
                    </div>

                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 99,
                        border: `2px solid ${isSelected ? 'var(--gold, #f59e0b)' : 'rgba(255,255,255,0.2)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 99,
                            background: 'var(--gold, #f59e0b)',
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── ERROR MESSAGE ── */}
          {error && (
            <div
              style={{
                color: '#f87171',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(239,68,68,0.1)',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {/* ── SUBMIT BUTTON ── */}
          <button
            type="submit"
            className="auth-btn"
            disabled={loading || !name.trim()}
            style={{
              padding: '12px',
              borderRadius: 8,
              background: name.trim() ? 'var(--gold, #f59e0b)' : 'rgba(255,255,255,0.08)',
              color: name.trim() ? '#000' : '#64748b',
              fontWeight: 800,
              fontSize: 13.5,
              border: 'none',
              cursor: loading || !name.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 4,
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? (
              <span>Provisioning your profile...</span>
            ) : (
              <>
                <span>Complete Setup & Launch Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* ── FOOTER ── */}
        <div
          style={{
            marginTop: 20,
            paddingTop: 14,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: 11.5,
            color: '#64748b',
          }}
        >
          <ShieldCheck size={14} color="#10b981" />
          <span>Profile cryptographically tied to verified mobile credential</span>
        </div>
      </div>
    </div>
  );
}
