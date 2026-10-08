"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Lock, Users, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  initialTab?: "personal" | "friends";
}

export default function StreakModal({
  isOpen,
  onClose,
  streak,
  initialTab = "personal",
}: StreakModalProps) {
  const [tab, setTab] = useState<"personal" | "friends">(initialTab);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-200 max-h-[90vh] flex flex-col animate-scale-up"
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
            /* TAB 1: PERSONAL VIEW (Screenshots 2 & 3)                 */
            /* ======================================================== */
            <>
              {/* Orange Hero Card */}
              <div className="bg-[#ff9600] rounded-3xl p-5 sm:p-6 text-white shadow-xs">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-white leading-tight">
                    {streak} day streak
                  </h2>
                  <div className="text-5xl opacity-95">🔥</div>
                </div>

                {/* Sub-card with learner metric */}
                <div className="mt-4 bg-white rounded-2xl p-3.5 flex items-center gap-3 shadow-xs text-gray-700">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-gray-600 leading-snug">
                    You extended your streak before <span className="font-black text-gray-800">96.32%</span> of all learners yesterday!
                  </p>
                </div>
              </div>

              {/* Calendar Section */}
              <div>
                <h3 className="font-black text-base text-gray-800 mb-3">Calendar</h3>

                <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 sm:p-5 shadow-xs">
                  {/* Month Switcher Header */}
                  <div className="flex items-center justify-between text-xs font-black text-gray-600 mb-4 px-2">
                    <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-gray-900" />
                    <span className="uppercase tracking-wider">OCTOBER 2026</span>
                    <ChevronRight className="w-4 h-4 cursor-pointer hover:text-gray-900" />
                  </div>

                  {/* Days of Week */}
                  <div className="grid grid-cols-7 text-center text-xs font-black text-gray-400 mb-3">
                    <span>S</span>
                    <span>M</span>
                    <span>T</span>
                    <span>W</span>
                    <span>T</span>
                    <span>F</span>
                    <span>S</span>
                  </div>

                  {/* Calendar Dates Grid */}
                  <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-600 gap-y-3 items-center">
                    {/* Empty offsets for October 1st starting on Thursday */}
                    <span />
                    <span />
                    <span />
                    <span />
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>

                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                    {/* Active Days 8 & 9 highlighted in connected pill */}
                    <div className="col-span-2 relative flex items-center justify-center">
                      <div className="absolute inset-y-0.5 inset-x-2 bg-amber-100 rounded-full" />
                      <div className="relative z-10 w-full flex items-center justify-around">
                        <span className="w-7 h-7 rounded-full bg-[#ff9600] text-white flex items-center justify-center font-black shadow-xs">
                          8
                        </span>
                        <span className="w-7 h-7 rounded-full bg-[#ff9600] text-white flex items-center justify-center font-black shadow-xs">
                          9
                        </span>
                      </div>
                    </div>
                    <span>10</span>

                    <span>11</span>
                    <span>12</span>
                    <span>13</span>
                    <span>14</span>
                    <span>15</span>
                    <span>16</span>
                    <span>17</span>

                    <span>18</span>
                    <span>19</span>
                    <span>20</span>
                    <span>21</span>
                    <span>22</span>
                    <span>23</span>
                    <span>24</span>

                    <span>25</span>
                    <span>26</span>
                    <span>27</span>
                    <span>28</span>
                    <span>29</span>
                    <span>30</span>
                    <span>31</span>
                  </div>
                </div>
              </div>

              {/* Streak Goal Section */}
              <div>
                <h3 className="font-black text-base text-gray-800 mb-2">Streak Goal</h3>
                <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 flex items-center gap-3 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 text-[#ff9600] flex items-center justify-center font-black text-xs shrink-0">
                    1
                  </div>
                  <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-[#ff9600] h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, (streak / 7) * 100)}%` }}
                    />
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 text-[#ff9600] flex items-center justify-center font-black text-xs shrink-0">
                    7
                  </div>
                </div>
              </div>

              {/* Streak Society Section */}
              <div>
                <h3 className="font-black text-base text-gray-800 mb-2">Streak Society</h3>
                <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 flex items-center gap-4 shadow-xs">
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
            /* TAB 2: FRIENDS VIEW (Screenshot 4)                       */
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
    </div>
  );
}
