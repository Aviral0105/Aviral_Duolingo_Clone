"use client";

import Link from "next/link";
import { Sparkles, Zap } from "lucide-react";

export default function RightPanel() {
  return (
    <div className="w-full lg:w-80 shrink-0 space-y-5 select-none">
      {/* Super Duolingo Promo Card */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 text-white shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <h3 className="text-base font-black uppercase tracking-wider text-amber-300">
            Super Duolingo
          </h3>
        </div>
        <p className="text-xs font-bold text-purple-200 leading-relaxed mb-4">
          Learn faster with unlimited hearts, zero ads, and personalized mistake reviews.
        </p>
        <Link
          href="/shop"
          className="block text-center w-full py-2.5 rounded-2xl bg-white text-purple-900 font-black uppercase text-xs tracking-wider border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 transition hover:bg-gray-50"
        >
          TRY FOR FREE
        </Link>
      </div>

      {/* 1. Bronze League Card */}
      <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-gray-800">Bronze League</h3>
          <Link
            href="/leaderboard"
            className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider hover:underline"
          >
            VIEW LEAGUE
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-16 rounded-2xl bg-gradient-to-b from-amber-600 to-amber-800 border-2 border-amber-500 flex items-center justify-center text-3xl shadow-xs shrink-0">
            🪶
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-black text-base text-gray-800">
              You&apos;re ranked{" "}
              <span className="text-[#58cc02] font-black">#11</span>
            </div>
            <p className="text-xs font-bold text-gray-400 mt-0.5 leading-snug">
              You&apos;ve earned 34 XP this week so far
            </p>
          </div>
        </div>
      </div>

      {/* 2. Daily Quests Card */}
      <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-black text-gray-800">Daily Quests</h3>
          <Link
            href="/quests"
            className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider hover:underline"
          >
            VIEW ALL
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
            <Zap className="w-7 h-7 text-[#ffc800] fill-[#ffc800]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-black text-gray-800 mb-1.5">
              Earn 10 XP
            </div>
            <div className="relative w-full bg-gray-200 h-6 rounded-full overflow-hidden flex items-center">
              <div
                className="bg-[#ffc800] h-full rounded-full transition-all flex items-center justify-center font-black text-xs text-amber-900"
                style={{ width: "100%" }}
              >
                10 / 10
              </div>
            </div>
          </div>

          <span className="text-3xl shrink-0 cursor-pointer active:scale-95 transition" title="Chest">
            📦
          </span>
        </div>
      </div>

      {/* 3. Google AI Certificate / Coursera Ad Card (Matching screenshot) */}
      <div className="bg-[#242b35] text-white rounded-3xl p-5 shadow-xs relative overflow-hidden group select-none">
        <h4 className="text-xl font-black leading-tight text-white mb-2">
          New Google AI Certificate
        </h4>
        <div className="flex items-end justify-between gap-3 mt-3">
          <p className="text-xs text-gray-300 font-bold leading-snug max-w-[190px]">
            Turn daily tasks like research and writing into AI workflows that can save hours of work.
          </p>
          <div className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center font-black text-xl group-hover:translate-x-0.5 transition shadow-sm shrink-0">
            ›
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold mt-4 pt-3 border-t border-gray-700/60">
          <span className="flex items-center gap-1 cursor-pointer hover:text-gray-300">
            ℹ Coursera
          </span>
          <Link href="/shop" className="text-[#1cb0f6] font-black uppercase tracking-wider hover:underline">
            REMOVE ADS
          </Link>
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-black text-gray-400 uppercase tracking-wider px-2">
        <a href="#" className="hover:underline">About</a>
        <a href="#" className="hover:underline">Blog</a>
        <a href="#" className="hover:underline">Store</a>
        <a href="#" className="hover:underline">Efficacy</a>
        <a href="#" className="hover:underline">Careers</a>
        <a href="#" className="hover:underline">Investors</a>
        <a href="#" className="hover:underline">Terms</a>
        <a href="#" className="hover:underline">Privacy</a>
      </div>
    </div>
  );
}
