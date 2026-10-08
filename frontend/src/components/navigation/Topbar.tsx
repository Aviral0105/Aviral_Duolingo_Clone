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
    <header className="sticky top-0 bg-white/95 backdrop-blur-xs border-b-2 border-[#e5e5e5] px-4 py-2.5 flex items-center justify-between z-30 select-none">
      {/* Course Flag */}
      <button
        onClick={onOpenCourse}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition active:scale-95"
      >
        <span className="text-2xl">🇫🇷</span>
        <span className="font-black text-sm text-gray-700">5</span>
      </button>

      {/* Stats Group */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Streak */}
        <button
          onClick={onOpenStreak}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-orange-50 transition active:scale-95 text-[#ff9600]"
        >
          <span className="text-xl">🔥</span>
          <span className="font-black text-sm">{user.streak}</span>
        </button>

        {/* Gems */}
        <button
          onClick={onOpenShop}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-sky-50 transition active:scale-95 text-[#1cb0f6]"
        >
          <span className="text-xl">💎</span>
          <span className="font-black text-sm">{user.gems}</span>
        </button>

        {/* Energy / Hearts */}
        <button
          onClick={onOpenEnergy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-red-50 transition active:scale-95 text-[#ff4b4b]"
        >
          <span className="text-xl">{user.is_super ? "⚡" : "❤️"}</span>
          <span className="font-black text-sm">{user.is_super ? "∞" : user.hearts}</span>
        </button>
      </div>
    </header>
  );
}
