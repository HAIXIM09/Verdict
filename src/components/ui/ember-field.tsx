'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';

interface Ember {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  life: number;
  maxLife: number;
  hue: number;
}

interface EmberFieldProps {
  /** Number of particles (default: 30) */
  count?: number;
  /** Particle area height (default: 100vh) */
  height?: string;
  /** Extra className */
  className?: string;
}

/**
 * Floating ember/spark particles that drift upward.
 * Pure canvas for 60fps performance. Respects prefers-reduced-motion.
 */
export function EmberField({ count = 30, height = '100vh', className = '' }: EmberFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const embersRef = useRef<Ember[]>([]);
  const rafRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const initEmbers = useCallback((width: number, h: number) => {
    embersRef.current = Array.from({ length: count }, () =>
      createEmber(width, h),
    );
  }, [count]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Check reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      if (embersRef.current.length === 0) {
        initEmbers(rect.width, rect.height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      embersRef.current.forEach((e) => {
        e.x += e.speedX;
        e.y += e.speedY;
        e.life++;

        const lifeRatio = e.life / e.maxLife;
        // Fade in then out
        const alpha = lifeRatio < 0.1
          ? e.opacity * (lifeRatio / 0.1)
          : lifeRatio > 0.7
            ? e.opacity * (1 - (lifeRatio - 0.7) / 0.3)
            : e.opacity;

        // Gentle horizontal wobble
        e.speedX += (Math.random() - 0.5) * 0.02;
        e.speedX *= 0.99;

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 90%, 55%, ${alpha})`;
        ctx.fill();

        // Glow effect for larger embers
        if (e.size > 1.5) {
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${e.hue}, 90%, 55%, ${alpha * 0.1})`;
          ctx.fill();
        }

        // Reset ember if it's dead or off-screen
        if (e.life >= e.maxLife || e.y < -20 || e.x < -20 || e.x > w + 20) {
          Object.assign(e, createEmber(w, h));
          e.y = h + 10;
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [count, initEmbers]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

function createEmber(width: number, height: number): Ember {
  return {
    x: Math.random() * width,
    y: height * 0.3 + Math.random() * height * 0.7,
    size: 0.5 + Math.random() * 2,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: -(0.2 + Math.random() * 0.6),
    opacity: 0.2 + Math.random() * 0.5,
    life: Math.floor(Math.random() * 200),
    maxLife: 200 + Math.floor(Math.random() * 300),
    hue: Math.random() > 0.6 ? 35 + Math.random() * 15 : 0 + Math.random() * 15, // amber or red
  };
}