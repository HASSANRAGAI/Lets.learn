'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { AvatarDisplay } from '@/components/avatar/AvatarCustomizer';
import type { LeaderboardEntry } from '@/types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function Leaderboard({ entries, currentUserId }: LeaderboardProps) {
  const { t } = useTranslation();

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}`;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-300 to-yellow-500 border-yellow-600';
      case 2: return 'bg-gradient-to-r from-gray-200 to-gray-400 border-gray-500';
      case 3: return 'bg-gradient-to-r from-amber-300 to-amber-500 border-amber-600';
      default: return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4">
        <h2 className="text-xl font-bold">{t('leaderboard.title')}</h2>
      </div>

      {/* Leaderboard List */}
      <div className="p-4 space-y-3">
        {entries.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No entries yet. Be the first!</p>
        ) : (
          entries.map((entry, index) => {
            const isCurrentUser = entry.userId === currentUserId;
            const rank = entry.rank || index + 1;
            
            return (
              <div
                key={entry.userId}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  getRankStyle(rank)
                } ${isCurrentUser ? 'ring-4 ring-indigo-400 scale-102' : ''} ${
                  rank <= 3 ? 'animate-pulse-slow' : ''
                }`}
              >
                {/* Rank */}
                <div className={`w-10 h-10 flex items-center justify-center font-bold text-xl ${
                  rank <= 3 ? '' : 'text-gray-600'
                }`}>
                  {getRankEmoji(rank)}
                </div>

                {/* Avatar */}
                <AvatarDisplay
                  base={entry.avatar?.split('_')[0] || 'cat'}
                  color={entry.avatar?.split('_')[1] || 'blue'}
                  size="md"
                />

                {/* Name */}
                <div className="flex-1">
                  <p className={`font-bold ${rank <= 3 ? 'text-white' : 'text-gray-800'}`}>
                    {entry.displayName}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                        {t('leaderboard.you')}
                      </span>
                    )}
                  </p>
                </div>

                {/* Coins */}
                <div className={`flex items-center gap-1 font-bold ${rank <= 3 ? 'text-white' : 'text-yellow-600'}`}>
                  <span className="text-xl">🪙</span>
                  <span>{entry.scratchyCoins.toLocaleString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
