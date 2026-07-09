'use client';

import { Shield, Flame, Coins, Trophy, Star, TrendingUp, TrendingDown, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockCurrentUser, mockBattles } from '@/lib/mock-data';
import { GuideTip } from '@/components/newbie-guide';

function getInitials(name: string): string { return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }

interface ProfileSectionProps {
  userId: string | null;
  onNavigateToReplays: () => void;
  onNavigateToMarketplace: () => void;
}

const badgeConfig: Record<string, { icon: React.ReactNode; description: string }> = {
  'Flame Streak': { icon: <Flame className="size-5" />, description: 'Win 3+ roast roasts in a row. Opponents left in ashes.' },
  'Roast Master': { icon: <Star className="size-5" />, description: 'Win 50+ roasts. Your roasts are legendary.' },
  'Top 10': { icon: <Trophy className="size-5" />, description: 'Reach top 10 on the leaderboard. Elite roaster territory.' },
  'Unstoppable': { icon: <Shield className="size-5" />, description: 'Win 10+ roasts in a row. Absolute savage.' },
};

const rankIconMap: Record<string, React.ReactNode> = {
  Citizen: <Shield className="size-4" />,
  Lawyer: <Shield className="size-4" />,
  Judge: <Trophy className="size-4" />,
  'Supreme Court': <Star className="size-4" />,
  Legend: <Trophy className="size-4" />,
};

// Inline mock data for features not in the data model
const auraHistory = [80, -30, 120, 50, -15, 200, 90];
const lastRoastAuraChange = 120;
const weekAuraChange = -30;

const allBadges = ['Flame Streak', 'Roast Master', 'Top 10', 'Unstoppable', 'Crowd Legend', 'Perfect Burn'];
const recentRoastResults = [
  { caseName: 'Pushpa vs KGF', result: 'won' as const, auraChange: 120, date: '2 hours ago' },
  { caseName: 'Naruto vs Goku', result: 'lost' as const, auraChange: -80, date: '5 hours ago' },
  { caseName: 'Messi vs Ronaldo', result: 'won' as const, auraChange: 150, date: '1 day ago' },
  { caseName: 'Biryani vs Pizza', result: 'won' as const, auraChange: 60, date: '2 days ago' },
  { caseName: 'GTA vs RDR2', result: 'lost' as const, auraChange: -50, date: '3 days ago' },
];

export default function ProfileSection({ userId, onNavigateToReplays, onNavigateToMarketplace }: ProfileSectionProps) {
  const user = mockCurrentUser;
  const totalRoasts = user.wins + user.losses;
  const winRate = totalRoasts > 0 ? Math.round((user.wins / totalRoasts) * 100) : 0;
  const maxAura = Math.max(...auraHistory.map(Math.abs), 1);

  const joinDate = new Date(user.joinDate);
  const formattedDate = joinDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      <GuideTip id="profile_overview" title="Your Roast Identity" variant="inline">
        This is your profile — your <strong className="text-zinc-200">Rank</strong> goes up as you win battles, <strong className="text-zinc-200">Aura</strong> is your total score, and <strong className="text-zinc-200">Badges</strong> are earned through milestones. Visit the <strong className="text-zinc-200">Marketplace</strong> to buy Aura skins!
      </GuideTip>

      {/* Profile Header Card */}
      <Card className="rounded-2xl py-5">
        <CardContent className="px-6">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-[#4D7C0F] text-xl font-bold text-white shrink-0">
              {getInitials(user.username)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-zinc-100 truncate">{user.username}</h2>
                <Badge
                  className={`${user.rankColor} bg-red-950/30 border-red-800/50 shrink-0`}
                >
                  {rankIconMap[user.rank] ?? <Shield className="size-4" />}
                  <span className="ml-1">{user.rank}</span>
                </Badge>
              </div>
              <p className="text-sm text-zinc-400 mt-0.5">Member since {formattedDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aura Display */}
      <Card className="rounded-2xl py-5">
        <CardContent className="px-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-shrink-0">
              <p className="text-4xl font-bold text-red-500">{user.aura.toLocaleString()}</p>
              <p className="text-sm font-medium text-zinc-500 mt-0.5">AURA</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-1 min-w-0">
              <div className="flex items-center gap-2 rounded-lg bg-green-950/30 border border-green-800/50 px-3 py-2">
                <TrendingUp className="size-4 text-emerald-400" />
                <span className="text-sm text-zinc-400">Last Roast:</span>
                <span className="text-sm font-semibold text-emerald-400">+{lastRoastAuraChange} Aura</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-red-950/30 border border-red-800/50 px-3 py-2">
                <TrendingDown className="size-4 text-red-500" />
                <span className="text-sm text-zinc-400">This Week:</span>
                <span className="text-sm font-semibold text-red-500">{weekAuraChange} Aura</span>
              </div>
            </div>
          </div>

          {/* CSS Bar Chart — Last 7 Days */}
          <div className="mt-5 pt-5 border-t border-zinc-800">
            <p className="text-xs font-medium text-zinc-400 mb-3">Last 7 Days</p>
            <div className="flex items-end gap-2 h-16">
              {auraHistory.map((val, i) => {
                const height = Math.max(Math.abs(val) / maxAura, 0.08) * 100;
                const isPositive = val >= 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex justify-center">
                      <div
                        className={`w-full max-w-[32px] rounded-sm ${isPositive ? 'bg-red-600' : 'bg-red-400'}`}
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card className="rounded-xl py-4">
          <CardContent className="px-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-red-950/30">
              <Trophy className="size-5 text-red-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-zinc-100">{user.wins}</p>
              <p className="text-xs text-zinc-500">Wins</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl py-4">
          <CardContent className="px-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-red-950/30">
              <History className="size-5 text-red-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-zinc-100">{user.losses}</p>
              <p className="text-xs text-zinc-500">Losses</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl py-4">
          <CardContent className="px-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/15">
              <Star className="size-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-zinc-100">{winRate}%</p>
              <p className="text-xs text-zinc-500">Win Rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl py-4">
          <CardContent className="px-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-red-950/30">
              <Flame className="size-5 text-red-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-zinc-100">{user.streak}</p>
              <p className="text-xs text-zinc-500">Current Streak</p>
              {user.streak >= 3 && (
                <p className="text-[10px] font-medium text-emerald-400 mt-0.5">1.5x Aura Multiplier</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl py-4">
          <CardContent className="px-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-950/30">
              <Coins className="size-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-zinc-100">{user.coins}</p>
              <p className="text-xs text-zinc-500">Coins</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl py-4">
          <CardContent className="px-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-800">
              <Shield className="size-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-zinc-100">{totalRoasts}</p>
              <p className="text-xs text-zinc-500">Total Roasts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges Section */}
      <Card className="rounded-2xl py-5">
        <CardContent className="px-6">
          <h3 className="text-base font-semibold text-zinc-100 mb-4">Badges</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allBadges.map((badgeName) => {
              const isUnlocked = user.badges.includes(badgeName);
              const config = badgeConfig[badgeName];
              return isUnlocked && config ? (
                <div
                  key={badgeName}
                  className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-800 p-3"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-red-950/30 text-red-500">
                    {config.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-100 truncate">{badgeName}</p>
                    <p className="text-xs text-zinc-500 truncate">{config.description}</p>
                  </div>
                </div>
              ) : (
                <div
                  key={badgeName}
                  className="flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-800 p-3 min-h-[72px]"
                >
                  <Shield className="size-5 text-zinc-500" />
                  <p className="text-xs font-medium text-zinc-400">Locked</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Roast History */}
      <Card className="rounded-2xl py-5">
        <CardContent className="px-6">
          <h3 className="text-base font-semibold text-zinc-100 mb-4">Recent Roasts</h3>
          <div className="space-y-3">
            {recentRoastResults.map((roast, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/50 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-zinc-100 truncate">{roast.caseName}</p>
                  <p className="text-xs text-zinc-400">{roast.date}</p>
                </div>
                <div className="flex items-center gap-3 ml-3 shrink-0">
                  <span
                    className={`text-sm font-semibold ${
                      roast.result === 'won' ? 'text-emerald-400' : 'text-red-500'
                    }`}
                  >
                    {roast.result === 'won' ? 'Won' : 'Lost'}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      roast.auraChange >= 0 ? 'text-emerald-400' : 'text-red-500'
                    }`}
                  >
                    {roast.auraChange >= 0 ? '+' : ''}{roast.auraChange} Aura
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={onNavigateToReplays}
            className="mt-4 text-sm font-medium text-red-500 hover:text-red-500 transition-colors"
          >
            View All Roasts →
          </button>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          className="flex-1 border-red-600 text-red-500 hover:bg-red-950/30 hover:text-red-500"
          onClick={onNavigateToMarketplace}
        >
          <Coins className="size-4" />
          Burn Shop
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-emerald-500 text-emerald-400 hover:bg-emerald-500/15 hover:text-emerald-400"
          onClick={onNavigateToReplays}
        >
          <History className="size-4" />
          Roast Replays
        </Button>
      </div>
    </div>
  );
}