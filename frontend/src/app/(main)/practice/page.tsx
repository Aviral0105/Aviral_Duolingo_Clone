"use client";

import { useState } from "react";
import { refillHearts } from "@/lib/api";
import { sounds } from "@/lib/sounds";

export default function PracticePage() {
  const [refillStatus, setRefillStatus] = useState<string | null>(null);

  const handleRefill = async () => {
    sounds.playCorrect();
    await refillHearts();
    setRefillStatus("Hearts refilled to 5! ❤️");
    setTimeout(() => setRefillStatus(null), 3000);
  };

  return (
    <div className="flex flex-col select-none">
      <h1 className="text-2xl font-black text-gray-800 mb-4">Practice Hub</h1>

      {/* Listen-Up Card from Video */}
      <div className="bg-[#1cb0f6] text-white rounded-3xl p-6 mb-6 relative overflow-hidden shadow-sm">
        <div className="w-2/3">
          <h2 className="text-xl font-black">Listen-Up</h2>
          <p className="text-xs font-bold text-blue-100 mt-1 mb-4">
            Sharpen your ear with focused listening practice.
          </p>
          <button
            onClick={handleRefill}
            className="bg-white text-[#1cb0f6] font-black text-xs px-4 py-3 rounded-2xl uppercase tracking-wider shadow-md hover:bg-blue-50 active:scale-95 transition"
          >
            Start (+20 XP)
          </button>
        </div>
        <div className="absolute -right-2 bottom-0 text-7xl">👨‍🦰🎧</div>
      </div>

      {refillStatus && (
        <div className="mb-4 p-3 bg-emerald-100 text-emerald-800 font-black text-xs rounded-2xl text-center">
          {refillStatus}
        </div>
      )}

      {/* Skill Practice Categories */}
      <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
        Skill Practice
      </div>
      <div className="space-y-3">
        <div
          onClick={handleRefill}
          className="btn-3d-white rounded-2xl p-4 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="bg-orange-100 text-orange-500 p-2.5 rounded-xl text-xl">🔁</span>
            <div>
              <div className="font-black text-gray-800 text-sm">Mistakes & Refill Hearts</div>
              <div className="text-[11px] font-bold text-gray-400">Review past errors</div>
            </div>
          </div>
          <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full uppercase">
            Refill
          </span>
        </div>

        <div className="btn-3d-white rounded-2xl p-4 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-500 p-2.5 rounded-xl text-xl">🗂️</span>
            <div>
              <div className="font-black text-gray-800 text-sm">Words</div>
              <div className="text-[11px] font-bold text-gray-400">Vocabulary library</div>
            </div>
          </div>
          <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
            New
          </span>
        </div>

        <div className="btn-3d-white rounded-2xl p-4 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="bg-sky-100 text-sky-500 p-2.5 rounded-xl text-xl">🔊</span>
            <div className="font-black text-gray-800 text-sm">Listening Lab</div>
          </div>
        </div>
      </div>
    </div>
  );
}
