"use client";

import { Volume2 } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface WordBankProps {
  prompt: string;
  categoryTag: string;
  sentenceToTranslate: string;
  audioText?: string;
  selectedWords: string[];
  availableWords: string[];
  onAddWord: (word: string, index: number) => void;
  onRemoveWord: (word: string, index: number) => void;
}

export default function WordBank({
  prompt,
  categoryTag,
  sentenceToTranslate,
  audioText,
  selectedWords,
  availableWords,
  onAddWord,
  onRemoveWord,
}: WordBankProps) {
  return (
    <div className="flex flex-col flex-1 max-w-xl mx-auto w-full select-none">
      <div className="flex items-center gap-1.5 text-blue-600 font-black text-xs uppercase tracking-wider mb-2">
        <span>🌐</span>
        <span>{categoryTag}</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">{prompt}</h2>

      {/* Target sentence display */}
      <div className="flex items-center gap-3 my-4 p-4 bg-white border-2 border-gray-200 rounded-2xl shadow-xs">
        {audioText && (
          <button
            onClick={() => sounds.speak(audioText)}
            className="w-10 h-10 rounded-xl bg-[#1cb0f6] text-white flex items-center justify-center shrink-0 active:scale-95"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        )}
        <span className="text-lg font-black text-gray-800">{sentenceToTranslate}</span>
      </div>

      {/* Selected word slot / assembly line */}
      <div className="min-h-[56px] border-b-2 border-gray-300 flex flex-wrap gap-2 p-2 my-4 items-center">
        {selectedWords.map((word, idx) => (
          <button
            key={idx}
            onClick={() => onRemoveWord(word, idx)}
            className="btn-3d-white selected px-4 py-2 rounded-2xl font-black text-sm active:scale-95 transition"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Word Pool / Chips */}
      <div className="flex flex-wrap gap-2.5 mt-auto pt-6 justify-center">
        {availableWords.map((word, idx) => (
          <button
            key={idx}
            onClick={() => onAddWord(word, idx)}
            className="btn-3d-white px-4 py-2.5 rounded-2xl font-black text-sm active:scale-95 transition"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}
