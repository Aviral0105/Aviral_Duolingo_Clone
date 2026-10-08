"use client";

import { useEffect, useState } from "react";
import { fetchLeaderboard } from "@/lib/api";
import { LeaderboardResponse } from "@/lib/types";

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardResponse | null>(null);

  useEffect(() => {
    fetchLeaderboard().then(setData);
  }, []);

  if (!data) return null;

  return (
    <div className="flex flex-col select-none">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-black text-gray-800">{data.league_name}</h1>
        <span className="text-xs font-black text-gray-400">⏱️ {data.time_remaining}</span>
      </div>

      {/* Trophy Tier Carousel */}
      <div className="flex justify-center items-center gap-6 py-4 border-b-2 border-gray-200 mb-6">
        <div className="text-center opacity-50">
          <span className="text-3xl">🥉</span>
          <div className="text-[10px] font-black text-gray-400 uppercase mt-1">Bronze</div>
        </div>
        <div className="text-center scale-110">
          <span className="text-5xl">🥈</span>
          <div className="text-xs font-black text-gray-700 uppercase mt-1">Silver</div>
        </div>
        <div className="text-center opacity-40">
          <span className="text-3xl">🥇</span>
          <div className="text-[10px] font-black text-gray-400 uppercase mt-1">Gold</div>
        </div>
      </div>

      {/* Ranked Learners Table */}
      <div className="space-y-2.5">
        {data.entries.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition ${
              entry.is_current_user
                ? "bg-[#ddf4ff] border-[#1cb0f6] shadow-xs"
                : entry.rank === 1
                ? "bg-amber-50 border-amber-200"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-4">
              <span
                className={`font-black text-base w-5 text-center ${
                  entry.rank === 1
                    ? "text-amber-500"
                    : entry.is_current_user
                    ? "text-[#1cb0f6]"
                    : "text-gray-400"
                }`}
              >
                {entry.rank}
              </span>
              <span className="text-3xl">{entry.avatar}</span>
              <span
                className={`font-black text-sm ${
                  entry.is_current_user ? "text-[#1899d6]" : "text-gray-800"
                }`}
              >
                {entry.username}
              </span>
            </div>
            <span
              className={`font-black text-sm ${
                entry.is_current_user ? "text-[#1899d6]" : "text-gray-500"
              }`}
            >
              {entry.xp} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
