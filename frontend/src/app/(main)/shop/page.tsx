"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { sounds } from "@/lib/sounds";
import { ChevronRight, X, Sparkles, Heart, Zap, Info } from "lucide-react";
import { fetchUser, purchaseShopItem, refillHearts } from "@/lib/api";
import { User } from "@/lib/types";
import { getLeagueConfig } from "@/lib/league";
import TopStatsBar from "@/components/navigation/TopStatsBar";

export default function ShopPage() {
  const [user, setUser] = useState<User | null>(null);
  const [heartsCount, setHeartsCount] = useState(5);
  const [xpBoostActive, setXpBoostActive] = useState(false);
  const [showSuperModal, setShowSuperModal] = useState(false);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadUserData = () => {
    fetchUser()
      .then((u) => {
        setUser(u);
        setHeartsCount(u.hearts);
        if (u.double_xp_until) {
          const expiresAt = new Date(u.double_xp_until).getTime();
          setXpBoostActive(expiresAt > Date.now());
        } else {
          setXpBoostActive(false);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadUserData();
    window.addEventListener("duo_progress_updated", loadUserData);
    return () => window.removeEventListener("duo_progress_updated", loadUserData);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefillHearts = async () => {
    if (heartsCount >= 5 && !user?.is_super) {
      showToast("Hearts are already full!");
      return;
    }
    try {
      const res = await purchaseShopItem("refill_hearts");
      sounds.playCorrect();
      setHeartsCount(res.hearts ?? 5);
      showToast(`❤️ Hearts refilled to 5! (Remaining: ${res.new_gems} Gems)`);
      window.dispatchEvent(new Event("duo_progress_updated"));
    } catch (e: any) {
      showToast(e.message || "Failed to refill hearts");
    }
  };

  const handleBuyFreeze = async () => {
    try {
      const res = await purchaseShopItem("streak_freeze");
      sounds.playVictory();
      showToast(`🧊 Streak Freeze equipped! (${res.streak_freezes ?? 2}/2)`);
      window.dispatchEvent(new Event("duo_progress_updated"));
    } catch (e: any) {
      showToast(e.message || "Failed to equip Streak Freeze");
    }
  };

  const handleBuyBoost = async () => {
    try {
      const res = await purchaseShopItem("double_xp");
      sounds.playVictory();
      setXpBoostActive(true);
      showToast(`⚡ 2x XP Boost activated for 15 minutes! (Remaining: ${res.new_gems} Gems)`);
      window.dispatchEvent(new Event("duo_progress_updated"));
    } catch (e: any) {
      showToast(e.message || "Failed to activate boost");
    }
  };

  const handleActivateSuper = async () => {
    try {
      await purchaseShopItem("super_trial");
      sounds.playVictory();
      setShowSuperModal(false);
      setShowFamilyModal(false);
      showToast("✨ Super Duolingo Free Trial activated! Enjoy Unlimited Hearts!");
      window.dispatchEvent(new Event("duo_progress_updated"));
    } catch (e: any) {
      showToast(e.message || "Failed to activate trial");
    }
  };

  const streakFreezes = user?.streak_freezes ?? 2;

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#58cc02] text-white px-5 py-3 rounded-2xl shadow-xl font-black text-sm flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* CENTER FEED: HERO BANNER, HEARTS & POWER-UPS             */}
      {/* ======================================================== */}
      <div className="flex-1 w-full max-w-xl mx-auto space-y-6">
        {/* Family Plan Hero Banner (matching user screenshot 1:1) */}
        <div className="bg-gradient-to-r from-[#172338] via-[#1b2b48] to-[#141e33] rounded-3xl text-white p-6 sm:p-7 flex items-center justify-between shadow-sm relative overflow-hidden border border-slate-800">
          {/* Subtle star sparkles in background */}
          <div className="absolute top-3 left-1/3 w-1.5 h-1.5 bg-blue-200/60 rounded-full animate-ping" />
          <div className="absolute top-8 right-1/4 w-1 h-1 bg-yellow-200/70 rounded-full" />
          <div className="absolute bottom-4 left-1/4 w-1 h-1 bg-blue-300/40 rounded-full" />

          <div className="max-w-[280px] sm:max-w-xs z-10">
            <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Start a family plan!
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-300 mt-1 leading-snug">
              Save on <span className="font-black text-white">Super Duolingo</span> when you learn with friends
            </p>
            <button
              onClick={() => setShowFamilyModal(true)}
              className="mt-4 bg-white text-[#172338] font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-2xl shadow-md border-b-4 border-gray-300 active:border-b-0 active:translate-y-1 transition hover:bg-gray-100"
            >
              LEARN MORE
            </button>
          </div>

          {/* Group of Duolingo characters illustration */}
          <div className="shrink-0 z-10 flex items-center justify-center pl-2">
            <div className="relative w-28 h-28 sm:w-36 sm:h-32 flex items-center justify-center">
              {/* Stylized colorful friends group badge */}
              <div className="text-5xl sm:text-6xl drop-shadow-lg select-none flex items-center">
                <span className="translate-y-1 scale-90">👳🏾‍♂️</span>
                <span className="text-6xl sm:text-7xl -ml-3 z-10">🦉</span>
                <span className="-ml-3 translate-y-2 scale-90">🏃🏾‍♀️</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: HEARTS */}
        <div>
          <h2 className="text-lg font-black text-gray-800 mb-3">Hearts</h2>
          <div className="space-y-3">
            {/* Refill Hearts */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center text-3xl shadow-xs shrink-0">
                  ❤️
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-base text-gray-800">Refill Hearts</h3>
                  <p className="text-xs text-gray-400 font-bold leading-relaxed">
                    Get full hearts so you can worry less about making mistakes in a lesson
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                {heartsCount >= 5 || user?.is_super ? (
                  <span className="px-6 py-2.5 rounded-2xl bg-gray-100 border-2 border-gray-200 text-xs font-black uppercase tracking-wider text-gray-400 select-none block">
                    FULL
                  </span>
                ) : (
                  <button
                    onClick={handleRefillHearts}
                    className="px-5 py-2.5 rounded-2xl bg-[#1cb0f6] border-b-4 border-[#1899d6] text-white text-xs font-black uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>💎</span>
                    <span>350</span>
                  </button>
                )}
              </div>
            </div>

            {/* Unlimited Hearts */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-500 to-fuchsia-500 border-2 border-fuchsia-300 flex items-center justify-center text-white text-2xl font-black shadow-xs shrink-0">
                  ♾️
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-base text-gray-800">Unlimited Hearts</h3>
                  <p className="text-xs text-gray-400 font-bold leading-relaxed">
                    {user?.is_super ? "Active with Super Duolingo" : "Never run out of hearts with Super!"}
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                {user?.is_super ? (
                  <span className="px-5 py-2.5 rounded-2xl bg-[#a855f7] text-white text-xs font-black uppercase tracking-wider select-none block">
                    ACTIVE
                  </span>
                ) : (
                  <button
                    onClick={() => setShowSuperModal(true)}
                    className="px-5 py-2.5 rounded-2xl bg-white border-2 border-gray-200 border-b-4 text-[#a855f7] hover:bg-purple-50 active:border-b-0 active:translate-y-1 transition text-xs font-black uppercase tracking-wider shadow-xs"
                  >
                    FREE TRIAL
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: POWER-UPS */}
        <div>
          <h2 className="text-lg font-black text-gray-800 mb-3">Power-Ups</h2>
          <div className="space-y-3">
            {/* Streak Freeze */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 border-2 border-sky-100 flex items-center justify-center text-3xl shadow-xs shrink-0">
                  🧊
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-base text-gray-800">Streak Freeze</h3>
                    <span className="bg-[#58cc02] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {streakFreezes} / 2 EQUIPPED
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-bold leading-relaxed mt-0.5">
                    Streak Freeze allows your streak to remain in place for one full day of inactivity.
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                {streakFreezes >= 2 ? (
                  <span className="px-5 py-2.5 rounded-2xl bg-white border-2 border-gray-200 text-xs font-black uppercase tracking-wider text-gray-400 select-none block">
                    EQUIPPED
                  </span>
                ) : (
                  <button
                    onClick={handleBuyFreeze}
                    className="px-5 py-2.5 rounded-2xl bg-[#1cb0f6] border-b-4 border-[#1899d6] text-white text-xs font-black uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>💎</span>
                    <span>200</span>
                  </button>
                )}
              </div>
            </div>

            {/* XP Boost */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border-2 border-amber-100 flex items-center justify-center text-3xl shadow-xs shrink-0">
                  ⚡
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-base text-gray-800">XP Boost</h3>
                    {xpBoostActive && (
                      <span className="bg-[#58cc02] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        ACTIVE (2X)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-bold leading-relaxed mt-0.5">
                    Double your XP earned in lessons for the next 15 minutes!
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                {xpBoostActive ? (
                  <span className="px-5 py-2.5 rounded-2xl bg-[#58cc02] text-white text-xs font-black uppercase tracking-wider select-none block">
                    ACTIVE
                  </span>
                ) : (
                  <button
                    onClick={handleBuyBoost}
                    className="px-5 py-2.5 rounded-2xl bg-[#1cb0f6] border-b-4 border-[#1899d6] text-white text-xs font-black uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>💎</span>
                    <span>100</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT-HAND COLUMN: STATS, BRONZE LEAGUE, DAILY QUESTS, AD */}
      {/* ======================================================== */}
      <div className="w-full lg:w-80 shrink-0 space-y-4">
        {/* Top Stats Bar: Course Flag, Streak, Gems, Hearts (Desktop Right Column) */}
        <TopStatsBar user={user} />

        {/* 1. Dynamic League Card (Forwards to /leaderboard) */}
        {(() => {
          const leagueCfg = getLeagueConfig(user?.current_league || "Gold League");
          return (
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-gray-800">{leagueCfg.name}</h3>
                <Link
                  href="/leaderboard"
                  className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider hover:underline transition"
                >
                  VIEW LEAGUE
                </Link>
              </div>

              <Link href="/leaderboard" className="flex items-center gap-4 group">
                <div className={`w-14 h-16 rounded-2xl bg-gradient-to-b ${leagueCfg.gradient} border-2 ${leagueCfg.borderColor} flex items-center justify-center text-3xl shadow-xs shrink-0 group-hover:scale-105 transition`}>
                  {leagueCfg.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-black text-base text-gray-800">
                    You&apos;re ranked <span className="text-[#58cc02] font-black">#9</span>
                  </div>
                  <p className="text-xs font-bold text-gray-400 mt-0.5 leading-snug">
                    You&apos;ve earned {user?.xp ?? 0} XP so far
                  </p>
                </div>
              </Link>
            </div>
          );
        })()}

        {/* 2. Daily Quests Card (Forwards to /quests) */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-black text-gray-800">Daily Quests</h3>
            <Link
              href="/quests"
              className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider hover:underline transition"
            >
              VIEW ALL
            </Link>
          </div>

          <Link href="/quests" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Zap className="w-6 h-6 text-[#ffc800] fill-[#ffc800]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-black text-gray-800 mb-1.5">
                Earn {user?.daily_goal_xp ?? 10} XP
              </div>
              <div className="relative w-full bg-gray-200 h-6 rounded-full overflow-hidden flex items-center">
                <div
                  className="bg-[#ffc800] h-full rounded-full transition-all flex items-center justify-center font-black text-xs text-amber-950"
                  style={{ width: `${Math.min(100, Math.max(15, Math.round(((user?.xp ?? 0) / (user?.daily_goal_xp ?? 10)) * 100)))}%` }}
                >
                  {Math.min(user?.xp ?? 0, user?.daily_goal_xp ?? 10)} / {user?.daily_goal_xp ?? 10}
                </div>
              </div>
            </div>

            <span className="text-3xl shrink-0 group-hover:scale-110 transition" title="Chest">
              🧰
            </span>
          </Link>
        </div>

        {/* 3. Coursera Stanford 7-Day Free Trial Promo Card */}
        <div>
          <div
            onClick={() => setShowSuperModal(true)}
            className="bg-[#202938] rounded-3xl p-6 text-white shadow-xs relative overflow-hidden group cursor-pointer hover:bg-[#273244] transition"
          >
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
              7-Day Free<br />Trial
            </h3>
            <p className="text-xs font-bold text-gray-300 mt-4 max-w-[190px] leading-relaxed">
              Earn a career certificate from Stanford University.
            </p>

            {/* Circular Arrow Button */}
            <div className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center font-black shadow-md group-hover:scale-110 group-hover:bg-gray-100 transition absolute bottom-6 right-6">
              <ChevronRight className="w-6 h-6 stroke-[3]" />
            </div>
          </div>

          {/* Footer attribution */}
          <div className="flex items-center justify-between px-2 pt-2 text-[10px] font-bold text-gray-400">
            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-600">
              <Info className="w-3.5 h-3.5" />
            </div>
            <span className="tracking-wide">Coursera</span>
          </div>
        </div>
      </div>

      {/* Super Duolingo Modal */}
      {showSuperModal && (
        <div
          onClick={() => setShowSuperModal(false)}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-gray-200 text-center relative animate-scale-up"
          >
            <button
              onClick={() => setShowSuperModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-6xl block mb-3">🦉✨</span>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Try Super for Free</h2>
            <p className="text-xs font-bold text-gray-500 mb-6">
              Learn faster with unlimited hearts, no ads, and personalized practice sessions.
            </p>
            <button
              onClick={handleActivateSuper}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition"
            >
              Start My Free Trial
            </button>
          </div>
        </div>
      )}

      {/* Family Plan Modal */}
      {showFamilyModal && (
        <div
          onClick={() => setShowFamilyModal(false)}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-gray-200 text-center relative animate-scale-up"
          >
            <button
              onClick={() => setShowFamilyModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-6xl block mb-3">👨‍👩‍👧‍👦✨</span>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Super Duolingo Family Plan</h2>
            <p className="text-xs font-bold text-gray-500 mb-6 leading-relaxed">
              Add up to 5 family members or friends! Everyone gets unlimited hearts, no ads, and individualized progress tracking on one low membership fee.
            </p>
            <div className="space-y-3 mb-6 text-left">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center gap-3">
                <span className="text-xl">♾️</span>
                <span className="text-xs font-black text-purple-900">Unlimited hearts for all 6 members</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 flex items-center gap-3">
                <span className="text-xl">🚫</span>
                <span className="text-xs font-black text-blue-900">Zero ad interruptions forever</span>
              </div>
            </div>
            <button
              onClick={handleActivateSuper}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition"
            >
              Start 14-Day Free Family Trial
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
