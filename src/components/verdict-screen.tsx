'use client';

import { useEffect, useRef, useState } from 'react';
import { Scale, Trophy, Flame, TrendingUp, Coins, ArrowUpRight, Swords, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TiltCard } from '@/components/ui/tilt-card';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface VerdictData {
  battle: {
    id: string;
    topic: string;
    sideA: string;
    sideB: string;
    winner: { id: string; username: string; avatar: string } | null;
  };
  verdict: string;
  auraReward: number;
  coinReward: number;
}

interface VerdictScreenProps {
  onContinue: () => void;
  onAppeal: () => void;
  verdictData?: VerdictData | null;
  userStreak?: number;
}

export default function VerdictScreen({ onContinue, onAppeal, verdictData, userStreak = 0 }: VerdictScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const [flashTrigger, setFlashTrigger] = useState(false);

  if (!verdictData) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <Card className="bg-zinc-900 border border-zinc-800 p-8 text-center max-w-sm w-full relative z-10">
          <CardContent className="flex flex-col items-center gap-4 p-0">
            <div className="size-14 rounded-full bg-zinc-800 flex items-center justify-center">
              <Scale className="size-6 text-zinc-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">No Verdict Available</h2>
              <p className="text-sm text-zinc-500 mt-1">There&apos;s no completed battle to review yet.</p>
            </div>
            <Button className="btn-primary text-white btn-press" onClick={onContinue}>
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const battle = verdictData.battle;
  const winnerName = battle.winner?.username || 'Unknown';
  const winnerSide = battle.winner?.id === battle.winner?.id ? 'Winner' : 'Unknown';

  useEffect(() => {
    const t = setTimeout(() => {
      setFlashTrigger(true);
      setShowContent(true);
    }, 100);
    return () => clearTimeout(t);
  }, []);

  const scoreA = Math.floor(Math.random() * 4) + 5;
  const scoreB = 10 - scoreA;
  const totalScore = scoreA + scoreB;
  const pctA = totalScore > 0 ? (scoreA / totalScore) * 100 : 50;
  const pctB = totalScore > 0 ? (scoreB / totalScore) * 100 : 50;

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {flashTrigger && (
        <div
          className="fixed inset-0 z-[60] pointer-events-none"
          style={{
            backgroundColor: 'rgba(236, 72, 153, 0.12)',
            animation: 'screenFlash 600ms ease-out forwards',
          }}
        />
      )}

      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 noise-overlay" />
      <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-pink-600/8 rounded-full blur-[120px] orb-1" />
      <div className="absolute bottom-20 right-1/4 w-[350px] h-[350px] bg-violet-500/6 rounded-full blur-[100px] orb-2" />

      <div
        className="w-full max-w-lg space-y-6 relative z-10"
        style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* VERDICT Header */}
        <div
          className="text-center"
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'scale(1)' : 'scale(0.9)',
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}
        >
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-pink-600/10 border border-pink-600/20 mb-3">
            <Scale className="size-7 text-pink-400" />
          </div>
          <h1 className="text-5xl font-black font-heading text-pink-400 tracking-[0.15em] text-shimmer drop-shadow-[0_0_40px_rgba(236,72,153,0.35)]">
            VERDICT
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            {battle.sideA} <Swords className="size-3.5 inline text-pink-500 mx-1.5" /> {battle.sideB}
          </p>
        </div>

        {/* Winner Announcement */}
        <div
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}
        >
          <TiltCard className="rounded-2xl" glowColor="rgba(139, 92, 246, 0.4)">
            <Card className="bg-zinc-900/80 border-zinc-800/40 rounded-2xl overflow-hidden premium-glow gradient-border">
              <CardContent className="p-6 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-b from-violet-600/[0.04] to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <Trophy className="size-10 text-violet-400 mx-auto mb-3 animate-float drop-shadow-[0_0_16px_rgba(139,92,246,0.3)]" />
                  <h2 className="text-2xl font-bold text-white">
                    {winnerName}
                  </h2>
                  <p className="text-pink-400 font-heading text-sm tracking-widest mt-1 uppercase">
                    Won the Debate
                  </p>
                </div>
              </CardContent>
            </Card>
          </TiltCard>
        </div>

        {/* Score Bar */}
        <div
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.45s',
          }}
        >
          <Card className="bg-zinc-900/80 border-zinc-800/40 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-zinc-300">{battle.sideA}</span>
                <span className="text-sm font-medium text-zinc-300">{battle.sideB}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden bg-zinc-800/80 flex shadow-inner">
                <div
                  className="bg-gradient-to-r from-pink-600 to-pink-500 rounded-l-full transition-all duration-[1.5s] ease-out relative overflow-hidden"
                  style={{ width: `${pctA}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ animation: 'skeleton-shimmer 2s ease-in-out infinite' }} />
                </div>
                <div
                  className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-r-full transition-all duration-[1.5s] ease-out"
                  style={{ width: `${pctB}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-3xl font-bold text-pink-400 font-mono-stat">
                  <AnimatedCounter target={scoreA} duration={1000} />
                </span>
                <span className="text-zinc-600 text-xs font-heading uppercase tracking-widest">points</span>
                <span className="text-3xl font-bold text-[#A78BFA] font-mono-stat">
                  <AnimatedCounter target={scoreB} duration={1000} />
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Judge Summary */}
        <div
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
          }}
        >
          <Card className="bg-zinc-900/80 border-zinc-800/40 rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-pink-400" />
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.15em] font-heading">The Judge&apos;s Ruling</h3>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{verdictData.verdict}</p>
            </CardContent>
          </Card>
        </div>

        {/* Rewards */}
        <div
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.75s',
          }}
        >
          <Card className="bg-zinc-900/80 border-zinc-800/40 rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xs font-semibold font-heading text-zinc-400 uppercase tracking-[0.15em]">Rewards</h3>

              <div className="grid grid-cols-2 gap-3">
                <TiltCard className="rounded-xl" maxTilt={4} glowColor="rgba(139, 92, 246, 0.3)">
                  <div className="bg-zinc-800/40 border border-zinc-800/40 rounded-xl p-4 text-center h-full">
                    <div className="flex items-center justify-center gap-1 text-violet-400">
                      <Coins className="size-4" />
                      <span className="text-xl font-bold font-mono-stat">
                        <AnimatedCounter target={verdictData.coinReward} duration={800} formatFn={(n) => '+' + n} />
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1 uppercase tracking-wider">Coins Earned</p>
                  </div>
                </TiltCard>

                <TiltCard className="rounded-xl" maxTilt={4} glowColor="rgba(236, 72, 153, 0.3)">
                  <div className="bg-zinc-800/40 border border-zinc-800/40 rounded-xl p-4 text-center h-full">
                    <div className="flex items-center justify-center gap-1 text-pink-400">
                      <TrendingUp className="size-4" />
                      <ArrowUpRight className="size-3.5" />
                      <span className="text-xl font-bold font-mono-stat">
                        <AnimatedCounter target={verdictData.auraReward} duration={800} formatFn={(n) => '+' + n} />
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1 uppercase tracking-wider">Aura Gained</p>
                  </div>
                </TiltCard>
              </div>

              <div className="bg-zinc-800/30 rounded-xl p-3.5 flex items-center justify-between border border-zinc-800/30">
                <span className="text-sm text-zinc-400">Streak</span>
                <span className="text-sm font-bold text-white font-mono-stat">
                  {userStreak} wins <Flame className="size-3.5 inline text-pink-400 ml-1" />
                </span>
              </div>

              <MagneticButton
                className="w-full btn-primary btn-press h-12 text-base font-semibold rounded-xl cursor-pointer"
                strength={0.15}
                onClick={onContinue}
              >
                <Coins className="size-4 mr-2" />
                Claim Rewards
              </MagneticButton>
            </CardContent>
          </Card>
        </div>

        {/* Appeal */}
        <div
          className="text-center pt-2 pb-4"
          style={{
            opacity: showContent ? 1 : 0,
            transition: 'opacity 0.5s ease 1s',
          }}
        >
          <p className="text-zinc-600 text-xs mb-2">
            Disagree with the call? Take it to the people.
          </p>
          <button
            type="button"
            className="text-zinc-500 hover:text-zinc-200 text-xs transition-colors duration-300 hover:underline underline-offset-2"
            onClick={onAppeal}
          >
            Request a Review
          </button>
        </div>
      </div>
    </div>
  );
}