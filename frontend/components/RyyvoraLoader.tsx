'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Code,
  FileText,
  Award,
  Layers,
  Cpu,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface DataNode {
  id: string;
  label: string;
  angle: number; // in degrees
  icon: React.ElementType;
  accentColor: string;
}

const DATA_NODES: DataNode[] = [
  { id: 'skills', label: 'Skills', angle: 30, icon: Layers, accentColor: '#F59E0B' },
  { id: 'resume', label: 'Resume', angle: 90, icon: FileText, accentColor: '#3B82F6' },
  { id: 'github', label: 'GitHub', angle: 150, icon: Code, accentColor: '#10B981' },
  { id: 'projects', label: 'Projects', angle: 210, icon: Cpu, accentColor: '#8B5CF6' },
  { id: 'certifications', label: 'Certifications', angle: 270, icon: Award, accentColor: '#F59E0B' },
  { id: 'career', label: 'Career Data', angle: 330, icon: TrendingUp, accentColor: '#06B6D4' },
];

const STATUS_MESSAGES = [
  'Initializing Skill Intelligence...',
  'Analyzing Skills...',
  'Mapping Competencies...',
  'Identifying Skill Gaps...',
  'Predicting Career Paths...',
  'Generating Smart Insights...',
];

const MIN_DURATION_MS = 2800; // Minimum duration to prevent flash
const TARGET_DURATION_MS = 3200; // Target optimal duration

export default function RyyvoraLoader({ children }: { children?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [converged, setConverged] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);

    // 1. Check session storage — only show on initial load once per tab session
    const seen = typeof window !== 'undefined'
      ? (sessionStorage.getItem('ryyvora_initial_loader') || sessionStorage.getItem('skillsense_initial_loader'))
      : null;
    if (seen === 'true') {
      setShouldRender(false);
      return;
    }

    // 2. Check reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setPrefersReducedMotion(true);
    }

    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const rawProgress = Math.min(elapsed / TARGET_DURATION_MS, 1);

      // Smooth easeInOutCubic for organic progress feel
      const easedProgress =
        rawProgress < 0.5
          ? 4 * rawProgress * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

      const currentPercent = Math.min(Math.round(easedProgress * 100), 100);
      setProgress(currentPercent);

      // Update status message based on progress stage
      const messageStep = Math.min(
        Math.floor((currentPercent / 100) * STATUS_MESSAGES.length),
        STATUS_MESSAGES.length - 1
      );
      setStatusIndex(messageStep);

      // Trigger convergence animation at 88%
      if (currentPercent >= 88 && !converged) {
        setConverged(true);
      }

      if (rawProgress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Complete! Trigger exit transition
        setProgress(100);
        setStatusIndex(STATUS_MESSAGES.length - 1);
        setConverged(true);

        const exitTimeout = setTimeout(() => {
          setIsExiting(true);
          try {
            sessionStorage.setItem('ryyvora_initial_loader', 'true');
          } catch {
            // Ignore storage errors in private mode
          }

          const unmountTimeout = setTimeout(() => {
            setShouldRender(false);
          }, 600); // matches CSS fade duration

          return () => clearTimeout(unmountTimeout);
        }, 300);

        return () => clearTimeout(exitTimeout);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Compute node coordinates on a 320x320 SVG canvas (center at 160, 160)
  const nodePositions = useMemo(() => {
    const center = 160;
    const baseRadius = 112; // distance from center

    return DATA_NODES.map((node) => {
      const rad = (node.angle * Math.PI) / 180;
      // In converged state, particles collapse toward center
      const r = converged ? 20 : baseRadius;
      const x = center + r * Math.cos(rad);
      const y = center + r * Math.sin(rad);
      return { ...node, x, y };
    });
  }, [converged]);

  if (!mounted || !shouldRender) {
    return <>{children}</>;
  }

  // Simplified accessible reduced motion view
  if (prefersReducedMotion) {
    return (
      <>
        <div
          role="status"
          aria-live="polite"
          aria-label="Loading Ryyvora AI"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: '#05070d',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isExiting ? 0 : 1,
            transition: 'opacity 0.4s ease-out',
            pointerEvents: isExiting ? 'none' : 'all',
          }}
        >
          <img src="/logo.png" alt="Ryyvora AI" style={{ width: 90, height: 90, objectFit: 'contain' }} />
          <p style={{ marginTop: 24, color: '#f8fafc', fontSize: 14, fontFamily: 'var(--font-space-grotesk, sans-serif)' }}>
            {STATUS_MESSAGES[statusIndex]}
          </p>
          <div style={{ width: 180, height: 2, backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 12, borderRadius: 99 }}>
            <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#F59E0B', transition: 'width 0.1s linear' }} />
          </div>
        </div>
        {children}
      </>
    );
  }

  return (
    <>
      {/* ── Production-Grade Full-Screen Loading Overlay ── */}
      <div
        role="status"
        aria-live="polite"
        aria-label="Ryyvora AI is loading"
        className={`ss-loader-root ${isExiting ? 'ss-loader-exit' : ''}`}
      >
        {/* Ambient subtle cyber-grid background */}
        <div className="ss-loader-grid" />

        {/* Ambient radial lighting glow */}
        <div className="ss-loader-ambient-glow" />

        {/* ── Central Neural Network & Logo Container ── */}
        <div className="ss-loader-stage">
          {/* Subtle sweep scanning beam */}
          <div className="ss-loader-scanner" />

          {/* SVG Neural Mesh & Synaptic Lines */}
          <svg
            className="ss-loader-svg"
            viewBox="0 0 320 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="ss-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="ss-beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
              <filter id="ss-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Neural constellation ring connecting adjacent nodes */}
            {nodePositions.map((pos, i) => {
              const nextPos = nodePositions[(i + 1) % nodePositions.length];
              return (
                <line
                  key={`outer-${pos.id}`}
                  x1={pos.x}
                  y1={pos.y}
                  x2={nextPos.x}
                  y2={nextPos.y}
                  stroke="rgba(245, 158, 11, 0.22)"
                  strokeWidth="1.2"
                  strokeDasharray="3 4"
                  className="ss-line-pulse"
                />
              );
            })}

            {/* Cross-chords forming the abstract AI brain mesh */}
            <line
              x1={nodePositions[0].x}
              y1={nodePositions[0].y}
              x2={nodePositions[3].x}
              y2={nodePositions[3].y}
              stroke="rgba(59, 130, 246, 0.16)"
              strokeWidth="1"
            />
            <line
              x1={nodePositions[1].x}
              y1={nodePositions[1].y}
              x2={nodePositions[4].x}
              y2={nodePositions[4].y}
              stroke="rgba(16, 185, 129, 0.16)"
              strokeWidth="1"
            />
            <line
              x1={nodePositions[2].x}
              y1={nodePositions[2].y}
              x2={nodePositions[5].x}
              y2={nodePositions[5].y}
              stroke="rgba(245, 158, 11, 0.16)"
              strokeWidth="1"
            />

            {/* Synaptic rays flowing from each node directly to central logo (160, 160) */}
            {nodePositions.map((pos) => (
              <line
                key={`ray-${pos.id}`}
                x1={pos.x}
                y1={pos.y}
                x2={160}
                y2={160}
                stroke="url(#ss-gold-grad)"
                strokeWidth="1.4"
                strokeDasharray="6 4"
                className="ss-ray-animated"
              />
            ))}

            {/* Concentric subtle radar pulse rings */}
            <circle
              cx="160"
              cy="160"
              r="62"
              stroke="rgba(245, 158, 11, 0.28)"
              strokeWidth="1"
              strokeDasharray="2 6"
              className="ss-orbit-spin"
            />
            <circle
              cx="160"
              cy="160"
              r="90"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />

            {/* Glowing particle nodes */}
            {nodePositions.map((pos) => (
              <g key={`point-${pos.id}`}>
                {/* Ambient glow halo */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="5"
                  fill={pos.accentColor}
                  opacity="0.35"
                  filter="url(#ss-glow)"
                />
                {/* Core particle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="2.5"
                  fill="#ffffff"
                  stroke={pos.accentColor}
                  strokeWidth="1.5"
                />
              </g>
            ))}
          </svg>

          {/* Central Logo & Breathing Pod */}
          <div className={`ss-logo-pod ${converged ? 'ss-logo-pulse' : ''}`}>
            <div className="ss-logo-aura" />
            <img
              src="/logo.png"
              alt="Ryyvora AI"
              className="ss-logo-img"
            />
          </div>

          {/* HTML Data Source Badges Orbiting around Logo */}
          <div className="ss-badges-overlay">
            {nodePositions.map((node) => {
              const Icon = node.icon;
              // Map SVG 320x320 coordinates to percentage
              const leftPercent = (node.x / 320) * 100;
              const topPercent = (node.y / 320) * 100;

              return (
                <div
                  key={node.id}
                  className={`ss-data-badge ${converged ? 'ss-badge-converging' : ''}`}
                  style={{
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                  }}
                >
                  <span className="ss-badge-dot" style={{ backgroundColor: node.accentColor }} />
                  <Icon size={10} style={{ color: node.accentColor, opacity: 0.9 }} />
                  <span className="ss-badge-text">{node.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Lower Status Sequence & Progress Gauge ── */}
        <div className="ss-loader-footer">
          {/* AI Intelligence Status Pill */}
          <div className="ss-status-badge">
            <Sparkles size={12} className="ss-sparkle-spin" />
            <span>AI NEURAL ENGINE</span>
          </div>

          {/* Dynamic Status Text with Smooth Transition */}
          <div className="ss-status-text-wrap">
            <div key={statusIndex} className="ss-status-text">
              {STATUS_MESSAGES[statusIndex]}
            </div>
          </div>

          {/* Minimal 0% to 100% Progress Bar */}
          <div className="ss-progress-container">
            <div className="ss-progress-track">
              <div
                className="ss-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="ss-progress-number">
              <span>{progress}%</span>
            </div>
          </div>

          {/* Semantic Micro Caption */}
          <div className="ss-caption-text">
            DATA → AI ANALYSIS → SKILL INTELLIGENCE → FUTURE INSIGHTS
          </div>
        </div>
      </div>

      {/* ── Pure Scoped CSS: Zero interference with global styling ── */}
      <style jsx global>{`
        .ss-loader-root {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background-color: #05070d;
          display: flex;
          flex-direction: column;
          align-items: center;
          justifyContent: center;
          overflow: hidden;
          opacity: 1;
          transform: scale(1);
          transition: opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: all;
          user-select: none;
          font-family: var(--font-inter, -apple-system, BlinkMacSystemFont, sans-serif);
        }

        .ss-loader-exit {
          opacity: 0 !important;
          transform: scale(1.03) !important;
          pointer-events: none !important;
        }

        /* Ambient Cyber-Grid background */
        .ss-loader-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 36px 36px;
          opacity: 0.6;
          pointer-events: none;
        }

        /* Radial ambient light glow */
        .ss-loader-ambient-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.09) 0%, rgba(59, 130, 246, 0.04) 45%, transparent 70%);
          filter: blur(40px);
          pointer-events: none;
          animation: ssGlowBreathe 3s ease-in-out infinite alternate;
        }

        @keyframes ssGlowBreathe {
          0% { transform: scale(0.92); opacity: 0.7; }
          100% { transform: scale(1.12); opacity: 1; }
        }

        /* ── Central Stage ── */
        .ss-loader-stage {
          position: relative;
          width: 340px;
          height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ss-loader-svg {
          position: absolute;
          width: 100%;
          height: 100%;
          inset: 0;
          overflow: visible;
        }

        .ss-line-pulse {
          animation: ssDashMove 6s linear infinite;
        }

        @keyframes ssDashMove {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 70; }
        }

        .ss-ray-animated {
          animation: ssRayPulse 2s ease-in-out infinite;
        }

        @keyframes ssRayPulse {
          0%, 100% { opacity: 0.35; stroke-dashoffset: 0; }
          50% { opacity: 0.85; stroke-dashoffset: -20; }
        }

        .ss-orbit-spin {
          transform-origin: 160px 160px;
          animation: ssOrbitRotate 20s linear infinite;
        }

        @keyframes ssOrbitRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Active scanning beam across the network */
        .ss-loader-scanner {
          position: absolute;
          width: 120%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.7), rgba(59, 130, 246, 0.6), transparent);
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.5);
          animation: ssScanSweep 2.4s ease-in-out infinite;
          opacity: 0.75;
          pointer-events: none;
          z-index: 2;
        }

        @keyframes ssScanSweep {
          0% { transform: translateY(-130px) rotate(-8deg); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(130px) rotate(-8deg); opacity: 0; }
        }

        /* Central Logo Pod */
        .ss-logo-pod {
          position: relative;
          z-index: 10;
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: #090c15;
          border: 1px solid rgba(245, 158, 11, 0.35);
          box-shadow:
            0 0 35px rgba(245, 158, 11, 0.18),
            inset 0 0 20px rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
        }

        .ss-logo-pulse {
          transform: scale(1.08);
          border-color: #F59E0B;
          box-shadow:
            0 0 50px rgba(245, 158, 11, 0.5),
            inset 0 0 25px rgba(245, 158, 11, 0.2);
        }

        .ss-logo-aura {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%);
          animation: ssAuraBreathe 2s ease-in-out infinite alternate;
        }

        @keyframes ssAuraBreathe {
          0% { transform: scale(0.95); opacity: 0.4; }
          100% { transform: scale(1.15); opacity: 0.9; }
        }

        .ss-logo-img {
          width: 58px;
          height: 58px;
          object-fit: contain;
          filter: drop-shadow(0 0 14px rgba(245, 158, 11, 0.35));
          position: relative;
          z-index: 2;
        }

        /* ── Data Source Floating Badges ── */
        .ss-badges-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .ss-data-badge {
          position: absolute;
          transform: translate(-50%, -50%);
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 9px;
          border-radius: 99px;
          background: rgba(9, 12, 21, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 5;
        }

        .ss-badge-converging {
          transform: translate(-50%, -50%) scale(0.4) !important;
          opacity: 0 !important;
        }

        .ss-badge-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          box-shadow: 0 0 6px currentColor;
        }

        .ss-badge-text {
          font-size: 10.5px;
          font-weight: 600;
          color: #e2e8f0;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        /* ── Lower Status Sequence & Progress ── */
        .ss-loader-footer {
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 100%;
          max-width: 360px;
          padding: 0 20px;
        }

        .ss-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          border-radius: 99px;
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.28);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #F59E0B;
          margin-bottom: 12px;
        }

        .ss-sparkle-spin {
          animation: ssSparkle 3s ease-in-out infinite alternate;
        }

        @keyframes ssSparkle {
          0% { transform: scale(0.85) rotate(0deg); color: #F59E0B; }
          100% { transform: scale(1.15) rotate(180deg); color: #10B981; }
        }

        .ss-status-text-wrap {
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .ss-status-text {
          font-family: var(--font-space-grotesk, sans-serif);
          font-size: 14.5px;
          font-weight: 600;
          color: #f8fafc;
          letter-spacing: -0.01em;
          animation: ssFadeSlide 0.35s ease-out forwards;
        }

        @keyframes ssFadeSlide {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Minimal Progress Indicator */
        .ss-progress-container {
          width: 100%;
          max-width: 260px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ss-progress-track {
          flex: 1;
          height: 3.5px;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.08);
          overflow: hidden;
          position: relative;
        }

        .ss-progress-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #F59E0B 0%, #10B981 100%);
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
          transition: width 0.08s linear;
        }

        .ss-progress-number {
          font-family: var(--font-space-grotesk, monospace);
          font-size: 12px;
          font-weight: 700;
          color: #94a3b8;
          font-variant-numeric: tabular-nums;
          min-width: 34px;
          text-align: right;
        }

        .ss-caption-text {
          margin-top: 18px;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #475569;
          text-transform: uppercase;
        }

        @media (max-width: 480px) {
          .ss-loader-stage {
            width: 290px;
            height: 290px;
          }
          .ss-logo-pod {
            width: 76px;
            height: 76px;
          }
          .ss-logo-img {
            width: 48px;
            height: 48px;
          }
          .ss-badge-text {
            font-size: 9.5px;
          }
          .ss-caption-text {
            font-size: 8.5px;
          }
        }
      `}</style>

      {/* Render children underneath (initial SSR hydration occurs without flashing) */}
      {children}
    </>
  );
}
