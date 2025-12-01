'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useProgress } from '@/contexts/ProgressContext';
import { BadgeCard } from '@/components/badges/BadgeDisplay';

interface DashboardProps {
  userName?: string;
  scratchyCoins?: number;
}

export function Dashboard({ userName = 'Learner', scratchyCoins = 0 }: DashboardProps) {
  const { t } = useTranslation();
  const { progress, badges, allBadges } = useProgress();

  const stats = [
    {
      label: t('dashboard.lessonsCompleted'),
      value: progress?.totalLessonsCompleted || 0,
      icon: '📚',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: t('dashboard.totalCoins'),
      value: scratchyCoins,
      icon: '🪙',
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      label: t('dashboard.currentStreak'),
      value: `${progress?.currentStreak || 0} days`,
      icon: '🔥',
      color: 'bg-orange-100 text-orange-700',
    },
    {
      label: t('dashboard.badges'),
      value: badges.length,
      icon: '🏆',
      color: 'bg-purple-100 text-purple-700',
    },
  ];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
        <h2 className="text-2xl font-bold">{t('dashboard.title')}</h2>
        <p className="text-indigo-200 mt-1">Welcome back, {userName}! 🎮</p>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.color} rounded-xl p-4 text-center transition-transform hover:scale-105`}
            >
              <span className="text-3xl block mb-2">{stat.icon}</span>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Time Spent */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span>⏱️</span> Time Spent Learning
          </h3>
          <p className="text-3xl font-bold text-indigo-600">
            {formatTime(progress?.totalTimeSpentSeconds || 0)}
          </p>
        </div>

        {/* Recent Badges */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span>🏆</span> Recent Badges
            </span>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">
              {t('dashboard.viewAll')} →
            </button>
          </h3>
          
          {badges.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Complete lessons to earn badges!
            </p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {badges.slice(0, 5).map(userBadge => {
                const badge = allBadges.find(b => b.id === userBadge.badgeId);
                if (!badge) return null;
                return (
                  <BadgeCard
                    key={userBadge.id}
                    badge={badge}
                    earned={true}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Progress Chart (Simplified) */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span>📈</span> Weekly Progress
          </h3>
          <div className="flex items-end justify-between h-32 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              // Use deterministic heights based on day index
              const heights = [45, 60, 30, 75, 50, 80, 40];
              const height = heights[index];
              const isToday = index === new Date().getDay() - 1;
              
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      isToday ? 'bg-indigo-500' : 'bg-indigo-200'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                  <span className={`text-xs ${isToday ? 'font-bold text-indigo-600' : 'text-gray-500'}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievement Progress */}
        <div className="mt-6">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span>🎯</span> Next Achievements
          </h3>
          <div className="space-y-3">
            {allBadges
              .filter(badge => !badges.some(b => b.badgeId === badge.id))
              .slice(0, 3)
              .map(badge => {
                // Calculate progress (simplified)
                let progressPercent = 0;
                if (badge.requirementType === 'lessons_completed') {
                  progressPercent = Math.min(
                    100,
                    ((progress?.totalLessonsCompleted || 0) / badge.requirementValue) * 100
                  );
                } else if (badge.requirementType === 'streak_days') {
                  progressPercent = Math.min(
                    100,
                    ((progress?.currentStreak || 0) / badge.requirementValue) * 100
                  );
                }

                return (
                  <div key={badge.id} className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{badge.icon}</span>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{badge.title}</p>
                        <p className="text-xs text-gray-500">{badge.description}</p>
                      </div>
                      <span className="text-yellow-600 font-bold text-sm">
                        +{badge.coinsReward}🪙
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-400 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
