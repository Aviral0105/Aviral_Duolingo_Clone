"use client";

import Link from "next/link";
import { Lock, Zap, Clock } from "lucide-react";

export default function QuestsPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start">
      {/* LEFT/CENTER COLUMN: QUESTS FEED */}
      <div className="flex-1 w-full max-w-xl mx-auto space-y-6">
        {/* Purple Welcome Banner with Mascot Duo holding Gold Chest */}
        <div className="bg-[#7c3aed] rounded-3xl text-white p-7 sm:p-8 flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="max-w-xs z-10">
            <h1 className="text-2xl sm:text-3xl font-black mb-2">Welcome!</h1>
            <p className="text-xs sm:text-sm font-bold text-purple-100 leading-relaxed">
              Complete quests to earn rewards! Quests refresh every day.
            </p>
          </div>
          {/* Mascot Duo with Gold Chest */}
          <div className="text-7xl sm:text-8xl shrink-0 z-10 animate-bounce">
            🦉📦✨
          </div>
        </div>

        {/* Daily Quests Header */}
        <div className="flex items-center justify-between pt-2">
          <h2 className="text-xl font-black text-gray-800">Daily Quests</h2>
          <div className="flex items-center gap-1.5 text-xs font-black text-[#ff9600]">
            <Clock className="w-4 h-4 stroke-[2.5]" />
            <span>2 HOURS</span>
          </div>
        </div>

        {/* Quest 1: Active Completed Quest (Earn 10 XP) */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
            <Zap className="w-7 h-7 text-[#ffc800] fill-[#ffc800]" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-black text-base text-gray-800 mb-2">Earn 10 XP</h3>
            {/* Gold Progress Bar */}
            <div className="relative w-full bg-gray-200 h-6 rounded-full overflow-hidden flex items-center">
              <div
                className="bg-[#ffc800] h-full rounded-full transition-all flex items-center justify-center font-black text-xs text-amber-900"
                style={{ width: "100%" }}
              >
                10 / 10
              </div>
            </div>
          </div>

          {/* Treasure Chest Icon */}
          <span className="text-3xl shrink-0 cursor-pointer active:scale-95 transition">📦</span>
        </div>

        {/* Quest 2: Locked Quest (More quests unlock soon) */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs flex items-center gap-4 opacity-70">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
            <Lock className="w-6 h-6" />
          </div>
          <span className="font-black text-base text-gray-400">
            More quests unlock soon
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: MONTHLY CHALLENGES WIDGET (Exact match to screenshot) */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h2 className="text-base font-black text-gray-800">
                Monthly challenges unlock soon!
              </h2>
              <p className="text-xs text-gray-400 font-bold mt-1.5 leading-relaxed">
                Complete each month&apos;s challenge to earn exclusive badges
              </p>
            </div>
            {/* Gold Coin Badge Illustration */}
            <div className="text-5xl shrink-0">🪙✨</div>
          </div>

          {/* 3D START A LESSON Button */}
          <Link
            href="/lesson/1"
            className="mt-6 block w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-[#1cb0f6] bg-white border-2 border-gray-200 border-b-4 border-b-gray-300 hover:bg-gray-50 active:border-b-2 active:translate-y-[2px] transition text-center"
          >
            Start a lesson
          </Link>
        </div>

        {/* Footer Links */}
        <footer className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex flex-wrap gap-x-3 gap-y-1.5 px-2">
          <span>ABOUT</span>
          <span>BLOG</span>
          <span>STORE</span>
          <span>EFFICACY</span>
          <span>CAREERS</span>
          <span>INVESTORS</span>
          <span>TERMS</span>
          <span>PRIVACY</span>
        </footer>
      </div>
    </div>
  );
}
