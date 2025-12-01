'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface CoinDisplayProps {
  amount: number;
  showAnimation?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CoinDisplay({ amount, showAnimation = false, size = 'md' }: CoinDisplayProps) {
  const { t } = useTranslation();
  const [displayAmount, setDisplayAmount] = useState(amount);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevAmountRef = useRef(amount);

  useEffect(() => {
    // Only animate when amount changes, not on initial render
    if (showAnimation && amount !== prevAmountRef.current) {
      // Animation state, intentional for UI feedback
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayAmount(amount);
        setIsAnimating(false);
      }, 500);
      prevAmountRef.current = amount;
      return () => clearTimeout(timer);
    }
    // For non-animated updates
    if (amount !== displayAmount) {
      prevAmountRef.current = amount;
      setDisplayAmount(amount);
    }
  }, [amount, showAnimation, displayAmount]);

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-1.5',
    lg: 'text-lg px-4 py-2',
  };

  const iconSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div
      className={`flex items-center gap-1 bg-yellow-100 rounded-full font-bold text-yellow-700 ${sizeClasses[size]} ${
        isAnimating ? 'animate-bounce' : ''
      }`}
      aria-label={t('coins.total', { amount: displayAmount })}
    >
      <span className={iconSizes[size]}>🪙</span>
      <span>{displayAmount.toLocaleString()}</span>
    </div>
  );
}

interface CoinEarnedAnimationProps {
  amount: number;
  onComplete?: () => void;
}

export function CoinEarnedAnimation({ amount, onComplete }: CoinEarnedAnimationProps) {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="animate-bounce-in bg-yellow-400 text-yellow-900 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
        <span className="text-4xl animate-spin-slow">🪙</span>
        <span className="text-2xl font-bold">{t('coins.earned', { amount })}</span>
      </div>
    </div>
  );
}
