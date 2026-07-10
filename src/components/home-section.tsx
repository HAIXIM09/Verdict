'use client';

import { useState, useEffect, useCallback } from 'react';
import { Swords, Zap, ChevronRight, Users, MessageSquare, Sparkles, Play, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SplineScene } from '@/components/ui/spline';
import { Spotlight } from '@/components/ui/spotlight';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { GuideTip } from '@/components/newbie-guide';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface HomeSectionProps {
  onNavigateToRoast: (roastId: string) => void;
  onNavigateToCategory: (category: string) => void;
  onNavigateToQuests: () => void;
}

interface BattlePreview {
  id: string;
  sideA: string;
  sideB: string;
  category: string;
  status: string;
  auraStake: number;
  creator: { username: string; avatar: string };
  _count: { messages: number };
}

interface Stats {
  totalUsers: number;
  totalBattles: number;
  totalMessages: number;
}

const QUESTS = [
  { title: 'Win 1 Battle', description: 'Drop into an arena and come out on top', progress: 0, target: 1, reward: { coins: 50, aura: 100 } },
  { title: 'Send 5 Arguments', description: 'Let your voice be heard in battle chat', progress: 0, target: 5, reward: { coins: 75, aura: 150 } },
];

export default function HomeSection({ onNavigateToRoast, onNavigateToCategory, onNavigateToQuests }: HomeSectionProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBattles, setRecentBattles] = useState<BattlePreview[]>([]);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {});
    fetch('/api/battles').then(r => r.json()).then(data => setRecentBattles((data.battles || []).slice(0, 4))).catch(() => {});
  }, []);

  const formatStat = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <section className="relative w-full h-[420px] md:h-[500px] rounded-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d080d] via-[#0d0810] to-[#09090B]" />
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-pink-600/10 rounded-full blur-[100px] orb-1" />
        <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-violet-500/8 rounded-full blur-[80px] orb-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-600/6 rounded-full blur-[60px] orb-1" />
        <div className="absolute inset-0 noise-overlay" />
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#EC4899" />
        <div className="absolute bottom-0 left-0 right-0 h-px bar-gradient z-10" />

        <div className="flex h-full">
          <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="size-2 rounded-full bg-pink-500 pulse-dot shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-pink-400/80 text-shimmer">
                The debate platform
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-heading bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-violet-300 to-cyan-400 leading-[0.95] drop-shadow-[0_0_40px_rgba(236,72,153,0.25)]">
              Pick a Side.<br />Make Your Case.
            </h1>
            <p className="mt-5 text-zinc-500 max-w-md text-sm md:text-base leading-relaxed">
              The only platform where your takes actually matter. Debate anime, movies, games — get scored on creativity and wit.
            </p>
            <div className="flex items-center gap-3 mt-8">
              <MagneticButton
                className="btn-primary btn-press text-white font-bold rounded-xl px-6 py-3 text-sm cursor-pointer"
                strength={0.25}
                onClick={() => onNavigateToCategory('Movies')}
              >
                <Swords className="size-4 mr-2" />
                Jump In
              </MagneticButton>
              <MagneticButton
                className="border border-zinc-700/50 text-zinc-400 hover:bg-white/[0.04] hover:text-white hover:border-zinc-600 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-300 cursor-pointer bg-transparent"
                strength={0.2}
                onClick={onNavigateToQuests}
              >
                <Zap className="size-4 mr-2" />
                Daily Missions
              </MagneticButton>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-10">
              {[
                { value: stats?.totalUsers || 0, label: 'Debaters' },
                { value: stats?.totalBattles || 0, label: 'Arenas' },
                { value: stats?.totalMessages || 0, label: 'Total Takes' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-2xl font-black text-white font-mono-stat stat-gradient">
                    <AnimatedCounter target={stat.value} formatFn={formatStat} />
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600 font-heading mt-0.5">{stat.label}</p>
                </div>
              ))}
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-8 w-px bg-zinc-800/50" />
              ))}
            </div>
          </div>

          <div className="flex-1 relative hidden md:block">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      <ScrollReveal>
        <GuideTip id="home_how_it_works" title="How Verdict Works" variant="card">
          <p className="mb-2"><strong className="text-zinc-200">1. Pick a category</strong> — Anime, Movies, Games, Cartoons, and more.</p>
          <p className="mb-2"><strong className="text-zinc-200">2. Start or join a debate</strong> — Choose Side A or Side B and argue why your side is better.</p>
          <p className="mb-2"><strong className="text-zinc-200">3. Get scored</strong> — The AI Judge rates your arguments on Creativity, Humor, and Wit.</p>
          <p><strong className="text-zinc-200">4. Climb the ranks</strong> — Win debates to earn Aura, complete Daily Missions, and become a legend.</p>
        </GuideTip>
      </ScrollReveal>

      {/* Recent Battles or Empty State */}
      {recentBattles.length > 0 ? (
        <ScrollReveal delay={0.1}>
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-6 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.4)]" />
                <h2 className="text-lg font-bold text-zinc-100">Recent Debates</h2>
              </div>
              <Button variant="ghost" className="btn-press text-pink-500 hover:text-pink-400 text-sm p-0 h-auto group" onClick={() => onNavigateToCategory('Anime')}>
                View All
                <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentBattles.map(battle => (
                <Card key={battle.id} className="bg-zinc-900/80 border border-zinc-800/50 rounded-xl card-hover h-full cursor-pointer" onClick={() => onNavigateToRoast(battle.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-zinc-100 truncate">
                        {battle.sideA} <Swords className="size-3 inline text-pink-500 mx-1" /> {battle.sideB}
                      </h3>
                      <Badge className={
                        battle.status === 'active' ? 'bg-pink-500/15 text-pink-500 border-pink-800/50 text-[10px]' :
                        battle.status === 'open' ? 'bg-violet-500/15 text-violet-400 border-violet-500/20 text-[10px]' :
                        'bg-zinc-800 text-zinc-500 text-[10px]'
                      }>
                        {battle.status === 'active' ? 'LIVE' : battle.status === 'open' ? 'OPEN' : 'JUDGED'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <Badge variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-500 border-none">{battle.category}</Badge>
                      <span className="flex items-center gap-1"><MessageSquare className="size-3" />{battle._count.messages}</span>
                      <span className="flex items-center gap-1"><Sparkles className="size-3 text-pink-400" />{battle.auraStake} Aura</span>
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-2">by {battle.creator.username}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </ScrollReveal>
      ) : (
        <ScrollReveal delay={0.1}>
          <Card className="card-premium bg-zinc-900/60 border-zinc-800/40">
            <CardContent className="py-16 px-8 flex flex-col items-center text-center gap-5">
              <div className="size-16 rounded-2xl bg-pink-600/10 border border-pink-600/20 flex items-center justify-center">
                <Swords className="size-7 text-pink-400" />
              </div>
              <div className="space-y-2 max-w-sm">
                <h2 className="text-xl font-bold text-zinc-100">No arenas yet</h2>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Be the first to start a debate. Pick a category, choose your sides, and let the community decide who wins.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <Button className="btn-primary btn-press" onClick={() => onNavigateToCategory('Anime')}>
                  <Sparkles className="size-4 mr-2" />
                  Start with Anime
                </Button>
                <Button variant="outline" className="btn-press border-zinc-700 text-zinc-300 hover:bg-white/[0.04] hover:text-white" onClick={() => onNavigateToCategory('Movies')}>
                  Try Movies
                </Button>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      )}

      {/* Daily Missions Preview */}
      <ScrollReveal delay={0.15}>
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-6 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.4)]" />
              <h2 className="text-lg font-bold text-zinc-100">Daily Missions</h2>
            </div>
            <Button variant="ghost" className="btn-press text-pink-500 hover:text-pink-400 text-sm p-0 h-auto group" onClick={onNavigateToQuests}>
              All Missions
              <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUESTS.map((quest, idx) => (
              <ScrollReveal key={quest.title} delay={idx * 0.06}>
                <Card className="bg-zinc-900/80 border border-zinc-800/50 rounded-xl card-hover h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-zinc-100 text-sm">{quest.title}</h3>
                      <Badge variant="secondary" className="text-[10px] bg-violet-500/10 text-violet-400 border-none">
                        +{quest.reward.aura} Aura
                      </Badge>
                    </div>
                    <p className="text-zinc-500 text-xs mb-3">{quest.description}</p>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(quest.progress / quest.target) * 100}
                        className="h-1.5 flex-1 [&>div]:bg-violet-500 progress-glow"
                      />
                      <span className="text-xs text-zinc-500 whitespace-nowrap font-mono-stat">
                        {quest.progress}/{quest.target}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}