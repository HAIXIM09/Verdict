'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { useInView } from '@/hooks/use-in-view';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Animation delay (seconds) */
  delay?: number;
  /** Which direction to slide from */
  direction?: 'up' | 'left' | 'right' | 'none';
  /** Distance in px to travel (default: 24) */
  distance?: number;
  /** Duration in seconds (default: 0.6) */
  duration?: number;
  /** Only animate once (default: true) */
  once?: boolean;
}

/**
 * Wraps children and reveals them with a smooth animation when they scroll into view.
 * Uses IntersectionObserver for performance.
 */
export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 24,
  duration = 0.6,
  once = true,
}: ScrollRevealProps) {
  const { ref, isInView, hasBeenInView } = useInView({ threshold: 0.1 });

  const shouldShow = once ? hasBeenInView : isInView;

  const translateMap = {
    up: `translateY(${distance}px)`,
    left: `translateX(${distance}px)`,
    right: `translateX(-${distance}px)`,
    none: 'none',
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shouldShow ? 1 : 0,
        transform: shouldShow ? 'translateY(0) translateX(0)' : translateMap[direction],
        filter: shouldShow ? 'blur(0)' : 'blur(4px)',
        transition: `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  );
}