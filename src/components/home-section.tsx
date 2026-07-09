'use client';

import { Eye, Flame, Zap, ChevronRight, FlameKindling, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SplineScene } from '@/components/ui/spline';
import { Spotlight } from '@/components/ui/spotlight';
import { TiltCard } from '@/components/ui/tilt-card';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { GuideTip } from '@/components/newbie-guide';
import {
  mockBattles,
  mockQuests,
  mockCurrentUser,
  type BattleCase,
} from '@/lib/mock-data';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface HomeSectionProps {
  onNavigateToRoast: (roastId: string) => void;
  onNavigateToCategory: (category: string) => void;
  onNavigateToQuests: () => void;
}

function difficultyBadgeStyle(d: string): string {
  switch (d) {
    case 'Bronze': return 'text-zinc-500 border-zinc-600/40 bg-zinc-800/50';
    case 'Silver': return 'text-zinc-400 border-zinc-600/40 bg-zinc-800/50';
    case 'Gold': return 'text-amber-400 border-amber-600/30 bg-amber-950/20';
    case 'Platinum': return 'text-red-400 border-red-600/30 bg-red-950/20';
    default: return 'text-zinc-500 border-zinc-600/40 bg-zinc-800/50';
  }
}

function statusBadge(s: string) {
  switch (s) {
    case 'live':
      return <Badge className="bg-red-500/12 text-red-400 border-red-800/40 text-[10px] font-bold uppercase tracking-wider animate-pulse">Live</Badge>;
    case 'waiting':
      return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-800/40 text-[10px]">Waiting</Badge>;
    case 'verdict':
      return <Badge className="bg-amber-600/10 text-amber-400 border-amber-700/40 text-[10px]">Scoring</Badge>;
    case 'finished':
      return <Badge className="bg-zinc-800/50 text-zinc-500 border-zinc-800/50 text-[10px]">Done</Badge>;
    default:
      return null;
  }
}

export default function HomeSection({ onNavigateToRoast: onNavigateToBattle, onNavigateToCategory, onNavigateToQuests }: HomeSectionProps) {
  const liveRoasts = mockBattles.filter(b => b.status === 'live').slice(0, 4);
  const trendingRoasts = [...mockBattles]
    .filter(b => b.status === 'live' || b.status === 'waiting')
    .sort((a, b) => b.viewers - a.viewers)
    .slice(0, 8);

  const topRoast: BattleCase | undefined = mockBattles.find(b => b.status === 'finished');

  return (
    <div className="space-y-10">
      {/* ═══ Hero Banner ═══ */}
      <section className="relative w-full h-[420px] md:h-[500px] rounded-2xl overflow-hidden group">
        {/* Dark base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0505] via-[#120808] to-[#070708]" />

        {/* Scanline */}
        <div className="scanline-overlay absolute inset-0 z-[2]" />

        {/* Animated orbs */}
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] orb-1" />
        <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-amber-500/8 rounded-full blur-[80px] orb-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-600/6 rounded-full blur-[60px] orb-1" />

        {/* Noise */}
        <div className="absolute inset-0 noise-overlay" />

        {/* Spotlight */}
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#DC2626" />

        {/* Burn bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px burn-gradient z-10" />

        {/* Content */}
        <div className="flex h-full">
          {/* Left content */}
          <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="size-2 rounded-full bg-red-500 animate-flicker shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-400/80 text-shimmer">
                Live Roasts Happening Now
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-heading bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-amber-300 to-red-400 leading-[0.95] drop-shadow-[0_0_40px_rgba(239,68,68,0.25)]">
              Drop Your<br />Hottest Takes
            </h1>
            <p className="mt-5 text-zinc-500 max-w-md text-sm md:text-base leading-relaxed">
              Roast anime, movies, games & more. Get scored on creativity, humor, and savagery. Climb the ranks. Become a legend.
            </p>
            <div className="flex items-center gap-3 mt-8">
              <MagneticButton
                className="btn-fire btn-press text-white font-bold rounded-xl px-6 py-3 text-sm cursor-pointer"
                strength={0.25}
                onClick={() => onNavigateToCategory('Movies')}
              >
                <Flame className="size-4 mr-2" />
                Start a Fire
              </MagneticButton>
              <MagneticButton
                className="border border-zinc-700/50 text-zinc-400 hover:bg-white/[0.04] hover:text-white hover:border-zinc-600 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-300 cursor-pointer bg-transparent"
                strength={0.2}
                onClick={onNavigateToQuests}
              >
                <Zap className="size-4 mr-2" />
                Earn Burn Credits
              </MagneticButton>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-10">
              {[
                { value: 12400, format: (n: number) => (n / 1000).toFixed(1) + 'K', label: 'Active Roasters' },
                { value: 847, format: null, label: 'Live Roasts' },
                { value: 2100000, format: (n: number) => (n / 1000000).toFixed(1) + 'M', label: 'Total Burns' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-2xl font-black text-white font-mono-stat stat-fire">
                    <AnimatedCounter target={stat.value} formatFn={stat.format || undefined} />
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600 font-heading mt-0.5">{stat.label}</p>
                </div>
              ))}
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-8 w-px bg-zinc-800/50" />
              ))}
            </div>
          </div>

          {/* Right 3D scene */}
          <div className="flex-1 relative hidden md:block">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Newbie Guide */}
      <ScrollReveal>
        <GuideTip id="home_how_it_works" title="How Verdict Works" variant="card">
          <p className="mb-2"><strong className="text-zinc-200">1. Pick a category</strong> — Anime, Movies, Games, Cartoons, and more.</p>
          <p className="mb-2"><strong className="text-zinc-200">2. Join a Roast Battle</strong> — Choose Team A or Team B and argue why your side is better.</p>
          <p className="mb-2"><strong className="text-zinc-200">3. Get scored</strong> — The AI Roastmaster rates your arguments on Creativity, Humor, and Savagery.</p>
          <p><strong className="text-zinc-200">4. Climb the ranks</strong> — Win battles to earn Aura, complete Daily Quests, and become a legend.</p>
        </GuideTip>
      </ScrollReveal>

      {/* ═══ Scorch of the Day ═══ */}
      <ScrollReveal delay={0.05}>
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-1 h-6 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
            <FlameKindling className="size-5 text-red-500" />
            <h2 className="text-lg font-bold text-zinc-100">Scorch of the Day</h2>
          </div>
          <TiltCard className="rounded-2xl" glowColor="rgba(245, 158, 11, 0.3)">
            <Card className="bg-zinc-900/80 border border-zinc-800/50 rounded-2xl overflow-hidden card-fire-hover relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/[0.04] to-transparent pointer-events-none" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl text-zinc-100">
                      {topRoast ? `${topRoast.sideA} vs ${topRoast.sideB}` : 'Naruto vs Goku'}
                    </CardTitle>
                    <p className="text-zinc-500 text-sm mt-1">
                      {topRoast ? `${topRoast.category} — ${topRoast.difficulty}` : 'Anime — Platinum'}
                    </p>
                  </div>
                  {topRoast?.aiVerdict && (
                    <Badge className="badge-glow-red">
                      Team {topRoast.aiVerdict.winner === 'A' ? topRoast.sideA : topRoast.sideB} Destroyed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {topRoast?.aiVerdict?.summary ||
                    'Team Naruto absolutely annihilated Team Goku with emotional depth arguments that hit harder than a Rasengan. The AI Roastmaster scored it decisively — power levels don\'t equal character development.'}
                </p>
                <MagneticButton
                  className="btn-press mt-4 border-red-700/40 text-red-400 hover:bg-red-950/20 hover:text-red-300 hover:border-red-600/40 rounded-xl px-4 py-2 text-sm bg-transparent border cursor-pointer transition-all duration-300"
                  strength={0.15}
                  onClick={() => onNavigateToBattle(topRoast?.id || 'b-3')}
                >
                  <Eye className="size-4 mr-2" />
                  Watch Full Roast
                </MagneticButton>
              </CardContent>
            </Card>
          </TiltCard>
        </section>
      </ScrollReveal>

      {/* Newbie Guide — Roast of the Day */}
      <ScrollReveal delay={0.1}>
        <GuideTip id="home_roast_of_day" title="Pro Tip" variant="inline">
          This is today&apos;s hottest roast — voted by the community. Watch the replay to learn what makes a winning argument before you jump into your own battles.
        </GuideTip>
      </ScrollReveal>

      {/* ═══ Inferno Live ═══ */}
      <ScrollReveal delay={0.05}>
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-1 h-6 bg-red-600 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
            <h2 className="text-lg font-bold text-zinc-100">Inferno Live</h2>
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60 animate-ping" />
              <span className="relative inline-flex size-2.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {liveRoasts.map((roast, idx) => (
              <ScrollReveal key={roast.id} delay={idx * 0.05}>
                <TiltCard className="rounded-xl" maxTilt={6} glowColor="rgba(239, 68, 68, 0.3)">
                  <Card
                    className="bg-zinc-900/80 border border-zinc-800/50 rounded-xl overflow-hidden cursor-pointer group card-fire-hover h-full"
                    onClick={() => onNavigateToBattle(roast.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge className="bg-white/[0.04] text-zinc-400 border-zinc-800/50 text-[10px]">
                          {roast.category}
                        </Badge>
                        {statusBadge(roast.status)}
                      </div>
                      <h3 className="font-bold text-zinc-100 text-sm mt-2 group-hover:text-red-400 transition-colors duration-300">
                        {roast.sideA} vs {roast.sideB}
                      </h3>
                      <p className="text-zinc-600 text-xs mt-1">
                        {roast.teamA.filter(Boolean).length + roast.teamB.filter(Boolean).length}/10 roasters
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="flex items-center gap-1 text-zinc-500 text-xs">
                          <Eye className="size-3.5" />
                          {roast.viewers}
                        </span>
                        <Button size="sm" className="btn-fire text-white text-[11px] h-7 px-3 rounded-lg">
                          Watch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ═══ Rising Flames ═══ */}
      <ScrollReveal delay={0.05}>
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-1 h-6 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(234,88,12,0.4)]" />
            <TrendingUp className="size-5 text-amber-500" />
            <h2 className="text-lg font-bold text-zinc-100">Rising Flames</h2>
          </div>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-3 pb-4">
              {trendingRoasts.map((roast, idx) => (
                <ScrollReveal key={roast.id} delay={idx * 0.04} direction="right" distance={16}>
                  <TiltCard className="rounded-xl min-w-[200px] shrink-0" maxTilt={5}>
                    <Card
                      className="bg-zinc-900/80 border border-zinc-800/50 rounded-xl overflow-hidden cursor-pointer group card-fire-hover h-full"
                      onClick={() => onNavigateToBattle(roast.id)}
                    >
                      <CardContent className="p-4">
                        <Badge className={`text-[10px] ${difficultyBadgeStyle(roast.difficulty)}`}>
                          {roast.difficulty}
                        </Badge>
                        <h3 className="font-bold text-zinc-100 text-sm mt-2 group-hover:text-amber-400 transition-colors duration-300">
                          {roast.sideA} vs {roast.sideB}
                        </h3>
                        <div className="flex items-center gap-1 mt-2 text-zinc-500 text-xs">
                          <Eye className="size-3" />
                          {roast.spectators.length} watching
                        </div>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </ScrollReveal>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
      </ScrollReveal>

      {/* Newbie Guide — Quests */}
      <ScrollReveal>
        <GuideTip
          id="home_quests_tip"
          title="Quests = Free Aura"
          variant="inline"
          ctaText="View all quests"
          onCtaClick={onNavigateToQuests}
        >
          Complete daily quests to earn Aura points and coins. Quests refresh every 24 hours — don&apos;t miss out on easy rewards!
        </GuideTip>
      </ScrollReveal>

      {/* ═══ Burn Orders Preview ═══ */}
      <ScrollReveal delay={0.05}>
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-6 bg-[#4D7C0F] rounded-full shadow-[0_0_8px_rgba(77,124,15,0.4)]" />
              <h2 className="text-lg font-bold text-zinc-100">Burn Orders</h2>
            </div>
            <Button variant="ghost" className="btn-press text-red-500 hover:text-red-400 text-sm p-0 h-auto group" onClick={onNavigateToQuests}>
              All Orders
              <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mockQuests.slice(0, 2).map((quest, idx) => (
              <ScrollReveal key={quest.id} delay={idx * 0.06}>
                <TiltCard className="rounded-xl" maxTilt={4}>
                  <Card className="bg-zinc-900/80 border border-zinc-800/50 rounded-xl card-fire-hover h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-zinc-100 text-sm">{quest.title}</h3>
                        <Badge variant="secondary" className="text-[10px] bg-red-600/10 text-red-400 border-none">
                          +{quest.reward.aura} Aura
                        </Badge>
                      </div>
                      <p className="text-zinc-500 text-xs mb-3">{quest.description}</p>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={(quest.progress / quest.target) * 100}
                          className="h-1.5 flex-1 [&>div]:bg-red-600 progress-fire"
                        />
                        <span className="text-xs text-zinc-500 whitespace-nowrap font-mono-stat">
                          {quest.progress}/{quest.target}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}