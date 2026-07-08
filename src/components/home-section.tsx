'use client';

import { Eye, Play, Flame, Target, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  mockBattles,
  mockQuests,
  mockCurrentUser,
  type BattleCase,
} from '@/lib/mock-data';

interface HomeSectionProps {
  onNavigateToBattle: (battleId: string) => void;
  onNavigateToCategory: (category: string) => void;
  onNavigateToQuests: () => void;
}

function difficultyBadgeStyle(d: string): string {
  switch (d) {
    case 'Bronze': return 'text-stone-500 border-stone-300 bg-stone-50';
    case 'Silver': return 'text-stone-500 border-stone-400 bg-stone-50';
    case 'Gold': return 'text-orange-600 border-orange-300 bg-orange-50';
    case 'Platinum': return 'text-amber-700 border-amber-300 bg-amber-50';
    default: return 'text-stone-500 border-stone-300 bg-stone-50';
  }
}

function statusBadge(s: string) {
  switch (s) {
    case 'live':
      return <Badge className="bg-red-500/10 text-red-600 border-red-200 text-xs">LIVE</Badge>;
    case 'waiting':
      return <Badge className="bg-[#4D7C0F]/10 text-[#4D7C0F] border-[#4D7C0F]/20 text-xs">WAITING</Badge>;
    case 'verdict':
      return <Badge className="bg-orange-100 text-orange-600 border-orange-200 text-xs">VERDICT</Badge>;
    case 'finished':
      return <Badge className="bg-stone-100 text-stone-500 border-stone-200 text-xs">FINISHED</Badge>;
    default:
      return null;
  }
}

export default function HomeSection({ onNavigateToBattle, onNavigateToCategory, onNavigateToQuests }: HomeSectionProps) {
  const liveBattles = mockBattles.filter(b => b.status === 'live').slice(0, 4);
  const trendingBattles = [...mockBattles]
    .filter(b => b.status === 'live' || b.status === 'waiting')
    .sort((a, b) => b.viewers - a.viewers)
    .slice(0, 8);

  const verdictBattle: BattleCase | undefined = mockBattles.find(b => b.status === 'finished');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <section className="bg-[#4D7C0F]/10 border border-[#4D7C0F]/20 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-1">
          <Target className="size-5 text-[#4D7C0F]" />
          <span className="text-sm font-medium text-[#4D7C0F]">Welcome back,</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
          {mockCurrentUser.username}
        </h1>
        <p className="text-stone-500 mt-1">Your next verdict awaits</p>
      </section>

      {/* Verdict of the Day */}
      <section>
        <h2 className="text-lg font-semibold text-stone-900 mb-3">Verdict of the Day</h2>
        <Card className="border-l-4 border-l-orange-600 bg-white">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-xl text-stone-900">
                  {verdictBattle ? `${verdictBattle.sideA} ⚔️ ${verdictBattle.sideB}` : 'Pushpa ⚔️ KGF'}
                </CardTitle>
                <p className="text-stone-500 text-sm mt-1">
                  {verdictBattle ? `${verdictBattle.category} — ${verdictBattle.difficulty}` : 'Movies — Gold'}
                </p>
              </div>
              {verdictBattle?.aiVerdict && (
                <Badge className="bg-[#4D7C0F] text-white border-none">
                  Team {verdictBattle.aiVerdict.winner === 'A' ? verdictBattle.sideA : verdictBattle.sideB} Wins
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-stone-600 text-sm leading-relaxed">
              {verdictBattle?.aiVerdict?.summary ||
                'In a heated battle of cinematic titans, Team Pushpa emerged victorious with superior arguments about mass cultural impact and screen presence. The AI Judge scored it decisively.'}
            </p>
            <Button
              variant="outline"
              className="mt-4 text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
              onClick={() => onNavigateToBattle(verdictBattle?.id || 'b-4')}
            >
              <Play className="size-4" />
              View Full Replay
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Live Now */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-lg font-semibold text-stone-900">Live Now</h2>
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
            <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {liveBattles.map(battle => (
            <Card
              key={battle.id}
              className="bg-white border border-stone-200 hover:shadow-md hover:border-orange-300 transition-all cursor-pointer"
              onClick={() => onNavigateToBattle(battle.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge className="bg-[#4D7C0F]/10 text-[#4D7C0F] border-[#4D7C0F]/20 text-xs">
                    {battle.category}
                  </Badge>
                  {statusBadge(battle.status)}
                </div>
                <h3 className="font-semibold text-stone-900 text-sm mt-2">
                  {battle.sideA} vs {battle.sideB}
                </h3>
                <p className="text-stone-400 text-xs mt-1">
                  {battle.teamA.filter(Boolean).length + battle.teamB.filter(Boolean).length}/10 players
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="flex items-center gap-1 text-stone-500 text-xs">
                    <Eye className="size-3.5" />
                    {battle.viewers}
                  </span>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-7 px-3">
                    Spectate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trending Cases */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Flame className="size-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-stone-900">Trending</h2>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 pb-4">
            {trendingBattles.map(battle => (
              <Card
                key={battle.id}
                className="bg-white border border-stone-200 hover:shadow-md hover:border-orange-300 transition-all cursor-pointer min-w-[220px] shrink-0"
                onClick={() => onNavigateToBattle(battle.id)}
              >
                <CardContent className="p-4">
                  <Badge className={`text-xs ${difficultyBadgeStyle(battle.difficulty)}`}>
                    {battle.difficulty}
                  </Badge>
                  <h3 className="font-semibold text-stone-900 text-sm mt-2">
                    {battle.sideA} vs {battle.sideB}
                  </h3>
                  <div className="flex items-center gap-1 mt-2 text-stone-500 text-xs">
                    <Eye className="size-3" />
                    {battle.spectators.length} spectating
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* Daily Quests Preview */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-stone-900">Daily Quests</h2>
          <Button variant="ghost" className="text-orange-600 hover:text-orange-700 text-sm p-0 h-auto" onClick={onNavigateToQuests}>
            View All Quests
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockQuests.slice(0, 2).map(quest => (
            <Card key={quest.id} className="bg-white border border-stone-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-stone-900 text-sm">{quest.title}</h3>
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-600 border-none">
                    +{quest.reward.aura} Aura
                  </Badge>
                </div>
                <p className="text-stone-500 text-xs mb-3">{quest.description}</p>
                <div className="flex items-center gap-2">
                  <Progress
                    value={(quest.progress / quest.target) * 100}
                    className="h-2 flex-1 [&>div]:bg-orange-500"
                  />
                  <span className="text-xs text-stone-500 whitespace-nowrap">
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