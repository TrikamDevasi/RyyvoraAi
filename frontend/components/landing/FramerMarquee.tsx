'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  TrendingUp,
  Activity,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Award,
} from 'lucide-react';

const MARQUEE_ITEMS = [
  { text: 'Real-Time Employment Verification', icon: ShieldCheck },
  { text: 'Longitudinal Retention Tracking', icon: TrendingUp },
  { text: 'Wage Progression Telemetry', icon: Activity },
  { text: 'DPDP Act 2023 Compliant', icon: Lock },
  { text: 'Cryptographic Skill Passport', icon: Award },
  { text: 'Predictive Skill Gap Engine', icon: Sparkles },
  { text: 'Institutional Multi-Tier Governance', icon: Layers },
  { text: 'Tamper-Proof Ledger Verification', icon: CheckCircle2 },
  { text: 'NSQF Level 4–8 Aligned', icon: Award },
  { text: 'APAAR & DigiLocker Interoperable', icon: ShieldCheck },
];

export default function FramerMarquee() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        padding: '18px 0',
        background: '#080c14',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div className="marquee-wrapper">
        {/* Track 1 */}
        <div className="marquee-content">
          {MARQUEE_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={`m1-${idx}`}>
                <div className="marquee-pill">
                  <Icon size={15} style={{ color: '#f59e0b' }} />
                  <span>{item.text}</span>
                </div>
                <span style={{ color: 'rgba(245, 158, 11, 0.6)', fontSize: 13, userSelect: 'none' }}>✦</span>
              </React.Fragment>
            );
          })}
        </div>

        {/* Track 2 (Duplicate for seamless continuous loop) */}
        <div className="marquee-content" aria-hidden="true">
          {MARQUEE_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={`m2-${idx}`}>
                <div className="marquee-pill">
                  <Icon size={15} style={{ color: '#f59e0b' }} />
                  <span>{item.text}</span>
                </div>
                <span style={{ color: 'rgba(245, 158, 11, 0.6)', fontSize: 13, userSelect: 'none' }}>✦</span>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
