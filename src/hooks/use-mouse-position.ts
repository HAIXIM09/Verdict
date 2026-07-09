'use client';

import { useState, useEffect, useCallback, type MouseEvent } from 'react';

interface MousePosition {
  x: number;
  y: number;
  /** Normalized -1 to 1 relative to element center */
  normalizedX: number;
  normalizedY: number;
  /** Is mouse currently over the element */
  isOver: boolean;
}

/**
 * Track mouse position relative to an element, with normalized coordinates.
 * Used for tilt effects, cursor glow positioning, and magnetic interactions.
 */
export function useMousePosition(ref: React.RefObject<HTMLElement | null>) {
  const [pos, setPos] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    isOver: false,
  });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      setPos({
        x,
        y,
        normalizedX: (x - centerX) / centerX,
        normalizedY: (y - centerY) / centerY,
        isOver: true,
      });
    },
    [ref],
  );

  const handleMouseLeave = useCallback(() => {
    setPos(prev => ({ ...prev, isOver: false }));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove as unknown as EventListener);
    el.addEventListener('mouseleave', handleMouseLeave as unknown as EventListener);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove as unknown as EventListener);
      el.removeEventListener('mouseleave', handleMouseLeave as unknown as EventListener);
    };
  }, [ref, handleMouseMove, handleMouseLeave]);

  return pos;
}

/**
 * Track global mouse position (page-level). Used for cursor glow.
 */
export function useGlobalMouse() {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handler = (e: globalThis.MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    // Use passive listener for performance
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return pos;
}