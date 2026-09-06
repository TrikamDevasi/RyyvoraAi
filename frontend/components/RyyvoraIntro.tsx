'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  origX: number;
  origY: number;
  origZ: number;
  scatterX: number;
  scatterY: number;
  scatterZ: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  baseAlpha: number;
  color: string;
  isSynapse: boolean;
  pulsePhase: number;
}

interface Connection {
  p1: number;
  p2: number;
  distance: number;
  pulseOffset: number;
  pulseSpeed: number;
}

// ── Easing Helpers for Cinematic Smoothness ──────────────────────────────────
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeOutQuad(x: number): number {
  return 1 - (1 - x) * (1 - x);
}

function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

// ── Procedural Anatomical AI Brain Generation ─────────────────────────────
function generateBrainMesh(): { points: Point3D[]; connections: Connection[] } {
  const points: Point3D[] = [];
  const TOTAL_SYNAPSES = 380;
  const AMBIENT_PARTICLES = 420;

  // 1. Core Synaptic Nodes on Organic Cortical Hemispheres
  for (let i = 0; i < TOTAL_SYNAPSES; i++) {
    const hemisphere = i % 2 === 0 ? 1 : -1;
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI - Math.PI / 2;
    const phi = v * Math.PI;

    const rx = 1.08;
    const ry = 0.92;
    const rz = 1.28;

    // Organic cortical folds harmonics
    const foldHarmonics =
      1 +
      0.13 * Math.sin(7 * theta) * Math.cos(6 * phi) +
      0.08 * Math.cos(11 * theta) * Math.sin(9 * phi) +
      0.05 * Math.sin(16 * theta);

    const fissure = 0.12;

    let x = hemisphere * (fissure + (0.16 + 0.84 * Math.cos(theta) * Math.sin(phi)) * rx) * foldHarmonics;
    let y = (Math.sin(theta) - 0.15 * Math.pow(Math.cos(phi), 2)) * ry * foldHarmonics;
    let z = (Math.cos(theta) * Math.cos(phi) + 0.1 * Math.sin(theta)) * rz * foldHarmonics;

    // Cerebellar bulge at posterior-inferior region
    if (y < -0.25 && z < -0.35) {
      x *= 0.88;
      y = y * 0.9 - 0.16;
      z = z * 0.95 - 0.12;
    }

    // Frontal lobe curvature
    if (z > 0.45) {
      y += 0.09 * (z - 0.45);
    }

    const scale = 1.38;
    x *= scale;
    y *= scale;
    z *= scale;

    // Initial scattered coordinates (smooth outer cloud)
    const scatterDist = 4.2 + Math.random() * 5.0;
    const sTheta = Math.random() * Math.PI * 2;
    const sPhi = Math.random() * Math.PI;
    const scatterX = Math.sin(sPhi) * Math.cos(sTheta) * scatterDist;
    const scatterY = Math.cos(sPhi) * scatterDist;
    const scatterZ = Math.sin(sPhi) * Math.sin(sTheta) * scatterDist;

    // Fly-through velocity vectors
    const norm = Math.hypot(x, y, z) || 1;
    const speed = 4.5 + Math.random() * 6.0;
    const vx = (x / norm) * speed + (Math.random() - 0.5) * 2;
    const vy = (y / norm) * speed + (Math.random() - 0.5) * 2;
    const vz = (z / norm) * speed + (Math.random() - 0.5) * 2;

    // Brand Palette: Pure Amber, Warm Gold, Cyan Accent, Crisp Pearl
    const roll = Math.random();
    let color = '#f59e0b';
    if (roll < 0.32) color = '#fbbf24';
    else if (roll < 0.46) color = '#38bdf8';
    else if (roll < 0.62) color = '#d97706';
    else if (roll < 0.72) color = '#ffffff';

    points.push({
      x: scatterX,
      y: scatterY,
      z: scatterZ,
      origX: x,
      origY: y,
      origZ: z,
      scatterX,
      scatterY,
      scatterZ,
      vx,
      vy,
      vz,
      size: Math.random() * 2.0 + 1.2,
      baseAlpha: Math.random() * 0.35 + 0.65,
      color,
      isSynapse: true,
      pulsePhase: Math.random() * Math.PI * 2,
    });
  }

  // 2. Ambient Neural Halo Particles
  for (let i = 0; i < AMBIENT_PARTICLES; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 1.6 + Math.random() * 2.0;
    const height = (Math.random() - 0.5) * 2.8;
    const zOffset = (Math.random() - 0.5) * 2.4;

    const x = Math.cos(angle) * dist;
    const y = height;
    const z = Math.sin(angle) * dist * 0.9 + zOffset;

    const sDist = 4.5 + Math.random() * 6.0;
    const sAngle = Math.random() * Math.PI * 2;

    points.push({
      x: Math.cos(sAngle) * sDist,
      y: (Math.random() - 0.5) * sDist,
      z: Math.sin(sAngle) * sDist,
      origX: x,
      origY: y,
      origZ: z,
      scatterX: Math.cos(sAngle) * sDist,
      scatterY: (Math.random() - 0.5) * sDist,
      scatterZ: Math.sin(sAngle) * sDist,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      vz: (Math.random() - 0.5) * 8,
      size: Math.random() * 1.4 + 0.6,
      baseAlpha: Math.random() * 0.3 + 0.2,
      color: Math.random() > 0.35 ? '#f59e0b' : '#38bdf8',
      isSynapse: false,
      pulsePhase: Math.random() * Math.PI * 2,
    });
  }

  // 3. Precompute Synaptic Axon Connections
  const connections: Connection[] = [];
  const MAX_CONNECT_DIST = 0.42;
  const MAX_CONNECTIONS_PER_NODE = 3;

  for (let i = 0; i < TOTAL_SYNAPSES; i++) {
    let connectCount = 0;
    for (let j = i + 1; j < TOTAL_SYNAPSES; j++) {
      if (connectCount >= MAX_CONNECTIONS_PER_NODE) break;

      const p1 = points[i];
      const p2 = points[j];

      if (Math.sign(p1.origX) !== Math.sign(p2.origX) && Math.abs(p1.origY) > 0.32) {
        continue;
      }

      const dx = p1.origX - p2.origX;
      const dy = p1.origY - p2.origY;
      const dz = p1.origZ - p2.origZ;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < MAX_CONNECT_DIST) {
        connections.push({
          p1: i,
          p2: j,
          distance: dist,
          pulseOffset: Math.random(),
          pulseSpeed: 0.5 + Math.random() * 0.7,
        });
        connectCount++;
      }
    }
  }

  return { points, connections };
}

export default function RyyvoraIntro({ children }: { children?: React.ReactNode }) {
  const [shouldRender, setShouldRender] = useState(true);

  // Direct DOM refs to avoid triggering React re-renders on every animation frame (prevents frame drops)
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const lightDotRef = useRef<HTMLDivElement | null>(null);
  const lightBeamRef = useRef<HTMLDivElement | null>(null);
  const centerGlowRef = useRef<HTMLDivElement | null>(null);
  const skipBtnRef = useRef<HTMLButtonElement | null>(null);

  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const isCompleteRef = useRef<boolean>(false);

  const handleFinish = useCallback(() => {
    if (isCompleteRef.current) return;
    isCompleteRef.current = true;

    if (overlayRef.current) {
      overlayRef.current.style.transition = 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
      overlayRef.current.style.opacity = '0';
      overlayRef.current.style.pointerEvents = 'none';
    }

    setTimeout(() => {
      setShouldRender(false);
    }, 880);
  }, []);

  // Keyboard shortcut: Esc to instantly skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish]);

  // Session check
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const forceIntro =
      new URLSearchParams(window.location.search).get('intro') === 'true' ||
      window.location.hash === '#intro';

    const seen = sessionStorage.getItem('ryyvora_intro_seen') || sessionStorage.getItem('skillsense_intro_seen');
    if (seen === 'true' && !forceIntro) {
      setShouldRender(false);
      return;
    }

    sessionStorage.setItem('ryyvora_intro_seen', 'true');
  }, []);

  useEffect(() => {
    if (!shouldRender) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const { points, connections } = generateBrainMesh();
    startTimeRef.current = performance.now();

    // ── Ultra-Smooth 60/120 FPS Animation Loop ────────────────────────────
    const render = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000; // in seconds

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.28;

      // ────────────────────────────────────────────────────────────────────────
      // CINEMATIC TIMELINE CHOREOGRAPHY (Total Duration: ~5.0s)
      //
      // 0.0s – 1.3s: Inception of Light (Smooth singularity flare & beam expand)
      // 0.8s – 2.4s: Neural mesh smoothly converges from space; logo crystallizes
      // 2.2s – 4.0s: Harmonic breathing, synaptic impulses flow, golden resonance
      // 4.0s – 4.9s: Seamless forward camera glide (particles & logo part smoothly)
      // 4.9s+:       Velvety dissolve into the live web page
      // ────────────────────────────────────────────────────────────────────────

      // 1. Light Dot Flare (0.0s – 1.3s)
      if (lightDotRef.current) {
        if (elapsed < 0.05) {
          lightDotRef.current.style.opacity = '0';
          lightDotRef.current.style.transform = 'translate(-50%, -50%) scale(0)';
        } else if (elapsed < 1.3) {
          const t = elapsed / 1.3;
          const scale = easeOutQuad(Math.min(t * 2.0, 1));
          const dotAlpha = t < 0.35 ? t / 0.35 : 1 - (t - 0.35) / 0.65;
          lightDotRef.current.style.opacity = String(dotAlpha);
          lightDotRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
        } else {
          lightDotRef.current.style.opacity = '0';
        }
      }

      // 2. Horizontal Lens Flare Beam (0.1s – 1.4s)
      if (lightBeamRef.current) {
        if (elapsed < 0.1) {
          lightBeamRef.current.style.opacity = '0';
          lightBeamRef.current.style.transform = 'translate(-50%, -50%) scaleX(0)';
        } else if (elapsed < 1.4) {
          const t = (elapsed - 0.1) / 1.3;
          const beamScale = easeOutCubic(Math.min(t * 1.5, 1));
          const beamAlpha = t < 0.35 ? (t / 0.35) * 0.9 : (1 - (t - 0.35) / 0.65) * 0.9;
          lightBeamRef.current.style.opacity = String(beamAlpha);
          lightBeamRef.current.style.transform = `translate(-50%, -50%) scaleX(${beamScale}) scaleY(${1 - t * 0.4})`;
        } else {
          lightBeamRef.current.style.opacity = '0';
        }
      }

      // 3. Ambient Center Glow
      if (centerGlowRef.current) {
        if (elapsed < 0.5) {
          centerGlowRef.current.style.opacity = '0';
        } else if (elapsed < 4.0) {
          const glowAlpha = smoothstep(0.5, 1.8, elapsed) * 0.85;
          centerGlowRef.current.style.opacity = String(glowAlpha);
        } else if (elapsed < 5.0) {
          const fadeAlpha = Math.max(0, 1 - (elapsed - 4.0) / 1.0) * 0.85;
          centerGlowRef.current.style.opacity = String(fadeAlpha);
        } else {
          centerGlowRef.current.style.opacity = '0';
        }
      }

      // 4. "Ryyvora AI" Typography State & Transitions
      if (textRef.current) {
        if (elapsed < 0.6) {
          textRef.current.style.opacity = '0';
          textRef.current.style.transform = 'scale(0.96)';
          textRef.current.style.filter = 'blur(12px)';
        }
        // Ingress: Smooth fade-in and crystallization (0.6s – 2.2s)
        else if (elapsed >= 0.6 && elapsed < 2.2) {
          const t = (elapsed - 0.6) / 1.6;
          const easedT = easeOutCubic(t);
          const opacity = smoothstep(0.6, 1.8, elapsed);
          const blur = Math.max(0, (1 - easedT) * 12);
          const scale = 0.96 + easedT * 0.04;
          const letterSpacing = (1 - easedT) * 0.06;

          textRef.current.style.opacity = String(opacity);
          textRef.current.style.transform = `scale(${scale})`;
          textRef.current.style.filter = blur > 0.2 ? `blur(${blur}px)` : 'none';
          textRef.current.style.letterSpacing = `${-0.03 + letterSpacing}em`;
        }
        // Resonance & Breathing (2.2s – 4.0s)
        else if (elapsed >= 2.2 && elapsed < 4.0) {
          const pulse = 1 + Math.sin((elapsed - 2.2) * 2.5) * 0.008;
          textRef.current.style.opacity = '1';
          textRef.current.style.transform = `scale(${pulse})`;
          textRef.current.style.filter = 'none';
          textRef.current.style.letterSpacing = '-0.03em';
        }
        // Cinematic Glide-Through & Dissolve (4.0s – 4.9s)
        else if (elapsed >= 4.0 && elapsed < 4.9) {
          const t = (elapsed - 4.0) / 0.9;
          const easedZoom = easeInOutCubic(t);
          const scale = 1.0 + easedZoom * 1.5;
          const opacity = Math.max(0, 1 - Math.pow(t, 2.0));
          const blur = easedZoom * 8;

          textRef.current.style.opacity = String(opacity);
          textRef.current.style.transform = `scale(${scale})`;
          textRef.current.style.filter = blur > 0.2 ? `blur(${blur}px)` : 'none';
          textRef.current.style.letterSpacing = `${-0.03 + t * 0.04}em`;
        } else {
          textRef.current.style.opacity = '0';
        }
      }

      // 5. Skip Button Fade-In
      if (skipBtnRef.current) {
        if (elapsed > 1.8 && elapsed < 4.4) {
          skipBtnRef.current.style.opacity = String(smoothstep(1.8, 2.6, elapsed) * 0.7);
        } else if (elapsed >= 4.4) {
          skipBtnRef.current.style.opacity = '0';
        }
      }

      // 6. Finish / Reveal trigger
      if (elapsed >= 4.95) {
        handleFinish();
        return;
      }

      // ────────────────────────────────────────────────────────────────────────
      // 3D NEURAL BRAIN PARTICLE SIMULATION
      // ────────────────────────────────────────────────────────────────────────
      if (elapsed >= 0.4 && elapsed < 4.95) {
        // Smooth particle positioning interpolation
        const formProgress = Math.min(Math.max((elapsed - 0.5) / 1.7, 0), 1);
        const easeForm = easeOutCubic(formProgress);

        let expandScale = 1.0;
        if (elapsed >= 4.0) {
          const zoomProgress = (elapsed - 4.0) / 0.95;
          expandScale = 1.0 + easeInOutCubic(zoomProgress) * 2.4;
        }

        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          const baseX = p.scatterX + (p.origX - p.scatterX) * easeForm;
          const baseY = p.scatterY + (p.origY - p.scatterY) * easeForm;
          const baseZ = p.scatterZ + (p.origZ - p.scatterZ) * easeForm;

          if (elapsed < 4.0) {
            p.x = baseX;
            p.y = baseY;
            p.z = baseZ;
          } else {
            const explodeT = (elapsed - 4.0) / 0.95;
            p.x = baseX * expandScale + p.vx * explodeT * 1.5;
            p.y = baseY * expandScale + p.vy * explodeT * 1.5;
            p.z = baseZ * expandScale + p.vz * explodeT * 1.5;
          }
        }

        // Global Brain alpha curve
        const brainFadeIn = smoothstep(0.4, 1.4, elapsed);
        const brainFadeOut = elapsed > 4.0 ? Math.max(0, 1 - (elapsed - 4.0) / 0.95) : 1;
        const globalAlpha = brainFadeIn * brainFadeOut;

        // Gentle camera rotation angles (slow, elegant, no harsh oscillation)
        const rotY = Math.sin(elapsed * 0.38) * 0.22;
        const rotX = 0.08 + Math.cos(elapsed * 0.32) * 0.06;
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        const FOV = 4.4;

        // Project 3D points to 2D screen coordinates
        const projected: { sx: number; sy: number; sz: number; scale: number; alpha: number; color: string; size: number; isSynapse: boolean }[] = [];

        for (let i = 0; i < points.length; i++) {
          const p = points[i];

          // Y Rotation
          const x1 = p.x * cosY + p.z * sinY;
          const z1 = -p.x * sinY + p.z * cosY;

          // X Rotation
          const y2 = p.y * cosX - z1 * sinX;
          const z2 = p.y * sinX + z1 * cosX;

          const depth = z2 + 5.5;
          const pScale = depth > 0.1 ? FOV / depth : 0.01;

          const sx = centerX + x1 * baseRadius * pScale;
          const sy = centerY + y2 * baseRadius * pScale;

          const depthAlpha = Math.min(Math.max((z2 + 2.5) / 5, 0.15), 1.0);

          projected.push({
            sx,
            sy,
            sz: z2,
            scale: pScale,
            alpha: p.baseAlpha * depthAlpha * globalAlpha,
            color: p.color,
            size: p.size * pScale * (p.isSynapse ? 1.0 : 0.75),
            isSynapse: p.isSynapse,
          });
        }

        // Draw Synaptic Axon Connections (Batched for peak 60/120fps performance)
        if (elapsed >= 1.0 && elapsed < 4.8) {
          const connectFade = smoothstep(1.0, 1.8, elapsed) * brainFadeOut;

          ctx.beginPath();
          let hasLines = false;

          for (let i = 0; i < connections.length; i++) {
            const conn = connections[i];
            const p1 = projected[conn.p1];
            const p2 = projected[conn.p2];

            if (!p1 || !p2 || p1.scale < 0.15 || p2.scale < 0.15) continue;

            const lineAlpha = (1 - conn.distance / 0.42) * Math.min(p1.alpha, p2.alpha) * 0.4 * connectFade;
            if (lineAlpha <= 0.02) continue;

            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            hasLines = true;
          }

          if (hasLines) {
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.28 * connectFade})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }

          // Synaptic Impulse Sparks (Hardware-accelerated without software shadowBlur)
          if (elapsed >= 1.6 && elapsed < 4.5) {
            for (let i = 0; i < connections.length; i += 2) {
              const conn = connections[i];
              const p1 = projected[conn.p1];
              const p2 = projected[conn.p2];

              if (!p1 || !p2 || p1.alpha < 0.3 || p2.alpha < 0.3) continue;

              const impulseT = (elapsed * conn.pulseSpeed + conn.pulseOffset) % 1.0;
              const sparkX = p1.sx + (p2.sx - p1.sx) * impulseT;
              const sparkY = p1.sy + (p2.sy - p1.sy) * impulseT;
              const sparkAlpha = Math.min(p1.alpha, p2.alpha) * 0.9 * connectFade;

              // Outer soft aura
              ctx.beginPath();
              ctx.arc(sparkX, sparkY, 2.4 * p1.scale, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(245, 158, 11, ${sparkAlpha * 0.35})`;
              ctx.fill();

              // Inner bright core
              ctx.beginPath();
              ctx.arc(sparkX, sparkY, 1.1 * p1.scale, 0, Math.PI * 2);
              ctx.fillStyle = conn.pulseOffset > 0.5 ? `rgba(56, 189, 248, ${sparkAlpha})` : `rgba(251, 191, 36, ${sparkAlpha})`;
              ctx.fill();
            }
          }
        }

        // Draw Neural Nodes & Synapses
        for (let i = 0; i < projected.length; i++) {
          const p = projected[i];
          if (p.alpha <= 0.02) continue;

          ctx.beginPath();
          ctx.arc(p.sx, p.sy, Math.max(p.size, 0.6), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();

          // Subtle soft halo around prominent synapses
          if (p.isSynapse && p.scale > 0.85 && p.alpha > 0.5) {
            ctx.beginPath();
            ctx.arc(p.sx, p.sy, p.size * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha * 0.2})`;
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1.0;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [shouldRender, handleFinish]);

  if (!shouldRender) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Underlying Website remains mounted and pre-rendered */}
      <div style={{ opacity: 1 }}>{children}</div>

      {/* Cinematic Full-Screen Introductory Overlay */}
      <div
        ref={overlayRef}
        role="dialog"
        aria-label="Ryyvora AI Initialization"
        aria-modal="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999999,
          backgroundColor: '#050608',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: 'default',
          userSelect: 'none',
          willChange: 'opacity',
        }}
      >
        {/* Background Neural Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            pointerEvents: 'none',
          }}
        />

        {/* Ambient Center Glow */}
        <div
          ref={centerGlowRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(65vw, 680px)',
            height: 'min(65vh, 680px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 45%, transparent 70%)',
            pointerEvents: 'none',
            filter: 'blur(60px)',
            opacity: 0,
            willChange: 'opacity',
          }}
        />

        {/* Initial Center Light Dot Flare */}
        <div
          ref={lightDotRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 0 24px 6px rgba(245, 158, 11, 0.9), 0 0 50px 14px rgba(251, 191, 36, 0.5)',
            pointerEvents: 'none',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        />

        {/* Expanding Horizontal Lens Flare Beam */}
        <div
          ref={lightBeamRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 'min(88vw, 700px)',
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.4) 25%, #ffffff 50%, rgba(245, 158, 11, 0.4) 75%, transparent 100%)',
            boxShadow: '0 0 14px 2px rgba(245, 158, 11, 0.7)',
            pointerEvents: 'none',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        />

        {/* Hero "Ryyvora AI" Typography */}
        <div
          ref={textRef}
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none',
            transformOrigin: 'center center',
            opacity: 0,
            willChange: 'transform, opacity, filter',
          }}
        >
          <div
            role="presentation"
            className="font-display"
            style={{
              fontSize: 'clamp(44px, 8vw, 104px)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              margin: 0,
              padding: 0,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              textShadow: '0 2px 24px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.35)',
            }}
          >
            Ryyvora
            <span
              style={{
                display: 'inline-block',
                marginLeft: 'clamp(6px, 1.2vw, 18px)',
                background: 'linear-gradient(135deg, #fef08a 0%, #fbbf24 35%, #f59e0b 70%, #d97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '0.64em',
                verticalAlign: 'super',
                fontWeight: 900,
                letterSpacing: '-0.01em',
                filter: 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.65))',
              }}
            >
              AI
            </span>
          </div>
        </div>

        {/* Keyboard accessibility / Skip indicator */}
        <button
          ref={skipBtnRef}
          type="button"
          onClick={handleFinish}
          aria-label="Skip introductory animation"
          style={{
            position: 'absolute',
            bottom: 24,
            right: 28,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 99,
            padding: '6px 15px',
            color: 'rgba(255, 255, 255, 0.55)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            transition: 'color 0.2s ease, border-color 0.2s ease, background 0.2s ease',
            zIndex: 20,
            opacity: 0,
            willChange: 'opacity',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)';
            e.currentTarget.style.background = 'rgba(245, 158, 11, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.55)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
        >
          Skip Intro Esc
        </button>
      </div>
    </>
  );
}
