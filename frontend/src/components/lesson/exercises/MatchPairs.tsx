"use client";

import { useState, useEffect } from "react";
import { sounds } from "@/lib/sounds";

interface PairItem {
  id: string;
  text: string;
  pairKey: string;
  side: "left" | "right";
  isTargetLanguage?: boolean;
}

interface MatchPairsProps {
  prompt: string;
  categoryTag?: string;
  pairs: any[];
  onAllMatched: () => void;
}

export default function MatchPairs({
  prompt,
  categoryTag = "PAIR MATCH",
  pairs = [],
  onAllMatched,
}: MatchPairsProps) {
  // Separate Left (English) and Right (Target / Hindi) so pairs are NEVER on the same side
  const [leftItems, setLeftItems] = useState<PairItem[]>([]);
  const [rightItems, setRightItems] = useState<PairItem[]>([]);

  useEffect(() => {
    const left: PairItem[] = [];
    const right: PairItem[] = [];

    pairs.forEach((p: any, idx: number) => {
      const targetText =
        p.hi || p.target || p.es || (p.en ? p.hi : Object.values(p)[0]) || "";
      const englishText =
        p.en || p.english || (p.hi ? p.en : Object.values(p)[1]) || "";

      // Column 1: English
      left.push({
        id: `left-${idx}`,
        text: String(englishText),
        pairKey: `pair-${idx}`,
        side: "left",
        isTargetLanguage: false,
      });

      // Column 2: Hindi (Target Language)
      right.push({
        id: `right-${idx}`,
        text: String(targetText),
        pairKey: `pair-${idx}`,
        side: "right",
        isTargetLanguage: true,
      });
    });

    // Shuffle both independently
    setLeftItems([...left].sort(() => Math.random() - 0.5));
    setRightItems([...right].sort(() => Math.random() - 0.5));
  }, [pairs]);

  const [selected, setSelected] = useState<PairItem | null>(null);
  const [matchedKeys, setMatchedKeys] = useState<string[]>([]);
  const [wrongIds, setWrongIds] = useState<string[]>([]);

  const handleSelect = (item: PairItem) => {
    if (matchedKeys.includes(item.pairKey)) return;

    // First selection or selecting another on the same side
    if (!selected || selected.side === item.side) {
      setSelected(item);
      setWrongIds([]);
      if (item.isTargetLanguage) {
        sounds.speak(item.text, 0.9);
      }
      return;
    }

    // Selecting the same item deselects
    if (selected.id === item.id) {
      setSelected(null);
      return;
    }

    // Attempting match with opposite side
    if (selected.pairKey === item.pairKey) {
      // Correct Match!
      sounds.playCorrect();
      if (item.isTargetLanguage) {
        sounds.speak(item.text, 0.9);
      } else if (selected.isTargetLanguage) {
        sounds.speak(selected.text, 0.9);
      }

      const nextMatched = [...matchedKeys, item.pairKey];
      setMatchedKeys(nextMatched);
      setSelected(null);
      setWrongIds([]);

      if (nextMatched.length === pairs.length) {
        onAllMatched();
      }
    } else {
      // Wrong Match
      sounds.playIncorrect();
      setWrongIds([selected.id, item.id]);
      setTimeout(() => {
        setSelected(null);
        setWrongIds([]);
      }, 500);
    }
  };

  // Keyboard shortcut support (1..N for left, (N+1)..2N for right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key, 10);
      if (isNaN(num)) return;

      const n = leftItems.length;
      if (num >= 1 && num <= n) {
        const item = leftItems[num - 1];
        if (item && !matchedKeys.includes(item.pairKey)) {
          handleSelect(item);
        }
      } else if (num > n && num <= n * 2) {
        const item = rightItems[num - n - 1];
        if (item && !matchedKeys.includes(item.pairKey)) {
          handleSelect(item);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [leftItems, rightItems, matchedKeys, selected]);

  const n = leftItems.length;

  return (
    <div className="flex flex-col flex-1 max-w-xl mx-auto w-full select-none justify-center">
      <div className="flex items-center gap-1.5 text-orange-500 font-black text-xs uppercase tracking-wider mb-2">
        <span>🧩</span>
        <span>{categoryTag}</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-8">{prompt}</h2>

      {/* Two Strictly Opposing Columns */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 my-auto">
        {/* Left Column (Language A - e.g. English) */}
        <div className="flex flex-col gap-3">
          {leftItems.map((item, idx) => {
            const isMatched = matchedKeys.includes(item.pairKey);
            const isSelected = selected?.id === item.id;
            const isWrong = wrongIds.includes(item.id);
            const keyShortcut = idx + 1;

            return (
              <button
                key={item.id}
                disabled={isMatched}
                onClick={() => handleSelect(item)}
                className={`relative w-full p-4 sm:p-4.5 rounded-2xl font-bold text-base sm:text-lg transition flex items-center justify-between border-2 ${
                  isMatched
                    ? "opacity-30 border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                    : isWrong
                    ? "border-red-400 bg-red-50 text-red-600 animate-shake"
                    : isSelected
                    ? "border-[#84d8ff] bg-[#ddf4ff] text-[#1cb0f6] shadow-xs"
                    : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-sm active:translate-y-0.5"
                }`}
              >
                <span className="w-6 h-6 rounded-md border border-gray-200 text-xs font-black text-gray-400 flex items-center justify-center shrink-0">
                  {keyShortcut}
                </span>
                <span className="flex-1 text-center font-bold px-2">{item.text}</span>
                <span className="w-6 shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Right Column (Language B - e.g. Hindi) */}
        <div className="flex flex-col gap-3">
          {rightItems.map((item, idx) => {
            const isMatched = matchedKeys.includes(item.pairKey);
            const isSelected = selected?.id === item.id;
            const isWrong = wrongIds.includes(item.id);
            const keyShortcut = n + idx + 1;

            return (
              <button
                key={item.id}
                disabled={isMatched}
                onClick={() => handleSelect(item)}
                className={`relative w-full p-4 sm:p-4.5 rounded-2xl font-bold text-base sm:text-lg transition flex items-center justify-between border-2 ${
                  isMatched
                    ? "opacity-30 border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                    : isWrong
                    ? "border-red-400 bg-red-50 text-red-600 animate-shake"
                    : isSelected
                    ? "border-[#84d8ff] bg-[#ddf4ff] text-[#1cb0f6] shadow-xs"
                    : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-sm active:translate-y-0.5"
                }`}
              >
                <span className="w-6 h-6 rounded-md border border-gray-200 text-xs font-black text-gray-400 flex items-center justify-center shrink-0">
                  {keyShortcut}
                </span>
                <span className="flex-1 text-center font-bold px-2">{item.text}</span>
                <span className="w-6 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
