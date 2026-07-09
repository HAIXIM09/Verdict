'use client';

import { useRef, useState, useMemo, type ReactNode, type MouseEvent } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees (default: 8) */
  maxTilt?: number;
  /** Enable light reflection shine (default: true) */
  shine?: boolean;
  /** Enable border glow on hover (default: true) */
  glow?: boolean;
  /** Glow color (default: rgba(220,38,38,...)) */
  glowColor?: string;
  /** Scale on hover (default: 1.02) */
  hoverScale?: number;
}

/**
 * Premium 3D tilt card with:
 * - Perspective-based 3D rotation following cursor
 * - Light reflection shine overlay
 * - Subtle border glow on hover
 * - Spring-physics return on mouse leave
 * - GPU-accelerated transforms
 */
export function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  shine = true,
  glow = true,
  glowColor = 'rgba(220, 38, 38, 0.4)',
  hoverScale = 1.02,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ rx: 0, ry: 0 });
  const currentRef = useRef({ rx: 0, ry: 0, scale: 1 });
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [shinePos, setShinePos] = useState<React.CSSProperties>({ opacity: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const glowShadow = useMemo(() => {
    const r = /[\d.]+\)$/;
    const s1 = glowColor.replace(r, '0.15)');
    const s2 = glowColor.replace(r, '0.08)');
    const s3 = glowColor.replace(r, '0.04)');
    return `0 0 0 1px ${s1}, 0 8px 32px ${s2}, 0 0 60px ${s3}`;
  }, [glowColor]);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  function animate() {
    const target = targetRef.current;
    const current = currentRef.current;
    current.rx = lerp(current.rx, target.rx, 0.12);
    current.ry = lerp(current.ry, target.ry, 0.12);
    current.scale = lerp(current.scale, target.scale, 0.12);

    setStyle({
      transform: `perspective(1000px) rotateX(${current.rx}deg) rotateY(${current.ry}deg) scale3d(${current.scale}, ${current.scale}, ${current.scale})`,
      transition: 'none',
      transformStyle: 'preserve-3d',
    });

    // Continue animating if not at rest
    const isResting =
      Math.abs(current.rx - target.rx) < 0.01 &&
      Math.abs(current.ry - target.ry) < 0.01 &&
      Math.abs(current.scale - target.scale) < 0.001;

    if (!isResting) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    targetRef.current = {
      rx: ((y - centerY) / centerY) * -maxTilt,
      ry: ((x - centerX) / centerX) * maxTilt,
      scale: hoverScale,
    };

    if (shine) {
      setShinePos({
        opacity: 1,
        background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.08) 0%, transparent 60%)`,
        transition: 'opacity 0.2s ease',
      });
    }

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  }

  function handleMouseLeave() {
    targetRef.current = { rx: 0, ry: 0, scale: 1 };
    setShinePos({ opacity: 0, transition: 'opacity 0.4s ease' });
    setIsHovering(false);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  }

  function handleMouseEnter() {
    setIsHovering(true);
  }

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-[inherit] ${className}`}
      style={{
        ...style,
        boxShadow: isHovering && glow ? glowShadow : 'none',
        transition: style.transition || 'box-shadow 0.4s ease',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {shine && (
        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-[inherit]"
          style={shinePos}
        />
      )}
      {children}
    </div>
  );
}