'use client';

import { useState } from 'react';
import { ArrowLeft, Flame, Shield, Star, Trophy, Sparkles, Crown, Zap, Target, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { mockMarketplaceItems, mockCurrentUser, type MarketplaceItem } from '@/lib/mock-data';

interface AuraMarketplaceProps {
  onBack: () => void;
}

const rarityColors: Record<MarketplaceItem['rarity'], { dot: string; border: string; label: string }> = {
  common: { dot: 'bg-stone-400', border: 'border-zinc-700', label: 'Common' },
  rare: { dot: 'bg-[#4D7C0F]', border: 'border-emerald-500/40', label: 'Rare' },
  epic: { dot: 'bg-amber-600', border: 'border-amber-400', label: 'Epic' },
  legendary: { dot: 'bg-red-600', border: 'border-orange-400', label: 'Legendary' },
};

const typeIcons: Record<MarketplaceItem['type'], React.ReactNode> = {
  frame: <Shield className="size-4" />,
  title: <Star className="size-4" />,
  badge: <Flame className="size-4" />,
  effect: <Sparkles className="size-4" />,
};

const previewIconMap: Record<string, React.ReactNode> = {
  Flame: <Flame className="size-8 text-red-400" />,
  Crown: <Crown className="size-8 text-yellow-500" />,
  default: <Shield className="size-8 text-zinc-400" />,
};

function ItemPreview({ item }: { item: MarketplaceItem }) {
  switch (item.previewType) {
    case 'border':
      return (
        <div
          className={`w-full aspect-square rounded-lg border-4 ${item.rarity === 'legendary' ? 'border-orange-500' : item.rarity === 'epic' ? 'border-amber-500' : item.rarity === 'rare' ? 'border-emerald-500' : 'border-zinc-700'} bg-zinc-900 flex items-center justify-center`}
        >
          <div className="w-3/4 h-3/4 rounded-md border-2 border-dashed border-zinc-800 flex items-center justify-center">
            <Shield className="size-5 text-zinc-500" />
          </div>
        </div>
      );
    case 'text':
      return (
        <div className="w-full aspect-square rounded-lg bg-zinc-800 flex items-center justify-center px-3">
          <span className={`text-sm font-bold text-center ${
            item.rarity === 'legendary' ? 'text-red-500' : item.rarity === 'epic' ? 'text-amber-400' : 'text-zinc-500'
          }`}>
            {item.name}
          </span>
        </div>
      );
    case 'icon':
      return (
        <div className="w-full aspect-square rounded-lg bg-zinc-800 flex items-center justify-center">
          <div className={`size-12 rounded-full flex items-center justify-center ${
            item.rarity === 'legendary' ? 'bg-red-950/30' : item.rarity === 'epic' ? 'bg-amber-950/30' : item.rarity === 'rare' ? 'bg-emerald-500/15' : 'bg-zinc-800'
          }`}>
            {item.name.includes('Flame') ? previewIconMap.Flame :
             item.name.includes('Crown') ? previewIconMap.Crown :
             item.name.includes('Zap') ? <Zap className="size-8 text-yellow-500" /> :
             item.name.includes('Target') ? <Target className="size-8 text-zinc-500" /> :
             <Shield className="size-8 text-zinc-500" />}
          </div>
        </div>
      );
    case 'description':
      return (
        <div className="w-full aspect-square rounded-lg bg-zinc-800 flex items-center justify-center px-3">
          <p className="text-xs text-zinc-500 text-center leading-relaxed">{item.description}</p>
        </div>
      );
    default:
      return null;
  }
}

export default function AuraMarketplace({ onBack }: AuraMarketplaceProps) {
  const { toast } = useToast();
  const user = mockCurrentUser;

  const [ownedItems, setOwnedItems] = useState<Set<string>>(new Set(user.ownedItemIds));
  const [equippedItems, setEquippedItems] = useState<Set<string>>(new Set(user.equippedItemIds));
  const [aura, setAura] = useState(user.aura);

  const handleBuy = (item: MarketplaceItem) => {
    if (aura < item.cost) {
      toast({
        title: 'Not Enough Aura',
        description: `You need ${item.cost - aura} more Aura to buy ${item.name}.`,
      });
      return;
    }

    setAura((prev) => prev - item.cost);
    setOwnedItems((prev) => new Set([...prev, item.id]));
    setEquippedItems((prev) => new Set([...prev, item.id]));
    toast({
      title: 'Purchased!',
      description: `${item.name} has been bought and equipped for ${item.cost} Aura.`,
    });
  };

  const handleEquip = (item: MarketplaceItem) => {
    setEquippedItems((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
        toast({ title: 'Unequipped', description: `${item.name} has been unequipped.` });
      } else {
        next.add(item.id);
        toast({ title: 'Equipped', description: `${item.name} is now equipped.` });
      }
      return next;
    });
  };

  const filterItems = (type: string) => {
    if (type === 'all') return mockMarketplaceItems;
    return mockMarketplaceItems.filter((item) => item.type === type);
  };

  const renderGrid = (items: MarketplaceItem[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map((item) => {
        const isOwned = ownedItems.has(item.id);
        const isEquipped = equippedItems.has(item.id);
        const canAfford = aura >= item.cost;
        const rarity = rarityColors[item.rarity];

        return (
          <Card
            key={item.id}
            className={`rounded-xl overflow-hidden py-0 gap-0 ${isOwned ? 'border-red-400' : rarity.border} ${isEquipped ? 'ring-2 ring-red-600 ring-offset-1 ring-offset-zinc-900' : ''}`}
          >
            <CardContent className="p-0">
              {/* Rarity + Preview */}
              <div className="relative p-3">
                <div className="flex items-center gap-1.5 absolute top-2 left-3 z-10">
                  <div className={`size-2 rounded-full ${rarity.dot}`} />
                  <span className="text-[10px] font-medium text-zinc-500">{rarity.label}</span>
                </div>
                <ItemPreview item={item} />
              </div>

              {/* Info */}
              <div className="px-3 pb-3 pt-1 border-t border-zinc-800">
                <div className="flex items-center gap-1.5 mb-1">
                  {typeIcons[item.type]}
                  <span className="text-[10px] uppercase font-medium text-zinc-400 tracking-wider">{item.type}</span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-100 truncate">{item.name}</h4>

                {/* Action */}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-red-500">{item.cost} Aura</span>
                  {isEquipped ? (
                    <Badge className="bg-green-900/30 text-green-400 border-green-800/50">
                      <Check className="size-3" />
                      Equipped
                    </Badge>
                  ) : isOwned ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-emerald-500 text-emerald-400 hover:bg-emerald-500/15 hover:text-emerald-400"
                      onClick={() => handleEquip(item)}
                    >
                      Equip
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="h-7 text-xs bg-red-600 text-white hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-500"
                      disabled={!canAfford}
                      onClick={() => handleBuy(item)}
                    >
                      {canAfford ? 'Buy' : 'Not Enough Aura'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Burn Shop</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-zinc-500">Your balance:</span>
            <span className="text-lg font-bold text-red-500">{aura.toLocaleString()}</span>
            <span className="text-sm text-zinc-500">Aura</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-500 hover:text-zinc-300"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="frame">Frames</TabsTrigger>
          <TabsTrigger value="title">Titles</TabsTrigger>
          <TabsTrigger value="badge">Badges</TabsTrigger>
          <TabsTrigger value="effect">Effects</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {renderGrid(filterItems('all'))}
        </TabsContent>
        <TabsContent value="frame" className="mt-4">
          {renderGrid(filterItems('frame'))}
        </TabsContent>
        <TabsContent value="title" className="mt-4">
          {renderGrid(filterItems('title'))}
        </TabsContent>
        <TabsContent value="badge" className="mt-4">
          {renderGrid(filterItems('badge'))}
        </TabsContent>
        <TabsContent value="effect" className="mt-4">
          {renderGrid(filterItems('effect'))}
        </TabsContent>
      </Tabs>
    </div>
  );
}