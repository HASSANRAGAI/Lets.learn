'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AvatarPart {
  id: string;
  category: 'base' | 'eyes' | 'mouth' | 'accessory' | 'hat';
  emoji: string;
  unlocked: boolean;
  cost?: number;
}

const avatarParts: AvatarPart[] = [
  // Base characters
  { id: 'cat', category: 'base', emoji: '🐱', unlocked: true },
  { id: 'dog', category: 'base', emoji: '🐶', unlocked: true },
  { id: 'bear', category: 'base', emoji: '🐻', unlocked: true },
  { id: 'bunny', category: 'base', emoji: '🐰', unlocked: false, cost: 50 },
  { id: 'fox', category: 'base', emoji: '🦊', unlocked: false, cost: 100 },
  { id: 'panda', category: 'base', emoji: '🐼', unlocked: false, cost: 150 },
  { id: 'robot', category: 'base', emoji: '🤖', unlocked: false, cost: 200 },
  { id: 'alien', category: 'base', emoji: '👽', unlocked: false, cost: 250 },
  
  // Accessories
  { id: 'glasses', category: 'accessory', emoji: '👓', unlocked: true },
  { id: 'sunglasses', category: 'accessory', emoji: '😎', unlocked: false, cost: 25 },
  { id: 'star', category: 'accessory', emoji: '⭐', unlocked: false, cost: 30 },
  { id: 'heart', category: 'accessory', emoji: '❤️', unlocked: true },
  { id: 'sparkle', category: 'accessory', emoji: '✨', unlocked: false, cost: 40 },
  { id: 'rainbow', category: 'accessory', emoji: '🌈', unlocked: false, cost: 75 },
  
  // Hats
  { id: 'crown', category: 'hat', emoji: '👑', unlocked: false, cost: 100 },
  { id: 'party', category: 'hat', emoji: '🎉', unlocked: true },
  { id: 'wizard', category: 'hat', emoji: '🧙', unlocked: false, cost: 150 },
  { id: 'astronaut', category: 'hat', emoji: '🚀', unlocked: false, cost: 200 },
];

const colors = [
  { id: 'blue', value: 'bg-blue-400', unlocked: true },
  { id: 'green', value: 'bg-green-400', unlocked: true },
  { id: 'yellow', value: 'bg-yellow-400', unlocked: true },
  { id: 'pink', value: 'bg-pink-400', unlocked: true },
  { id: 'purple', value: 'bg-purple-400', unlocked: false, cost: 25 },
  { id: 'orange', value: 'bg-orange-400', unlocked: false, cost: 25 },
  { id: 'red', value: 'bg-red-400', unlocked: false, cost: 50 },
  { id: 'rainbow', value: 'bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400', unlocked: false, cost: 100 },
];

interface AvatarCustomizerProps {
  currentCoins?: number;
  onSave?: (avatar: { base: string; color: string; accessories: string[] }) => void;
  unlockedItems?: string[];
}

export function AvatarCustomizer({ currentCoins = 0, onSave, unlockedItems = [] }: AvatarCustomizerProps) {
  const { t } = useTranslation();
  const [selectedBase, setSelectedBase] = useState('cat');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(['party']);
  const [activeTab, setActiveTab] = useState<'base' | 'color' | 'accessory' | 'hat'>('base');

  const isUnlocked = (id: string) => {
    const item = [...avatarParts, ...colors].find(p => p.id === id);
    return item?.unlocked || unlockedItems.includes(id);
  };

  const toggleAccessory = (id: string) => {
    if (!isUnlocked(id)) return;
    
    setSelectedAccessories(prev => {
      if (prev.includes(id)) {
        return prev.filter(a => a !== id);
      }
      return [...prev, id];
    });
  };

  const getSelectedEmoji = (category: 'base' | 'accessory' | 'hat') => {
    if (category === 'base') {
      return avatarParts.find(p => p.id === selectedBase)?.emoji || '🐱';
    }
    return selectedAccessories
      .map(id => avatarParts.find(p => p.id === id)?.emoji)
      .filter(Boolean)
      .join('');
  };

  const handleSave = () => {
    onSave?.({
      base: selectedBase,
      color: selectedColor,
      accessories: selectedAccessories,
    });
  };

  const tabs = [
    { id: 'base' as const, label: '😺 Character', labelAr: '😺 الشخصية' },
    { id: 'color' as const, label: '🎨 Color', labelAr: '🎨 اللون' },
    { id: 'accessory' as const, label: '✨ Items', labelAr: '✨ العناصر' },
    { id: 'hat' as const, label: '🎩 Hats', labelAr: '🎩 القبعات' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4">
        <h2 className="text-xl font-bold">{t('avatar.title')}</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg">🪙</span>
          <span className="font-bold">{currentCoins}</span>
        </div>
      </div>

      <div className="p-4">
        {/* Preview */}
        <div className="flex justify-center mb-6">
          <div className={`w-32 h-32 rounded-full ${colors.find(c => c.id === selectedColor)?.value || 'bg-blue-400'} flex items-center justify-center shadow-lg relative`}>
            {/* Hat */}
            <div className="absolute -top-4">
              {selectedAccessories
                .filter(id => avatarParts.find(p => p.id === id)?.category === 'hat')
                .map(id => (
                  <span key={id} className="text-3xl">
                    {avatarParts.find(p => p.id === id)?.emoji}
                  </span>
                ))}
            </div>
            
            {/* Base character */}
            <span className="text-6xl">{getSelectedEmoji('base')}</span>
            
            {/* Accessories */}
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
              {selectedAccessories
                .filter(id => avatarParts.find(p => p.id === id)?.category === 'accessory')
                .slice(0, 2)
                .map(id => (
                  <span key={id} className="text-2xl block">
                    {avatarParts.find(p => p.id === id)?.emoji}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-full text-sm font-bold transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Selection Grid */}
        <div className="bg-gray-50 rounded-xl p-4 min-h-32">
          {activeTab === 'color' ? (
            <div className="flex flex-wrap justify-center gap-3">
              {colors.map(color => (
                <button
                  key={color.id}
                  onClick={() => isUnlocked(color.id) && setSelectedColor(color.id)}
                  className={`w-12 h-12 rounded-full ${color.value} transition-transform relative ${
                    selectedColor === color.id ? 'ring-4 ring-purple-500 scale-110' : ''
                  } ${!isUnlocked(color.id) ? 'opacity-50' : 'hover:scale-105'}`}
                >
                  {!isUnlocked(color.id) && (
                    <span className="absolute inset-0 flex items-center justify-center text-white">
                      🔒
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {avatarParts
                .filter(p => p.category === activeTab)
                .map(part => (
                  <button
                    key={part.id}
                    onClick={() => {
                      if (!isUnlocked(part.id)) return;
                      if (activeTab === 'base') {
                        setSelectedBase(part.id);
                      } else {
                        toggleAccessory(part.id);
                      }
                    }}
                    className={`w-14 h-14 rounded-xl bg-white shadow-md flex flex-col items-center justify-center transition-all relative ${
                      (activeTab === 'base' && selectedBase === part.id) ||
                      (activeTab !== 'base' && selectedAccessories.includes(part.id))
                        ? 'ring-4 ring-purple-500 scale-110'
                        : ''
                    } ${!isUnlocked(part.id) ? 'opacity-50' : 'hover:scale-105'}`}
                  >
                    <span className="text-2xl">{part.emoji}</span>
                    {!isUnlocked(part.id) && (
                      <span className="absolute bottom-0 right-0 text-xs bg-yellow-400 px-1 rounded">
                        {part.cost}🪙
                      </span>
                    )}
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            {t('avatar.save')} ✨
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple avatar display component
interface AvatarDisplayProps {
  base?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarDisplay({ base = 'cat', color = 'blue', size = 'md', className = '' }: AvatarDisplayProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-20 h-20 text-4xl',
  };

  const colorValue = colors.find(c => c.id === color)?.value || 'bg-blue-400';
  const emoji = avatarParts.find(p => p.id === base)?.emoji || '🐱';

  return (
    <div className={`rounded-full ${colorValue} ${sizeClasses[size]} flex items-center justify-center ${className}`}>
      <span>{emoji}</span>
    </div>
  );
}
