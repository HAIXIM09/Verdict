'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Clock, Play, Trophy, Swords, MessageSquare, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TiltCard } from '@/components/ui/tilt-card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

interface JudgedBattle {
  id: string;
  topic: string;
  sideA: string;
  sideB: string;
  category: string;
  auraStake: number;
  status: string;
  aiVerdict: string | null;
  winner: { id: string; username: string; avatar: string } | null;
  creator: { username: string; avatar: string };
  opponent: { username: string; avatar: string } | null;
  _count: { messages: number };
}

function ReplayCard({ battle, onWatch }: { battle: JudgedBattle; onWatch: (id: string) => void }) {
  const caseName = `${battle.sideA} vs ${battle.sideB}`;
  const verdictText = battle.winner
    ? `${battle.winner.username} Won`
    : 'No winner';

  return (
    <TiltCard maxTilt={4}>
      <Card className="rounded-xl overflow-hidden py-0 gap-0">
        <CardContent className="p-0">
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold text-zinc-100 leading-snug">{caseName}</h4>
              <Badge className="bg-pink-600/15 text-pink-400 border-pink-700/50 shrink-0 text-[10px]">
                Judged
              </Badge>
            </div>

            <p className="text-sm text-zinc-400 font-medium">{verdictText}</p>

            {battle.aiVerdict && (
              <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                &ldquo;{battle.aiVerdict}&rdquo;
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <MessageSquare className="size-3" />
                {battle._count.messages} messages
              </span>
              <Badge variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-500 border-none">
                {battle.category}
              </Badge>
              <span className="flex items-center gap-1">
                <Sparkles className="size-3 text-pink-400" />
                {battle.auraStake * 2} Aura
              </span>
            </div>

            <Button
              size="sm"
              className="btn-primary w-full"
              onClick={() => onWatch(battle.id)}
            >
              <Play className="size-3.5" />
              Watch Replay
            </Button>
          </div>
        </CardContent>
      </Card>
    </TiltCard>
  );
}

export default function CaseReplays({ onBack, onWatchReplay }: { onBack: () => void; onWatchReplay: (roastId: string) => void }) {
  const [battles, setBattles] = useState<JudgedBattle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBattles = useCallback(async () => {
    try {
      const res = await fetch('/api/battles?status=judged');
      const data = await res.json();
      setBattles(data.battles || []);
    } catch {
      setBattles([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBattles();
  }, [fetchBattles]);

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-100 font-heading">Replays</h2>
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
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="size-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : battles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {battles.map((roast) => (
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
            <p className="text-zinc-500 text-sm">No replays yet. Once debates finish, they&apos;ll show up here.</p>
          </div>
        )}
      </ScrollReveal>
    </div>
  );
}