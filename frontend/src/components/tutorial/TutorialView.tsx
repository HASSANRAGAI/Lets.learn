'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSpeech } from '@/hooks/useSpeech';
import { ReadAloudButton } from '@/components/ui/ReadAloudButton';
import { HintSystem } from '@/components/hints/HintSystem';
import { CharacterBubble } from './CharacterBubble';
import { PuzzleGame, defaultBlocks } from '@/components/playground/PuzzleGame';
import type { Lesson, ContentBlock } from '@/types';

interface TutorialViewProps {
  lesson: Lesson;
  onComplete?: (coinsEarned: number) => void;
  onBack?: () => void;
}

export function TutorialView({ lesson, onComplete, onBack }: TutorialViewProps) {
  const { t, i18n } = useTranslation();
  const { isSupported } = useSpeech();
  const isArabic = i18n.language === 'ar';

  const [currentStep, setCurrentStep] = useState(0);
  const [showCharacter, setShowCharacter] = useState(true);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);

  const title = isArabic ? lesson.titleAr : lesson.title;
  const description = isArabic ? lesson.descriptionAr : lesson.description;
  const characterJoke = isArabic ? lesson.characterIntroJokeAr : lesson.characterIntroJoke;

  // Demo content blocks if none provided
  const contentBlocks: ContentBlock[] = lesson.contentBlocks?.length > 0 
    ? lesson.contentBlocks as ContentBlock[]
    : [
        {
          id: 'intro',
          type: 'text',
          order: 0,
          text: `Welcome to "${lesson.title}"! In this lesson, you'll learn something amazing.`,
          textAr: `مرحباً بك في "${lesson.titleAr}"! في هذا الدرس ستتعلم شيئاً رائعاً.`,
        },
        {
          id: 'explain',
          type: 'text',
          order: 1,
          text: 'First, let\'s understand the basics. Scratch blocks are like puzzle pieces that you can connect together to make cool things happen!',
          textAr: 'أولاً، دعنا نفهم الأساسيات. كتل سكراتش مثل قطع الأحجية التي يمكنك ربطها معاً لصنع أشياء رائعة!',
        },
        {
          id: 'activity',
          type: 'puzzle',
          order: 2,
          text: 'Now it\'s your turn! Try solving this puzzle.',
          textAr: 'الآن دورك! حاول حل هذه الأحجية.',
        },
      ];

  const currentContent = contentBlocks[currentStep];
  const isLastStep = currentStep === contentBlocks.length - 1;
  const isPuzzleStep = currentContent?.type === 'puzzle';

  const hints = [
    isArabic ? 'ابدأ بسحب كتلة الحركة' : 'Start by dragging a motion block',
    isArabic ? 'جرب إضافة كتلة القول' : 'Try adding a say block',
    isArabic ? 'أحسنت! واصل' : 'Great job! Keep going',
  ];

  const handleNextStep = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete?.(lesson.coinsReward);
  };

  const handlePuzzleComplete = (success: boolean) => {
    if (success) {
      setPuzzleCompleted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100 pb-20">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-4 px-6 shadow-lg sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="hover:bg-indigo-700 p-2 rounded-full transition-colors"
            >
              ← {t('common.back')}
            </button>
            <h1 className="text-xl font-bold truncate">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
              🪙 +{lesson.coinsReward}
            </span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-6 mt-4">
        <div className="bg-white rounded-full h-3 shadow-inner">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
            style={{ width: `${((currentStep + 1) / contentBlocks.length) * 100}%` }}
          />
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          Step {currentStep + 1} of {contentBlocks.length}
        </p>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* Content Block */}
          {currentContent && (
            <div className="mb-6">
              {currentContent.type === 'text' && (
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {isArabic ? currentContent.textAr : currentContent.text}
                  </p>
                  
                  {/* Read Aloud Button */}
                  {isSupported && (
                    <div className="mt-4">
                      <ReadAloudButton
                        text={(isArabic ? currentContent.textAr : currentContent.text) || ''}
                      />
                    </div>
                  )}
                </div>
              )}

              {currentContent.type === 'puzzle' && (
                <div>
                  <p className="text-gray-700 mb-4">
                    {isArabic ? currentContent.textAr : currentContent.text}
                  </p>
                  <PuzzleGame
                    blocks={defaultBlocks}
                    solution={['move', 'say', 'move']}
                    puzzleTitle="Make Scratch Move and Talk!"
                    puzzleTitleAr="اجعل سكراتش يتحرك ويتكلم!"
                    onComplete={handlePuzzleComplete}
                  />
                </div>
              )}

              {currentContent.type === 'video' && currentContent.mediaUrl && (
                <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500">🎬 Video: {currentContent.mediaUrl}</p>
                </div>
              )}
            </div>
          )}

          {/* Hints */}
          <div className="flex justify-center mb-6">
            <HintSystem hints={hints} characterName="scratchy" />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-full font-bold transition-colors"
            >
              {t('tutorial.prevStep')}
            </button>

            <button
              onClick={handleNextStep}
              disabled={isPuzzleStep && !puzzleCompleted}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl"
            >
              {isLastStep ? t('tutorial.complete') : t('tutorial.nextStep')}
            </button>
          </div>
        </div>
      </main>

      {/* Character Bubble */}
      {showCharacter && characterJoke && (
        <CharacterBubble
          characterName="scratchy"
          message={description}
          joke={characterJoke}
          onClose={() => setShowCharacter(false)}
        />
      )}
    </div>
  );
}

// Lesson Card for listing
interface LessonCardProps {
  lesson: Lesson;
  isCompleted?: boolean;
  onClick?: () => void;
}

export function LessonCard({ lesson, isCompleted = false, onClick }: LessonCardProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const title = isArabic ? lesson.titleAr : lesson.title;
  const description = isArabic ? lesson.descriptionAr : lesson.description;

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    hard: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-lg hover:scale-102 ${
        isCompleted
          ? 'bg-green-50 border-green-300'
          : difficultyColors[lesson.difficulty] || 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl">
          {isCompleted ? '✅' : lesson.order === 1 ? '1️⃣' : lesson.order === 2 ? '2️⃣' : '3️⃣'}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-800">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-gray-500">⏱️ {lesson.durationMinutes} min</span>
            <span className="text-sm text-yellow-600">🪙 +{lesson.coinsReward}</span>
          </div>
        </div>
        {!isCompleted && (
          <span className="text-indigo-500 font-bold">Start →</span>
        )}
      </div>
    </button>
  );
}
