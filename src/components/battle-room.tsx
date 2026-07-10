'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Scale,
  AlertTriangle,
  Send,
  Plus,
  Shield,
  Zap,
  Clock,
  MessageSquare,
  Eye,
  Flame,
  Skull,
  Swords,
  ArrowLeft,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TiltCard } from '@/components/ui/tilt-card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { GuideTip } from '@/components/newbie-guide';

interface RoastRoomProps {
  battleId: string;
  onLeave: () => void;
  currentUser: { id: string; username: string; avatar: string };
  onJudged?: (data: { battle: any; verdict: string; auraReward: number; coinReward: number }) => void;
}

interface BattleMessage {
  id: string;
  userId: string;
  content: string;
  side: string;
  createdAt: string;
  user: { id: string; username: string; avatar: string };
}

interface BattleData {
  id: string;
  topic: string;
  category: string;
  sideA: string;
  sideB: string;
  status: string;
  auraStake: number;
  aiVerdict: string | null;
  creator: { id: string; username: string; avatar: string; aura: number };
  opponent: { id: string; username: string; avatar: string; aura: number } | null;
  winner: { id: string; username: string; avatar: string } | null;
  messages: BattleMessage[];
}

const POWER_UPS = [
  { icon: Shield, label: 'Shield', desc: 'Survive 1 AI kick', cost: 50 },
  { icon: Zap, label: 'Double Aura', desc: '2x aura this debate', cost: 100 },
];

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function ChatMessageItem({ msg, teamColor }: { msg: BattleMessage; teamColor?: string }) {
  return (
    <div className={`px-3 py-1.5 mx-1 flex items-start gap-2 ${teamColor === 'a' ? 'border-l-2 border-l-pink-400' : teamColor === 'b' ? 'border-l-2 border-l-violet-400' : ''}`}>
      <p className="text-xs">
        <span className="font-bold text-zinc-100">{msg.user.username}</span>
        <span className="text-zinc-400 ml-1.5">{msg.content}</span>
      </p>
    </div>
  );
}

export default function BattleRoom({ battleId, onLeave, currentUser, onJudged }: RoastRoomProps) {
  const [battle, setBattle] = useState<BattleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [sending, setSending] = useState(false);
  const [joining, setJoining] = useState(false);
  const [judging, setJudging] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchBattle = useCallback(async () => {
    try {
      const res = await fetch(`/api/battles/${battleId}`);
      const data = await res.json();
      setBattle(data.battle);
    } catch {
      setBattle(null);
    }
    setLoading(false);
  }, [battleId]);

  useEffect(() => {
    fetchBattle();
  }, [fetchBattle]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [battle?.messages?.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="size-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="bg-zinc-900 border border-zinc-800 p-8 text-center max-w-sm w-full">
          <CardContent className="flex flex-col items-center gap-4 p-0">
            <div className="size-14 rounded-full bg-zinc-800 flex items-center justify-center">
              <Swords className="size-6 text-zinc-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">No Battle Found</h2>
              <p className="text-sm text-zinc-500 mt-1">This arena doesn&apos;t exist or has ended.</p>
            </div>
            <Button variant="outline" className="btn-primary text-white btn-press" onClick={onLeave}>
              <ArrowLeft className="size-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCreator = battle.creator.id === currentUser.id;
  const isOpponent = battle.opponent?.id === currentUser.id;
  const isPlayer = isCreator || isOpponent;
  const userSide = isCreator ? 'a' : isOpponent ? 'b' : null;

  const handleSend = async () => {
    if (!chatInput.trim() || !userSide || sending) return;
    setSending(true);
    try {
      await fetch(`/api/battles/${battleId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: chatInput.trim(), side: userSide }),
      });
      setChatInput('');
      fetchBattle();
    } catch {
      // silently fail
    }
    setSending(false);
  };

  const handleJoin = async () => {
    if (joining) return;
    setJoining(true);
    try {
      await fetch(`/api/battles/${battleId}/join`, { method: 'POST' });
      fetchBattle();
    } catch {
      // silently fail
    }
    setJoining(false);
  };

  const handleJudge = async () => {
    if (judging) return;
    setJudging(true);
    try {
      const res = await fetch(`/api/battles/${battleId}/judge`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        onJudged?.(data);
        fetchBattle();
      }
    } catch {
      // silently fail
    }
    setJudging(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 min-h-[calc(100vh-8rem)]">
      {/* Left Column — Debate Area */}
      <div className="flex-1 lg:w-[60%] space-y-4">
        {/* Header */}
        <ScrollReveal delay={0}>
          <Card className="card-premium bg-zinc-900 border border-zinc-800/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h1 className="text-xl font-bold text-zinc-100">
                    {battle.sideA} <Swords className="size-4 inline text-pink-500 mx-1" /> {battle.sideB}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs bg-violet-500/15 text-violet-400 border-none">
                      {battle.category}
                    </Badge>
                    {battle.status === 'active' && (
                      <Badge className="bg-pink-500/15 text-pink-500 border-pink-800/50 text-xs">LIVE</Badge>
                    )}
                    {battle.status === 'open' && (
                      <Badge className="bg-violet-500/15 text-violet-400 border-violet-500/20 text-xs">OPEN</Badge>
                    )}
                    {battle.status === 'judged' && (
                      <Badge className="bg-zinc-800 text-zinc-500 border-zinc-800 text-xs">JUDGED</Badge>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-zinc-500 border-zinc-700 btn-press" onClick={onLeave}>
                  Leave
                </Button>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* AI Moderation Bar */}
        <ScrollReveal delay={0.15}>
          <Card className="premium-glow bg-zinc-800/80 border border-zinc-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="size-4 text-pink-500" />
                <Badge className="bg-pink-600 text-white border-none text-xs">AI Judge Active</Badge>
              </div>
              {battle.aiVerdict ? (
                <ScrollArea className="max-h-24">
                  <p className="text-xs text-zinc-400 leading-relaxed">{battle.aiVerdict}</p>
                </ScrollArea>
              ) : (
                <p className="text-xs text-zinc-500 italic">Waiting for verdict request...</p>
              )}
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Teams Section */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-2 gap-4">
            {/* Team A */}
            <TiltCard glowColor="rgba(236, 72, 153, 0.4)" className="rounded-xl">
              <Card className="bg-pink-950/20 border border-pink-900/40">
                <CardContent className="p-4">
                  <h3 className="text-sm font-bold text-pink-500 mb-2 text-center uppercase tracking-widest">
                    Side {battle.sideA}
                  </h3>
                  <div className="flex items-center gap-2 py-1.5 px-2">
                    <div
                      className={`size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white ${
                        isCreator ? 'ring-2 ring-pink-500 ring-offset-1 ring-offset-zinc-900' : ''
                      }`}
                      style={{ backgroundColor: '#8B5CF6' }}
                    >
                      {getInitials(battle.creator.username)}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate ${isCreator ? 'text-pink-500' : 'text-zinc-200'}`}>
                        {battle.creator.username}
                        {isCreator && <span className="ml-1 text-zinc-400">(You)</span>}
                      </p>
                      <p className="text-[10px] text-zinc-400">Aura: {battle.creator.aura.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TiltCard>

            {/* Team B */}
            <TiltCard glowColor="rgba(139, 92, 246, 0.4)" className="rounded-xl">
              <Card className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/30">
                <CardContent className="p-4">
                  <h3 className="text-sm font-bold text-[#8B5CF6] mb-2 text-center uppercase tracking-widest">
                    Side {battle.sideB}
                  </h3>
                  {battle.opponent ? (
                    <div className="flex items-center gap-2 py-1.5 px-2">
                      <div
                        className={`size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white ${
                          isOpponent ? 'ring-2 ring-pink-500 ring-offset-1 ring-offset-zinc-900' : ''
                        }`}
                        style={{ backgroundColor: '#06B6D4' }}
                      >
                        {getInitials(battle.opponent.username)}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-medium truncate ${isOpponent ? 'text-pink-500' : 'text-zinc-200'}`}>
                          {battle.opponent.username}
                          {isOpponent && <span className="ml-1 text-zinc-400">(You)</span>}
                        </p>
                        <p className="text-[10px] text-zinc-400">Aura: {battle.opponent.aura.toLocaleString()}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 py-1.5 px-2">
                      <div className="size-8 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center shrink-0">
                        <Plus className="size-3.5 text-zinc-500" />
                      </div>
                      <span className="text-xs text-zinc-400">Waiting for opponent...</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TiltCard>
          </div>
        </ScrollReveal>

        {/* Winner / Judge Button */}
        {battle.status === 'active' && isPlayer && (
          <ScrollReveal delay={0.2}>
            <Card className="bg-zinc-900 border border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Ready for Verdict?</p>
                    <p className="text-xs text-zinc-500">Request the AI Judge to decide the winner.</p>
                  </div>
                  <Button className="btn-primary btn-press" onClick={handleJudge} disabled={judging || (battle.messages?.length || 0) < 2}>
                    <Scale className="size-4 mr-2" />
                    {judging ? 'Judging...' : 'Request Verdict'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        )}

        {battle.status === 'judged' && battle.winner && (
          <ScrollReveal delay={0.2}>
            <Card className="bg-gradient-to-r from-pink-950/30 to-violet-950/30 border border-pink-500/20">
              <CardContent className="p-4 text-center">
                <Trophy className="size-6 text-pink-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-zinc-100">
                  {battle.winner.username} Won!
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  +{battle.auraStake * 2} Aura · {battle.sideA} vs {battle.sideB}
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>
        )}
      </div>

      {/* Right Column — Chat */}
      <div className="lg:w-[40%] flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden min-h-[400px] lg:min-h-0">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-pink-500" />
            <span className="font-semibold text-zinc-100 text-sm uppercase tracking-wider">Debate</span>
          </div>
          <span className="text-xs text-zinc-400">{battle.messages?.length || 0} messages</span>
        </div>

        {/* Message List */}
        <ScrollArea className="flex-1 max-h-[50vh] lg:max-h-none">
          <div className="py-2 space-y-1">
            {battle.messages?.map(msg => {
              const teamColor = msg.side;
              return (
                <ChatMessageItem key={msg.id} msg={msg} teamColor={teamColor} />
              );
            })}
            <div ref={chatEndRef} />
          </div>
        </ScrollArea>

        {/* Power-Ups Bar */}
        <div className="px-3 py-2 border-t border-zinc-800 flex items-center gap-2 shrink-0">
          {POWER_UPS.map(pu => (
            <button
              key={pu.label}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-400 flex items-center gap-1.5 transition-all duration-300 opacity-40 cursor-not-allowed"
              disabled
            >
              <pu.icon className="size-3.5" />
              <div className="flex flex-col items-start leading-tight">
                <span className="font-medium">{pu.label}</span>
                <span className="text-zinc-400">{pu.cost} coins</span>
              </div>
            </button>
          ))}
        </div>

        {/* Chat Input or Spectator View */}
        <div className="px-3 py-3 border-t border-zinc-800 shrink-0">
          {battle.status === 'open' && !isPlayer && (
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-500 border-none">
                Open Battle
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="btn-primary text-xs btn-press"
                onClick={handleJoin}
                disabled={joining}
              >
                {joining ? 'Joining...' : 'Join as Side B'}
              </Button>
            </div>
          )}
          {battle.status === 'active' && isPlayer && userSide && (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Make your case..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="text-sm focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500/40 focus:shadow-[0_0_16px_rgba(236,72,153,0.15)]"
              />
              <Button
                size="icon"
                className="btn-primary text-white shrink-0 btn-press"
                onClick={handleSend}
                disabled={sending || !chatInput.trim()}
              >
                <Send className="size-4" />
              </Button>
            </div>
          )}
          {battle.status === 'judged' && (
            <div className="flex items-center justify-center">
              <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-500 border-none">
                <Scale className="size-3 mr-1" />
                Verdict Complete
              </Badge>
            </div>
          )}
          {battle.status === 'active' && !isPlayer && (
            <div className="flex items-center justify-center">
              <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-500 border-none">
                <Eye className="size-3 mr-1" />
                Spectating
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Trophy({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  );
}