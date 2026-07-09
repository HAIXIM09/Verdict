'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  /** Unique key to re-trigger animation on page change */
  pageKey: string;
  className?: string;
}

export function PageTransition({ children, pageKey, className = '' }: PageTransitionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(false);
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setMounted(true));
    });
    return () => cancelAnimationFrame(t);
  }, [pageKey]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${className}`}
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        filter: mounted ? 'blur(0)' : 'blur(4px)',
      }}
    >
      {children}
    </div>
  );
}