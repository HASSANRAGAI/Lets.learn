'use client';

import React, { useState, useCallback, DragEvent } from 'react';
import { useTranslation } from 'react-i18next';

// Block types for Scratch-like blocks
interface BlockItem {
  id: string;
  type: 'motion' | 'looks' | 'sound' | 'events' | 'control';
  label: string;
  labelAr: string;
  color: string;
  icon: string;
}

// Main Puzzle Game Component
interface PuzzleGameProps {
  blocks: BlockItem[];
  solution: string[];
  onComplete?: (success: boolean) => void;
  puzzleTitle?: string;
  puzzleTitleAr?: string;
}

export function PuzzleGame({ blocks, solution, onComplete, puzzleTitle, puzzleTitleAr }: PuzzleGameProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [droppedBlocks, setDroppedBlocks] = useState<BlockItem[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = useCallback((e: DragEvent<HTMLDivElement>, block: BlockItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(block));
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const blockData = e.dataTransfer.getData('application/json');
      const block: BlockItem = JSON.parse(blockData);
      setDroppedBlocks(prev => [...prev, block]);
      setIsCorrect(null);
    } catch {
      // Invalid drop data
    }
  }, []);

  const handleRemove = useCallback((index: number) => {
    setDroppedBlocks(prev => prev.filter((_, i) => i !== index));
    setIsCorrect(null);
  }, []);

  const handleClear = () => {
    setDroppedBlocks([]);
    setIsCorrect(null);
  };

  const checkSolution = () => {
    const currentSolution = droppedBlocks.map(b => b.id);
    const correct = JSON.stringify(currentSolution) === JSON.stringify(solution);
    setIsCorrect(correct);
    
    if (correct) {
      setShowSuccess(true);
      onComplete?.(true);
    }
  };

  let borderColor = 'border-gray-300';
  if (isDragOver) borderColor = 'border-blue-500';
  if (isCorrect === true) borderColor = 'border-green-500';
  if (isCorrect === false) borderColor = 'border-red-500';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      {/* Title */}
      <h3 className="text-xl font-bold text-indigo-800 mb-4 text-center">
        🧩 {isArabic ? puzzleTitleAr : puzzleTitle || 'Solve the Puzzle!'}
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Available Blocks */}
        <div>
          <h4 className="font-bold text-gray-700 mb-3">Available Blocks</h4>
          <div className="flex flex-wrap gap-2">
            {blocks.map((block) => (
              <div
                key={block.id}
                draggable
                onDragStart={(e) => handleDragStart(e, block)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl cursor-grab active:cursor-grabbing shadow-md transition-all ${block.color} hover:scale-105 hover:shadow-lg`}
              >
                <span className="text-2xl">{block.icon}</span>
                <span className="font-bold text-white text-sm">
                  {isArabic ? block.labelAr : block.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <h4 className="font-bold text-gray-700 mb-3">Your Code</h4>
          <div
            className={`min-h-48 p-4 rounded-2xl border-4 border-dashed transition-colors ${borderColor} ${
              isDragOver ? 'bg-blue-50' : 'bg-gray-50'
            } ${isCorrect === true ? 'bg-green-50' : ''} ${isCorrect === false ? 'bg-red-50' : ''}`}
          >
            {droppedBlocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <span className="text-4xl mb-2">⬇️</span>
                <p className="text-center font-medium">
                  {t('playground.subtitle')}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {droppedBlocks.map((block, index) => (
                  <div
                    key={`${block.id}-${index}`}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-md ${block.color} group`}
                  >
                    <span className="text-2xl">{block.icon}</span>
                    <span className="font-bold text-white text-sm flex-1">
                      {isArabic ? block.labelAr : block.label}
                    </span>
                    <button
                      onClick={() => handleRemove(index)}
                      className="text-white/70 hover:text-white text-lg opacity-0 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {isCorrect === true && (
              <div className="mt-4 text-center">
                <span className="text-4xl">🎉</span>
                <p className="text-green-600 font-bold">{t('tutorial.complete')}</p>
              </div>
            )}
            
            {isCorrect === false && (
              <div className="mt-4 text-center">
                <span className="text-4xl">🤔</span>
                <p className="text-red-600 font-medium">{t('hints.almostThere')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-bold transition-colors"
        >
          {t('playground.clear')}
        </button>
        <button
          onClick={checkSolution}
          disabled={droppedBlocks.length === 0}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full font-bold transition-colors"
        >
          ✓ Check Answer
        </button>
      </div>

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30" onClick={() => setShowSuccess(false)}>
          <div className="animate-bounce-in bg-green-500 text-white px-12 py-8 rounded-3xl shadow-2xl text-center">
            <span className="text-6xl block mb-4">🎉</span>
            <p className="text-2xl font-bold">{t('tutorial.complete')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Default blocks for demo
export const defaultBlocks: BlockItem[] = [
  { id: 'move', type: 'motion', label: 'Move 10 steps', labelAr: 'تحرك 10 خطوات', color: 'bg-blue-500', icon: '➡️' },
  { id: 'turn', type: 'motion', label: 'Turn 15°', labelAr: 'استدر 15 درجة', color: 'bg-blue-500', icon: '↩️' },
  { id: 'say', type: 'looks', label: 'Say Hello!', labelAr: 'قل مرحبا!', color: 'bg-purple-500', icon: '💬' },
  { id: 'wait', type: 'control', label: 'Wait 1 sec', labelAr: 'انتظر 1 ثانية', color: 'bg-yellow-500', icon: '⏱️' },
  { id: 'play', type: 'sound', label: 'Play sound', labelAr: 'شغل صوت', color: 'bg-pink-500', icon: '🔊' },
  { id: 'repeat', type: 'control', label: 'Repeat 3 times', labelAr: 'كرر 3 مرات', color: 'bg-yellow-500', icon: '🔄' },
];
