'use client';

import { useState } from 'react';
import {
  Home,
  Flame,
  Trophy,
  Users,
  User,
  LogOut,
  FlameKindling,
  Zap,
  Coins,
} from 'lucide-react';

type Page =
  | 'home'
  | 'battles'
  | 'battle-room'
  | 'leaderboard'
  | 'profile'
  | 'groups'
  | 'marketplace'
  | 'quests'
  | 'replays';

interface AppSidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  user: {
    username: string;
    aura: number;
    avatar: string;
    rank: string;
    streak: number;
    coins: number;
  };
}

interface NavItem {
  page: Page;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { page: 'home', label: 'The Pit', icon: Home },
  { page: 'battles', label: 'Battle Zone', icon: Flame, badge: '3 Live' },
  { page: 'leaderboard', label: 'Hall of Flame', icon: Trophy },
  { page: 'groups', label: 'War Rooms', icon: Users },
  { page: 'profile', label: 'My Burner', icon: User },
];

function getInitials(username: string): string {
  return username
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function AppSidebar({
  currentPage,
  onNavigate,
  onLogout,
  user,
}: AppSidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<Page | null>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-zinc-800/40 bg-[#070708] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
        expanded ? 'w-56' : 'w-16'
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 h-16 shrink-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-orange-600 shadow-[0_4px_16px_rgba(220,38,38,0.3)]">
          <Flame className="h-4 w-4 text-white" />
        </div>
        {expanded && (
          <span className="font-heading text-xl tracking-[0.15em] text-white whitespace-nowrap" style={{
            opacity: 0,
            transform: 'translateX(-8px)',
            animation: 'slide-up-fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
          }}>
            VERDICT<span className="text-red-500">.</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-2" aria-label="Main navigation">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = currentPage === item.page || (item.page === 'battles' && currentPage === 'battle-room');
            const isHovered = hoveredItem === item.page;
            const Icon = item.icon;

            return (
              <li key={item.page}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.page)}
                  onMouseEnter={() => setHoveredItem(item.page)}
                  onMouseLeave={() => setHoveredItem(null)}
                  aria-current={isActive ? 'page' : undefined}
                  title={!expanded ? item.label : undefined}
                  className={`relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-red-400 bg-red-600/[0.08]'
                      : 'text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200'
                  }`}
                  style={{
                    ...(isActive && {
                      boxShadow: 'inset 0 0 0 1px rgba(239, 68, 68, 0.2), 0 0 20px rgba(239, 68, 68, 0.05)',
                    }),
                  }}
                >
                  {/* Active glow indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] rounded-r-full bg-gradient-to-b from-red-500 to-amber-500 shadow-[0_0_12px_rgba(220,38,38,0.6)]" />
                  )}

                  <Icon
                    className={`h-[18px] w-[18px] shrink-0 transition-all duration-300 ${
                      isActive ? 'text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.4)]' : ''
                    }`}
                  />
                  {expanded && (
                    <>
                      <span className="flex-1 text-left whitespace-nowrap tracking-wide text-[13px]" style={{
                        opacity: 0,
                        transform: 'translateX(-6px)',
                        animation: `slide-up-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${0.08 + idx * 0.03}s both`,
                      }}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold transition-all duration-300 ${
                            isActive
                              ? 'bg-red-600/15 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.15)]'
                              : isHovered
                                ? 'bg-zinc-800 text-zinc-400'
                                : 'bg-zinc-800/50 text-zinc-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom User Section */}
      <div className="border-t border-zinc-800/30 px-2.5 py-3">
        {expanded ? (
          <div style={{
            opacity: 0,
            transform: 'translateY(8px)',
            animation: 'slide-up-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both',
          }}>
            {/* User Card */}
            <div className="flex items-center gap-3 rounded-xl px-2.5 py-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-amber-600 shadow-[0_4px_12px_rgba(220,38,38,0.25)]">
                <span className="text-xs font-bold text-white">
                  {getInitials(user.username)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-100">
                  {user.username}
                </p>
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 font-heading">
                  <FlameKindling className="size-2.5" />
                  {user.rank}
                </span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="mt-2.5 flex items-center justify-around rounded-xl bg-white/[0.02] border border-zinc-800/30 px-2 py-2.5">
              <div className="text-center">
                <p className="text-xs font-bold text-red-500 font-mono-stat">{user.aura.toLocaleString()}</p>
                <p className="text-[9px] text-zinc-600 uppercase tracking-wider font-heading">Aura</p>
              </div>
              <div className="h-5 w-px bg-zinc-800/50" />
              <div className="text-center">
                <p className="flex items-center justify-center gap-0.5 text-xs font-bold text-zinc-200">
                  <Zap className="size-3 text-amber-500" />
                  <span className="font-mono-stat">{user.streak}</span>
                </p>
                <p className="text-[9px] text-zinc-600 uppercase tracking-wider font-heading">Streak</p>
              </div>
              <div className="h-5 w-px bg-zinc-800/50" />
              <div className="text-center">
                <p className="flex items-center justify-center gap-0.5 text-xs font-bold text-zinc-200">
                  <Coins className="size-3 text-amber-500" />
                  <span className="font-mono-stat">{user.coins}</span>
                </p>
                <p className="text-[9px] text-zinc-600 uppercase tracking-wider font-heading">Coins</p>
              </div>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={onLogout}
              className="mt-2.5 flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-zinc-600 transition-all duration-300 hover:bg-red-600/[0.06] hover:text-red-500 btn-press"
            >
              <LogOut className="h-4 w-4" />
              <span>Bail Out</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-amber-600 shadow-[0_4px_12px_rgba(220,38,38,0.25)]">
              <span className="text-[10px] font-bold text-white">
                {getInitials(user.username)}
              </span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="text-zinc-600 hover:text-red-500 transition-colors duration-300"
              title="Log Out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}