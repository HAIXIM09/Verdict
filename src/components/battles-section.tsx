'use client';

import { useState } from 'react';
import {
  Film,
  Trophy,
  Music,
  Gamepad2,
  Tv,
  UtensilsCrossed,
  Cpu,
  Sparkles,
  Flame,
  ArrowLeft,
  Eye,
  Plus,
  Send,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

import { mockBattles, mockCategories, type BattleCase } from '@/lib/mock-data';

interface BattlesSectionProps {
  onSelectBattle: (battleId: string) => void;
  onBack: () => void;
  selectedCategory: string | null;
  onBackToCategories: () => void;
  onSelectCategory?: (category: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Film,
  Trophy,
  Music,
  Gamepad2,
  Tv,
  UtensilsCrossed,
  Cpu,
  Sparkles,
  Flame,
};

function difficultyBadgeStyle(d: string): string {
  switch (d) {
    case 'Bronze': return 'text-stone-500 border-stone-600 bg-stone-800';
    case 'Silver': return 'text-stone-500 border-stone-500 bg-stone-800';
    case 'Gold': return 'text-orange-600 border-orange-300 bg-orange-950/30';
    case 'Platinum': return 'text-amber-700 border-amber-300 bg-amber-950/30';
    default: return 'text-stone-500 border-stone-600 bg-stone-800';
  }
}

function statusBadge(s: string) {
  switch (s) {
    case 'live':
      return <Badge className="bg-red-500/15 text-red-500 border-red-800/50 text-xs">LIVE</Badge>;
    case 'waiting':
      return <Badge className="bg-[#4D7C0F]/20 text-[#4D7C0F] border-[#4D7C0F]/20 text-xs">WAITING</Badge>;
    case 'verdict':
      return <Badge className="bg-orange-600/15 text-orange-500 border-orange-700/50 text-xs">VERDICT</Badge>;
    case 'finished':
      return <Badge className="bg-stone-800 text-stone-500 border-stone-700 text-xs">FINISHED</Badge>;
    default:
      return null;
  }
}

function actionButton(status: string, onClick: () => void) {
  if (status === 'live') {
    return (
      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-8" onClick={onClick}>
        JOIN
      </Button>
    );
  }
  if (status === 'waiting') {
    return (
      <Button size="sm" variant="outline" className="border-[#4D7C0F] text-[#4D7C0F] hover:bg-[#4D7C0F]/20 text-xs h-8" onClick={onClick}>
        SPECTATE
      </Button>
    );
  }
  return (
    <Button size="sm" variant="outline" className="border-stone-600 text-stone-500 text-xs h-8" onClick={onClick}>
      VIEW VERDICT
    </Button>
  );
}

function BattleCard({ battle, onSelect }: { battle: BattleCase; onSelect: () => void }) {
  return (
    <Card className="bg-stone-900 border border-stone-700 hover:shadow-md transition-all">
      <CardContent className="p-5">
        {/* Top Row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-stone-100 truncate">
              {battle.sideA} ⚔️ {battle.sideB}
            </h3>
          </div>
          {statusBadge(battle.status)}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <Badge className={`text-xs ${difficultyBadgeStyle(battle.difficulty)}`}>
            {battle.difficulty}
          </Badge>
          <Badge variant="secondary" className="text-xs bg-[#4D7C0F]/20 text-[#4D7C0F] border-none">
            {battle.category}
          </Badge>
        </div>

        {/* Team Slots */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-stone-500 font-medium mb-1">Team {battle.sideA}</span>
            <div className="flex gap-1">
              {battle.teamA.map((player, i) => (
                <div
                  key={`a-${i}`}
                  title={player?.username}
                  className={`size-6 rounded-full border-2 flex items-center justify-center text-[8px] font-bold text-white ${
                    player
                      ? 'bg-[#4D7C0F] border-[#4D7C0F]'
                      : 'bg-transparent border-stone-600'
                  }`}
                >
                  {player ? getInitials(player.username) : null}
                </div>
              ))}
            </div>
          </div>

          <span className="text-stone-400 font-bold text-sm">VS</span>

          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-stone-500 font-medium mb-1">Team {battle.sideB}</span>
            <div className="flex gap-1">
              {battle.teamB.map((player, i) => (
                <div
                  key={`b-${i}`}
                  title={player?.username}
                  className={`size-6 rounded-full border-2 flex items-center justify-center text-[8px] font-bold text-white ${
                    player
                      ? 'bg-orange-950/30 border-orange-500'
                      : 'bg-transparent border-stone-600'
                  }`}
                >
                  {player ? getInitials(player.username) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            {battle.spectators.length} spectators
          </span>
          {battle.viewers > 0 && (
            <span>{battle.viewers} watching</span>
          )}
          <span><Flame className="size-3 text-orange-500 inline" /> {battle.auraStake} Aura at stake</span>
        </div>

        {/* Action */}
        <div className="flex justify-end">
          {actionButton(battle.status, onSelect)}
        </div>
      </CardContent>
    </Card>
  );
}

export default function BattlesSection({
  onSelectBattle,
  onBack,
  selectedCategory,
  onBackToCategories,
  onSelectCategory,
}: BattlesSectionProps) {
  const [filter, setFilter] = useState<string>('all');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitCategory, setSubmitCategory] = useState('');
  const [submitSideA, setSubmitSideA] = useState('');
  const [submitSideB, setSubmitSideB] = useState('');

  // Category Grid
  if (selectedCategory === null) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-stone-500">
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-stone-100">Battle Arena</h1>
            <p className="text-stone-500 text-sm">Choose a category to find your next battle</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockCategories.map(cat => {
            const IconComp = iconMap[cat.icon];
            return (
              <Card
                key={cat.id}
                className="bg-stone-900 rounded-xl border border-stone-700 p-6 hover:shadow-md hover:border-orange-500 transition-all cursor-pointer"
                onClick={() => onSelectCategory?.(cat.name)}
              >
                <CardContent className="p-0 flex flex-col items-center text-center gap-3">
                  <div className={`size-12 rounded-full flex items-center justify-center ${cat.color}`}>
                    {IconComp && <IconComp className="size-6" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-100 text-sm">{cat.name}</h3>
                    <Badge variant="secondary" className="mt-1.5 text-xs bg-stone-800 text-stone-400 border-none">
                      {cat.battleCount} battles
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Inline submit form */}
        <div className="mt-8">
          <Button
            variant="outline"
            className="border-dashed border-stone-600 text-stone-500 hover:text-orange-600 hover:border-orange-500 w-full py-8 flex flex-col items-center gap-2"
            onClick={() => setShowSubmitForm(!showSubmitForm)}
          >
            <Plus className="size-5" />
            <span>Submit a New Case</span>
          </Button>

          {showSubmitForm && (
            <Card className="mt-4 bg-stone-900 border border-stone-700">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-stone-100">Submit a Case for Voting</h3>
                <p className="text-stone-500 text-sm">Community will upvote — if popular, it becomes an official battle!</p>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-stone-400">Category</Label>
                    <Select value={submitCategory} onValueChange={setSubmitCategory}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCategories.map(cat => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm text-stone-400">Side A</Label>
                    <Input
                      placeholder="e.g. Pushpa"
                      value={submitSideA}
                      onChange={e => setSubmitSideA(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-stone-400">Side B</Label>
                    <Input
                      placeholder="e.g. KGF"
                      value={submitSideB}
                      onChange={e => setSubmitSideB(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <Button className="bg-orange-600 hover:bg-orange-700 text-white w-full">
                    <Send className="size-4" />
                    Submit for Voting
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Category Battles View
  const categoryBattles = mockBattles.filter(b => b.category === selectedCategory);
  const filteredBattles = filter === 'all'
    ? categoryBattles
    : categoryBattles.filter(b => b.status === filter);

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'live', label: 'Live' },
    { key: 'waiting', label: 'Waiting' },
    { key: 'finished', label: 'Finished' },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBackToCategories} className="text-stone-500">
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-stone-100">{selectedCategory}</h1>
          <p className="text-stone-500 text-sm">{categoryBattles.length} battles in this category</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {filterTabs.map(tab => (
          <Button
            key={tab.key}
            variant={filter === tab.key ? 'default' : 'outline'}
            size="sm"
            className={
              filter === tab.key
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'border-stone-700 text-stone-500 hover:text-stone-300 hover:border-stone-600'
            }
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Battle Cards Grid */}
      {filteredBattles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-stone-400 text-sm">No battles found with this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBattles.map(battle => (
            <BattleCard
              key={battle.id}
              battle={battle}
              onSelect={() => onSelectBattle(battle.id)}
            />
          ))}
        </div>
      )}

      {/* Submit a Case */}
      <div className="mt-8">
        <Button
          variant="outline"
          className="border-dashed border-stone-600 text-stone-500 hover:text-orange-600 hover:border-orange-500 w-full py-8 flex flex-col items-center gap-2"
          onClick={() => setShowSubmitForm(!showSubmitForm)}
        >
          <Plus className="size-5" />
          <span>Submit a Case for {selectedCategory}</span>
        </Button>

        {showSubmitForm && (
          <Card className="mt-4 bg-stone-900 border border-stone-700">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-stone-100">Submit a Case for Voting</h3>
              <p className="text-stone-500 text-sm">Community will upvote — if popular, it becomes an official battle!</p>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-stone-400">Side A</Label>
                  <Input
                    placeholder={`e.g. Enter ${selectedCategory} option`}
                    value={submitSideA}
                    onChange={e => setSubmitSideA(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm text-stone-400">Side B</Label>
                  <Input
                    placeholder="e.g. Enter opponent"
                    value={submitSideB}
                    onChange={e => setSubmitSideB(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button className="bg-orange-600 hover:bg-orange-700 text-white w-full">
                  <Send className="size-4" />
                  Submit for Voting
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}