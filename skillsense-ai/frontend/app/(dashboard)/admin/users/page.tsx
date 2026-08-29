'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Users, Search, UserPlus } from 'lucide-react';

const GOLD = '#F59E0B';
const MUTED = '#94A3B8';
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
                        <h1 className="font-display" style={{ margin: 0, fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                            <Users size={26} style={{ color: GOLD, marginRight: 10 }} /> User <span style={{ color: GOLD, marginLeft: 6 }}>Management Registry</span>
                        </h1>
                        <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                            Direct administrative control of system users, role authorizations, and access credentials
                        </p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="btn-gold" style={{ cursor: 'pointer' }}>
                        <UserPlus size={14} /> Add System User
                    </button>
                </div>

                {toast && (
                    <div style={{ padding: 12, background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e', borderRadius: 8, color: '#86efac', marginBottom: 18, fontSize: 13 }}>
                        {toast}
                    </div>
                )}

                {showModal && (
                    <div className="card-base" style={{ border: `1px solid ${GOLD}`, marginBottom: 24 }}>
                        <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: GOLD }}>Register New User</h3>
                        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    className="input-base"
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className="input-base"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <select
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                    className="input-base"
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
                                    className="input-base"
                                />
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                                <button type="submit" className="btn-gold">Create User</button>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: MUTED, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div style={{ position: 'relative', marginBottom: 18 }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED }} />
                    <input
                        type="text"
                        placeholder="Search users by name, email, or role..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input-base"
                        style={{ paddingLeft: 36 }}
                    />
                </div>

                {loading ? (
                    <Skeleton height={250} width="100%" />
                ) : (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Registered Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((u) => (
                                    <tr key={u._id || u.id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{u.name}</div>
                                            <div style={{ fontSize: 11, color: MUTED }}>{u.email}</div>
                                        </td>
                                        <td style={{ textTransform: 'capitalize', color: GOLD, fontWeight: 600 }}>{u.role}</td>
                                        <td>
                                            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                                                {u.isActive !== false ? 'Active' : 'Deactivated'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right', color: MUTED, fontSize: 12 }}>
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
