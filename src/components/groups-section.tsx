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
  Movies: 'bg-orange-600/15 text-orange-400 border-orange-700/50',
  Games: 'bg-orange-600/15 text-orange-400 border-orange-700/50',
  Anime: 'bg-stone-800 text-stone-400 border-stone-600',
  Sports: 'bg-[#4D7C0F]/20 text-[#4D7C0F] border-[#4D7C0F]/30',
  Food: 'bg-orange-600/15 text-orange-400 border-orange-700/50',
  Music: 'bg-stone-800 text-stone-400 border-stone-600',
  Tech: 'bg-orange-600/15 text-orange-400 border-orange-700/50',
  Viral: 'bg-[#4D7C0F]/20 text-[#4D7C0F] border-[#4D7C0F]/30',
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
        <h2 className="text-2xl font-bold text-stone-100">Verdict Groups</h2>
        <p className="text-sm text-stone-500 mt-1">Join communities, find battle partners</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
        <Input
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* My Groups */}
      {myGroups.length > 0 && (
        <section>
          <h3 className="text-base font-semibold text-stone-100 mb-3">My Groups</h3>
          <div className="space-y-3">
            {myGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-xl border border-stone-700 bg-stone-900 p-4 transition-shadow hover:shadow-lg hover:shadow-black/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-stone-100">{group.name}</h4>
                      <Badge className={categoryColors[group.category] ?? 'bg-stone-800 text-stone-400 border-stone-700'}>
                        {group.category}
                      </Badge>
                      <Badge className="bg-[#4D7C0F]/20 text-[#4D7C0F] border-[#4D7C0F]/20">
                        Joined
                      </Badge>
                    </div>
                    <p className="text-sm text-stone-500 mt-1">{group.description}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-stone-400">
                      <Users className="size-3.5" />
                      <span>{group.members.toLocaleString()} members</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-orange-600 text-white hover:bg-orange-700 shrink-0 mt-1"
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

      {/* Discover Groups */}
      {discoverGroups.length > 0 && (
        <section>
          <h3 className="text-base font-semibold text-stone-100 mb-3">Discover Groups</h3>
          <div className="space-y-3">
            {discoverGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-xl border border-stone-700 bg-stone-900 p-4 transition-shadow hover:shadow-lg hover:shadow-black/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-stone-100">{group.name}</h4>
                      <Badge className={categoryColors[group.category] ?? 'bg-stone-800 text-stone-400 border-stone-700'}>
                        {group.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-stone-500 mt-1">{group.description}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-stone-400">
                      <Users className="size-3.5" />
                      <span>{group.members.toLocaleString()} members</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#4D7C0F] text-[#4D7C0F] hover:bg-[#4D7C0F]/20 hover:text-[#4D7C0F] shrink-0 mt-1"
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
          <p className="text-stone-500 text-sm">No groups found matching &quot;{searchQuery}&quot;</p>
        </div>
      )}
    </div>
  );
}