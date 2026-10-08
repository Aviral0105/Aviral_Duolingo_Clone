"use client";

import { Volume2 } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface FillBlankProps {
  prompt: string;
  categoryTag: string;
  audioText?: string;
  prefix: string;
  suffix: string;
  options: string[];
  selectedWord: string | null;
  onSelect: (word: string) => void;
}

export default function FillBlank({
  prompt,
  categoryTag,
  audioText,
  prefix,
  suffix,
  options,
  selectedWord,
  onSelect,
}: FillBlankProps) {
  return (
    <div className="flex flex-col flex-1 max-w-xl mx-auto w-full select-none">
      <div className="flex items-center gap-1.5 text-green-600 font-black text-xs uppercase tracking-wider mb-2">
        <span>✏️</span>
        <span>{categoryTag}</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-6">{prompt}</h2>

      {/* Sentence with Gap */}
      <div className="flex items-center gap-3 p-5 bg-white border-2 border-gray-200 rounded-3xl shadow-xs my-auto">
        {audioText && (
          <button
            onClick={() => sounds.speak(audioText)}
            className="w-10 h-10 rounded-xl bg-[#1cb0f6] text-white flex items-center justify-center shrink-0 active:scale-95"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        )}
        <div className="text-xl font-black text-gray-800 flex items-center gap-2 flex-wrap">
          <span>{prefix}</span>
          <span className="min-w-[70px] border-b-4 border-[#1cb0f6] bg-sky-50 px-3 py-1 rounded-xl text-center text-[#1899d6]">
            {selectedWord || "_____"}
          </span>
          <span>{suffix}</span>
        </div>
      </div>

      {/* Options Row */}
      <div className="flex gap-3 mt-auto pt-6">
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(opt)}
            className={`flex-1 py-4 rounded-2xl font-black text-base transition ${
              selectedWord === opt ? "btn-3d-white selected" : "btn-3d-white"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
