'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSpeech } from '@/hooks/useSpeech';

interface ReadAloudButtonProps {
  text: string;
  className?: string;
}

export function ReadAloudButton({ text, className = '' }: ReadAloudButtonProps) {
  const { t } = useTranslation();
  const { speak, stop, isSpeaking, isSupported } = useSpeech();

  if (!isSupported) return null;

  const handleClick = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all transform hover:scale-105 ${
        isSpeaking 
          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
          : 'bg-purple-500 hover:bg-purple-600 text-white'
      } ${className}`}
      aria-label={isSpeaking ? t('tutorial.stopReading') : t('tutorial.readAloud')}
    >
      <span className="text-xl">{isSpeaking ? '🔇' : '🔊'}</span>
      <span className="font-medium">
        {isSpeaking ? t('tutorial.stopReading') : t('tutorial.readAloud')}
      </span>
    </button>
  );
}
