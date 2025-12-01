'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSpeech } from '@/hooks/useSpeech';

interface HintSystemProps {
  hints: string[];
  onHintUsed?: () => void;
  characterName?: 'scratchy' | 'robbie';
}

export function HintSystem({ hints, onHintUsed, characterName = 'scratchy' }: HintSystemProps) {
  const { t, i18n } = useTranslation();
  const { speak, isSpeaking, stop, isSupported } = useSpeech({ rate: 0.9, pitch: 1.15 });
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const characterEmoji = characterName === 'scratchy' ? '🐱' : '🤖';
  const characterColor = characterName === 'scratchy' 
    ? 'bg-orange-100 border-orange-400' 
    : 'bg-blue-100 border-blue-400';

  useEffect(() => {
    if (isVisible) {
      // This is animation state, intentional for UI feedback
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const showHint = () => {
    if (currentHintIndex < hints.length - 1) {
      const nextIndex = currentHintIndex + 1;
      setCurrentHintIndex(nextIndex);
      setIsVisible(true);
      onHintUsed?.();
      
      if (isSupported) {
        speak(hints[nextIndex]);
      }
    }
  };

  const hideHint = () => {
    if (isSpeaking) {
      stop();
    }
    setIsVisible(false);
  };

  const hasMoreHints = currentHintIndex < hints.length - 1;
  const currentHint = hints[currentHintIndex];

  return (
    <div className="relative">
      {/* Hint Button */}
      <button
        onClick={showHint}
        disabled={!hasMoreHints}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all transform hover:scale-105 ${
          hasMoreHints
            ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 animate-pulse'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <span className="text-xl">💡</span>
        <span>{t('tutorial.hintButton')}</span>
        {hints.length > 1 && (
          <span className="text-xs bg-yellow-600 text-yellow-100 px-2 py-0.5 rounded-full">
            {currentHintIndex + 1}/{hints.length}
          </span>
        )}
      </button>

      {/* Hint Popup */}
      {isVisible && currentHint && (
        <div
          className={`absolute bottom-full mb-4 ${i18n.language === 'ar' ? 'left-0' : 'right-0'} z-50 w-80 transition-all duration-300 ${
            isAnimating ? 'animate-bounce-in' : ''
          }`}
        >
          <div className={`${characterColor} border-4 rounded-2xl p-4 shadow-xl relative`}>
            {/* Character */}
            <div className="absolute -top-5 left-4 text-4xl animate-bounce">
              {characterEmoji}
            </div>
            
            {/* Close button */}
            <button
              onClick={hideHint}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            
            <div className="pt-4">
              <p className="text-sm text-gray-600 mb-1">{t('hints.tryThis')}</p>
              <p className="text-gray-800 font-medium">{currentHint}</p>
              
              <div className="flex items-center gap-2 mt-3">
                {isSupported && (
                  <button
                    onClick={() => isSpeaking ? stop() : speak(currentHint)}
                    className={`text-sm px-3 py-1 rounded-full transition-colors ${
                      isSpeaking 
                        ? 'bg-red-400 text-white' 
                        : 'bg-purple-400 text-white hover:bg-purple-500'
                    }`}
                  >
                    {isSpeaking ? '🔇' : '🔊'}
                  </button>
                )}
                
                {hasMoreHints && (
                  <button
                    onClick={showHint}
                    className="text-sm bg-green-400 hover:bg-green-500 text-green-900 px-3 py-1 rounded-full font-medium"
                  >
                    More hints →
                  </button>
                )}
              </div>
            </div>
            
            {/* Tail */}
            <div className={`absolute -bottom-3 left-8 w-6 h-6 ${characterColor.split(' ')[0]} border-b-4 border-r-4 ${characterColor.split(' ')[1]} transform rotate-45`} />
          </div>
        </div>
      )}
    </div>
  );
}
