'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

export default function UsersPage() {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student');
    const [password, setPassword] = useState('SkillSense@2026');
    const [toast, setToast] = useState('');

    const fetchUsers = () => {
        api.get('/admin/users')
            .then(res => {
                const data = res.data?.data;
                setUsers(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3500);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/admin/users', { name, email, role, password });
            showToast('✓ User successfully created in system!');
            setShowModal(false);
            setName('');
            setEmail('');
            fetchUsers();
        } catch {
            showToast('Failed to create user. Verify email uniqueness.');
        }
    };

    const filtered = users.filter((u) => (u.name || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase()));

    return (
        <ErrorBoundary>
            <div style={{ color: WHITE, maxWidth: 1100 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                            User <span style={{ color: GOLD }}>Management Registry</span>
                        </h1>
                        <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                            Direct administrative control of system users, role authorizations, and access credentials
                        </p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="btn-gold" style={{ padding: '8px 18px', fontSize: 13, cursor: 'pointer' }}>
                        + Add System User
                    </button>
                </div>

                {toast && (
                    <div style={{ padding: 12, background: 'rgba(212,168,67,0.15)', border: `1px solid ${GOLD}`, borderRadius: 8, color: '#fff', marginBottom: 18, fontSize: 13 }}>
                        {toast}
                    </div>
                )}

                {showModal && (
                    <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', border: `1px solid ${GOLD}`, borderRadius: 14, marginBottom: 24 }}>
                        <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: GOLD }}>Register New User</h3>
                        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    style={{ padding: '10px 14px', borderRadius: 8, background: '#0d0a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13 }}
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    style={{ padding: '10px 14px', borderRadius: 8, background: '#0d0a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13 }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <select
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                    style={{ padding: '10px 14px', borderRadius: 8, background: '#0d0a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13 }}
                                >
                                    <option value="student">Student</option>
                                    <option value="institute">Institute Admin</option>
                                    <option value="industry">Industry Partner</option>
                                    <option value="government">Government Official</option>
                                </select>
                                <input
                                    type="password"
                                    placeholder="Temporary Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    style={{ padding: '10px 14px', borderRadius: 8, background: '#0d0a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13 }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                                <button type="submit" className="btn-gold" style={{ padding: '8px 20px', fontSize: 13, cursor: 'pointer' }}>Create User</button>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div style={{ marginBottom: 18 }}>
                    <input
                        type="text"
                        placeholder="Search users by name, email, or role..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, outline: 'none' }}
                    />
                </div>

                {loading ? (
                    <Skeleton height={250} width="100%" />
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>User</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Role</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8' }}>Status</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'right', color: '#94a3b8' }}>Registered Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((u) => (
                                    <tr key={u._id || u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ fontWeight: 600, color: '#fff' }}>{u.name}</div>
                                            <div style={{ fontSize: 11, color: MUTED }}>{u.email}</div>
                                        </td>
                                        <td style={{ padding: '12px 16px', textTransform: 'capitalize', color: GOLD }}>{u.role}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                                                {u.isActive !== false ? 'Active' : 'Deactivated'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right', color: MUTED }}>
                                            {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
