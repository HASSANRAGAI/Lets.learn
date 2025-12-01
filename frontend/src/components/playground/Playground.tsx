'use client';

import React, { useState, useRef, useCallback, DragEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface ScratchBlock {
  id: string;
  type: 'motion' | 'looks' | 'sound' | 'events' | 'control' | 'sensing';
  label: string;
  labelAr: string;
  color: string;
  icon: string;
}

// Available blocks palette
const availableBlocks: ScratchBlock[] = [
  // Motion
  { id: 'move_10', type: 'motion', label: 'Move 10 steps', labelAr: 'تحرك 10 خطوات', color: 'bg-blue-500', icon: '➡️' },
  { id: 'turn_right', type: 'motion', label: 'Turn ↻ 15°', labelAr: 'استدر ↻ 15°', color: 'bg-blue-500', icon: '↩️' },
  { id: 'turn_left', type: 'motion', label: 'Turn ↺ 15°', labelAr: 'استدر ↺ 15°', color: 'bg-blue-500', icon: '↪️' },
  { id: 'goto_random', type: 'motion', label: 'Go to random position', labelAr: 'اذهب لموقع عشوائي', color: 'bg-blue-500', icon: '🎲' },
  
  // Looks
  { id: 'say_hello', type: 'looks', label: 'Say "Hello!"', labelAr: 'قل "مرحبا!"', color: 'bg-purple-500', icon: '💬' },
  { id: 'say_hmm', type: 'looks', label: 'Say "Hmm..."', labelAr: 'قل "همم..."', color: 'bg-purple-500', icon: '🤔' },
  { id: 'change_size', type: 'looks', label: 'Change size by 10', labelAr: 'غير الحجم بـ 10', color: 'bg-purple-500', icon: '📏' },
  { id: 'show', type: 'looks', label: 'Show', labelAr: 'أظهر', color: 'bg-purple-500', icon: '👀' },
  { id: 'hide', type: 'looks', label: 'Hide', labelAr: 'أخف', color: 'bg-purple-500', icon: '🙈' },
  
  // Sound
  { id: 'play_meow', type: 'sound', label: 'Play Meow', labelAr: 'شغل مياو', color: 'bg-pink-500', icon: '🐱' },
  { id: 'play_pop', type: 'sound', label: 'Play Pop', labelAr: 'شغل فرقعة', color: 'bg-pink-500', icon: '💥' },
  
  // Events
  { id: 'when_clicked', type: 'events', label: 'When clicked', labelAr: 'عند النقر', color: 'bg-yellow-500', icon: '🖱️' },
  { id: 'when_space', type: 'events', label: 'When space pressed', labelAr: 'عند ضغط المسافة', color: 'bg-yellow-500', icon: '⌨️' },
  
  // Control
  { id: 'wait_1', type: 'control', label: 'Wait 1 second', labelAr: 'انتظر 1 ثانية', color: 'bg-orange-500', icon: '⏱️' },
  { id: 'repeat_10', type: 'control', label: 'Repeat 10 times', labelAr: 'كرر 10 مرات', color: 'bg-orange-500', icon: '🔄' },
  { id: 'forever', type: 'control', label: 'Forever', labelAr: 'للأبد', color: 'bg-orange-500', icon: '♾️' },
];

// Sprite state type
interface SpriteState {
  x: number;
  y: number;
  rotation: number;
  size: number;
  visible: boolean;
  saying: string;
}

// Block in the code area
interface CodeBlock extends ScratchBlock {
  instanceId: string;
}

// Stage with Scratch Cat
function Stage({ sprite }: { sprite: SpriteState }) {
  return (
    <div className="relative w-full h-64 bg-white rounded-xl border-4 border-indigo-200 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-green-200" />
      
      {/* Scratch Cat */}
      {sprite.visible && (
        <div
          className="absolute transition-all duration-300 ease-out"
          style={{
            left: `${50 + sprite.x / 4}%`,
            top: `${50 - sprite.y / 4}%`,
            transform: `translate(-50%, -50%) rotate(${sprite.rotation}deg) scale(${sprite.size / 100})`,
          }}
        >
          <div className="text-6xl">🐱</div>
          {sprite.saying && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-md whitespace-nowrap">
              <p className="text-sm font-medium">{sprite.saying}</p>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Main Playground Component
export function Playground() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [sprite, setSprite] = useState<SpriteState>({
    x: 0,
    y: 0,
    rotation: 0,
    size: 100,
    visible: true,
    saying: '',
  });
  
  const runningRef = useRef(false);

  const handleDragStart = useCallback((e: DragEvent<HTMLDivElement>, block: ScratchBlock) => {
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
      const block: ScratchBlock = JSON.parse(blockData);
      const newBlock: CodeBlock = {
        ...block,
        instanceId: `${block.id}_${Date.now()}`,
      };
      setCodeBlocks(prev => [...prev, newBlock]);
    } catch {
      // Invalid drop data
    }
  }, []);

  const handleRemove = useCallback((index: number) => {
    setCodeBlocks(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleClear = () => {
    setCodeBlocks([]);
    setSprite({
      x: 0,
      y: 0,
      rotation: 0,
      size: 100,
      visible: true,
      saying: '',
    });
  };

  const executeBlock = async (block: CodeBlock) => {
    return new Promise<void>((resolve) => {
      switch (block.id) {
        case 'move_10':
          setSprite(prev => ({ ...prev, x: prev.x + 10 }));
          setTimeout(resolve, 200);
          break;
        case 'turn_right':
          setSprite(prev => ({ ...prev, rotation: prev.rotation + 15 }));
          setTimeout(resolve, 200);
          break;
        case 'turn_left':
          setSprite(prev => ({ ...prev, rotation: prev.rotation - 15 }));
          setTimeout(resolve, 200);
          break;
        case 'goto_random':
          setSprite(prev => ({
            ...prev,
            x: Math.floor(Math.random() * 200 - 100),
            y: Math.floor(Math.random() * 100 - 50),
          }));
          setTimeout(resolve, 200);
          break;
        case 'say_hello':
          setSprite(prev => ({ ...prev, saying: 'Hello!' }));
          setTimeout(() => {
            setSprite(prev => ({ ...prev, saying: '' }));
            resolve();
          }, 1500);
          break;
        case 'say_hmm':
          setSprite(prev => ({ ...prev, saying: 'Hmm...' }));
          setTimeout(() => {
            setSprite(prev => ({ ...prev, saying: '' }));
            resolve();
          }, 1500);
          break;
        case 'change_size':
          setSprite(prev => ({ ...prev, size: Math.min(200, prev.size + 10) }));
          setTimeout(resolve, 200);
          break;
        case 'show':
          setSprite(prev => ({ ...prev, visible: true }));
          setTimeout(resolve, 100);
          break;
        case 'hide':
          setSprite(prev => ({ ...prev, visible: false }));
          setTimeout(resolve, 100);
          break;
        case 'wait_1':
          setTimeout(resolve, 1000);
          break;
        default:
          setTimeout(resolve, 100);
      }
    });
  };

  const runCode = async () => {
    if (isRunning) {
      runningRef.current = false;
      setIsRunning(false);
      return;
    }

    setIsRunning(true);
    runningRef.current = true;
    
    // Reset sprite position
    setSprite(prev => ({ ...prev, x: 0, y: 0, rotation: 0, size: 100, visible: true, saying: '' }));

    for (const block of codeBlocks) {
      if (!runningRef.current) break;
      await executeBlock(block);
    }

    setIsRunning(false);
    runningRef.current = false;
  };

  // Group blocks by type
  const blocksByType = availableBlocks.reduce((acc, block) => {
    if (!acc[block.type]) acc[block.type] = [];
    acc[block.type].push(block);
    return acc;
  }, {} as Record<string, ScratchBlock[]>);

  const categoryLabels: Record<string, { label: string; color: string }> = {
    motion: { label: 'Motion', color: 'bg-blue-500' },
    looks: { label: 'Looks', color: 'bg-purple-500' },
    sound: { label: 'Sound', color: 'bg-pink-500' },
    events: { label: 'Events', color: 'bg-yellow-500' },
    control: { label: 'Control', color: 'bg-orange-500' },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4">
        <h2 className="text-xl font-bold">{t('playground.title')}</h2>
        <p className="text-sm text-indigo-200">{t('playground.subtitle')}</p>
      </div>

      <div className="p-4">
        {/* Stage */}
        <Stage sprite={sprite} />

        {/* Controls */}
        <div className="flex justify-center gap-4 my-4">
          <button
            onClick={runCode}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isRunning ? t('playground.stop') : t('playground.run')}
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-bold transition-colors"
          >
            {t('playground.clear')}
          </button>
        </div>

        {/* Main Area */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Block Palette */}
          <div className="bg-gray-100 rounded-xl p-3 max-h-80 overflow-y-auto">
            {Object.entries(blocksByType).map(([type, blocks]) => (
              <div key={type} className="mb-3">
                <div className={`text-xs font-bold text-white px-2 py-1 rounded ${categoryLabels[type]?.color || 'bg-gray-500'} mb-2`}>
                  {categoryLabels[type]?.label || type}
                </div>
                <div className="flex flex-col gap-1">
                  {blocks.map(block => (
                    <div
                      key={block.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, block)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing shadow-sm transition-all ${block.color} hover:shadow-md hover:scale-105`}
                    >
                      <span className="text-lg">{block.icon}</span>
                      <span className="font-medium text-white text-xs">
                        {isArabic ? block.labelAr : block.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Code Area */}
          <div
            className="md:col-span-2"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div
              className={`flex-1 min-h-64 p-4 rounded-xl border-2 transition-colors ${
                isDragOver ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
              }`}
            >
              {codeBlocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <span className="text-4xl mb-2">📝</span>
                  <p className="text-center">{t('playground.subtitle')}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {codeBlocks.map((block, index) => (
                    <div
                      key={block.instanceId}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-md ${block.color} group`}
                    >
                      <span className="text-xl">{block.icon}</span>
                      <span className="font-bold text-white text-sm flex-1">
                        {isArabic ? block.labelAr : block.label}
                      </span>
                      <button
                        onClick={() => handleRemove(index)}
                        className="text-white/50 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
