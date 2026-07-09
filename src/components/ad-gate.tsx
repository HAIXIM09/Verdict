'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface AdGateProps {
  onAdComplete: () => void;
  onSkip: () => void;
}

export default function AdGate({ onAdComplete, onSkip }: AdGateProps) {
  const [countdown, setCountdown] = useState(5);
  const [adProgress, setAdProgress] = useState(0);

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
    <div className="fixed inset-0 z-50 bg-[#09090b]/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-800 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Watch to Continue</h2>
          <p className="text-zinc-400 text-sm mt-1">Support the arena while waiting</p>
        </div>

        {/* Fake Ad Placeholder */}
        <div className="bg-zinc-800 rounded-lg p-8 flex flex-col items-center justify-center min-h-[180px]">
          <p className="text-zinc-500 text-sm font-medium">Advertisement</p>
          <div className="w-full bg-zinc-800 rounded-full h-2 mt-4 overflow-hidden">
            <div
              className="bg-red-600 h-full transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${adProgress}%` }}
            />
          </div>
          <p className="text-zinc-500 text-xs mt-2">
            {adFinished ? 'Ad complete' : `${Math.round(adProgress)}%`}
          </p>
        </div>

        {/* Timer Text */}
        {!canSkip && (
          <p className="text-center text-zinc-400 text-sm">
            You can skip in {countdown}s...
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            className={`w-full h-11 text-base font-semibold ${
              canSkip
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
            disabled={!canSkip}
            onClick={onAdComplete}
          >
            Continue to Roast Arena
          </Button>

          <Button
            variant="ghost"
            className={`w-full text-sm ${
              canSkip
                ? 'text-zinc-400 hover:text-zinc-200'
                : 'text-zinc-700 cursor-not-allowed'
            }`}
            disabled={!canSkip}
            onClick={onSkip}
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}