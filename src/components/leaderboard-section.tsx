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

interface LeaderboardSectionProps {
  onViewProfile: (userId: string) => void;
}

const sortedUsers = [...mockUsers].sort((a, b) => b.aura - a.aura);
const top3 = sortedUsers.slice(0, 3);

const medalConfig = [
  {
    badge: '#1 CHAMPION',
    badgeClass: 'bg-orange-600 text-white border-none',
    borderClass: 'border-orange-400',
    medalIcon: <Trophy className="size-6 text-orange-500" />,
    sizeClass: 'p-5',
  },
  {
    badge: '#2 ELITE',
    badgeClass: 'bg-stone-200 text-stone-600 border-none',
    borderClass: 'border-stone-600',
    medalIcon: <Medal className="size-6 text-stone-400" />,
    sizeClass: 'p-4',
  },
  {
    badge: '#3 VETERAN',
    badgeClass: 'bg-orange-600/15 text-orange-500 border-none',
    borderClass: 'border-orange-600',
    medalIcon: <Medal className="size-6 text-orange-700" />,
    sizeClass: 'p-4',
  },
];

function avatarBg(index: number): string {
  const colors = ['#EA580C', '#4D7C0F', '#B45309', '#166534', '#9A3412', '#DC2626', '#15803D', '#A16207', '#0F766E', '#C2410C', '#3F6212', '#78716C'];
  return colors[index % colors.length];
}

export default function LeaderboardSection({ onViewProfile }: LeaderboardSectionProps) {
  const currentUserRank = sortedUsers.findIndex(u => u.id === mockCurrentUser.id) + 1;
  const isCurrentInTop10 = currentUserRank <= 10 && currentUserRank > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <Trophy className="size-7 text-orange-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-stone-100">Champions</h1>
        </div>
        <p className="text-stone-500 text-sm mt-1 ml-10">
          Top verdict warriors, ranked by Aura earned in battle
        </p>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {top3.map((user, i) => {
          const config = medalConfig[i];
          return (
            <Card
              key={user.id}
              className={`bg-stone-900 border-2 ${config.borderClass} ${config.sizeClass} ${i === 0 ? 'sm:scale-105' : ''}`}
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
                  {user.avatar.substring(0, 2)}
                </div>

                <div>
                  <h3 className="font-bold text-stone-100 text-sm">{user.username}</h3>
                  <p className="text-stone-400 text-xs mt-0.5">{user.id}</p>
                </div>

                <Badge className="bg-orange-600/15 text-orange-500 border-none text-xs">
                  {user.aura.toLocaleString()} Aura
                </Badge>

                <p className="text-xs text-stone-500">
                  {user.wins}W · {user.winRate}% WR
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full Rankings Table */}
      <Card className="bg-stone-900 border border-stone-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-stone-800/80 hover:bg-stone-800/80">
                <TableHead className="w-12 text-stone-500 text-xs font-medium">#</TableHead>
                <TableHead className="text-stone-500 text-xs font-medium">Fighter</TableHead>
                <TableHead className="text-stone-500 text-xs font-medium text-right">Wins</TableHead>
                <TableHead className="text-stone-500 text-xs font-medium text-right">Win Rate</TableHead>
                <TableHead className="text-stone-500 text-xs font-medium text-right">Aura</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user, index) => {
                const rank = index + 1;
                const isUser = user.id === mockCurrentUser.id;
                return (
                  <TableRow
                    key={user.id}
                    className={`${isUser ? 'bg-orange-950/20' : rank % 2 === 0 ? 'bg-stone-800/30' : 'bg-stone-900'} ${
                      rank === 1 ? 'border-l-4 border-l-orange-500' : ''
                    } cursor-pointer hover:bg-stone-800`}
                    onClick={() => onViewProfile(user.id)}
                  >
                    <TableCell className="text-sm font-bold text-stone-100">{rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="size-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ backgroundColor: avatarBg(index) }}
                        >
                          {user.avatar.substring(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${isUser ? 'text-orange-600' : 'text-stone-100'}`}>
                            {user.username}
                            {isUser && <span className="text-orange-400 ml-1">(You)</span>}
                          </p>
                          <p className="text-xs text-stone-400">{user.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm text-stone-600">{user.wins}</TableCell>
                    <TableCell className="text-right text-sm text-stone-600">{user.winRate}%</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="bg-orange-600/15 text-orange-500 border-none text-xs font-semibold">
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
        <Card className="bg-stone-900 border-2 border-orange-300 sticky bottom-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-orange-950/200 flex items-center justify-center text-xs font-bold text-white">
                  {mockCurrentUser.avatar.substring(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-100">
                    Your Rank: #{currentUserRank}
                  </p>
                  <p className="text-xs text-stone-500">
                    {mockCurrentUser.aura.toLocaleString()} Aura · {mockCurrentUser.winRate}% WR
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-orange-500 border-orange-700/50 hover:bg-orange-950/20 text-xs"
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