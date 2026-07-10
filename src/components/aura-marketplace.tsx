'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Shield, Star, Flame, Sparkles, Crown, Zap, Target, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TiltCard } from '@/components/ui/tilt-card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useToast } from '@/hooks/use-toast';

interface AuraMarketplaceProps {
  onBack: () => void;
  userCoins: number;
  onCoinsChange?: () => void;
}

interface MarketplaceItem {
  id: string;
  name: string;
  type: string;
  rarity: string;
  price: number;
  icon: string;
  owned: boolean;
  equipped: boolean;
}

const rarityColors: Record<string, { dot: string; border: string; label: string }> = {
  common: { dot: 'bg-zinc-500', border: 'border-zinc-700', label: 'Common' },
  rare: { dot: 'bg-violet-500', border: 'border-violet-500/40', label: 'Rare' },
  epic: { dot: 'bg-violet-600', border: 'border-violet-400', label: 'Epic' },
  legendary: { dot: 'bg-pink-600', border: 'border-pink-400', label: 'Legendary' },
};

const typeIcons: Record<string, React.ReactNode> = {
  frame: <Shield className="size-4" />,
  title: <Star className="size-4" />,
  badge: <Flame className="size-4" />,
  effect: <Sparkles className="size-4" />,
};

function ItemPreview({ item }: { item: MarketplaceItem }) {
  return (
    <div
      className={`w-full aspect-square rounded-lg border-4 ${
        item.rarity === 'legendary' ? 'border-pink-400' : item.rarity === 'epic' ? 'border-violet-400' : item.rarity === 'rare' ? 'border-violet-400' : 'border-zinc-700'
      } bg-zinc-900 flex items-center justify-center`}
    >
      <span className="text-3xl">{item.icon}</span>
    </div>
  );
}

export default function AuraMarketplace({ onBack, userCoins, onCoinsChange }: AuraMarketplaceProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(userCoins);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/aura-items');
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleBuy = async (item: MarketplaceItem) => {
    try {
      const res = await fetch(`/api/aura-items/${item.id}/buy`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setCoins(prev => prev - item.price);
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, owned: true, equipped: true } : i));
        toast({ title: 'Purchased!', description: `${item.name} has been bought and equipped.` });
        onCoinsChange?.();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to purchase', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to purchase', variant: 'destructive' });
    }
  };

  const handleEquip = async (item: MarketplaceItem) => {
    try {
      const res = await fetch(`/api/aura-items/${item.id}/equip`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setItems(prev => prev.map(i => {
          if (i.type === item.type) return { ...i, equipped: i.id === item.id };
          return i;
        }));
        toast({ title: 'Equipped', description: `${item.name} is now equipped.` });
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to equip', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to equip', variant: 'destructive' });
    }
  };

  const filterItems = (type: string) => {
    if (type === 'all') return items;
    return items.filter((item) => item.type === type);
  };

  const renderGrid = (itemsList: MarketplaceItem[]) => (
    <div className="stagger-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {itemsList.map((item) => {
        const isOwned = item.owned;
        const isEquipped = item.equipped;
        const canAfford = coins >= item.price;
        const rarity = rarityColors[item.rarity] || rarityColors.common;

        return (
          <TiltCard key={item.id} maxTilt={4}>
            <Card
              className={`rounded-xl overflow-hidden py-0 gap-0 ${isOwned ? 'border-pink-400' : rarity.border} ${isEquipped ? 'ring-2 ring-pink-600 ring-offset-1 ring-offset-zinc-900' : ''}`}
            >
              <CardContent className="p-0">
                <div className="relative p-3">
                  <div className="flex items-center gap-1.5 absolute top-2 left-3 z-10">
                    <div className={`size-2 rounded-full ${rarity.dot}`} />
                    <span className="text-[10px] font-medium text-zinc-500">{rarity.label}</span>
                  </div>
                  <ItemPreview item={item} />
                </div>

                <div className="px-3 pb-3 pt-1 border-t border-zinc-800">
                  <div className="flex items-center gap-1.5 mb-1">
                    {typeIcons[item.type] || <Shield className="size-4" />}
                    <span className="text-[10px] uppercase font-medium text-zinc-400 tracking-wider">{item.type}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100 truncate">{item.name}</h4>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-pink-500 font-mono-stat">{item.price} Coins</span>
                    {isEquipped ? (
                      <Badge className="badge-glow bg-pink-950/30 text-pink-400 border-pink-800/50">
                        <Check className="size-3" />
                        Equipped
                      </Badge>
                    ) : isOwned ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs border-violet-500 text-violet-400 hover:bg-violet-500/15 hover:text-violet-400 transition-all duration-300"
                        onClick={() => handleEquip(item)}
                      >
                        Equip
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="btn-primary h-7 text-xs disabled:bg-zinc-800 disabled:text-zinc-500"
                        disabled={!canAfford}
                        onClick={() => handleBuy(item)}
                      >
                        {canAfford ? 'Buy' : 'Need More'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TiltCard>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-heading text-zinc-100">Shop</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-zinc-500">Your stash:</span>
              <span className="text-lg font-bold text-pink-500 font-mono-stat">{coins.toLocaleString()}</span>
              <span className="text-sm text-zinc-500">Coins</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-500 hover:text-zinc-300 transition-all duration-300"
            onClick={onBack}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </div>
      </ScrollReveal>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="size-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="stagger-1">
            <TabsTrigger value="all" className="transition-all duration-300">All</TabsTrigger>
            <TabsTrigger value="frame" className="transition-all duration-300">Frames</TabsTrigger>
            <TabsTrigger value="title" className="transition-all duration-300">Titles</TabsTrigger>
            <TabsTrigger value="badge" className="transition-all duration-300">Badges</TabsTrigger>
            <TabsTrigger value="effect" className="transition-all duration-300">Effects</TabsTrigger>
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
      )}
    </div>
  );
}