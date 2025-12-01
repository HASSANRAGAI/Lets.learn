'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSpeech } from '@/hooks/useSpeech';

interface CharacterBubbleProps {
  characterName: 'scratchy' | 'robbie';
  message: string;
  joke?: string;
  autoSpeak?: boolean;
  onClose?: () => void;
}

const characterData = {
  scratchy: {
    emoji: '🐱',
    color: 'bg-orange-100 border-orange-400',
    textColor: 'text-orange-800',
  },
  robbie: {
    emoji: '🤖',
    color: 'bg-blue-100 border-blue-400',
    textColor: 'text-blue-800',
  },
};

export function CharacterBubble({ 
  characterName, 
  message, 
  joke, 
  autoSpeak = false,
  onClose 
}: CharacterBubbleProps) {
  const { t, i18n } = useTranslation();
  const { speak, isSpeaking, stop, isSupported } = useSpeech({ rate: 0.85, pitch: 1.2 });
  const [showJoke, setShowJoke] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const character = characterData[characterName];
  const nameKey = `characters.${characterName}.name`;
  const name = t(nameKey);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (autoSpeak && isSupported) {
      speak(message);
    }
  }, [autoSpeak, message, speak, isSupported]);

  const handleJokeClick = () => {
    setShowJoke(true);
    if (joke && isSupported) {
      speak(joke);
    }
  };

  const handleClose = () => {
    if (isSpeaking) {
      stop();
    }
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  return (
    <div
      className={`fixed bottom-4 ${i18n.language === 'ar' ? 'left-4' : 'right-4'} z-40 max-w-sm transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className={`relative ${character.color} border-4 rounded-2xl p-4 shadow-xl`}>
        {/* Character avatar */}
        <div className="absolute -top-6 left-4 text-5xl animate-bounce">
          {character.emoji}
        </div>
        
        {/* Close button */}
        {onClose && (
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Close"
          >
            ✕
          </button>
        )}
        
        <div className="pt-6">
          {/* Character name */}
          <p className={`font-bold ${character.textColor} mb-2`}>{name}:</p>
          
          {/* Message */}
          <p className="text-gray-700 mb-3">{message}</p>
          
          {/* Joke section */}
          {joke && !showJoke && (
            <button
              onClick={handleJokeClick}
              className="text-sm bg-yellow-300 hover:bg-yellow-400 text-yellow-800 px-3 py-1 rounded-full font-medium transition-colors"
            >
              🎭 Tell me a joke!
            </button>
          )}
          
          {showJoke && joke && (
            <div className="bg-yellow-100 rounded-lg p-3 mt-2 border-2 border-yellow-300">
              <p className="text-yellow-800 font-medium">{joke}</p>
              <p className="text-2xl mt-2 text-center animate-bounce">😂</p>
            </div>
          )}
          
          {/* Speak button */}
          {isSupported && (
            <button
              onClick={() => isSpeaking ? stop() : speak(showJoke && joke ? joke : message)}
              className={`mt-3 text-sm px-3 py-1 rounded-full font-medium transition-colors ${
                isSpeaking 
                  ? 'bg-red-400 text-white' 
                  : 'bg-purple-400 text-white hover:bg-purple-500'
              }`}
            >
              {isSpeaking ? '🔇 Stop' : '🔊 Read aloud'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
