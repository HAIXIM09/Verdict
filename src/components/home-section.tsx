'use client';

import { Eye, Flame, Zap, ChevronRight, FlameKindling, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SplineScene } from '@/components/ui/spline';
import { Spotlight } from '@/components/ui/spotlight';
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
    case 'Bronze': return 'text-zinc-500 border-zinc-600 bg-zinc-800';
    case 'Silver': return 'text-zinc-400 border-zinc-600 bg-zinc-800';
    case 'Gold': return 'text-amber-400 border-amber-600/40 bg-amber-950/20';
    case 'Platinum': return 'text-red-400 border-red-600/40 bg-red-950/20';
    default: return 'text-zinc-500 border-zinc-600 bg-zinc-800';
  }
}

function statusBadge(s: string) {
  switch (s) {
    case 'live':
      return <Badge className="bg-red-500/15 text-red-500 border-red-800/50 text-xs animate-pulse">ON FIRE</Badge>;
    case 'waiting':
      return <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-800/50 text-xs">WAITING</Badge>;
    case 'verdict':
      return <Badge className="bg-amber-600/15 text-amber-400 border-amber-700/50 text-xs">SCORING</Badge>;
    case 'finished':
      return <Badge className="bg-zinc-800 text-zinc-500 border-zinc-700 text-xs">DONE</Badge>;
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
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="relative w-full h-[400px] md:h-[480px] rounded-2xl overflow-hidden">
        {/* Dark base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#09090b] via-[#1a0505] to-[#09090b]" />

        {/* Scanline overlay */}
        <div className="scanline-overlay absolute inset-0 z-[2] pointer-events-none" />

        {/* Fire glow effects */}
        {/* Animated floating orbs */}
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-red-600/12 rounded-full blur-[100px] orb-1" />
        <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] orb-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-600/8 rounded-full blur-[60px] orb-1" />
        {/* Noise texture for depth */}
        <div className="absolute inset-0 noise-overlay rounded-2xl" />

        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="#DC2626"
        />

        {/* Burn gradient bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 burn-gradient z-10" />

        <div className="flex h-full">
          {/* Left content */}
          <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-2 rounded-full bg-red-500 animate-flicker" />
              <span className="text-xs font-bold uppercase tracking-widest text-red-400 text-shimmer">
                Live Roasts Happening Now
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-heading bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-amber-400 to-red-500 leading-tight drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              Drop Your<br />Hottest Takes
            </h1>
            <p className="mt-4 text-zinc-500 max-w-md text-sm md:text-base leading-relaxed">
              Roast anime, movies, games & more. Get scored on creativity, humor, and savagery. Climb the ranks. Become a legend.
            </p>
            <div className="flex items-center gap-3 mt-8">
              <Button
                className="btn-fire btn-press animate-glow-red text-white font-bold shadow-lg shadow-red-600/20 rounded-xl"
                onClick={() => onNavigateToCategory('Movies')}
              >
                <Flame className="size-4 mr-2" />
                Start a Fire
              </Button>
              <Button
                variant="outline"
                className="btn-press border-zinc-700 text-zinc-300 hover:bg-zinc-800/80 hover:text-white hover:border-zinc-600 rounded-xl"
                onClick={onNavigateToQuests}
              >
                <Zap className="size-4 mr-2" />
                Earn Burn Credits
              </Button>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-6 mt-10">
              <div>
                <p className="text-2xl font-black text-white font-mono-stat stat-fire"><AnimatedCounter target={12400} formatFn={(n) => (n / 1000).toFixed(1) + 'K'} /></p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-heading">Active Roasters</p>
              </div>
              <div className="h-8 w-px bg-zinc-800" />
              <div>
                <p className="text-2xl font-black text-white font-mono-stat stat-fire"><AnimatedCounter target={847} /></p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-heading">Live Roasts</p>
              </div>
              <div className="h-8 w-px bg-zinc-800" />
              <div>
                <p className="text-2xl font-black text-white font-mono-stat stat-fire"><AnimatedCounter target={2100000} formatFn={(n) => (n / 1000000).toFixed(1) + 'M'} /></p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-heading">Total Burns</p>
              </div>
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

      {/* Newbie Guide — How it works */}
      <GuideTip id="home_how_it_works" title="How Verdict Works" variant="card" className="stagger-1">
        <p className="mb-2"><strong className="text-zinc-200">1. Pick a category</strong> — Anime, Movies, Games, Cartoons, and more.</p>
        <p className="mb-2"><strong className="text-zinc-200">2. Join a Roast Battle</strong> — Choose Team A or Team B and argue why your side is better.</p>
        <p className="mb-2"><strong className="text-zinc-200">3. Get scored</strong> — The AI Roastmaster rates your arguments on Creativity, Humor, and Savagery.</p>
        <p><strong className="text-zinc-200">4. Climb the ranks</strong> — Win battles to earn Aura, complete Daily Quests, and become a legend.</p>
      </GuideTip>

      {/* Roast of the Day */}
      <section className="stagger-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 bg-amber-500 rounded-full" />
          <FlameKindling className="size-5 text-red-500" />
          <h2 className="text-lg font-bold text-zinc-100">Scorch of the Day</h2>
        </div>
        <Card className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden card-fire-hover relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-transparent pointer-events-none" />
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
            <Button
              variant="outline"
              className="btn-press mt-4 border-red-700/50 text-red-400 hover:bg-red-950/30 hover:text-red-300 hover:border-red-600/50 rounded-xl"
              onClick={() => onNavigateToBattle(topRoast?.id || 'b-3')}
            >
              <Eye className="size-4" />
              Watch Full Roast
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Newbie Guide — Roast of the Day */}
      <GuideTip id="home_roast_of_day" title="Pro Tip" variant="inline" className="mb-2">
        This is today&apos;s hottest roast — voted by the community. Watch the replay to learn what makes a winning argument before you jump into your own battles.
      </GuideTip>

      {/* Live Now */}
      <section className="stagger-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 bg-red-600 rounded-full" />
          <h2 className="text-lg font-bold text-zinc-100">Inferno Live</h2>
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
            <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {liveRoasts.map(roast => (
            <Card
              key={roast.id}
              className="card-premium rounded-xl transition-all cursor-pointer group overflow-hidden card-fire-hover"
              onClick={() => onNavigateToBattle(roast.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center start justify-between gap-2 mb-2">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                    {roast.category}
                  </Badge>
                  {statusBadge(roast.status)}
                </div>
                <h3 className="font-bold text-zinc-100 text-sm mt-2 group-hover:text-red-400 transition-colors">
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
                  <Button size="sm" className="btn-fire text-white text-xs h-7 px-3 rounded-lg">
                    Watch
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="stagger-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 bg-orange-500 rounded-full" />
          <TrendingUp className="size-5 text-amber-500" />
          <h2 className="text-lg font-bold text-zinc-100">Rising Flames</h2>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 pb-4">
            {trendingRoasts.map(roast => (
              <Card
                key={roast.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-amber-600/40 transition-all cursor-pointer min-w-[200px] shrink-0 rounded-xl overflow-hidden group card-fire-hover"
                onClick={() => onNavigateToBattle(roast.id)}
              >
                <CardContent className="p-4">
                  <Badge className={`text-xs ${difficultyBadgeStyle(roast.difficulty)}`}>
                    {roast.difficulty}
                  </Badge>
                  <h3 className="font-bold text-zinc-100 text-sm mt-2 group-hover:text-amber-400 transition-colors">
                    {roast.sideA} vs {roast.sideB}
                  </h3>
                  <div className="flex items-center gap-1 mt-2 text-zinc-500 text-xs">
                    <Eye className="size-3" />
                    {roast.spectators.length} watching
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* Newbie Guide — Quests */}
      <GuideTip
        id="home_quests_tip"
        title="Quests = Free Aura"
        variant="inline"
        className="mb-2 stagger-5"
        ctaText="View all quests"
        onCtaClick={onNavigateToQuests}
      >
        Complete daily quests to earn Aura points and coins. Quests refresh every 24 hours — don&apos;t miss out on easy rewards!
      </GuideTip>

      {/* Daily Quests Preview */}
      <section className="stagger-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-[#4D7C0F] rounded-full" />
            <h2 className="text-lg font-bold text-zinc-100">Burn Orders</h2>
          </div>
          <Button variant="ghost" className="btn-press text-red-500 hover:text-red-400 text-sm p-0 h-auto" onClick={onNavigateToQuests}>
            All Orders
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mockQuests.slice(0, 2).map(quest => (
            <Card key={quest.id} className="bg-zinc-900 border border-zinc-800 rounded-xl card-fire-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-zinc-100 text-sm">{quest.title}</h3>
                  <Badge variant="secondary" className="text-xs bg-red-600/10 text-red-400 border-none">
                    +{quest.reward.aura} Aura
                  </Badge>
                </div>
                <p className="text-zinc-500 text-xs mb-3">{quest.description}</p>
                <div className="flex items-center gap-2">
                  <Progress
                    value={(quest.progress / quest.target) * 100}
                    className="h-1.5 flex-1 [&>div]:bg-red-600"
                  />
                  <span className="text-xs text-zinc-500 whitespace-nowrap">
                    {quest.progress}/{quest.target}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}