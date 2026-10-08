"use client";

import { useState } from "react";
import Link from "next/link";
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
            <Link
              href="/profile/achievements"
              className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider hover:underline"
            >
              VIEW ALL
            </Link>
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
            {/* Duolingo Friends Ensemble Vector Illustration (Matching Screenshot) */}
            <div className="py-2 mb-2 flex items-center justify-center select-none">
              <svg
                viewBox="0 0 360 160"
                className="w-full max-w-[290px] h-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Shadow / Baseline */}
                <ellipse cx="180" cy="148" rx="160" ry="8" fill="#f0f0f0" />

                {/* 1. ZARI (Far Left - Pink Outfit & Hijab) */}
                <g id="zari">
                  <path d="M42 95 C35 110 32 135 32 145 L58 145 C58 135 55 110 48 95 Z" fill="#ff85c0" />
                  <path d="M28 85 C28 115 56 115 56 85 C56 65 28 65 28 85 Z" fill="#f759ab" />
                  <circle cx="42" cy="78" r="14" fill="#d48872" />
                  <circle cx="38" cy="76" r="2" fill="#222" />
                  <circle cx="46" cy="76" r="2" fill="#222" />
                  <path d="M40 82 Q42 85 44 82" stroke="#222" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Hijab wrap */}
                  <path d="M26 70 C26 55 58 55 58 70 C58 85 54 92 42 92 C30 92 26 85 26 70 Z" fill="#f759ab" />
                </g>

                {/* 2. LILY (Purple Hair & Lilac Hoodie) */}
                <g id="lily">
                  <path d="M72 100 C68 115 65 135 65 145 L88 145 C88 135 85 115 82 100 Z" fill="#9254de" />
                  <rect x="68" y="90" width="18" height="25" rx="6" fill="#b37feb" />
                  <circle cx="77" cy="74" r="13" fill="#ffd8bf" />
                  {/* Purple Bob Hair */}
                  <path d="M63 68 C63 52 91 52 91 68 C91 82 89 86 87 86 C85 80 83 74 77 74 C71 74 69 80 67 86 C65 86 63 82 63 68 Z" fill="#722ed1" />
                  {/* Bored eyes */}
                  <line x1="72" y1="74" x2="76" y2="74" stroke="#222" strokeWidth="2" strokeLinecap="round" />
                  <line x1="80" y1="74" x2="84" y2="74" stroke="#222" strokeWidth="2" strokeLinecap="round" />
                  <line x1="75" y1="80" x2="79" y2="80" stroke="#222" strokeWidth="1.5" />
                </g>

                {/* 3. JUNIOR (Small boy with spiky yellow hair & red hoodie) */}
                <g id="junior">
                  <rect x="98" y="105" width="22" height="40" rx="6" fill="#ff4d4f" />
                  <circle cx="109" cy="88" r="13" fill="#ffe7ba" />
                  {/* Big round excited eyes */}
                  <circle cx="105" cy="87" r="3" fill="#222" />
                  <circle cx="113" cy="87" r="3" fill="#222" />
                  <circle cx="106" cy="86" r="1" fill="#fff" />
                  <circle cx="114" cy="86" r="1" fill="#fff" />
                  <path d="M106 94 Q109 97 112 94" stroke="#222" strokeWidth="1.5" fill="#ff4d4f" />
                  {/* Spiky blonde hair */}
                  <path d="M96 82 L100 70 L106 76 L112 68 L116 75 L122 72 L120 83 Z" fill="#faad14" />
                </g>

                {/* 4. BEA (Brown afro puffs, mustard top) */}
                <g id="bea">
                  {/* Afro hair */}
                  <circle cx="132" cy="72" r="18" fill="#3f1e09" />
                  <rect x="122" y="98" width="22" height="47" rx="6" fill="#fa8c16" />
                  <circle cx="133" cy="84" r="12" fill="#874d00" />
                  <circle cx="129" cy="83" r="2" fill="#222" />
                  <circle cx="137" cy="83" r="2" fill="#222" />
                  <path d="M130 90 Q133 93 136 90" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                </g>

                {/* 5. EDDY (Tall, athletic, orange/red track top, blonde hair) */}
                <g id="eddy">
                  <rect x="156" y="85" width="26" height="60" rx="8" fill="#f5222d" />
                  <rect x="162" y="60" width="16" height="26" rx="8" fill="#ffbb96" />
                  <circle cx="166" cy="68" r="2" fill="#222" />
                  <circle cx="174" cy="68" r="2" fill="#222" />
                  <path d="M167 75 Q170 77 173 75" stroke="#222" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Athletic blonde hair */}
                  <path d="M158 60 C158 50 182 50 182 60 C182 64 178 63 170 63 C162 63 158 64 158 60 Z" fill="#faad14" />
                </g>

                {/* 6. DUO THE OWL (Peeking front & center) */}
                <g id="duo-mascot">
                  <ellipse cx="180" cy="130" rx="18" ry="16" fill="#58cc02" />
                  {/* Big Owl Eyes */}
                  <circle cx="173" cy="126" r="6" fill="#fff" />
                  <circle cx="187" cy="126" r="6" fill="#fff" />
                  <circle cx="174" cy="126" r="3" fill="#222" />
                  <circle cx="186" cy="126" r="3" fill="#222" />
                  {/* Orange Beak */}
                  <polygon points="177,129 183,129 180,135" fill="#ff9600" />
                  {/* Orange feet */}
                  <ellipse cx="174" cy="145" rx="4" ry="2" fill="#ff9600" />
                  <ellipse cx="186" cy="145" rx="4" ry="2" fill="#ff9600" />
                </g>

                {/* 7. VIKRAM (Teal shirt, mustache, stylish hair) */}
                <g id="vikram">
                  <rect x="195" y="90" width="28" height="55" rx="8" fill="#13c2c2" />
                  <circle cx="209" cy="74" r="14" fill="#a06235" />
                  {/* Black neat hair */}
                  <path d="M195 72 C195 56 223 56 223 72 C223 68 217 64 209 64 C201 64 195 68 195 72 Z" fill="#1f1f1f" />
                  <circle cx="204" cy="72" r="2" fill="#111" />
                  <circle cx="214" cy="72" r="2" fill="#111" />
                  {/* Big friendly mustache */}
                  <path d="M201 79 C204 76 208 81 209 79 C210 81 214 76 217 79 C215 82 203 82 201 79 Z" fill="#1f1f1f" />
                </g>

                {/* 8. OSCAR (Turtleneck, artful mustache, glasses) */}
                <g id="oscar">
                  <rect x="232" y="85" width="28" height="60" rx="8" fill="#873800" />
                  <circle cx="246" cy="66" r="14" fill="#ffd8bf" />
                  <circle cx="242" cy="65" r="2" fill="#222" />
                  <circle cx="250" cy="65" r="2" fill="#222" />
                  {/* Thin artful mustache */}
                  <path d="M239 72 Q246 70 253 72" stroke="#222" strokeWidth="2" strokeLinecap="round" />
                  {/* Sleek black hair */}
                  <path d="M232 64 C232 50 260 50 260 64 Z" fill="#262626" />
                </g>

                {/* 9. LUCY (Elderly lady, gray hair bun, spectacles, yellow cardigan) */}
                <g id="lucy">
                  {/* Gray Hair Bun */}
                  <circle cx="282" cy="52" r="9" fill="#bfbfbf" />
                  <rect x="268" y="88" width="28" height="57" rx="8" fill="#faad14" />
                  <circle cx="282" cy="72" r="14" fill="#ffe7ba" />
                  {/* Gray parted hair */}
                  <path d="M268 70 C268 56 296 56 296 70 C296 66 288 62 282 62 C276 62 268 66 268 70 Z" fill="#bfbfbf" />
                  {/* Glasses */}
                  <circle cx="277" cy="71" r="4" stroke="#595959" strokeWidth="1.5" fill="none" />
                  <circle cx="287" cy="71" r="4" stroke="#595959" strokeWidth="1.5" fill="none" />
                  <line x1="281" y1="71" x2="283" y2="71" stroke="#595959" strokeWidth="1.5" />
                  {/* Gentle smile */}
                  <path d="M279 80 Q282 82 285 80" stroke="#222" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              </svg>
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
