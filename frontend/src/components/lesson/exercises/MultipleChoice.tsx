"use client";

import { Volume2 } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface Option {
  id: string;
  text: string;
  icon: string;
}

interface MultipleChoiceProps {
  prompt: string;
  categoryTag: string;
  audioText?: string;
  options: Option[];
  selectedId: string | null;
  onSelect: (id: string, text: string) => void;
}

export default function MultipleChoice({
  prompt,
  categoryTag,
  audioText,
  options,
  selectedId,
  onSelect,
}: MultipleChoiceProps) {
  return (
    <div className="flex flex-col flex-1 max-w-xl mx-auto w-full select-none">
      {/* Category Tag */}
      <div className="flex items-center gap-1.5 text-purple-600 font-black text-xs uppercase tracking-wider mb-2">
        <span>🃏</span>
        <span>{categoryTag}</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-4">{prompt}</h2>

      {/* Audio Button */}
      {audioText && (
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => sounds.speak(audioText)}
            className="w-12 h-12 rounded-2xl bg-[#1cb0f6] text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition shadow-sm"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <span
            onClick={() => sounds.speak(audioText)}
            className="text-xl font-black text-purple-700 border-b-2 border-dotted border-purple-400 cursor-pointer"
          >
            {audioText}
          </span>
        </div>
      )}

      {/* 2x2 Option Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 my-auto">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id, opt.text)}
              className={`p-4 sm:p-6 rounded-3xl flex flex-col items-center justify-center min-h-[140px] sm:min-h-[170px] transition ${
                isSelected ? "btn-3d-white selected" : "btn-3d-white"
              }`}
            >
              <span className="text-5xl sm:text-6xl my-auto">{opt.icon}</span>
              <span className="font-black text-sm sm:text-base text-gray-700 mt-2">{opt.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
