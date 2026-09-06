'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';

export interface Tilt3DProps extends React.HTMLAttributes<HTMLDivElement> {
  maxRotation?: number; // Maximum rotation in degrees (default: 3.5, max recommended 4)
  translateZ?: number; // Translation along Z-axis in pixels (default: 8)
  perspective?: number; // Perspective distance in pixels (default: 1000)
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Tilt3D({
  maxRotation = 3.5,
  translateZ = 8,
  perspective = 1000,
  disabled = false,
  className = '',
  style,
  children,
  ...props
}: Tilt3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  // Detect touch devices and reduced-motion preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isHoverable = window.matchMedia('(hover: hover)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsSupported(isHoverable && !isReducedMotion && !disabled);
  }, [disabled]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isSupported || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Mouse position relative to center of element: -0.5 to +0.5
      const mouseX = (e.clientX - rect.left) / width - 0.5;
      const mouseY = (e.clientY - rect.top) / height - 0.5;

      // Invert Y for rotateX to follow natural tilt perspective
      const rotateX = (-mouseY * maxRotation * 2).toFixed(2);
      const rotateY = (mouseX * maxRotation * 2).toFixed(2);

      setTransform(
        `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`
      );
    },
    [isSupported, maxRotation, perspective, translateZ]
  );

  const handleMouseEnter = useCallback(() => {
    if (!isSupported) return;
    setIsHovered(true);
  }, [isSupported]);

  const handleMouseLeave = useCallback(() => {
    if (!isSupported) return;
    setIsHovered(false);
    // Smooth return to neutral
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) translateZ(0px)`);
  }, [isSupported, perspective]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transform: isSupported ? transform : undefined,
        transformStyle: 'preserve-3d',
        transition: isHovered
          ? 'transform 0.08s ease-out'
          : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: isHovered ? 'transform' : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default Tilt3D;
