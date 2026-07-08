'use client';

import { Scale, Trophy, Flame, TrendingUp, Coins, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockBattles, mockCurrentUser } from '@/lib/mock-data';

interface VerdictScreenProps {
  onContinue: () => void;
  onAppeal: () => void;
}

export default function VerdictScreen({ onContinue, onAppeal }: VerdictScreenProps) {
  // Find a battle with an AI verdict to display
  const battle = mockBattles.find(b => b.aiVerdict !== null) || mockBattles[2];
  const verdict = battle.aiVerdict;

  const scoreA = verdict?.scoreA ?? 7;
  const scoreB = verdict?.scoreB ?? 3;
  const totalScore = scoreA + scoreB;
  const pctA = totalScore > 0 ? (scoreA / totalScore) * 100 : 50;
  const pctB = totalScore > 0 ? (scoreB / totalScore) * 100 : 50;

  const winnerSide = verdict?.winner === 'A' ? battle.sideA : battle.sideB;
  const coinsEarned = verdict?.coinsAwarded ?? 250;
  const auraGained = verdict?.auraChange?.gained ?? 120;

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Verdict Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <Scale className="size-8 text-orange-500" />
          </div>
          <h1 className="text-4xl font-black text-orange-500 tracking-wide">VERDICT</h1>
          <p className="text-stone-400 text-sm mt-1">{battle.sideA} ⚔️ {battle.sideB}</p>
        </div>

        {/* Winner Announcement */}
        <Card className="bg-stone-900 border-stone-800">
          <CardContent className="p-6 text-center">
            <Trophy className="size-10 text-orange-500 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white">
              Team {winnerSide} Wins!
            </h2>
          </CardContent>
        </Card>

        {/* Score Bar */}
        <Card className="bg-stone-900 border-stone-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Team {battle.sideA}</span>
              <span className="text-sm font-medium text-white">Team {battle.sideB}</span>
            </div>
            <div className="h-4 rounded-full overflow-hidden bg-stone-800 flex">
              <div
                className="bg-orange-600 transition-all duration-1000"
                style={{ width: `${pctA}%` }}
              />
              <div
                className="bg-[#4D7C0F] transition-all duration-1000"
                style={{ width: `${pctB}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-orange-500">{scoreA}</span>
              <span className="text-stone-500 text-sm">points</span>
              <span className="text-2xl font-bold text-[#4D7C0F]">{scoreB}</span>
            </div>
          </CardContent>
        </Card>

        {/* AI Judge Breakdown */}
        <Card className="bg-stone-900 border-stone-800">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider">AI Judge Breakdown</h3>

            {/* Best Argument */}
            {verdict?.bestArgument && (
              <div>
                <p className="text-xs text-stone-500 mb-1">Best Argument</p>
                <div className="bg-stone-800 rounded-lg p-3 border-l-3 border-l-orange-500">
                  <p className="text-sm font-medium text-white mb-1">
                    {verdict.bestArgument.username}
                  </p>
                  <p className="text-xs text-stone-400 italic leading-relaxed">
                    &ldquo;{verdict.bestArgument.text}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* Most Roasted */}
            {verdict?.mostRoasted && (
              <div>
                <p className="text-xs text-stone-500 mb-1">Most Roasted</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">
                    {verdict.mostRoasted.username}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-orange-400">
                    <Flame className="size-3" />
                    {verdict.mostRoasted.roastCount} roasts
                  </span>
                </div>
              </div>
            )}

            {/* AI Summary */}
            <div>
              <p className="text-xs text-stone-500 mb-1">AI Summary</p>
              <p className="text-sm text-stone-300 leading-relaxed">
                {verdict?.summary ||
                  'Team Pushpa won through superior cultural impact arguments and iconic dialogue references. The AI Judge found their emotional appeal and mass-market penetration evidence more compelling.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Section */}
        <Card className="bg-stone-900 border-stone-800">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider">Rewards</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-stone-800 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-orange-500">
                  <Coins className="size-4" />
                  <span className="text-lg font-bold">+{coinsEarned}</span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">Coins Earned</p>
              </div>

              <div className="bg-stone-800 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-[#4D7C0F]">
                  <TrendingUp className="size-4" />
                  <ArrowUpRight className="size-4" />
                  <span className="text-lg font-bold">+{auraGained}</span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">Aura Change</p>
              </div>
            </div>

            <div className="bg-stone-800 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-stone-400">Streak</span>
              <span className="text-sm font-bold text-white">
                {mockCurrentUser.streak} wins <Flame className="size-3.5 inline text-orange-500" />
              </span>
            </div>

            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white h-11 text-base font-semibold">
              <Coins className="size-4" />
              Claim Rewards
            </Button>
          </CardContent>
        </Card>

        {/* Appeal Option */}
        <div className="text-center pt-2 pb-4">
          <p className="text-stone-500 text-xs mb-2">
            Disagree with the verdict? Appeal to the community
          </p>
          <Button variant="ghost" size="sm" className="text-stone-400 hover:text-stone-200 text-xs" onClick={onAppeal}>
            File Appeal
          </Button>
        </div>
      </div>
    </div>
  );
}