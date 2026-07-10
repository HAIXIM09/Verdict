'use client';

import { ArrowLeft, Coins, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TiltCard } from '@/components/ui/tilt-card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { GuideTip } from '@/components/newbie-guide';

interface DailyQuestsProps {
  onBack: () => void;
}

const quests = [
  { id: 'q-1', title: 'Win 1 Battle', description: 'Drop into an arena and come out on top', progress: 0, target: 1, reward: { coins: 50, aura: 100 }, completed: false },
  { id: 'q-2', title: 'Send 5 Arguments', description: 'Let your voice be heard in battle chat', progress: 0, target: 5, reward: { coins: 75, aura: 150 }, completed: false },
  { id: 'q-3', title: 'Join a Crew', description: 'Find your people and create or join a crew', progress: 0, target: 1, reward: { coins: 40, aura: 80 }, completed: false },
];

export default function DailyQuests({ onBack }: DailyQuestsProps) {
  const totalCoins = quests.reduce((sum, q) => sum + q.reward.coins, 0);
  const totalAura = quests.reduce((sum, q) => sum + q.reward.aura, 0);

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-heading text-zinc-100">Daily Missions</h2>
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
          Quests reset every 24 hours. Complete them for Coins and Aura. Start with &quot;Win 1 Battle&quot; — it&apos;s the easiest!
        </GuideTip>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="stagger-1 space-y-3">
          {quests.map((quest) => {
            const progressPercent = Math.round((quest.progress / quest.target) * 100);

            return (
              <TiltCard key={quest.id} maxTilt={3} shine={false} glow={false}>
                <div
                  className={`rounded-xl border p-4 bg-zinc-900 border-l-4 border-l-zinc-700 border-zinc-800 hover:shadow-lg hover:shadow-black/20 transition-shadow`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-zinc-100">{quest.title}</h4>
                        <span className="text-xs text-zinc-400 font-medium">In Progress</span>
                      </div>
                      <p className="text-sm text-zinc-500 mt-0.5">{quest.description}</p>

                      <div className="mt-3 flex items-center gap-3">
                        <Progress
                          value={progressPercent}
                          className="progress-glow h-2 flex-1 [&>div]:bg-pink-600"
                        />
                        <span className="text-xs font-medium font-mono-stat text-zinc-500 shrink-0">
                          {quest.progress}/{quest.target}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-xs">
                        {quest.reward.coins > 0 && (
                          <span className="flex items-center gap-1 text-emerald-400 font-mono-stat">
                            <Coins className="size-3" />
                            +{quest.reward.coins} Coins
                          </span>
                        )}
                        {quest.reward.aura > 0 && (
                          <span className="text-pink-500 font-medium font-mono-stat">
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

      <ScrollReveal delay={0.2}>
        <div className="premium-glow rounded-xl border border-zinc-800 bg-pink-950/20 p-4">
          <p className="text-sm font-semibold text-zinc-300">Today&apos;s potential</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-sm text-emerald-400 font-medium font-mono-stat">
              <Coins className="size-4" />
              +{totalCoins} Coins
            </span>
            <span className="text-sm text-pink-500 font-medium font-mono-stat">
              +{totalAura} Aura
            </span>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}