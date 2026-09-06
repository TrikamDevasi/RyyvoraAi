// frontend/app/faq/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/public/PublicPageShell';
import { createPageMetadata } from '@/lib/seo';
import { FAQJsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, HelpCircle, ShieldCheck, Award, Briefcase, Landmark } from 'lucide-react';

export const metadata: Metadata = createPageMetadata({
  title: 'Frequently Asked Questions',
  description:
    'Answers to frequently asked questions about Ryyvora AI workforce outcome tracking, cryptographic credential verification, NSQF alignment, and DPDP compliance.',
  path: '/faq',
  keywords: [
    'Ryyvora AI FAQ',
    'Workforce Intelligence Questions',
    'How Credential Verification Works',
    'NSQF Level Verification',
    'DPDP Act Compliance FAQ',
    'Skill Passport Questions',
  ],
});

export default function FAQPage() {
  const FAQS = [
    {
      category: 'Credential Verification & Security',
      items: [
        {
          question: 'What is Ryyvora AI and what problem does it solve?',
          answer:
            'Ryyvora AI is a sovereign workforce outcome intelligence and credential verification platform. It replaces unverified resumes and static diplomas with cryptographically attested skill passports, enabling employers to hire verified talent and governments to measure longitudinal employment outcomes.',
        },
        {
          question: 'How does employer credential verification work without calling the university?',
          answer:
            'Every candidate credential issued on Ryyvora contains a unique SHA-256 HMAC digital signature derived from the candidate ID, issuing institution private key, qualification tier, and completion timestamp. Employers query the public hash or scan a QR code to verify validity instantly.',
        },
        {
          question: 'Can a candidate forge or tamper with their Skill Passport scores?',
          answer:
            'No. The credential payload is cryptographically sealed. If any field (such as a score, qualification name, or date) is modified, the computed SHA-256 hash will fail to match the ledger signature, flagging the credential as invalid.',
        },
      ],
    },
    {
      category: 'Standards & Compliance',
      items: [
        {
          question: 'How does Ryyvora AI align with the National Skills Qualification Framework (NSQF)?',
          answer:
            'Ryyvora aligns diagnostic benchmarks directly with NSQF Levels 4 through 8. Diagnostic quizzes and competency models map to specific National Occupational Standards (NOS) and Qualification Packs (QPs).',
        },
        {
          question: 'How does Ryyvora AI comply with India’s Digital Personal Data Protection (DPDP) Act 2023?',
          answer:
            'Ryyvora enforces granular consent management. Candidates explicitly choose what data employers can view, retain full rights to withdraw consent at any time, and all data is stored exclusively in Indian sovereign cloud data centers (Mumbai).',
        },
        {
          question: 'Is Ryyvora AI affiliated with any specific state government?',
          answer:
            'Ryyvora AI is an independent workforce intelligence technology engineered by Team Quantum Coders to interface seamlessly with state skill development directorates, ITIs, and corporate employers through standard open APIs.',
        },
      ],
    },
    {
      category: 'Institutes & Employers',
      items: [
        {
          question: 'How do training institutes benefit from issuing verifiable credentials?',
          answer:
            'Institutes gain automated placement tracking, proof of accreditation compliance, and deep analytics on which curriculum modules result in higher candidate wages and longer post-placement retention.',
        },
        {
          question: 'How do enterprise employers integrate Ryyvora with existing ATS platforms?',
          answer:
            'Ryyvora provides standard REST APIs and secure webhooks that integrate directly with Workday, SAP SuccessFactors, Greenhouse, and custom corporate HRIS portals.',
        },
        {
          question: 'Is the Skill Passport free for students and trainees?',
          answer:
            'Yes. Creating, maintaining, and sharing a personal Verifiable Skill Passport is 100% free forever for all trainees and individual job seekers.',
        },
      ],
    },
  ];

  // Flatten items for JSON-LD schema
  const flatFaqItems = FAQS.flatMap((f) => f.items);

  return (
    <PublicPageShell
      badge="Comprehensive Knowledge Base"
      title="Frequently Asked Questions"
      subtitle="Answers to common questions from trainees, enterprise employers, vocational institutes, and government policy leaders about Ryyvora AI."
      breadcrumbs={[{ name: 'FAQ', path: '/faq' }]}
    >
      <FAQJsonLd items={flatFaqItems} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 48, marginBottom: 56 }}>
        {FAQS.map((category) => (
          <div key={category.category}>
            <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: 'var(--gold, #f59e0b)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <HelpCircle size={20} /> {category.category}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {category.items.map((item) => (
                <div
                  key={item.question}
                  className="card-linear"
                  style={{
                    padding: 24,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>
                    {item.question}
                  </h3>
                  <p style={{ fontSize: 14.5, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Still Have Questions CTA */}
      <section style={{ padding: 36, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>
          Still Have Questions?
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 600, margin: '0 auto 20px' }}>
          Our engineering and workforce solutions team is ready to answer specific technical or compliance questions.
        </p>
        <Link href="/contact" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
          Contact Solutions Team <ArrowRight size={14} />
        </Link>
      </section>
    </PublicPageShell>
  );
}
