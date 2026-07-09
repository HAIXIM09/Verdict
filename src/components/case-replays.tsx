'use client';

import { useState } from 'react';
import { ArrowLeft, Eye, Clock, Play, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockBattles, type BattleCase } from '@/lib/mock-data';

type FilterTab = 'all' | 'roast-of-the-day' | 'most-viewed';

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
    : 'Result pending';
  const bestArg = battle.aiVerdict?.bestArgument?.text ?? 'No argument recorded';
  const isVOD = battle.id === 'b-3';

  return (
    <Card className="rounded-xl overflow-hidden py-0 gap-0">
      <CardContent className="p-0">
        <div className="p-4 space-y-3">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-zinc-100 leading-snug">{caseName}</h4>
            {isVOD && (
              <Badge className="bg-red-600/15 text-red-400 border-red-700/50 shrink-0 text-[10px]">
                Roast of the Day
              </Badge>
            )}
          </div>

          <p className="text-sm text-zinc-400 font-medium">{verdictText}</p>

          {/* Best argument preview */}
          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
            &ldquo;{bestArg}&rdquo;
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {formatTimer(battle.totalTimer)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="size-3" />
              {formatViewers(battle.viewers)} views
            </span>
            <Badge variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-500 border-none">
              {battle.category}
            </Badge>
          </div>

          {/* Watch button */}
          <Button
            size="sm"
            className="w-full bg-red-600 text-white hover:bg-red-700"
            onClick={() => onWatch(battle.id)}
          >
            <Play className="size-3.5" />
            Watch Roast
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CaseReplays({ onBack, onWatchReplay }: { onBack: () => void; onWatchReplay: (roastId: string) => void }) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const finishedBattles = mockBattles.filter(
    (b) => b.status === 'finished' || b.status === 'verdict'
  );

  const getFilteredBattles = (): BattleCase[] => {
    switch (activeTab) {
      case 'roast-of-the-day':
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
        <h2 className="text-2xl font-bold text-zinc-100">Roast Replays</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-500 hover:text-zinc-300"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="roast-of-the-day">Roast of the Day</TabsTrigger>
          <TabsTrigger value="most-viewed">Most Viewed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredBattles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredBattles.map((roast) => (
                <ReplayCard
                  key={roast.id}
                  battle={roast}
                  onWatch={onWatchReplay}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="size-10 text-zinc-500 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">No roast replays found in this category.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}