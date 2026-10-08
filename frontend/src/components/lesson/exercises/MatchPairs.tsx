"use client";

import { useState } from "react";
import { sounds } from "@/lib/sounds";

interface PairItem {
  id: string;
  text: string;
  pairKey: string;
}

interface MatchPairsProps {
  prompt: string;
  categoryTag: string;
  pairs: { es: string; en: string }[];
  onAllMatched: () => void;
}

export default function MatchPairs({ prompt, categoryTag, pairs, onAllMatched }: MatchPairsProps) {
  // Flatten and shuffle items
  const [items] = useState<PairItem[]>(() => {
    const list: PairItem[] = [];
    pairs.forEach((p, idx) => {
      list.push({ id: `fr-${idx}`, text: p.es, pairKey: `pair-${idx}` });
      list.push({ id: `en-${idx}`, text: p.en, pairKey: `pair-${idx}` });
    });
    return list.sort(() => Math.random() - 0.5);
  });

  const [selected, setSelected] = useState<PairItem | null>(null);
  const [matchedKeys, setMatchedKeys] = useState<string[]>([]);

  const handleSelect = (item: PairItem) => {
    if (matchedKeys.includes(item.pairKey)) return;

    if (!selected) {
      setSelected(item);
      return;
    }

    if (selected.id === item.id) {
      setSelected(null);
      return;
    }

    if (selected.pairKey === item.pairKey) {
      // Correct Match!
      sounds.playCorrect();
      const nextMatched = [...matchedKeys, item.pairKey];
      setMatchedKeys(nextMatched);
      setSelected(null);
      if (nextMatched.length === pairs.length) {
        onAllMatched();
      }
    } else {
      // Wrong Match
      sounds.playIncorrect();
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 max-w-xl mx-auto w-full select-none">
      <div className="flex items-center gap-1.5 text-orange-500 font-black text-xs uppercase tracking-wider mb-2">
        <span>🧩</span>
        <span>{categoryTag}</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-6">{prompt}</h2>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 my-auto">
        {items.map((item) => {
          const isMatched = matchedKeys.includes(item.pairKey);
          const isSelected = selected?.id === item.id;

          return (
            <button
              key={item.id}
              disabled={isMatched}
              onClick={() => handleSelect(item)}
              className={`p-4 rounded-2xl font-black text-base transition ${
                isMatched
                  ? "opacity-30 border-2 border-gray-200 bg-gray-100 cursor-not-allowed"
                  : isSelected
                  ? "btn-3d-white selected"
                  : "btn-3d-white"
              }`}
            >
              {item.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
