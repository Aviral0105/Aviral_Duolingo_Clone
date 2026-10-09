"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Zap,
  Shield,
  Medal,
  Pencil,
  Plus,
  Search,
  ChevronRight,
  X,
  Check,
  ArrowLeft,
  UserPlus,
} from "lucide-react";
import { fetchUser, fetchAchievements } from "@/lib/api";
import { User, AchievementItem } from "@/lib/types";
import { getLeagueConfig } from "@/lib/league";
import { sounds } from "@/lib/sounds";
import DuolingoFooterLinks from "@/components/common/DuolingoFooterLinks";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [activeTab, setActiveTab] = useState<"following" | "followers">("following");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSearchFriendsView, setIsSearchFriendsView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mock friends data for interactive search
  const [mockFriends, setMockFriends] = useState([
    { id: 1, name: "Priyanka M.", handle: "@priyanka_m", avatar: "👩🏽", following: false },
    { id: 2, name: "Nitheesh Kumar B", handle: "@nitheesh_k", avatar: "🧑🏾‍🦱", following: false },
    { id: 3, name: "Lucas Dupont", handle: "@lucas_d", avatar: "🧑🏼", following: false },
    { id: 4, name: "Seyit Musevi", handle: "@seyit_m", avatar: "👦🏻", following: false },
    { id: 5, name: "Sara Connor", handle: "@sara_c", avatar: "👩🏼", following: false },
  ]);

  const toggleFollow = (id: number) => {
    sounds.playCorrect();
    setMockFriends((prev) =>
      prev.map((f) => (f.id === id ? { ...f, following: !f.following } : f))
    );
    showToast("Friend list updated!");
  };

  useEffect(() => {
    const loadData = () => {
      fetchUser()
        .then(setUser)
        .catch(() => {});
      fetchAchievements()
        .then((data) => {
          if (data && data.length > 0) setAchievements(data);
        })
        .catch(() => {});
    };
    loadData();
    window.addEventListener("duo_progress_updated", loadData);
    return () => window.removeEventListener("duo_progress_updated", loadData);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyInvite = () => {
    const inviteUrl = "https://invite.duolingo.com/BDHTZTB5CW77A...";
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(inviteUrl);
    }
    sounds.playCorrect();
    setCopiedLink(true);
    showToast("🎉 Invite link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleShareSocial = (platform: string) => {
    sounds.playCorrect();
    const url = encodeURIComponent("https://invite.duolingo.com/BDHTZTB5CW77A...");
    const text = encodeURIComponent("Join me on Duolingo! It's fun and free to learn languages!");
    if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    } else {
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
    }
  };

  const filteredFriends = searchQuery.trim()
    ? mockFriends.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.handle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#58cc02] text-white px-5 py-3 rounded-2xl shadow-xl font-black text-sm flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* CASE A: SEARCH FOR FRIENDS FULL VIEW (Screenshot 3)      */}
      {/* ======================================================== */}
      {isSearchFriendsView ? (
        <>
          {/* Main Search Column */}
          <div className="flex-1 w-full max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSearchFriendsView(false)}
                className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition active:scale-95"
                title="Back to profile"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <h1 className="text-2xl font-black text-gray-800">Search for friends</h1>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 stroke-[2.5]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name or username"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-100 border-2 border-transparent focus:border-[#1cb0f6] focus:bg-white outline-none font-bold text-sm text-gray-800 transition placeholder:text-gray-400 placeholder:font-bold"
                autoFocus
              />
            </div>

            <div className="border-b-2 border-gray-100 pt-2" />

            {/* If searching: show live matching users */}
            {searchQuery.trim() ? (
              <div className="space-y-3 pt-2">
                {filteredFriends.length > 0 ? (
                  filteredFriends.map((f) => (
                    <div
                      key={f.id}
                      className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{f.avatar}</span>
                        <div>
                          <h4 className="font-black text-sm text-gray-800">{f.name}</h4>
                          <p className="text-xs font-bold text-gray-400">{f.handle}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFollow(f.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                          f.following
                            ? "bg-gray-100 text-gray-400 border border-gray-200"
                            : "bg-[#1cb0f6] text-white border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-1"
                        }`}
                      >
                        {f.following ? "Following" : "+ Follow"}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 font-bold text-sm">
                    No users found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            ) : (
              /* Center Illustration and Caption */
              <div className="text-center py-10 px-4">
                <div className="py-2 mb-4 flex items-center justify-center select-none">
                  {/* Duolingo Friends SVG Ensemble */}
                  <svg
                    viewBox="0 0 360 160"
                    className="w-full max-w-[280px] h-auto"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <ellipse cx="180" cy="148" rx="160" ry="8" fill="#f0f0f0" />
                    <g id="zari">
                      <path d="M42 95 C35 110 32 135 32 145 L58 145 C58 135 55 110 48 95 Z" fill="#ff85c0" />
                      <circle cx="42" cy="78" r="14" fill="#d48872" />
                      <circle cx="38" cy="76" r="2" fill="#222" />
                      <circle cx="46" cy="76" r="2" fill="#222" />
                      <path d="M26 70 C26 55 58 55 58 70 C58 85 54 92 42 92 C30 92 26 85 26 70 Z" fill="#f759ab" />
                    </g>
                    <g id="junior">
                      <rect x="98" y="105" width="22" height="40" rx="6" fill="#ff4d4f" />
                      <circle cx="109" cy="88" r="13" fill="#ffe7ba" />
                      <circle cx="105" cy="87" r="3" fill="#222" />
                      <circle cx="113" cy="87" r="3" fill="#222" />
                      <path d="M96 82 L100 70 L106 76 L112 68 L116 75 L122 72 L120 83 Z" fill="#faad14" />
                    </g>
                    <g id="eddy">
                      <rect x="156" y="85" width="26" height="60" rx="8" fill="#f5222d" />
                      <circle cx="166" cy="68" r="2" fill="#222" />
                      <circle cx="174" cy="68" r="2" fill="#222" />
                      <path d="M158 60 C158 50 182 50 182 60 C182 64 178 63 170 63 C162 63 158 64 158 60 Z" fill="#faad14" />
                    </g>
                    <g id="vikram">
                      <rect x="195" y="90" width="28" height="55" rx="8" fill="#13c2c2" />
                      <circle cx="209" cy="74" r="14" fill="#a06235" />
                      <circle cx="204" cy="72" r="2" fill="#111" />
                      <circle cx="214" cy="72" r="2" fill="#111" />
                      <path d="M201 79 C204 76 208 81 209 79 C210 81 214 76 217 79 C215 82 203 82 201 79 Z" fill="#1f1f1f" />
                    </g>
                  </svg>
                </div>
                <p className="text-sm font-bold text-gray-500 leading-relaxed max-w-sm mx-auto">
                  Learning is more fun and effective when you connect with others.
                </p>
              </div>
            )}
          </div>

          {/* Right Column in Search View */}
          <div className="w-full lg:w-80 shrink-0 space-y-5">
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs">
              <h3 className="text-base font-black text-gray-800 mb-3">Other ways to connect</h3>
              <div
                onClick={() => setIsInviteModalOpen(true)}
                className="border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-[#1cb0f6] hover:bg-sky-50/50 transition group"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl shrink-0">💌</div>
                  <div>
                    <h4 className="font-black text-sm text-gray-800 group-hover:text-[#1cb0f6] transition">
                      Invite friends
                    </h4>
                    <p className="text-xs font-bold text-gray-400 leading-snug mt-0.5">
                      Tell your friends it&apos;s free and fun to learn a language on Duolingo!
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ======================================================== */
        /* CASE B: MAIN PROFILE FEED (Screenshots 1 & 2)             */
        /* ======================================================== */
        <>
          <div className="flex-1 w-full max-w-xl mx-auto space-y-6">
            {/* Avatar Hero Card with Pencil Button and Avatar Outline */}
            <div className="relative bg-[#dff2fb] border-2 border-[#bce3f8] rounded-3xl h-60 flex items-center justify-center overflow-hidden shadow-xs">
              {/* Avatar */}
              <div
                onClick={() => setIsAvatarModalOpen(true)}
                className="cursor-pointer group flex flex-col items-center justify-center transition active:scale-95"
              >
                <div className="relative w-32 h-36 flex items-center justify-center">
                  {user?.avatar ? (
                    <div className="w-28 h-28 rounded-full bg-white/90 border-4 border-[#1cb0f6] flex items-center justify-center text-6xl shadow-md group-hover:scale-105 transition select-none">
                      {user.avatar}
                    </div>
                  ) : (
                    <svg
                      viewBox="0 0 120 140"
                      className="w-full h-full fill-[#98d5f6] stroke-[#1cb0f6] stroke-2 transition group-hover:scale-105"
                      strokeDasharray="5,5"
                    >
                      <path d="M60 15 C45 15, 35 25, 33 40 C28 42, 25 48, 26 55 C27 60, 31 64, 35 66 C36 80, 48 90, 60 90 C72 90, 84 80, 85 66 C89 64, 93 60, 94 55 C95 48, 92 42, 87 40 C85 25, 75 15, 60 15 Z M25 105 C15 112, 10 125, 10 140 L110 140 C110 125, 105 112, 95 105 C85 100, 75 96, 60 96 C45 96, 35 100, 25 105 Z" />
                    </svg>
                  )}

                  {/* Plus Badge Icon in corner */}
                  <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white text-[#1cb0f6] border-2 border-[#1cb0f6] shadow-sm flex items-center justify-center font-black group-hover:bg-[#1cb0f6] group-hover:text-white group-hover:scale-110 transition">
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
                    {user?.username?.toUpperCase() || "AVIRAL JAIN"}
                  </h1>
                  <div className="text-sm font-bold text-gray-400 mt-0.5">
                    {user?.handle ? user.handle.toUpperCase() : `@${(user?.username || "aviraljain").toLowerCase().replace(/\s+/g, "")}`}
                  </div>
                  <div className="text-sm font-semibold text-gray-400 mt-1">
                    Joined October 2026
                  </div>

                  {/* Following & Followers Links */}
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => setActiveTab("following")}
                      className={`text-sm font-bold ${
                        activeTab === "following" ? "text-[#1cb0f6] underline" : "text-[#1cb0f6] hover:underline"
                      }`}
                    >
                      0 Following
                    </button>
                    <button
                      onClick={() => setActiveTab("followers")}
                      className={`text-sm font-bold ${
                        activeTab === "followers" ? "text-[#1cb0f6] underline" : "text-[#1cb0f6] hover:underline"
                      }`}
                    >
                      0 Followers
                    </button>
                  </div>
                </div>

                {/* Course Flag Indicator (Hindi / India) */}
                <div
                  className="w-9 h-7 rounded-md overflow-hidden border border-gray-200 shadow-xs flex items-center justify-center text-2xl"
                  title="Learning Hindi"
                >
                  🇮🇳
                </div>
              </div>
            </div>

            {/* Statistics Section (2x2 Matrix matching user screenshot) */}
            <div>
              <h2 className="text-xl font-black text-gray-800 mb-3">Statistics</h2>
              <div className="grid grid-cols-2 gap-3.5">
                {/* Stat 1: Day Streak */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
                  <span className="text-3xl shrink-0">🔥</span>
                  <div>
                    <div className="text-xl font-black text-gray-800">{user?.streak ?? 0}</div>
                    <div className="text-xs font-bold text-gray-400">Day streak</div>
                  </div>
                </div>

                {/* Stat 2: Total XP */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-[#ffc800] fill-[#ffc800]" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-gray-800">{user?.xp ?? 0}</div>
                    <div className="text-xs font-bold text-gray-400">Total XP</div>
                  </div>
                </div>

                {/* Stat 3: Current League with WEEK 1 badge -> Links to /leaderboard */}
                {(() => {
                  const leagueCfg = getLeagueConfig(user?.current_league || "Gold League");
                  return (
                    <Link
                      href="/leaderboard"
                      className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs relative hover:border-[#1cb0f6] transition group"
                    >
                      <div className="absolute top-2 right-2 bg-[#ff9600] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        WEEK 1
                      </div>
                      <div className={`w-10 h-10 rounded-xl ${leagueCfg.bgColor} border ${leagueCfg.borderColor} flex items-center justify-center shrink-0 text-xl group-hover:scale-105 transition`}>
                        {leagueCfg.icon}
                      </div>
                      <div>
                        <div className="text-xl font-black text-gray-800 group-hover:text-[#1cb0f6] transition">
                          {leagueCfg.name.replace(" League", "")}
                        </div>
                        <div className="text-xs font-bold text-gray-400">Current league</div>
                      </div>
                    </Link>
                  );
                })()}

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

            {/* Achievements Section with link to /profile/achievements */}
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
                {(achievements.length > 0 ? achievements.slice(0, 3) : []).map((ach) => {
                  const pct = Math.min(
                    100,
                    Math.max(
                      0,
                      ach.target_value > 0
                        ? Math.round((ach.current_value / ach.target_value) * 100)
                        : 0
                    )
                  );
                  return (
                    <div
                      key={ach.key}
                      className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-4 shadow-xs"
                    >
                      <div className={`w-14 h-14 rounded-2xl ${ach.bg_color || "bg-amber-50"} border border-gray-200 flex items-center justify-center text-3xl shrink-0 shadow-2xs`}>
                        {ach.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-black text-base text-gray-800">{ach.title}</h3>
                          <span className="text-xs font-black text-gray-400">
                            Level {ach.level}/{ach.max_level}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-gray-500 mb-2">{ach.description}</p>
                        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                          <div
                            className="bg-[#ffc800] h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT-HAND COLUMN (Screenshots 1 & 2)                    */}
          {/* ======================================================== */}
          <div className="w-full lg:w-80 shrink-0 space-y-5">
            {/* Top Stats Bar */}
            <div className="flex items-center justify-between px-2 py-1 select-none">
              <div className="flex items-center gap-1.5" title="Course Section 5">
                <span className="text-2xl">🇮🇳</span>
                <span className="font-black text-sm text-gray-700">5</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#ff9600]" title="Streak">
                <span className="text-xl">🔥</span>
                <span className="font-black text-sm">{user?.streak ?? 2}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#1cb0f6]" title="Gems">
                <span className="text-xl">💎</span>
                <span className="font-black text-sm">{user?.gems ?? 155}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#ff4b4b]" title="Hearts">
                <span className="text-xl">❤️</span>
                <span className="font-black text-sm">{user?.hearts ?? 5}</span>
              </div>
            </div>

            {/* Social Hub Card (FOLLOWING / FOLLOWERS Tabs) */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden shadow-xs">
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
                {activeTab === "following" ? (
                  <>
                    {/* Friends Illustration */}
                    <div className="py-2 mb-2 flex items-center justify-center select-none">
                      <svg
                        viewBox="0 0 360 160"
                        className="w-full max-w-[270px] h-auto"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <ellipse cx="180" cy="148" rx="160" ry="8" fill="#f0f0f0" />
                        <g id="zari">
                          <path d="M42 95 C35 110 32 135 32 145 L58 145 C58 135 55 110 48 95 Z" fill="#ff85c0" />
                          <circle cx="42" cy="78" r="14" fill="#d48872" />
                          <circle cx="38" cy="76" r="2" fill="#222" />
                          <circle cx="46" cy="76" r="2" fill="#222" />
                          <path d="M26 70 C26 55 58 55 58 70 C58 85 54 92 42 92 C30 92 26 85 26 70 Z" fill="#f759ab" />
                        </g>
                        <g id="junior">
                          <rect x="98" y="105" width="22" height="40" rx="6" fill="#ff4d4f" />
                          <circle cx="109" cy="88" r="13" fill="#ffe7ba" />
                          <circle cx="105" cy="87" r="3" fill="#222" />
                          <circle cx="113" cy="87" r="3" fill="#222" />
                          <path d="M96 82 L100 70 L106 76 L112 68 L116 75 L122 72 L120 83 Z" fill="#faad14" />
                        </g>
                        <g id="eddy">
                          <rect x="156" y="85" width="26" height="60" rx="8" fill="#f5222d" />
                          <circle cx="166" cy="68" r="2" fill="#222" />
                          <circle cx="174" cy="68" r="2" fill="#222" />
                          <path d="M158 60 C158 50 182 50 182 60 C182 64 178 63 170 63 C162 63 158 64 158 60 Z" fill="#faad14" />
                        </g>
                        <g id="vikram">
                          <rect x="195" y="90" width="28" height="55" rx="8" fill="#13c2c2" />
                          <circle cx="209" cy="74" r="14" fill="#a06235" />
                          <circle cx="204" cy="72" r="2" fill="#111" />
                          <circle cx="214" cy="72" r="2" fill="#111" />
                          <path d="M201 79 C204 76 208 81 209 79 C210 81 214 76 217 79 C215 82 203 82 201 79 Z" fill="#1f1f1f" />
                        </g>
                      </svg>
                    </div>
                    <p className="text-xs font-bold text-gray-500 leading-relaxed px-2">
                      Learning is more fun and effective when you connect with others.
                    </p>
                  </>
                ) : (
                  /* Followers Tab (Screenshot 2: "No followers yet") */
                  <div className="py-8">
                    <p className="text-sm font-bold text-gray-400">No followers yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Add Friends Card */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs">
              <h3 className="text-base font-black text-gray-800 mb-3">Add friends</h3>

              <div className="space-y-1.5">
                {/* Find Friends -> Switches to Search View */}
                <button
                  onClick={() => setIsSearchFriendsView(true)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 group-hover:scale-105 transition">
                      <Search className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="font-black text-sm text-gray-800">Find friends</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-0.5 transition" />
                </button>

                {/* Invite Friends -> Opens Authentic Invite Modal */}
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#58cc02] group-hover:scale-105 transition">
                      <span className="text-2xl">💌</span>
                    </div>
                    <span className="font-black text-sm text-gray-800">Invite friends</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-0.5 transition" />
                </button>
              </div>
            </div>

            {/* Footer Links */}
            <DuolingoFooterLinks align="left" className="px-2" />
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* AUTHENTIC "INVITE FRIENDS" MODAL (Screenshots 4 & 5)      */}
      {/* ======================================================== */}
      {isInviteModalOpen && (
        <div
          onClick={() => setIsInviteModalOpen(false)}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-gray-200 text-center relative animate-scale-up"
          >
            {/* Circular Close Button */}
            <button
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Duo with Yellow Envelope & Sparkles Graphic */}
            <div className="relative flex items-center justify-center my-2">
              <div className="text-7xl select-none animate-bounce">
                🦉✉️
              </div>
            </div>

            <h2 className="text-2xl font-black text-gray-800 mt-2 mb-1.5">
              Invite friends
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-500 max-w-xs mx-auto mb-6 leading-relaxed">
              Tell your friends it&apos;s free and fun to learn a language on Duolingo!
            </p>

            {/* Link Box with COPY LINK Button */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-2 mb-6">
              <span className="text-xs font-bold text-gray-700 truncate select-all">
                https://invite.duolingo.com/BDHTZTB5CW...
              </span>
              <button
                onClick={handleCopyInvite}
                className="shrink-0 text-xs font-black text-[#1cb0f6] uppercase tracking-wider hover:opacity-80 active:scale-95 transition"
              >
                {copiedLink ? "COPIED!" : "COPY LINK"}
              </button>
            </div>

            {/* Or share on... Social Buttons */}
            <div className="text-left mb-2">
              <span className="text-xs font-bold text-gray-400">Or share on...</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleShareSocial("facebook")}
                className="py-3 px-4 rounded-2xl bg-white border-2 border-gray-200 border-b-4 text-xs font-black uppercase text-[#1877f2] tracking-wider hover:bg-blue-50/50 active:border-b-2 active:translate-y-0.5 transition shadow-xs"
              >
                FACEBOOK
              </button>
              <button
                onClick={() => handleShareSocial("twitter")}
                className="py-3 px-4 rounded-2xl bg-white border-2 border-gray-200 border-b-4 text-xs font-black uppercase text-[#1da1f2] tracking-wider hover:bg-sky-50/50 active:border-b-2 active:translate-y-0.5 transition shadow-xs"
              >
                TWITTER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Creator Modal Dialog */}
      {isAvatarModalOpen && (
        <div
          onClick={() => setIsAvatarModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-gray-200 animate-scale-up"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-gray-800">Create Your Avatar</h3>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
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
                  sounds.playVictory();
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
