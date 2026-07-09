'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Lightbulb, X, ChevronRight, Sparkles } from 'lucide-react';

const GUIDE_KEY_PREFIX = 'verdict_guide_dismissed_';

interface GuideTipProps {
  /** Unique key used for localStorage persistence */
  id: string;
  /** Tip title */
  title: string;
  /** Tip body text */
  children: ReactNode;
  /** Where to position: 'top' | 'inline' */
  variant?: 'card' | 'inline';
  /** Show an arrow/CTA at the end */
  ctaText?: string;
  /** Optional click handler for CTA */
  onCtaClick?: () => void;
  /** Force show even if dismissed */
  forceShow?: boolean;
  /** Additional className */
  className?: string;
}

export function GuideTip({
  id,
  title,
  children,
  variant = 'card',
  ctaText,
  onCtaClick,
  forceShow = false,
  className = '',
}: GuideTipProps) {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const storageKey = GUIDE_KEY_PREFIX + id;
    const wasDismissed = localStorage.getItem(storageKey) === 'true';
    if (forceShow || !wasDismissed) {
      setVisible(true);
    }
  }, [id, forceShow]);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    localStorage.setItem(GUIDE_KEY_PREFIX + id, 'true');
  };

  if (!visible || dismissed) return null;

  if (variant === 'inline') {
    return (
      <div
        className={`group relative flex items-start gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500/8 via-pink-500/5 to-transparent border border-violet-600/20 transition-all duration-300 ${className}`}
      >
        <Sparkles className="size-4 text-violet-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-violet-300 uppercase tracking-wider">{title}</p>
          <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{children}</p>
          {ctaText && onCtaClick && (
            <button
              type="button"
              onClick={onCtaClick}
              className="flex items-center gap-1 mt-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              {ctaText}
              <ChevronRight className="size-3" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 -m-1 text-zinc-500 hover:text-zinc-300 shrink-0"
        >
          <X className="size-3.5" />
        </button>
      </div>
    );
  }

  // Card variant
  return (
    <div
      className={`group relative rounded-2xl overflow-hidden border border-violet-600/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-violet-950/10 ${className}`}
    >
      {/* Shimmer accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

      <div className="p-5 flex gap-4">
        {/* Icon */}
        <div className="shrink-0">
          <div className="size-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/10 border border-violet-600/20 flex items-center justify-center">
            <Lightbulb className="size-5 text-violet-400" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-sm font-bold text-violet-300">{title}</h3>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-500/60 bg-violet-500/10 px-2 py-0.5 rounded-full">
              Newbie Tip
            </span>
          </div>
          <div className="text-sm text-zinc-400 leading-relaxed">
            {children}
          </div>
          {ctaText && onCtaClick && (
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-lg bg-violet-500/10 border border-violet-600/30 text-xs font-bold text-violet-400 hover:bg-violet-500/20 hover:border-violet-500/50 transition-all"
            >
              {ctaText}
              <ChevronRight className="size-3.5" />
            </button>
          )}
        </div>

        {/* Dismiss */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-500 hover:text-zinc-200 rounded-md hover:bg-zinc-800"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}


/**
 * A full-page onboarding welcome modal shown only on first visit.
 */
export function WelcomeOnboarding({ onDismiss }: { onDismiss: () => void }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(GUIDE_KEY_PREFIX + 'welcome_onboarding');
    if (!seen) setVisible(true);
  }, []);

  const handleFinish = () => {
    setVisible(false);
    localStorage.setItem(GUIDE_KEY_PREFIX + 'welcome_onboarding', 'true');
    onDismiss();
  };

  const STEPS = [
    {
      icon: Flame,
      title: 'Welcome to Verdict',
      body: 'The ultimate arena for debating anime, movies, cartoons, and games. Pick a side, drop your hottest takes, and let the AI Judge decide who wins.',
      accent: 'from-pink-500 to-violet-500',
    },
    {
      icon: Swords,
      title: 'Join Debates',
      body: 'Browse categories like Anime, Movies, or Games. Pick a battle, choose your side (Team A or Team B), and argue why your side wins. The chat is live — bring your A-game.',
      accent: 'from-cyan-500 to-pink-500',
    },
    {
      icon: Scale,
      title: 'Get Scored by AI',
      body: 'An AI Judge evaluates every debate on Creativity, Humor, and Wit. Win to earn Aura and climb the ranks. Lose and watch your Aura slip.',
      accent: 'from-violet-500 to-cyan-500',
    },
    {
      icon: Trophy,
      title: 'Climb the Ranks',
      body: 'Complete Daily Quests, unlock Aura from the Marketplace, form Crews with friends, and fight your way to the top of the Leaderboard. Are you legendary material?',
      accent: 'from-violet-500 to-pink-500',
    },
  ];

  if (!visible) return null;

  const current = STEPS[step];
  const IconComp = current.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        {/* Top accent bar */}
        <div className={`h-1 bg-gradient-to-r ${current.accent}`} />

        <div className="p-8 text-center">
          {/* Icon */}
          <div className={`mx-auto size-16 rounded-2xl bg-gradient-to-br ${current.accent} p-[1px] mb-6`}>
            <div className="w-full h-full rounded-2xl bg-zinc-900 flex items-center justify-center">
              <IconComp className="size-7 text-zinc-100" />
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-1.5 mb-6">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-gradient-to-r ' + STEPS[i].accent : i < step ? 'w-4 bg-zinc-600' : 'w-4 bg-zinc-800'
                }`}
              />
            ))}
          </div>

          <h2 className="text-2xl font-black text-zinc-100 mb-3">{current.title}</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">{current.body}</p>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              className={`px-6 py-2.5 rounded-xl bg-gradient-to-r ${current.accent} text-white text-sm font-bold hover:opacity-90 transition-opacity`}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-violet-500 text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-pink-600/25"
            >
              Let&apos;s Debate!
            </button>
          )}
        </div>

        {/* Skip */}
        {step < STEPS.length - 1 && (
          <button
            type="button"
            onClick={handleFinish}
            className="absolute bottom-8 right-8 -mb-16 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Skip tour
          </button>
        )}
      </div>
    </div>
  );
}

import { Flame, Swords, Scale, Trophy } from 'lucide-react';