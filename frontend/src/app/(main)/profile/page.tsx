"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Upload,
  Camera,
  Trash2,
  Share2,
  Sparkles,
} from "lucide-react";
import {
  fetchUser,
  fetchAchievements,
  fetchSocialStats,
  searchUsers,
  toggleFollowUser,
  fetchInviteLink,
  updateUserAvatar,
} from "@/lib/api";
import { User, AchievementItem, SocialStats, UserFriend } from "@/lib/types";
import { getLeagueConfig } from "@/lib/league";
import { sounds } from "@/lib/sounds";
import DuolingoFooterLinks from "@/components/common/DuolingoFooterLinks";
import TopStatsBar from "@/components/navigation/TopStatsBar";

const AVATAR_OPTIONS = [
  "🧑", "🧑🏽‍💻", "👩🏽", "🧑🏾‍🦱", "👦🏻", "👩🏼", "🦉", "🦊",
  "🐻", "🦁", "🐯", "🐼", "🦹", "🧙", "👑", "🚀"
];

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [socialStats, setSocialStats] = useState<SocialStats>({
    following_count: 0,
    followers_count: 0,
    following: [],
    followers: [],
  });
  const [searchResults, setSearchResults] = useState<UserFriend[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<"following" | "followers">("following");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSearchFriendsView, setIsSearchFriendsView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteData, setInviteData] = useState<{ invite_code: string; invite_url: string }>({
    invite_code: "BDHTZTB5CW77A",
    invite_url: "https://invite.duolingo.com/BDHTZTB5CW77A",
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Avatar creation & photo upload state
  const [avatarTab, setAvatarTab] = useState<"emoji" | "photo">("emoji");
  const [selectedAvatar, setSelectedAvatar] = useState<string>("🧑");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = useCallback(() => {
    fetchUser()
      .then((u) => {
        if (u) {
          setUser(u);
          setSelectedAvatar(u.avatar || "🧑");
          setSelectedImage(u.profile_image || null);
        }
      })
      .catch(() => {});

    fetchSocialStats()
      .then(setSocialStats)
      .catch(() => {});

    fetchAchievements()
      .then((data) => {
        if (data && data.length > 0) setAchievements(data);
      })
      .catch(() => {});

    fetchInviteLink()
      .then(setInviteData)
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener("duo_progress_updated", loadData);
    window.addEventListener("duo_social_updated", loadData);
    return () => {
      window.removeEventListener("duo_progress_updated", loadData);
      window.removeEventListener("duo_social_updated", loadData);
    };
  }, [loadData]);

  // Load search results whenever search view or query changes
  useEffect(() => {
    if (isSearchFriendsView || isInviteModalOpen) {
      setIsSearching(true);
      searchUsers(searchQuery)
        .then((results) => {
          setSearchResults(results);
          setIsSearching(false);
        })
        .catch(() => setIsSearching(false));
    }
  }, [searchQuery, isSearchFriendsView, isInviteModalOpen]);

  const handleToggleFollow = async (friendId: number, friendName: string) => {
    sounds.playTap();
    const res = await toggleFollowUser(friendId);
    showToast(res.message || (res.is_following ? `Now following ${friendName}!` : `Unfollowed ${friendName}`));
    const [newStats, newSearch] = await Promise.all([
      fetchSocialStats(),
      searchUsers(searchQuery),
    ]);
    setSocialStats(newStats);
    setSearchResults(newSearch);
  };

  const handleCopyInvite = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(inviteData.invite_url);
    }
    sounds.playCorrect();
    setCopiedLink(true);
    showToast("🎉 Invite link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleShareSocial = (platform: "facebook" | "twitter" | "whatsapp" | "native") => {
    sounds.playCorrect();
    const url = encodeURIComponent(inviteData.invite_url);
    const text = encodeURIComponent(`Join me on Duolingo! Learn languages with me for free! My invite code: ${inviteData.invite_code}`);
    if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
    } else if (platform === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, "_blank");
    } else if (platform === "native" && typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "Duolingo Invite", text: "Join me on Duolingo!", url: inviteData.invite_url }).catch(() => {});
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showToast("⚠️ Image size should be under 3MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSelectedImage(base64);
        sounds.playTap();
        showToast("📸 Photo ready! Click Save Avatar to apply.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyImageUrl = () => {
    if (imageUrlInput.trim()) {
      setSelectedImage(imageUrlInput.trim());
      setImageUrlInput("");
      sounds.playTap();
      showToast("📸 Photo URL added! Click Save Avatar to apply.");
    }
  };

  const handleRemovePhoto = () => {
    setSelectedImage(null);
    sounds.playTap();
    showToast("Photo removed. Emoji avatar active.");
  };

  const handleSaveAvatar = async () => {
    setIsSavingAvatar(true);
    try {
      const updated = await updateUserAvatar({
        avatar: selectedAvatar,
        profile_image: selectedImage,
      });
      setIsSavingAvatar(false);
      if (updated) {
        setUser(updated);
        sounds.playVictory();
        showToast("✨ Avatar & photo saved to database!");
        setIsAvatarModalOpen(false);
      } else {
        // Fallback local update
        setUser((prev) => (prev ? { ...prev, avatar: selectedAvatar, profile_image: selectedImage } : prev));
        sounds.playVictory();
        showToast("✨ Avatar saved locally!");
        setIsAvatarModalOpen(false);
      }
    } catch {
      setIsSavingAvatar(false);
      showToast("Failed to save avatar");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#58cc02] text-white px-5 py-3 rounded-2xl shadow-xl font-black text-sm flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* CASE A: SEARCH FOR FRIENDS FULL VIEW                     */}
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
                placeholder="Name or username in database"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-100 border-2 border-transparent focus:border-[#1cb0f6] focus:bg-white outline-none font-bold text-sm text-gray-800 transition placeholder:text-gray-400 placeholder:font-bold"
                autoFocus
              />
            </div>

            <div className="border-b-2 border-gray-100 pt-2" />

            {/* Live matching users from database */}
            {isSearching ? (
              <div className="text-center py-10 text-gray-400 font-bold text-sm">
                Searching database learners...
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                  Database Learners ({searchResults.length})
                </div>
                {searchResults.map((f) => (
                  <div
                    key={f.id}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-xs hover:border-gray-300 transition"
                  >
                    <div className="flex items-center gap-3">
                      {f.profile_image ? (
                        <img
                          src={f.profile_image}
                          alt={f.username}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl border border-gray-200">
                          {f.avatar}
                        </div>
                      )}
                      <div>
                        <h4 className="font-black text-sm text-gray-800">{f.username}</h4>
                        <p className="text-xs font-bold text-gray-400">{f.handle}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleFollow(f.id, f.username)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                        f.is_following
                          ? "bg-gray-100 text-gray-500 hover:bg-rose-50 hover:text-rose-600 border border-gray-200"
                          : "bg-[#1cb0f6] text-white border-b-4 border-[#1899d6] hover:brightness-105 active:border-b-0 active:translate-y-1"
                      }`}
                    >
                      {f.is_following ? "Following" : "+ Follow"}
                    </button>
                  </div>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <div className="text-center py-12 text-gray-400 font-bold text-sm">
                No users found matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              /* Center Illustration and Caption */
              <div className="text-center py-10 px-4">
                <div className="py-2 mb-4 flex items-center justify-center select-none">
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
          <div className="w-full lg:w-80 shrink-0 space-y-4">
            <TopStatsBar user={user} />
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
                      Share your personal invite link with friends from database and social apps!
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
        /* CASE B: MAIN PROFILE FEED                                 */
        /* ======================================================== */
        <>
          <div className="flex-1 w-full max-w-xl mx-auto space-y-6">
            {/* Avatar Hero Card with Pencil Button */}
            <div className="relative bg-[#dff2fb] border-2 border-[#bce3f8] rounded-3xl h-60 flex items-center justify-center overflow-hidden shadow-xs">
              {/* Avatar / Profile Photo Container */}
              <div
                onClick={() => setIsAvatarModalOpen(true)}
                className="cursor-pointer group flex flex-col items-center justify-center transition active:scale-95"
              >
                <div className="relative w-32 h-36 flex items-center justify-center">
                  {user?.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={user.username}
                      className="w-28 h-28 rounded-full object-cover border-4 border-[#1cb0f6] shadow-md group-hover:scale-105 transition"
                    />
                  ) : user?.avatar ? (
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
                aria-label="Edit Profile Avatar & Photo"
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

                  {/* Following & Followers Live Links (Syncs with backend DB) */}
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => setActiveTab("following")}
                      className={`text-sm font-bold cursor-pointer transition ${
                        activeTab === "following" ? "text-[#1cb0f6] underline" : "text-[#1cb0f6] hover:underline"
                      }`}
                    >
                      {socialStats.following_count} Following
                    </button>
                    <button
                      onClick={() => setActiveTab("followers")}
                      className={`text-sm font-bold cursor-pointer transition ${
                        activeTab === "followers" ? "text-[#1cb0f6] underline" : "text-[#1cb0f6] hover:underline"
                      }`}
                    >
                      {socialStats.followers_count} Followers
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

            {/* Statistics Section (2x2 Matrix) */}
            <div>
              <h2 className="text-xl font-black text-gray-800 mb-3">Statistics</h2>
              <div className="grid grid-cols-2 gap-3.5">
                {/* Stat 1: Day Streak */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
                  <Image src="/streak.svg" width={32} height={32} alt="Streak" className="shrink-0" />
                  <div>
                    <div className="text-xl font-black text-gray-800">{user?.streak ?? 0}</div>
                    <div className="text-xs font-bold text-gray-400">Day streak</div>
                  </div>
                </div>

                {/* Stat 2: Total XP */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 p-1.5">
                    <Image src="/points.svg" width={26} height={26} alt="XP" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-gray-800">{user?.xp ?? 0}</div>
                    <div className="text-xs font-bold text-gray-400">Total XP</div>
                  </div>
                </div>

                {/* Stat 3: Current League with WEEK 1 badge */}
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
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 p-1.5">
                    <Image src="/finish.svg" width={26} height={26} alt="Top 3" />
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
          {/* RIGHT-HAND COLUMN: SOCIAL & FRIENDS HUB                  */}
          {/* ======================================================== */}
          <div className="w-full lg:w-80 shrink-0 space-y-4">
            {/* Top Stats Bar: Course Flag, Streak, Gems, Hearts (Desktop Right Column) */}
            <TopStatsBar user={user} />

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
                  FOLLOWING ({socialStats.following_count})
                </button>
                <button
                  onClick={() => setActiveTab("followers")}
                  className={`py-3.5 text-xs font-black uppercase tracking-wider transition ${
                    activeTab === "followers"
                      ? "text-[#1cb0f6] border-b-2 border-[#1cb0f6]"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  FOLLOWERS ({socialStats.followers_count})
                </button>
              </div>

              {/* Tab Content Body */}
              <div className="p-5 text-center">
                {activeTab === "following" ? (
                  socialStats.following.length > 0 ? (
                    <div className="space-y-3 text-left">
                      {socialStats.following.map((f) => (
                        <div
                          key={f.id}
                          className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-gray-200 transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {f.profile_image ? (
                              <img
                                src={f.profile_image}
                                alt={f.username}
                                className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-2xs shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-2xl border border-gray-200 shrink-0">
                                {f.avatar}
                              </div>
                            )}
                            <div className="min-w-0">
                              <h4 className="font-black text-xs text-gray-800 truncate">{f.username}</h4>
                              <p className="text-[11px] font-bold text-gray-400 truncate">{f.handle}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleFollow(f.id, f.username)}
                            className="px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider bg-gray-100 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition shrink-0 ml-2"
                          >
                            Following
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {/* Friends Empty Illustration */}
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
                      <p className="text-xs font-bold text-gray-500 leading-relaxed px-2 mb-3">
                        Learning is more fun and effective when you connect with others.
                      </p>
                      <button
                        onClick={() => setIsSearchFriendsView(true)}
                        className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider hover:underline"
                      >
                        + Find friends to follow
                      </button>
                    </>
                  )
                ) : (
                  socialStats.followers.length > 0 ? (
                    <div className="space-y-3 text-left">
                      {socialStats.followers.map((f) => (
                        <div
                          key={f.id}
                          className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-gray-200 transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {f.profile_image ? (
                              <img
                                src={f.profile_image}
                                alt={f.username}
                                className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-2xs shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-2xl border border-gray-200 shrink-0">
                                {f.avatar}
                              </div>
                            )}
                            <div className="min-w-0">
                              <h4 className="font-black text-xs text-gray-800 truncate">{f.username}</h4>
                              <p className="text-[11px] font-bold text-gray-400 truncate">{f.handle}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleFollow(f.id, f.username)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition shrink-0 ml-2 ${
                              f.is_following
                                ? "bg-gray-100 text-gray-500 hover:bg-rose-50 hover:text-rose-600"
                                : "bg-[#1cb0f6] text-white hover:bg-[#1899d6]"
                            }`}
                          >
                            {f.is_following ? "Following" : "+ Follow"}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8">
                      <p className="text-sm font-bold text-gray-400">No followers yet</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Add Friends Card */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs">
              <h3 className="text-base font-black text-gray-800 mb-3">Add friends</h3>

              <div className="space-y-1.5">
                {/* Find Friends -> Switches to Live Search View */}
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
            <DuolingoFooterLinks align="left" className="pt-2" />
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* AUTHENTIC "INVITE FRIENDS" MODAL                         */}
      {/* ======================================================== */}
      {isInviteModalOpen && (
        <div
          onClick={() => setIsInviteModalOpen(false)}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-gray-200 text-center relative animate-scale-up max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Duo with Yellow Envelope Graphic */}
            <div className="relative flex items-center justify-center my-2">
              <div className="text-6xl select-none animate-bounce">
                🦉✉️
              </div>
            </div>

            <h2 className="text-2xl font-black text-gray-800 mt-2 mb-1.5">
              Invite friends
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-500 max-w-xs mx-auto mb-5 leading-relaxed">
              Tell your friends it&apos;s free and fun to learn a language on Duolingo!
            </p>

            {/* Link Box with COPY LINK Button */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-2 mb-5">
              <span className="text-xs font-bold text-gray-700 truncate select-all text-left">
                {inviteData.invite_url}
              </span>
              <button
                onClick={handleCopyInvite}
                className="shrink-0 text-xs font-black text-[#1cb0f6] uppercase tracking-wider hover:opacity-80 active:scale-95 transition"
              >
                {copiedLink ? "COPIED!" : "COPY LINK"}
              </button>
            </div>

            {/* Social Share Grid */}
            <div className="text-left mb-2">
              <span className="text-xs font-bold text-gray-400">Share with friends:</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              <button
                onClick={() => handleShareSocial("whatsapp")}
                className="py-2.5 px-3 rounded-2xl bg-[#25d366]/10 text-[#25d366] border border-[#25d366]/30 text-xs font-black uppercase tracking-wider hover:bg-[#25d366]/20 transition flex items-center justify-center gap-1.5"
              >
                <span>💬</span> WhatsApp
              </button>
              <button
                onClick={() => handleShareSocial("facebook")}
                className="py-2.5 px-3 rounded-2xl bg-[#1877f2]/10 text-[#1877f2] border border-[#1877f2]/30 text-xs font-black uppercase tracking-wider hover:bg-[#1877f2]/20 transition flex items-center justify-center gap-1.5"
              >
                <span>📘</span> Facebook
              </button>
              <button
                onClick={() => handleShareSocial("twitter")}
                className="py-2.5 px-3 rounded-2xl bg-[#1da1f2]/10 text-[#1da1f2] border border-[#1da1f2]/30 text-xs font-black uppercase tracking-wider hover:bg-[#1da1f2]/20 transition flex items-center justify-center gap-1.5"
              >
                <span>🐦</span> Twitter
              </button>
            </div>

            {/* Direct Database Learners Quick Connect */}
            <div className="border-t-2 border-gray-100 pt-4 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                  Connect with Database Learners
                </span>
                <span className="text-[11px] font-bold text-[#1cb0f6]">
                  {searchResults.length} available
                </span>
              </div>
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {searchResults.slice(0, 5).map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {u.profile_image ? (
                        <img
                          src={u.profile_image}
                          alt={u.username}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <span className="text-xl shrink-0">{u.avatar}</span>
                      )}
                      <div className="min-w-0">
                        <div className="font-black text-xs text-gray-800 truncate">{u.username}</div>
                        <div className="text-[10px] font-bold text-gray-400 truncate">{u.handle}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleFollow(u.id, u.username)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition shrink-0 ${
                        u.is_following
                          ? "bg-gray-200 text-gray-600"
                          : "bg-[#1cb0f6] text-white hover:bg-[#1899d6]"
                      }`}
                    >
                      {u.is_following ? "Following" : "+ Follow"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* "CREATE YOUR AVATAR & UPLOAD PHOTO" MODAL                */}
      {/* ======================================================== */}
      {isAvatarModalOpen && (
        <div
          onClick={() => setIsAvatarModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-gray-200 animate-scale-up max-h-[92vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ffc800]" />
                <h3 className="text-xl font-black text-gray-800">Create Your Avatar</h3>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Live Profile Avatar Preview Card */}
            <div className="bg-[#dff2fb] border-2 border-[#bce3f8] rounded-3xl p-5 flex flex-col items-center justify-center mb-5 text-center shadow-inner">
              <div className="relative mb-2">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#1cb0f6] shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white/95 border-4 border-[#1cb0f6] flex items-center justify-center text-5xl shadow-lg select-none">
                    {selectedAvatar}
                  </div>
                )}
                {selectedImage && (
                  <button
                    onClick={handleRemovePhoto}
                    title="Remove custom photo and use emoji"
                    className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md hover:bg-rose-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="font-black text-base text-gray-800">
                {user?.username || "Your Learner Profile"}
              </div>
              <div className="text-xs font-bold text-[#1cb0f6]">
                {selectedImage ? "Custom Profile Photo Active" : `Avatar: ${selectedAvatar}`}
              </div>
            </div>

            {/* Tabs: Choose Avatar vs Upload Photo */}
            <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => setAvatarTab("emoji")}
                className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl transition ${
                  avatarTab === "emoji"
                    ? "bg-white text-[#1cb0f6] shadow-xs"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                🎨 Choose Avatar
              </button>
              <button
                type="button"
                onClick={() => setAvatarTab("photo")}
                className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl transition ${
                  avatarTab === "photo"
                    ? "bg-white text-[#1cb0f6] shadow-xs"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                📷 Upload Photo
              </button>
            </div>

            {/* TAB 1: EMOJI / AVATAR PALETTE */}
            {avatarTab === "emoji" ? (
              <div className="space-y-4 mb-6">
                <div className="text-xs font-black uppercase tracking-wider text-gray-400">
                  Select your character style:
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                  {AVATAR_OPTIONS.map((av) => {
                    const isSelected = selectedAvatar === av && !selectedImage;
                    return (
                      <button
                        key={av}
                        type="button"
                        onClick={() => {
                          setSelectedAvatar(av);
                          setSelectedImage(null);
                          sounds.playTap();
                        }}
                        className={`h-12 rounded-2xl text-2xl flex items-center justify-center transition border-2 ${
                          isSelected
                            ? "bg-sky-50 border-[#1cb0f6] scale-105 shadow-xs"
                            : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {av}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs font-bold text-gray-400 text-center">
                  Pick an avatar icon to show off on the weekly leaderboard rankings!
                </p>
              </div>
            ) : (
              /* TAB 2: UPLOAD CUSTOM PHOTO / URL */
              <div className="space-y-4 mb-6">
                {/* File Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-[#1cb0f6] bg-sky-50/60 rounded-2xl flex flex-col items-center justify-center gap-1.5 hover:bg-sky-50 transition cursor-pointer group"
                >
                  <Upload className="w-6 h-6 text-[#1cb0f6] group-hover:scale-110 transition" />
                  <span className="font-black text-xs text-[#1cb0f6] uppercase tracking-wider">
                    Upload from Device (PNG, JPG, WebP)
                  </span>
                  <span className="text-[11px] font-bold text-gray-400">
                    Max size 3MB
                  </span>
                </button>

                {/* Or Paste Image URL */}
                <div className="pt-2">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-400 block mb-2">
                    Or paste Image URL:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://example.com/my-photo.jpg"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-gray-200 text-xs font-bold text-gray-800 outline-none focus:border-[#1cb0f6]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyImageUrl}
                      className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-black uppercase text-gray-700 transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex gap-3 pt-3 border-t-2 border-gray-100">
              <button
                type="button"
                disabled={isSavingAvatar}
                onClick={handleSaveAvatar}
                className="flex-1 py-3.5 rounded-2xl bg-[#58cc02] text-white font-black uppercase text-sm border-b-4 border-[#46a302] hover:brightness-105 active:border-b-0 active:translate-y-1 transition disabled:opacity-50"
              >
                {isSavingAvatar ? "Saving..." : "Save Avatar"}
              </button>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-5 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-500 font-black uppercase text-sm hover:bg-gray-50 transition"
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
