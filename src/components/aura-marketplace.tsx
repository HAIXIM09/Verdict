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
  common: { dot: 'bg-stone-400', border: 'border-stone-300', label: 'Common' },
  rare: { dot: 'bg-[#4D7C0F]', border: 'border-[#4D7C0F]/40', label: 'Rare' },
  epic: { dot: 'bg-amber-600', border: 'border-amber-400', label: 'Epic' },
  legendary: { dot: 'bg-orange-500', border: 'border-orange-400', label: 'Legendary' },
};

const typeIcons: Record<MarketplaceItem['type'], React.ReactNode> = {
  frame: <Shield className="size-4" />,
  title: <Star className="size-4" />,
  badge: <Flame className="size-4" />,
  effect: <Sparkles className="size-4" />,
};

const previewIconMap: Record<string, React.ReactNode> = {
  Flame: <Flame className="size-8 text-orange-500" />,
  Crown: <Crown className="size-8 text-yellow-500" />,
  default: <Shield className="size-8 text-stone-400" />,
};

function ItemPreview({ item }: { item: MarketplaceItem }) {
  switch (item.previewType) {
    case 'border':
      return (
        <div
          className={`w-full aspect-square rounded-lg border-4 ${item.rarity === 'legendary' ? 'border-orange-500' : item.rarity === 'epic' ? 'border-amber-500' : item.rarity === 'rare' ? 'border-[#4D7C0F]' : 'border-stone-400'} bg-white flex items-center justify-center`}
        >
          <div className="w-3/4 h-3/4 rounded-md border-2 border-dashed border-stone-200 flex items-center justify-center">
            <Shield className="size-5 text-stone-300" />
          </div>
        </div>
      );
    case 'text':
      return (
        <div className="w-full aspect-square rounded-lg bg-stone-50 flex items-center justify-center px-3">
          <span className={`text-sm font-bold text-center ${
            item.rarity === 'legendary' ? 'text-orange-600' : item.rarity === 'epic' ? 'text-amber-700' : 'text-stone-700'
          }`}>
            {item.name}
          </span>
        </div>
      );
    case 'icon':
      return (
        <div className="w-full aspect-square rounded-lg bg-stone-50 flex items-center justify-center">
          <div className={`size-12 rounded-full flex items-center justify-center ${
            item.rarity === 'legendary' ? 'bg-orange-100' : item.rarity === 'epic' ? 'bg-amber-100' : item.rarity === 'rare' ? 'bg-[#4D7C0F]/10' : 'bg-stone-100'
          }`}>
            {item.name.includes('Flame') ? previewIconMap.Flame :
             item.name.includes('Crown') ? previewIconMap.Crown :
             item.name.includes('Zap') ? <Zap className="size-8 text-yellow-500" /> :
             item.name.includes('Target') ? <Target className="size-8 text-stone-500" /> :
             <Shield className="size-8 text-blue-400" />}
          </div>
        </div>
      );
    case 'description':
      return (
        <div className="w-full aspect-square rounded-lg bg-stone-50 flex items-center justify-center px-3">
          <p className="text-xs text-stone-500 text-center leading-relaxed">{item.description}</p>
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
            className={`rounded-xl overflow-hidden py-0 gap-0 ${isOwned ? 'border-orange-300' : rarity.border} ${isEquipped ? 'ring-2 ring-orange-600 ring-offset-1' : ''}`}
          >
            <CardContent className="p-0">
              {/* Rarity + Preview */}
              <div className="relative p-3">
                <div className="flex items-center gap-1.5 absolute top-2 left-3 z-10">
                  <div className={`size-2 rounded-full ${rarity.dot}`} />
                  <span className="text-[10px] font-medium text-stone-500">{rarity.label}</span>
                </div>
                <ItemPreview item={item} />
              </div>

              {/* Info */}
              <div className="px-3 pb-3 pt-1 border-t border-stone-100">
                <div className="flex items-center gap-1.5 mb-1">
                  {typeIcons[item.type]}
                  <span className="text-[10px] uppercase font-medium text-stone-400 tracking-wider">{item.type}</span>
                </div>
                <h4 className="text-sm font-semibold text-stone-900 truncate">{item.name}</h4>

                {/* Action */}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-orange-600">{item.cost} Aura</span>
                  {isEquipped ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <Check className="size-3" />
                      Equipped
                    </Badge>
                  ) : isOwned ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-[#4D7C0F] text-[#4D7C0F] hover:bg-[#4D7C0F]/10 hover:text-[#4D7C0F]"
                      onClick={() => handleEquip(item)}
                    >
                      Equip
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="h-7 text-xs bg-orange-600 text-white hover:bg-orange-700 disabled:bg-stone-200 disabled:text-stone-400"
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
          <h2 className="text-2xl font-bold text-stone-900">Aura Marketplace</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-stone-500">Your balance:</span>
            <span className="text-lg font-bold text-orange-600">{aura.toLocaleString()}</span>
            <span className="text-sm text-stone-500">Aura</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-stone-500 hover:text-stone-700"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
          Back to Profile
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