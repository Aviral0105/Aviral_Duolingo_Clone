"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchUser } from "@/lib/api";

interface Achievement {
  id: string;
  title: string;
  description: string;
  level: number;
  current: number;
  target: number;
  bgColor: string;
  ribbonColor: string;
  icon: string;
  badgeType: "flame" | "wizard" | "shield" | "bow" | "trophy" | "friends" | "helmet" | "photo";
}

export default function AchievementsPage() {
  const [streak, setStreak] = useState(3);
  const [xp, setXp] = useState(265);

  useEffect(() => {
    async function load() {
      const u = await fetchUser();
      if (u) {
        if (u.streak !== undefined) setStreak(u.streak);
        if (u.xp !== undefined) setXp(u.xp);
      }
    }
    load();
    window.addEventListener("duo_progress_updated", load);
    return () => window.removeEventListener("duo_progress_updated", load);
  }, []);

  const achievements: Achievement[] = [
    {
      id: "wildfire",
      title: "Wildfire",
      description: "Reach a 3 day streak",
      level: 1,
      current: Math.min(3, streak),
      target: 3,
      bgColor: "bg-[#ff4b4b]",
      ribbonColor: "bg-[#d62828]",
      icon: "🔥",
      badgeType: "flame",
    },
    {
      id: "sage",
      title: "Sage",
      description: "Earn 100 XP",
      level: 1,
      current: Math.min(100, xp),
      target: 100,
      bgColor: "bg-[#58cc02]",
      ribbonColor: "bg-[#46a302]",
      icon: "🧙‍♂️",
      badgeType: "wizard",
    },
    {
      id: "champion",
      title: "Champion",
      description: "Advance to the Silver League",
      level: 2,
      current: 1,
      target: 2,
      bgColor: "bg-[#a855f7]",
      ribbonColor: "bg-[#9333ea]",
      icon: "🛡️",
      badgeType: "shield",
    },
    {
      id: "sharpshooter",
      title: "Sharpshooter",
      description: "Complete 5 lessons with no mistakes",
      level: 2,
      current: 1,
      target: 5,
      bgColor: "bg-[#58cc02]",
      ribbonColor: "bg-[#46a302]",
      icon: "🏹",
      badgeType: "bow",
    },
    {
      id: "winner",
      title: "Winner",
      description: "Finish #1 in the leaderboard",
      level: 1,
      current: 0,
      target: 1,
      bgColor: "bg-[#a855f7]",
      ribbonColor: "bg-[#9333ea]",
      icon: "🏆",
      badgeType: "trophy",
    },
    {
      id: "friendly",
      title: "Friendly",
      description: "Follow 3 friends",
      level: 1,
      current: 0,
      target: 3,
      bgColor: "bg-[#a855f7]",
      ribbonColor: "bg-[#9333ea]",
      icon: "🧑‍🤝‍🧑",
      badgeType: "friends",
    },
    {
      id: "weekend_warrior",
      title: "Weekend Warrior",
      description: "Complete a lesson on Saturday and Sunday",
      level: 1,
      current: 0,
      target: 2,
      bgColor: "bg-[#58cc02]",
      ribbonColor: "bg-[#46a302]",
      icon: "🪖",
      badgeType: "helmet",
    },
    {
      id: "photogenic",
      title: "Photogenic",
      description: "Add a profile picture",
      level: 1,
      current: 0,
      target: 1,
      bgColor: "bg-[#1cb0f6]",
      ribbonColor: "bg-[#1899d6]",
      icon: "👤",
      badgeType: "photo",
    },
  ];

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
        <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">
          All achievements
        </h1>
      </div>

      {/* Main Achievements Card Container matching Images 1 & 2 */}
      <div className="bg-white border border-gray-200 rounded-3xl divide-y divide-gray-100 overflow-hidden shadow-xs">
        {achievements.map((item) => {
          const pct = Math.min(100, Math.round((item.current / item.target) * 100));
          return (
            <div
              key={item.id}
              className="p-5 sm:p-6 flex items-center gap-5 hover:bg-gray-50/50 transition"
            >
              {/* Badge Shield matching Images 1 & 2 */}
              <div
                className={`w-16 h-20 rounded-2xl ${item.bgColor} text-white flex flex-col items-center justify-between shadow-xs shrink-0 overflow-hidden relative`}
              >
                {/* Badge Icon */}
                <div className="flex-1 flex items-center justify-center text-2xl pt-1">
                  {item.icon}
                </div>

                {/* Bottom Level Ribbon */}
                <div
                  className={`w-full py-1 text-center font-black text-[9px] uppercase tracking-wider text-white ${item.ribbonColor}`}
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
                    {item.current}/{item.target}
                  </span>
                </div>

                {/* Golden/Yellow Progress Bar matching Screenshots */}
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
        })}
      </div>
    </div>
  );
}
