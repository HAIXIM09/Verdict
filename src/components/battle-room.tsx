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
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockBattles, mockCurrentUser, type BattleCase, type ChatMessage, type User } from '@/lib/mock-data';

interface BattleRoomProps {
  battleId: string;
  onLeave: () => void;
  currentUser: { id: string; username: string; avatar: string };
}

const REACTIONS = [
  { emoji: '🔥', count: 47 },
  { emoji: '😂', count: 23 },
  { emoji: '💀', count: 18 },
  { emoji: '🧠', count: 31 },
  { emoji: '👏', count: 15 },
];

const POWER_UPS = [
  { emoji: '🛡️', label: 'Shield', desc: 'Survive 1 AI kick', cost: 50 },
  { emoji: '⚡', label: 'Double Aura', desc: '2x aura this battle', cost: 100 },
  { emoji: '⏱️', label: 'Extra Time', desc: '+2 min', cost: 75 },
];

function difficultyBadgeStyle(d: string): string {
  switch (d) {
    case 'Bronze': return 'text-stone-500 border-stone-300 bg-stone-50';
    case 'Silver': return 'text-stone-500 border-stone-400 bg-stone-50';
    case 'Gold': return 'text-orange-600 border-orange-300 bg-orange-50';
    case 'Platinum': return 'text-amber-700 border-amber-300 bg-amber-50';
    default: return 'text-stone-500 border-stone-300 bg-stone-50';
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
        <div className="size-8 rounded-full border-2 border-dashed border-stone-300 flex items-center justify-center shrink-0">
          <Plus className="size-3.5 text-stone-300" />
        </div>
        <span className="text-xs text-stone-400">Open</span>
      </div>
    );
  }

  const isCurrent = isCurrentUser;

  return (
    <div className="flex items-center gap-2 py-1.5 px-2">
      <div
        className={`size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white ${
          isCurrent ? 'ring-2 ring-orange-500 ring-offset-1' : ''
        }`}
        style={{ backgroundColor: '#EA580C' }}
      >
        {player.avatar.substring(0, 2)}
      </div>
      <div className="min-w-0">
        <p className={`text-xs font-medium truncate ${isCurrent ? 'text-orange-600' : 'text-stone-800'}`}>
          {player.username}
        </p>
        <p className="text-[10px] text-stone-400">Aura: {player.aura.toLocaleString()}</p>
      </div>
    </div>
  );
}

function ChatMessageItem({ msg, teamColor }: { msg: ChatMessage; teamColor?: string }) {
  if (msg.type === 'ai_kick') {
    return (
      <div className="px-3 py-2 bg-red-50 border border-red-100 rounded-lg mx-1">
        <div className="flex items-start gap-2">
          <AlertTriangle className="size-3.5 text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-red-700">{msg.text}</p>
        </div>
      </div>
    );
  }

  if (msg.type === 'ai_warning' || (msg.isAi && msg.type === 'system')) {
    return (
      <div className="px-3 py-1.5 mx-1">
        <p className="text-xs text-orange-600 italic">{msg.text}</p>
      </div>
    );
  }

  if (msg.type === 'spectator_reaction') {
    return (
      <div className="px-3 py-1 mx-1">
        <p className="text-xs text-stone-400">
          {msg.username} reacted {msg.reaction}
        </p>
      </div>
    );
  }

  // Regular argument message with team color indicator
  return (
    <div className={`px-3 py-1.5 mx-1 flex items-start gap-2 ${teamColor === 'A' ? 'border-l-2 border-l-orange-400' : teamColor === 'B' ? 'border-l-2 border-l-[#4D7C0F]' : ''}`}>
      <p className="text-xs">
        <span className="font-bold text-stone-800">{msg.username}</span>
        <span className="text-stone-400 ml-1.5">{msg.text}</span>
      </p>
    </div>
  );
}

export default function BattleRoom({ battleId, onLeave, currentUser }: BattleRoomProps) {
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
      {/* Left Column — Battle Area */}
      <div className="flex-1 lg:w-[60%] space-y-4">
        {/* Header */}
        <Card className="bg-white border border-stone-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-stone-900">
                  {battle.sideA} ⚔️ {battle.sideB}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs bg-[#4D7C0F]/10 text-[#4D7C0F] border-none">
                    {battle.category}
                  </Badge>
                  <Badge className={`text-xs ${difficultyBadgeStyle(battle.difficulty)}`}>
                    {battle.difficulty}
                  </Badge>
                  {battle.status === 'live' && (
                    <Badge className="bg-red-500/10 text-red-600 border-red-200 text-xs">LIVE</Badge>
                  )}
                  {battle.status === 'waiting' && (
                    <Badge className="bg-[#4D7C0F]/10 text-[#4D7C0F] border-[#4D7C0F]/20 text-xs">WAITING</Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-stone-500 border-stone-300" onClick={onLeave}>
                Leave
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timer */}
        <div className="flex justify-center py-4">
          <div className="relative flex items-center justify-center">
            <svg className="size-32 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#f5f5f4"
                strokeWidth="6"
              />
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
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Clock className={`size-4 mb-1 ${isLowTime ? 'text-red-500' : 'text-stone-400'}`} />
              <span className={`text-3xl font-bold tabular-nums ${isLowTime ? 'text-red-600' : 'text-stone-900'}`}>
                {formatTime(timer)}
              </span>
            </div>
          </div>
        </div>

        {/* Teams Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Team A */}
          <Card className="bg-orange-50/50 border border-orange-100">
            <CardContent className="p-4">
              <h3 className="text-sm font-bold text-orange-700 mb-2 text-center">
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

          {/* Team B */}
          <Card className="bg-[#4D7C0F]/5 border border-[#4D7C0F]/20">
            <CardContent className="p-4">
              <h3 className="text-sm font-bold text-[#4D7C0F] mb-2 text-center">
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
        </div>

        {/* AI Moderation Bar */}
        <Card className="bg-stone-50 border border-stone-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="size-4 text-orange-600" />
              <Badge className="bg-orange-600 text-white border-none text-xs">AI Judge Active</Badge>
            </div>
            <ScrollArea className="max-h-24">
              <div className="space-y-1">
                {battle.chatMessages
                  .filter(m => m.type === 'ai_kick' || m.type === 'ai_warning')
                  .slice(-3)
                  .map(msg => (
                    <div key={msg.id} className="text-xs text-stone-500">
                      <span className="text-orange-600 font-medium">[AI]</span> {msg.text}
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Spectator Reactions Bar */}
        <Card className="bg-white border border-stone-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 flex-wrap">
              {REACTIONS.map((r, i) => (
                <button
                  key={r.emoji}
                  className="bg-stone-100 rounded-full px-3 py-1.5 text-sm flex items-center gap-1.5 hover:bg-stone-200 transition-colors"
                  onClick={() => {
                    const next = [...reactionCounts];
                    next[i] += 1;
                    setReactionCounts(next);
                  }}
                >
                  <span>{r.emoji}</span>
                  <span className="text-xs text-stone-500">{reactionCounts[i]}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Spectator Count */}
        <div className="flex items-center gap-2 px-1">
          <Eye className="size-4 text-stone-400" />
          <span className="text-sm text-stone-500">{battle.spectators.length} Spectating</span>
          <div className="flex -space-x-2 ml-2">
            {battle.spectators.slice(0, 5).map(spectator => (
              <div
                key={spectator.id}
                className="size-7 rounded-full bg-stone-300 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white"
                style={{ backgroundColor: '#78716C' }}
              >
                {spectator.avatar.substring(0, 2)}
              </div>
            ))}
            {battle.spectators.length > 5 && (
              <div className="size-7 rounded-full bg-stone-200 border-2 border-white flex items-center justify-center text-[9px] font-medium text-stone-500">
                +{battle.spectators.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column — Chat */}
      <div className="lg:w-[40%] flex flex-col bg-white border border-stone-200 rounded-xl overflow-hidden min-h-[400px] lg:min-h-0">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-stone-500" />
            <span className="font-semibold text-stone-900 text-sm">Battle Chat</span>
          </div>
          <span className="text-xs text-stone-400">{battle.chatMessages.length} messages</span>
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
        <div className="px-3 py-2 border-t border-stone-100 flex items-center gap-2 shrink-0">
          {POWER_UPS.map(pu => {
            const canAfford = mockCurrentUser.coins >= pu.cost;
            return (
              <button
                key={pu.label}
                className={`bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-700 flex items-center gap-1.5 transition-colors ${
                  canAfford ? 'hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700' : 'opacity-40 cursor-not-allowed'
                }`}
                disabled={!canAfford}
              >
                <span>{pu.emoji}</span>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-medium">{pu.label}</span>
                  <span className="text-stone-400">{pu.cost} coins</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chat Input or Spectator View */}
        <div className="px-3 py-3 border-t border-stone-200 shrink-0">
          {isPlayer ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type your argument..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="text-sm"
              />
              <Button
                size="icon"
                className="bg-orange-600 hover:bg-orange-700 text-white shrink-0"
                onClick={handleSend}
              >
                <Send className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs bg-stone-100 text-stone-500 border-none">
                Spectating
              </Badge>
              <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50 text-xs">
                Request to Join
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}