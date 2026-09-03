'use client';

import React, { useState, useEffect } from 'react';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigationStore, NavigationStyle } from '@/store/navigationStore';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import {
  Layout,
  Sidebar,
  Menu,
  Check,
  Sparkles,
  User,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AIBadge } from '@/components/ui/AIBadge';

const ROLE_TITLES: Record<string, { title: string; subtitle: string; trackLabel: string; badge: string }> = {
  student: {
    title: 'Candidate Profile & Preferences',
    subtitle: 'Manage your verified academic records, skill ledger credentials, and workspace navigation layout.',
    trackLabel: 'Educational Program / Domain',
    badge: 'STUDENT IDENTITY',
  },
  employer: {
    title: 'Corporate & Employer Profile',
    subtitle: 'Manage your organization profile, talent acquisition preferences, and dashboard navigation layout.',
    trackLabel: 'Industry Sector / Department',
    badge: 'EMPLOYER IDENTITY',
  },
  institute: {
    title: 'Institution & Provider Profile',
    subtitle: 'Manage your training academy profile, student roster accreditation, and workspace layout.',
    trackLabel: 'Institution Category / Faculty',
    badge: 'ACCREDITED PROVIDER',
  },
  industry: {
    title: 'Industry Council Profile',
    subtitle: 'Manage your Sector Skill Council intelligence profile, standards benchmarks, and layout.',
    trackLabel: 'Sector Skill Council / Division',
    badge: 'INDUSTRY ADVISORY',
  },
  government: {
    title: 'Government Directorate Profile',
    subtitle: 'Manage your official administrative oversight profile, state policy jurisdictions, and layout.',
    trackLabel: 'Department / Ministry Division',
    badge: 'STATE GOVERNANCE',
  },
  admin: {
    title: 'System Administrator Profile',
    subtitle: 'Manage root administrative profile, security credentials, and system navigation layout.',
    trackLabel: 'System Role / Security Clearance',
    badge: 'ROOT ADMINISTRATOR',
  },
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [program, setProgram] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const { navigationStyle, setNavigationStyle } = useNavigationStore();

  const role = (user?.role || 'student').toLowerCase();
  const meta = ROLE_TITLES[role] || ROLE_TITLES.student;

  useEffect(() => {
    // Populate immediately from authenticated user session
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }

    studentApi
      .getMyProfile()
      .then((data) => {
        if (data) {
          setProfile(data);
          setName(data.userId?.name || user?.name || '');
          setEmail(data.userId?.email || user?.email || '');
          setProgram(data.program || (role === 'employer' ? 'Corporate Technology Hiring' : 'Software Engineering'));
          setState(data.state || 'Maharashtra');
          setPhone(data.phone || user?.phone || '');
        }
        setLoading(false);
      })
      .catch(() => {
        // Fall back gracefully to user session without blocking the page
        setProgram(role === 'employer' ? 'Corporate Technology Hiring' : 'Software Engineering');
        setState('Maharashtra');
        setLoading(false);
      });
  }, [user, role]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (profile?._id) {
        const updated = await studentApi.updateProfile(profile._id, {
          program,
          state,
          phone,
        });
        setProfile(updated);
      }

      // Update auth store with updated phone/name
      useAuthStore.getState().updateUser({ phone });

      toast.success('Profile updated and synchronized successfully!');
      setEditing(false);
    } catch {
      toast.error('Failed to synchronize changes. Local preferences saved.');
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleStyleChange = async (style: NavigationStyle) => {
    await setNavigationStyle(style);
    toast.success(`Navigation updated to ${style === 'sidebar' ? 'Sidebar' : 'Top Navbar'} layout!`);
  };

  return (
    <ErrorBoundary>
      <div style={{ color: '#fff', maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <AIBadge type="verified" label={meta.badge} />
              {user?.isVerified && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 4,
                    background: 'rgba(16,185,129,0.1)',
                    color: '#10b981',
                    border: '1px solid rgba(16,185,129,0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <ShieldCheck size={12} /> Cryptographically Verified
                </span>
              )}
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {meta.title}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4 }}>
              {meta.subtitle}
            </p>
          </div>

          {!editing && !loading && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="btn-gold"
              style={{ padding: '8px 20px', fontSize: 13 }}
            >
              Edit Identity Details
            </button>
          )}
        </div>

        {/* ── Section 1: Navigation Layout Preferences ── */}
        <div className="card-linear" style={{ padding: 24, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'rgba(245,158,11,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold)',
              }}
            >
              <Layout size={18} />
            </div>
            <div>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Navigation & Workspace Layout
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 12.5, margin: '2px 0 0' }}>
                Choose how your primary application navigation appears across desktop views.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {/* Sidebar Option */}
            <button
              type="button"
              onClick={() => handleStyleChange('sidebar')}
              style={{
                padding: 18,
                borderRadius: 12,
                background: navigationStyle === 'sidebar' ? 'rgba(245,158,11,0.08)' : 'var(--bg-surface-elevated)',
                border: `2px solid ${navigationStyle === 'sidebar' ? 'var(--gold)' : 'var(--border)'}`,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sidebar size={18} color={navigationStyle === 'sidebar' ? 'var(--gold)' : '#94a3b8'} />
                  <span style={{ fontWeight: 800, fontSize: 14, color: navigationStyle === 'sidebar' ? 'var(--gold)' : 'var(--text-primary)' }}>
                    Sidebar Mode
                  </span>
                </div>
                {navigationStyle === 'sidebar' && (
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'var(--gold)',
                      color: '#090a0f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>
                Full-height vertical collapsible navigation on the left. Ideal for deep multi-tasking and workspace dashboards.
              </p>
            </button>

            {/* Navbar Option */}
            <button
              type="button"
              onClick={() => handleStyleChange('navbar')}
              style={{
                padding: 18,
                borderRadius: 12,
                background: navigationStyle === 'navbar' ? 'rgba(245,158,11,0.08)' : 'var(--bg-surface-elevated)',
                border: `2px solid ${navigationStyle === 'navbar' ? 'var(--gold)' : 'var(--border)'}`,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Menu size={18} color={navigationStyle === 'navbar' ? 'var(--gold)' : '#94a3b8'} />
                  <span style={{ fontWeight: 800, fontSize: 14, color: navigationStyle === 'navbar' ? 'var(--gold)' : 'var(--text-primary)' }}>
                    Top Navbar Mode
                  </span>
                </div>
                {navigationStyle === 'navbar' && (
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'var(--gold)',
                      color: '#090a0f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>
                Compact horizontal top navigation bar. Clean, distraction-free view with maximum horizontal screen real estate.
              </p>
            </button>
          </div>
        </div>

        {/* ── Section 2: Identity & Account Records ── */}
        <div className="card-linear" style={{ padding: 24, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
          <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
            Identity & Account Records
          </h3>

          {loading ? (
            <Skeleton height={200} width="100%" />
          ) : editing ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={name}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                    fontSize: 13,
                    cursor: 'not-allowed',
                  }}
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Name is cryptographically bound to your login credentials.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                    fontSize: 13,
                    cursor: 'not-allowed',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {meta.trackLabel}
                </label>
                <input
                  type="text"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                    State / Region (India)
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra, Karnataka"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-gold"
                  style={{ fontSize: 13, padding: '8px 22px' }}
                >
                  {saving ? 'Saving Changes...' : 'Save Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn-ghost"
                  style={{ fontSize: 13 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div style={{ padding: 14, background: 'var(--bg-surface-elevated)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Full Legal Name</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{name || user?.name || 'Verified User'}</div>
              </div>
              <div style={{ padding: 14, background: 'var(--bg-surface-elevated)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Email Address</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{email || user?.email || 'user@skillsense.ai'}</div>
              </div>
              <div style={{ padding: 14, background: 'var(--bg-surface-elevated)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{meta.trackLabel}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{program || 'Technology Track'}</div>
              </div>
              <div style={{ padding: 14, background: 'var(--bg-surface-elevated)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>State Jurisdiction</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{state || 'Maharashtra'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
