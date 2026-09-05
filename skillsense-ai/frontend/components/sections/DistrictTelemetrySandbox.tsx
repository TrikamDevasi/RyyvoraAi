'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  TrendingUp,
  Building2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Layers,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { AIBadge } from '@/components/ui/AIBadge';

interface DistrictCluster {
  name: string;
  tagline: string;
  cluster: string;
  deficit: number;
  deficitSeverity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  avgStartingSalary: string;
  year3Salary: string;
  growthPct: string;
  retention90d: string;
  recruiters: string[];
  inDemandSkills: string[];
}

const DISTRICT_DATA: Record<string, DistrictCluster> = {
  pune: {
    name: 'Pune Metropole',
    tagline: 'Automotive R&D & Enterprise Cloud Hub',
    cluster: 'Hinjawadi IT Park & Chakan Auto Corridor',
    deficit: 28.4,
    deficitSeverity: 'HIGH',
    avgStartingSalary: '₹8.40 LPA',
    year3Salary: '₹18.50 LPA',
    growthPct: '+120%',
    retention90d: '91.4%',
    recruiters: ['Tata Motors', 'Infosys Pune', 'Bajaj Auto', 'Persistent Systems', 'KPIT'],
    inDemandSkills: ['Distributed Caching', 'Docker CI/CD', 'Embedded C/C++', 'Spring Boot Microservices'],
  },
  mumbai: {
    name: 'Mumbai MMR & Navi Mumbai',
    tagline: 'BFSI, FinTech & Enterprise Cloud SEZ',
    cluster: 'BKC Financial Node & Airoli Tech Hub',
    deficit: 34.2,
    deficitSeverity: 'CRITICAL',
    avgStartingSalary: '₹10.20 LPA',
    year3Salary: '₹22.00 LPA',
    growthPct: '+115%',
    retention90d: '89.8%',
    recruiters: ['JPMorgan India', 'TCS Enterprise', 'Reliance Jio', 'LTI Mindtree', 'HDFC Bank Tech'],
    inDemandSkills: ['High-Frequency APIs', 'Event-Driven Kafka', 'Kubernetes Orchestration', 'TypeScript'],
  },
  nagpur: {
    name: 'Nagpur Central Hub',
    tagline: 'Central India Multi-Modal SEZ & IT Hub',
    cluster: 'MIHAN Special Economic Zone',
    deficit: 22.6,
    deficitSeverity: 'MODERATE',
    avgStartingSalary: '₹6.80 LPA',
    year3Salary: '₹14.60 LPA',
    growthPct: '+114%',
    retention90d: '88.1%',
    recruiters: ['Hexaware', 'TCS Mihan', 'Boeing JV', 'Mahindra Aerospace', 'Infocepts'],
    inDemandSkills: ['Cloud Data Warehousing', 'Python ETL', 'Cybersecurity Ops', 'Power BI / Tableau'],
  },
  nashik: {
    name: 'Nashik Industrial Corridor',
    tagline: 'Precision Engineering & Industrial Electronics',
    cluster: 'Satpur & Ambad MIDC Zones',
    deficit: 25.8,
    deficitSeverity: 'HIGH',
    avgStartingSalary: '₹6.40 LPA',
    year3Salary: '₹13.80 LPA',
    growthPct: '+115%',
    retention90d: '88.9%',
    recruiters: ['HAL Nashik', 'Bosch India', 'Mahindra & Mahindra', 'ABB Power', 'Schneider Electric'],
    inDemandSkills: ['PLC Automation', 'SCADA Systems', 'Precision CNC Programming', 'Industrial IoT'],
  },
  sambhajinagar: {
    name: 'Chhatrapati Sambhajinagar',
    tagline: 'DMIC AURIC Smart City & Manufacturing Hub',
    cluster: 'Shendra-Bidkin Industrial City (AURIC)',
    deficit: 31.0,
    deficitSeverity: 'CRITICAL',
    avgStartingSalary: '₹6.75 LPA',
    year3Salary: '₹14.90 LPA',
    growthPct: '+120%',
    retention90d: '87.6%',
    recruiters: ['Skoda Auto Volkswagen', 'Endurance Technologies', 'Siemens AURIC', 'Perkins Engines'],
    inDemandSkills: ['Robotics Arc Welding', 'Quality Telemetry 4.0', 'Automated QA Testing', 'EV Battery Assembly'],
  },
};

export default function DistrictTelemetrySandbox() {
  const [selectedDistrictKey, setSelectedDistrictKey] = useState<string>('pune');
  const [selectedTrack, setSelectedTrack] = useState<string>('cloud');
  const [selectedLevel, setSelectedLevel] = useState<number>(5);

  const district = DISTRICT_DATA[selectedDistrictKey] || DISTRICT_DATA.pune;

  // Track multipliers for interactive exploration
  const trackMultipliers: Record<string, { label: string; offset: number; icon: any }> = {
    cloud: { label: 'Cloud Architecture & DevOps', offset: 1.12, icon: Layers },
    ai: { label: 'Applied AI & Neural Engineering', offset: 1.25, icon: Sparkles },
    fullstack: { label: 'Full-Stack Software Engineering', offset: 1.05, icon: Zap },
    iot: { label: 'Automotive IoT & Robotics', offset: 1.08, icon: Building2 },
  };

  const currentTrack = trackMultipliers[selectedTrack] || trackMultipliers.cloud;
  const levelMultiplier = 1 + (selectedLevel - 4) * 0.18;

  const estimatedWage = (parseFloat(district.avgStartingSalary.replace(/[^0-9.]/g, '')) * currentTrack.offset * levelMultiplier / 1.18).toFixed(2);
  const estimated3YrWage = (parseFloat(district.year3Salary.replace(/[^0-9.]/g, '')) * currentTrack.offset * levelMultiplier / 1.18).toFixed(2);

  return (
    <section id="telemetry-sandbox" style={{ padding: '80px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <AIBadge type="live" label="WORKFORCE SIMULATION SANDBOX" />
            <AIBadge type="nsqf" label="REGIONAL TELEMETRY MODEL" />
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(24px, 3.2vw, 36px)',
              fontWeight: 800,
              color: '#f8fafc',
              letterSpacing: '-0.025em',
              margin: '0 auto 12px',
              maxWidth: 860,
            }}
          >
            Interactive District Skill Gap &{' '}
            <span style={{ color: 'var(--gold, #f59e0b)' }}>Wage Projection Sandbox</span>
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(14px, 1.4vw, 15.5px)',
              maxWidth: 720,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Interactive scenario modeling calibrated against regional industrial zones and NSQF competency frameworks across Maharashtra.
          </p>
        </div>

        {/* Main Dual-Column Sandbox Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24, alignItems: 'start' }}>
          {/* Left Column: Visual Regional Telemetry Map & Corridor Context */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Map Container Card */}
            <div
              className="card-elevated"
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid var(--border)',
                background: 'var(--bg-surface)',
                position: 'relative',
              }}
            >
              {/* Map Header Bar */}
              <div
                style={{
                  padding: '14px 18px',
                  borderBottom: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.02)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                    MAHARASHTRA WORKFORCE TELEMETRY GRID
                  </span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', background: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(245,158,11,0.2)' }}>
                  Active Focus: {district.name.split(' ')[0]}
                </span>
              </div>

              {/* Vector SVG Telemetry Map */}
              <div style={{ padding: 12, background: 'radial-gradient(circle at 40% 40%, rgba(6,182,212,0.04) 0%, rgba(11,19,43,0.3) 100%)', minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src="/images/landing/maharashtra-telemetry-map.svg"
                  alt="Maharashtra Regional Workforce Telemetry Map with industrial corridors, placement rates, and district telemetry nodes"
                  style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 380 }}
                />
              </div>

              {/* Map Footer Bar */}
              <div
                style={{
                  padding: '12px 18px',
                  borderTop: '1px solid var(--border)',
                  background: 'rgba(11, 15, 23, 0.6)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 11.5,
                  color: 'var(--text-secondary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={13} color="var(--gold)" />
                  <span><strong>{district.cluster}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: district.deficitSeverity === 'CRITICAL' ? '#ef4444' : 'var(--gold)', fontWeight: 700 }}>
                  <span>-{district.deficit}% Gap</span>
                </div>
              </div>
            </div>

            {/* Authentic Institutional Corridor Context Photo Card */}
            <div
              className="card-linear"
              style={{
                borderRadius: 14,
                overflow: 'hidden',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: 160, position: 'relative' }}>
                <img
                  src="/images/landing/maharashtra-workforce.jpg"
                  alt="Technical professionals and engineers collaborating in an authentic Maharashtra industrial corridor"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(11,15,23,0.95) 0%, rgba(11,15,23,0.4) 60%, transparent 100%)',
                  }}
                />
                <div style={{ position: 'absolute', bottom: 10, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#f8fafc', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 4, backdropFilter: 'blur(4px)' }}>
                    Regional Industrial SEZ Calibration
                  </span>
                  <span style={{ fontSize: 10.5, color: '#06b6d4', fontWeight: 600 }}>
                    DVET &amp; SSC Aligned
                  </span>
                </div>
              </div>
              <div style={{ padding: 14 }}>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  SkillSense telemetry synchronizes hiring data directly across MIDC clusters, Hinjawadi tech corridors, and tier-2 manufacturing hubs to validate live wage premiums.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Sandbox Command Card & Live Telemetry Output */}
          <div
            style={{
              padding: 22,
              borderRadius: 16,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              boxShadow: '0 10px 30px -4px rgba(0,0,0,0.5)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle Ambient Telemetry Grid Watermark */}
            <div
              style={{
                position: 'absolute',
                right: -30,
                top: -30,
                width: 320,
                height: 320,
                opacity: 0.04,
                pointerEvents: 'none',
                color: 'var(--gold)',
              }}
              aria-hidden="true"
            >
              <BarChart3 size={320} />
            </div>

            {/* Selector Navigation Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 20 }}>
              {/* 1. District Selection Pills */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  1. Select Maharashtra Economic Region
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {Object.entries(DISTRICT_DATA).map(([key, item]) => {
                    const isSelected = selectedDistrictKey === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedDistrictKey(key)}
                        style={{
                          padding: '7px 12px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          background: isSelected ? 'var(--gold)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isSelected ? 'var(--gold)' : 'var(--border)'}`,
                          color: isSelected ? '#090a0f' : '#cbd5e1',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <MapPin size={12} color={isSelected ? '#090a0f' : 'var(--gold)'} />
                        <span>{item.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Career Track Selection */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  2. Technical Career Track
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {Object.entries(trackMultipliers).map(([key, item]) => {
                    const isSelected = selectedTrack === key;
                    const Icon = item.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedTrack(key)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 6,
                          fontSize: 11.5,
                          fontWeight: isSelected ? 800 : 600,
                          background: isSelected ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${isSelected ? '#06b6d4' : 'var(--border)'}`,
                          color: isSelected ? '#38bdf8' : '#94a3b8',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                        }}
                      >
                        <Icon size={12} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Target NSQF Competency Level */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  3. Target NSQF Competency Level
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[
                    { level: 4, label: 'L4 (Foundational)' },
                    { level: 5, label: 'L5 (Diploma)' },
                    { level: 6, label: 'L6 (Professional)' },
                    { level: 7, label: 'L7 (Lead)' },
                  ].map((tier) => (
                    <button
                      key={tier.level}
                      type="button"
                      onClick={() => setSelectedLevel(tier.level)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: selectedLevel === tier.level ? 800 : 600,
                        background: selectedLevel === tier.level ? 'rgba(245,158,11,0.18)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${selectedLevel === tier.level ? 'var(--gold)' : 'var(--border)'}`,
                        color: selectedLevel === tier.level ? 'var(--gold)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        flex: '1 1 auto',
                        textAlign: 'center',
                      }}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Telemetry Result Visual Dashboard Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Card 1: Regional Cluster & Deficit */}
              <div className="card-linear" style={{ padding: 18, borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Regional Talent Supply Gap
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: district.deficitSeverity === 'CRITICAL' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                      color: district.deficitSeverity === 'CRITICAL' ? '#ef4444' : 'var(--gold)',
                      border: `1px solid ${district.deficitSeverity === 'CRITICAL' ? '#ef4444' : 'var(--gold-border)'}`,
                    }}
                  >
                    {district.deficitSeverity} SHORTAGE
                  </span>
                </div>

                <div className="font-display" style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc' }}>
                  -{district.deficit}% Deficit
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                  Hiring demand actively exceeds qualified talent supply in {district.name}.
                </div>

                {/* Progress bar visual */}
                <div style={{ height: 6, width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: 99, marginTop: 12, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, district.deficit * 2.5)}%`, background: 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: 99 }} />
                </div>

                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)' }}>Top Missing Competencies:</span>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                    {district.inDemandSkills.slice(0, 3).map((skill, sIdx) => (
                      <span key={sIdx} style={{ fontSize: 10.5, background: 'rgba(255,255,255,0.04)', padding: '2px 7px', borderRadius: 4, color: '#cbd5e1' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2: Projected Salary & 3-Year Wage Curve */}
              <div className="card-linear" style={{ padding: 18, borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Wage Progression Curve
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <TrendingUp size={12} /> {district.growthPct} 3-Yr ROI
                  </span>
                </div>

                <div className="font-display" style={{ fontSize: 24, fontWeight: 900, color: 'var(--gold)' }}>
                  ₹{estimatedWage} <span style={{ fontSize: 15, color: 'var(--text-muted)', fontWeight: 600 }}>→ ₹{estimated3YrWage} LPA</span>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                  Starting baseline at NSQF Level {selectedLevel} growing to Year 3 mastery.
                </div>

                {/* Micro Steps Timeline */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
                  <div style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>Year 1 Entry</div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>₹{estimatedWage}L</div>
                  </div>
                  <div style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>Year 2 Mid</div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>₹{(parseFloat(estimatedWage) * 1.5).toFixed(1)}L</div>
                  </div>
                  <div style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>Year 3 Senior</div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: '#10b981', marginTop: 2 }}>₹{estimated3YrWage}L</div>
                  </div>
                </div>

                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#10b981' }}>
                  <CheckCircle2 size={13} /> 90-Day Retention Probability: <strong>{district.retention90d}</strong>
                </div>
              </div>

              {/* Card 3: Hiring Consortium & Action */}
              <div className="card-linear" style={{ padding: 18, borderRadius: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Active Regional Enterprise Employers
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {district.recruiters.map((emp, eIdx) => (
                    <span
                      key={eIdx}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#f8fafc',
                        background: 'rgba(245,158,11,0.08)',
                        border: '1px solid rgba(245,158,11,0.25)',
                        padding: '3px 8px',
                        borderRadius: 6,
                      }}
                    >
                      {emp}
                    </span>
                  ))}
                </div>

                <Link
                  href="/student/analyzer"
                  className="btn-gold"
                  style={{
                    width: '100%',
                    padding: '9px 14px',
                    fontSize: 12.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    borderRadius: 8,
                    marginTop: 8,
                  }}
                >
                  <Sparkles size={14} />
                  <span>Audit Your Skills Against This Cluster</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
