'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Brain, Briefcase, TrendingUp, ChevronRight, Sparkles, Compass, ShieldCheck, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import CareerPathwayCard from './CareerPathwayCard';
import type { CareerPathway } from '@/types/charts';
import { ScanningState } from '@/components/ui/ScanningState';
import { AIBadge } from '@/components/ui/AIBadge';

export default function CareerPredictor() {
  const { request } = useApi();
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [skills, setSkills] = useState<string>('TypeScript, React, Node.js API, REST, SQL, Microservices');
  const [interests, setInterests] = useState<string>('Full-Stack Development, Cloud Architecture, Scalable Backend');
  const [education, setEducation] = useState<string>('Computer Science & Engineering');
  const [step, setStep] = useState<'form' | 'results'>('form');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ss_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.program) setEducation(parsed.program);
      }
    } catch {}
  }, []);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skills.trim()) {
      toast.error('Please enter at least some skills');
      return;
    }

    setLoading(true);
    try {
      const res = await request('POST', '/ai/predict-career', {
        skills: skills.split(',').map((s) => s.trim()),
        interests: interests.split(',').map((i) => i.trim()),
        education,
      });

      if (res?.success && Array.isArray(res.data?.careers) && res.data.careers.length > 0) {
        setPredictions(res.data.careers);
        setStep('results');
        toast.success('AI career pathways calculated!');
      } else {
        throw new Error('Failed to get predictions');
      }
    } catch (err) {
      toast.error('Failed to predict careers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '30px 0' }}>
        <ScanningState
          title="Predicting AI Career Trajectories"
          subtitle="Matching verified competencies and NSQF vocational standards against active Indian tech openings..."
          stage="Neural Matching Engine · Llama-3.3-70b-versatile"
        />
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <AIBadge type="ai" label="AI PREDICTION" />
            </div>
            <h2 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Your AI-Matched Career Trajectories
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
              Ranked by mathematical compatibility with your skill profile and salary growth in India.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setStep('form')}
            className="btn-secondary"
            style={{ fontSize: 12, padding: '6px 14px' }}
          >
            Refine Parameters
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {predictions.map((career, idx) => {
            const pathway: CareerPathway = {
              id: `P-${idx}`,
              title: career.title,
              role: career.title,
              organization: career.organization || '',
              requiredSkills: career.missingSkills || [],
              matchPercent: career.match,
              salaryRange: { min: 0, max: 0 },
              salaryLabel: career.salaryRange,
              timeToAchieve: career.timeToReady,
              isRecommended: idx === 0,
              growth: career.growth,
              roadmap: career.roadmap || [],
            };
            return <CareerPathwayCard key={idx} pathway={pathway} />;
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="card-linear" style={{ padding: 24, maxWidth: 680, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
          <Compass size={18} />
        </div>
        <div>
          <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
            Configure Career Match Profile
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 12.5, margin: '2px 0 0' }}>
            Provide candidate skills and vocational interests to model optimal career paths.
          </p>
        </div>
      </div>

      <form onSubmit={handlePredict} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
            Technical & Soft Skills (Comma separated)
          </label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. React, Node.js, Python, System Design, SQL"
            required
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              color: '#fff',
              fontSize: 13,
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
            Career Interests & Desired Domains
          </label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g. Cloud Infrastructure, AI Systems, Full-Stack SaaS"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              color: '#fff',
              fontSize: 13,
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
            Educational Program / Background
          </label>
          <input
            type="text"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="e.g. Computer Science & Engineering (NSQF Level 4)"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              color: '#fff',
              fontSize: 13,
            }}
          />
        </div>

        <button
          type="submit"
          className="btn-gold"
          style={{
            alignSelf: 'flex-start',
            marginTop: 6,
            padding: '9px 24px',
            fontSize: 13,
          }}
        >
          <Sparkles size={14} /> Calculate AI Career Pathways
        </button>
      </form>
    </div>
  );
}
