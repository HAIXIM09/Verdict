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
  Swords,
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
import { TiltCard } from '@/components/ui/tilt-card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

import { mockBattles, mockCategories, type BattleCase } from '@/lib/mock-data';
import { GuideTip } from '@/components/newbie-guide';

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
    case 'Bronze': return 'text-zinc-500 border-zinc-700 bg-zinc-800';
    case 'Silver': return 'text-zinc-500 border-zinc-700 bg-zinc-800';
    case 'Gold': return 'text-pink-500 border-pink-400 bg-pink-950/30';
    case 'Platinum': return 'text-violet-300 border-violet-500/30 bg-violet-950/30';
    default: return 'text-zinc-500 border-zinc-700 bg-zinc-800';
  }
}

function statusBadge(s: string) {
  switch (s) {
    case 'live':
      return <Badge className="bg-pink-500/15 text-pink-500 border-pink-800/50 text-xs">LIVE</Badge>;
    case 'waiting':
      return <Badge className="bg-violet-500/15 text-violet-400 border-violet-500/20 text-xs">WAITING</Badge>;
    case 'verdict':
      return <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-700/50 text-xs">SCORING</Badge>;
    case 'finished':
      return <Badge className="bg-zinc-800 text-zinc-500 border-zinc-800 text-xs">FINISHED</Badge>;
    default:
      return null;
  }
}

function actionButton(status: string, onClick: () => void) {
  if (status === 'live') {
    return (
      <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white text-xs h-8" onClick={onClick}>
        JOIN
      </Button>
    );
  }
  if (status === 'waiting') {
    return (
      <Button size="sm" variant="outline" className="border-violet-500 text-violet-400 hover:bg-violet-500/15 text-xs h-8" onClick={onClick}>
        SPECTATE
      </Button>
    );
  }
  return (
    <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-500 text-xs h-8" onClick={onClick}>
      View Results
    </Button>
  );
}

function BattleCard({ battle, onSelect }: { battle: BattleCase; onSelect: () => void }) {
  return (
    <TiltCard maxTilt={4}>
      <Card className="bg-zinc-900 border border-zinc-800 hover:shadow-md transition-all cursor-pointer">
        <CardContent className="p-5">
          {/* Top Row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-zinc-100 truncate">
                {battle.sideA} <Swords className="size-4 inline text-pink-500 mx-1.5" /> {battle.sideB}
              </h3>
            </div>
            {statusBadge(battle.status)}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <Badge className={`text-xs ${difficultyBadgeStyle(battle.difficulty)}`}>
              {battle.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-xs bg-cyan-500/10 text-cyan-400 border-none">
              {battle.category}
            </Badge>
          </div>

          {/* Team Slots */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-zinc-500 font-medium mb-1">Team {battle.sideA}</span>
              <div className="flex gap-1">
                {battle.teamA.map((player, i) => (
                  <div
                    key={`a-${i}`}
                    title={player?.username}
                    className={`size-6 rounded-full border-2 flex items-center justify-center text-[8px] font-bold text-white ${
                      player
                        ? 'bg-[#8B5CF6]/10 border-violet-500 text-violet-400'
                        : 'bg-transparent border-zinc-700'
                    }`}
                  >
                    {player ? getInitials(player.username) : null}
                  </div>
                ))}
              </div>
            </div>

            <span className="text-zinc-400 font-bold text-sm">VS</span>

            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-zinc-500 font-medium mb-1">Team {battle.sideB}</span>
              <div className="flex gap-1">
                {battle.teamB.map((player, i) => (
                  <div
                    key={`b-${i}`}
                    title={player?.username}
                    className={`size-6 rounded-full border-2 flex items-center justify-center text-[8px] font-bold text-white ${
                      player
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                        : 'bg-transparent border-zinc-700'
                    }`}
                  >
                    {player ? getInitials(player.username) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-4">
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {battle.spectators.length} spectators
            </span>
            {battle.viewers > 0 && (
              <span>{battle.viewers} watching</span>
            )}
            <span><Flame className="size-3 text-pink-400 inline" /> {battle.auraStake} Aura at stake</span>
          </div>

          {/* Action */}
          <div className="flex justify-end">
            {actionButton(battle.status, onSelect)}
          </div>
        </CardContent>
      </Card>
    </TiltCard>
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
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-zinc-500">
              <ArrowLeft className="size-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-heading text-zinc-100">Arenas</h1>
              <p className="text-zinc-500 text-sm">Pick a category. Start a debate.</p>
            </div>
          </div>
        </ScrollReveal>

        <GuideTip id="arena_categories" title="Start Here" variant="inline" className="mb-4">
          Each category contains live and upcoming debates. <strong className="text-zinc-200">Bronze</strong> is easiest for beginners. <strong className="text-zinc-200">Platinum</strong> arenas have the highest Aura rewards — but only the sharpest debaters survive. Pick a category to see available arenas!
        </GuideTip>

        <ScrollReveal>
          <div className="stagger-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockCategories.map(cat => {
              const IconComp = iconMap[cat.icon];
              return (
                <TiltCard key={cat.id} maxTilt={5}>
                  <Card
                    className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 hover:shadow-md hover:border-pink-500 transition-all duration-300 cursor-pointer"
                    onClick={() => onSelectCategory?.(cat.name)}
                  >
                    <CardContent className="p-0 flex flex-col items-center text-center gap-3">
                      <div className={`size-12 rounded-full flex items-center justify-center ${cat.color}`}>
                        {IconComp && <IconComp className="size-6" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-100 text-sm">{cat.name}</h3>
                        <Badge variant="secondary" className="mt-1.5 text-xs bg-zinc-800 text-zinc-400 border-none">
                          {cat.battleCount} arenas
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Inline submit form */}
        <div className="stagger-2 mt-8">
          <Button
            variant="outline"
            className="btn-primary w-full py-8 flex flex-col items-center gap-2"
            onClick={() => setShowSubmitForm(!showSubmitForm)}
          >
            <Plus className="size-5" />
            <span>Start a Debate</span>
          </Button>

          {showSubmitForm && (
            <Card className="mt-4 bg-zinc-900 border border-zinc-800">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-zinc-100">Start a Debate</h3>
                <p className="text-zinc-500 text-sm">Create a new arena — if it gets traction, it goes live.</p>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-zinc-400">Category</Label>
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
                    <Label className="text-sm text-zinc-400">Side A</Label>
                    <Input
                      placeholder="e.g. Pushpa"
                      value={submitSideA}
                      onChange={e => setSubmitSideA(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-zinc-400">Side B</Label>
                    <Input
                      placeholder="e.g. KGF"
                      value={submitSideB}
                      onChange={e => setSubmitSideB(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <Button className="btn-primary w-full">
                    <Send className="size-4" />
                    Post It
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Category Arenas View
  const categoryBattles = mockBattles.filter(b => b.category === selectedCategory);
  const filteredBattles = filter === 'all'
    ? categoryBattles
    : categoryBattles.filter(b => b.status === filter);

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'live', label: 'Live' },
    { key: 'waiting', label: 'Waiting' },
  ];

  return (
    <div>
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={onBackToCategories} className="text-zinc-500">
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">{selectedCategory}</h1>
            <p className="text-zinc-500 text-sm">{categoryBattles.length} arenas in this category</p>
          </div>
        </div>
      </ScrollReveal>

        <GuideTip id="arena_battle_list" title="Choosing an Arena" variant="inline" className="mb-4">
          <strong className="text-zinc-200">LIVE</strong> arenas are happening now — jump in! <strong className="text-zinc-200">WAITING</strong> arenas need players — great for your first debate. Use the filters above to find your preferred match type.
        </GuideTip>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {filterTabs.map(tab => (
          <Button
            key={tab.key}
            variant={filter === tab.key ? 'default' : 'outline'}
            size="sm"
            className={
              filter === tab.key
                ? 'bg-pink-600 text-white hover:bg-pink-700 transition-all duration-300'
                : 'border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-all duration-300'
            }
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Arena Cards Grid */}
      {filteredBattles.length === 0 ? (
        <ScrollReveal delay={0.05}>
          <div className="text-center py-16">
            <div className="size-16 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-5">
              <Swords className="size-7 text-violet-400" />
            </div>
            <p className="text-zinc-300 text-base font-semibold mb-1">No arenas here yet</p>
            <p className="text-zinc-500 text-sm mb-6">Be the first to start one.</p>
            <Button
              className="btn-primary"
              onClick={() => setShowSubmitForm(true)}
            >
              <Plus className="size-4 mr-2" />
              Start a Debate
            </Button>
          </div>
        </ScrollReveal>
      ) : (
        <ScrollReveal delay={0.1}>
          <div className="stagger-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBattles.map(battle => (
              <BattleCard
                key={battle.id}
                battle={battle}
                onSelect={() => onSelectBattle(battle.id)}
              />
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Submit a Case */}
      <div className="mt-8">
        <Button
          variant="outline"
          className="btn-primary w-full py-8 flex flex-col items-center gap-2"
          onClick={() => setShowSubmitForm(!showSubmitForm)}
        >
          <Plus className="size-5" />
          <span>Start a Debate for {selectedCategory}</span>
        </Button>

        {showSubmitForm && (
          <Card className="mt-4 bg-zinc-900 border border-zinc-800">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-zinc-100">Start a Debate</h3>
              <p className="text-zinc-500 text-sm">Create a new arena — if it gets traction, it goes live.</p>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-zinc-400">Side A</Label>
                  <Input
                    placeholder={`e.g. Enter ${selectedCategory} option`}
                    value={submitSideA}
                    onChange={e => setSubmitSideA(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm text-zinc-400">Side B</Label>
                  <Input
                    placeholder="e.g. Enter opponent"
                    value={submitSideB}
                    onChange={e => setSubmitSideB(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button className="btn-primary w-full">
                  <Send className="size-4" />
                  Post It
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}