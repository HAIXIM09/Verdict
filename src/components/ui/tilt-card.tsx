'use client';

import { useRef, useState, type ReactNode, type MouseEvent } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees */
  maxTilt?: number;
  /** Enable shine effect */
  shine?: boolean;
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 6,
  shine = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [shineStyle, setShineStyle] = useState<React.CSSProperties>({});
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
    );

    if (shine) {
      setShineStyle({
        background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.06) 0%, transparent 60%)`,
      });
    }
  };

  const handleMouseLeave = () => {
    setTransform(
      'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
    );
    setShineStyle({});
    setIsHovering(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        transform,
        transition:
          transform === ''
            ? 'transform 0.5s ease-out'
            : 'transform 0.1s ease-out',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {shine && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-10 transition-opacity duration-300"
          style={{
            opacity: isHovering ? 1 : 0,
            ...shineStyle,
          }}
        />
      )}
      {children}
    </div>
  );
}