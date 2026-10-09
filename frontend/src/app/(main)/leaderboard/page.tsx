"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Info, X, Shield, ChevronUp } from "lucide-react";
import { fetchLeaderboard, setLeaderboardStatus, switchLeague, fetchUser } from "@/lib/api";
import { LeaderboardResponse, User } from "@/lib/types";
import { sounds } from "@/lib/sounds";
import DuolingoFooterLinks from "@/components/common/DuolingoFooterLinks";

const EMOJI_OPTIONS = [
  // Row 1
  { emoji: "😎", label: "Cool Duo" },
  { emoji: "🎉", label: "Party" },
  { emoji: "💪", label: "Bicep" },
  { emoji: "👀", label: "Peeking" },
  { emoji: "🍿", label: "Popcorn" },
  { emoji: "🇮🇳", label: "India" },
  // Row 2
  { emoji: "🦉", label: "Duo Owl" },
  { emoji: "💯", label: "100 Points" },
  { emoji: "💩", label: "Poop" },
  { emoji: "🏆", label: "Trophy" },
  { emoji: "🛒", label: "Cart" },
  { emoji: "😸", label: "Cool Cat" },
];

export default function LeaderboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<number>(3);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const loadLeaderboardData = useCallback(async (tier?: number) => {
    try {
      const targetTier = tier || selectedTier;
      const data = await fetchLeaderboard(targetTier);
      if (data) {
        setLeaderboardData(data);
        if (data.user_status_emoji !== undefined) {
          setSelectedEmoji(data.user_status_emoji);
        }
      }
      const u = await fetchUser();
      if (u) setCurrentUser(u);
    } catch {}
  }, [selectedTier]);

  useEffect(() => {
    loadLeaderboardData();
    window.addEventListener("duo_progress_updated", () => loadLeaderboardData());
    return () => window.removeEventListener("duo_progress_updated", () => loadLeaderboardData());
  }, [loadLeaderboardData]);

  const handleSelectEmoji = async (emoji: string) => {
    sounds.playTap();
    setSelectedEmoji(emoji);
    await setLeaderboardStatus(emoji);
  };

  const handleClearStatus = async () => {
    sounds.playTap();
    setSelectedEmoji(null);
    await setLeaderboardStatus(null);
  };

  const handleSwitchTier = async (tier: number) => {
    sounds.playTap();
    setSelectedTier(tier);
    await switchLeague(tier);
    await loadLeaderboardData(tier);
  };

  const leagueTitle = leaderboardData?.league_name || "Bronze League";
  const timeRemaining = leaderboardData?.time_remaining || "2 DAYS";
  const promotionThreshold = leaderboardData?.promotion_threshold || 11;
  const demotionThreshold = leaderboardData?.demotion_threshold || 0;
  const allLeagues = leaderboardData?.all_leagues || [
    { id: 1, name: "Bronze League", tier: 1, icon: "🪶", color: "#b47748", promotion_threshold: 11, demotion_threshold: 0, description: "Top 11 advance to the next league" },
    { id: 2, name: "Silver League", tier: 2, icon: "🥈", color: "#a8a8a8", promotion_threshold: 11, demotion_threshold: 5, description: "Top 11 advance to the Gold League" },
    { id: 3, name: "Gold League", tier: 3, icon: "🥇", color: "#ffc800", promotion_threshold: 11, demotion_threshold: 5, description: "Top 11 advance to the Sapphire League" },
    { id: 4, name: "Sapphire League", tier: 4, icon: "💎", color: "#1cb0f6", promotion_threshold: 11, demotion_threshold: 5, description: "Top 11 advance to the Ruby League" },
    { id: 5, name: "Ruby League", tier: 5, icon: "🔴", color: "#ff4b4b", promotion_threshold: 11, demotion_threshold: 5, description: "Top 11 advance to the Diamond League" },
  ];

  const entries = leaderboardData?.entries || [];

  // Determine user initial for the dashed avatar ring
  const userInitial = currentUser?.username ? currentUser.username.trim().charAt(0).toUpperCase() : "A";

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start pb-12">
      {/* ======================================================== */}
      {/* LEFT/CENTER COLUMN: LEAGUE RANKINGS & PROMOTION ZONE     */}
      {/* ======================================================== */}
      <div className="flex-1 w-full max-w-xl mx-auto">
        {/* League Shield Badges Carousel */}
        <div className="text-center pb-4 mb-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            {allLeagues.map((lg) => {
              const isActive = lg.tier === selectedTier;
              return (
                <button
                  key={lg.id}
                  onClick={() => handleSwitchTier(lg.tier)}
                  className={`transition-all duration-200 transform ${
                    isActive
                      ? "scale-110 -translate-y-1"
                      : "opacity-40 hover:opacity-75 scale-95"
                  }`}
                  title={`${lg.name} (Click to switch)`}
                >
                  <div
                    className={`w-14 h-18 sm:w-16 sm:h-20 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 transition ${
                      isActive
                        ? "border-amber-600 bg-gradient-to-b from-[#c68953] to-[#8d542b] ring-4 ring-amber-200/60"
                        : "border-gray-300 bg-gray-200"
                    }`}
                    style={
                      isActive
                        ? {
                            background:
                              lg.tier === 1
                                ? "linear-gradient(180deg, #c68953 0%, #8d542b 100%)"
                                : lg.tier === 2
                                ? "linear-gradient(180deg, #e0e0e0 0%, #a0a0a0 100%)"
                                : lg.tier === 3
                                ? "linear-gradient(180deg, #ffdb4d 0%, #d49a00 100%)"
                                : lg.tier === 4
                                ? "linear-gradient(180deg, #58cc02 0%, #2b8200 100%)"
                                : "linear-gradient(180deg, #ff4b4b 0%, #b81414 100%)",
                          }
                        : {}
                    }
                  >
                    {isActive ? (
                      <span className="drop-shadow-md select-none">{lg.icon}</span>
                    ) : (
                      <span className="text-lg text-gray-400">🔒</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* League Title & Subtitle matching Duolingo screenshots */}
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">
            {leagueTitle}
          </h1>
          <p className="text-xs font-bold text-gray-400 mt-0.5">
            Top {promotionThreshold} advance to the next league
          </p>
          <p className="text-xs font-black text-[#ff9600] mt-1">
            {timeRemaining.toLowerCase()}
          </p>
        </div>

        {/* ======================================================== */}
        {/* LEADERBOARD TABLE WITH PROMOTION ZONE                    */}
        {/* ======================================================== */}
        <div className="space-y-1">
          {entries.map((entry) => {
            const isPromotion = entry.rank <= promotionThreshold;
            const isDividerAfterThis = entry.rank === promotionThreshold;
            const isDemotionBeforeThis =
              demotionThreshold > 0 && entry.rank === entries.length - demotionThreshold + 1;

            return (
              <div key={entry.rank}>
                {/* Optional Demotion Zone divider for higher leagues */}
                {isDemotionBeforeThis && (
                  <div className="py-4 my-2 flex items-center justify-center gap-3">
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-red-300" />
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#ff4b4b]">
                      <span>⬇</span>
                      <span>DEMOTION ZONE</span>
                      <span>⬇</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-red-300" />
                  </div>
                )}

                {/* Learner Row */}
                <div
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition ${
                    entry.is_current_user
                      ? "border-[#84d8ff] bg-[#ddf4ff] font-black shadow-xs"
                      : "border-transparent bg-white hover:bg-gray-50/80"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Rank Number (Green in Promotion Zone, Gray outside) */}
                    <span
                      className={`w-6 text-center text-sm font-black shrink-0 ${
                        isPromotion ? "text-[#58cc02]" : "text-gray-400"
                      }`}
                    >
                      {entry.rank}
                    </span>

                    {/* Avatar with Status Sticker (Screenshot 1: Molik has bicep 💪 sticker) */}
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-xl overflow-hidden shadow-xs">
                        {entry.avatar}
                      </div>

                      {/* Status Sticker Badge */}
                      {entry.status_emoji && (
                        <span className="absolute -top-1.5 -right-1.5 text-xs bg-white rounded-full p-0.5 shadow-sm border border-gray-200 select-none animate-scale-up">
                          {entry.status_emoji}
                        </span>
                      )}
                    </div>

                    {/* Learner Name */}
                    <div className="truncate">
                      <span className="text-sm font-black text-gray-800">
                        {entry.username}
                      </span>
                      {entry.is_current_user && (
                        <span className="ml-2 text-[10px] font-black uppercase tracking-wider bg-[#1cb0f6] text-white px-2 py-0.5 rounded-md">
                          YOU
                        </span>
                      )}
                    </div>
                  </div>

                  {/* XP Count */}
                  <div className="text-xs font-black text-gray-400 shrink-0 pl-3">
                    {entry.xp} XP
                  </div>
                </div>

                {/* ⬆ PROMOTION ZONE DIVIDER ⬆ (Exactly after Rank 11) */}
                {isDividerAfterThis && (
                  <div className="py-4 my-2 flex items-center justify-center gap-3 select-none">
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-[#58cc02]/40" />
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#58cc02]">
                      <span className="text-sm">⬆</span>
                      <span>PROMOTION ZONE</span>
                      <span className="text-sm">⬆</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-[#58cc02]/40" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: "SET YOUR STATUS" WIDGET (Matching 1:1)    */}
      {/* ======================================================== */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs">
          {/* Header with Title and dynamic CLEAR button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-gray-800">Set your status</h2>
            {selectedEmoji && (
              <button
                onClick={handleClearStatus}
                className="text-xs font-black text-[#1cb0f6] hover:underline uppercase tracking-wider transition"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Dashed Avatar Circle with Cloud/Status Bubble */}
          <div className="relative flex items-center justify-center my-6">
            <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
              {/* User Initial Center */}
              <span className="text-3xl font-black text-gray-300 select-none">
                {userInitial}
              </span>

              {/* Green Online Dot at Bottom-Right */}
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-[#58cc02] rounded-full border-2 border-white shadow-xs" />

              {/* Status Spot at Top-Right */}
              {selectedEmoji ? (
                /* Active selected emoji sticker (Image 2) */
                <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-white border-2 border-gray-200 shadow-md flex items-center justify-center text-2xl animate-scale-up select-none">
                  {selectedEmoji}
                </div>
              ) : (
                /* Faint dashed thought bubble with smiley (Image 1) */
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-300/80 select-none">
                  🙂
                </div>
              )}
            </div>
          </div>

          {/* 12 Emoji Options in 2 Rows x 6 Columns */}
          <div className="grid grid-cols-6 gap-2">
            {EMOJI_OPTIONS.map((item) => {
              const isSelected = selectedEmoji === item.emoji;
              return (
                <button
                  key={item.emoji}
                  onClick={() => handleSelectEmoji(item.emoji)}
                  title={item.label}
                  className={`h-11 rounded-2xl border-2 flex items-center justify-center text-xl transition active:scale-90 ${
                    isSelected
                      ? "border-[#58cc02] bg-emerald-50/80 shadow-xs ring-2 ring-[#58cc02]/30 scale-105"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="select-none">{item.emoji}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Links (attaching official Duolingo external URLs) */}
        <DuolingoFooterLinks className="pt-2" />
      </div>

      {/* Info Modal */}
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
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold text-gray-600">
              <p>
                Compete with learners worldwide. Earn XP by completing lessons, listening drills, and practice challenges.
              </p>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 font-black">
                🏆 Top {promotionThreshold} learners get promoted to the next league every Sunday!
              </div>
              {demotionThreshold > 0 && (
                <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-red-900">
                  ⚠️ The bottom {demotionThreshold} learners risk dropping down to the previous league.
                </div>
              )}
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
