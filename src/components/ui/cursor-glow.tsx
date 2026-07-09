'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useGlobalMouse } from '@/hooks/use-mouse-position';

/**
 * A full-screen cursor-following glow that adds ambient depth.
 * Renders a large soft radial gradient at the cursor position.
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const mouse = useGlobalMouse();

  // Use rAF for smooth cursor tracking without layout thrashing
  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    let rafId: number;
    const update = () => {
      el.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [mouse.x, mouse.y]);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      aria-hidden="true"
    >
      {/* Inner bright core */}
      <div className="absolute -top-[150px] -left-[150px] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.07)_0%,rgba(220,38,38,0.03)_30%,transparent_70%)]" />
      {/* Outer soft halo */}
      <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(234,88,12,0.03)_0%,transparent_60%)]" />
    </div>
  );
}