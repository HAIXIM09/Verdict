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
  // Find a roast with an AI roast to display
  const battle = mockBattles.find(b => b.aiVerdict !== null) || mockBattles[2];
  const roast = battle.aiVerdict;

  const scoreA = roast?.scoreA ?? 7;
  const scoreB = roast?.scoreB ?? 3;
  const totalScore = scoreA + scoreB;
  const pctA = totalScore > 0 ? (scoreA / totalScore) * 100 : 50;
  const pctB = totalScore > 0 ? (scoreB / totalScore) * 100 : 50;

  const winnerSide = roast?.winner === 'A' ? battle.sideA : battle.sideB;
  const coinsEarned = roast?.coinsAwarded ?? 250;
  const auraGained = roast?.auraChange?.gained ?? 120;

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Roast Arena Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <Scale className="size-8 text-red-400" />
          </div>
          <h1 className="text-4xl font-black text-red-400 tracking-wide">VERDICT</h1>
          <p className="text-zinc-400 text-sm mt-1">{battle.sideA} ⚔️ {battle.sideB}</p>
        </div>

        {/* Winner Announcement */}
        <Card className="bg-zinc-800 border-zinc-800">
          <CardContent className="p-6 text-center">
            <Trophy className="size-10 text-red-400 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white">
              Team {winnerSide} Wins!
            </h2>
          </CardContent>
        </Card>

        {/* Score Bar */}
        <Card className="bg-zinc-800 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-300">Team {battle.sideA}</span>
              <span className="text-sm font-medium text-zinc-300">Team {battle.sideB}</span>
            </div>
            <div className="h-4 rounded-full overflow-hidden bg-zinc-800 flex">
              <div
                className="bg-red-600 transition-all duration-1000"
                style={{ width: `${pctA}%` }}
              />
              <div
                className="bg-[#4D7C0F] transition-all duration-1000"
                style={{ width: `${pctB}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-red-400">{scoreA}</span>
              <span className="text-zinc-500 text-sm">points</span>
              <span className="text-2xl font-bold text-emerald-400">{scoreB}</span>
            </div>
          </CardContent>
        </Card>

        {/* AI Roastmaster Breakdown */}
        <Card className="bg-zinc-800 border-zinc-800">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">AI Roast Judge Breakdown</h3>

            {/* Best Argument */}
            {roast?.bestArgument && (
              <div>
                <p className="text-xs text-zinc-500 mb-1">Best Roast</p>
                <div className="bg-zinc-800 rounded-lg p-3 border-l-3 border-l-red-500">
                  <p className="text-sm font-medium text-white mb-1">
                    {roast.bestArgument.username}
                  </p>
                  <p className="text-xs text-zinc-400 italic leading-relaxed">
                    &ldquo;{roast.bestArgument.text}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* Most Roasted */}
            {roast?.mostRoasted && (
              <div>
                <p className="text-xs text-zinc-500 mb-1">Most Roasted</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">
                    {roast.mostRoasted.username}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-red-400">
                    <Flame className="size-3" />
                    {roast.mostRoasted.roastCount} roasts
                  </span>
                </div>
              </div>
            )}

            {/* AI Summary */}
            <div>
              <p className="text-xs text-zinc-500 mb-1">AI Roast Arena</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {roast?.summary ||
                  'Team Pushpa won through superior cultural impact arguments and iconic dialogue references. The AI Roastmaster found their emotional appeal and mass-market penetration evidence more compelling.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Section */}
        <Card className="bg-zinc-800 border-zinc-800">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Rewards</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-red-400">
                  <Coins className="size-4" />
                  <span className="text-lg font-bold">+{coinsEarned}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">Coins Earned</p>
              </div>

              <div className="bg-zinc-800 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-400">
                  <TrendingUp className="size-4" />
                  <ArrowUpRight className="size-4" />
                  <span className="text-lg font-bold">+{auraGained}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">Aura Change</p>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-zinc-400">Streak</span>
              <span className="text-sm font-bold text-white">
                {mockCurrentUser.streak} wins <Flame className="size-3.5 inline text-red-400" />
              </span>
            </div>

            <Button className="w-full bg-red-600 hover:bg-red-700 text-white h-11 text-base font-semibold">
              <Coins className="size-4" />
              Claim Rewards
            </Button>
          </CardContent>
        </Card>

        {/* Appeal Option */}
        <div className="text-center pt-2 pb-4">
          <p className="text-zinc-500 text-xs mb-2">
            Think the AI got it wrong? Appeal to the roast community
          </p>
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 text-xs" onClick={onAppeal}>
            Appeal Roast Arena
          </Button>
        </div>
      </div>
    </div>
  );
}