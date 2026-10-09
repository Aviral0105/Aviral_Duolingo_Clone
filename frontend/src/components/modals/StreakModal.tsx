"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { X, Lock, Users, ChevronLeft, ChevronRight, UserPlus, Check, Flag } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  streakFreezes?: number;
  initialTab?: "personal" | "friends";
}

export default function StreakModal({
  isOpen,
  onClose,
  streak,
  streakFreezes = 2,
  initialTab = "personal",
}: StreakModalProps) {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"personal" | "friends">(initialTab);

  // Real Dynamic Calendar State (initialized with stable date, hydrated in useEffect)
  const [viewDate, setViewDate] = useState<Date>(() => new Date(2026, 9, 1));
  const [today, setToday] = useState<Date>(() => new Date(2026, 9, 9));
  const [selectedDayInfo, setSelectedDayInfo] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setToday(now);
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setSelectedDayInfo(null);
    }
  }, [isOpen, initialTab]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  // Real calendar calculations
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString("en-US", { month: "long" }).toUpperCase();
  const monthYearLabel = `${monthName} ${year}`;

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, ...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Real system date detection for streaks
  const isCurrentMonthView = today.getFullYear() === year && today.getMonth() === month;
  const currentDay = today.getDate();

  // Calculate active streak days for current month
  // Streak extends back from today by `streak` days
  const streakEnd = currentDay;
  const streakStart = Math.max(1, currentDay - streak + 1);

  const handlePrevMonth = () => {
    sounds.playTap();
    setViewDate(new Date(year, month - 1, 1));
    setSelectedDayInfo(null);
  };

  const handleNextMonth = () => {
    sounds.playTap();
    setViewDate(new Date(year, month + 1, 1));
    setSelectedDayInfo(null);
  };

  const handleDayClick = (dayNumber: number) => {
    sounds.playTap();
    if (isCurrentMonthView && dayNumber >= streakStart && dayNumber <= streakEnd) {
      setSelectedDayInfo(`Day ${dayNumber}: Streak completed! 🔥 (XP earned)`);
    } else if (isCurrentMonthView && dayNumber === currentDay) {
      setSelectedDayInfo(`Today (Day ${dayNumber}): Complete a lesson to extend your streak!`);
    } else if (isCurrentMonthView && dayNumber > currentDay) {
      setSelectedDayInfo(`Day ${dayNumber}: Future date. Keep learning daily!`);
    } else {
      setSelectedDayInfo(`Day ${dayNumber} ${monthName}: Rest day.`);
    }
    setTimeout(() => setSelectedDayInfo(null), 3000);
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-3 sm:p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-200 max-h-[88vh] flex flex-col animate-scale-up"
      >
        {/* Header Tabs with Left Close Button */}
        <div className="relative border-b-2 border-gray-100 flex items-center justify-between px-4 pt-3 pb-0 shrink-0">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition mb-2"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Centered Modal Title */}
          <span className="font-black text-sm text-gray-800 absolute left-1/2 -translate-x-1/2 top-4">
            Streak
          </span>

          <div className="w-9 h-9 opacity-0" />
        </div>

        {/* PERSONAL vs FRIENDS Tab Switcher */}
        <div className="grid grid-cols-2 border-b-2 border-gray-100 shrink-0">
          <button
            onClick={() => {
              sounds.playTap();
              setTab("personal");
            }}
            className={`py-3 text-xs font-black uppercase tracking-wider transition ${
              tab === "personal"
                ? "text-[#1cb0f6] border-b-2 border-[#1cb0f6]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            PERSONAL
          </button>
          <button
            onClick={() => {
              sounds.playTap();
              setTab("friends");
            }}
            className={`py-3 text-xs font-black uppercase tracking-wider transition ${
              tab === "friends"
                ? "text-[#1cb0f6] border-b-2 border-[#1cb0f6]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            FRIENDS
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-5 space-y-6 flex-1">
          {tab === "personal" ? (
            /* ======================================================== */
            /* TAB 1: PERSONAL VIEW (Real Dynamic Calendar)             */
            /* ======================================================== */
            <>
              {/* Orange Hero Card with White Flame Badge and Milestone Banner */}
              <div className="bg-[#ff9600] rounded-3xl p-5 sm:p-6 text-white shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-white leading-tight">
                    {streak} day streak
                  </h2>
                  <div className="shrink-0 pl-2">
                    <Image src="/flame_badge.svg" width={64} height={64} alt="Flame Badge" className="drop-shadow-sm select-none" />
                  </div>
                </div>

                {/* White Milestone Card with Flag */}
                <div className="bg-white rounded-2xl p-4 flex items-center gap-3.5 shadow-xs text-gray-700">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <Flag className="w-5 h-5 text-[#ff9600] fill-[#ff9600]" />
                  </div>
                  <p className="text-xs font-bold text-gray-600 leading-snug">
                    You&apos;ll reach your next streak milestone on October 14!
                  </p>
                </div>
              </div>

              {/* Real Interactive Calendar Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-base text-gray-800">Calendar</h3>
                  {selectedDayInfo && (
                    <span className="text-xs font-bold text-[#ff9600] animate-fade-in truncate max-w-[200px]">
                      {selectedDayInfo}
                    </span>
                  )}
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 sm:p-5 shadow-xs">
                  {/* Real Month Switcher Navigation */}
                  <div className="flex items-center justify-between text-xs font-black text-gray-600 mb-4 px-2 select-none">
                    <button
                      onClick={handlePrevMonth}
                      className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition"
                      title="Previous month"
                    >
                      <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <span className="uppercase tracking-wider font-black text-gray-700">
                      {monthYearLabel}
                    </span>
                    <button
                      onClick={handleNextMonth}
                      className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition"
                      title="Next month"
                    >
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Day Header: S M T W T F S */}
                  <div className="grid grid-cols-7 text-center text-xs font-black text-gray-400 mb-3 select-none">
                    <span>S</span>
                    <span>M</span>
                    <span>T</span>
                    <span>W</span>
                    <span>T</span>
                    <span>F</span>
                    <span>S</span>
                  </div>

                  {/* Real Days Grid */}
                  <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-600 gap-y-2.5 items-center">
                    {/* Empty padding slots before the 1st of the month */}
                    {Array.from({ length: firstDayIndex }).map((_, i) => (
                      <span key={`empty-${i}`} className="w-7 h-7" />
                    ))}

                    {/* Actual Days of the Month */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNumber = i + 1;
                      const isStreakDay =
                        isCurrentMonthView &&
                        dayNumber >= streakStart &&
                        dayNumber <= streakEnd;

                      const isFirstStreakDay = isStreakDay && dayNumber === streakStart;
                      const isLastStreakDay = isStreakDay && dayNumber === streakEnd;
                      const isToday = isCurrentMonthView && dayNumber === currentDay;

                      return (
                        <div
                          key={`day-${dayNumber}`}
                          className="relative flex items-center justify-center cursor-pointer group"
                          onClick={() => handleDayClick(dayNumber)}
                        >
                          {/* Connected pill background for consecutive streak days */}
                          {isStreakDay && (
                            <div
                              className={`absolute inset-y-0.5 bg-amber-100 ${
                                isFirstStreakDay ? "left-1 rounded-l-full" : "left-0"
                              } ${
                                isLastStreakDay ? "right-1 rounded-r-full" : "right-0"
                              }`}
                            />
                          )}

                          {/* Day Circle / Badge */}
                          <div
                            className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center font-black transition group-hover:scale-110 ${
                              isStreakDay
                                ? "bg-[#ff9600] text-white shadow-xs"
                                : isToday
                                ? "border-2 border-[#ff9600] text-[#ff9600]"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {dayNumber}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Streak Goal Section */}
              <div>
                <h3 className="font-black text-base text-gray-800 mb-2">Streak Goal</h3>
                <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 sm:p-5 flex items-center gap-3 shadow-xs">
                  {/* Calendar 1 Icon */}
                  <div className="w-9 h-9 rounded-xl bg-[#ff9600] text-white flex flex-col items-center justify-center shadow-xs shrink-0 border border-orange-500 overflow-hidden">
                    <div className="w-full h-2 bg-orange-600" />
                    <span className="font-black text-xs leading-none mt-1">1</span>
                  </div>
                  <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-[#ff9600] h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(14, (streak / 7) * 100))}%` }}
                    />
                  </div>
                  {/* Calendar 7 Icon */}
                  <div className="w-9 h-9 rounded-xl bg-[#ff9600] text-white flex flex-col items-center justify-center shadow-xs shrink-0 border border-orange-500 overflow-hidden">
                    <div className="w-full h-2 bg-orange-600" />
                    <span className="font-black text-xs leading-none mt-1">7</span>
                  </div>
                </div>
              </div>

              {/* Streak Society Section */}
              <div>
                <h3 className="font-black text-base text-gray-800 mb-2">Streak Society</h3>
                <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 flex items-center gap-4 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                    <Lock className="w-6 h-6 stroke-[2]" />
                  </div>
                  <p className="text-xs font-bold text-gray-500 leading-relaxed">
                    Reach a 7 day streak to join the Streak Society and earn exclusive rewards.
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* ======================================================== */
            /* TAB 2: FRIENDS VIEW                                      */
            /* ======================================================== */
            <div className="py-6 text-center space-y-6">
              {/* Illustration of Duo & Lily with flame */}
              <div className="relative flex items-center justify-center my-3 select-none">
                <div className="relative">
                  <div className="text-5xl mb-1 animate-bounce">🔥</div>
                  <div className="text-7xl flex items-center justify-center gap-1">
                    <span>🦉</span>
                    <span>👧🏻</span>
                  </div>
                </div>
              </div>

              <div className="max-w-xs mx-auto">
                <h2 className="text-xl sm:text-2xl font-black text-gray-800 leading-tight">
                  Start <span className="text-[#1cb0f6]">Friend Streaks</span> to make daily progress together!
                </h2>
              </div>

              {/* Add Friends Button */}
              <div className="pt-4">
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl bg-[#1cb0f6] border-b-4 border-[#1899d6] text-white font-black text-xs uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 transition flex items-center justify-center gap-2 shadow-md inline-flex"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ ADD FRIENDS</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
