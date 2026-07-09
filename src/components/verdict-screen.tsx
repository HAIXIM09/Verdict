'use client';

import { useEffect, useRef, useState } from 'react';
import { Scale, Trophy, Flame, TrendingUp, Coins, ArrowUpRight, Swords, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TiltCard } from '@/components/ui/tilt-card';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { mockBattles, mockCurrentUser } from '@/lib/mock-data';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface VerdictScreenProps {
  onContinue: () => void;
  onAppeal: () => void;
}

export default function VerdictScreen({ onContinue, onAppeal }: VerdictScreenProps) {
  const battle = mockBattles.find(b => b.aiVerdict !== null) || mockBattles[2];
  const roast = battle.aiVerdict;
  const [showContent, setShowContent] = useState(false);
  const [flashTrigger, setFlashTrigger] = useState(false);

  const scoreA = roast?.scoreA ?? 7;
  const scoreB = roast?.scoreB ?? 3;
  const totalScore = scoreA + scoreB;
  const pctA = totalScore > 0 ? (scoreA / totalScore) * 100 : 50;
  const pctB = totalScore > 0 ? (scoreB / totalScore) * 100 : 50;

  const winnerSide = roast?.winner === 'A' ? battle.sideA : battle.sideB;
  const coinsEarned = roast?.coinsAwarded ?? 250;
  const auraGained = roast?.auraChange?.gained ?? 120;

  // Trigger screen flash on mount
  useEffect(() => {
    const t = setTimeout(() => {
      setFlashTrigger(true);
      setShowContent(true);
    }, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Screen flash overlay */}
      {flashTrigger && (
        <div
          className="fixed inset-0 z-[60] pointer-events-none"
          style={{
            backgroundColor: 'rgba(220, 38, 38, 0.12)',
            animation: 'screenFlash 600ms ease-out forwards',
          }}
        />
      )}

      {/* Background effects */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 noise-overlay" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-red-600/8 rounded-full blur-[120px] orb-1" />
      <div className="absolute bottom-20 right-1/4 w-[350px] h-[350px] bg-amber-500/6 rounded-full blur-[100px] orb-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-600/5 rounded-full blur-[80px]" />

      {/* Scanline */}
      <div className="scanline-overlay absolute inset-0 z-[1]" />

      {/* Content */}
      <div
        className="w-full max-w-lg space-y-6 relative z-10"
        style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* ═══ VERDICT Header ═══ */}
        <div
          className="text-center"
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'scale(1)' : 'scale(0.9)',
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}
        >
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-red-600/10 border border-red-600/20 mb-3">
            <Scale className="size-7 text-red-400" />
          </div>
          <h1 className="text-5xl font-black font-heading text-red-400 tracking-[0.15em] text-shimmer drop-shadow-[0_0_40px_rgba(239,68,68,0.35)]">
            VERDICT
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            {battle.sideA} <Swords className="size-3.5 inline text-red-500 mx-1.5" /> {battle.sideB}
          </p>
        </div>

        {/* ═══ Winner Announcement ═══ */}
        <div
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}
        >
          <TiltCard className="rounded-2xl" glowColor="rgba(234, 88, 12, 0.4)">
            <Card className="bg-zinc-900/80 border-zinc-800/40 rounded-2xl overflow-hidden premium-glow gradient-border">
              <CardContent className="p-6 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-600/[0.04] to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <Trophy className="size-10 text-amber-400 mx-auto mb-3 animate-float drop-shadow-[0_0_16px_rgba(245,158,11,0.3)]" />
                  <h2 className="text-2xl font-bold text-white">
                    Team {winnerSide}
                  </h2>
                  <p className="text-red-400 font-heading text-sm tracking-widest mt-1 uppercase">
                    Destroyed the Opposition
                  </p>
                </div>
              </CardContent>
            </Card>
          </TiltCard>
        </div>

        {/* ═══ Score Bar ═══ */}
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
                <span className="text-sm font-medium text-zinc-300">Team {battle.sideA}</span>
                <span className="text-sm font-medium text-zinc-300">Team {battle.sideB}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden bg-zinc-800/80 flex shadow-inner">
                <div
                  className="bg-gradient-to-r from-red-600 to-red-500 rounded-l-full transition-all duration-[1.5s] ease-out relative overflow-hidden"
                  style={{ width: `${pctA}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ animation: 'skeleton-shimmer 2s ease-in-out infinite' }} />
                </div>
                <div
                  className="bg-gradient-to-r from-[#4D7C0F] to-[#65a30d] rounded-r-full transition-all duration-[1.5s] ease-out"
                  style={{ width: `${pctB}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-3xl font-bold text-red-400 font-mono-stat">
                  <AnimatedCounter target={scoreA} duration={1000} />
                </span>
                <span className="text-zinc-600 text-xs font-heading uppercase tracking-widest">points</span>
                <span className="text-3xl font-bold text-[#65a30d] font-mono-stat">
                  <AnimatedCounter target={scoreB} duration={1000} />
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ═══ AI Roastmaster Breakdown ═══ */}
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
                <Sparkles className="size-4 text-red-400" />
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.15em] font-heading">The Roastmaster&apos;s Ruling</h3>
              </div>

              {/* Best Argument */}
              {roast?.bestArgument && (
                <div>
                  <p className="text-[11px] text-zinc-600 uppercase tracking-wider font-bold mb-1.5">Lethal Shot</p>
                  <div className="bg-zinc-800/50 rounded-xl p-3.5 border-l-[3px] border-l-red-500 shadow-[inset_0_0_20px_rgba(220,38,38,0.03)]">
                    <p className="text-sm font-medium text-white mb-1">
                      {roast.bestArgument.username}
                    </p>
                    <p className="text-xs text-zinc-400 italic leading-relaxed">
                      &ldquo;{roast.bestArgument.text}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* Most Roasted */}
              {roast?.mostRoasted && (
                <div>
                  <p className="text-[11px] text-zinc-600 uppercase tracking-wider font-bold mb-1.5">Biggest Casualty</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {roast.mostRoasted.username}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-red-400">
                      <Flame className="size-3" />
                      {roast.mostRoasted.roastCount} roasts
                    </span>
                  </div>
                </div>
              )}

              {/* AI Summary */}
              <div>
                <p className="text-[11px] text-zinc-600 uppercase tracking-wider font-bold mb-1.5">Final Word</p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {roast?.summary ||
                    'Team Pushpa won through superior cultural impact arguments and iconic dialogue references. The AI Roastmaster found their emotional appeal and mass-market penetration evidence more compelling.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ═══ Rewards ═══ */}
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
                <TiltCard className="rounded-xl" maxTilt={4} glowColor="rgba(245, 158, 11, 0.3)">
                  <div className="bg-zinc-800/40 border border-zinc-800/40 rounded-xl p-4 text-center h-full">
                    <div className="flex items-center justify-center gap-1 text-amber-400">
                      <Coins className="size-4" />
                      <span className="text-xl font-bold font-mono-stat">
                        <AnimatedCounter target={coinsEarned} duration={800} formatFn={(n) => '+' + n} />
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1 uppercase tracking-wider">Loot Claimed</p>
                  </div>
                </TiltCard>

                <TiltCard className="rounded-xl" maxTilt={4} glowColor="rgba(239, 68, 68, 0.3)">
                  <div className="bg-zinc-800/40 border border-zinc-800/40 rounded-xl p-4 text-center h-full">
                    <div className="flex items-center justify-center gap-1 text-red-400">
                      <TrendingUp className="size-4" />
                      <ArrowUpRight className="size-3.5" />
                      <span className="text-xl font-bold font-mono-stat">
                        <AnimatedCounter target={auraGained} duration={800} formatFn={(n) => '+' + n} />
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1 uppercase tracking-wider">Aura Scorched</p>
                  </div>
                </TiltCard>
              </div>

              <div className="bg-zinc-800/30 rounded-xl p-3.5 flex items-center justify-between border border-zinc-800/30">
                <span className="text-sm text-zinc-400">Streak</span>
                <span className="text-sm font-bold text-white font-mono-stat">
                  {mockCurrentUser.streak} wins <Flame className="size-3.5 inline text-red-400 ml-1" />
                </span>
              </div>

              <MagneticButton
                className="w-full btn-fire btn-press h-12 text-base font-semibold rounded-xl cursor-pointer"
                strength={0.15}
                onClick={onContinue}
              >
                <Coins className="size-4 mr-2" />
                Claim Rewards
              </MagneticButton>
            </CardContent>
          </Card>
        </div>

        {/* ═══ Appeal ═══ */}
        <div
          className="text-center pt-2 pb-4"
          style={{
            opacity: showContent ? 1 : 0,
            transition: 'opacity 0.5s ease 1s',
          }}
        >
          <p className="text-zinc-600 text-xs mb-2">
            Think the Roastmaster was blind? Take it to the people.
          </p>
          <button
            type="button"
            className="text-zinc-500 hover:text-zinc-200 text-xs transition-colors duration-300 hover:underline underline-offset-2"
            onClick={onAppeal}
          >
            Appeal to the Council
          </button>
        </div>
      </div>
    </div>
  );
}