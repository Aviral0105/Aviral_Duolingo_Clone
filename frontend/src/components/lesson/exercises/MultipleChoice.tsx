"use client";

import { useEffect } from "react";
import { Volume2 } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface Option {
  id: string;
  text: string;
  icon?: string;
}

interface MultipleChoiceProps {
  prompt: string;
  categoryTag?: string;
  audioText?: string;
  speechBubbleText?: string;
  options: Option[];
  selectedId: string | null;
  onSelect: (id: string, text: string) => void;
}

export default function MultipleChoice({
  prompt,
  categoryTag = "NEW WORD",
  audioText,
  speechBubbleText,
  options = [],
  selectedId,
  onSelect,
}: MultipleChoiceProps) {
  // Keyboard shortcut listener for 1, 2, 3, 4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= options.length) {
        const opt = options[num - 1];
        if (opt) {
          onSelect(opt.id, opt.text);
          if (opt.text) sounds.speak(opt.text, 0.9);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, onSelect]);

  const hasIcons = options.some((o) => Boolean(o.icon));

  return (
    <div className="flex flex-col flex-1 max-w-xl mx-auto w-full select-none justify-center">
      {/* Category Tag */}
      <div className="flex items-center gap-1.5 text-purple-600 font-black text-xs uppercase tracking-wider mb-2">
        <span>🃏</span>
        <span>{categoryTag}</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-4">{prompt}</h2>

      {/* Audio Button if provided */}
      {audioText && (
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => sounds.speak(audioText, 0.9)}
            className="w-12 h-12 rounded-2xl bg-[#1cb0f6] text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition shadow-sm btn-3d-blue"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <span
            onClick={() => sounds.speak(audioText, 0.9)}
            className="text-xl font-black text-gray-800 border-b-2 border-dotted border-gray-400 cursor-pointer hover:text-purple-600"
          >
            {audioText}
          </span>
        </div>
      )}

      {/* Vikram Character with Speech Bubble (matching Duolingo Frame 50s/52s) */}
      {speechBubbleText && (
        <div className="flex items-center gap-4 mb-6 mt-2">
          {/* Vikram SVG Avatar */}
          <div className="w-20 h-24 shrink-0 drop-shadow-sm">
            <svg viewBox="0 0 100 120" className="w-full h-full">
              {/* Blue Turban */}
              <ellipse cx="50" cy="40" rx="26" ry="22" fill="#1cb0f6" />
              <circle cx="50" cy="22" r="10" fill="#029bd8" />
              {/* Face */}
              <circle cx="50" cy="52" r="18" fill="#d4926b" />
              {/* Eyes */}
              <circle cx="43" cy="48" r="3.5" fill="#ffffff" />
              <circle cx="44" cy="48" r="2" fill="#2d3436" />
              <circle cx="57" cy="48" r="3.5" fill="#ffffff" />
              <circle cx="56" cy="48" r="2" fill="#2d3436" />
              {/* Beard */}
              <path
                d="M32 52 C32 74, 68 74, 68 52 C68 62, 32 62, 32 52 Z"
                fill="#2d3436"
              />
              {/* Pink Sweater Body */}
              <path
                d="M30 76 L70 76 L74 105 L26 105 Z"
                fill="#ea2b8c"
              />
              <path
                d="M44 86 L47 94 L50 86 L53 94 L56 86"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Legs */}
              <rect x="36" y="105" width="10" height="15" rx="3" fill="#0984e3" />
              <rect x="54" y="105" width="10" height="15" rx="3" fill="#0984e3" />
            </svg>
          </div>

          {/* Speech Bubble */}
          <div className="relative bg-white border-2 border-gray-200 rounded-2xl px-5 py-3 font-black text-gray-800 text-lg shadow-sm">
            {speechBubbleText}
            <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-10 border-r-gray-200" />
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-7 border-t-transparent border-b-7 border-b-transparent border-r-9 border-r-white" />
          </div>
        </div>
      )}

      {/* Options Cards */}
      {hasIcons ? (
        /* Image / Card Grid matching Duolingo Frame 8s (3 side by side) */
        <div className="grid grid-cols-3 gap-3 sm:gap-4 my-auto">
          {options.map((opt, idx) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onSelect(opt.id, opt.text);
                  sounds.speak(opt.text, 0.9);
                }}
                className={`p-4 rounded-3xl flex flex-col items-center justify-between min-h-[160px] sm:min-h-[190px] border-2 transition ${
                  isSelected
                    ? "border-[#84d8ff] bg-[#ddf4ff] shadow-xs"
                    : "border-gray-200 bg-white hover:bg-gray-50 shadow-sm active:translate-y-0.5"
                }`}
              >
                <div className="flex-1 flex items-center justify-center text-5xl sm:text-6xl my-auto">
                  {opt.icon}
                </div>
                <div className="w-full flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                  <span
                    className={`font-black text-sm sm:text-base ${
                      isSelected ? "text-[#1cb0f6]" : "text-gray-700"
                    }`}
                  >
                    {opt.text}
                  </span>
                  <span className="w-5 h-5 rounded-md border border-gray-200 text-[10px] font-black text-gray-400 flex items-center justify-center">
                    {idx + 1}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Wide Pill Buttons matching Duolingo Review Frame 50s */
        <div className="flex flex-col gap-3 my-auto">
          {options.map((opt, idx) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onSelect(opt.id, opt.text);
                  sounds.speak(opt.text, 0.9);
                }}
                className={`w-full p-4.5 rounded-2xl border-2 font-bold text-base sm:text-lg flex items-center justify-between transition ${
                  isSelected
                    ? "border-[#84d8ff] bg-[#ddf4ff] text-[#1cb0f6] shadow-xs"
                    : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-sm active:translate-y-0.5"
                }`}
              >
                <span className="w-6 h-6 rounded-md border border-gray-200 text-xs font-black text-gray-400 flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-bold flex-1 text-center">{opt.text}</span>
                <span className="w-6 shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
