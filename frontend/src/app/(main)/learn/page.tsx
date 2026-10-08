"use client";

import { useState } from "react";
import { BookOpen, ArrowUp } from "lucide-react";

import GuidebookModal from "@/components/modals/GuidebookModal";
import SectionsModal from "@/components/modals/SectionsModal";
import LockedModal from "@/components/modals/LockedModal";
import StartLessonModal from "@/components/modals/StartLessonModal";
import RightPanel from "@/components/navigation/RightPanel";

export default function LearnPage() {
  const [isGuidebookOpen, setIsGuidebookOpen] = useState(false);
  const [isSectionsOpen, setIsSectionsOpen] = useState(false);
  const [lockedModal, setLockedModal] = useState<{ open: boolean; title: string; isSuper?: boolean }>({
    open: false,
    title: "",
  });
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [showDuoBubble, setShowDuoBubble] = useState(false);
  const [showChestModal, setShowChestModal] = useState(false);
  const [chestClaimed, setChestClaimed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start pb-12">
      {/* LEFT/CENTER COLUMN: LEARNING PATH */}
      <div className="flex-1 w-full max-w-xl mx-auto flex flex-col items-center select-none relative">
      {/* 1. Unit Header Banner */}
      <div className="w-full bg-[#58cc02] rounded-2xl p-4 text-white shadow-sm flex items-center justify-between mb-8 cursor-pointer group">
        <div onClick={() => setIsSectionsOpen(true)} className="flex-1">
          <div className="text-[11px] uppercase font-black tracking-wider opacity-90 flex items-center gap-1.5">
            <span className="text-sm font-bold">←</span>
            <span>SECTION 1, UNIT 1</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-0.5">Form basic sentences</h1>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsGuidebookOpen(true);
          }}
          className="border-2 border-white/40 hover:bg-white/10 px-4 py-2 rounded-2xl text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 transition ml-2 active:scale-95"
        >
          <BookOpen className="w-4 h-4" />
          <span>GUIDEBOOK</span>
        </button>
      </div>

      {/* 2. S-Curve Path Nodes */}
      <div className="flex flex-col items-center gap-7 w-full relative pb-16">
        {/* Node 1: Active Star Node with Concentric Outer Progress Ring */}
        <div className="relative flex flex-col items-center">
          <div className="absolute -top-10 bg-[#58cc02] text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-md uppercase tracking-wider animate-bounce z-20">
            Start
            <div className="w-2 h-2 bg-[#58cc02] rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
          </div>

          {/* Concentric Progress Ring */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#e5e5e5"
                strokeWidth="7"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#58cc02"
                strokeWidth="7"
                strokeDasharray="276.46"
                strokeDashoffset="110.58"
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>

            <button
              onClick={() => setIsStartOpen(true)}
              className="relative w-20 h-20 rounded-full btn-3d-green flex items-center justify-center shadow-md active:scale-95 transition z-10"
            >
              <span className="text-3xl">⭐</span>
            </button>
          </div>
        </div>

        {/* Node 2: Shifted Right (Locked Star) */}
        <div className="relative translate-x-12">
          <button
            onClick={() => setLockedModal({ open: true, title: "Basics 2" })}
            className="w-20 h-20 rounded-full btn-3d-gray flex items-center justify-center active:scale-95 transition"
          >
            <span className="text-3xl opacity-60">⭐</span>
          </button>
        </div>

        {/* Node 3: Shifted Left (Locked Video Call) */}
        <div className="relative -translate-x-12">
          <button
            onClick={() => setLockedModal({ open: true, title: "Video Call: Falstaff", isSuper: true })}
            className="w-20 h-20 rounded-full btn-3d-gray flex items-center justify-center active:scale-95 transition"
          >
            <span className="text-3xl opacity-60">🎥</span>
          </button>
        </div>

        {/* Mascot Duo sitting on the right */}
        <div className="w-full flex justify-end pr-10 -my-2 relative">
          {showDuoBubble && (
            <div className="absolute -top-14 right-8 bg-white border-2 border-gray-200 rounded-2xl px-4 py-2 shadow-lg z-20 animate-bounce">
              <span className="text-xs font-black text-gray-800">
                Keep practicing Hindi to unlock Section 2! 🔥
              </span>
              <div className="w-2.5 h-2.5 bg-white border-b-2 border-r-2 border-gray-200 rotate-45 absolute -bottom-1.5 right-8" />
            </div>
          )}
          <div
            onClick={() => setShowDuoBubble(!showDuoBubble)}
            className="bg-white rounded-3xl p-3.5 flex flex-col items-center border-2 border-gray-200 cursor-pointer hover:shadow-md transition active:scale-95"
          >
            <span className="text-5xl">🦉</span>
            <span className="text-xs font-bold text-gray-400 mt-1">⭐⭐⭐</span>
          </div>
        </div>

        {/* Node 4: Milestone Treasure Chest */}
        <div className="relative">
          <button
            onClick={() => setShowChestModal(true)}
            className={`w-20 h-20 rounded-3xl flex items-center justify-center active:scale-95 transition ${
              chestClaimed ? "btn-3d-gray opacity-60" : "btn-3d-yellow animate-pulse"
            }`}
          >
            <span className="text-3xl">{chestClaimed ? "🪙" : "📦"}</span>
          </button>
        </div>

        {/* Node 5: Shifted Right (Audio Headphones) */}
        <div className="relative translate-x-10">
          <button
            onClick={() => setLockedModal({ open: true, title: "Hindi Listening Practice" })}
            className="w-20 h-20 rounded-full btn-3d-gray flex items-center justify-center active:scale-95 transition"
          >
            <span className="text-3xl opacity-60">🎧</span>
          </button>
        </div>

        {/* Node 6: Shifted Left (Star) */}
        <div className="relative -translate-x-10">
          <button
            onClick={() => setLockedModal({ open: true, title: "Café Dialogues" })}
            className="w-20 h-20 rounded-full btn-3d-gray flex items-center justify-center active:scale-95 transition"
          >
            <span className="text-3xl opacity-60">⭐</span>
          </button>
        </div>

        {/* Node 7: Trophy Unit Review */}
        <div className="relative">
          <button
            onClick={() => setLockedModal({ open: true, title: "Unit 1 review" })}
            className="w-20 h-20 rounded-3xl btn-3d-gray flex items-center justify-center active:scale-95 transition"
          >
            <span className="text-3xl opacity-60">🏆</span>
          </button>
        </div>

        {/* Section 2 Jump Marker */}
        <div className="text-center mt-6 w-full">
          <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
            Greet new people
          </div>
          <div className="relative flex flex-col items-center">
            <div className="bg-purple-100 text-purple-700 text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider mb-1.5 shadow-xs">
              Jump here?
              <div className="w-2 h-2 bg-purple-100 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
            </div>
            <button
              onClick={() => setIsSectionsOpen(true)}
              className="w-20 h-20 rounded-full bg-purple-500 border-b-4 border-purple-700 text-white flex items-center justify-center shadow-lg active:translate-y-1 transition"
            >
              <span className="text-3xl font-black">⏩</span>
            </button>
          </div>
        </div>

        {/* Character Lily sitting beside path */}
        <div className="w-full flex justify-start pl-8 mt-4">
          <div
            onClick={() => alert('Lily: "Make more progress to unlock this character!"')}
            className="bg-white rounded-3xl p-3.5 flex flex-col items-center border-2 border-gray-200 cursor-pointer hover:shadow-md transition active:scale-95"
          >
            <span className="text-5xl">👧</span>
            <span className="text-xs font-bold text-gray-400 mt-1">⭐⭐⭐</span>
          </div>
        </div>
      </div>
      </div>

      {/* RIGHT STICKY COLUMN: BRONZE LEAGUE & DAILY QUESTS */}
      <RightPanel />

      {/* Floating Blue Up Arrow */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-20 md:bottom-8 right-6 w-12 h-12 bg-white border-2 border-gray-300 shadow-lg rounded-2xl flex items-center justify-center text-[#1cb0f6] font-black z-30 hover:bg-gray-50 active:scale-90 transition"
      >
        <ArrowUp className="w-6 h-6 stroke-[3]" />
      </button>

      {/* Modals */}
      <GuidebookModal isOpen={isGuidebookOpen} onClose={() => setIsGuidebookOpen(false)} />
      <SectionsModal isOpen={isSectionsOpen} onClose={() => setIsSectionsOpen(false)} />
      <LockedModal
        isOpen={lockedModal.open}
        title={lockedModal.title}
        isSuper={lockedModal.isSuper}
        onClose={() => setLockedModal({ open: false, title: "" })}
      />
      <StartLessonModal
        isOpen={isStartOpen}
        onClose={() => setIsStartOpen(false)}
        lessonId={1}
        title="Form basic sentences"
        xpReward={10}
      />

      {/* Milestone Chest Modal */}
      {showChestModal && (
        <div
          onClick={() => setShowChestModal(false)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border-2 border-gray-200 text-center relative animate-scale-up"
          >
            <span className="text-7xl block mb-3 animate-bounce">📦✨</span>
            <h2 className="text-2xl font-black text-gray-800 mb-1">Milestone Chest!</h2>
            <p className="text-xs font-bold text-gray-500 mb-6">
              You reached a major checkpoint in Unit 1!
            </p>
            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 font-black text-lg text-amber-900 mb-6 flex items-center justify-center gap-2">
              <span>💎</span>
              <span>+15 Gems</span>
            </div>
            <button
              onClick={() => {
                setChestClaimed(true);
                setShowChestModal(false);
              }}
              className="w-full py-3.5 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black text-sm uppercase tracking-wider btn-3d-green"
            >
              Claim Reward
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
