"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { sounds } from "@/lib/sounds";
import Link from "next/link";

interface LessonCompleteProps {
  xpEarned: number;
  streak: number;
  accuracy: number;
}

export default function LessonComplete({ xpEarned, streak, accuracy }: LessonCompleteProps) {
  useEffect(() => {
    sounds.playVictory();

    // Trigger celebratory confetti burst
    const end = Date.now() + 2 * 1000;
    const colors = ["#58cc02", "#1cb0f6", "#ffc800", "#ff4b4b"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between p-6 max-w-lg mx-auto select-none">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Animated Celebration Mascot */}
        <span className="text-8xl animate-bounce mb-4">🦉🎉</span>
        <h1 className="text-3xl font-black text-[#ffc800]">Lesson Complete!</h1>
        <p className="text-sm font-bold text-gray-500 mt-1">You are crushing your daily goals.</p>

        {/* 3 Result Metric Cards */}
        <div className="grid grid-cols-2 gap-4 w-full mt-8">
          <div className="border-2 border-[#ffc800] bg-amber-50/50 rounded-3xl p-4 flex flex-col items-center">
            <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
              Total XP
            </span>
            <div className="flex items-center gap-1.5 text-2xl font-black text-amber-500 mt-2">
              <span>⚡</span>
              <span>+{xpEarned}</span>
            </div>
          </div>

          <div className="border-2 border-[#58cc02] bg-emerald-50/50 rounded-3xl p-4 flex flex-col items-center">
            <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
              Accuracy
            </span>
            <div className="flex items-center gap-1.5 text-2xl font-black text-[#58cc02] mt-2">
              <span>🎯</span>
              <span>{accuracy}%</span>
            </div>
          </div>
        </div>

        {/* Streak Flame Card */}
        <div className="w-full mt-4 border-2 border-orange-200 bg-orange-50/40 rounded-3xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🔥</span>
            <div className="text-left">
              <div className="text-sm font-black text-gray-800">{streak} Day Streak</div>
              <div className="text-xs text-gray-500 font-bold">Keep it going tomorrow!</div>
            </div>
          </div>
          <span className="text-xs font-black text-orange-600 uppercase bg-orange-100 px-3 py-1 rounded-xl">
            Active
          </span>
        </div>
      </div>

      {/* Bottom Footer Actions (Review Lesson + Continue matching Duolingo Frame 56s) */}
      <div className="w-full border-t-2 border-[#e5e5e5] pt-4 flex items-center justify-between gap-4">
        <Link
          href="/learn"
          className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-wider border-2 border-gray-200 text-gray-500 hover:bg-gray-100 transition active:scale-95 text-center"
        >
          Review Lesson
        </Link>
        <Link
          href="/learn"
          className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-wider btn-3d-green text-center"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
