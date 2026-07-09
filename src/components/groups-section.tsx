'use client';

import { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockGroups } from '@/lib/mock-data';

interface GroupsSectionProps {
  onChallengeFriend: (groupId: string) => void;
}

const categoryColors: Record<string, string> = {
  Movies: 'bg-red-600/15 text-red-400 border-red-700/50',
  Games: 'bg-red-600/15 text-red-400 border-red-700/50',
  Anime: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  Sports: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Food: 'bg-red-600/15 text-red-400 border-red-700/50',
  Music: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  Tech: 'bg-red-600/15 text-red-400 border-red-700/50',
  Viral: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Cartoons: 'bg-yellow-600/15 text-yellow-400 border-yellow-600/30',
};

export default function GroupsSection({ onChallengeFriend }: GroupsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const myGroups = mockGroups.filter(
    (g) => g.isJoined && g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const discoverGroups = mockGroups.filter(
    (g) => !g.isJoined && g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Roast Arena Groups</h2>
        <p className="text-sm text-zinc-500 mt-1">Join communities, find roast partners</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
        <Input
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* My Crews */}
      {myGroups.length > 0 && (
        <section>
          <h3 className="text-base font-semibold text-zinc-100 mb-3">My Crews</h3>
          <div className="space-y-3">
            {myGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-shadow hover:shadow-lg hover:shadow-black/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-zinc-100">{group.name}</h4>
                      <Badge className={categoryColors[group.category] ?? 'bg-zinc-800 text-zinc-400 border-zinc-800'}>
                        {group.category}
                      </Badge>
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20">
                        Joined
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">{group.description}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-zinc-400">
                      <Users className="size-3.5" />
                      <span>{group.members.toLocaleString()} members</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-red-600 text-white hover:bg-red-700 shrink-0 mt-1"
                    onClick={() => onChallengeFriend(group.id)}
                  >
                    Challenge
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Find Crews */}
      {discoverGroups.length > 0 && (
        <section>
          <h3 className="text-base font-semibold text-zinc-100 mb-3">Find Crews</h3>
          <div className="space-y-3">
            {discoverGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-shadow hover:shadow-lg hover:shadow-black/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-zinc-100">{group.name}</h4>
                      <Badge className={categoryColors[group.category] ?? 'bg-zinc-800 text-zinc-400 border-zinc-800'}>
                        {group.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">{group.description}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-zinc-400">
                      <Users className="size-3.5" />
                      <span>{group.members.toLocaleString()} members</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/15 hover:text-emerald-400 shrink-0 mt-1"
                  >
                    Join
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {myGroups.length === 0 && discoverGroups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500 text-sm">No groups found matching &quot;{searchQuery}&quot;</p>
        </div>
      )}
    </div>
  );
}