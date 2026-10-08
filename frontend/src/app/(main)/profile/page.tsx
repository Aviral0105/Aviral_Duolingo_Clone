"use client";

import { useEffect, useState } from "react";
import { fetchUser } from "@/lib/api";
import { User } from "@/lib/types";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser().then(setUser);
  }, []);

  if (!user) return null;

  return (
    <div className="flex flex-col select-none">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-black text-gray-800">{user.username}</h1>
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-xl cursor-pointer">👔</span>
          <span className="text-xl cursor-pointer">⚙️</span>
        </div>
      </div>
      <div className="text-xs font-bold text-gray-400 mb-6">
        {user.handle} · JOINED 2025
      </div>

      {/* 4 Overview Stat Pills (Exact match to screenshot) */}
      <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
        Overview
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="border-2 border-gray-200 rounded-3xl p-4 flex items-center gap-3 bg-white">
          <span className="text-3xl">🔥</span>
          <div>
            <div className="text-lg font-black text-gray-800">{user.streak} days</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Streak</div>
          </div>
        </div>

        <div className="border-2 border-gray-200 rounded-3xl p-4 flex items-center gap-3 bg-white">
          <span className="text-3xl">🇫🇷</span>
          <div>
            <div className="text-lg font-black text-gray-800">5</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Level</div>
          </div>
        </div>

        <div className="border-2 border-gray-200 rounded-3xl p-4 flex items-center gap-3 bg-white">
          <span className="text-3xl">🏆</span>
          <div>
            <div className="text-lg font-black text-gray-800">Silver</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">League</div>
          </div>
        </div>

        <div className="border-2 border-gray-200 rounded-3xl p-4 flex items-center gap-3 bg-white">
          <span className="text-3xl">⚡</span>
          <div>
            <div className="text-lg font-black text-gray-800">{user.xp} XP</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">Total XP</div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
        Achievements
      </div>
      <div className="space-y-3">
        <div className="border-2 border-red-200 bg-red-50/50 rounded-3xl p-4 flex items-center gap-4">
          <span className="text-4xl">🔥</span>
          <div>
            <div className="text-xs font-black text-red-600 uppercase">Wildfire</div>
            <div className="text-xs font-bold text-gray-700">Reach a 3-day streak</div>
          </div>
        </div>

        <div className="border-2 border-yellow-200 bg-yellow-50/50 rounded-3xl p-4 flex items-center gap-4">
          <span className="text-4xl">👑</span>
          <div>
            <div className="text-xs font-black text-yellow-600 uppercase">Champion</div>
            <div className="text-xs font-bold text-gray-700">Unlock Section 1, Unit 1</div>
          </div>
        </div>
      </div>
    </div>
  );
}
