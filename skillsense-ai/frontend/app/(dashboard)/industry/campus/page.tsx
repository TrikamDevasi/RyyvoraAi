'use client';

import React, { useState, useEffect } from 'react';
import { Handshake } from 'lucide-react';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

export default function CampusPage() {
    const [institutions, setInstitutions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInst, setSelectedInst] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState('');
    const [toastError, setToastError] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        api.get('/industry/campus-connect')
            .then(res => {
                const data = res.data?.data;
                setInstitutions(Array.isArray(data) ? data : []);
                setError(Array.isArray(data) && data.length === 0 ? 'No verified institutions are currently listed for campus partnerships.' : '');
            })
            .catch(() => {
                setError('Campus partner data is currently unavailable. Please try again.');
            })
            .finally(() => setLoading(false));
    }, []);

    const showToast = (msg: string, isError = false) => {
        setToast(msg);
        setToastError(isError);
        setTimeout(() => setToast(''), 4000);
    };

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyName || !email) return;
        setSubmitting(true);
        try {
            await api.post('/contact/industry', {
                companyName,
                workEmail: email,
                message: `Campus Drive Request for ${selectedInst || 'Institute'}: ${message || 'Interested in campus hiring drive.'}`,
            });
            showToast(`✓ Campus drive request dispatched to ${selectedInst || 'institution'}!`);
            setSelectedInst('');
            setMessage('');
        } catch {
            showToast('Your campus drive request could not be submitted. Please try again.', true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ErrorBoundary>
            <div style={{ color: WHITE, maxWidth: 1100 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                        <Handshake size={28} style={{ color: GOLD, marginRight: 10 }} /> Campus <span style={{ color: GOLD, marginLeft: 6 }}>Drive Connect</span>
                    </h1>
                    <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                        Partner directly with accredited institutions for on-campus & virtual hiring pipelines
                    </p>
                </div>

                {toast && (
                    <div style={{ padding: 12, background: toastError ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', border: `1px solid ${toastError ? '#ef4444' : '#22c55e'}`, borderRadius: 8, color: toastError ? '#fca5a5' : '#86efac', marginBottom: 18, fontSize: 13 }}>
                        {toast}
                    </div>
                )}

                {/* Form Modal/Card */}
                {selectedInst && (
                    <div style={{ padding: 20, background: 'rgba(212,168,67,0.06)', border: `1px solid ${GOLD}`, borderRadius: 14, marginBottom: 24 }}>
                        <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700, color: GOLD }}>
                            Schedule Drive with {selectedInst}
                        </h3>
                        <form onSubmit={handleConnect} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <input
                                    type="text"
                                    placeholder="Your Company Name"
                                    value={companyName}
                                    onChange={e => setCompanyName(e.target.value)}
                                    required
                                    style={{ padding: '10px 14px', borderRadius: 8, background: '#0d0a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13 }}
                                />
                                <input
                                    type="email"
                                    placeholder="Work Email Address"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    style={{ padding: '10px 14px', borderRadius: 8, background: '#0d0a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13 }}
                                />
                            </div>
                            <textarea
                                placeholder="Target roles, expected headcount, and drive details..."
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows={3}
                                style={{ padding: '10px 14px', borderRadius: 8, background: '#0d0a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13 }}
                            />
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button type="submit" disabled={submitting} className="btn-gold" style={{ padding: '8px 20px', fontSize: 13, cursor: 'pointer' }}>
                                    {submitting ? 'Submitting...' : 'Dispatch Request'}
                                </button>
                                <button type="button" onClick={() => setSelectedInst('')} style={{ padding: '8px 16px', borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <Skeleton height={250} width="100%" />
                ) : error && institutions.length === 0 ? (
                    <div style={{ padding: 32, textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>{error}</p>
                    </div>
                ) : institutions.length === 0 ? (
                    <div style={{ padding: 32, textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>No verified institutions are currently available for campus partnerships.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                        {institutions.map((inst, idx) => (
                            <div key={inst._id || idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#fff' }}>{inst.name}</h3>
                                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: inst.placementRate != null ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.08)', color: inst.placementRate != null ? '#22c55e' : MUTED }}>
                                            {inst.placementRate != null ? `${inst.placementRate}% Placed` : 'Rate not reported'}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0 0 12px', fontSize: 12, color: MUTED }}>{inst.state || 'State not listed'} {inst.district ? `• ${inst.district}` : ''} {inst.studentCount != null ? `• ${inst.studentCount} Enrolled` : ''}</p>
                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                                        {(inst.programs || []).map((p: string, i: number) => (
                                            <span key={i} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }}>
                                                {p}
                                            </span>
                                        ))}
                                        {(inst.programs || []).length === 0 && (
                                            <span style={{ fontSize: 11, color: MUTED }}>Programs not listed</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedInst(inst.name)}
                                    className="btn-gold"
                                    style={{ width: '100%', padding: '8px 0', fontSize: 12, cursor: 'pointer' }}
                                >
                                    Request Campus Drive
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
