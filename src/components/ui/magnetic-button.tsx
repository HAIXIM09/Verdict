'use client';

import { useRef, useState, useCallback, type ReactNode, type MouseEvent } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** Pull strength (0-1, default 0.3) */
  strength?: number;
  /** Enable inner content rotation for extra depth */
  enableContentShift?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

/**
 * A button that magnetically pulls toward the cursor on hover.
 * The inner content shifts in the opposite direction for a parallax depth effect.
 */
export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  enableContentShift = true,
  onClick,
  type = 'button',
  disabled = false,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [contentOffset, setContentOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (!btnRef.current || disabled) return;
      const rect = btnRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) * strength;
      const dy = (e.clientY - centerY) * strength;
      setOffset({ x: dx, y: dy });
      if (enableContentShift) {
        setContentOffset({ x: dx * 0.4, y: dy * 0.4 });
      }
    },
    [strength, enableContentShift, disabled],
  );

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    setContentOffset({ x: 0, y: 0 });
  }, []);

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: offset.x === 0 ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.15s ease-out',
      }}
    >
      <span
        style={{
          transform: `translate(${contentOffset.x}px, ${contentOffset.y}px)`,
          transition: contentOffset.x === 0 ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.15s ease-out',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </span>
    </button>
  );
}