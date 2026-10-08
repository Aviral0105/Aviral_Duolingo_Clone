"use client";

import { useState } from "react";
import { Volume2, Keyboard, Snail } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface WordBankProps {
  prompt: string;
  categoryTag?: string;
  sentenceToTranslate: string;
  audioText?: string;
  availableWords: string[];
  selectedWords: string[];
  typedAnswer?: string;
  onTypedChange?: (val: string) => void;
  onAddWord: (word: string, index: number) => void;
  onRemoveWord: (word: string, index: number) => void;
}

export default function WordBank({
  prompt,
  categoryTag = "TRANSLATE",
  sentenceToTranslate,
  audioText,
  availableWords,
  selectedWords,
  typedAnswer = "",
  onTypedChange,
  onAddWord,
  onRemoveWord,
}: WordBankProps) {
  const [useKeyboard, setUseKeyboard] = useState(false);


  return (
    <div className="flex flex-col h-full select-none max-w-xl mx-auto w-full">
      {/* Category Tag */}
      <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 mb-1">
        ✨ {categoryTag}
      </span>

      {/* Prompt */}
      <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-4">{prompt}</h2>

      {/* Sentence with Speakers */}
      <div className="flex items-center gap-3 my-2">
        {audioText && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => sounds.speak(audioText, 0.9)}
              className="w-12 h-12 rounded-2xl bg-[#1cb0f6] text-white flex items-center justify-center shrink-0 active:scale-95 shadow-md hover:brightness-105 transition btn-3d-blue"
              title="Normal Speed"
            >
              <Volume2 className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => sounds.speak(audioText, 0.5)}
              className="w-11 h-11 rounded-2xl bg-[#e5f6fd] text-[#1cb0f6] border-2 border-[#84d8ff] flex items-center justify-center shrink-0 active:scale-95 hover:bg-[#d0effc] transition"
              title="Slow Speed (Snail)"
            >
              <Snail className="w-6 h-6 stroke-[2.2]" />
            </button>
          </div>
        )}
        <span className="text-lg sm:text-xl font-black text-gray-800">{sentenceToTranslate}</span>
      </div>

      {useKeyboard ? (
        /* Keyboard Direct Type Input */
        <div className="my-6">
          <input
            type="text"
            value={typedAnswer}
            onChange={(e) => onTypedChange?.(e.target.value)}
            placeholder="Type your translation here..."
            className="w-full p-4 rounded-2xl border-2 border-gray-300 focus:border-[#1cb0f6] outline-none font-bold text-base text-gray-800"
          />
        </div>
      ) : (
        <>
          {/* Selected word slot / assembly line */}
          <div className="min-h-[64px] border-b-2 border-gray-300 flex flex-wrap gap-2 p-2 my-4 items-center">
            {selectedWords.map((word, idx) => (
              <button
                key={idx}
                onClick={() => onRemoveWord(word, idx)}
                className="btn-3d-white selected px-4 py-2.5 rounded-2xl font-black text-sm active:scale-95 transition"
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
        </>
      )}

      {/* Keyboard / Word Bank Toggle Button (as seen in video) */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setUseKeyboard(!useKeyboard)}
          className="text-xs font-black uppercase text-gray-400 hover:text-gray-600 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition"
        >
          <Keyboard className="w-4 h-4" />
          <span>{useKeyboard ? "Use word bank" : "Use keyboard"}</span>
        </button>
      </div>
    </div>
  );
}
