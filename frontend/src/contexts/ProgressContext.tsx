'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProgress, LessonProgress, Badge, UserBadge } from '@/types';
import { useAuth } from './AuthContext';

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

// Default badges definitions
const defaultBadges: Badge[] = [
  {
    id: 'first_steps',
    title: 'First Steps!',
    titleAr: 'الخطوات الأولى!',
    description: 'Complete your first lesson',
    descriptionAr: 'أكمل درسك الأول',
    icon: '👣',
    category: 'general',
    requirementType: 'lessons_completed',
    requirementValue: 1,
    coinsReward: 10,
    funnyMessage: 'You just made a cat walk! What\'s next, flying pigs?',
    funnyMessageAr: 'لقد جعلت قطة تمشي! ما التالي، خنازير طائرة؟',
  },
  {
    id: 'robot_burp',
    title: 'Robot Burp!',
    titleAr: 'تجشؤ الروبوت!',
    description: 'You just made a robot burp!',
    descriptionAr: 'لقد جعلت الروبوت يتجشأ!',
    icon: '🤖',
    category: 'coding',
    requirementType: 'special_action',
    requirementValue: 1,
    coinsReward: 15,
    funnyMessage: 'BURRRP! That robot needs some manners!',
    funnyMessageAr: 'بررررب! هذا الروبوت يحتاج بعض الأدب!',
  },
  {
    id: 'dance_king',
    title: 'Dance King!',
    titleAr: 'ملك الرقص!',
    description: 'Made Scratch dance for the first time',
    descriptionAr: 'جعلت سكراتش يرقص لأول مرة',
    icon: '💃',
    category: 'creativity',
    requirementType: 'dance_lesson_completed',
    requirementValue: 1,
    coinsReward: 15,
    funnyMessage: 'Scratch has got the moves! Can YOU dance like that?',
    funnyMessageAr: 'سكراتش يرقص بروعة! هل تستطيع الرقص مثله؟',
  },
  {
    id: 'chatty_cat',
    title: 'Chatty Cat!',
    titleAr: 'قط ثرثار!',
    description: 'Made Scratch say 5 things',
    descriptionAr: 'جعلت سكراتش يقول 5 أشياء',
    icon: '💬',
    category: 'creativity',
    requirementType: 'speech_blocks_used',
    requirementValue: 5,
    coinsReward: 20,
    funnyMessage: 'Scratch talks more than my grandma now!',
    funnyMessageAr: 'سكراتش يتكلم أكثر من جدتي الآن!',
  },
  {
    id: 'streak_3',
    title: '3 Day Streak!',
    titleAr: 'سلسلة 3 أيام!',
    description: 'Learn for 3 days in a row',
    descriptionAr: 'تعلم لمدة 3 أيام متتالية',
    icon: '🔥',
    category: 'streak',
    requirementType: 'streak_days',
    requirementValue: 3,
    coinsReward: 25,
    funnyMessage: 'You\'re on fire! Not literally though, stay cool! 🧊',
    funnyMessageAr: 'أنت مشتعل! ليس حرفياً، ابق هادئاً! 🧊',
  },
  {
    id: 'puzzle_master',
    title: 'Puzzle Master!',
    titleAr: 'سيد الألغاز!',
    description: 'Complete 5 puzzle games',
    descriptionAr: 'أكمل 5 ألعاب ألغاز',
    icon: '🧩',
    category: 'coding',
    requirementType: 'puzzles_completed',
    requirementValue: 5,
    coinsReward: 30,
    funnyMessage: 'You solved puzzles like a detective! 🕵️',
    funnyMessageAr: 'حللت الألغاز مثل المحقق! 🕵️',
  },
  {
    id: 'coin_collector',
    title: 'Coin Collector!',
    titleAr: 'جامع العملات!',
    description: 'Earn 100 Scratchy Coins',
    descriptionAr: 'اكسب 100 عملة سكراتشي',
    icon: '🪙',
    category: 'general',
    requirementType: 'total_coins',
    requirementValue: 100,
    coinsReward: 50,
    funnyMessage: 'Cha-ching! You\'re rich in Scratchy Coins! 💰',
    funnyMessageAr: 'تشا-تشينغ! أنت غني بعملات سكراتشي! 💰',
  },
];

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Map<string, LessonProgress>>(new Map());
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from localStorage or API
  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true);
      
      if (isAuthenticated && user) {
        // TODO: Load from API
        const storedProgress = localStorage.getItem(`progress_${user.id}`);
        const storedLessonProgress = localStorage.getItem(`lesson_progress_${user.id}`);
        const storedBadges = localStorage.getItem(`badges_${user.id}`);
        
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

  const completeLessons = (lessonId: string, coinsEarned: number) => {
    updateLessonProgress(lessonId, {
      status: 'completed',
      completionPercentage: 100,
      coinsEarned,
      completedAt: new Date().toISOString(),
    });

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

    // Check for badges
    checkAndAwardBadges();
  };

  const checkAndAwardBadges = () => {
    if (!progress) return;

    defaultBadges.forEach(badge => {
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
        allBadges: defaultBadges,
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
