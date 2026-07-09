'use client';

import { ArrowLeft, Coins, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TiltCard } from '@/components/ui/tilt-card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { mockQuests, type Quest as QuestType } from '@/lib/mock-data';
import { GuideTip } from '@/components/newbie-guide';

interface DailyQuestsProps {
  onBack: () => void;
}

export default function DailyQuests({ onBack }: DailyQuestsProps) {
  const totalCoins = mockQuests.reduce((sum, q) => sum + q.reward.coins, 0);
  const totalAura = mockQuests.reduce((sum, q) => sum + q.reward.aura, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <ScrollReveal>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-heading text-zinc-100">Burn Orders</h2>
            <p className="text-sm text-zinc-400 mt-1">Resets in 14h 23m</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-500 hover:text-zinc-300"
            onClick={onBack}
          >
            <ArrowLeft className="size-4 mr-1" />
            Back
          </Button>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <GuideTip id="quests_how" title="Free Rewards Every Day" variant="inline">
          Quests reset every 24 hours. Complete them to earn <strong className="text-zinc-200">Coins</strong> (spend in the Aura Marketplace) and <strong className="text-zinc-200">Aura</strong> (your ranking score). Newbies should focus on &quot;Win 1 Battle&quot; first — it&apos;s the easiest quest!
        </GuideTip>
      </ScrollReveal>

      {/* Quest Cards */}
      <ScrollReveal delay={0.15}>
        <div className="stagger-1 space-y-3">
          {mockQuests.map((quest: QuestType) => {
            const progressPercent = Math.round((quest.progress / quest.target) * 100);
            const isComplete = quest.completed;

            return (
              <TiltCard key={quest.id} maxTilt={3} shine={false} glow={false}>
                <div
                  className={`rounded-xl border p-4 bg-zinc-900 ${
                    isComplete ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-zinc-700'
                  } border-zinc-800 hover:shadow-lg hover:shadow-black/20 transition-shadow`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-zinc-100">{quest.title}</h4>
                        {isComplete && (
                          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                            <Check className="size-3" />
                            Claimed
                          </Badge>
                        )}
                        {!isComplete && !quest.claimed && (
                          <span className="text-xs text-zinc-400 font-medium">In Progress</span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-500 mt-0.5">{quest.description}</p>

                      {/* Progress */}
                      <div className="mt-3 flex items-center gap-3">
                        <Progress
                          value={progressPercent}
                          className="progress-fire h-2 flex-1 [&>div]:bg-red-600"
                        />
                        <span className="text-xs font-medium font-mono-stat text-zinc-500 shrink-0">
                          {quest.progress}/{quest.target}
                        </span>
                      </div>

                      {/* Reward */}
                      <div className="mt-2 flex items-center gap-3 text-xs">
                        {quest.reward.coins > 0 && (
                          <span className="flex items-center gap-1 text-emerald-400 font-mono-stat">
                            <Coins className="size-3" />
                            +{quest.reward.coins} Coins
                          </span>
                        )}
                        {quest.reward.aura > 0 && (
                          <span className="text-red-500 font-medium font-mono-stat">
                            +{quest.reward.aura} Aura
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Total Rewards Preview */}
      <ScrollReveal delay={0.2}>
        <div className="premium-glow rounded-xl border border-zinc-800 bg-red-950/20 p-4">
          <p className="text-sm font-semibold text-zinc-300">Today&apos;s potential</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-sm text-emerald-400 font-medium font-mono-stat">
              <Coins className="size-4" />
              +{totalCoins} Coins
            </span>
            <span className="text-sm text-red-500 font-medium font-mono-stat">
              +{totalAura} Aura
            </span>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}