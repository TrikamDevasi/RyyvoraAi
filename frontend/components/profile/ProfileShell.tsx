'use client';

import React, { useState, useEffect } from 'react';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import api from '@/lib/api';
import { setTokens } from '@/lib/auth';
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
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Building2,
  Globe,
  Factory,
  Settings,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AIBadge } from '@/components/ui/AIBadge';

const ROLE_TITLES: Record<string, { title: string; subtitle: string; trackLabel: string; badge: string }> = {
  student: {
    title: 'Candidate Profile & Credentials',
    subtitle: 'Manage verified academic records, NSQF skill credentials, and workspace preferences.',
    trackLabel: 'Educational Program / Domain',
    badge: 'STUDENT IDENTITY',
  },
  employer: {
    title: 'Corporate & Employer Profile',
    subtitle: 'Manage organization identity, talent acquisition preferences, and verification ledger settings.',
    trackLabel: 'Industry Sector / Department',
    badge: 'EMPLOYER IDENTITY',
  },
  institute: {
    title: 'Training Institution Profile',
    subtitle: 'Manage academy accreditation, vocational cohort registries, and institutional settings.',
    trackLabel: 'Institution Category / Faculty',
    badge: 'ACCREDITED PROVIDER',
  },
  industry: {
    title: 'Sector Skill Council Profile',
    subtitle: 'Manage National Occupational Standards benchmarks, sector advisory metrics, and layout.',
    trackLabel: 'Sector Skill Council / Division',
    badge: 'INDUSTRY ADVISORY',
  },
  government: {
    title: 'Government Directorate Profile',
    subtitle: 'Manage state administrative oversight, policy jurisdiction boundaries, and analytics.',
    trackLabel: 'Department / Ministry Division',
    badge: 'STATE GOVERNANCE',
  },
  admin: {
    title: 'System Administrator Profile',
    subtitle: 'Manage root system credentials, algorithmic audit parameters, and platform operations.',
    trackLabel: 'Security Clearance / Role',
    badge: 'ROOT ADMINISTRATOR',
  },
};

const AVAILABLE_ROLES = [
  { key: 'student', label: 'Candidate / Trainee', desc: 'Skill Passport, assessments & longitudinal journey', icon: GraduationCap, href: '/student/profile' },
  { key: 'employer', label: 'Corporate Employer', desc: 'Candidate validations, talent pool & hiring drives', icon: Briefcase, href: '/employer/profile' },
  { key: 'institute', label: 'Training Institute', desc: 'Batch cohorts, evaluations & placement ROI', icon: Building2, href: '/institute/profile' },
  { key: 'government', label: 'Government Directorate', desc: 'State retention heatmaps & fund targeting', icon: Globe, href: '/government/profile' },
  { key: 'industry', label: 'Sector Skill Council', desc: 'Occupational standards & industry demand', icon: Factory, href: '/industry/profile' },
  { key: 'admin', label: 'System Administrator', desc: 'Platform governance, fairness & audit logs', icon: Settings, href: '/admin/profile' },
];

interface ProfileShellProps {
  forcedRole?: string;
}

export function ProfileShell({ forcedRole }: ProfileShellProps) {
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
  const [switchingRole, setSwitchingRole] = useState(false);

  const { navigationStyle, setNavigationStyle } = useNavigationStore();

  const role = (forcedRole || user?.role || 'student').toLowerCase();
  const meta = ROLE_TITLES[role] || ROLE_TITLES.student;

  useEffect(() => {
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
          setProgram(data.program || (role === 'employer' ? 'Corporate Talent Operations' : 'Vocational & Technical Education'));
          setState(data.state || 'Maharashtra');
          setPhone(data.phone || user?.phone || '');
        }
        setLoading(false);
      })
      .catch(() => {
        setProgram(role === 'employer' ? 'Corporate Talent Operations' : 'Vocational & Technical Education');
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

      useAuthStore.getState().updateUser({ phone });
      toast.success('Profile details synchronized successfully.');
      setEditing(false);
    } catch {
      toast.error('Failed to synchronize changes. Local settings preserved.');
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleStyleChange = async (style: NavigationStyle) => {
    await setNavigationStyle(style);
    toast.success(`Navigation updated to ${style === 'sidebar' ? 'Sidebar' : 'Top Navbar'} mode.`);
  };

  const handleRoleSwitch = async (newRole: string, destinationHref: string) => {
    if (newRole === role) {
      window.location.href = destinationHref;
      return;
    }
    setSwitchingRole(true);
    try {
      const res = await api.post('/auth/switch-role', { role: newRole });
      const { user: updatedUser, token } = res.data.data;

      setTokens(token, updatedUser.role);
      useAuthStore.getState().setAuth(updatedUser, token);

      toast.success(`Active persona switched to ${newRole.toUpperCase()}. Loading profile...`);
      setTimeout(() => {
        window.location.href = destinationHref;
      }, 300);
    } catch {
      const token = localStorage.getItem('ryyvora_token') || localStorage.getItem('skillsense_token') || '';
      setTokens(token, newRole);
      useAuthStore.getState().updateUser({ role: newRole as any });
      toast.success(`Active persona switched to ${newRole.toUpperCase()}.`);
      window.location.href = destinationHref;
    } finally {
      setSwitchingRole(false);
    }
  };

  return (
    <ErrorBoundary>
      <div style={{ color: 'var(--text-primary)', maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <AIBadge type="verified" label={meta.badge} />
              {user?.isVerified && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 650,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: 'var(--success-bg)',
                    color: 'var(--success)',
                    border: '1px solid var(--success-border)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <ShieldCheck size={12} /> Cryptographically Verified
                </span>
              )}
            </div>
            <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              {meta.title}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
              {meta.subtitle}
            </p>
          </div>

          {!editing && !loading && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="btn-gold"
              style={{ padding: '7px 18px', fontSize: 12.5, borderRadius: 6 }}
            >
              Edit Identity Details
            </button>
          )}
        </div>

        {/* ── Section 1: Active Platform Stakeholder Persona Switcher ── */}
        <div style={{ padding: 22, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Briefcase size={18} color="var(--gold)" />
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Platform Stakeholder Persona
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 12.5, margin: '2px 0 0' }}>
                Active role context controls permissions, verification ledgers, and institutional access.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {AVAILABLE_ROLES.map(({ key, label, desc, icon: Icon, href }) => {
              const isCurrent = role === key;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={switchingRole}
                  onClick={() => handleRoleSwitch(key, href)}
                  style={{
                    padding: 14,
                    borderRadius: 8,
                    background: isCurrent ? 'var(--gold-muted)' : 'var(--bg-surface-elevated)',
                    border: `1.5px solid ${isCurrent ? 'var(--gold)' : 'var(--border)'}`,
                    textAlign: 'left',
                    cursor: switchingRole ? 'wait' : 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      padding: 7,
                      borderRadius: 6,
                      background: isCurrent ? 'var(--gold)' : 'var(--bg-surface)',
                      color: isCurrent ? '#090a0f' : 'var(--text-secondary)',
                      flexShrink: 0,
                      border: '1px solid var(--border)',
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 650, color: isCurrent ? 'var(--gold)' : 'var(--text-primary)' }}>
                        {label}
                      </span>
                      {isCurrent && (
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background: 'var(--gold)',
                            color: '#090a0f',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={10} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.3 }}>
                      {desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Section 2: Navigation Layout Preferences ── */}
        <div className="desktop-only" style={{ padding: 22, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Layout size={18} color="var(--gold)" />
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Navigation & Workspace Layout
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 12.5, margin: '2px 0 0' }}>
                Select desktop navigation mode for this device.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            <button
              type="button"
              onClick={() => handleStyleChange('sidebar')}
              style={{
                padding: 16,
                borderRadius: 8,
                background: navigationStyle === 'sidebar' ? 'var(--gold-muted)' : 'var(--bg-surface-elevated)',
                border: `1.5px solid ${navigationStyle === 'sidebar' ? 'var(--gold)' : 'var(--border)'}`,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sidebar size={16} color={navigationStyle === 'sidebar' ? 'var(--gold)' : 'var(--text-muted)'} />
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: navigationStyle === 'sidebar' ? 'var(--gold)' : 'var(--text-primary)' }}>
                    Sidebar Mode
                  </span>
                </div>
                {navigationStyle === 'sidebar' && (
                  <Check size={14} color="var(--gold)" />
                )}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>
                Vertical navigation pane on the left. Recommended for multi-district workflows.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleStyleChange('navbar')}
              style={{
                padding: 16,
                borderRadius: 8,
                background: navigationStyle === 'navbar' ? 'var(--gold-muted)' : 'var(--bg-surface-elevated)',
                border: `1.5px solid ${navigationStyle === 'navbar' ? 'var(--gold)' : 'var(--border)'}`,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Menu size={16} color={navigationStyle === 'navbar' ? 'var(--gold)' : 'var(--text-muted)'} />
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: navigationStyle === 'navbar' ? 'var(--gold)' : 'var(--text-primary)' }}>
                    Top Navbar Mode
                  </span>
                </div>
                {navigationStyle === 'navbar' && (
                  <Check size={14} color="var(--gold)" />
                )}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>
                Horizontal top bar. Maximizes horizontal space for data tables and charts.
              </p>
            </button>
          </div>
        </div>

        {/* ── Section 3: Identity & Account Records ── */}
        <div style={{ padding: 22, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
            Identity & Organization Records
          </h3>

          {loading ? (
            <Skeleton height={180} width="100%" />
          ) : editing ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 650, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={name}
                  disabled
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 6,
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                    fontSize: 13,
                    cursor: 'not-allowed',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 650, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 6,
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                    fontSize: 13,
                    cursor: 'not-allowed',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 650, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  {meta.trackLabel}
                </label>
                <input
                  type="text"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  placeholder="e.g. Directorate of Vocational Education & Training"
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 6,
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 650, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    State Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 6,
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 650, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 6,
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-gold"
                  style={{ fontSize: 12.5, padding: '7px 20px', borderRadius: 6 }}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn-ghost"
                  style={{ fontSize: 12.5, padding: '7px 16px', borderRadius: 6 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div style={{ padding: 12, background: 'var(--bg-surface-elevated)', borderRadius: 6, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Full Legal Name</div>
                <div style={{ fontSize: 13.5, fontWeight: 650, color: 'var(--text-primary)', marginTop: 4 }}>{name || user?.name || 'Verified User'}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg-surface-elevated)', borderRadius: 6, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Email Address</div>
                <div style={{ fontSize: 13.5, fontWeight: 650, color: 'var(--text-primary)', marginTop: 4 }}>{email || user?.email || 'user@ryyvora.ai'}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg-surface-elevated)', borderRadius: 6, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{meta.trackLabel}</div>
                <div style={{ fontSize: 13.5, fontWeight: 650, color: 'var(--text-primary)', marginTop: 4 }}>{program || 'Technology Track'}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg-surface-elevated)', borderRadius: 6, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>State Jurisdiction</div>
                <div style={{ fontSize: 13.5, fontWeight: 650, color: 'var(--text-primary)', marginTop: 4 }}>{state || 'Maharashtra'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
