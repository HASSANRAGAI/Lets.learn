'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface UseSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function useSpeech(options: UseSpeechOptions = {}) {
  const { i18n } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const { rate = 0.9, pitch = 1.1, volume = 1 } = options;

  useEffect(() => {
    // Use requestAnimationFrame to avoid synchronous setState in effect
    requestAnimationFrame(() => {
      setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    });
  }, []);

  const getVoice = useCallback(() => {
    if (!isSupported) return null;
    
    const voices = window.speechSynthesis.getVoices();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';
    
    // Try to find a kid-friendly voice
    const preferredVoice = voices.find(v => {
      const isCorrectLang = v.lang.startsWith(lang);
      // Prefer voices that sound more playful/kid-friendly
      const isPreferred = v.name.toLowerCase().includes('samantha') || 
                         v.name.toLowerCase().includes('karen') ||
                         v.name.toLowerCase().includes('fiona') ||
                         v.name.toLowerCase().includes('google') ||
                         v.name.toLowerCase().includes('microsoft');
      return isCorrectLang && isPreferred;
    });
    
    // Fallback to any voice in the correct language
    return preferredVoice || voices.find(v => v.lang.startsWith(lang)) || voices[0];
  }, [isSupported, i18n.language]);

  const speak = useCallback((text: string) => {
    if (!isSupported || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    const voice = getVoice();
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = i18n.language === 'ar' ? 'ar-SA' : 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isSupported, getVoice, rate, pitch, volume, i18n.language]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      window.speechSynthesis.pause();
    }
  }, [isSupported, isSpeaking]);

  const resume = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.resume();
    }
  }, [isSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isSupported,
  };
}
