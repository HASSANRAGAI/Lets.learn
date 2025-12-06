'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProgress, LessonProgress, Badge, UserBadge } from '@/types';
import { useAuth } from './AuthContext';
import { fetchUserProgress, completeLesson as apiCompleteLesson, fetchBadges } from '@/services/api';

interface ProgressContextType {
  progress: UserProgress | null;
  lessonProgress: Map<string, LessonProgress>;
  badges: UserBadge[];
  allBadges: Badge[];
  isLoading: boolean;
  updateLessonProgress: (lessonId: string, updates: Partial<LessonProgress>) => void;
  completeLessons: (lessonId: string, coinsEarned: number) => void;
  earnBadge: (badgeId: string, context?: string) => void;
  getDailyStreak: () => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Map<string, LessonProgress>>(new Map());
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load badge definitions from API
  useEffect(() => {
    const loadBadges = async () => {
      try {
        const badgesData = await fetchBadges();
        const mappedBadges: Badge[] = badgesData.map(badge => ({
          id: badge.id || '',
          title: badge.title || 'Achievement',
          titleAr: badge.title_ar || 'إنجاز',
          description: badge.description || '',
          descriptionAr: badge.description_ar || '',
          icon: badge.icon || '🏆',
          category: badge.category || 'general',
          requirementType: badge.requirement_type || '',
          requirementValue: badge.requirement_value || 0,
          coinsReward: badge.coins_reward || 0,
          funnyMessage: badge.funny_message || '',
          funnyMessageAr: badge.funny_message_ar || '',
        }));
        setAllBadges(mappedBadges);
      } catch (error) {
        console.error('Failed to load badges from API:', error);
        // Keep allBadges empty if API fails
      }
    };
    
    loadBadges();
  }, []);

  // Load progress from localStorage or API
  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true);
      
      if (isAuthenticated && user) {
        try {
          // Fetch from API
          const progressData = await fetchUserProgress();
          setProgress({
            userId: user.id,
            totalLessonsCompleted: progressData.total_lessons_completed || 0,
            totalCoursesCompleted: progressData.total_courses_completed || 0,
            totalChallengesCompleted: progressData.total_challenges_completed || 0,
            totalTimeSpentSeconds: progressData.total_time_spent_seconds || 0,
            currentStreak: progressData.current_streak || 0,
            longestStreak: progressData.longest_streak || 0,
            dailyChallengesCompleted: progressData.daily_challenges_completed || [],
          });
        } catch (error) {
          console.error('Failed to load progress from API:', error);
          // Fallback to localStorage on error
          const storedProgress = localStorage.getItem(`progress_${user.id}`);
          if (storedProgress) {
            setProgress(JSON.parse(storedProgress));
          } else {
            setProgress({
              userId: user.id,
              totalLessonsCompleted: 0,
              totalCoursesCompleted: 0,
              totalChallengesCompleted: 0,
              totalTimeSpentSeconds: 0,
              currentStreak: 0,
              longestStreak: 0,
              dailyChallengesCompleted: [],
            });
          }
        }
        
        // Still load lesson progress and badges from localStorage as they don't have API endpoints yet
        const storedLessonProgress = localStorage.getItem(`lesson_progress_${user.id}`);
        const storedBadges = localStorage.getItem(`badges_${user.id}`);
        
        if (storedLessonProgress) {
          setLessonProgress(new Map(JSON.parse(storedLessonProgress)));
        }
        
        if (storedBadges) {
          setBadges(JSON.parse(storedBadges));
        }
      } else {
        // Guest mode - use localStorage only
        const storedProgress = localStorage.getItem('guest_progress');
        const storedLessonProgress = localStorage.getItem('guest_lesson_progress');
        const storedBadges = localStorage.getItem('guest_badges');
        
        if (storedProgress) {
          setProgress(JSON.parse(storedProgress));
        } else {
          setProgress({
            userId: 'guest',
            totalLessonsCompleted: 0,
            totalCoursesCompleted: 0,
            totalChallengesCompleted: 0,
            totalTimeSpentSeconds: 0,
            currentStreak: 0,
            longestStreak: 0,
            dailyChallengesCompleted: [],
          });
        }
        
        if (storedLessonProgress) {
          setLessonProgress(new Map(JSON.parse(storedLessonProgress)));
        }
        
        if (storedBadges) {
          setBadges(JSON.parse(storedBadges));
        }
      }
      
      setIsLoading(false);
    };
    
    loadProgress();
  }, [isAuthenticated, user]);

  // Save progress to localStorage
  useEffect(() => {
    if (!isLoading && progress) {
      const key = isAuthenticated && user ? `progress_${user.id}` : 'guest_progress';
      localStorage.setItem(key, JSON.stringify(progress));
    }
  }, [progress, isLoading, isAuthenticated, user]);

  useEffect(() => {
    if (!isLoading && lessonProgress.size > 0) {
      const key = isAuthenticated && user ? `lesson_progress_${user.id}` : 'guest_lesson_progress';
      localStorage.setItem(key, JSON.stringify(Array.from(lessonProgress.entries())));
    }
  }, [lessonProgress, isLoading, isAuthenticated, user]);

  useEffect(() => {
    if (!isLoading && badges.length > 0) {
      const key = isAuthenticated && user ? `badges_${user.id}` : 'guest_badges';
      localStorage.setItem(key, JSON.stringify(badges));
    }
  }, [badges, isLoading, isAuthenticated, user]);

  const updateLessonProgress = (lessonId: string, updates: Partial<LessonProgress>) => {
    setLessonProgress(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(lessonId) || {
        lessonId,
        courseId: updates.courseId || '',
        status: 'not_started' as const,
        completionPercentage: 0,
        timeSpentSeconds: 0,
        attempts: 0,
        hintsUsed: 0,
        coinsEarned: 0,
        lastAccessed: new Date().toISOString(),
      };
      newMap.set(lessonId, { ...existing, ...updates, lastAccessed: new Date().toISOString() });
      return newMap;
    });
  };

  const completeLessons = async (lessonId: string, coinsEarned: number) => {
    updateLessonProgress(lessonId, {
      status: 'completed',
      completionPercentage: 100,
      coinsEarned,
      completedAt: new Date().toISOString(),
    });

    // Update local state
    setProgress(prev => {
      if (!prev) return prev;
      const today = new Date().toDateString();
      const lastActivity = prev.lastActivityDate ? new Date(prev.lastActivityDate).toDateString() : '';
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      let newStreak = prev.currentStreak;
      if (lastActivity !== today) {
        newStreak = lastActivity === yesterday ? prev.currentStreak + 1 : 1;
      }
      
      return {
        ...prev,
        totalLessonsCompleted: prev.totalLessonsCompleted + 1,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastActivityDate: new Date().toISOString(),
      };
    });

    // Call backend API if authenticated
    if (isAuthenticated && user) {
      try {
        await apiCompleteLesson(lessonId, coinsEarned);
      } catch (error) {
        console.error('Failed to sync lesson completion with backend:', error);
        // Continue anyway as we've updated locally
      }
    }

    // Check for badges
    checkAndAwardBadges();
  };

  const checkAndAwardBadges = () => {
    if (!progress) return;

    allBadges.forEach(badge => {
      const alreadyEarned = badges.some(b => b.badgeId === badge.id);
      if (alreadyEarned) return;

      let earned = false;
      switch (badge.requirementType) {
        case 'lessons_completed':
          earned = (progress.totalLessonsCompleted + 1) >= badge.requirementValue;
          break;
        case 'streak_days':
          earned = progress.currentStreak >= badge.requirementValue;
          break;
        case 'total_coins':
          // This would need to be checked elsewhere
          break;
      }

      if (earned) {
        earnBadge(badge.id);
      }
    });
  };

  const earnBadge = (badgeId: string, context?: string) => {
    const alreadyEarned = badges.some(b => b.badgeId === badgeId);
    if (alreadyEarned) return;

    setBadges(prev => [
      ...prev,
      {
        id: `${badgeId}_${Date.now()}`,
        badgeId,
        earnedAt: new Date().toISOString(),
        context,
      },
    ]);
  };

  const getDailyStreak = () => {
    return progress?.currentStreak || 0;
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        lessonProgress,
        badges,
        allBadges,
        isLoading,
        updateLessonProgress,
        completeLessons,
        earnBadge,
        getDailyStreak,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
