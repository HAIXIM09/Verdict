'use client';

import { useState, useCallback } from 'react';
import { ParticleTextEffect } from '@/components/ui/particle-text-effect';
import LoginPage from '@/components/ui/gaming-login';
import AppSidebar from '@/components/app-sidebar';
import HomeSection from '@/components/home-section';
import BattlesSection from '@/components/battles-section';
import BattleRoom from '@/components/battle-room';
import LeaderboardSection from '@/components/leaderboard-section';
import ProfileSection from '@/components/profile-section';
import GroupsSection from '@/components/groups-section';
import AuraMarketplace from '@/components/aura-marketplace';
import DailyQuests from '@/components/daily-quests';
import CaseReplays from '@/components/case-replays';
import VerdictScreen from '@/components/verdict-screen';
import AdGate from '@/components/ad-gate';
import { mockCurrentUser } from '@/lib/mock-data';
import {
  Home,
  Swords,
  Trophy,
  Users,
  User,
  Menu,
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

type AppView = 'login' | 'app';

const MOBILE_NAV_ITEMS: { page: Page; label: string; icon: React.ElementType }[] = [
  { page: 'home', label: 'Home', icon: Home },
  { page: 'battles', label: 'Battles', icon: Swords },
  { page: 'leaderboard', label: 'Ranks', icon: Trophy },
  { page: 'groups', label: 'Groups', icon: Users },
  { page: 'profile', label: 'Profile', icon: User },
];

export default function VerdictApp() {
  const [view, setView] = useState<AppView>('login');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeBattleId, setActiveBattleId] = useState<string | null>(null);
  const [showVerdict, setShowVerdict] = useState(false);
  const [showAdGate, setShowAdGate] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ─── Login ─────────────────────────────────────────────────
  const handleLogin = useCallback(() => {
    setView('app');
    setCurrentPage('home');
  }, []);

  // ─── Navigation ────────────────────────────────────────────
  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
    setSelectedCategory(null);
    setActiveBattleId(null);
    setShowVerdict(false);
    setShowAdGate(false);
    setMobileMenuOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    setView('login');
    setCurrentPage('home');
    setSelectedCategory(null);
    setActiveBattleId(null);
    setShowVerdict(false);
    setShowAdGate(false);
  }, []);

  // ─── Battle Navigation ─────────────────────────────────────
  const handleSelectBattle = useCallback((battleId: string) => {
    setActiveBattleId(battleId);
    setCurrentPage('battle-room');
    setShowVerdict(false);
    setShowAdGate(false);
  }, []);

  const handleSelectCategory = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage('battles');
  }, []);

  const handleBackToCategories = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const handleLeaveBattle = useCallback(() => {
    setShowAdGate(true);
  }, []);

  const handleAdComplete = useCallback(() => {
    setShowAdGate(false);
    setShowVerdict(true);
  }, []);

  const handleAdSkip = useCallback(() => {
    setShowAdGate(false);
    setActiveBattleId(null);
    setCurrentPage('battles');
  }, []);

  const handleVerdictContinue = useCallback(() => {
    setShowVerdict(false);
    setActiveBattleId(null);
    setCurrentPage('home');
  }, []);

  const handleVerdictAppeal = useCallback(() => {
    setShowVerdict(false);
  }, []);

  // ─── Login View ────────────────────────────────────────────
  if (view === 'login') {
    return (
      <LoginPage.VideoBackground videoUrl="https://videos.pexels.com/video-files/8128311/8128311-uhd_2560_1440_25fps.mp4">
        <div className="w-full max-w-md space-y-6">
          <ParticleTextEffect />
          <LoginPage.LoginForm onSubmit={handleLogin} />
        </div>
        <footer className="absolute bottom-4 left-0 right-0 text-center text-stone-500 text-sm z-20">
          © 2025 Verdict. All rights reserved.
        </footer>
      </LoginPage.VideoBackground>
    );
  }

  // ─── App View ──────────────────────────────────────────────
  const sidebarUser = {
    username: mockCurrentUser.username,
    aura: mockCurrentUser.aura,
    avatar: mockCurrentUser.avatar,
    rank: mockCurrentUser.rank,
    streak: mockCurrentUser.streak,
    coins: mockCurrentUser.coins,
  };

  return (
    <div className="flex min-h-screen bg-stone-950">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AppSidebar
          currentPage={currentPage}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          user={sidebarUser}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 h-full animate-in slide-in-from-left duration-200">
            <AppSidebar
              currentPage={currentPage}
              onNavigate={navigateTo}
              onLogout={handleLogout}
              user={sidebarUser}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
        {/* Mobile Top Bar */}
        <div className="md:hidden sticky top-0 z-30 bg-stone-950 border-b border-stone-800 px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 -ml-1.5 text-stone-400 hover:text-stone-100"
          >
            <Menu className="size-5" />
          </button>
          <span className="font-bold text-stone-100">Verdict</span>
          <div className="size-7 rounded-full bg-orange-600 flex items-center justify-center text-[10px] font-bold text-white">
            {sidebarUser.username.substring(0, 2)}
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {currentPage === 'home' && (
            <HomeSection
              onNavigateToBattle={handleSelectBattle}
              onNavigateToCategory={handleSelectCategory}
              onNavigateToQuests={() => navigateTo('quests')}
            />
          )}

          {currentPage === 'battles' && (
            <BattlesSection
              onSelectBattle={handleSelectBattle}
              onBack={() => navigateTo('home')}
              selectedCategory={selectedCategory}
              onBackToCategories={handleBackToCategories}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {currentPage === 'battle-room' && activeBattleId && !showVerdict && !showAdGate && (
            <BattleRoom
              battleId={activeBattleId}
              onLeave={handleLeaveBattle}
              currentUser={{
                id: mockCurrentUser.id,
                username: mockCurrentUser.username,
                avatar: mockCurrentUser.avatar,
              }}
            />
          )}

          {currentPage === 'leaderboard' && (
            <LeaderboardSection
              onViewProfile={(userId) => navigateTo('profile')}
            />
          )}

          {currentPage === 'profile' && (
            <ProfileSection
              userId={mockCurrentUser.id}
              onNavigateToReplays={() => navigateTo('replays')}
              onNavigateToMarketplace={() => navigateTo('marketplace')}
            />
          )}

          {currentPage === 'groups' && (
            <GroupsSection
              onChallengeFriend={(groupId) => {
                // In a real app, open challenge dialog
              }}
            />
          )}

          {currentPage === 'marketplace' && (
            <AuraMarketplace
              onBack={() => navigateTo('profile')}
            />
          )}

          {currentPage === 'quests' && (
            <DailyQuests
              onBack={() => navigateTo('home')}
            />
          )}

          {currentPage === 'replays' && (
            <CaseReplays
              onBack={() => navigateTo('profile')}
              onWatchReplay={(battleId) => handleSelectBattle(battleId)}
            />
          )}
        </div>

        {/* Overlays */}
        {showAdGate && (
          <AdGate onAdComplete={handleAdComplete} onSkip={handleAdSkip} />
        )}

        {showVerdict && (
          <VerdictScreen
            onContinue={handleVerdictContinue}
            onAppeal={handleVerdictAppeal}
          />
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900 border-t border-stone-700 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-14">
          {MOBILE_NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.page || (item.page === 'battles' && currentPage === 'battle-room');
            const Icon = item.icon;
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => navigateTo(item.page)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
                  isActive ? 'text-orange-600' : 'text-stone-400 hover:text-stone-400'
                }`}
              >
                <Icon className="size-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}