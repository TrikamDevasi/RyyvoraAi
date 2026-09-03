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

// ── Procedural Anatomical AI Brain Generation ─────────────────────────────
function generateBrainMesh(): { points: Point3D[]; connections: Connection[] } {
  const points: Point3D[] = [];
  const TOTAL_SYNAPSES = 520;
  const AMBIENT_PARTICLES = 680;

  // 1. Generate Core Synaptic Nodes on Organic Cortical Hemispheres
  for (let i = 0; i < TOTAL_SYNAPSES; i++) {
    const hemisphere = i % 2 === 0 ? 1 : -1;
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI - Math.PI / 2; // Latitude [-PI/2, PI/2]
    const phi = v * Math.PI; // Longitude [0, PI]

    const rx = 1.08;
    const ry = 0.92;
    const rz = 1.28;

    // Organic cortical folds harmonics (gyri and sulci undulations)
    const foldHarmonics =
      1 +
      0.13 * Math.sin(7 * theta) * Math.cos(6 * phi) +
      0.08 * Math.cos(11 * theta) * Math.sin(9 * phi) +
      0.05 * Math.sin(16 * theta);

    // Interhemispheric longitudinal fissure separation
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

    // Frontal lobe lift and curvature
    if (z > 0.45) {
      y += 0.09 * (z - 0.45);
    }

    // Scale to standard view dimensions
    const scale = 1.4;
    x *= scale;
    y *= scale;
    z *= scale;

    // Initial scattered coordinates (Scene 1-2 space drift)
    const scatterDist = 4.5 + Math.random() * 6.5;
    const sTheta = Math.random() * Math.PI * 2;
    const sPhi = Math.random() * Math.PI;
    const scatterX = Math.sin(sPhi) * Math.cos(sTheta) * scatterDist;
    const scatterY = Math.cos(sPhi) * scatterDist;
    const scatterZ = Math.sin(sPhi) * Math.sin(sTheta) * scatterDist;

    // Outward explosion vectors for Scene 6
    const norm = Math.hypot(x, y, z) || 1;
    const speed = 7 + Math.random() * 9;
    const vx = (x / norm) * speed + (Math.random() - 0.5) * 3;
    const vy = (y / norm) * speed + (Math.random() - 0.5) * 3;
    const vz = (z / norm) * speed + (Math.random() - 0.5) * 3;

    // Color palette: SkillSense Brand Gold (#f59e0b), Light Gold (#fbbf24), Deep Amber (#d97706), Cyan pulse (#38bdf8)
    const roll = Math.random();
    let color = '#f59e0b';
    if (roll < 0.28) color = '#fbbf24';
    else if (roll < 0.42) color = '#38bdf8';
    else if (roll < 0.58) color = '#d97706';

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
      size: Math.random() * 2.2 + 1.4,
      baseAlpha: Math.random() * 0.4 + 0.6,
      color,
      isSynapse: true,
      pulsePhase: Math.random() * Math.PI * 2,
    });
  }

  // 2. Generate Ambient Neural Telemetry Halo Particles
  for (let i = 0; i < AMBIENT_PARTICLES; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 1.5 + Math.random() * 1.8;
    const height = (Math.random() - 0.5) * 2.6;
    const zOffset = (Math.random() - 0.5) * 2.2;

    const x = Math.cos(angle) * dist;
    const y = height;
    const z = Math.sin(angle) * dist * 0.88 + zOffset;

    const sDist = 5 + Math.random() * 7;
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
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.5) * 14,
      vz: (Math.random() - 0.5) * 14,
      size: Math.random() * 1.5 + 0.6,
      baseAlpha: Math.random() * 0.3 + 0.15,
      color: Math.random() > 0.3 ? '#f59e0b' : '#38bdf8',
      isSynapse: false,
      pulsePhase: Math.random() * Math.PI * 2,
    });
  }

  // 3. Precompute Synaptic Axon Connections between nearby primary nodes
  const connections: Connection[] = [];
  const MAX_CONNECT_DIST = 0.44;
  const MAX_CONNECTIONS_PER_NODE = 4;

  for (let i = 0; i < TOTAL_SYNAPSES; i++) {
    let connectCount = 0;
    for (let j = i + 1; j < TOTAL_SYNAPSES; j++) {
      if (connectCount >= MAX_CONNECTIONS_PER_NODE) break;

      const p1 = points[i];
      const p2 = points[j];

      // Avoid connecting across the deep hemisphere gap unless close to corpus callosum
      if (Math.sign(p1.origX) !== Math.sign(p2.origX) && Math.abs(p1.origY) > 0.3) {
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
          pulseSpeed: 0.8 + Math.random() * 1.4,
        });
        connectCount++;
      }
    }
  }

  return { points, connections };
}

export default function SkillSenseIntro({ children }: { children?: React.ReactNode }) {
  const [shouldRender, setShouldRender] = useState(true);
  const [scene, setScene] = useState<number>(1);
  const [opacity, setOpacity] = useState<number>(1);
  const [textStyle, setTextStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [lightDotStyle, setLightDotStyle] = useState<React.CSSProperties>({ opacity: 0, transform: 'scale(0)' });
  const [lightBeamStyle, setLightBeamStyle] = useState<React.CSSProperties>({ opacity: 0, transform: 'scaleX(0)' });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const isCompleteRef = useRef<boolean>(false);
  const pageReadyRef = useRef<boolean>(false);

  // Fast skip if previously seen in session unless ?intro=true or #intro
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const forceIntro =
      new URLSearchParams(window.location.search).get('intro') === 'true' ||
      window.location.hash === '#intro';

    const seen = sessionStorage.getItem('skillsense_intro_seen');
    if (seen === 'true' && !forceIntro) {
      setShouldRender(false);
      return;
    }

    sessionStorage.setItem('skillsense_intro_seen', 'true');

    // Check document readiness
    if (document.readyState === 'complete') {
      pageReadyRef.current = true;
    } else {
      const onReady = () => { pageReadyRef.current = true; };
      window.addEventListener('load', onReady);
      return () => window.removeEventListener('load', onReady);
    }
  }, []);

  const handleFinish = useCallback(() => {
    if (isCompleteRef.current) return;
    isCompleteRef.current = true;

    // Smooth website reveal transition (Scene 7)
    setScene(7);
    setOpacity(0);

    setTimeout(() => {
      setShouldRender(false);
    }, 550);
  }, []);

  useEffect(() => {
    if (!shouldRender) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Handle high-DPI retina rendering
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

    const render = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000; // in seconds

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.28;

      // ────────────────────────────────────────────────────────────────────────
      // SCENE TIMINGS & PROGRESS CALCULATIONS
      // Total optimal sequence: ~3.7s
      // Scene 1: 0.0s – 0.5s (Pure Black)
      // Scene 2: 0.5s – 1.1s ("SkillSense" Text Forms from Light)
      // Scene 3: 1.0s – 1.8s (AI Brain Neural Mesh Assembles)
      // Scene 4: 1.8s – 2.4s (Brain Pulses with Power)
      // Scene 5: 2.4s – 3.1s (Massive Dramatic Zoom of "SkillSense")
      // Scene 6: 3.1s – 3.4s (Dissolve/Disperse & Blackout)
      // Scene 7: 3.4s – 3.9s (Smooth Website Reveal)
      // ────────────────────────────────────────────────────────────────────────

      // ── SCENE 1: Pure Black (0.0s - 0.5s) ──
      if (elapsed < 0.5) {
        setScene(1);
        setTextStyle({ opacity: 0, transform: 'scale(0.95)' });
        setLightDotStyle({ opacity: 0, transform: 'scale(0)' });
        setLightBeamStyle({ opacity: 0, transform: 'scaleX(0)' });
      }

      // ── SCENE 2: Light Emerges & "SkillSense" Forms (0.5s - 1.1s) ──
      else if (elapsed >= 0.5 && elapsed < 1.1) {
        setScene(2);
        const t = (elapsed - 0.5) / 0.6; // 0 to 1

        // Light point flare
        const dotScale = Math.min(t * 2.5, 1);
        const dotOpacity = t < 0.4 ? t / 0.4 : 1 - (t - 0.4) / 0.6;
        setLightDotStyle({
          opacity: dotOpacity,
          transform: `translate(-50%, -50%) scale(${dotScale})`,
        });

        // Horizontal lens flare beam
        const beamScale = Math.min(t * 1.8, 1);
        const beamOpacity = t < 0.6 ? t / 0.6 : 1 - (t - 0.6) / 0.4;
        setLightBeamStyle({
          opacity: beamOpacity * 0.85,
          transform: `translate(-50%, -50%) scaleX(${beamScale}) scaleY(${1 - t * 0.5})`,
        });

        // "SkillSense" typography forms from the light
        const textProgress = Math.max(0, (elapsed - 0.65) / 0.45);
        const textBlur = Math.max(0, (1 - textProgress) * 16);
        const textLetterSpacing = (1 - textProgress) * 0.18;

        setTextStyle({
          opacity: textProgress,
          transform: `scale(${0.96 + textProgress * 0.04})`,
          filter: `blur(${textBlur}px) drop-shadow(0 0 ${20 * textProgress}px rgba(245, 158, 11, 0.6))`,
          letterSpacing: `${textLetterSpacing}em`,
        });
      }

      // ── SCENE 3 & 4: Brain Forms & Becomes Powerful (1.1s - 2.4s) ──
      else if (elapsed >= 1.1 && elapsed < 2.4) {
        const isScene4 = elapsed >= 1.8;
        setScene(isScene4 ? 4 : 3);

        const formProgress = Math.min((elapsed - 1.1) / 0.85, 1); // 0 to 1
        // Smooth easeOutCubic
        const easeForm = 1 - Math.pow(1 - formProgress, 3);

        // Steady sharp text in front of brain
        const pulse = 1 + Math.sin((elapsed - 1.1) * 4) * 0.015;
        const glowStrength = isScene4 ? 28 + Math.sin(elapsed * 6) * 10 : 20;

        setTextStyle({
          opacity: 1,
          transform: `scale(${pulse})`,
          filter: `drop-shadow(0 0 ${glowStrength}px rgba(245, 158, 11, 0.75)) drop-shadow(0 0 ${glowStrength * 2}px rgba(217, 119, 6, 0.4))`,
          letterSpacing: '-0.03em',
        });
        setLightDotStyle({ opacity: 0 });
        setLightBeamStyle({ opacity: 0 });

        // Update 3D particle positions (converging from scatter to brain)
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          p.x = p.scatterX + (p.origX - p.scatterX) * easeForm;
          p.y = p.scatterY + (p.origY - p.scatterY) * easeForm;
          p.z = p.scatterZ + (p.origZ - p.scatterZ) * easeForm;
        }
      }

      // ── SCENE 5: Massive "SkillSense" Zoom (2.4s - 3.1s) ──
      else if (elapsed >= 2.4 && elapsed < 3.1) {
        setScene(5);
        const zoomT = (elapsed - 2.4) / 0.7; // 0 to 1
        // Dramatic cinematic exponential acceleration
        const zoomEased = Math.pow(zoomT, 3.2);

        const scale = 1.0 + zoomEased * 18.0;
        const motionBlur = Math.min(zoomEased * 22, 18);
        const textOpacity = zoomT > 0.85 ? 1 - (zoomT - 0.85) / 0.15 : 1;

        setTextStyle({
          opacity: textOpacity,
          transform: `scale(${scale})`,
          filter: `blur(${motionBlur}px) brightness(${1 + zoomT * 2.2}) drop-shadow(0 0 ${35 + zoomT * 40}px rgba(245, 158, 11, 0.9))`,
          letterSpacing: `${-0.03 + zoomT * 0.12}em`,
        });

        // Brain expands in tandem with energetic shockwave
        const brainExpand = 1 + zoomEased * 3.2;
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          p.x = p.origX * brainExpand;
          p.y = p.origY * brainExpand;
          p.z = p.origZ * brainExpand;
        }
      }

      // ── SCENE 6: Dissolve & Outward Explosion (3.1s - 3.4s) ──
      else if (elapsed >= 3.1 && elapsed < 3.4) {
        setScene(6);
        const explodeT = (elapsed - 3.1) / 0.3; // 0 to 1

        setTextStyle({
          opacity: 0,
          transform: `scale(${22 + explodeT * 10})`,
          filter: 'blur(30px)',
        });

        // Particles disperse outward into tiny stars
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          p.x = p.origX * 3.8 + p.vx * explodeT * 18;
          p.y = p.origY * 3.8 + p.vy * explodeT * 18;
          p.z = p.origZ * 3.8 + p.vz * explodeT * 18;
        }
      }

      // ── SCENE 7: Website Reveal (3.4s+) ──
      else {
        handleFinish();
        return;
      }

      // ────────────────────────────────────────────────────────────────────────
      // CANVAS 3D NEURAL BRAIN RENDERING ENGINE
      // ────────────────────────────────────────────────────────────────────────
      if (elapsed >= 0.9 && elapsed < 3.4) {
        const brainFadeIn = Math.min((elapsed - 0.9) / 0.5, 1);
        const brainFadeOut = elapsed > 3.1 ? Math.max(0, 1 - (elapsed - 3.1) / 0.3) : 1;
        const globalAlpha = brainFadeIn * brainFadeOut;

        // 3D Rotation angles: gentle yaw tilt + pitch breathing
        const rotY = Math.sin(elapsed * 0.75) * 0.28;
        const rotX = 0.12 + Math.cos(elapsed * 0.6) * 0.1;
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        const FOV = 4.2;

        // Project 3D coordinates to 2D screen space
        const projected: { sx: number; sy: number; sz: number; scale: number; alpha: number; color: string; size: number; isSynapse: boolean }[] = [];

        for (let i = 0; i < points.length; i++) {
          const p = points[i];

          // Rotate Y
          const x1 = p.x * cosY + p.z * sinY;
          const z1 = -p.x * sinY + p.z * cosY;

          // Rotate X
          const y2 = p.y * cosX - z1 * sinX;
          const z2 = p.y * sinX + z1 * cosX;

          const depth = z2 + 5.5;
          const pScale = depth > 0.1 ? FOV / depth : 0.01;

          const sx = centerX + x1 * baseRadius * pScale;
          const sy = centerY + y2 * baseRadius * pScale;

          // Depth-based shading
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

        // Draw Synaptic Connection Axons (Thin connecting glowing lines)
        if (elapsed >= 1.2 && elapsed < 3.25) {
          const connectFade = Math.min((elapsed - 1.2) / 0.6, 1) * brainFadeOut;

          for (let i = 0; i < connections.length; i++) {
            const conn = connections[i];
            const p1 = projected[conn.p1];
            const p2 = projected[conn.p2];

            if (!p1 || !p2 || p1.scale < 0.1 || p2.scale < 0.1) continue;

            const lineAlpha = (1 - conn.distance / 0.45) * Math.min(p1.alpha, p2.alpha) * 0.45 * connectFade;
            if (lineAlpha <= 0.02) continue;

            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            ctx.strokeStyle = `rgba(245, 158, 11, ${lineAlpha})`;
            ctx.lineWidth = 0.85 * Math.min(p1.scale, p2.scale);
            ctx.stroke();

            // Synaptic action potential energy impulse (spark traveling along line)
            if (elapsed >= 1.6 && elapsed < 3.1) {
              const impulseT = (elapsed * conn.pulseSpeed + conn.pulseOffset) % 1.0;
              const sparkX = p1.sx + (p2.sx - p1.sx) * impulseT;
              const sparkY = p1.sy + (p2.sy - p1.sy) * impulseT;
              const sparkAlpha = lineAlpha * 1.8;

              ctx.beginPath();
              ctx.arc(sparkX, sparkY, 1.2 * p1.scale, 0, Math.PI * 2);
              ctx.fillStyle = conn.pulseOffset > 0.6 ? `rgba(56, 189, 248, ${sparkAlpha})` : `rgba(251, 191, 36, ${sparkAlpha})`;
              ctx.shadowColor = '#f59e0b';
              ctx.shadowBlur = 4;
              ctx.fill();
            }
          }
        }

        // Draw Neural Nodes & Synapses
        ctx.shadowBlur = 0;
        for (let i = 0; i < projected.length; i++) {
          const p = projected[i];
          if (p.alpha <= 0.01) continue;

          ctx.beginPath();
          ctx.arc(p.sx, p.sy, Math.max(p.size, 0.6), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();

          // Subtle glow on key synapses
          if (p.isSynapse && p.scale > 0.85 && p.alpha > 0.5) {
            ctx.beginPath();
            ctx.arc(p.sx, p.sy, p.size * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha * 0.25})`;
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
        role="dialog"
        aria-label="SkillSense AI Initialization"
        aria-modal="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999999,
          backgroundColor: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          opacity,
          pointerEvents: opacity === 0 ? 'none' : 'auto',
          transition: 'opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'default',
          userSelect: 'none',
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
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50vw',
            height: '50vh',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.04) 45%, transparent 70%)',
            pointerEvents: 'none',
            filter: 'blur(50px)',
            opacity: scene >= 2 && scene <= 5 ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />

        {/* Scene 2 Initial Center Light Dot Flare */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 0 25px 8px rgba(245, 158, 11, 0.95), 0 0 60px 16px rgba(251, 191, 36, 0.6)',
            pointerEvents: 'none',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            ...lightDotStyle,
          }}
        />

        {/* Scene 2 Expanding Horizontal Lens Flare Beam */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 'min(90vw, 680px)',
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.4) 20%, #ffffff 50%, rgba(245, 158, 11, 0.4) 80%, transparent 100%)',
            boxShadow: '0 0 16px 2px rgba(245, 158, 11, 0.8)',
            pointerEvents: 'none',
            transition: 'transform 0.4s ease, opacity 0.4s ease',
            ...lightBeamStyle,
          }}
        />

        {/* Hero "SkillSense" Typography (Centerpiece) */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none',
            transformOrigin: 'center center',
            transition: 'all 0.1s cubic-bezier(0.2, 0.9, 0.3, 1)',
            ...textStyle,
          }}
        >
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(44px, 8.5vw, 108px)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.035em',
              margin: 0,
              padding: 0,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              textShadow: '0 0 40px rgba(0, 0, 0, 0.9), 0 4px 20px rgba(0,0,0,0.8)',
            }}
          >
            SkillSense
            <span
              style={{
                display: 'inline-block',
                marginLeft: 'clamp(6px, 1.2vw, 18px)',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '0.62em',
                verticalAlign: 'super',
                fontWeight: 900,
                letterSpacing: '-0.01em',
                filter: 'drop-shadow(0 0 14px rgba(245, 158, 11, 0.8))',
              }}
            >
              AI
            </span>
          </h1>
        </div>

        {/* Keyboard accessibility / Skip indicator */}
        <button
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
            padding: '5px 14px',
            color: 'rgba(255, 255, 255, 0.45)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 20,
            opacity: scene >= 3 ? 0.7 : 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)';
            e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)';
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
