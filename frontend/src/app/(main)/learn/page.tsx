"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { BookOpen, ArrowUp } from "lucide-react";

import GuidebookModal from "@/components/modals/GuidebookModal";
import SectionsModal from "@/components/modals/SectionsModal";
import LockedModal from "@/components/modals/LockedModal";
import StartLessonModal from "@/components/modals/StartLessonModal";
import RightPanel from "@/components/navigation/RightPanel";
import { fetchPath, fetchUser } from "@/lib/api";
import { PathResponse, LessonNode, Unit } from "@/lib/types";
import { sounds } from "@/lib/sounds";

export default function LearnPage() {
  const [pathData, setPathData] = useState<PathResponse | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<{ id: number; title: string; xp: number } | null>(null);
  const [isGuidebookOpen, setIsGuidebookOpen] = useState(false);
  const [isSectionsOpen, setIsSectionsOpen] = useState(false);
  const [lockedModal, setLockedModal] = useState<{ open: boolean; title: string }>({
    open: false,
    title: "",
  });
  const [showDuoBubble, setShowDuoBubble] = useState(false);
  const [claimedChests, setClaimedChests] = useState<number[]>([]);
  const [showChestModal, setShowChestModal] = useState(false);

  // Load real-time path progress
  const loadProgress = useCallback(async () => {
    try {
      const data = await fetchPath();
      setPathData(data);
    } catch (e) {
      console.warn("Failed to load path:", e);
    }
  }, []);

  useEffect(() => {
    loadProgress();

    // Listen to real-time progress update events from lesson completions
    const handleProgressUpdate = () => {
      loadProgress();
    };

    window.addEventListener("duo_progress_updated", handleProgressUpdate);
    window.addEventListener("focus", handleProgressUpdate);

    return () => {
      window.removeEventListener("duo_progress_updated", handleProgressUpdate);
      window.removeEventListener("focus", handleProgressUpdate);
    };
  }, [loadProgress]);

  const handleNodeClick = (lesson: LessonNode, prevLessonTitle?: string) => {
    if (lesson.status === "available" || lesson.status === "completed") {
      setSelectedLesson({
        id: lesson.id,
        title: lesson.title,
        xp: 10,
      });
    } else {
      setLockedModal({
        open: true,
        title: prevLessonTitle ? `Complete "${prevLessonTitle}" to unlock this!` : "Complete earlier lessons to unlock this!",
      });
    }
  };

  const handleClaimChest = (unitId: number) => {
    if (!claimedChests.includes(unitId)) {
      sounds.playCorrect();
      setClaimedChests((prev) => [...prev, unitId]);
      setShowChestModal(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Node horizontal alternating offset styles (S-Curve path)
  const getNodeOffset = (idx: number) => {
    const offsets = ["translate-x-0", "translate-x-12", "-translate-x-12", "translate-x-8", "-translate-x-8"];
    return offsets[idx % offsets.length];
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start pb-12">
      {/* LEFT/CENTER COLUMN: REAL-TIME LEARNING PATH */}
      <div className="flex-1 w-full max-w-xl mx-auto flex flex-col items-center select-none relative">
        {pathData?.units.map((unit, unitIdx) => {
          const isUnitCompleted = unit.lessons.every((l) => l.status === "completed");
          const isUnitLocked = unit.lessons.every((l) => l.status === "locked");

          return (
            <div key={unit.id} id={`unit-${unit.id}`} className="w-full flex flex-col items-center mb-12">
              {/* 1. Unit Header Banner */}
              <div
                className={`w-full rounded-2xl p-4 text-white shadow-sm flex items-center justify-between mb-8 cursor-pointer group transition ${
                  isUnitLocked
                    ? "bg-gray-400 opacity-80"
                    : "bg-[#58cc02] hover:brightness-105"
                }`}
              >
                <div onClick={() => setIsSectionsOpen(true)} className="flex-1">
                  <div className="text-[11px] uppercase font-black tracking-wider opacity-90 flex items-center gap-1.5">
                    <span className="text-sm font-bold">←</span>
                    <span>{unit.section_title}</span>
                    {isUnitCompleted && (
                      <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px] font-black uppercase">
                        ✓ Complete
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black mt-0.5">{unit.title}</h1>
                  <p className="text-xs font-bold opacity-80 mt-0.5 hidden sm:block">
                    {unit.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsGuidebookOpen(true);
                    }}
                    className="border-2 border-white/40 hover:bg-white/10 px-3.5 py-2 rounded-2xl text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>GUIDEBOOK</span>
                  </button>
                </div>
              </div>

              {/* 2. S-Curve Path Nodes for this Unit */}
              <div className="flex flex-col items-center gap-7 w-full relative pb-8">
                {unit.lessons.map((lesson, idx) => {
                  const prevLesson = idx > 0 ? unit.lessons[idx - 1] : undefined;
                  const offsetClass = getNodeOffset(idx);

                  if (lesson.status === "completed") {
                    return (
                      <div key={lesson.id} className={`relative flex flex-col items-center ${offsetClass}`}>
                        {/* Completed Star Node with Gold Crown/Check Ring */}
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="44" fill="none" stroke="#58cc02" strokeWidth="7" />
                          </svg>
                          <button
                            onClick={() => handleNodeClick(lesson)}
                            className="relative w-20 h-20 rounded-full btn-3d-green flex items-center justify-center shadow-md active:scale-95 transition z-10"
                            title={`${lesson.title} (Completed)`}
                          >
                            <span className="text-3xl text-white font-black">✓</span>
                          </button>
                          <div className="absolute -bottom-1 -right-1 bg-[#ffc800] text-white text-[11px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-xs z-20">
                            👑
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (lesson.status === "available") {
                    return (
                      <div key={lesson.id} className={`relative flex flex-col items-center ${offsetClass}`}>
                        {/* Bouncing START Tooltip */}
                        <div className="absolute -top-10 bg-[#58cc02] text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-md uppercase tracking-wider animate-bounce z-20">
                          Start
                          <div className="w-2 h-2 bg-[#58cc02] rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                        </div>

                        {/* Active Node with Animated Progress Ring */}
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="44" fill="none" stroke="#e5e5e5" strokeWidth="7" />
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
                            onClick={() => handleNodeClick(lesson)}
                            className="relative w-20 h-20 rounded-full btn-3d-green flex items-center justify-center shadow-md active:scale-95 transition z-10"
                            title={`Start ${lesson.title}`}
                          >
                            <span className="text-3xl">⭐</span>
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // Locked Node
                  return (
                    <div key={lesson.id} className={`relative ${offsetClass}`}>
                      <button
                        onClick={() => handleNodeClick(lesson, prevLesson?.title)}
                        className="w-20 h-20 rounded-full btn-3d-gray flex items-center justify-center active:scale-95 transition opacity-65"
                        title={`Locked - ${lesson.title}`}
                      >
                        <span className="text-3xl opacity-60">
                          {lesson.icon === "headphones" ? "🎧" : lesson.icon === "camera" ? "📷" : "⭐"}
                        </span>
                      </button>
                    </div>
                  );
                })}

                {/* Mascot Duo sitting beside path on Unit 1 */}
                {unitIdx === 0 && (
                  <div className="w-full flex justify-end pr-8 -my-2 relative">
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
                )}

                {/* Unit Milestone Treasure Chest */}
                <div className="relative mt-2">
                  <button
                    onClick={() => handleClaimChest(unit.id)}
                    className={`w-20 h-20 rounded-3xl flex items-center justify-center active:scale-95 transition ${
                      claimedChests.includes(unit.id)
                        ? "btn-3d-gray opacity-60"
                        : "btn-3d-yellow animate-pulse"
                    }`}
                    title="Milestone Chest"
                  >
                    <span className="text-3xl">
                      {claimedChests.includes(unit.id) ? "🪙" : "📦"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Scroll To Top Action */}
        <button
          onClick={scrollToTop}
          className="my-6 p-3 rounded-full bg-white border-2 border-gray-200 hover:bg-gray-100 text-gray-400 hover:text-gray-600 shadow-sm transition active:scale-95"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>

      {/* RIGHT SIDEBAR STATS & DAILY GOALS */}
      <RightPanel />

      {/* Global Interactive Modals */}
      <GuidebookModal isOpen={isGuidebookOpen} onClose={() => setIsGuidebookOpen(false)} />
      
      <SectionsModal
        isOpen={isSectionsOpen}
        onClose={() => setIsSectionsOpen(false)}
      />

      <LockedModal
        isOpen={lockedModal.open}
        onClose={() => setLockedModal({ open: false, title: "" })}
        lessonTitle={lockedModal.title}
      />

      {selectedLesson && (
        <StartLessonModal
          isOpen={true}
          onClose={() => setSelectedLesson(null)}
          lessonId={selectedLesson.id}
          title={selectedLesson.title}
          xpReward={selectedLesson.xp}
        />
      )}

      {/* Chest Reward Modal */}
      {showChestModal && (
        <div
          onClick={() => setShowChestModal(false)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-sm w-full rounded-3xl p-6 text-center animate-scale-up border-2 border-gray-200 shadow-2xl"
          >
            <span className="text-6xl animate-bounce">🪙💎</span>
            <h3 className="text-2xl font-black text-gray-800 mt-4 mb-2">Milestone Unlocked!</h3>
            <p className="text-xs text-gray-500 font-bold mb-6">
              You opened the unit reward chest and claimed +25 Gems! Keep advancing to unlock the next Section.
            </p>
            <button
              onClick={() => setShowChestModal(false)}
              className="w-full py-3.5 rounded-2xl bg-[#58cc02] text-white font-black text-xs uppercase tracking-wider btn-3d-green"
            >
              Claim Rewards
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
