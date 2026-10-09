"use client";

import { useState } from "react";
import { completePractice } from "@/lib/api";
import { sounds } from "@/lib/sounds";
import RightPanel from "@/components/navigation/RightPanel";
import { RefreshCw, Volume2, BookOpen, Sparkles, X, Check } from "lucide-react";

export default function PracticePage() {
  const [refillStatus, setRefillStatus] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<"words" | "listen" | null>(null);

  const handleRefillMistakes = async () => {
    sounds.playCorrect();
    const res = await completePractice("mistakes");
    setRefillStatus(`✨ Practice Complete! +${res?.message ? "15" : "15"} XP earned and 1 Heart refilled ❤️`);
    setTimeout(() => setRefillStatus(null), 4000);
  };

  const handleListenPractice = async () => {
    sounds.playVictory();
    const res = await completePractice("listening");
    setRefillStatus("🎧 Listening drill complete! +20 XP earned and 1 Heart refilled ❤️");
    setTimeout(() => setRefillStatus(null), 4000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start pb-12">
      {/* CENTER FEED: PRACTICE HUB */}
      <div className="flex-1 w-full max-w-xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-800">Practice Hub</h1>
            <p className="text-xs font-bold text-gray-400">
              Target your weak areas, review vocabulary, and earn hearts.
            </p>
          </div>
        </div>

        {refillStatus && (
          <div className="p-4 bg-emerald-100 text-emerald-800 border-2 border-emerald-300 font-black text-xs rounded-2xl text-center shadow-xs animate-bounce">
            {refillStatus}
          </div>
        )}

        {/* 1. Today's Review Hero Banner */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-sm">
          <div className="w-2/3 z-10 relative">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-md">
              Today&apos;s Review
            </span>
            <h2 className="text-xl font-black mt-2">Listen-Up Practice</h2>
            <p className="text-xs font-bold text-blue-100 mt-1 mb-4 leading-relaxed">
              Sharpen your ear with authentic Hindi audio drills and restore your hearts.
            </p>
            <button
              onClick={handleListenPractice}
              className="bg-white text-[#1cb0f6] font-black text-xs px-5 py-3 rounded-2xl uppercase tracking-wider shadow-md hover:bg-blue-50 active:scale-95 transition"
            >
              Start (+20 XP)
            </button>
          </div>
          <div className="absolute -right-2 bottom-0 text-7xl sm:text-8xl select-none opacity-90">
            👨‍🦰🎧
          </div>
        </div>

        {/* 2. Skill Practice List */}
        <div>
          <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
            Skill Practice
          </div>

          <div className="space-y-3">
            {/* Mistakes & Refill Hearts */}
            <div
              onClick={handleRefillMistakes}
              className="bg-white border-2 border-gray-200 hover:border-gray-300 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition shadow-xs active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <span className="bg-orange-100 text-orange-500 p-3 rounded-2xl text-2xl">🔁</span>
                <div>
                  <div className="font-black text-gray-800 text-sm">Mistakes & Refill Hearts</div>
                  <div className="text-xs font-bold text-gray-400">Review your past exercise mistakes</div>
                </div>
              </div>
              <span className="bg-[#ff4b4b] text-white text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-xs">
                +1 Heart
              </span>
            </div>

            {/* Words Vocabulary Library */}
            <div
              onClick={() => setActiveModal("words")}
              className="bg-white border-2 border-gray-200 hover:border-gray-300 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition shadow-xs active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <span className="bg-blue-100 text-blue-500 p-3 rounded-2xl text-2xl">🗂️</span>
                <div>
                  <div className="font-black text-gray-800 text-sm">Words</div>
                  <div className="text-xs font-bold text-gray-400">Hindi vocabulary & flashcards</div>
                </div>
              </div>
              <span className="bg-[#1cb0f6] text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                12 Words
              </span>
            </div>

            {/* Listening Lab */}
            <div
              onClick={() => {
                sounds.speak("नमस्ते, आप कैसे हैं?");
                handleListenPractice();
              }}
              className="bg-white border-2 border-gray-200 hover:border-gray-300 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition shadow-xs active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <span className="bg-emerald-100 text-emerald-500 p-3 rounded-2xl text-2xl">🔊</span>
                <div>
                  <div className="font-black text-gray-800 text-sm">Listening Lab</div>
                  <div className="text-xs font-bold text-gray-400">Audio playback comprehension</div>
                </div>
              </div>
              <span className="text-xs font-black text-[#58cc02] bg-green-50 px-3 py-1.5 rounded-xl border border-green-200">
                +10 XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT RAIL */}
      <RightPanel />

      {/* Words Library Modal */}
      {activeModal === "words" && (
        <div
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border-2 border-gray-200 relative animate-scale-up max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <h2 className="text-xl font-black text-gray-800">Hindi Words Learned</h2>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { hi: "नमस्ते", en: "Hello" },
                { hi: "आदमी", en: "Man" },
                { hi: "औरत", en: "Woman" },
                { hi: "लड़का", en: "Boy" },
                { hi: "लड़की", en: "Girl" },
                { hi: "सेब", en: "Apple" },
                { hi: "किताब", en: "Book" },
                { hi: "पानी", en: "Water" },
                { hi: "और", en: "And" },
                { hi: "यह", en: "This" },
                { hi: "वह", en: "That" },
                { hi: "है", en: "Is" },
              ].map((w, idx) => (
                <button
                  key={idx}
                  onClick={() => sounds.speak(w.hi)}
                  className="p-3 rounded-2xl border-2 border-gray-200 hover:border-[#1cb0f6] bg-gray-50 hover:bg-sky-50 text-left transition"
                >
                  <div className="font-black text-base text-gray-800">{w.hi}</div>
                  <div className="text-xs font-bold text-gray-500">{w.en}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
