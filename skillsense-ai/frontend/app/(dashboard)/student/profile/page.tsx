'use client';

import React, { useState, useEffect, useRef } from 'react';
import { studentApi, StudentProfile } from '@/lib/api/student.api';
import api from '@/lib/api';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';

const GOLD = '#D4A843';

export default function ProfilePage() {
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [name, setName] = useState('');
    const [program, setProgram] = useState('');
    const [state, setState] = useState('');
    const [phone, setPhone] = useState('');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        studentApi.getMyProfile()
            .then(data => {
                setProfile(data);
                setName(data.userId?.name || '');
                setProgram(data.program || '');
                setState(data.state || '');
                setPhone(data.phone || '');
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

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
            showToast('✓ Profile updated and synchronized with backend!');
            setEditing(false);
        } catch {
            showToast('Failed to save profile. Please check your network connection.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ErrorBoundary>
            <div style={{ color: '#fff', maxWidth: 800 }}>
                <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
                            Candidate <span style={{ color: GOLD }}>Profile</span>
                        </h1>
                        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                            Manage your verified academic records, NSQF tier, and identity
                        </p>
                    </div>
                    {!editing && !loading && (
                        <button onClick={() => setEditing(true)} className="btn-gold" style={{ padding: '8px 20px', fontSize: 13, cursor: 'pointer' }}>
                            Edit Profile
                        </button>
                    )}
                </div>

                {toast && (
                    <div style={{ padding: 12, background: 'rgba(212,168,67,0.15)', border: `1px solid ${GOLD}`, borderRadius: 8, color: '#fff', marginBottom: 18, fontSize: 13 }}>
                        {toast}
                    </div>
                )}

                {loading ? (
                    <Skeleton height={250} width="100%" />
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', padding: 24 }}>
                        {editing ? (
                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        disabled
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: '#0a0a14', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: 13, cursor: 'not-allowed' }}
                                    />
                                    <span style={{ fontSize: 11, color: '#64748b' }}>Account name is cryptographically bound to your login credentials.</span>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Academic Program / Domain</label>
                                    <input
                                        type="text"
                                        value={program}
                                        onChange={e => setProgram(e.target.value)}
                                        placeholder="e.g. Full-Stack Development"
                                        required
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: '#0d0a1a', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>State / Region</label>
                                        <input
                                            type="text"
                                            value={state}
                                            onChange={e => setState(e.target.value)}
                                            placeholder="e.g. Maharashtra"
                                            required
                                            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: '#0d0a1a', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Phone (Optional)</label>
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            placeholder="+91 9876543210"
                                            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: '#0d0a1a', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13 }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                                    <button type="submit" disabled={saving} className="btn-gold" style={{ padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button type="button" onClick={() => setEditing(false)} style={{ padding: '10px 20px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                                    <div>
                                        <div style={{ fontSize: 12, color: '#64748b' }}>Candidate Name</div>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginTop: 2 }}>{profile?.userId?.name || 'Candidate'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 12, color: '#64748b' }}>Email Address</div>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginTop: 2 }}>{profile?.userId?.email || '—'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 12, color: '#64748b' }}>Academic Program</div>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: GOLD, marginTop: 2 }}>{profile?.program || 'Engineering & Technology'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 12, color: '#64748b' }}>NSQF Tier</div>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: '#22c55e', marginTop: 2 }}>Level {profile?.nsqfLevel || 4} Certified</div>
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginTop: 8 }}>
                                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Verified Skills ({profile?.skills?.length || 0})</div>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {(profile?.skills || []).map((s, idx) => (
                                            <span key={idx} style={{ padding: '4px 10px', background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.25)', borderRadius: 6, fontSize: 12, color: GOLD }}>
                                                {typeof s.skillId === 'object' && s.skillId?.name ? s.skillId.name : `Competency ${idx + 1}`} ({s.score}%)
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
