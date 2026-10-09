"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "@/lib/types";
import { Plus, Lock, Dumbbell, ChevronRight, Check } from "lucide-react";
import { sounds } from "@/lib/sounds";
import { fetchUser, refillHearts } from "@/lib/api";
import CourseModal from "@/components/modals/CourseModal";
import StreakModal from "@/components/modals/StreakModal";

interface TopStatsBarProps {
  user?: User | null;
  className?: string;
  onOpenStreak?: (tab?: "personal" | "friends") => void;
  onOpenCourse?: () => void;
}

export default function TopStatsBar({
  user: initialUser,
  className = "",
  onOpenStreak,
  onOpenCourse,
}: TopStatsBarProps) {
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [activePopover, setActivePopover] = useState<"course" | "streak" | "gems" | "hearts" | null>(null);
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [streakModalTab, setStreakModalTab] = useState<"personal" | "friends">("personal");
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (popover: "course" | "streak" | "gems" | "hearts") => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActivePopover(popover);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActivePopover(null);
    }, 200);
  };

  // Sync or fetch user
  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    } else {
      fetchUser().then(setUser).catch(() => {});
    }
  }, [initialUser]);

  useEffect(() => {
    const handleUpdate = () => {
      fetchUser().then(setUser).catch(() => {});
    };
    window.addEventListener("duo_progress_updated", handleUpdate);
    return () => window.removeEventListener("duo_progress_updated", handleUpdate);
  }, []);

  // Close popover when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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
      setUser((prev) => (prev ? { ...prev, hearts: res.hearts } : prev));
      window.dispatchEvent(new Event("duo_progress_updated"));
    } catch {}
  };

  const streak = user?.streak ?? 0;
  const gems = user?.gems ?? 100;
  const hearts = user?.is_super ? 999 : (user?.hearts ?? 5);

  const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDayOfWeek = new Date().getDay(); // 0 = Sun, ..., 5 = Fri, 6 = Sat

  const isDayChecked = (idx: number) => {
    if (streak <= 0) return false;
    const startIdx = Math.max(0, currentDayOfWeek - streak + 1);
    return idx >= startIdx && idx <= currentDayOfWeek;
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-between w-full px-1 py-1 select-none ${className}`}
    >
      {/* ======================================================== */}
      {/* 1. COURSE FLAG BUTTON (🇮🇳 5)                            */}
      {/* ======================================================== */}
      <div className="relative">
        <button
          onClick={() => {
            sounds.playTap();
            setActivePopover((prev) => (prev === "course" ? null : "course"));
          }}
          onMouseEnter={() => handleMouseEnter("course")}
          onMouseLeave={handleMouseLeave}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-2xl border-2 transition active:scale-95 ${
            activePopover === "course"
              ? "border-[#1cb0f6] bg-sky-50/70"
              : "border-transparent hover:bg-gray-100"
          }`}
          title="My Courses"
        >
          <Image src="/flag_in.svg" width={24} height={18} alt="Hindi" className="rounded-xs shadow-2xs object-cover" />
          <span className="font-black text-sm text-gray-700">5</span>
        </button>

        {activePopover === "course" && (
          <div
            onMouseEnter={() => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); }}
            onMouseLeave={handleMouseLeave}
            className="absolute top-12 left-0 w-72 bg-white border-2 border-gray-200 rounded-3xl shadow-2xl p-4 z-50 animate-scale-up"
          >
            <div className="absolute -top-2 left-6 w-3.5 h-3.5 bg-white border-t-2 border-l-2 border-gray-200 rotate-45" />

            <div className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2 px-2">
              MY COURSES
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-sky-100/60 border border-sky-200/60 cursor-pointer">
              <div className="flex items-center gap-3">
                <Image src="/flag_in.svg" width={28} height={20} alt="Hindi" className="rounded-xs shadow-2xs object-cover" />
                <span className="font-black text-sm text-gray-800">Hindi</span>
              </div>
            </div>

            <div className="border-b-2 border-gray-100 my-2" />

            <div
              onClick={() => {
                sounds.playTap();
                if (onOpenCourse) {
                  onOpenCourse();
                } else {
                  setIsCourseOpen(true);
                }
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
      {/* 2. STREAK BUTTON (🔥 2) - MATCHING SCREENSHOT 1 1:1      */}
      {/* ======================================================== */}
      <div className="relative">
        <button
          onClick={() => {
            sounds.playTap();
            setActivePopover((prev) => (prev === "streak" ? null : "streak"));
          }}
          onMouseEnter={() => handleMouseEnter("streak")}
          onMouseLeave={handleMouseLeave}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border-2 transition active:scale-95 ${
            activePopover === "streak"
              ? "border-[#ff9600] bg-orange-50/70"
              : "border-transparent hover:bg-orange-50"
          } text-[#ff9600]`}
          title="Streak"
        >
          <Image src="/streak.svg" alt="Streak" width={22} height={22} className="w-5.5 h-5.5 object-contain" />
          <span className="font-black text-sm">{streak}</span>
        </button>

        {activePopover === "streak" && (
          <div
            onMouseEnter={() => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); }}
            onMouseLeave={handleMouseLeave}
            className="absolute top-12 -left-12 sm:left-auto sm:right-0 w-[340px] sm:w-[360px] bg-white border-2 border-gray-200 rounded-3xl shadow-2xl p-4 sm:p-5 z-50 animate-scale-up space-y-3.5"
          >
            {/* Orange arrow pointer pointing to streak button */}
            <div className="absolute -top-2 left-20 sm:left-auto sm:right-28 w-3.5 h-3.5 bg-[#ff9600] border-t-2 border-l-2 border-[#ff9600] rotate-45" />

            {/* 1. TOP ORANGE CARD (Matching Screenshot 1) */}
            <div className="bg-[#ff9600] rounded-3xl p-5 text-white shadow-xs space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="max-w-[210px]">
                  <h3 className="text-2xl font-black leading-tight text-white">
                    {streak} day streak
                  </h3>
                  <p className="text-xs font-bold text-white/95 mt-1 leading-snug">
                    You&apos;ll reach your next streak milestone on October 14!
                  </p>
                </div>
                <div className="shrink-0 pl-2">
                  <Image src="/flame_badge.svg" width={52} height={52} alt="Flame Badge" className="drop-shadow-sm select-none" />
                </div>
              </div>

              {/* Embedded White Card for Weekly Tracker S M T W T F S */}
              <div className="bg-white rounded-2xl py-3 px-3 shadow-xs">
                <div className="grid grid-cols-7 text-center gap-1">
                  {WEEK_DAYS.map((d, idx) => {
                    const isToday = idx === currentDayOfWeek;
                    const isChecked = isDayChecked(idx);
                    return (
                      <div key={`day-tracker-${idx}`} className="flex flex-col items-center gap-1.5">
                        <span className={`text-xs ${isToday ? "text-[#ff9600] font-black" : "text-gray-400 font-bold"}`}>
                          {d}
                        </span>
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                            isChecked
                              ? "bg-[#ff9600] text-white shadow-xs"
                              : "bg-gray-200"
                          }`}
                        >
                          {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. FRIEND STREAKS ORANGE CARD (Matching Screenshot 1) */}
            <div className="bg-[#ff9600] rounded-2xl p-4 text-white shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-16 h-14 shrink-0 flex items-center justify-center">
                  <Image src="/friend_streak.svg" width={68} height={50} alt="Friend Streaks" className="object-contain select-none" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-sm text-white leading-tight">Friend Streaks</h4>
                  <p className="text-[11px] font-bold text-white/90 leading-tight mt-0.5">0 active Friend Streaks</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sounds.playTap();
                  setActivePopover(null);
                  if (onOpenStreak) {
                    onOpenStreak("friends");
                  } else {
                    setStreakModalTab("friends");
                    setIsStreakModalOpen(true);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-white border-b-2 border-gray-300 text-[#ff9600] font-black text-xs uppercase tracking-wider hover:bg-gray-50 active:border-b-0 active:translate-y-0.5 transition shadow-xs shrink-0 cursor-pointer"
              >
                VIEW LIST
              </button>
            </div>

            {/* 3. STREAK SOCIETY WHITE CARD (Matching Screenshot 1) */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                <Lock className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-xs text-gray-800">Streak Society</h4>
                <p className="text-[11px] font-bold text-gray-400 leading-snug mt-0.5">
                  Reach a 7 day streak to join the Streak Society and earn exclusive rewards.
                </p>
              </div>
            </div>

            {/* 4. BLUE 3D VIEW MORE BUTTON (Matching Screenshot 1) */}
            <button
              onClick={() => {
                sounds.playTap();
                setActivePopover(null);
                if (onOpenStreak) {
                  onOpenStreak("personal");
                } else {
                  setStreakModalTab("personal");
                  setIsStreakModalOpen(true);
                }
              }}
              className="w-full py-3.5 rounded-2xl bg-[#1cb0f6] border-b-4 border-[#1899d6] text-white font-black text-xs uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 transition shadow-xs text-center cursor-pointer"
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
          onClick={() => {
            sounds.playTap();
            setActivePopover((prev) => (prev === "gems" ? null : "gems"));
          }}
          onMouseEnter={() => handleMouseEnter("gems")}
          onMouseLeave={handleMouseLeave}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border-2 transition active:scale-95 ${
            activePopover === "gems"
              ? "border-[#1cb0f6] bg-sky-50/70"
              : "border-transparent hover:bg-sky-50"
          } text-[#1cb0f6]`}
          title="Gems"
        >
          <Image src="/gem.svg" alt="Gems" width={22} height={22} className="w-5.5 h-5.5 object-contain" />
          <span className="font-black text-sm">{gems}</span>
        </button>

        {activePopover === "gems" && (
          <div
            onMouseEnter={() => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); }}
            onMouseLeave={handleMouseLeave}
            className="absolute top-12 -left-24 sm:left-auto sm:right-0 w-80 bg-white border-2 border-gray-200 rounded-3xl shadow-2xl p-5 z-50 animate-scale-up"
          >
            <div className="absolute -top-2 left-32 sm:left-auto sm:right-16 w-3.5 h-3.5 bg-white border-t-2 border-l-2 border-gray-200 rotate-45" />

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 border-2 border-sky-200 flex items-center justify-center p-2.5 shrink-0 shadow-xs">
                <Image src="/gem.svg" alt="Gems" width={36} height={36} className="w-9 h-9 object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-base text-gray-800">Gems</h3>
                <p className="text-xs font-bold text-gray-400 mt-0.5">
                  You have {gems} gems
                </p>
              </div>
            </div>

            <Link
              href="/shop"
              onClick={() => setActivePopover(null)}
              className="block w-full py-2.5 rounded-2xl bg-[#1cb0f6] text-white font-black text-xs uppercase tracking-wider text-center border-b-4 border-[#1899d6] hover:brightness-105 active:border-b-0 active:translate-y-1 transition"
            >
              GO TO SHOP
            </Link>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. HEARTS BUTTON (❤️ 5)                                   */}
      {/* ======================================================== */}
      <div className="relative">
        <button
          onClick={() => {
            sounds.playTap();
            setActivePopover((prev) => (prev === "hearts" ? null : "hearts"));
          }}
          onMouseEnter={() => handleMouseEnter("hearts")}
          onMouseLeave={handleMouseLeave}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border-2 transition active:scale-95 ${
            activePopover === "hearts"
              ? "border-[#ff4b4b] bg-red-50/70"
              : "border-transparent hover:bg-red-50"
          } text-[#ff4b4b]`}
          title="Hearts"
        >
          <Image
            src={user?.is_super ? "/unlimited.svg" : "/heart.svg"}
            alt="Hearts"
            width={22}
            height={22}
            className="w-5.5 h-5.5 object-contain"
          />
          <span className="font-black text-sm">{user?.is_super ? "∞" : hearts}</span>
        </button>

        {activePopover === "hearts" && (
          <div
            onMouseEnter={() => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); }}
            onMouseLeave={handleMouseLeave}
            className="absolute top-12 right-0 w-[310px] sm:w-[340px] bg-white border-2 border-gray-200 rounded-3xl shadow-2xl p-5 z-50 animate-scale-up space-y-4"
          >
            <div className="absolute -top-2 right-4 sm:right-6 w-3.5 h-3.5 bg-white border-t-2 border-l-2 border-gray-200 rotate-45" />

            <div className="text-center">
              <h3 className="font-black text-lg text-gray-800">Hearts</h3>
              <div className="flex items-center justify-center gap-2 my-2.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="transition-transform">
                    <Image
                      src="/heart.svg"
                      alt="Heart"
                      width={24}
                      height={24}
                      className={`w-6 h-6 object-contain transition ${
                        i < hearts ? "opacity-100 scale-100" : "opacity-25 grayscale scale-90"
                      }`}
                    />
                  </div>
                ))}
              </div>
              <h4 className="font-black text-sm text-gray-800">
                {hearts >= 5 ? "You have full hearts" : `${hearts}/5 Hearts Remaining`}
              </h4>
              <p className="text-xs font-bold text-gray-400 mt-0.5">Keep on learning</p>
            </div>

            <div className="space-y-2.5">
              <div className="border-2 border-gray-200 rounded-2xl p-3 flex items-center justify-between hover:bg-purple-50/40 transition">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-black shadow-xs p-1">
                    <Image src="/unlimited.svg" width={20} height={20} alt="Unlimited" />
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

              <div className="border-2 border-gray-200 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Image src="/heart.svg" width={20} height={20} alt="Heart" />
                  <span className="font-black text-xs text-gray-800 uppercase tracking-wider">
                    REFILL HEARTS
                  </span>
                </div>
                {hearts >= 5 ? (
                  <span className="font-black text-xs text-gray-400 uppercase tracking-wider">
                    FULL
                  </span>
                ) : (
                  <button
                    onClick={handleRefillInPopover}
                    className="flex items-center gap-1 font-black text-xs text-[#1cb0f6] uppercase tracking-wider hover:underline"
                  >
                    <Image src="/gem.svg" width={14} height={14} alt="Gem" />
                    <span>350</span>
                  </button>
                )}
              </div>

              <Link
                href="/practice"
                onClick={() => setActivePopover(null)}
                className="border-2 border-gray-200 rounded-2xl p-3 flex items-center justify-between hover:bg-sky-50/40 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Dumbbell className="w-5 h-5 text-gray-400 group-hover:text-[#1cb0f6] transition" />
                  <span className="font-black text-xs text-gray-800 uppercase tracking-wider group-hover:text-[#1cb0f6] transition">
                    PRACTICE TO RESTORE
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>
        )}
      </div>

      <CourseModal isOpen={isCourseOpen} onClose={() => setIsCourseOpen(false)} />
      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        streak={streak}
        streakFreezes={user?.streak_freezes ?? 2}
        initialTab={streakModalTab}
      />
    </div>
  );
}
