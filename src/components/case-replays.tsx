'use client';

import { useState } from 'react';
import { ArrowLeft, Eye, Clock, Play, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockBattles, type BattleCase } from '@/lib/mock-data';

interface CaseReplaysProps {
  onBack: () => void;
  onWatchReplay: (battleId: string) => void;
}

type FilterTab = 'all' | 'my-battles' | 'verdict-of-the-day' | 'most-viewed';

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatViewers(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

function ReplayCard({ battle, onWatch }: { battle: BattleCase; onWatch: (id: string) => void }) {
  const caseName = `${battle.sideA} vs ${battle.sideB}`;
  const verdictText = battle.aiVerdict
    ? `Team ${battle.aiVerdict.winner === 'A' ? battle.sideA : battle.sideB} Won ${battle.aiVerdict.scoreA}-${battle.aiVerdict.scoreB}`
    : 'Verdict pending';
  const bestArg = battle.aiVerdict?.bestArgument?.text ?? 'No argument recorded';
  const isVOD = battle.id === 'b-3'; // Mark one battle as Verdict of the Day

  return (
    <Card className="rounded-xl overflow-hidden py-0 gap-0">
      <CardContent className="p-0">
        <div className="p-4 space-y-3">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-stone-900 leading-snug">{caseName}</h4>
            {isVOD && (
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 shrink-0 text-[10px]">
                Verdict of the Day
              </Badge>
            )}
          </div>

          {/* Verdict */}
          <p className="text-sm text-stone-600 font-medium">{verdictText}</p>

          {/* Best argument preview */}
          <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
            &ldquo;{bestArg}&rdquo;
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-xs text-stone-400">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {formatTimer(battle.totalTimer)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="size-3" />
              {formatViewers(battle.viewers)} views
            </span>
            <Badge variant="secondary" className="text-[10px] bg-stone-100 text-stone-500 border-none">
              {battle.category}
            </Badge>
          </div>

          {/* Watch button */}
          <Button
            size="sm"
            className="w-full bg-orange-600 text-white hover:bg-orange-700"
            onClick={() => onWatch(battle.id)}
          >
            <Play className="size-3.5" />
            Watch Replay
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CaseReplays({ onBack, onWatchReplay }: CaseReplaysProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const finishedBattles = mockBattles.filter(
    (b) => b.status === 'finished' || b.status === 'verdict'
  );

  const getFilteredBattles = (): BattleCase[] => {
    switch (activeTab) {
      case 'verdict-of-the-day':
        return finishedBattles.filter((b) => b.id === 'b-3');
      case 'most-viewed':
        return [...finishedBattles].sort((a, b) => b.viewers - a.viewers);
      default:
        return finishedBattles;
    }
  };

  const filteredBattles = getFilteredBattles();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-stone-900">Case Replays</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-stone-500 hover:text-stone-700"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
          Back to Profile
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="verdict-of-the-day">Verdict of the Day</TabsTrigger>
          <TabsTrigger value="most-viewed">Most Viewed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredBattles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredBattles.map((battle) => (
                <ReplayCard
                  key={battle.id}
                  battle={battle}
                  onWatch={onWatchReplay}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="size-10 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500 text-sm">No replays found in this category.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}