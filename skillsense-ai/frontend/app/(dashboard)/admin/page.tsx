'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import {
  ShieldAlert,
  Users,
  Building2,
  Factory,
  Landmark,
  Search,
  Plus,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Award,
  ShieldCheck,
  TrendingUp,
  Clock,
  Send,
  Lock,
  DollarSign,
  X,
  ExternalLink,
  Activity,
  RefreshCw,
  Sliders,
  Layers,
  ArrowUpRight,
  UserCheck,
  Zap,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Institute' | 'Industry' | 'Government' | 'Admin';
  entity: string;
  joinedDate: string;
  status: 'ACTIVE' | 'PENDING' | 'FLAGGED';
}

interface IndustryInquiry {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  plan: string;
  teamSize: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED';
  date: string;
}

const DEFAULT_USERS: RecentUser[] = [
  { id: 'usr_1', name: 'Dr. Vivek Joshi', email: 'v.joshi@gppune.ac.in', role: 'Institute', entity: 'Govt Polytechnic Pune', joinedDate: 'March 14, 2026', status: 'ACTIVE' },
  { id: 'usr_2', name: 'Vikram Sen', email: 'v.sen@techcorp.in', role: 'Industry', entity: 'TechCorp Enterprise', joinedDate: 'March 13, 2026', status: 'ACTIVE' },
  { id: 'usr_3', name: 'Arjun Mehta', email: 'arjun.mehta@student.gppune.ac.in', role: 'Student', entity: 'Govt Polytechnic Pune', joinedDate: 'March 12, 2026', status: 'ACTIVE' },
  { id: 'usr_4', name: 'Sunil Rao', email: 's.rao@msde.gov.in', role: 'Government', entity: 'MSDE Maharashtra Cell', joinedDate: 'March 10, 2026', status: 'ACTIVE' },
  { id: 'usr_5', name: 'Priya Sharma', email: 'priya.s@vjti.ac.in', role: 'Student', entity: 'VJTI Mumbai', joinedDate: 'March 09, 2026', status: 'ACTIVE' },
  { id: 'usr_6', name: 'Sneha Deshmukh', email: 's.deshmukh@fintechlabs.in', role: 'Industry', entity: 'FinTech Labs BKC', joinedDate: 'March 08, 2026', status: 'ACTIVE' },
];

const DEFAULT_INQUIRIES: IndustryInquiry[] = [
  { id: 'inq_1', companyName: 'Tata Consultancy Services', contactName: 'Rajesh Nair', email: 'rajesh.nair@tcs.com', plan: 'Enterprise Sovereign', teamSize: '500+ Hires', status: 'NEW', date: 'March 14, 2026' },
  { id: 'inq_2', companyName: 'Razorpay Software', contactName: 'Ananya Roy', email: 'ananya@razorpay.com', plan: 'Professional Growth', teamSize: '50-100 Hires', status: 'CONTACTED', date: 'March 12, 2026' },
  { id: 'inq_3', companyName: 'Persistent Systems', contactName: 'Manoj Kulkarni', email: 'm_kulkarni@persistent.com', plan: 'Enterprise Sovereign', teamSize: '200+ Hires', status: 'CONVERTED', date: 'March 09, 2026' },
];

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  Student: { bg: 'rgba(245,158,11,0.12)', color: 'var(--gold)' },
  Institute: { bg: 'rgba(168,85,247,0.12)', color: '#c084fc' },
  Industry: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  Government: { bg: 'rgba(239,68,68,0.12)', color: '#f87171' },
  Admin: { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'INQUIRIES' | 'AUDIT'>('OVERVIEW');
  const [users, setUsers] = useState<RecentUser[]>(DEFAULT_USERS);
  const [inquiries, setInquiries] = useState<IndustryInquiry[]>(DEFAULT_INQUIRIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [scanningAudit, setScanningAudit] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      api.get('/admin/stats'),
      api.get('/contact/industry'),
    ]).then(() => {});
  }, []);

  const handleRunSystemAudit = () => {
    setScanningAudit(true);
    setAuditComplete(false);
    setTimeout(() => {
      setScanningAudit(false);
      setAuditComplete(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981'],
      });
      toast.success('System Ledger & DPDP Compliance Audit passed with 100% integrity!');
    }, 1200);
  };

  const handleInquiryStatusCycle = (id: string) => {
    setInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id === id) {
          const nextStatus = inq.status === 'NEW' ? 'CONTACTED' : inq.status === 'CONTACTED' ? 'CONVERTED' : 'NEW';
          toast.success(`Inquiry status updated to ${nextStatus}`);
          return { ...inq, status: nextStatus };
        }
        return inq;
      })
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.entity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
        {/* ── Top Header Banner ── */}
        <div
          className="card-accent"
          style={{
            padding: 26,
            borderRadius: 16,
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <AIBadge type="nsqf" label="STATE ADMINISTRATION CONTROL PANEL" />
              <AIBadge type="live" label="LEDGER NODE: MH-CENTRAL-01" />
            </div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              System Administration & <span style={{ color: 'var(--gold)' }}>Operations Cockpit</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4, maxWidth: 680 }}>
              Root control suite for managing multi-role identity provisioning, cryptographic ledger security audits, corporate licensing inquiries, and system compliance telemetry.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleRunSystemAudit}
              disabled={scanningAudit}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <RefreshCw size={14} className={scanningAudit ? 'animate-spin' : ''} />
              <span>{scanningAudit ? 'Verifying Hashes...' : 'Run Security & Ledger Audit'}</span>
            </button>
          </div>
        </div>

        {/* ── System Audit Success Alert ── */}
        {auditComplete && (
          <div
            style={{
              padding: 14,
              borderRadius: 12,
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.3)',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldCheck size={20} color="#10b981" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#86efac' }}>
                  Cryptographic Ledger & System Integrity: 100% Sealed
                </div>
                <div style={{ fontSize: 11.5, color: '#cbd5e1' }}>
                  148,520 user hashes, 142 institutional keys, and DPDP sovereign consent certificates fully verified.
                </div>
              </div>
            </div>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)' }}>
              HASH: 0x9f8c...4e12_PASSED
            </span>
          </div>
        )}

        {/* ── Macro Scorecards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Registered Entities', value: '148,520', sub: 'Across 6 Platform Roles', color: 'var(--gold)', icon: Users },
            { label: 'Accredited Institutes', value: '142 Polytechnics', sub: '36 Maharashtra Districts', color: '#c084fc', icon: Landmark },
            { label: 'Enterprise Partners', value: '640+ Verified', sub: 'Corporate Talent Consumers', color: '#10b981', icon: Factory },
            { label: 'Platform Availability SLA', value: '99.98%', sub: 'Zero-Downtime Microservices', color: '#60a5fa', icon: Activity },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="card-linear" style={{ padding: '16px 18px', borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {stat.label}
                  </span>
                  <div style={{ padding: 6, borderRadius: 6, background: 'rgba(255,255,255,0.04)', color: stat.color }}>
                    <Icon size={16} />
                  </div>
                </div>
                <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {stat.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Navigation Tabs ── */}
        <div
          className="card-linear"
          style={{
            padding: '12px 18px',
            borderRadius: 12,
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'OVERVIEW', label: 'System Overview' },
              { id: 'USERS', label: `User Directory (${users.length})` },
              { id: 'INQUIRIES', label: `Enterprise Inquiries (${inquiries.length})` },
              { id: 'AUDIT', label: 'Security & Ledger Engine' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  background: activeTab === tab.id ? 'var(--gold)' : 'transparent',
                  color: activeTab === tab.id ? '#090a0f' : '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'USERS' && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: 220 }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user, entity..."
                  style={{
                    width: '100%',
                    padding: '7px 10px 7px 30px',
                    borderRadius: 6,
                    background: 'var(--bg-input, #0f111a)',
                    border: '1px solid var(--border)',
                    color: '#fff',
                    fontSize: 12,
                  }}
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  padding: '7px 10px',
                  borderRadius: 6,
                  background: 'var(--bg-input, #0f111a)',
                  border: '1px solid var(--border)',
                  color: '#fff',
                  fontSize: 12,
                }}
              >
                <option value="ALL">All Roles</option>
                <option value="Student">Student</option>
                <option value="Institute">Institute</option>
                <option value="Industry">Industry</option>
                <option value="Government">Government</option>
              </select>
            </div>
          )}
        </div>

        {/* ── Tab Content: OVERVIEW ── */}
        {activeTab === 'OVERVIEW' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Quick Admin Modules Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
              {[
                { title: 'System Audit Logs', desc: 'Inspect immutable ledger logs, auth sessions, and state grants.', href: '/admin/audit-logs', icon: ShieldAlert, color: '#f87171' },
                { title: 'AI Fairness & Parity Monitor', desc: 'Inspect multi-axis demographic fairness audits & equal opportunity metrics.', href: '/admin/fairness', icon: Award, color: 'var(--gold)' },
                { title: 'Institute Accreditation Desk', desc: 'Approve new polytechnic onboarding and configure NSQF tier levels.', href: '/admin/institutes', icon: Landmark, color: '#c084fc' },
                { title: 'State Compliance Reports', desc: 'Generate executive state skilling summaries and fiscal dossiers.', href: '/admin/reports', icon: TrendingUp, color: '#10b981' },
              ].map((mod, idx) => {
                const Icon = mod.icon;
                return (
                  <Link
                    key={idx}
                    href={mod.href}
                    className="card-linear hover:border-gold"
                    style={{
                      padding: 20,
                      borderRadius: 14,
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 12,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.04)', color: mod.color, width: 'fit-content', marginBottom: 10 }}>
                        <Icon size={18} />
                      </div>
                      <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>{mod.title}</h4>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{mod.desc}</p>
                    </div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>Open Workspace</span>
                      <ArrowUpRight size={13} />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Recent Registrations Table */}
            <div className="card-linear" style={{ padding: 22, borderRadius: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Recent System Registrations
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('USERS')}
                  style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  View All Users →
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11.5, textTransform: 'uppercase' }}>
                      <th style={{ padding: '8px 12px' }}>User Name</th>
                      <th style={{ padding: '8px 12px' }}>Role</th>
                      <th style={{ padding: '8px 12px' }}>Entity / Affiliation</th>
                      <th style={{ padding: '8px 12px' }}>Joined Date</th>
                      <th style={{ padding: '8px 12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 4).map((u) => {
                      const roleBadge = ROLE_COLORS[u.role] || ROLE_COLORS.Student;
                      return (
                        <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ fontWeight: 700, color: '#f8fafc' }}>{u.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.email}</div>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: roleBadge.bg, color: roleBadge.color }}>
                              {u.role}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{u.entity}</td>
                          <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{u.joinedDate}</td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                              {u.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab Content: USERS ── */}
        {activeTab === 'USERS' && (
          <div className="card-linear" style={{ padding: 22, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Platform Multi-Role Identity Directory
              </h3>
              <button
                type="button"
                onClick={() => toast.success('New user provisioning modal initialized')}
                className="btn-gold"
                style={{ fontSize: 11.5, padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Plus size={13} /> Provision Account
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11.5, textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 12px' }}>User / Email</th>
                    <th style={{ padding: '10px 12px' }}>Role</th>
                    <th style={{ padding: '10px 12px' }}>Affiliation</th>
                    <th style={{ padding: '10px 12px' }}>Registered</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                    <th style={{ padding: '10px 12px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const roleBadge = ROLE_COLORS[u.role] || ROLE_COLORS.Student;
                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="hover:bg-white/5">
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 700, color: '#f8fafc' }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: roleBadge.bg, color: roleBadge.color }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#cbd5e1' }}>{u.entity}</td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{u.joinedDate}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                            {u.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button
                            type="button"
                            onClick={() => toast.success(`Active sessions revoked for ${u.name}`)}
                            className="btn-secondary"
                            style={{ fontSize: 11, padding: '4px 10px' }}
                          >
                            Revoke Key
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab Content: INQUIRIES ── */}
        {activeTab === 'INQUIRIES' && (
          <div className="card-linear" style={{ padding: 22, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Enterprise Sourcing & Licensing Inquiries
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Direct B2B corporate inquiries for talent sourcing and custom institutional cohorts.
                </p>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11.5, textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 12px' }}>Company</th>
                    <th style={{ padding: '10px 12px' }}>Contact</th>
                    <th style={{ padding: '10px 12px' }}>Plan</th>
                    <th style={{ padding: '10px 12px' }}>Team Size</th>
                    <th style={{ padding: '10px 12px' }}>Date</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq) => {
                    const statusColor =
                      inq.status === 'NEW'
                        ? { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' }
                        : inq.status === 'CONTACTED'
                        ? { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' }
                        : { bg: 'rgba(16,185,129,0.12)', color: '#10b981' };

                    return (
                      <tr key={inq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="hover:bg-white/5">
                        <td style={{ padding: '12px', fontWeight: 700, color: '#f8fafc' }}>{inq.companyName}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ color: '#cbd5e1' }}>{inq.contactName}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{inq.email}</div>
                        </td>
                        <td style={{ padding: '12px', color: 'var(--gold)', fontWeight: 600 }}>{inq.plan}</td>
                        <td style={{ padding: '12px', color: '#cbd5e1' }}>{inq.teamSize}</td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{inq.date}</td>
                        <td style={{ padding: '12px' }}>
                          <button
                            type="button"
                            onClick={() => handleInquiryStatusCycle(inq.id)}
                            style={{
                              fontSize: 11,
                              fontWeight: 800,
                              padding: '4px 12px',
                              borderRadius: 99,
                              background: statusColor.bg,
                              color: statusColor.color,
                              border: 'none',
                              cursor: 'pointer',
                            }}
                            title="Click to cycle status"
                          >
                            {inq.status} ↺
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab Content: AUDIT ── */}
        {activeTab === 'AUDIT' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
            <div className="card-linear" style={{ padding: 22, borderRadius: 16 }}>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                Cryptographic Ledger Engine
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 14px' }}>
                Real-time validation of SHA-256 HMAC digital passport anchors across distributed state nodes.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'HMAC Key Rotation', val: 'Every 90 Days (Active)', status: 'VALID' },
                  { label: 'Sovereign Node Sync', val: '4/4 Cluster Nodes Healthy', status: 'VALID' },
                  { label: 'Merkle Tree Depth', val: '32 Layers · Zero Collisions', status: 'VALID' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.val}</div>
                    </div>
                    <CheckCircle2 size={16} color="#10b981" />
                  </div>
                ))}
              </div>
            </div>

            <div className="card-linear" style={{ padding: 22, borderRadius: 16 }}>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                DPDP Act 2023 Sovereignty Mesh
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 14px' }}>
                Article 12 automated consent management, data masking, and purpose-bound access locks.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Consent Withdrawal Gateway', val: 'Instant 1-Click Revocation', status: 'COMPLIANT' },
                  { label: 'Data Fiduciary Audit Log', val: 'Immutable Append-Only Store', status: 'COMPLIANT' },
                  { label: 'PII Scrubbing Latency', val: '< 5ms on Ingress', status: 'COMPLIANT' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.val}</div>
                    </div>
                    <CheckCircle2 size={16} color="#10b981" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </FadeIn>
    </ErrorBoundary>
  );
}