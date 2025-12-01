'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
    // Update document direction for RTL support
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white font-medium"
      aria-label={currentLang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <span className="text-lg">{currentLang === 'en' ? '🇺🇸' : '🇸🇦'}</span>
      <span className="text-sm">{currentLang === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}
