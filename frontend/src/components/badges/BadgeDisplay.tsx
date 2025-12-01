'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSpeech } from '@/hooks/useSpeech';
import type { Badge, UserBadge } from '@/types';

interface BadgeCardProps {
  badge: Badge;
  earned?: boolean;
  showAnimation?: boolean;
}

export function BadgeCard({ badge, earned = false, showAnimation = false }: BadgeCardProps) {
  const { i18n } = useTranslation();
  const { speak, isSupported } = useSpeech({ rate: 0.9, pitch: 1.1 });
  const [isFlipped, setIsFlipped] = useState(false);

  const isArabic = i18n.language === 'ar';
  const title = isArabic ? badge.titleAr : badge.title;
  const funnyMessage = isArabic ? badge.funnyMessageAr : badge.funnyMessage;

  const handleClick = () => {
    if (earned) {
      setIsFlipped(!isFlipped);
      if (!isFlipped && isSupported) {
        speak(funnyMessage);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative w-32 h-40 cursor-pointer perspective-1000 ${
        showAnimation ? 'animate-bounce-in' : ''
      }`}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-xl shadow-lg p-3 flex flex-col items-center justify-center backface-hidden ${
            earned 
              ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 border-4 border-yellow-600' 
              : 'bg-gray-200 border-4 border-gray-300'
          }`}
        >
          <span className={`text-4xl ${earned ? '' : 'grayscale opacity-50'}`}>
            {badge.icon}
          </span>
          <p className={`text-center font-bold text-sm mt-2 ${earned ? 'text-yellow-900' : 'text-gray-500'}`}>
            {title}
          </p>
          {earned && (
            <span className="absolute top-1 right-1 text-lg">✨</span>
          )}
          {!earned && (
            <span className="absolute bottom-2 text-xs text-gray-400">🔒</span>
          )}
        </div>

        {/* Back */}
        {earned && (
          <div className="absolute inset-0 rounded-xl shadow-lg p-3 bg-gradient-to-b from-purple-400 to-purple-600 border-4 border-purple-700 backface-hidden rotate-y-180 flex flex-col items-center justify-center">
            <p className="text-white text-xs text-center font-medium">
              {funnyMessage}
            </p>
            <p className="text-purple-200 text-xs mt-2">
              +{badge.coinsReward} 🪙
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface BadgeGridProps {
  badges: Badge[];
  earnedBadges: UserBadge[];
}

export function BadgeGrid({ badges, earnedBadges }: BadgeGridProps) {
  const { t } = useTranslation();
  const earnedBadgeIds = new Set(earnedBadges.map(b => b.badgeId));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-800 mb-4">{t('badges.title')}</h2>
      
      {badges.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{t('badges.empty')}</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {badges.map(badge => {
            const earnedBadge = earnedBadges.find(e => e.badgeId === badge.id);
            return (
              <BadgeCard
                key={badge.id}
                badge={badge}
                earned={earnedBadgeIds.has(badge.id) && !!earnedBadge}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

interface BadgeEarnedPopupProps {
  badge: Badge;
  onClose: () => void;
}

export function BadgeEarnedPopup({ badge, onClose }: BadgeEarnedPopupProps) {
  const { t, i18n } = useTranslation();
  const { speak, isSupported } = useSpeech({ rate: 0.9, pitch: 1.2 });
  const isArabic = i18n.language === 'ar';
  const title = isArabic ? badge.titleAr : badge.title;
  const funnyMessage = isArabic ? badge.funnyMessageAr : badge.funnyMessage;

  useEffect(() => {
    if (isSupported) {
      speak(`${t('badges.earned', { badge: title })} ${funnyMessage}`);
    }
    
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [speak, isSupported, t, title, funnyMessage, onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="animate-bounce-in bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-3xl p-8 shadow-2xl max-w-sm mx-4 text-center">
        <div className="text-6xl mb-4 animate-bounce">{badge.icon}</div>
        <h2 className="text-2xl font-bold text-yellow-900 mb-2">
          🎉 {t('badges.earned', { badge: title })}
        </h2>
        <p className="text-yellow-800 mb-4">{funnyMessage}</p>
        <p className="text-yellow-700 font-bold mb-4">
          +{badge.coinsReward} 🪙
        </p>
        <button
          onClick={onClose}
          className="bg-yellow-700 hover:bg-yellow-800 text-white px-6 py-2 rounded-full font-bold transition-colors"
        >
          {t('common.close')}
        </button>
      </div>
    </div>
  );
}
