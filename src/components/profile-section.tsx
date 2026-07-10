'use client';

import { useState, useEffect, useCallback } from 'react';
import { Flame, Coins, Trophy, Star, TrendingUp, TrendingDown, History, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TiltCard } from '@/components/ui/tilt-card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { GuideTip } from '@/components/newbie-guide';

interface ProfileData {
  id: string;
  username: string;
  avatar: string;
  aura: number;
  wins: number;
  losses: number;
  streak: number;
  rank: string;
  createdAt: string;
  totalBattles: number;
}

const allBadges = ['Streak King', 'Wordsmith', 'Top 10', 'Unstoppable', 'Crowd Favorite', 'Perfect Game'];

const badgeConfig: Record<string, { icon: React.ReactNode; description: string }> = {
  'Streak King': { icon: <Flame className="size-5" />, description: 'Win 3+ in a row. They can\'t stop you.' },
  'Wordsmith': { icon: <Star className="size-5" />, description: 'Win 50+ debates. Your words hit different.' },
  'Top 10': { icon: <Trophy className="size-5" />, description: 'Top 10 on the leaderboard. Elite territory.' },
  'Unstoppable': { icon: <Shield className="size-5" />, description: 'Win 10+ in a row. Absolutely unstoppable.' },
};

const rankIconMap: Record<string, React.ReactNode> = {
  Citizen: <Shield className="size-4" />,
  Lawyer: <Shield className="size-4" />,
  Judge: <Trophy className="size-4" />,
  'Supreme Court': <Star className="size-4" />,
  Legend: <Trophy className="size-4" />,
  'New Blood': <Shield className="size-4" />,
  'Hot Take': <Flame className="size-4" />,
  Elite: <Star className="size-4" />,
  Rising: <Star className="size-4" />,
  Goat: <Trophy className="size-4" />,
};

function getInitials(name: string): string { return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }

function getRankColor(rank: string): string {
  switch (rank) {
    case 'Goat': return 'text-pink-400';
    case 'Elite': return 'text-violet-400';
    case 'Rising': return 'text-cyan-400';
    case 'Hot Take': return 'text-pink-400';
    default: return 'text-zinc-500';
  }
}

interface ProfileSectionProps {
  userId: string | null;
  username?: string;
  onNavigateToReplays: () => void;
  onNavigateToMarketplace: () => void;
}

export default function ProfileSection({ userId, username, onNavigateToReplays, onNavigateToMarketplace }: ProfileSectionProps) {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!username) {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            const u = data.user;
            const totalBattles = u.wins + u.losses;
            setUser({
              id: u.id,
              username: u.username,
              avatar: u.avatar,
              aura: u.aura,
              wins: u.wins,
              losses: u.losses,
              streak: u.streak,
              rank: u.rank,
              createdAt: new Date().toISOString(),
              totalBattles,
            });
          }
        }
      } catch { /* ignore */ }
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/user/${username}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [username]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="size-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <Shield className="size-10 text-zinc-500 mx-auto mb-3" />
        <p className="text-zinc-500 text-sm">Profile not found.</p>
      </div>
    );
  }

  const totalDebates = user.wins + user.losses;
  const winRate = totalDebates > 0 ? Math.round((user.wins / totalDebates) * 100) : 0;
  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      <GuideTip id="profile_overview" title="Your Profile" variant="inline">
        This is your profile — your <strong className="text-zinc-200">Rank</strong> goes up as you win debates, <strong className="text-zinc-200">Aura</strong> is your total score. Visit the <strong className="text-zinc-200">Shop</strong> to customize your look.
      </GuideTip>

      {/* Profile Header Card */}
      <Card className="gradient-border rounded-2xl py-5">
        <CardContent className="px-6">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-[#8B5CF6] text-xl font-bold text-white shrink-0">
              {user.avatar || getInitials(user.username)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-zinc-100 truncate">{user.username}</h2>
                <Badge
                  className={`${getRankColor(user.rank)} bg-pink-950/30 border-pink-800/50 shrink-0`}
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
      <ScrollReveal>
        <Card className="rounded-2xl py-5">
          <CardContent className="px-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-shrink-0">
                <p className="text-4xl font-bold font-mono-stat text-pink-500">{user.aura.toLocaleString()}</p>
                <p className="text-sm font-medium text-zinc-500 mt-0.5">AURA</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-1 min-w-0">
                <div className="flex items-center gap-2 rounded-lg bg-pink-950/20 border border-pink-800/40 px-3 py-2">
                  <TrendingUp className="size-4 text-emerald-400" />
                  <span className="text-sm text-zinc-400">Win Rate:</span>
                  <span className="text-sm font-semibold text-emerald-400 font-mono-stat">{winRate}%</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-pink-950/30 border border-pink-800/50 px-3 py-2">
                  <Flame className="size-4 text-pink-500" />
                  <span className="text-sm text-zinc-400">Streak:</span>
                  <span className="text-sm font-semibold text-pink-500 font-mono-stat">{user.streak}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Stats Grid */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <TiltCard maxTilt={3}>
            <Card className="rounded-xl py-4">
              <CardContent className="px-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-pink-950/30">
                  <Trophy className="size-5 text-pink-500" />
                </div>
                <div>
                  <p className="text-lg font-bold font-mono-stat text-zinc-100">{user.wins}</p>
                  <p className="text-xs text-zinc-500">Wins</p>
                </div>
              </CardContent>
            </Card>
          </TiltCard>

          <TiltCard maxTilt={3}>
            <Card className="rounded-xl py-4">
              <CardContent className="px-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-pink-950/30">
                  <History className="size-5 text-pink-500" />
                </div>
                <div>
                  <p className="text-lg font-bold font-mono-stat text-zinc-100">{user.losses}</p>
                  <p className="text-xs text-zinc-500">Losses</p>
                </div>
              </CardContent>
            </Card>
          </TiltCard>

          <TiltCard maxTilt={3}>
            <Card className="rounded-xl py-4">
              <CardContent className="px-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-violet-500/15">
                  <Star className="size-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-lg font-bold font-mono-stat text-zinc-100">{winRate}%</p>
                  <p className="text-xs text-zinc-500">Win Rate</p>
                </div>
              </CardContent>
            </Card>
          </TiltCard>

          <TiltCard maxTilt={3}>
            <Card className="rounded-xl py-4">
              <CardContent className="px-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-pink-950/30">
                  <Flame className="size-5 text-pink-500" />
                </div>
                <div>
                  <p className="text-lg font-bold font-mono-stat text-zinc-100">{user.streak}</p>
                  <p className="text-xs text-zinc-500">Current Streak</p>
                  {user.streak >= 3 && (
                    <p className="text-[10px] font-medium text-emerald-400 mt-0.5">1.5x Aura Multiplier</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TiltCard>

          <TiltCard maxTilt={3}>
            <Card className="rounded-xl py-4">
              <CardContent className="px-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-800">
                  <Shield className="size-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-lg font-bold font-mono-stat text-zinc-100">{totalDebates}</p>
                  <p className="text-xs text-zinc-500">Total Debates</p>
                </div>
              </CardContent>
            </Card>
          </TiltCard>
        </div>
      </ScrollReveal>

      {/* Badges Section */}
      <ScrollReveal delay={0.2}>
        <Card className="rounded-2xl py-5">
          <CardContent className="px-6">
            <h3 className="text-base font-semibold font-heading text-zinc-100 mb-4">Badges</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allBadges.map((badgeName) => {
                const isUnlocked = badgeName === 'Streak King' && user.streak >= 3;
                const config = badgeConfig[badgeName];
                return isUnlocked && config ? (
                  <TiltCard key={badgeName} maxTilt={3}>
                    <div
                      className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-800 p-3"
                    >
                      <div className="flex size-10 items-center justify-center rounded-full bg-pink-950/30 text-pink-500">
                        {config.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-100 truncate">{badgeName}</p>
                        <p className="text-xs text-zinc-500 truncate">{config.description}</p>
                      </div>
                    </div>
                  </TiltCard>
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
      </ScrollReveal>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <MagneticButton
          className="flex-1 flex items-center justify-center gap-2 rounded-md border border-pink-600 bg-transparent text-pink-500 hover:bg-pink-950/30 hover:text-pink-500 px-4 py-2 text-sm font-medium transition-colors"
          onClick={onNavigateToMarketplace}
        >
          <Coins className="size-4" />
          Shop
        </MagneticButton>
        <MagneticButton
          className="flex-1 flex items-center justify-center gap-2 rounded-md border border-violet-500 bg-transparent text-violet-400 hover:bg-violet-500/15 hover:text-violet-400 px-4 py-2 text-sm font-medium transition-colors"
          onClick={onNavigateToReplays}
        >
          <History className="size-4" />
          Replays
        </MagneticButton>
      </div>
    </div>
  );
}