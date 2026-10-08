"use client";

import { useState } from "react";
import {
  Flame,
  Zap,
  Shield,
  Medal,
  Pencil,
  Plus,
  Search,
  Mail,
  ChevronRight,
  Sparkles,
  X,
  Check,
  Share2,
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"following" | "followers">("following");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isFindFriendsOpen, setIsFindFriendsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyInvite = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText("https://duolingo.com/invite/AVIRALJAIN51695");
    }
    showToast("🎉 Invite link copied to clipboard!");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT / CENTER COLUMN: PROFILE FEED */}
      <div className="flex-1 w-full max-w-xl mx-auto space-y-6">
        {/* Avatar Hero Card */}
        <div className="relative bg-[#dff2fb] border-2 border-[#bce3f8] rounded-3xl h-60 flex items-center justify-center overflow-hidden shadow-xs">
          {/* Avatar Silhouette Outline */}
          <div
            onClick={() => setIsAvatarModalOpen(true)}
            className="cursor-pointer group flex flex-col items-center justify-center transition active:scale-95"
          >
            {/* Silhouette SVG */}
            <div className="relative w-32 h-36 flex items-center justify-center">
              <svg
                viewBox="0 0 120 140"
                className="w-full h-full fill-[#98d5f6] stroke-[#1cb0f6] stroke-2 stroke-dasharray-[4,4] transition group-hover:scale-105"
                strokeDasharray="5,5"
              >
                {/* Stylized head & shoulders silhouette */}
                <path d="M60 15 C45 15, 35 25, 33 40 C28 42, 25 48, 26 55 C27 60, 31 64, 35 66 C36 80, 48 90, 60 90 C72 90, 84 80, 85 66 C89 64, 93 60, 94 55 C95 48, 92 42, 87 40 C85 25, 75 15, 60 15 Z M25 105 C15 112, 10 125, 10 140 L110 140 C110 125, 105 112, 95 105 C85 100, 75 96, 60 96 C45 96, 35 100, 25 105 Z" />
              </svg>

              {/* Plus Badge Icon in center */}
              <div className="absolute top-12 w-8 h-8 rounded-full bg-white/90 text-[#1cb0f6] shadow-sm flex items-center justify-center font-black group-hover:bg-white group-hover:scale-110 transition">
                <Plus className="w-5 h-5 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Edit Pencil Button (Top Right) */}
          <button
            onClick={() => setIsAvatarModalOpen(true)}
            aria-label="Edit Profile"
            className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-white/80 hover:bg-white border-2 border-gray-200 flex items-center justify-center text-gray-600 shadow-xs active:scale-95 transition"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        {/* User Identity Header */}
        <div className="pt-1 border-b-2 border-gray-100 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight">
                AVIRAL JAIN
              </h1>
              <div className="text-sm font-bold text-gray-400 mt-0.5">
                AVIRALJAIN51695
              </div>
              <div className="text-sm font-semibold text-gray-400 mt-1">
                Joined October 2026
              </div>

              {/* Following & Followers Links */}
              <div className="flex items-center gap-4 mt-3">
                <button
                  onClick={() => setActiveTab("following")}
                  className="text-sm font-bold text-[#1cb0f6] hover:underline"
                >
                  0 Following
                </button>
                <button
                  onClick={() => setActiveTab("followers")}
                  className="text-sm font-bold text-[#1cb0f6] hover:underline"
                >
                  0 Followers
                </button>
              </div>
            </div>

            {/* Course Flag Indicator (Hindi / India) */}
            <div className="w-9 h-7 rounded-md overflow-hidden border border-gray-200 shadow-xs flex items-center justify-center text-2xl" title="Learning Hindi">
              🇮🇳
            </div>
          </div>
        </div>

        {/* Statistics Section (2x2 Matrix) */}
        <div>
          <h2 className="text-xl font-black text-gray-800 mb-3">Statistics</h2>
          <div className="grid grid-cols-2 gap-3.5">
            {/* Stat 1: Day Streak */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
              <span className="text-3xl shrink-0">🔥</span>
              <div>
                <div className="text-xl font-black text-gray-800">1</div>
                <div className="text-xs font-bold text-gray-400">Day streak</div>
              </div>
            </div>

            {/* Stat 2: Total XP */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-[#ffc800] fill-[#ffc800]" />
              </div>
              <div>
                <div className="text-xl font-black text-gray-800">15</div>
                <div className="text-xs font-bold text-gray-400">Total XP</div>
              </div>
            </div>

            {/* Stat 3: Current League with WEEK 1 badge */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs relative">
              {/* Orange Week 1 Badge in top right */}
              <div className="absolute top-2 right-2 bg-[#ff9600] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                WEEK 1
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-xl border border-amber-300">
                🛡️
              </div>
              <div>
                <div className="text-xl font-black text-gray-800">Bronze</div>
                <div className="text-xs font-bold text-gray-400">Current league</div>
              </div>
            </div>

            {/* Stat 4: Top 3 Finishes */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                <Medal className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <div className="text-xl font-black text-gray-800">0</div>
                <div className="text-xs font-bold text-gray-400">Top 3 finishes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-black text-gray-800">Achievements</h2>
            <button
              onClick={() => showToast("Showing all 15 achievements")}
              className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider hover:underline"
            >
              VIEW ALL
            </button>
          </div>

          <div className="space-y-3">
            {/* Wildfire Achievement */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-3xl shrink-0">
                🔥
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-black text-base text-gray-800">Wildfire</h3>
                  <span className="text-xs font-black text-gray-400">Level 1/10</span>
                </div>
                <p className="text-xs font-bold text-gray-500 mb-2">
                  Reach a 3-day streak
                </p>
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-[#ff9600] h-full rounded-full" style={{ width: "33%" }} />
                </div>
              </div>
            </div>

            {/* Sage Achievement */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shrink-0">
                ⚡
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-black text-base text-gray-800">Sage</h3>
                  <span className="text-xs font-black text-gray-400">Level 1/10</span>
                </div>
                <p className="text-xs font-bold text-gray-500 mb-2">
                  Earn 100 XP
                </p>
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-[#ffc800] h-full rounded-full" style={{ width: "15%" }} />
                </div>
              </div>
            </div>

            {/* Scholar Achievement */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-3xl shrink-0">
                📖
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-black text-base text-gray-800">Scholar</h3>
                  <span className="text-xs font-black text-gray-400">Level 1/10</span>
                </div>
                <p className="text-xs font-bold text-gray-500 mb-2">
                  Learn 50 new words in a single course
                </p>
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-[#1cb0f6] h-full rounded-full" style={{ width: "20%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT STICKY COLUMN: SOCIAL HUB & ADD FRIENDS (Circled Reference in Screenshot) */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        {/* Top Card: Social Hub (Following / Followers Tabs) */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden shadow-xs">
          {/* Tabs Header */}
          <div className="grid grid-cols-2 border-b-2 border-gray-100">
            <button
              onClick={() => setActiveTab("following")}
              className={`py-3.5 text-xs font-black uppercase tracking-wider transition ${
                activeTab === "following"
                  ? "text-[#1cb0f6] border-b-2 border-[#1cb0f6]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              FOLLOWING
            </button>
            <button
              onClick={() => setActiveTab("followers")}
              className={`py-3.5 text-xs font-black uppercase tracking-wider transition ${
                activeTab === "followers"
                  ? "text-[#1cb0f6] border-b-2 border-[#1cb0f6]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              FOLLOWERS
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="p-6 text-center">
            {/* Duolingo Friends Ensemble Illustration */}
            <div className="py-2 mb-3 flex items-center justify-center text-5xl tracking-tight select-none">
              <span className="hover:scale-110 transition inline-block">👧🏽</span>
              <span className="hover:scale-110 transition inline-block -ml-2">👦🏼</span>
              <span className="hover:scale-110 transition inline-block -ml-2 text-6xl">🦉</span>
              <span className="hover:scale-110 transition inline-block -ml-2">🧔🏾</span>
              <span className="hover:scale-110 transition inline-block -ml-2">👩🏻</span>
            </div>

            {/* Motivational Text */}
            <p className="text-sm font-semibold text-gray-500 leading-relaxed px-2">
              {activeTab === "following"
                ? "Learning is more fun and effective when you connect with others."
                : "Share your profile link to connect with study buddies and friends."}
            </p>
          </div>
        </div>

        {/* Bottom Card: Add Friends */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs">
          <h3 className="text-lg font-black text-gray-800 mb-3">Add friends</h3>

          <div className="space-y-2">
            {/* Action 1: Find Friends */}
            <button
              onClick={() => setIsFindFriendsOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 group-hover:scale-105 transition">
                  <Search className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="font-black text-sm text-gray-700">Find friends</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Action 2: Invite Friends */}
            <button
              onClick={handleCopyInvite}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#58cc02] group-hover:scale-105 transition">
                  <Mail className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="font-black text-sm text-gray-700">Invite friends</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </div>

        {/* Footer Legal & Nav Links */}
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

      {/* Find Friends Modal Dialog */}
      {isFindFriendsOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-gray-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-gray-800">Find Friends</h3>
              <button
                onClick={() => setIsFindFriendsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or username"
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-2 border-gray-200 focus:border-[#1cb0f6] outline-none font-bold text-sm"
              />
            </div>
            <div className="text-center py-6 text-gray-400 text-sm font-bold">
              Type a username to start searching for fellow learners!
            </div>
            <button
              onClick={() => setIsFindFriendsOpen(false)}
              className="w-full py-3 rounded-2xl bg-[#1cb0f6] text-white font-black uppercase text-sm border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-1 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Avatar Creator Modal Dialog */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-gray-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-gray-800">Create Your Avatar</h3>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-[#dff2fb] rounded-2xl p-6 flex items-center justify-center mb-5">
              <span className="text-7xl animate-pulse">🧑🏽‍💻</span>
            </div>
            <p className="text-sm font-bold text-gray-600 text-center mb-5">
              Customize your unique hairstyle, glasses, expression, and clothing color to show off to the leaderboard!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  showToast("✨ Avatar updated successfully!");
                  setIsAvatarModalOpen(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-[#58cc02] text-white font-black uppercase text-sm border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition"
              >
                Save Avatar
              </button>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-5 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 font-black uppercase text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
