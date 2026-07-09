'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook that calls back when an element enters/exits the viewport.
 * Uses IntersectionObserver for performance.
 */
export function useInView(
  options: IntersectionObserverInit = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    const inView = entry.isIntersecting;
    setIsInView(inView);
    if (inView) setHasBeenInView(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect, options]);

  return { ref, isInView, hasBeenInView };
}