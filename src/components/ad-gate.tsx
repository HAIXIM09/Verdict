'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Flame } from 'lucide-react';

interface AdGateProps {
  onAdComplete: () => void;
  onSkip: () => void;
}

export default function AdGate({ onAdComplete, onSkip }: AdGateProps) {
  const [countdown, setCountdown] = useState(5);
  const [adProgress, setAdProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (adProgress >= 100) return;
    const interval = setInterval(() => {
      setAdProgress(prev => Math.min(100, prev + 2));
    }, 100);
    return () => clearInterval(interval);
  }, [adProgress]);

  const canSkip = countdown <= 0;
  const adFinished = adProgress >= 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md" />
      <div className="absolute inset-0 gradient-mesh opacity-50 pointer-events-none" />

      {/* Card */}
      <div
        className="relative w-full max-w-sm rounded-2xl border border-zinc-800/50 bg-zinc-900/90 backdrop-blur-xl p-6 space-y-6 shadow-[0_0_80px_rgba(236,72,153,0.08)]"
        style={{
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bar-gradient rounded-t-2xl" />

        <div className="text-center">
          <div className="inline-flex items-center justify-center size-10 rounded-xl bg-pink-600/10 border border-pink-600/20 mb-3">
            <Flame className="size-5 text-pink-400" />
          </div>
          <h2 className="text-lg font-bold text-white font-heading tracking-wider">WAIT FOR IT</h2>
          <p className="text-zinc-500 text-sm mt-1">The verdict is being prepared...</p>
        </div>

        {/* Fake Ad Placeholder */}
        <div className="bg-zinc-800/40 rounded-xl p-8 flex flex-col items-center justify-center min-h-[160px] border border-zinc-800/30">
          <div className="text-zinc-600 text-xs font-heading uppercase tracking-widest mb-4">Sponsored</div>
          <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bar-gradient transition-all duration-100 ease-linear"
              style={{ width: `${adProgress}%` }}
            />
          </div>
          <p className="text-zinc-600 text-xs mt-3 font-mono-stat">
            {adFinished ? 'Complete' : `${Math.round(adProgress)}%`}
          </p>
        </div>

        {/* Timer */}
        {!canSkip && (
          <div className="flex items-center justify-center gap-2">
            <div className="size-1.5 rounded-full bg-pink-500 animate-pulse" />
            <p className="text-center text-zinc-500 text-sm">
              Skip available in <span className="text-pink-400 font-mono-stat font-bold">{countdown}s</span>
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          <Button
            className={`w-full h-11 text-sm font-bold rounded-xl transition-all duration-300 ${
              canSkip
                ? 'btn-primary'
                : 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed border border-zinc-800/30'
            }`}
            disabled={!canSkip}
            onClick={onAdComplete}
          >
            Continue to Verdict
          </Button>

          <button
            type="button"
            className={`w-full text-sm py-2 rounded-xl transition-all duration-300 ${
              canSkip
                ? 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
                : 'text-zinc-800 cursor-not-allowed'
            }`}
            disabled={!canSkip}
            onClick={onSkip}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}