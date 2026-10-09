"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Lock, Zap, Clock, Sparkles, X, Gift, Users } from "lucide-react";
import { sounds } from "@/lib/sounds";
import { fetchUser, fetchXPSummary } from "@/lib/api";
import { User } from "@/lib/types";

export default function QuestsPage() {
  const [activeTab, setActiveTab] = useState<"quests" | "badges">("quests");
  const [questClaimed, setQuestClaimed] = useState(false);
  const [showChestModal, setShowChestModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [xpSummary, setXpSummary] = useState<any>(null);

  const loadData = useCallback(async () => {
    try {
      const [u, xp] = await Promise.all([fetchUser(), fetchXPSummary()]);
      if (u) setUser(u);
      if (xp) setXpSummary(xp);
    } catch {}
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener("duo_progress_updated", loadData);
    return () => window.removeEventListener("duo_progress_updated", loadData);
  }, [loadData]);

  const dailyGoal = user?.daily_goal_xp ?? 10;
  const todayXp = xpSummary?.today_xp ?? Math.min(user?.xp ?? 0, 10);
  const questProgress = Math.min(dailyGoal, todayXp);
  const questPct = Math.min(100, Math.round((questProgress / dailyGoal) * 100));
  const isCompleted = questProgress >= dailyGoal;

  const handleClaimReward = () => {
    sounds.playVictory();
    setQuestClaimed(true);
    setShowChestModal(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start pb-12">
      {/* LEFT/CENTER COLUMN: QUESTS FEED */}
      <div className="flex-1 w-full max-w-xl mx-auto space-y-6">
        {/* Quests / Badges Header Tabs */}
        <div className="flex border-b-2 border-gray-200 gap-8">
          <button
            onClick={() => setActiveTab("quests")}
            className={`pb-3 font-black text-sm uppercase tracking-wider transition ${
              activeTab === "quests"
                ? "text-[#58cc02] border-b-4 border-[#58cc02] -mb-0.5"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Quests
          </button>
          <button
            onClick={() => setActiveTab("badges")}
            className={`pb-3 font-black text-sm uppercase tracking-wider transition ${
              activeTab === "badges"
                ? "text-[#58cc02] border-b-4 border-[#58cc02] -mb-0.5"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Badges
          </button>
        </div>

        {activeTab === "quests" ? (
          <>
            {/* Purple Welcome Banner */}
            <div className="bg-[#7c3aed] rounded-3xl text-white p-7 sm:p-8 flex items-center justify-between shadow-sm relative overflow-hidden">
              <div className="max-w-xs z-10">
                <h1 className="text-2xl sm:text-3xl font-black mb-2">Welcome!</h1>
                <p className="text-xs sm:text-sm font-bold text-purple-100 leading-relaxed">
                  Complete quests to earn rewards! Quests refresh every day.
                </p>
              </div>
              <div className="text-7xl sm:text-8xl shrink-0 z-10 animate-bounce">
                🦉📦✨
              </div>
            </div>

            {/* Daily Quests Header */}
            <div className="flex items-center justify-between pt-2">
              <h2 className="text-xl font-black text-gray-800">Daily Quests</h2>
              <div className="flex items-center gap-1.5 text-xs font-black text-[#ff9600]">
                <Clock className="w-4 h-4 stroke-[2.5]" />
                <span>2 HOURS</span>
              </div>
            </div>

            {/* Quest 1: Active Completed Quest (Earn XP) */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                <Zap className="w-7 h-7 text-[#ffc800] fill-[#ffc800]" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-black text-base text-gray-800 mb-2">Earn {dailyGoal} XP</h3>
                <div className="relative w-full bg-gray-200 h-6 rounded-full overflow-hidden flex items-center">
                  <div
                    className="bg-[#ffc800] h-full rounded-full transition-all flex items-center justify-center font-black text-xs text-amber-900"
                    style={{ width: `${Math.max(12, questPct)}%` }}
                  >
                    {questProgress} / {dailyGoal}
                  </div>
                </div>
              </div>

              {/* Clickable Treasure Chest */}
              <button
                onClick={() => {
                  if (isCompleted && !questClaimed) setShowChestModal(true);
                }}
                className={`text-4xl shrink-0 p-2 rounded-2xl transition active:scale-90 ${
                  questClaimed
                    ? "opacity-50 cursor-default"
                    : isCompleted
                    ? "animate-pulse hover:scale-110 cursor-pointer"
                    : "opacity-40 cursor-not-allowed"
                }`}
                title={
                  questClaimed
                    ? "Reward claimed"
                    : isCompleted
                    ? "Click to claim reward!"
                    : "Complete quest to unlock reward"
                }
              >
                {questClaimed ? "🪙" : "🎁"}
              </button>
            </div>

            {/* Friends Quest Section */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#1cb0f6]" />
                  <h3 className="font-black text-base text-gray-800">Friends Quest</h3>
                </div>
                <span className="text-[10px] font-black uppercase text-[#1cb0f6] bg-sky-50 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
              <p className="text-xs text-gray-500 font-bold mb-4">
                Score 90% or higher in 5 Hindi lessons together with a friend!
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert("Nudge sent! Your friend received a friendly reminder.")}
                  className="px-4 py-2 rounded-xl border-2 border-gray-200 text-xs font-black text-gray-700 hover:bg-gray-50 active:scale-95 transition"
                >
                  Nudge 👋
                </button>
                <button
                  onClick={() => alert("Gift sent: +10 Gems sent to your friend!")}
                  className="px-4 py-2 rounded-xl bg-[#1cb0f6] text-white text-xs font-black uppercase tracking-wider hover:brightness-105 active:scale-95 transition flex items-center gap-1.5"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Send Gift</span>
                </button>
              </div>
            </div>

            {/* Shortcut: START A LESSON */}
            <div className="text-center pt-2">
              <Link
                href="/lesson/1"
                className="inline-block py-3.5 px-8 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black text-sm uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 shadow-md transition"
              >
                Start A Lesson
              </Link>
            </div>
          </>
        ) : (
          /* BADGES TAB */
          <div className="space-y-4">
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 text-center">
              <div className="text-6xl mb-3">🏅</div>
              <h3 className="text-lg font-black text-gray-800">October 2026 Challenge</h3>
              <p className="text-xs text-gray-400 font-bold mt-1 mb-4">
                Complete 30 quests this month to earn the exclusive Gold Badge!
              </p>
              <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden max-w-xs mx-auto mb-2">
                <div className="bg-[#ff9600] h-full rounded-full w-1/3 text-[10px] font-black text-white flex items-center justify-center">
                  10 / 30
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs text-center">
          <span className="text-5xl block mb-2">🏆</span>
          <h3 className="text-base font-black text-gray-800">Monthly challenges unlock soon!</h3>
          <p className="text-xs text-gray-400 font-bold mt-1">
            Keep completing daily quests to unlock badges and earn bonus gems.
          </p>
        </div>
      </div>

      {/* Chest Opening Claim Modal */}
      {showChestModal && (
        <div
          onClick={() => setShowChestModal(false)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border-2 border-gray-200 text-center relative animate-scale-up"
          >
            <span className="text-7xl block mb-3 animate-bounce">🎁✨</span>
            <h2 className="text-2xl font-black text-gray-800 mb-1">Quest Completed!</h2>
            <p className="text-xs font-bold text-gray-500 mb-6">
              You earned 10 XP today! Here is your reward:
            </p>
            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 font-black text-lg text-amber-900 mb-6 flex items-center justify-center gap-2">
              <span>💎</span>
              <span>+10 Gems</span>
            </div>
            <button
              onClick={handleClaimReward}
              className="w-full py-3.5 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black text-sm uppercase tracking-wider btn-3d-green"
            >
              Claim Reward
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
