"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  Eye,
  EyeOff,
  Pencil,
  ChevronDown,
  Dumbbell,
  Infinity,
  Ban,
  Trophy,
  Heart,
} from "lucide-react";
import { fetchUserSettings, updateUserSettings, fetchUser, resetUserProgress } from "@/lib/api";
import { User } from "@/lib/types";
import { sounds } from "@/lib/sounds";

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        onChange();
        sounds.playTap();
      }}
      className={`w-12 h-6.5 rounded-full p-1 transition-colors shrink-0 ${
        checked ? "bg-[#1cb0f6]" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transition-transform ${
          checked ? "translate-x-5.5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "account";

  const [activeTab, setActiveTab] = useState<
    | "account"
    | "preferences"
    | "profile"
    | "notifications"
    | "courses"
    | "schools"
    | "social"
    | "privacy"
    | "subscription"
    | "support"
  >(initialTab as any);

  // Profile / Account State (Images 1 & 2)
  const [name, setName] = useState("AVIRAL JAIN");
  const [username, setUsername] = useState("AVIRALJAIN51695");
  const [email, setEmail] = useState("ajain10_be23@thapar.edu");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Preferences State (Image 3)
  const [soundEffects, setSoundEffects] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [motivationalMessages, setMotivationalMessages] = useState(true);
  const [listeningExercises, setListeningExercises] = useState(true);
  const [darkMode, setDarkMode] = useState<"system" | "on" | "off">("system");

  // Notifications State
  const [notifProduct, setNotifProduct] = useState(true);
  const [notifFollower, setNotifFollower] = useState(true);
  const [notifFriend, setNotifFriend] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [notifPromotions, setNotifPromotions] = useState(true);
  const [notifResearch, setNotifResearch] = useState(true);
  const [notifDailyReminder, setNotifDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState("5PM");

  // Privacy State (Image 1 from user)
  const [publicProfile, setPublicProfile] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(true);
  const [friendStreaks, setFriendStreaks] = useState(true);

  // Duolingo for Schools State
  const [schoolCode, setSchoolCode] = useState("");
  const [schoolSuccess, setSchoolSuccess] = useState<string | null>(null);

  // Modals & Feedback
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<"delete" | "logout" | "resetCourse" | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [settingsData, userData] = await Promise.all([
        fetchUserSettings(),
        fetchUser(),
      ]);

      if (userData) {
        setCurrentUser(userData);
        if (userData.username) setUsername(userData.username);
      }

      if (settingsData) {
        if (settingsData.sound_effects !== undefined) setSoundEffects(settingsData.sound_effects);
        if (settingsData.animations !== undefined) setAnimations(settingsData.animations);
        if (settingsData.motivational_messages !== undefined) setMotivationalMessages(settingsData.motivational_messages);
        if (settingsData.listening_exercises !== undefined) setListeningExercises(settingsData.listening_exercises);
        if (settingsData.dark_mode) setDarkMode(settingsData.dark_mode);
      }

      if (typeof window !== "undefined") {
        const storedTheme = localStorage.getItem("duo_theme") as any;
        if (storedTheme) {
          setDarkMode(storedTheme);
          applyTheme(storedTheme);
        }
      }
    }
    loadData();
  }, []);

  const applyTheme = (mode: "system" | "on" | "off") => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    if (mode === "on") {
      root.classList.add("dark");
      localStorage.setItem("duo_theme", "dark");
    } else if (mode === "off") {
      root.classList.remove("dark");
      localStorage.setItem("duo_theme", "light");
    } else {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isSystemDark) root.classList.add("dark");
      else root.classList.remove("dark");
      localStorage.setItem("duo_theme", "system");
    }
  };

  const handleDarkModeChange = (mode: "system" | "on" | "off") => {
    setDarkMode(mode);
    applyTheme(mode);
    sounds.playTap();
  };

  const handleSave = async () => {
    sounds.playCorrect();
    if (typeof window !== "undefined") {
      localStorage.setItem("duo_name", name);
      localStorage.setItem("duo_username", username);
      localStorage.setItem("duo_email", email);
    }
    await updateUserSettings({
      sound_effects: soundEffects,
      animations: animations,
      motivational_messages: motivationalMessages,
      listening_exercises: listeningExercises,
      dark_mode: darkMode,
    });
    setSavedToast("Changes saved successfully! ✨");
    setTimeout(() => setSavedToast(null), 3000);
  };

  const handleExportData = () => {
    sounds.playTap();
    const data = {
      user: { name, username, email },
      settings: { soundEffects, animations, motivationalMessages, listeningExercises, darkMode },
      privacy: { publicProfile, personalizedAds, friendStreaks },
      notifications: { notifProduct, notifFollower, notifFriend, notifWeekly, notifPromotions, notifResearch, notifDailyReminder, reminderTime },
      course: "Hindi (हिन्दी)",
      streak: 3,
      gems: 1500,
      hearts: 5,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "duolingo_user_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolCode.trim()) return;
    sounds.playVictory();
    setSchoolSuccess(`Joined classroom "${schoolCode.toUpperCase()}"!`);
    setTimeout(() => setSchoolSuccess(null), 4000);
    setSchoolCode("");
  };

  const handleLogout = () => {
    try {
      localStorage.clear();
    } catch {}
    router.push("/welcome");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 select-none items-start pb-20 pt-4">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#58cc02] text-white px-5 py-3 rounded-2xl shadow-xl font-black text-sm flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5 stroke-[3]" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* LEFT / CENTER FEED: CONTENT ACCORDING TO USER IMAGES     */}
      {/* ======================================================== */}
      <div className="flex-1 w-full max-w-xl mx-auto space-y-6">
        {/* ====================================================== */}
        {/* TAB 1: PROFILE / ACCOUNT (Images 1 & 2 from user)      */}
        {/* ====================================================== */}
        {(activeTab === "account" || activeTab === "profile") && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">
              Profile
            </h1>

            {/* Avatar Section matching Image 1 */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Avatar</label>
              <div className="relative w-20 h-20 rounded-full border-2 border-[#1cb0f6] flex items-center justify-center bg-gray-50/50 overflow-hidden shadow-xs">
                {currentUser?.profile_image ? (
                  <img src={currentUser.profile_image} alt="Avatar" className="w-full h-full object-cover" />
                ) : currentUser?.avatar ? (
                  <span className="text-3xl">{currentUser.avatar}</span>
                ) : (
                  <span className="text-3xl font-black text-gray-400">A</span>
                )}
                <button
                  onClick={() => router.push("/profile")}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#1cb0f6] text-white flex items-center justify-center shadow-sm hover:brightness-110 active:scale-95 transition"
                  title="Edit Avatar & Photo"
                >
                  <Pencil className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3.5 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-[#1cb0f6] bg-[#f7f7f7] transition"
              />
            </div>

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3.5 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-[#1cb0f6] bg-[#f7f7f7] transition"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3.5 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-[#1cb0f6] bg-[#f7f7f7] transition"
              />
            </div>

            {/* Current Password Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-700">Current password</label>
              <div className="relative">
                <input
                  type={showCurrentPw ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3.5 pr-11 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-[#1cb0f6] bg-[#f7f7f7] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1cb0f6] hover:opacity-80"
                >
                  {showCurrentPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-700">New password</label>
              <div className="relative">
                <input
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3.5 pr-11 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-[#1cb0f6] bg-[#f7f7f7] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1cb0f6] hover:opacity-80"
                >
                  {showNewPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Save Changes Button matching Image 2 */}
            <div className="pt-2">
              <button
                onClick={handleSave}
                className="py-3 px-6 rounded-2xl bg-gray-200 text-gray-400 font-black text-xs uppercase tracking-wider hover:bg-[#58cc02] hover:text-white transition active:scale-95 shadow-xs"
              >
                SAVE CHANGES
              </button>
            </div>

            {/* Export and Delete links matching Image 2 */}
            <div className="pt-4 space-y-2 text-xs font-black uppercase tracking-wider">
              <div>
                <button
                  onClick={handleExportData}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  EXPORT MY DATA
                </button>
              </div>
              <div>
                <button
                  onClick={() => setActiveModal("delete")}
                  className="text-[#ff4b4b] hover:underline transition"
                >
                  DELETE MY ACCOUNT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================== */}
        {/* TAB 2: PREFERENCES (Image 3 from user)                 */}
        {/* ====================================================== */}
        {activeTab === "preferences" && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">
              Preferences
            </h1>

            {/* Lesson Experience Section matching Image 3 */}
            <div className="space-y-4">
              <h2 className="text-base font-black text-gray-800">Lesson experience</h2>

              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-bold text-gray-800">Sound effects</span>
                <ToggleSwitch
                  checked={soundEffects}
                  onChange={() => setSoundEffects(!soundEffects)}
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-bold text-gray-800">Animations</span>
                <ToggleSwitch
                  checked={animations}
                  onChange={() => setAnimations(!animations)}
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-bold text-gray-800">Motivational messages</span>
                <ToggleSwitch
                  checked={motivationalMessages}
                  onChange={() => setMotivationalMessages(!motivationalMessages)}
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-bold text-gray-800">Listening exercises</span>
                <ToggleSwitch
                  checked={listeningExercises}
                  onChange={() => setListeningExercises(!listeningExercises)}
                />
              </div>
            </div>

            {/* Appearance Section matching Image 3 */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-base font-black text-gray-800">Appearance</h2>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Dark mode</label>
                <div className="relative max-w-sm">
                  <select
                    value={darkMode}
                    onChange={(e) => handleDarkModeChange(e.target.value as any)}
                    className="w-full p-3.5 pr-10 rounded-2xl border-2 border-gray-200 text-xs font-black uppercase text-gray-800 bg-[#f7f7f7] outline-none appearance-none focus:border-[#1cb0f6] cursor-pointer"
                  >
                    <option value="system">System Default</option>
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================== */}
        {/* TAB 3: PRIVACY SETTINGS (Image 1 from user)            */}
        {/* ====================================================== */}
        {activeTab === "privacy" && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">
              Privacy settings
            </h1>

            <div className="space-y-5">
              {/* Make my profile public */}
              <div className="flex items-start justify-between gap-6 py-2">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-800">Make my profile public</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-normal">
                    Allow others to find your profile and follow you. Allows you to follow others. Enrolls you in public leaderboards.
                  </p>
                </div>
                <ToggleSwitch
                  checked={publicProfile}
                  onChange={() => setPublicProfile(!publicProfile)}
                />
              </div>

              {/* Personalized ads */}
              <div className="flex items-start justify-between gap-6 py-2">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-800">Personalized ads</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-normal">
                    Tracking and personalization for advertising
                  </p>
                </div>
                <ToggleSwitch
                  checked={personalizedAds}
                  onChange={() => setPersonalizedAds(!personalizedAds)}
                />
              </div>

              {/* Friend Streaks */}
              <div className="flex items-center justify-between gap-6 py-2">
                <h3 className="text-sm font-bold text-gray-800">Friend Streaks</h3>
                <ToggleSwitch
                  checked={friendStreaks}
                  onChange={() => setFriendStreaks(!friendStreaks)}
                />
              </div>

              {/* Save Changes button matching Image 1 */}
              <div className="pt-4">
                <button
                  onClick={handleSave}
                  className="py-3 px-6 rounded-2xl bg-gray-200 text-gray-400 font-black text-xs uppercase tracking-wider hover:bg-[#58cc02] hover:text-white transition active:scale-95 shadow-xs"
                >
                  SAVE CHANGES
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================== */}
        {/* TAB 4: CHOOSE A PLAN (Subscription) (Images 2 & 4)      */}
        {/* ====================================================== */}
        {activeTab === "subscription" && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">
              Choose a plan
            </h1>

            {/* Glowing Super Banner matching Image 2 & 4 */}
            <div className="rounded-3xl p-6 text-white relative overflow-hidden shadow-lg bg-gradient-to-r from-[#141539] via-[#1c1c5a] to-[#2b1055]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Super Duo Mascot Avatar */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-pink-500 flex items-center justify-center text-3xl shadow-md shrink-0">
                    🦉
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black leading-tight text-white">
                    Get started with a 1 month free trial on Super
                  </h2>
                </div>
                <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-pink-400 text-white font-black text-[11px] px-2.5 py-1 rounded-md italic uppercase tracking-wider shrink-0">
                  SUPER
                </span>
              </div>

              <button
                onClick={() => {
                  sounds.playVictory();
                  setSavedToast("Super Duolingo free trial activated! 🌟");
                  setTimeout(() => setSavedToast(null), 3000);
                }}
                className="w-full mt-6 py-3.5 rounded-2xl bg-white text-gray-900 font-black text-xs uppercase tracking-wider shadow-sm hover:bg-gray-100 active:scale-95 transition"
              >
                START MY FREE MONTH
              </button>
            </div>

            {/* Benefits List matching Image 2 & 4 */}
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-800">
                What you&apos;ll get with Super Duolingo
              </h2>

              <div className="bg-white border border-gray-200 rounded-3xl divide-y divide-gray-100 overflow-hidden shadow-xs">
                {/* 1. Personalized Practice */}
                <div className="flex items-center gap-4 p-5 hover:bg-gray-50/50 transition">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Dumbbell className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="font-bold text-base text-gray-800">
                    Personalized Practice
                  </span>
                </div>

                {/* 2. Unlimited Hearts */}
                <div className="flex items-center gap-4 p-5 hover:bg-gray-50/50 transition">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Infinity className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="font-bold text-base text-gray-800">
                    Unlimited Hearts
                  </span>
                </div>

                {/* 3. No ads */}
                <div className="flex items-center gap-4 p-5 hover:bg-gray-50/50 transition">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-400 to-sky-400 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Ban className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="font-bold text-base text-gray-800">
                    No ads
                  </span>
                </div>

                {/* 4. Free entry to Legendary challenges */}
                <div className="flex items-center gap-4 p-5 hover:bg-gray-50/50 transition">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Trophy className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="font-bold text-base text-gray-800">
                    Free entry to Legendary challenges
                  </span>
                </div>

                {/* 5. Support our mission */}
                <div className="flex items-center gap-4 p-5 hover:bg-gray-50/50 transition">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-400 to-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Heart className="w-6 h-6 stroke-[2.5] fill-white" />
                  </div>
                  <span className="font-bold text-base text-gray-800">
                    Support our mission to keep education free for millions
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================== */}
        {/* TAB 5: NOTIFICATIONS                                   */}
        {/* ====================================================== */}
        {activeTab === "notifications" && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">
              Notifications
            </h1>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h2 className="text-base font-black text-gray-800">General</h2>
                <span className="text-xs font-bold text-gray-500">Email</span>
              </div>

              {[
                { label: "Product updates + learning tips", val: notifProduct, setVal: setNotifProduct },
                { label: "New follower", val: notifFollower, setVal: setNotifFollower },
                { label: "Friend activity", val: notifFriend, setVal: setNotifFriend },
                { label: "Weekly progress", val: notifWeekly, setVal: setNotifWeekly },
                { label: "Special promotions", val: notifPromotions, setVal: setNotifPromotions },
                { label: "Research participation opportunities", val: notifResearch, setVal: setNotifResearch },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5">
                  <span className="text-sm font-bold text-gray-800">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => {
                      item.setVal(!item.val);
                      sounds.playTap();
                    }}
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                      item.val ? "bg-[#1cb0f6] text-white" : "border-2 border-gray-300 bg-white"
                    }`}
                  >
                    {item.val && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h2 className="text-base font-black text-gray-800">Daily reminders</h2>
                <span className="text-xs font-bold text-gray-500">Email</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm font-bold text-gray-800">Practice reminder</span>
                <button
                  type="button"
                  onClick={() => {
                    setNotifDailyReminder(!notifDailyReminder);
                    sounds.playTap();
                  }}
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                    notifDailyReminder ? "bg-[#1cb0f6] text-white" : "border-2 border-gray-300 bg-white"
                  }`}
                >
                  {notifDailyReminder && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              </div>

              <div className="relative pt-1 max-w-[200px]">
                <select
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full p-3 rounded-2xl border-2 border-gray-200 text-xs font-black text-gray-800 bg-[#f7f7f7] outline-none appearance-none focus:border-[#1cb0f6] cursor-pointer"
                >
                  <option value="8AM">8AM</option>
                  <option value="12PM">12PM</option>
                  <option value="5PM">5PM</option>
                  <option value="7PM">7PM</option>
                  <option value="9PM">9PM</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* ====================================================== */}
        {/* TAB 6: COURSES                                         */}
        {/* ====================================================== */}
        {activeTab === "courses" && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">
              Courses
            </h1>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇮🇳</span>
                <span className="text-base font-bold text-gray-800">Hindi</span>
              </div>
              <button
                onClick={() => setActiveModal("resetCourse")}
                className="text-xs font-black uppercase tracking-wider text-[#ff4b4b] hover:opacity-80 transition"
              >
                RESET
              </button>
            </div>
          </div>
        )}

        {/* ====================================================== */}
        {/* TAB 7: DUOLINGO FOR SCHOOLS                            */}
        {/* ====================================================== */}
        {activeTab === "schools" && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">
              Duolingo for Schools
            </h1>

            <div className="space-y-2 border-b border-gray-200 pb-4">
              <h2 className="text-base font-black text-gray-800">Join a classroom</h2>
              <p className="text-xs font-bold text-gray-500 leading-relaxed">
                Enter the 6-letter code you received from your teacher. Once you join, they&apos;ll be able to follow your progress, control your account, and give you assignments on Duolingo.
              </p>
            </div>

            {schoolSuccess && (
              <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-black rounded-2xl border border-emerald-300">
                {schoolSuccess}
              </div>
            )}

            <form onSubmit={handleSchoolSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="ABC123"
                value={schoolCode}
                onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                maxLength={8}
                className="w-full p-3.5 rounded-2xl border-2 border-gray-200 text-sm font-black uppercase tracking-widest text-gray-800 bg-[#f7f7f7] outline-none focus:border-[#1cb0f6]"
              />
              <button
                type="submit"
                className={`py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-wider transition ${
                  schoolCode.trim().length > 0
                    ? "btn-3d-green"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                SUBMIT
              </button>
            </form>
          </div>
        )}

        {/* ====================================================== */}
        {/* TAB 8: SOCIAL ACCOUNTS                                 */}
        {/* ====================================================== */}
        {activeTab === "social" && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">
              Social accounts
            </h1>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between p-3 border-b border-gray-100">
                <span className="font-bold text-sm text-gray-800">Google</span>
                <span className="text-xs font-bold text-gray-400">Connected</span>
              </div>
              <div className="flex items-center justify-between p-3 border-b border-gray-100">
                <span className="font-bold text-sm text-gray-800">Apple</span>
                <button className="text-xs font-black text-[#1cb0f6]">CONNECT</button>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="font-bold text-sm text-gray-800">Facebook</span>
                <button className="text-xs font-black text-[#1cb0f6]">CONNECT</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: 4-CARD MENU MATCHING USER SCREENSHOTS 1:1  */}
      {/* ======================================================== */}
      <div className="w-full lg:w-72 space-y-4 shrink-0">
        {/* CARD 1: MAIN NAVIGATION LIST */}
        <div className="bg-white border border-gray-200 rounded-2xl p-2 shadow-xs space-y-0.5">
          {[
            { id: "account", label: "Account" },
            { id: "preferences", label: "Preferences" },
            { id: "profile", label: "Profile" },
            { id: "notifications", label: "Notifications" },
            { id: "courses", label: "Courses" },
            { id: "schools", label: "Duolingo for Schools" },
            { id: "social", label: "Social accounts" },
            { id: "privacy", label: "Privacy settings" },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  sounds.playTap();
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                  isActive
                    ? "text-[#1cb0f6] font-black bg-sky-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* CARD 2: SUBSCRIPTION */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-2">
          <h3 className="font-black text-sm text-gray-700">Subscription</h3>
          <button
            onClick={() => {
              setActiveTab("subscription");
              sounds.playTap();
            }}
            className={`w-full text-left py-1 text-sm font-bold transition ${
              activeTab === "subscription"
                ? "text-[#1cb0f6] font-black"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Choose a plan
          </button>
        </div>

        {/* CARD 3: SUPPORT (Connected to /help page) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-2">
          <h3 className="font-black text-sm text-gray-700">Support</h3>
          <Link
            href="/help"
            className="block w-full text-left py-1 text-sm font-bold text-gray-700 hover:text-[#1cb0f6] transition"
          >
            Help Center
          </Link>
        </div>

        {/* CARD 4: LOG OUT BUTTON (Matching Screenshot 1:1) */}
        <button
          onClick={() => setActiveModal("logout")}
          className="w-full py-3.5 px-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 font-black text-xs uppercase tracking-wider text-[#1cb0f6] hover:bg-sky-50/50 active:scale-95 transition bg-white shadow-xs"
        >
          LOG OUT
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {activeModal === "logout" && (
        <div
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border-2 border-gray-200 text-center animate-scale-up"
          >
            <span className="text-5xl block mb-2">👋</span>
            <h3 className="text-lg font-black text-gray-800 mb-2">Log out of Duolingo?</h3>
            <p className="text-xs font-bold text-gray-500 mb-6">
              You can sign back in anytime to continue your Hindi streak.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-xs font-black uppercase text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs font-black uppercase hover:bg-red-600 transition"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {activeModal === "delete" && (
        <div
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border-2 border-gray-200 text-center animate-scale-up"
          >
            <span className="text-5xl block mb-2">⚠️</span>
            <h3 className="text-lg font-black text-gray-800 mb-2">Delete Account?</h3>
            <p className="text-xs font-bold text-gray-500 mb-6">
              This action cannot be undone. All your Hindi progress, streak, and gems will be permanently erased.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-xs font-black uppercase text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs font-black uppercase hover:bg-red-600 transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Course Modal */}
      {activeModal === "resetCourse" && (
        <div
          onClick={() => !isResetting && setActiveModal(null)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border-2 border-gray-200 text-center animate-scale-up"
          >
            <span className="text-5xl block mb-2">🔄</span>
            <h3 className="text-lg font-black text-gray-800 mb-2">Reset Hindi Progress?</h3>
            <p className="text-xs font-bold text-gray-500 mb-6">
              This will reset your completed lessons in Section 1 and allow you to restart Hindi 1 from lesson 1.
            </p>
            <div className="flex gap-2">
              <button
                disabled={isResetting}
                onClick={() => setActiveModal(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-xs font-black uppercase text-gray-500 hover:bg-gray-100 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isResetting}
                onClick={async () => {
                  try {
                    setIsResetting(true);
                    sounds.playTap();
                    await resetUserProgress();
                    sounds.playCorrect();
                    setActiveModal(null);
                    setSavedToast("Hindi course reset to Lesson 1! 🇮🇳");
                    setTimeout(() => {
                      router.push("/learn");
                    }, 800);
                  } catch (e) {
                    console.error("Failed to reset course", e);
                    setSavedToast("Failed to reset course. Please try again.");
                  } finally {
                    setIsResetting(false);
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-amber-500 text-white text-xs font-black uppercase hover:bg-amber-600 active:scale-95 transition disabled:opacity-50 flex items-center justify-center font-bold"
              >
                {isResetting ? "Resetting..." : "Reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px] text-gray-400 font-black text-sm">
          <span>Loading settings...</span>
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
