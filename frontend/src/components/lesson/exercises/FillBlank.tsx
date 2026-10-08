"use client";

import { Volume2 } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface FillBlankOption {
  id?: string;
  text?: string;
}

interface FillBlankProps {
  prompt: string;
  categoryTag: string;
  audioText?: string;
  prefix: string;
  suffix: string;
  options: (string | FillBlankOption)[];
  selectedWord: string | null;
  onSelect: (word: string) => void;
}

export default function FillBlank({
  prompt,
  categoryTag,
  audioText,
  prefix,
  suffix,
  options = [],
  selectedWord,
  onSelect,
}: FillBlankProps) {
  const getOptionText = (opt: string | FillBlankOption): string => {
    if (typeof opt === "string") return opt;
    if (opt && typeof opt === "object") return opt.text || opt.id || "";
    return String(opt ?? "");
  };

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
            className="w-10 h-10 rounded-xl bg-[#1cb0f6] text-white flex items-center justify-center shrink-0 active:scale-95 btn-3d-blue"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        )}
        <div className="text-xl font-black text-gray-800 flex items-center gap-2 flex-wrap">
          <span>{prefix}</span>
          <span className="min-w-[70px] border-b-4 border-[#1cb0f6] bg-sky-50 px-3 py-1 rounded-xl text-center text-[#1899d6] font-black">
            {selectedWord || "_____"}
          </span>
          <span>{suffix}</span>
        </div>
      </div>

      {/* Options Row */}
      <div className="flex gap-3 mt-auto pt-6">
        {options.map((opt, idx) => {
          const text = getOptionText(opt);
          const isSelected = selectedWord === text;
          return (
            <button
              key={idx}
              onClick={() => {
                onSelect(text);
                if (text) sounds.speak(text, 0.9);
              }}
              className={`flex-1 py-4 rounded-2xl font-black text-base transition ${
                isSelected
                  ? "btn-3d-white selected border-[#1cb0f6] bg-[#ddf4ff] text-[#1cb0f6]"
                  : "btn-3d-white"
              }`}
            >
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

