'use client';

import { useState, useEffect, useRef } from 'react';
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
  Laugh,
  Skull,
  Brain,
  Hand,
  Swords,
  Timer,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TiltCard } from '@/components/ui/tilt-card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { mockBattles, mockCurrentUser, type BattleCase, type ChatMessage, type User } from '@/lib/mock-data';
import { GuideTip } from '@/components/newbie-guide';

interface RoastRoomProps {
  battleId: string;
  onLeave: () => void;
  currentUser: { id: string; username: string; avatar: string };
}

const REACTIONS = [
  { icon: Flame, label: 'Fire', count: 47 },
  { icon: Laugh, label: 'LMAO', count: 23 },
  { icon: Skull, label: 'Dead', count: 18 },
  { icon: Brain, label: 'Big Brain', count: 31 },
  { icon: Hand, label: 'Clap', count: 15 },
];

const POWER_UPS = [
  { icon: Shield, label: 'Shield', desc: 'Survive 1 AI kick', cost: 50 },
  { icon: Zap, label: 'Double Aura', desc: '2x aura this roast', cost: 100 },
  { icon: Timer, label: 'Extra Time', desc: '+2 min', cost: 75 },
];

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function difficultyBadgeStyle(d: string): string {
  switch (d) {
    case 'Bronze': return 'text-zinc-500 border-zinc-700 bg-zinc-800';
    case 'Silver': return 'text-zinc-500 border-zinc-700 bg-zinc-800';
    case 'Gold': return 'text-red-500 border-red-400 bg-red-950/30';
    case 'Platinum': return 'text-amber-700 border-amber-300 bg-amber-950/30';
    default: return 'text-zinc-500 border-zinc-700 bg-zinc-800';
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function PlayerSlot({ player, isCurrentUser, team }: { player: User | null; isCurrentUser: boolean; team: 'A' | 'B' }) {
  if (!player) {
    return (
      <div className="flex items-center gap-2 py-1.5 px-2">
        <div className="size-8 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center shrink-0">
          <Plus className="size-3.5 text-zinc-500" />
        </div>
        <span className="text-xs text-zinc-400">Open</span>
      </div>
    );
  }

  const isCurrent = isCurrentUser;

  return (
    <div className="flex items-center gap-2 py-1.5 px-2">
      <div
        className={`size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white ${
          isCurrent ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-zinc-900' : ''
        }`}
        style={{ backgroundColor: '#EA580C' }}
      >
        {getInitials(player.username)}
      </div>
      <div className="min-w-0">
        <p className={`text-xs font-medium truncate ${isCurrent ? 'text-red-500' : 'text-zinc-200'}`}>
          {player.username}
        </p>
        <p className="text-[10px] text-zinc-400">Aura: {player.aura.toLocaleString()}</p>
      </div>
    </div>
  );
}

function ChatMessageItem({ msg, teamColor }: { msg: ChatMessage; teamColor?: string }) {
  if (msg.type === 'ai_kick') {
    return (
      <div className="px-3 py-2 bg-red-950/30 border border-red-900/50 rounded-lg mx-1">
        <div className="flex items-start gap-2">
          <AlertTriangle className="size-3.5 text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-red-400">{msg.text}</p>
        </div>
      </div>
    );
  }

  if (msg.type === 'ai_warning' || (msg.isAi && msg.type === 'system')) {
    return (
      <div className="px-3 py-1.5 mx-1">
        <p className="text-xs text-red-500 italic">{msg.text}</p>
      </div>
    );
  }

  if (msg.type === 'spectator_reaction') {
    return (
      <div className="px-3 py-1 mx-1">
        <p className="text-xs text-zinc-400">
          {msg.username} reacted {msg.reaction}
        </p>
      </div>
    );
  }

  // Regular argument message with team color indicator
  return (
    <div className={`px-3 py-1.5 mx-1 flex items-start gap-2 ${teamColor === 'A' ? 'border-l-2 border-l-orange-400' : teamColor === 'B' ? 'border-l-2 border-l-[#4D7C0F]' : ''}`}>
      <p className="text-xs">
        <span className="font-bold text-zinc-100">{msg.username}</span>
        <span className="text-zinc-400 ml-1.5">{msg.text}</span>
      </p>
    </div>
  );
}

export default function BattleRoom({ battleId, onLeave, currentUser }: RoastRoomProps) {
  const battle = mockBattles.find(b => b.id === battleId) || mockBattles[0];

  const [timer, setTimer] = useState(battle.timer);
  const [chatInput, setChatInput] = useState('');
  const [reactionCounts, setReactionCounts] = useState(REACTIONS.map(r => r.count));
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isPlayer = battle.teamA.some(p => p?.id === currentUser.id) || battle.teamB.some(p => p?.id === currentUser.id);

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(t => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const progress = battle.totalTimer > 0 ? (timer / battle.totalTimer) * 100 : 0;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const isLowTime = timer < 60;

  const handleSend = () => {
    if (!chatInput.trim()) return;
    setChatInput('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 min-h-[calc(100vh-8rem)]">
      {/* Left Column — Roast Area */}
      <div className="flex-1 lg:w-[60%] space-y-4">
        {/* Header */}
        <ScrollReveal delay={0}>
          <Card className="card-premium bg-zinc-900 border border-zinc-800/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h1 className="text-xl font-bold text-zinc-100">
                    {battle.sideA} <Swords className="size-4 inline text-red-500 mx-1" /> {battle.sideB}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs bg-emerald-500/15 text-emerald-400 border-none">
                      {battle.category}
                    </Badge>
                    <Badge className={`text-xs ${difficultyBadgeStyle(battle.difficulty)}`}>
                      {battle.difficulty}
                    </Badge>
                    {battle.status === 'live' && (
                      <Badge className="bg-red-500/15 text-red-500 border-red-800/50 text-xs">LIVE</Badge>
                    )}
                    {battle.status === 'waiting' && (
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-xs">WAITING</Badge>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-zinc-500 border-zinc-700 btn-press" onClick={onLeave}>
                  Retreat
                </Button>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Timer */}
        <ScrollReveal delay={0.05}>
          {/* Newbie Guide — Battle Room */}
          <GuideTip id="battle_room_basics" title="Your First Roast" variant="inline">
            The timer counts down to the verdict. Type your roasts in the chat on the right — the AI Roastmaster scores each argument. Be creative, funny, and savage for max points!
          </GuideTip>

          <div className="flex justify-center py-4">
            <div className={`relative flex items-center justify-center ${isLowTime ? 'animate-glow-pulse rounded-full' : ''}`}>
              <svg className="size-32 -rotate-90" viewBox="0 0 120 120">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feGaussianBlur stdDeviation="8" result="wideBlur" />
                    <feMerge>
                      <feMergeNode in="wideBlur" />
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#292524"
                  strokeWidth="6"
                />
                <g filter="url(#glow)">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke={isLowTime ? '#DC2626' : '#EA580C'}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000"
                  />
                </g>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Clock className={`size-4 mb-1 ${isLowTime ? 'text-red-500' : 'text-zinc-400'}`} />
                <span className={`text-3xl font-bold font-mono-stat ${isLowTime ? 'text-red-500' : 'text-zinc-100'}`}>
                  {formatTime(timer)}
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Teams Section */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-2 gap-4">
            {/* Team A */}
            <TiltCard glowColor="rgba(220, 38, 38, 0.4)" className="rounded-xl">
              <Card className="bg-red-950/20 border border-red-900/40">
                <CardContent className="p-4">
                  <h3 className="text-sm font-bold text-red-500 mb-2 text-center uppercase tracking-widest">
                    Team {battle.sideA}
                  </h3>
                  <div className="space-y-0.5">
                    {battle.teamA.map((player, i) => (
                      <PlayerSlot
                        key={`a-${i}`}
                        player={player}
                        isCurrentUser={player?.id === currentUser.id}
                        team="A"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TiltCard>

            {/* Team B */}
            <TiltCard glowColor="rgba(77, 124, 15, 0.4)" className="rounded-xl">
              <Card className="bg-[#4D7C0F]/10 border border-[#4D7C0F]/30">
                <CardContent className="p-4">
                  <h3 className="text-sm font-bold text-[#4D7C0F] mb-2 text-center uppercase tracking-widest">
                    Team {battle.sideB}
                  </h3>
                  <div className="space-y-0.5">
                    {battle.teamB.map((player, i) => (
                      <PlayerSlot
                        key={`b-${i}`}
                        player={player}
                        isCurrentUser={player?.id === currentUser.id}
                        team="B"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TiltCard>
          </div>
        </ScrollReveal>

        {/* AI Moderation Bar */}
        <ScrollReveal delay={0.15}>
          <Card className="premium-glow bg-zinc-800/80 border border-zinc-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="size-4 text-red-500" />
                <Badge className="bg-red-600 text-white border-none text-xs">AI Roastmaster Active</Badge>
              </div>
              <ScrollArea className="max-h-24">
                <div className="space-y-1">
                  {battle.chatMessages
                    .filter(m => m.type === 'ai_kick' || m.type === 'ai_warning')
                    .slice(-3)
                    .map(msg => (
                      <div key={msg.id} className="text-xs text-zinc-500">
                        <span className="text-red-500 font-medium">[AI]</span> {msg.text}
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Spectator Reactions Bar */}
        <ScrollReveal delay={0}>
          <GuideTip id="battle_reactions" title="Reactions & Power-Ups" variant="inline" className="mb-1">
            Spectators can react with emojis — high reactions boost visibility! If you&apos;re a player, use <strong className="text-zinc-200">Power-Ups</strong> (bottom of chat) to shield yourself, double your Aura, or buy extra time. Each costs coins.
          </GuideTip>
          <Card className="bg-zinc-900 border border-zinc-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 flex-wrap">
                {REACTIONS.map((r, i) => (
                  <button
                    key={r.label}
                    className="bg-zinc-800 rounded-full px-3 py-1.5 text-sm flex items-center gap-1.5 transition-all duration-200 hover:scale-105 hover:bg-zinc-700"
                    onClick={() => {
                      const next = [...reactionCounts];
                      next[i] += 1;
                      setReactionCounts(next);
                    }}
                  >
                    <r.icon className="size-4" />
                    <span className="text-xs text-zinc-500">{reactionCounts[i]}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Spectator Count */}
        <ScrollReveal delay={0.05}>
          <div className="flex items-center gap-2 px-1">
            <Eye className="size-4 text-zinc-400" />
            <span className="text-sm text-zinc-500">{battle.spectators.length} Inferno Audience</span>
            <div className="flex -space-x-2 ml-2">
              {battle.spectators.slice(0, 5).map(spectator => (
                <div
                  key={spectator.id}
                  className="size-7 rounded-full border-2 border-zinc-800 flex items-center justify-center text-[9px] font-bold text-white shadow-md"
                  style={{ background: 'linear-gradient(135deg, #EA580C, #DC2626)' }}
                >
                  {getInitials(spectator.username)}
                </div>
              ))}
              {battle.spectators.length > 5 && (
                <div className="size-7 rounded-full bg-zinc-800 border-2 border-zinc-800 flex items-center justify-center text-[9px] font-medium text-zinc-400 shadow-md">
                  +{battle.spectators.length - 5}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Right Column — Chat */}
      <div className="lg:w-[40%] flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden min-h-[400px] lg:min-h-0">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-red-500" />
            <span className="font-semibold text-zinc-100 text-sm uppercase tracking-wider">War Chat</span>
          </div>
          <span className="text-xs text-zinc-400">{battle.chatMessages.length} shots fired</span>
        </div>

        {/* Message List */}
        <ScrollArea className="flex-1 max-h-[50vh] lg:max-h-none">
          <div className="py-2 space-y-1">
            {battle.chatMessages.map(msg => {
              // Determine team color for argument messages
              const isTeamA = battle.teamA.some(p => p?.id === msg.userId);
              const isTeamB = battle.teamB.some(p => p?.id === msg.userId);
              const teamColor = isTeamA ? 'A' : isTeamB ? 'B' : undefined;
              return (
                <ChatMessageItem key={msg.id} msg={msg} teamColor={teamColor} />
              );
            })}
            <div ref={chatEndRef} />
          </div>
        </ScrollArea>

        {/* Power-Ups Bar */}
        <div className="px-3 py-2 border-t border-zinc-800 flex items-center gap-2 shrink-0">
          {POWER_UPS.map(pu => {
            const canAfford = mockCurrentUser.coins >= pu.cost;
            return (
              <button
                key={pu.label}
                className={`bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-400 flex items-center gap-1.5 transition-all duration-300 ${
                  canAfford ? 'hover:bg-red-600/10 hover:border-red-600 hover:text-red-400' : 'opacity-40 cursor-not-allowed'
                }`}
                disabled={!canAfford}
              >
                <pu.icon className="size-3.5" />
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-medium">{pu.label}</span>
                  <span className="text-zinc-400">{pu.cost} coins</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chat Input or Spectator View */}
        <div className="px-3 py-3 border-t border-zinc-800 shrink-0">
          {isPlayer ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Drop your hottest take..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="text-sm focus:ring-2 focus:ring-red-500/60 focus:border-red-500/40 focus:shadow-[0_0_16px_rgba(220,38,38,0.15)]"
              />
              <Button
                size="icon"
                className="btn-fire text-white shrink-0 btn-press"
                onClick={handleSend}
              >
                <Send className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-500 border-none">
                Watching the Flames
              </Badge>
              <Button variant="outline" size="sm" className="btn-fire text-xs btn-press">
                Jump Into the Fire
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}