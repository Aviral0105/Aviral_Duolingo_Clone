"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchAchievements } from "@/lib/api";
import { AchievementItem } from "@/lib/types";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAchievements = useCallback(async () => {
    try {
      const data = await fetchAchievements();
      if (data && data.length > 0) {
        setAchievements(data);
      }
    } catch (e) {
      console.warn("Failed to load achievements", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAchievements();
    window.addEventListener("duo_progress_updated", loadAchievements);
    return () => window.removeEventListener("duo_progress_updated", loadAchievements);
  }, [loadAchievements]);

  return (
    <div className="max-w-xl mx-auto pb-20 pt-4 select-none animate-fade-in">
      {/* Top Header & Back link */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/profile"
          className="w-10 h-10 rounded-2xl border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-800 transition active:scale-95 bg-white"
          title="Back to Profile"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">
            All achievements
          </h1>
          <p className="text-xs font-bold text-gray-400 mt-0.5">
            {achievements.filter((a) => a.unlocked).length} of {achievements.length || 11} unlocked
          </p>
        </div>
      </div>

      {/* Main Achievements Card Container */}
      <div className="bg-white border-2 border-gray-200 rounded-3xl divide-y divide-gray-100 overflow-hidden shadow-xs">
        {loading && achievements.length === 0 ? (
          <div className="p-8 text-center text-gray-400 font-bold text-sm">
            Loading achievements...
          </div>
        ) : (
          achievements.map((item) => {
            const pct = Math.min(
              100,
              Math.max(
                0,
                item.target_value > 0
                  ? Math.round((item.current_value / item.target_value) * 100)
                  : 0
              )
            );

            return (
              <div
                key={item.key}
                className="p-5 sm:p-6 flex items-center gap-5 hover:bg-gray-50/50 transition"
              >
                {/* Badge Shield */}
                <div
                  className={`w-16 h-20 rounded-2xl ${item.bg_color || "bg-[#58cc02]"} text-white flex flex-col items-center justify-between shadow-xs shrink-0 overflow-hidden relative`}
                >
                  {/* Badge Icon */}
                  <div className="flex-1 flex items-center justify-center text-2xl pt-1">
                    {item.icon}
                  </div>

                  {/* Bottom Level Ribbon */}
                  <div
                    className={`w-full py-1 text-center font-black text-[9px] uppercase tracking-wider text-white ${item.ribbon_color || "bg-[#46a302]"}`}
                  >
                    LEVEL {item.level}
                  </div>
                </div>

                {/* Progress & Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-black text-base text-gray-800">
                      {item.title}
                    </h3>
                    <span className="text-xs font-bold text-gray-400">
                      {item.current_value}/{item.target_value}
                    </span>
                  </div>

                  {/* Golden/Yellow Progress Bar */}
                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-[#ffc800] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Requirement Subtitle */}
                  <p className="text-xs font-bold text-gray-500">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
