'use client';

import { useState } from 'react';
import {
  Home,
  Swords,
  Trophy,
  Users,
  User,
  LogOut,
  Scale,
  Flame,
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
  { page: 'home', label: 'Home', icon: Home },
  { page: 'battles', label: 'Battles', icon: Swords, badge: '3 Live' },
  { page: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { page: 'groups', label: 'Groups', icon: Users },
  { page: 'profile', label: 'Profile', icon: User },
];

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

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

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-stone-950 border-r border-stone-800">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600">
          <Scale className="h-4.5 w-4.5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-stone-100">
          Verdict
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2" aria-label="Main navigation">
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
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-orange-950/30 text-orange-600 border-l-2 border-orange-600'
                      : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100 border-l-2 border-transparent'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-orange-600' : 'text-stone-400'
                    }`}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-orange-600/15 text-orange-400'
                          : isHovered
                            ? 'bg-stone-800 text-stone-400'
                            : 'bg-stone-800 text-stone-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-stone-700 px-3 py-4">
        {/* User Info Card */}
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4D7C0F]">
            <span className="text-xs font-semibold text-white">
              {getInitials(user.username)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-stone-100">
              {user.username}
            </p>
            <span className="inline-block rounded bg-stone-800 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-500">
              {user.rank}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-3 flex items-center justify-around rounded-lg bg-stone-800 px-2 py-2">
          <div className="text-center">
            <p className="text-xs font-semibold text-orange-600">
              {formatNumber(user.aura)}
            </p>
            <p className="text-[10px] text-stone-400">Aura</p>
          </div>
          <div className="h-6 w-px bg-stone-700" />
          <div className="text-center">
            <p className="flex items-center justify-center gap-0.5 text-xs font-semibold text-stone-300">
              <Flame className="size-3 text-orange-500" />
              {user.streak}
            </p>
            <p className="text-[10px] text-stone-400">Streak</p>
          </div>
          <div className="h-6 w-px bg-stone-700" />
          <div className="text-center">
            <p className="flex items-center justify-center gap-0.5 text-xs font-semibold text-stone-300">
              <Coins className="size-3 text-amber-500" />
              {user.coins}
            </p>
            <p className="text-[10px] text-stone-400">Coins</p>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-stone-400 transition-colors duration-200 hover:bg-stone-800 hover:text-red-500"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}