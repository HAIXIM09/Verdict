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
  { page: 'home', label: 'Feed', icon: Home },
  { page: 'battles', label: 'Roast Arena', icon: Flame, badge: '3 Live' },
  { page: 'leaderboard', label: 'Rankings', icon: Trophy },
  { page: 'groups', label: 'Crews', icon: Users },
  { page: 'profile', label: 'Profile', icon: User },
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
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-zinc-800 bg-[#09090b] transition-all duration-300 ${
        expanded ? 'w-56' : 'w-16'
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 h-16 shrink-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600">
          <Flame className="h-4.5 w-4.5 text-white" />
        </div>
        {expanded && (
          <span className="text-base font-black tracking-tight text-white whitespace-nowrap">
            ROAST<span className="text-red-500">ARENA</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2" aria-label="Main navigation">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.page;
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
                  className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-red-600/10 text-red-500 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.3)]'
                      : 'text-zinc-500 hover:bg-zinc-800/80 hover:text-zinc-200'
                  }`}
                >
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                      isActive ? 'text-red-500' : ''
                    }`}
                  />
                  {expanded && (
                    <>
                      <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold transition-colors ${
                            isActive
                              ? 'bg-red-600/20 text-red-400'
                              : isHovered
                                ? 'bg-zinc-800 text-zinc-400'
                                : 'bg-zinc-800 text-zinc-600'
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
      <div className="border-t border-zinc-800 px-2 py-3">
        {expanded ? (
          <>
            {/* User Card */}
            <div className="flex items-center gap-3 rounded-lg px-2.5 py-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-amber-600">
                <span className="text-xs font-bold text-white">
                  {getInitials(user.username)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-100">
                  {user.username}
                </p>
                <span className="inline-flex items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  <FlameKindling className="size-2.5" />
                  {user.rank}
                </span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="mt-2.5 flex items-center justify-around rounded-lg bg-zinc-900 px-2 py-2.5">
              <div className="text-center">
                <p className="text-xs font-bold text-red-500">{user.aura.toLocaleString()}</p>
                <p className="text-[9px] text-zinc-600 uppercase tracking-wider">Aura</p>
              </div>
              <div className="h-5 w-px bg-zinc-800" />
              <div className="text-center">
                <p className="flex items-center justify-center gap-0.5 text-xs font-bold text-zinc-200">
                  <Zap className="size-3 text-amber-500" />
                  {user.streak}
                </p>
                <p className="text-[9px] text-zinc-600 uppercase tracking-wider">Streak</p>
              </div>
              <div className="h-5 w-px bg-zinc-800" />
              <div className="text-center">
                <p className="flex items-center justify-center gap-0.5 text-xs font-bold text-zinc-200">
                  <Coins className="size-3 text-amber-500" />
                  {user.coins}
                </p>
                <p className="text-[9px] text-zinc-600 uppercase tracking-wider">Coins</p>
              </div>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={onLogout}
              className="mt-2.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-800/80 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-amber-600">
              <span className="text-[10px] font-bold text-white">
                {getInitials(user.username)}
              </span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="text-zinc-600 hover:text-red-500 transition-colors"
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