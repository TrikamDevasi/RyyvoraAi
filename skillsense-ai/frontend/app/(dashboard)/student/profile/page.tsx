'use client';

import React, { useState, useEffect } from 'react';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import api from '@/lib/api';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigationStore, NavigationStyle } from '@/store/navigationStore';
import { Layout, Sidebar, Menu, Check, Sparkles, User, ShieldCheck, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { AIBadge } from '@/components/ui/AIBadge';

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [name, setName] = useState('');
  const [program, setProgram] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const { navigationStyle, setNavigationStyle } = useNavigationStore();

  useEffect(() => {
    studentApi
      .getMyProfile()
      .then((data) => {
        setProfile(data);
        setName(data.userId?.name || '');
        setProgram(data.program || '');
        setState(data.state || '');
        setPhone(data.phone || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await studentApi.updateProfile(profile._id, {
        program,
        state,
        phone,
      });
      setProfile(updated);
      toast.success('Profile updated and synchronized with backend!');
      setEditing(false);
    } catch {
      toast.error('Failed to save profile. Please check your connection.');
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
      <div style={{ color: '#fff', maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <AIBadge type="verified" label="ACCOUNT SETTINGS" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, margin: 0, color: '#f8fafc' }}>
              Candidate Profile & Preferences
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4 }}>
              Manage your verified credentials, academic records, and workspace navigation layout.
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
        <div className="card-linear" style={{ padding: 24 }}>
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
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
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
                background: navigationStyle === 'sidebar' ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.02)',
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
                  <span style={{ fontWeight: 800, fontSize: 14, color: navigationStyle === 'sidebar' ? 'var(--gold)' : '#f8fafc' }}>
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

              {/* Visual Mini Diagram for Sidebar */}
              <div
                style={{
                  height: 60,
                  borderRadius: 6,
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  marginBottom: 10,
                  overflow: 'hidden',
                }}
              >
                <div style={{ width: '28%', background: 'rgba(245,158,11,0.2)', borderRight: '1px solid rgba(245,158,11,0.3)', padding: 6 }}>
                  <div style={{ width: '80%', height: 4, background: 'var(--gold)', borderRadius: 2, marginBottom: 4 }} />
                  <div style={{ width: '60%', height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, marginBottom: 4 }} />
                  <div style={{ width: '70%', height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }} />
                </div>
                <div style={{ flex: 1, padding: 6 }}>
                  <div style={{ width: '40%', height: 6, background: 'rgba(255,255,255,0.3)', borderRadius: 2, marginBottom: 6 }} />
                  <div style={{ width: '90%', height: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }} />
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>
                Keep primary navigation vertically on the left with collapsible icons (Linear & Stripe dashboard style).
              </p>
            </button>

            {/* Navbar Option */}
            <button
              type="button"
              onClick={() => handleStyleChange('navbar')}
              style={{
                padding: 18,
                borderRadius: 12,
                background: navigationStyle === 'navbar' ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.02)',
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
                  <span style={{ fontWeight: 800, fontSize: 14, color: navigationStyle === 'navbar' ? 'var(--gold)' : '#f8fafc' }}>
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

              {/* Visual Mini Diagram for Navbar */}
              <div
                style={{
                  height: 60,
                  borderRadius: 6,
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: 10,
                  overflow: 'hidden',
                }}
              >
                <div style={{ height: 16, background: 'rgba(245,158,11,0.2)', borderBottom: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px' }}>
                  <div style={{ width: 14, height: 6, background: 'var(--gold)', borderRadius: 2 }} />
                  <div style={{ width: 24, height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
                  <div style={{ width: 24, height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
                </div>
                <div style={{ flex: 1, padding: 6 }}>
                  <div style={{ width: '40%', height: 6, background: 'rgba(255,255,255,0.3)', borderRadius: 2, marginBottom: 6 }} />
                  <div style={{ width: '90%', height: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }} />
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>
                Keep primary navigation horizontally across the top with compact grouped menus (Vercel & Perplexity style).
              </p>
            </button>
          </div>
        </div>

        {/* ── Section 2: Identity & Academic Records ── */}
        <div className="card-linear" style={{ padding: 24 }}>
          <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 16 }}>
            Academic Profile & Identity
          </h3>

          {loading ? (
            <Skeleton height={200} width="100%" />
          ) : editing ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
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
                    color: '#94a3b8',
                    fontSize: 13,
                    cursor: 'not-allowed',
                  }}
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Name is cryptographically bound to your login credentials.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
                  Educational Program
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
                    color: '#fff',
                    fontSize: 13,
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
                    State / Region (India)
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Karnataka, Maharashtra"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border)',
                      color: '#fff',
                      fontSize: 13,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
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
                      color: '#fff',
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              <div style={{ padding: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Full Legal Name</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginTop: 4 }}>{name || 'Candidate'}</div>
              </div>
              <div style={{ padding: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Program Track</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginTop: 4 }}>{program || 'Software Engineering'}</div>
              </div>
              <div style={{ padding: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>State Location</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginTop: 4 }}>{state || 'Karnataka'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
