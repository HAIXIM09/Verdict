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
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Exit animation
    setExiting(true);

    const exitTimer = setTimeout(() => {
      setMounted(false);
      setExiting(false);

      // Enter animation
      const enterTimer = setTimeout(() => {
        setMounted(true);
      }, 50);
      return () => clearTimeout(enterTimer);
    }, 200);

    return () => clearTimeout(exitTimer);
  }, [pageKey]);

  return (
    <div
      className={`${className}`}
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.99)',
        filter: mounted ? 'blur(0)' : 'blur(6px)',
        transition: exiting
          ? 'all 0.2s cubic-bezier(0.4, 0, 1, 1)'
          : 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  );
}