'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Users, Plus, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TiltCard } from '@/components/ui/tilt-card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface GroupsSectionProps {
  onChallengeFriend: (groupId: string) => void;
}

interface Crew {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  _count: { members: number };
}

export default function GroupsSection({ onChallengeFriend }: GroupsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [crews, setCrews] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCrewName, setNewCrewName] = useState('');
  const [newCrewDesc, setNewCrewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchCrews = useCallback(async () => {
    try {
      const res = await fetch('/api/crews');
      const data = await res.json();
      setCrews(data.crews || []);
    } catch {
      setCrews([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCrews();
  }, [fetchCrews]);

  const handleCreate = async () => {
    if (!newCrewName.trim() || creating) return;
    setCreating(true);
    try {
      const res = await fetch('/api/crews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCrewName.trim(), description: newCrewDesc.trim() || null }),
      });
      if (res.ok) {
        setNewCrewName('');
        setNewCrewDesc('');
        setShowCreateForm(false);
        fetchCrews();
      }
    } catch { /* ignore */ }
    setCreating(false);
  };

  const filteredCrews = crews.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <ScrollReveal>
        <div>
          <h2 className="text-2xl font-bold font-heading text-zinc-100">Crews</h2>
          <p className="text-sm text-zinc-500 mt-1">Find your people. Debate together.</p>
        </div>
      </ScrollReveal>

      {/* Search Bar */}
      <ScrollReveal delay={0.05}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <Input
            placeholder="Search crews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 focus:shadow-[0_0_0_2px_rgba(236,72,153,0.3)] transition-shadow duration-300"
          />
        </div>
      </ScrollReveal>

      {/* Create Crew */}
      <ScrollReveal delay={0.1}>
        <Button
          variant="outline"
          className="btn-primary w-full py-6 flex flex-col items-center gap-2"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus className="size-5" />
          <span>Create a Crew</span>
        </Button>

        {showCreateForm && (
          <Card className="mt-4 bg-zinc-900 border border-zinc-800">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-zinc-100">Create a Crew</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-zinc-400">Crew Name</Label>
                  <Input
                    placeholder="e.g. Anime Discourse"
                    value={newCrewName}
                    onChange={e => setNewCrewName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm text-zinc-400">Description (optional)</Label>
                  <Input
                    placeholder="What's your crew about?"
                    value={newCrewDesc}
                    onChange={e => setNewCrewDesc(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button className="btn-primary w-full" onClick={handleCreate} disabled={creating}>
                  <Send className="size-4" />
                  {creating ? 'Creating...' : 'Create Crew'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </ScrollReveal>

      {/* Crews List */}
      <ScrollReveal delay={0.2}>
        <section className="stagger-2">
          <h3 className="text-base font-semibold font-heading text-zinc-100 mb-3">All Crews</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="size-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredCrews.length > 0 ? (
            <div className="space-y-3">
              {filteredCrews.map((crew) => (
                <TiltCard key={crew.id} maxTilt={3} shine={false} glow={false}>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-shadow hover:shadow-lg hover:shadow-black/20">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-lg mr-1">{crew.icon}</span>
                          <h4 className="text-sm font-semibold text-zinc-100">{crew.name}</h4>
                        </div>
                        {crew.description && (
                          <p className="text-sm text-zinc-500 mt-1">{crew.description}</p>
                        )}
                        <div className="flex items-center gap-1 mt-2 text-xs text-zinc-400 font-mono-stat">
                          <Users className="size-3.5" />
                          <span>{crew._count.members} member{crew._count.members !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="size-10 text-zinc-500 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">
                {crews.length === 0 ? 'No crews yet. Create the first one!' : 'No crews found.'}
              </p>
            </div>
          )}
        </section>
      </ScrollReveal>
    </div>
  );
}