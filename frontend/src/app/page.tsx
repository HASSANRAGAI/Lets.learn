'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { CoinDisplay } from '@/components/ui/CoinDisplay';
import { Playground } from '@/components/playground/Playground';
import { DailyChallengeCard } from '@/components/daily-challenge/DailyChallenge';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { AvatarCustomizer } from '@/components/avatar/AvatarCustomizer';
import { AuthModal } from '@/components/auth/AuthForm';
import { TutorialView, LessonCard } from '@/components/tutorial/TutorialView';
import { BadgeGrid } from '@/components/badges/BadgeDisplay';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { fetchLessons, fetchLeaderboard } from '@/services/api';
import type { Lesson, LeaderboardEntry } from '@/types';

type View = 'home' | 'playground' | 'dashboard' | 'avatar' | 'leaderboard' | 'tutorial';

export default function Home() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { progress, badges, allBadges, completeLessons } = useProgress();
  
  const [currentView, setCurrentView] = useState<View>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [scratchyCoins, setScratchyCoins] = useState(user?.scratchyCoins || 50);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

  // Fetch lessons from API
  useEffect(() => {
    const loadLessons = async () => {
      try {
        setIsLoadingLessons(true);
        const data = await fetchLessons();
        // Transform API data to match frontend Lesson type
        const transformedLessons: Lesson[] = data.map((lesson: any) => ({
          id: lesson.id?.toString() || '',
          courseId: lesson.course_id || 'basics',
          title: lesson.title || '',
          titleAr: lesson.title_ar || '',
          description: lesson.description || '',
          descriptionAr: lesson.description_ar || '',
          order: lesson.order || 0,
          difficulty: lesson.difficulty || 'easy',
          durationMinutes: lesson.duration_minutes || 10,
          contentBlocks: [],
          scratchBlocks: [],
          hasPuzzle: true,
          hasActivity: true,
          hasVideo: false,
          coinsReward: lesson.coins_reward || 10,
          characterName: lesson.character_name || 'Scratchy',
          characterIntroJoke: lesson.character_joke || '',
          characterIntroJokeAr: lesson.character_joke_ar || '',
        }));
        setLessons(transformedLessons);
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
        // Keep lessons empty on error
      } finally {
        setIsLoadingLessons(false);
      }
    };

    loadLessons();
  }, []);

  // Fetch leaderboard from API
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setIsLoadingLeaderboard(true);
        const data = await fetchLeaderboard(10);
        // Transform API data to match frontend LeaderboardEntry type
        const transformedLeaderboard: LeaderboardEntry[] = data.map((entry: any) => ({
          rank: entry.rank || 0,
          userId: entry.user_id || '',
          displayName: entry.display_name || '',
          avatar: entry.avatar || 'default_avatar',
          scratchyCoins: entry.scratchy_coins || 0,
        }));
        setLeaderboardEntries(transformedLeaderboard);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        // Keep leaderboard empty on error
      } finally {
        setIsLoadingLeaderboard(false);
      }
    };

    loadLeaderboard();
  }, []);

  const handleEarnCoins = (amount: number) => {
    setScratchyCoins(prev => prev + amount);
  };

  const handleLessonComplete = (coinsEarned: number) => {
    if (selectedLesson) {
      completeLessons(selectedLesson.id, coinsEarned);
      handleEarnCoins(coinsEarned);
    }
    setSelectedLesson(null);
    setCurrentView('home');
  };

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentView('tutorial');
  };

  // Tutorial View
  if (currentView === 'tutorial' && selectedLesson) {
    return (
      <TutorialView
        lesson={selectedLesson}
        onComplete={handleLessonComplete}
        onBack={() => {
          setSelectedLesson(null);
          setCurrentView('home');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-4 px-6 shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <h1 className="text-2xl font-bold">🎮 {t('common.appName')}</h1>
          </button>
          
          <div className="flex items-center gap-3">
            <CoinDisplay amount={scratchyCoins} size="md" />
            <LanguageSwitcher />
            {isAuthenticated ? (
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors"
              >
                <span>👤</span>
                <span className="font-medium">{user?.displayName || 'Profile'}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-white text-indigo-600 px-4 py-2 rounded-full font-bold hover:bg-indigo-100 transition-colors"
              >
                {t('common.login')}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-md sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-2 py-3 overflow-x-auto">
            {[
              { id: 'home' as View, label: '🏠 Home', labelAr: '🏠 الرئيسية' },
              { id: 'playground' as View, label: '🎮 Playground', labelAr: '🎮 الملعب' },
              { id: 'dashboard' as View, label: '📊 Progress', labelAr: '📊 التقدم' },
              { id: 'avatar' as View, label: '🎨 Avatar', labelAr: '🎨 الصورة' },
              { id: 'leaderboard' as View, label: '🏆 Leaderboard', labelAr: '🏆 المتصدرين' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  currentView === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {currentView === 'home' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
                {t('home.hero.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('home.hero.subtitle')}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-bold text-indigo-700 mb-2">
                  {t('home.features.funColorful.title')}
                </h3>
                <p className="text-gray-600">
                  {t('home.features.funColorful.description')}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-indigo-700 mb-2">
                  {t('home.features.easyLearn.title')}
                </h3>
                <p className="text-gray-600">
                  {t('home.features.easyLearn.description')}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-indigo-700 mb-2">
                  {t('home.features.earnBadges.title')}
                </h3>
                <p className="text-gray-600">
                  {t('home.features.earnBadges.description')}
                </p>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Lessons */}
              <div className="lg:col-span-2">
                <section className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
                    {t('home.adventure.title')}
                  </h3>
                  {isLoadingLessons ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Loading lessons...</p>
                    </div>
                  ) : lessons.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No lessons available yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {lessons.map((lesson, index) => (
                        <LessonCard
                          key={lesson.id}
                          lesson={lesson}
                          isCompleted={progress?.totalLessonsCompleted ? (index + 1) <= progress.totalLessonsCompleted : false}
                          onClick={() => handleStartLesson(lesson)}
                        />
                      ))}
                    </div>
                  )}

                  {lessons.length > 0 && (
                    <div className="text-center mt-8">
                      <button
                        onClick={() => handleStartLesson(lessons[0])}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                      >
                        {t('common.startLearning')}
                      </button>
                    </div>
                  )}
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Daily Challenge */}
                <DailyChallengeCard onComplete={handleEarnCoins} />

                {/* Badges Preview */}
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <h3 className="font-bold text-indigo-800 mb-4">{t('badges.title')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {allBadges.slice(0, 4).map(badge => (
                      <div
                        key={badge.id}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                          badges.some(b => b.badgeId === badge.id)
                            ? 'bg-yellow-100'
                            : 'bg-gray-100 grayscale'
                        }`}
                      >
                        {badge.icon}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'playground' && (
          <Playground />
        )}

        {currentView === 'dashboard' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Dashboard
                userName={user?.displayName || 'Guest'}
                scratchyCoins={scratchyCoins}
              />
            </div>
            <div>
              <BadgeGrid badges={allBadges} earnedBadges={badges} />
            </div>
          </div>
        )}

        {currentView === 'avatar' && (
          <div className="max-w-md mx-auto">
            <AvatarCustomizer
              currentCoins={scratchyCoins}
              unlockedItems={user?.unlockedSkins || []}
            />
          </div>
        )}

        {currentView === 'leaderboard' && (
          <div className="max-w-2xl mx-auto">
            {isLoadingLeaderboard ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <p className="text-gray-500">Loading leaderboard...</p>
              </div>
            ) : (
              <Leaderboard
                entries={leaderboardEntries}
                currentUserId={user?.id}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-indigo-800 text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm opacity-80">
            {t('home.footer.main')}
          </p>
          <p className="text-xs mt-2 opacity-60">
            {t('home.footer.offline')}
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
