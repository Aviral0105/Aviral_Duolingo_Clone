"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User } from "@/lib/types";
import { ChevronRight, Plus, Lock, Zap, Sparkles, Dumbbell } from "lucide-react";
import { sounds } from "@/lib/sounds";
import { refillHearts } from "@/lib/api";
interface TopbarProps {
  user: User;
  onOpenCourse?: () => void;
  onOpenStreak?: (tab?: "personal" | "friends") => void;
  onOpenShop?: () => void;
  onOpenEnergy?: () => void;
}

export default function Topbar({
  user,
  onOpenStreak,
}: TopbarProps) {
  const [activePopover, setActivePopover] = useState<"course" | "streak" | "gems" | "hearts" | null>(null);
  const [heartsCount, setHeartsCount] = useState(user.hearts);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHeartsCount(user.hearts);
  }, [user.hearts]);

  // Click outside to close any open popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActivePopover(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePopover(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleRefillInPopover = async () => {
    try {
      const res = await refillHearts();
      sounds.playCorrect();
      setHeartsCount(res.hearts);
      window.dispatchEvent(new Event("duo_progress_updated"));
    } catch {}
  };

  return (
    <header className="w-full bg-white border-b-2 border-[#e5e5e5] px-4 py-2.5 flex items-center justify-between md:justify-end z-30 select-none">
      {/* Mobile-only Duolingo Logo linking to /learn */}
      <Link
        href="/learn"
        className="md:hidden flex items-center gap-1 cursor-pointer hover:opacity-80 transition"
      >
        <span className="text-2xl font-black text-[#58cc02] tracking-tighter">
          duolingo
        </span>
      </Link>

      {/* Stats Group Container */}
      <div ref={containerRef} className="relative flex items-center gap-2 sm:gap-4">
        {/* ======================================================== */}
        {/* 1. COURSE FLAG BUTTON (🇮🇳 5)                            */}
        {/* ======================================================== */}
        <div className="relative">
          <button
            onClick={() => setActivePopover((prev) => (prev === "course" ? null : "course"))}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border-2 transition active:scale-95 ${
              activePopover === "course"
                ? "border-[#1cb0f6] bg-sky-50/70"
                : "border-transparent hover:bg-gray-100"
            }`}
            title="My Courses"
          >
            <span className="text-2xl">🇮🇳</span>
            <span className="font-black text-sm text-gray-700">5</span>
          </button>

          {/* Courses Dropdown Popover (Screenshot 3) */}
          {activePopover === "course" && (
            <div className="absolute top-12 right-0 sm:left-0 sm:right-auto w-72 bg-white border-2 border-gray-200 rounded-3xl shadow-2xl p-4 z-50 animate-scale-up">
              {/* Top pointer arrow */}
              <div className="absolute -top-2 left-6 w-3.5 h-3.5 bg-white border-t-2 border-l-2 border-gray-200 rotate-45" />

              <div className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2 px-2">
                MY COURSES
              </div>

              {/* Active Course: Hindi */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-sky-100/60 border border-sky-200/60 cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇮🇳</span>
                  <span className="font-black text-sm text-gray-800">Hindi</span>
                </div>
              </div>

              <div className="border-b-2 border-gray-100 my-2" />

              {/* Add a New Course Action */}
              <div
                onClick={() => {
                  sounds.playTap();
                  alert("More language courses (Spanish, French, German, Japanese) coming soon!");
                  setActivePopover(null);
                }}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition text-gray-700 hover:text-gray-900 group"
              >
                <div className="w-8 h-8 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-gray-400 group-hover:text-gray-600 transition">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="font-black text-sm">Add a new course</span>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 2. STREAK BUTTON (🔥 2)                                  */}
        {/* ======================================================== */}
        <div className="relative">
          <button
            onClick={() => setActivePopover((prev) => (prev === "streak" ? null : "streak"))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 transition active:scale-95 ${
              activePopover === "streak"
                ? "border-[#ff9600] bg-orange-50/70"
                : "border-transparent hover:bg-orange-50"
            } text-[#ff9600]`}
            title="Streak"
          >
            <span className="text-xl">🔥</span>
            <span className="font-black text-sm">{user.streak}</span>
          </button>

          {/* Streak Popover (Screenshot 4) */}
          {activePopover === "streak" && (
            <div className="absolute top-12 right-0 w-[340px] sm:w-[380px] bg-white border-2 border-gray-200 rounded-3xl shadow-2xl p-4 sm:p-5 z-50 animate-scale-up space-y-4">
              {/* Top pointer arrow */}
              <div className="absolute -top-2 right-24 sm:right-28 w-3.5 h-3.5 bg-[#ff9600] border-t-2 border-l-2 border-[#ff9600] rotate-45" />

              {/* Orange Hero Box */}
              <div
                onClick={() => {
                  sounds.playTap();
                  setActivePopover(null);
                  onOpenStreak?.("personal");
                }}
                className="bg-[#ff9600] rounded-3xl p-5 text-white shadow-xs relative overflow-hidden cursor-pointer hover:brightness-105 transition"
                title="Click to view streak calendar"
              >
                <div className="flex items-start justify-between">
                  <div className="max-w-[210px]">
                    <h3 className="text-2xl font-black text-white leading-tight">
                      {user.streak} day streak
                    </h3>
                    <p className="text-xs font-bold text-white/95 mt-1 leading-snug">
                      You extended your streak before 96.32% of all learners yesterday!
                    </p>
                  </div>
                  <div className="text-5xl opacity-95">🔥</div>
                </div>

                {/* Days Tracker: S M T W T F S */}
                <div className="mt-5 bg-white/15 backdrop-blur-xs rounded-2xl p-2.5 flex items-center justify-between">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => {
                    const isCompleted = idx === 4 || idx === 5; // e.g. Thursday, Friday
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <span className="text-[11px] font-black uppercase text-white/90">
                          {day}
                        </span>
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                            isCompleted
                              ? "bg-white text-[#ff9600] shadow-xs"
                              : "bg-white/20 text-white/40"
                          }`}
                        >
                          {isCompleted ? "✓" : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Friend Streaks Card */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 text-white flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🔥</span>
                  <div>
                    <h4 className="font-black text-sm text-white">Friend Streaks</h4>
                    <p className="text-xs font-bold text-white/80">0 active Friend Streaks</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sounds.playTap();
                    setActivePopover(null);
                    onOpenStreak?.("friends");
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-[#ff9600] text-xs font-black uppercase tracking-wider hover:bg-orange-50 active:scale-95 transition shrink-0"
                >
                  VIEW LIST
                </button>
              </div>

              {/* Streak Society Card */}
              <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                  <Lock className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-gray-800">Streak Society</h4>
                  <p className="text-xs font-bold text-gray-400 leading-snug">
                    Reach a 7 day streak to join the Streak Society and earn exclusive rewards.
                  </p>
                </div>
              </div>

              {/* View More Button (navigates to personal view of streak modal) */}
              <button
                onClick={() => {
                  sounds.playTap();
                  setActivePopover(null);
                  onOpenStreak?.("personal");
                }}
                className="w-full py-3 rounded-2xl bg-[#1cb0f6] border-b-4 border-[#1899d6] text-white text-xs font-black uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 transition"
              >
                VIEW MORE
              </button>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 3. GEMS BUTTON (💎 155)                                  */}
        {/* ======================================================== */}
        <div className="relative">
          <button
            onClick={() => setActivePopover((prev) => (prev === "gems" ? null : "gems"))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 transition active:scale-95 ${
              activePopover === "gems"
                ? "border-[#1cb0f6] bg-sky-50/70"
                : "border-transparent hover:bg-sky-50"
            } text-[#1cb0f6]`}
            title="Gems"
          >
            <span className="text-xl">💎</span>
            <span className="font-black text-sm">{user.gems}</span>
          </button>

          {/* Gems Popover (Screenshot 2) */}
          {activePopover === "gems" && (
            <div className="absolute top-12 right-0 w-80 bg-white border-2 border-gray-200 rounded-3xl shadow-2xl p-5 z-50 animate-scale-up">
              {/* Top pointer arrow */}
              <div className="absolute -top-2 right-12 sm:right-16 w-3.5 h-3.5 bg-white border-t-2 border-l-2 border-gray-200 rotate-45" />

              <div className="flex items-center gap-4">
                {/* Treasure Chest Icon */}
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-4xl shrink-0 shadow-xs">
                  🧰
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-base text-gray-800">Gems</h3>
                  <p className="text-xs font-bold text-gray-400 mt-0.5">
                    You have {user.gems} gems
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setActivePopover(null)}
                    className="inline-block mt-2 font-black text-xs text-[#1cb0f6] uppercase tracking-wider hover:underline"
                  >
                    GO TO SHOP
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 4. HEARTS BUTTON (❤️ 5)                                   */}
        {/* ======================================================== */}
        <div className="relative">
          <button
            onClick={() => setActivePopover((prev) => (prev === "hearts" ? null : "hearts"))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 transition active:scale-95 ${
              activePopover === "hearts"
                ? "border-[#ff4b4b] bg-red-50/70"
                : "border-transparent hover:bg-red-50"
            } text-[#ff4b4b]`}
            title="Hearts"
          >
            <span className="text-xl">{user.is_super ? "⚡" : "❤️"}</span>
            <span className="font-black text-sm">{user.is_super ? "∞" : heartsCount}</span>
          </button>

          {/* Hearts Popover (Screenshot 1) */}
          {activePopover === "hearts" && (
            <div className="absolute top-12 right-0 w-[310px] sm:w-[340px] bg-white border-2 border-gray-200 rounded-3xl shadow-2xl p-5 z-50 animate-scale-up space-y-4">
              {/* Top pointer arrow */}
              <div className="absolute -top-2 right-4 sm:right-6 w-3.5 h-3.5 bg-white border-t-2 border-l-2 border-gray-200 rotate-45" />

              {/* Title & 5 Hearts */}
              <div className="text-center">
                <h3 className="font-black text-lg text-gray-800">Hearts</h3>
                <div className="flex items-center justify-center gap-1.5 my-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl transition-transform ${
                        i < heartsCount ? "text-red-500 scale-100" : "text-gray-300 scale-95"
                      }`}
                    >
                      ❤️
                    </span>
                  ))}
                </div>
                <h4 className="font-black text-sm text-gray-800">
                  {heartsCount >= 5 ? "You have full hearts" : `${heartsCount}/5 Hearts Remaining`}
                </h4>
                <p className="text-xs font-bold text-gray-400 mt-0.5">Keep on learning</p>
              </div>

              {/* Actions List */}
              <div className="space-y-2.5">
                {/* Row 1: Unlimited Hearts */}
                <div className="border-2 border-gray-200 rounded-2xl p-3 flex items-center justify-between hover:bg-purple-50/40 transition">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-black shadow-xs">
                      ♾️
                    </div>
                    <span className="font-black text-xs text-gray-800 uppercase tracking-wider">
                      UNLIMITED HEARTS
                    </span>
                  </div>
                  <Link
                    href="/shop"
                    onClick={() => setActivePopover(null)}
                    className="font-black text-xs text-[#a855f7] uppercase tracking-wider hover:underline"
                  >
                    FREE TRIAL
                  </Link>
                </div>

                {/* Row 2: Refill Hearts */}
                <div className="border-2 border-gray-200 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">❤️</span>
                    <span className="font-black text-xs text-gray-800 uppercase tracking-wider">
                      REFILL HEARTS
                    </span>
                  </div>
                  {heartsCount >= 5 ? (
                    <span className="font-black text-xs text-gray-400 uppercase tracking-wider">
                      FULL
                    </span>
                  ) : (
                    <button
                      onClick={handleRefillInPopover}
                      className="flex items-center gap-1 font-black text-xs text-[#1cb0f6] uppercase tracking-wider hover:underline"
                    >
                      <span>💎</span>
                      <span>350</span>
                    </button>
                  )}
                </div>

                {/* Row 3: Practice to Earn Hearts */}
                <Link
                  href="/practice"
                  onClick={() => setActivePopover(null)}
                  className="border-2 border-gray-200 rounded-2xl p-3 flex items-center justify-between hover:bg-sky-50/40 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <Dumbbell className="w-5 h-5 text-gray-400 group-hover:text-[#1cb0f6] transition" />
                    <span className="font-black text-xs text-gray-800 uppercase tracking-wider group-hover:text-[#1cb0f6] transition">
                      PRACTICE TO EARN HEARTS
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
