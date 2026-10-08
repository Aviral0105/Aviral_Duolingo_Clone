"use client";

import { User } from "@/lib/types";

interface TopbarProps {
  user: User;
  onOpenCourse: () => void;
  onOpenStreak: () => void;
  onOpenShop: () => void;
  onOpenEnergy: () => void;
}

export default function Topbar({
  user,
  onOpenCourse,
  onOpenStreak,
  onOpenShop,
  onOpenEnergy,
}: TopbarProps) {
  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-xs border-b-2 border-[#e5e5e5] px-4 py-2.5 flex items-center justify-between md:justify-end z-30 select-none">
      {/* Mobile-only Duolingo Logo linking to /learn */}
      <a
        href="/learn"
        className="md:hidden flex items-center gap-1 cursor-pointer hover:opacity-80 transition"
      >
        <span className="text-2xl font-black text-[#58cc02] tracking-tighter">
          duolingo
        </span>
      </a>

      {/* Stats Group (Flag is on the EXACT LEFT of Fire Emoji) */}
      <div className="flex items-center gap-2 sm:gap-5">
        {/* Course Flag (Directly to the left of the Fire Emoji button) */}
        <button
          onClick={onOpenCourse}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition active:scale-95 group"
          title="Hindi Course"
        >
          {/* Authentic High-Resolution SVG Indian Flag */}
          <span className="w-7 h-5 rounded-[4px] overflow-hidden border border-gray-300/80 shadow-xs flex flex-col shrink-0">
            <span className="h-[33.3%] w-full bg-[#FF9933]" />
            <span className="h-[33.4%] w-full bg-white flex items-center justify-center relative">
              <span className="w-1.5 h-1.5 rounded-full border-[0.8px] border-[#000080] flex items-center justify-center">
                <span className="w-0.5 h-0.5 rounded-full bg-[#000080]" />
              </span>
            </span>
            <span className="h-[33.3%] w-full bg-[#138808]" />
          </span>
        </button>

        {/* Streak (Fire Emoji) */}
        <button
          onClick={onOpenStreak}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-orange-50 transition active:scale-95 text-[#ff9600]"
          title="Daily Streak"
        >
          <span className="text-xl">🔥</span>
          <span className="font-black text-sm">{user.streak}</span>
        </button>

        {/* Gems */}
        <button
          onClick={onOpenShop}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-sky-50 transition active:scale-95 text-[#1cb0f6]"
          title="Gems"
        >
          <span className="text-xl">💎</span>
          <span className="font-black text-sm">{user.gems}</span>
        </button>

        {/* Energy / Hearts */}
        <button
          onClick={onOpenEnergy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-red-50 transition active:scale-95 text-[#ff4b4b]"
          title="Hearts"
        >
          <span className="text-xl">{user.is_super ? "⚡" : "❤️"}</span>
          <span className="font-black text-sm">{user.is_super ? "∞" : user.hearts}</span>
        </button>
      </div>
    </header>
  );
}
