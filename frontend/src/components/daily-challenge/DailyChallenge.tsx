'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSpeech } from '@/hooks/useSpeech';
import { PuzzleGame, defaultBlocks } from '@/components/playground/PuzzleGame';
import { fetchDailyChallenge, completeDailyChallenge } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import type { DailyChallenge } from '@/types';

// Default puzzle data for challenges
// Note: Backend doesn't provide puzzle_data field yet
// In the future, this should come from the API response
const DEFAULT_PUZZLE_DATA = {
  type: 'drag-drop' as const,
  solution: ['move', 'turn', 'move', 'turn'],
  hint: 'Try moving, then turning!',
  hintAr: 'جرب الحركة ثم الاستدارة!',
};

interface DailyChallengeCardProps {
  onComplete?: (coinsEarned: number) => void;
}

export function DailyChallengeCard({ onComplete }: DailyChallengeCardProps) {
  const { t, i18n } = useTranslation();
  const { speak, isSupported } = useSpeech({ rate: 0.9, pitch: 1.1 });
  const { isAuthenticated } = useAuth();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [showJoke, setShowJoke] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    const loadDailyChallenge = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDailyChallenge();
        
        // Transform API data to match frontend DailyChallenge type
        const transformedChallenge: DailyChallenge = {
          id: data.id || '',
          date: data.date || new Date().toISOString(),
          title: data.title || '',
          titleAr: data.title_ar || '',
          description: data.description || '',
          descriptionAr: data.description_ar || '',
          puzzleData: DEFAULT_PUZZLE_DATA,
          coinsReward: data.coins_reward || 15,
          jokeOfTheDay: data.joke_of_the_day || '',
          jokeOfTheDayAr: data.joke_of_the_day_ar || '',
        };
        
        setChallenge(transformedChallenge);
        
        // Check if already completed today
        const completedDate = localStorage.getItem('dailyChallenge_completed');
        if (completedDate === new Date().toDateString()) {
          setIsCompleted(true);
        }
      } catch (error) {
        console.error('Failed to load daily challenge:', error);
        // Set a default challenge on error
        setChallenge({
          id: 'default',
          date: new Date().toISOString(),
          title: 'Make the Cat Dance!',
          titleAr: 'اجعل القط يرقص!',
          description: 'Help Scratch learn a cool dance move',
          descriptionAr: 'ساعد سكراتش ليتعلم حركة رقص رائعة',
          puzzleData: DEFAULT_PUZZLE_DATA,
          coinsReward: 15,
          jokeOfTheDay: 'Why do cats make terrible DJs? Because they always paws the music! 🎵',
          jokeOfTheDayAr: 'لماذا القطط دي جي سيئون؟ لأنهم دائماً يوقفون الموسيقى! 🎵',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDailyChallenge();
  }, []);

  const handleComplete = async (success: boolean) => {
    if (success && challenge) {
      setIsCompleted(true);
      localStorage.setItem('dailyChallenge_completed', new Date().toDateString());
      
      // Call backend API if authenticated
      if (isAuthenticated) {
        try {
          const result = await completeDailyChallenge();
          // Backend returns the actual coins earned
          onComplete?.(result.coins_earned || challenge.coinsReward);
        } catch (error) {
          console.error('Failed to complete daily challenge on backend:', error);
          // Still give coins locally
          onComplete?.(challenge.coinsReward);
        }
      } else {
        onComplete?.(challenge.coinsReward);
      }
    }
  };

  const handleTellJoke = () => {
    setShowJoke(true);
    if (isSupported && challenge) {
      speak(isArabic ? challenge.jokeOfTheDayAr : challenge.jokeOfTheDay);
    }
  };

  if (!challenge || isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{t('dailyChallenge.title')}</h2>
          {isCompleted && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              ✓ {t('dailyChallenge.completed')}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {!showPuzzle ? (
          <>
            {/* Challenge Info */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {isArabic ? challenge.titleAr : challenge.title}
              </h3>
              <p className="text-gray-600">
                {isArabic ? challenge.descriptionAr : challenge.description}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full">
                <span className="text-xl">🪙</span>
                <span className="font-bold">+{challenge.coinsReward}</span>
              </div>
            </div>

            {/* Joke Section */}
            {!showJoke ? (
              <button
                onClick={handleTellJoke}
                className="w-full mb-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-xl">😄</span>
                <span>Tell me today&apos;s joke!</span>
              </button>
            ) : (
              <div className="mb-4 bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                <p className="text-purple-800 text-center">
                  {isArabic ? challenge.jokeOfTheDayAr : challenge.jokeOfTheDay}
                </p>
                <p className="text-3xl text-center mt-2">😂</p>
              </div>
            )}

            {/* Start Button */}
            {!isCompleted && (
              <button
                onClick={() => setShowPuzzle(true)}
                className="w-full py-3 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white rounded-xl font-bold transition-all transform hover:scale-102 shadow-lg"
              >
                Start Challenge! 🚀
              </button>
            )}

            {isCompleted && (
              <div className="text-center py-4">
                <span className="text-4xl">🎉</span>
                <p className="text-green-600 font-bold mt-2">
                  {t('dailyChallenge.reward', { coins: challenge.coinsReward })}
                </p>
                <p className="text-gray-500 text-sm mt-1">Come back tomorrow for a new challenge!</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Puzzle Game */}
            <button
              onClick={() => setShowPuzzle(false)}
              className="mb-4 text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              ← {t('common.back')}
            </button>
            <PuzzleGame
              blocks={defaultBlocks}
              solution={challenge.puzzleData.solution}
              puzzleTitle={challenge.title}
              puzzleTitleAr={challenge.titleAr}
              onComplete={handleComplete}
            />
          </>
        )}
      </div>
    </div>
  );
}
