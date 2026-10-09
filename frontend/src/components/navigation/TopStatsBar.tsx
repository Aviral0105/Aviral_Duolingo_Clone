"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User } from "@/lib/types";
import { Plus, Lock, Dumbbell, ChevronRight } from "lucide-react";
import { sounds } from "@/lib/sounds";
import { fetchUser, refillHearts } from "@/lib/api";

interface TopStatsBarProps {
  user?: User | null;
  className?: string;
  onOpenStreak?: (tab?: "personal" | "friends") => void;
}

export default function TopStatsBar({
  user: initialUser,
  className = "",
  onOpenStreak,
}: TopStatsBarProps) {
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [activePopover, setActivePopover] = useState<"course" | "streak" | "gems" | "hearts" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border-2 transition active:scale-95 ${
            activePopover === "course"
              ? "border-[#1cb0f6] bg-sky-50/70"
              : "border-transparent hover:bg-gray-100"
          }`}
          title="My Courses"
        >
          <span className="text-xl sm:text-2xl">🇮🇳</span>
          <span className="font-black text-sm text-gray-700">5</span>
        </button>

        {activePopover === "course" && (
          <div className="absolute top-12 left-0 w-72 bg-white border-2 border-gray-200 rounded-3xl shadow-2xl p-4 z-50 animate-scale-up">
            <div className="absolute -top-2 left-6 w-3.5 h-3.5 bg-white border-t-2 border-l-2 border-gray-200 rotate-45" />

            <div className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2 px-2">
              MY COURSES
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-sky-100/60 border border-sky-200/60 cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇮🇳</span>
                <span className="font-black text-sm text-gray-800">Hindi</span>
              </div>
            </div>

            <div className="border-b-2 border-gray-100 my-2" />

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
      {/* 2. STREAK BUTTON (🔥 3)                                  */}
      {/* ======================================================== */}
      <div className="relative">
        <button
          onClick={() => {
            sounds.playTap();
            setActivePopover((prev) => (prev === "streak" ? null : "streak"));
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border-2 transition active:scale-95 ${
            activePopover === "streak"
              ? "border-[#ff9600] bg-orange-50/70"
              : "border-transparent hover:bg-orange-50"
          } text-[#ff9600]`}
          title="Streak"
        >
          <span className="text-xl">🔥</span>
          <span className="font-black text-sm">{streak}</span>
        </button>

        {activePopover === "streak" && (
          <div className="absolute top-12 -left-12 sm:left-auto sm:right-0 w-[320px] sm:w-[360px] bg-white border-2 border-gray-200 rounded-3xl shadow-2xl p-4 sm:p-5 z-50 animate-scale-up space-y-4">
            <div className="absolute -top-2 left-20 sm:left-auto sm:right-28 w-3.5 h-3.5 bg-[#ff9600] border-t-2 border-l-2 border-[#ff9600] rotate-45" />

            <div className="bg-gradient-to-r from-[#ff9600] to-[#ffc800] rounded-2xl p-4 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black">{streak} Day Streak!</h3>
                  <p className="text-xs font-bold text-white/90 mt-0.5">
                    Practice every day to keep your flame glowing!
                  </p>
                </div>
                <span className="text-4xl animate-bounce">🔥</span>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-xl shrink-0">
                🧊
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-xs text-gray-800">Streak Freeze</h4>
                <p className="text-[11px] font-bold text-gray-400">
                  {user?.streak_freezes ?? 2} / 2 equipped
                </p>
              </div>
              <Link
                href="/shop"
                onClick={() => setActivePopover(null)}
                className="px-3 py-1 rounded-xl bg-[#1cb0f6] text-white text-[11px] font-black uppercase hover:brightness-105 transition"
              >
                Shop
              </Link>
            </div>

            <button
              onClick={() => {
                sounds.playTap();
                setActivePopover(null);
                onOpenStreak?.("personal");
              }}
              className="w-full py-2.5 rounded-2xl bg-[#ff9600] border-b-4 border-[#e08500] text-white text-xs font-black uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 transition"
            >
              VIEW DETAILS
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. GEMS BUTTON (💎 810)                                  */}
      {/* ======================================================== */}
      <div className="relative">
        <button
          onClick={() => {
            sounds.playTap();
            setActivePopover((prev) => (prev === "gems" ? null : "gems"));
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border-2 transition active:scale-95 ${
            activePopover === "gems"
              ? "border-[#1cb0f6] bg-sky-50/70"
              : "border-transparent hover:bg-sky-50"
          } text-[#1cb0f6]`}
          title="Gems"
        >
          <span className="text-xl">💎</span>
          <span className="font-black text-sm">{gems}</span>
        </button>

        {activePopover === "gems" && (
          <div className="absolute top-12 -left-24 sm:left-auto sm:right-0 w-80 bg-white border-2 border-gray-200 rounded-3xl shadow-2xl p-5 z-50 animate-scale-up">
            <div className="absolute -top-2 left-32 sm:left-auto sm:right-16 w-3.5 h-3.5 bg-white border-t-2 border-l-2 border-gray-200 rotate-45" />

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-3xl shrink-0 shadow-xs">
                💎
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
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border-2 transition active:scale-95 ${
            activePopover === "hearts"
              ? "border-[#ff4b4b] bg-red-50/70"
              : "border-transparent hover:bg-red-50"
          } text-[#ff4b4b]`}
          title="Hearts"
        >
          <span className="text-xl">{user?.is_super ? "⚡" : "❤️"}</span>
          <span className="font-black text-sm">{user?.is_super ? "∞" : hearts}</span>
        </button>

        {activePopover === "hearts" && (
          <div className="absolute top-12 right-0 w-[310px] sm:w-[340px] bg-white border-2 border-gray-200 rounded-3xl shadow-2xl p-5 z-50 animate-scale-up space-y-4">
            <div className="absolute -top-2 right-4 sm:right-6 w-3.5 h-3.5 bg-white border-t-2 border-l-2 border-gray-200 rotate-45" />

            <div className="text-center">
              <h3 className="font-black text-lg text-gray-800">Hearts</h3>
              <div className="flex items-center justify-center gap-1.5 my-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl transition-transform ${
                      i < hearts ? "text-red-500 scale-100" : "text-gray-300 scale-95"
                    }`}
                  >
                    ❤️
                  </span>
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

              <div className="border-2 border-gray-200 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">❤️</span>
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
                    <span>💎</span>
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
    </div>
  );
}
