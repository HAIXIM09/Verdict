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

export default function VerdictApp() {
  const [view, setView] = useState<AppView>('login');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeBattleId, setActiveBattleId] = useState<string | null>(null);
  const [showVerdict, setShowVerdict] = useState(false);
  const [showAdGate, setShowAdGate] = useState(false);

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
    // Show ad gate before allowing exit
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
    // In a real app, this would open an appeal flow
  }, []);

  // ─── Login View ────────────────────────────────────────────
  if (view === 'login') {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12">
        <LoginPage.VideoBackground
          videoUrl="https://videos.pexels.com/video-files/8128311/8128311-uhd_2560_1440_25fps.mp4"
        />
        <div className="relative z-20 w-full max-w-md">
          <LoginPage.LoginForm onSubmit={handleLogin} />
        </div>
        <footer className="absolute bottom-4 left-0 right-0 text-center text-stone-500 text-sm z-20">
          © 2025 Verdict. All rights reserved.
        </footer>
      </div>
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
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <AppSidebar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onLogout={handleLogout}
        user={sidebarUser}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {currentPage === 'home' && (
            <HomeSection
              onNavigateToBattle={handleSelectBattle}
              onNavigateToCategory={handleSelectCategory}
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
    </div>
  );
}