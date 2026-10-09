"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Lock, Info, X, Shield, ArrowRight } from "lucide-react";
import { fetchLeaderboard } from "@/lib/api";
import { LeaderboardResponse } from "@/lib/types";

export default function LeaderboardPage() {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>("😊");
  const [isLocked, setIsLocked] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse | null>(null);

  const loadLeaderboard = useCallback(async () => {
    try {
      const data = await fetchLeaderboard();
      if (data) setLeaderboardData(data);
    } catch {}
  }, []);

  useEffect(() => {
    loadLeaderboard();
    window.addEventListener("duo_progress_updated", loadLeaderboard);
    return () => window.removeEventListener("duo_progress_updated", loadLeaderboard);
  }, [loadLeaderboard]);

  const emojis = [
    "😎", "🎊", "💪", "👀", "🍿", "🇮🇳",
    "😠", "💯", "💩", "🏆", "⛏️", "😾"
  ];

  const rankings = (leaderboardData?.entries || []).map((entry) => ({
    rank: entry.rank,
    name: entry.username,
    xp: `${entry.xp} XP`,
    avatar: entry.avatar,
    isUser: entry.is_current_user,
    ribbonColor:
      entry.rank === 1
        ? "bg-amber-400 text-amber-900 border-amber-500"
        : entry.rank === 2
        ? "bg-slate-300 text-slate-800 border-slate-400"
        : entry.rank === 3
        ? "bg-amber-700 text-amber-100 border-amber-800"
        : undefined,
  }));

  const leagueTitle = leaderboardData?.league_name || "Bronze League";

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start pb-12">
      {/* LEFT/CENTER COLUMN: LEAGUE RANKINGS */}
      <div className="flex-1 w-full max-w-xl mx-auto">
        {/* League Shield Header */}
        <div className="text-center pb-6 border-b-2 border-gray-200 mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-20 rounded-2xl bg-gradient-to-b from-amber-700 to-amber-900 border-2 border-amber-600 shadow-md flex items-center justify-center text-3xl">
              🪶
            </div>
            <div className="w-12 h-16 rounded-xl bg-gray-200 opacity-60 flex items-center justify-center text-lg text-gray-400">
              🔒
            </div>
            <div className="w-12 h-16 rounded-xl bg-gray-200 opacity-40 flex items-center justify-center text-lg text-gray-400">
              🔒
            </div>
            <div className="w-12 h-16 rounded-xl bg-gray-200 opacity-30 flex items-center justify-center text-lg text-gray-400">
              🔒
            </div>
          </div>

          <h1 className="text-2xl font-black text-gray-800">{leagueTitle}</h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <p className="text-xs font-bold text-gray-400">
              Top 20 advance to the Silver League
            </p>
            <button
              onClick={() => setShowInfoModal(true)}
              className="text-[#1cb0f6] hover:underline text-xs font-black inline-flex items-center gap-0.5"
            >
              <Info className="w-3.5 h-3.5" />
              <span>What are leaderboards?</span>
            </button>
          </div>
        </div>

        {/* LOCKED STATE BANNER (When user needs 1 more lesson) */}
        {isLocked ? (
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 text-center shadow-xs my-6">
            <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-sky-300">
              <Shield className="w-10 h-10 text-[#1cb0f6]" />
            </div>
            <h2 className="text-xl font-black text-gray-800 mb-2">Unlock Leaderboards!</h2>
            <p className="text-xs font-bold text-gray-400 mb-6 max-w-sm mx-auto">
              Complete 1 more lesson to enter this week&apos;s competition and start climbing the ranks.
            </p>
            <Link
              href="/lesson/1"
              className="inline-block py-3.5 px-8 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black text-sm uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 shadow-md transition"
            >
              Start A Lesson
            </Link>
          </div>
        ) : (
          /* ACTIVE LEADERBOARD LIST */
          <div className="space-y-2">
            {rankings.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition ${
                  user.isUser
                    ? "border-[#84d8ff] bg-[#ddf4ff] shadow-sm font-black"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-7 text-center font-black text-sm ${
                      user.rank <= 3 ? "text-amber-500 font-extrabold" : "text-gray-400"
                    }`}
                  >
                    {user.rank}
                  </span>

                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-lg font-black text-[#1cb0f6]">
                      {user.avatar}
                    </div>
                    {user.isUser && selectedEmoji && (
                      <span className="absolute -bottom-1 -right-1 text-sm bg-white rounded-full shadow-xs">
                        {selectedEmoji}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-sm font-black text-gray-800">{user.name}</span>
                    {user.isUser && (
                      <span className="ml-2 text-[10px] uppercase font-black bg-[#1cb0f6] text-white px-2 py-0.5 rounded-md">
                        You
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs font-black text-gray-500">{user.xp}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: SET YOUR STATUS WIDGET */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-black text-gray-800">Set your status</h2>
            {selectedEmoji && (
              <button
                onClick={() => setSelectedEmoji(null)}
                className="text-xs font-black text-gray-400 hover:text-red-500 uppercase tracking-wider transition"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-xs font-bold text-gray-400 mb-4">
            Pick an emoji sticker to show on your leaderboard row!
          </p>

          <div className="grid grid-cols-4 gap-2.5">
            {emojis.map((emoji) => {
              const isSelected = selectedEmoji === emoji;
              return (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`text-2xl p-2.5 rounded-2xl border-2 transition active:scale-90 ${
                    isSelected
                      ? "border-[#1cb0f6] bg-sky-50 shadow-sm"
                      : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
        </div>

        {/* Locked state preview toggle */}
        <div className="p-4 rounded-2xl border border-dashed border-gray-300 text-center">
          <button
            onClick={() => setIsLocked(!isLocked)}
            className="text-xs font-bold text-[#1cb0f6] hover:underline"
          >
            {isLocked ? "Show active leaderboard" : "Preview locked state banner"}
          </button>
        </div>
      </div>

      {/* "What are leaderboards?" Modal */}
      {showInfoModal && (
        <div
          onClick={() => setShowInfoModal(false)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border-2 border-gray-200 relative animate-scale-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <h2 className="text-xl font-black text-gray-800">What are Leaderboards?</h2>
              <button onClick={() => setShowInfoModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold text-gray-600">
              <p>
                Compete with 30 learners from around the world. Earn XP by completing lessons, listening drills, and stories.
              </p>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 font-black">
                🏆 Top 20 learners get promoted to the next league every Sunday evening!
              </div>
              <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-red-900">
                ⚠️ The bottom 5 learners risk dropping down to a lower league.
              </div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-6 w-full py-3 rounded-2xl bg-[#58cc02] text-white font-black text-xs uppercase tracking-wider btn-3d-green"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
