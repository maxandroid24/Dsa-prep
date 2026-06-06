/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FlipHorizontal, Key, ChevronDown, Award } from 'lucide-react';

interface FlashcardProps {
  question: string;
  answer: string;
  index: number;
}

export const Flashcard: React.FC<FlashcardProps> = ({ question, answer, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      id={`faq-card-${index}`}
      className="relative w-full h-48 cursor-pointer group"
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* Cards Rotation Wrapper */}
      <div 
        className="w-full h-full relative duration-500 rounded-xl transition-transform"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* FRONT SIDE (Question) */}
        <div 
          className="absolute inset-0 w-full h-full p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between shadow-xl backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-start justify-between">
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-xs text-slate-400">
              Q{index + 1}
            </span>
            <Award className="h-4 w-4 text-slate-600 group-hover:text-amber-500 transition-colors" />
          </div>

          <h3 className="text-sm font-medium text-slate-100 mt-2 leading-relaxed">
            {question}
          </h3>

          <div className="flex items-center gap-1.5 text-xs font-mono text-blue-400 mt-auto">
            <FlipHorizontal className="h-3.5 w-3.5 animate-pulse" />
            <span>Click to flip & reveal</span>
          </div>
        </div>

        {/* BACK SIDE (Answer) */}
        <div 
          className="absolute inset-0 w-full h-full p-6 bg-slate-950 border border-blue-900/40 rounded-xl flex flex-col shadow-2xl backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-2">
            <Key className="h-4 w-4 text-amber-500" />
            <span className="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">Suggested Answer Answer</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed overflow-y-auto pr-1 flex-1">
            {answer}
          </p>

          <div className="text-[10px] font-mono text-emerald-400 mt-2 flex items-center gap-1 border-t border-slate-900 pt-2 bg-gradient-to-r from-emerald-950/20 to-transparent p-1 rounded">
            <span>✓ Verified Design Solution</span>
          </div>
        </div>
      </div>
    </div>
  );
};
