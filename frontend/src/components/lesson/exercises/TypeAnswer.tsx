"use client";

import { Volume2 } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface TypeAnswerProps {
  prompt: string;
  categoryTag: string;
  sentenceToTranslate: string;
  audioText?: string;
  hint?: string;
  typedValue: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
}

export default function TypeAnswer({
  prompt,
  categoryTag,
  sentenceToTranslate,
  audioText,
  hint,
  typedValue,
  onChange,
  onSubmit,
}: TypeAnswerProps) {
  return (
    <div className="flex flex-col flex-1 max-w-xl mx-auto w-full select-none">
      <div className="flex items-center gap-1.5 text-purple-600 font-black text-xs uppercase tracking-wider mb-2">
        <span>⌨️</span>
        <span>{categoryTag}</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-4">{prompt}</h2>

      {/* Target sentence display */}
      <div className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-2xl shadow-xs mb-6">
        {audioText && (
          <button
            onClick={() => sounds.speak(audioText)}
            className="w-10 h-10 rounded-xl bg-[#1cb0f6] text-white flex items-center justify-center shrink-0 active:scale-95"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        )}
        <div>
          <span className="text-xl font-black text-gray-800">{sentenceToTranslate}</span>
          {hint && <p className="text-xs text-gray-400 font-bold mt-0.5">Hint: {hint}</p>}
        </div>
      </div>

      {/* Text Input Field */}
      <textarea
        autoFocus
        rows={3}
        value={typedValue}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder="Type in Hindi or English..."
        className="w-full p-4 bg-white border-2 border-gray-300 rounded-2xl text-lg font-bold focus:border-[#1cb0f6] focus:outline-hidden transition resize-none"
      />
    </div>
  );
}
