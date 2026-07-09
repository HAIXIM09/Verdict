'use client';

import { Trophy, Medal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockUsers, mockCurrentUser } from '@/lib/mock-data';
import { GuideTip } from '@/components/newbie-guide';

interface RankingsSectionProps {
  onViewProfile: (userId: string) => void;
}

const sortedUsers = [...mockUsers].sort((a, b) => b.aura - a.aura);
const top3 = sortedUsers.slice(0, 3);

const medalConfig = [
  {
    badge: '#1 INFERNO',
    badgeClass: 'bg-red-600 text-white border-none',
    borderClass: 'border-orange-400',
    medalIcon: <Trophy className="size-6 text-red-400" />,
    sizeClass: 'p-5',
  },
  {
    badge: '#2 BLAZE',
    badgeClass: 'bg-zinc-700 text-zinc-200 border-none',
    borderClass: 'border-zinc-700',
    medalIcon: <Medal className="size-6 text-zinc-400" />,
    sizeClass: 'p-4',
  },
  {
    badge: '#3 EMBER',
    badgeClass: 'bg-red-600/15 text-red-400 border-none',
    borderClass: 'border-red-600',
    medalIcon: <Medal className="size-6 text-red-500" />,
    sizeClass: 'p-4',
  },
];

function avatarBg(index: number): string {
  const colors = ['#EA580C', '#4D7C0F', '#B45309', '#166534', '#9A3412', '#DC2626', '#15803D', '#A16207', '#0F766E', '#C2410C', '#3F6212', '#78716C'];
  return colors[index % colors.length];
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function RankingsSection({ onViewProfile }: RankingsSectionProps) {
  const currentUserRank = sortedUsers.findIndex(u => u.id === mockCurrentUser.id) + 1;
  const isCurrentInTop10 = currentUserRank <= 10 && currentUserRank > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <Trophy className="size-7 text-red-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">Roast Kings</h1>
        </div>
        <p className="text-zinc-500 text-sm mt-1 ml-10">
          Top roast warriors, ranked by Aura earned in roast
        </p>
      </div>

      <GuideTip id="leaderboard_explain" title="Aura = Your Score" variant="inline">
        The leaderboard ranks every roaster by total <strong className="text-zinc-200">Aura</strong> — the points you earn from winning battles. Win more, roast harder, and climb to the top. Top 3 get special badges!
      </GuideTip>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {top3.map((user, i) => {
          const config = medalConfig[i];
          return (
            <Card
              key={user.id}
              className={`bg-zinc-900 border-2 ${config.borderClass} ${config.sizeClass} ${i === 0 ? 'sm:scale-105' : ''}`}
            >
              <CardContent className="p-0 flex flex-col items-center text-center gap-3">
                <div className="flex items-center gap-2">
                  {config.medalIcon}
                  <Badge className={`text-xs ${config.badgeClass}`}>
                    {config.badge}
                  </Badge>
                </div>

                <div
                  className="size-14 rounded-full flex items-center justify-center text-lg font-bold text-white"
                  style={{ backgroundColor: avatarBg(i) }}
                >
                  {getInitials(user.username)}
                </div>

                <div>
                  <h3 className="font-bold text-zinc-100 text-sm">{user.username}</h3>
                  <p className="text-zinc-400 text-xs mt-0.5">{user.rank}</p>
                </div>

                <Badge className="bg-red-600/15 text-red-400 border-none text-xs">
                  {user.aura.toLocaleString()} Aura
                </Badge>

                <p className="text-xs text-zinc-500">
                  {user.wins}W · {user.winRate}% WR
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full Rankings Table */}
      <Card className="bg-zinc-900 border border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-800/80 hover:bg-zinc-800/80">
                <TableHead className="w-12 text-zinc-500 text-xs font-medium">#</TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium">Roaster</TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium text-right">Wins</TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium text-right">Win Rate</TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium text-right">Aura</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user, index) => {
                const rank = index + 1;
                const isUser = user.id === mockCurrentUser.id;
                return (
                  <TableRow
                    key={user.id}
                    className={`${isUser ? 'bg-red-950/20' : rank % 2 === 0 ? 'bg-zinc-800/30' : 'bg-zinc-900'} ${
                      rank === 1 ? 'border-l-4 border-l-red-500' : ''
                    } cursor-pointer hover:bg-zinc-800`}
                    onClick={() => onViewProfile(user.id)}
                  >
                    <TableCell className="text-sm font-bold text-zinc-100">{rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="size-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ backgroundColor: avatarBg(index) }}
                        >
                          {getInitials(user.username)}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${isUser ? 'text-red-500' : 'text-zinc-100'}`}>
                            {user.username}
                            {isUser && <span className="text-red-400 ml-1">(You)</span>}
                          </p>
                          <p className="text-xs text-zinc-400">{user.rank}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm text-zinc-300">{user.wins}</TableCell>
                    <TableCell className="text-right text-sm text-zinc-300">{user.winRate}%</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="bg-red-600/15 text-red-400 border-none text-xs font-semibold">
                        {user.aura.toLocaleString()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Your Rank Sticky Footer */}
      {!isCurrentInTop10 && currentUserRank > 0 && (
        <Card className="bg-zinc-900 border-2 border-red-400 sticky bottom-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-red-950/20 flex items-center justify-center text-xs font-bold text-white">
                  {getInitials(mockCurrentUser.username)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">
                    Your Rank: #{currentUserRank}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {mockCurrentUser.aura.toLocaleString()} Aura · {mockCurrentUser.winRate}% WR
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-400 border-red-700/50 hover:bg-red-950/20 text-xs"
                onClick={() => onViewProfile(mockCurrentUser.id)}
              >
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}