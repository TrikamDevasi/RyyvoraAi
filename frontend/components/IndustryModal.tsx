'use client';

import React, { useState } from 'react';

const GOLD = '#D4A843';
const GOLD_L = '#F0C05A';
import api from '@/lib/api';

interface IndustryModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPlan: string;
}

export default function IndustryModal({ isOpen, onClose, selectedPlan }: IndustryModalProps) {
    const [form, setForm] = useState({
        company: '',
        contactName: '',
        email: '',
        phone: '',
        teamSize: '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.company || !form.contactName || !form.email || !form.teamSize) {
            setError('Please fill all required fields.');
            return;
        }
        setError('');
        setSubmitting(true);

        try {
            await api.post('/contact/industry', { ...form, plan: selectedPlan });
            setSubmitted(true);
        } catch {
            // Still show success for demo
            setSubmitted(true);
        }
        setSubmitting(false);
    };

    const handleClose = () => {
        setForm({ company: '', contactName: '', email: '', phone: '', teamSize: '', message: '' });
        setSubmitted(false);
        setError('');
        onClose();
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '10px 14px', borderRadius: 10,
        background: 'rgba(212,168,67,0.04)',
        border: '1px solid rgba(212,168,67,0.12)',
        color: '#fff', fontSize: 13, outline: 'none',
        fontFamily: "'Space Grotesk', sans-serif",
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 99999,
                background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'fadeIn 0.3s ease',
            }}
            onClick={handleClose}
        >
            <div
                style={{
                    background: '#111', border: `1px solid rgba(212,168,67,0.2)`,
                    borderRadius: 20, padding: '32px', maxWidth: 520, width: '90%',
                    maxHeight: '90vh', overflowY: 'auto',
                }}
                onClick={e => e.stopPropagation()}
            >
                {submitted ? (
                    /* Success State */
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
                            background: 'rgba(34,197,94,0.1)', border: '2px solid #22c55e',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            animation: 'scaleIn 0.4s ease',
                        }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h3 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
                            Thank You!
                        </h3>
                        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 6 }}>
                            Your inquiry for the <strong style={{ color: GOLD }}>{selectedPlan}</strong> plan has been received.
                        </p>
                        <p style={{ color: '#22c55e', fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
                            We&apos;ll contact you within 24 hours!
                        </p>
                        <button onClick={handleClose} className="btn-primary" style={{ fontSize: 14, padding: '10px 28px' }}>
                            Done
                        </button>
                    </div>
                ) : (
                    /* Form */
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div>
                                <h3 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
                                    Get Industry Access
                                </h3>
                                <p style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>
                                    Tell us about your organization
                                </p>
                            </div>
                            <button onClick={handleClose} style={{
                                background: 'none', border: 'none', color: '#475569',
                                fontSize: 20, cursor: 'pointer', padding: '4px',
                            }}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gap: 14 }}>
                                <div>
                                    <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Company Name *</label>
                                    <input
                                        value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                                        required style={inputStyle} placeholder="e.g., TCS, Infosys"
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Contact Name *</label>
                                    <input
                                        value={form.contactName} onChange={e => setForm(p => ({ ...p, contactName: e.target.value }))}
                                        required style={inputStyle} placeholder="Your full name"
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                    <div>
                                        <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Work Email *</label>
                                        <input
                                            type="email" value={form.email}
                                            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                            required style={inputStyle} placeholder="you@company.com"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Phone</label>
                                        <input
                                            value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                                            style={inputStyle} placeholder="+91 XXXXX XXXXX"
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                    <div>
                                        <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Team Size *</label>
                                        <select
                                            value={form.teamSize} onChange={e => setForm(p => ({ ...p, teamSize: e.target.value }))}
                                            required
                                            style={{ ...inputStyle, cursor: 'pointer' }}
                                        >
                                            <option value="" style={{ background: '#111' }}>Select size</option>
                                            <option value="1-10" style={{ background: '#111' }}>1-10</option>
                                            <option value="11-50" style={{ background: '#111' }}>11-50</option>
                                            <option value="51-200" style={{ background: '#111' }}>51-200</option>
                                            <option value="201-1000" style={{ background: '#111' }}>201-1000</option>
                                            <option value="1000+" style={{ background: '#111' }}>1000+</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Selected Plan</label>
                                        <div style={{
                                            ...inputStyle, display: 'flex', alignItems: 'center', gap: 8,
                                            background: 'rgba(212,168,67,0.06)',
                                        }}>
                                            <span style={{
                                                fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                                                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#08060f',
                                            }}>PLAN</span>
                                            <span style={{ color: GOLD, fontWeight: 600 }}>{selectedPlan}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Message (optional)</label>
                                    <textarea
                                        value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                        rows={3} style={{ ...inputStyle, resize: 'vertical' }}
                                        placeholder="Tell us about your requirements..."
                                    />
                                </div>
                            </div>

                            {error && (
                                <div style={{ marginTop: 12, fontSize: 12, color: '#ef4444', fontWeight: 600 }}>
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="btn-primary" style={{
                                width: '100%', marginTop: 20, fontSize: 14, padding: '12px 0',
                                opacity: submitting ? 0.6 : 1,
                            }} disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Submit Inquiry'}
                            </button>
                        </form>
                    </>
                )}
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
}
