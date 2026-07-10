'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface ScreenFlashProps {
  children: ReactNode;
  /** Trigger flash when this value changes to true */
  trigger: boolean;
  /** Flash color (default: red) */
  color?: string;
  /** Flash duration in ms (default: 600) */
  duration?: number;
}

/**
 * A full-screen flash effect that fires once when `trigger` becomes true.
 * Used for dramatic moments (verdict reveal, battle start).
 */
export function ScreenFlash({
  children,
  trigger,
  color = 'rgba(220, 38, 38, 0.15)',
  duration = 600,
}: ScreenFlashProps) {
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setFlashing(true);
    const t = setTimeout(() => setFlashing(false), duration);
    return () => clearTimeout(t);
  }, [trigger, duration]);

  return (
    <div className="relative">
      {children}
      {flashing && (
        <div
          className="fixed inset-0 z-[60] pointer-events-none animate-[screenFlash_600ms_ease-out_forwards]"
          style={{ backgroundColor: color }}
        />
      )}
    </div>
  );
}