// frontend/app/contact/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PublicPageShell from '@/components/public/PublicPageShell';
import {
  Mail,
  Building2,
  Landmark,
  MessageSquare,
  Send,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState('enterprise');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicPageShell
      badge="Partnership & Advisory Inquiries"
      title="Connect with Ryyvora AI Workforce Specialists"
      subtitle="Reach out for enterprise pilot onboarding, state government consultations, training provider partnerships, or technical ledger integration."
      breadcrumbs={[{ name: 'Contact', path: '/contact' }]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 36, marginBottom: 56 }}>
        {/* Contact Form */}
        <div
          className="card-linear"
          style={{
            padding: 32,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <CheckCircle2 size={26} color="#10b981" />
              </div>
              <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>
                Inquiry Received
              </h2>
              <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, maxWidth: 440, margin: '0 auto 20px' }}>
                Thank you, {name || 'Partner'}. A Ryyvora AI workforce solutions specialist will review your inquiry and reach out within one business day.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="btn-secondary"
                style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13 }}
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
                Institutional Consultation Form
              </h2>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 12px' }}>
                Select your stakeholder category to route directly to our sector specialists.
              </p>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                  Stakeholder Role
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {[
                    { id: 'enterprise', label: 'Enterprise Employer' },
                    { id: 'government', label: 'Govt / Directorate' },
                    { id: 'institute', label: 'Training Institute' },
                    { id: 'academic', label: 'Academic / Other' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      style={{
                        padding: '9px 12px',
                        borderRadius: 8,
                        background: role === r.id ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
                        border: role === r.id ? '1px solid var(--gold, #f59e0b)' : '1px solid rgba(255,255,255,0.06)',
                        color: role === r.id ? 'var(--gold, #f59e0b)' : '#94a3b8',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Kulkarni"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f8fafc',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                  Official Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. director@institution.edu.in"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f8fafc',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                  Organization / Directorate Name
                </label>
                <input
                  type="text"
                  required
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  placeholder="e.g. Maharashtra State Skilling Society"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f8fafc',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
                  Inquiry Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your skilling cohort size, integration timeline, or verification objectives..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f8fafc',
                    fontSize: 13,
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-gold"
                style={{
                  padding: '12px 20px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  border: 'none',
                  marginTop: 6,
                }}
              >
                <Send size={15} /> Submit Advisory Inquiry
              </button>
            </form>
          )}
        </div>

        {/* Office & Direct Channels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card-linear" style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={17} color="var(--gold, #f59e0b)" /> Innovation & Operations Center
            </h3>
            <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Team Quantum Coders — Ryyvora AI Platform<br />
              BKC Technology Corridor, Bandra East<br />
              Mumbai, Maharashtra 400051, India
            </p>
          </div>

          <div className="card-linear" style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Mail size={17} color="var(--gold, #f59e0b)" /> Direct Institutional Channels
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#cbd5e1' }}>
              <div>
                <span style={{ color: '#64748b' }}>Enterprise Pilots: </span>
                <span className="font-mono">partnerships@ryyvora.com</span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Directorate Liaison: </span>
                <span className="font-mono">government@ryyvora.com</span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>DPDP Grievance Officer: </span>
                <span className="font-mono">privacy@ryyvora.com</span>
              </div>
            </div>
          </div>

          <div className="card-linear" style={{ padding: 24, borderRadius: 12, background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#10b981', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={17} /> Fast-Track Verification Support
            </h3>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Need urgent batch verification for a high-volume placement drive? Our institutional operations team provides same-day ledger verification turnaround.
            </p>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
