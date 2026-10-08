"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Volume2,
  Bell,
  Sparkles,
  Check,
  Moon,
  Sun,
  Laptop,
  Download,
  Trash2,
  Key,
  Shield,
  HelpCircle,
  GraduationCap,
  Globe,
  Share2,
  CreditCard,
  Heart,
  Zap,
  Search,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { fetchUserSettings, updateUserSettings, fetchUser } from "@/lib/api";
import { sounds } from "@/lib/sounds";

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "preferences";

  const [activeTab, setActiveTab] = useState<
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

  // User state
  const [username, setUsername] = useState("AVIRAL JAIN");
  const [handle, setHandle] = useState("AVIRALJAIN51695");
  const [email, setEmail] = useState("aviral@example.com");
  const [bio, setBio] = useState("Learning Hindi on Duolingo! नमस्ते!");
  const [location, setLocation] = useState("India");

  // Settings State
  const [soundEffects, setSoundEffects] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [motivationalMessages, setMotivationalMessages] = useState(true);
  const [listeningExercises, setListeningExercises] = useState(true);
  const [speakingExercises, setSpeakingExercises] = useState(true);
  const [darkMode, setDarkMode] = useState<"system" | "on" | "off">("system");

  // Notification settings
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState("19:00");
  const [emailProgress, setEmailProgress] = useState(true);
  const [streakFreezeAlert, setStreakFreezeAlert] = useState(true);

  // Privacy Settings
  const [publicProfile, setPublicProfile] = useState(true);
  const [showInLeaderboards, setShowInLeaderboards] = useState(true);
  const [allowFriendRequests, setAllowFriendRequests] = useState(true);

  // Modals & Feedback
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<"password" | "delete" | "logout" | "resetCourse" | null>(null);
  const [isSuperActive, setIsSuperActive] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [classJoinedMessage, setClassJoinedMessage] = useState<string | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Load existing settings and theme
  useEffect(() => {
    async function loadData() {
      const [settingsData, userData] = await Promise.all([
        fetchUserSettings(),
        fetchUser(),
      ]);

      if (userData) {
        if (userData.username) setUsername(userData.username);
        if (userData.handle) setHandle(userData.handle);
        setIsSuperActive(userData.is_super);
      }

      if (settingsData) {
        if (settingsData.sound_effects !== undefined) setSoundEffects(settingsData.sound_effects);
        if (settingsData.animations !== undefined) setAnimations(settingsData.animations);
        if (settingsData.motivational_messages !== undefined) setMotivationalMessages(settingsData.motivational_messages);
        if (settingsData.listening_exercises !== undefined) setListeningExercises(settingsData.listening_exercises);
        if (settingsData.speaking_exercises !== undefined) setSpeakingExercises(settingsData.speaking_exercises);
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

  // Theme apply function
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
      // System default
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
      localStorage.setItem("duo_username", username);
      localStorage.setItem("duo_email", email);
    }
    await updateUserSettings({
      sound_effects: soundEffects,
      animations: animations,
      motivational_messages: motivationalMessages,
      listening_exercises: listeningExercises,
      speaking_exercises: speakingExercises,
      dark_mode: darkMode,
    });
    setSavedToast("Settings saved successfully! ✨");
    setTimeout(() => setSavedToast(null), 3000);
  };

  const handleExportData = () => {
    const data = {
      user: { username, handle, email, bio, location },
      settings: { soundEffects, animations, motivationalMessages, listeningExercises, speakingExercises, darkMode },
      course: "Hindi 1 (हिन्दी)",
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

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCode.trim()) return;
    setClassJoinedMessage(`Successfully joined classroom "${classCode.toUpperCase()}"! 🎉`);
    setClassCode("");
    setTimeout(() => setClassJoinedMessage(null), 4000);
  };

  const handleLogout = () => {
    try {
      localStorage.clear();
    } catch {}
    router.push("/welcome");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start pb-16">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#58cc02] text-white px-5 py-3 rounded-2xl shadow-xl font-black text-sm flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5 stroke-[3]" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* LEFT / CENTER COLUMN: MAIN CONTENT FOR ACTIVE SECTION     */}
      {/* ======================================================== */}
      <div className="flex-1 w-full max-w-xl mx-auto space-y-8">
        {/* 1. PREFERENCES SECTION */}
        {activeTab === "preferences" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight mb-1">
                Preferences
              </h1>
              <p className="text-xs font-bold text-gray-400">
                Manage your account credentials, sound effects, appearance, and learning options.
              </p>
            </div>

            {/* Account Information Card */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-black text-gray-800">Account</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-700 outline-none focus:border-[#1cb0f6] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1">
                    Handle
                  </label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-700 outline-none focus:border-[#1cb0f6] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-700 outline-none focus:border-[#1cb0f6] transition"
                  />
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveModal("password")}
                    className="text-xs font-black text-[#1cb0f6] hover:underline flex items-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Change Password</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Appearance & Dark Mode Card */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-gray-800">Appearance</h2>
                  <p className="text-xs font-bold text-gray-400">
                    Switch between light, dark, or system-matched interface theme.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Moon className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {[
                  { id: "system", label: "System default", icon: <Laptop className="w-4 h-4" /> },
                  { id: "off", label: "Off (Light)", icon: <Sun className="w-4 h-4" /> },
                  { id: "on", label: "On (Dark)", icon: <Moon className="w-4 h-4" /> },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleDarkModeChange(m.id as any)}
                    className={`py-3 px-3 rounded-2xl border-2 font-black text-xs flex flex-col items-center justify-center gap-1.5 transition active:scale-95 ${
                      darkMode === m.id
                        ? "border-[#1cb0f6] bg-[#ddf4ff] text-[#1899d6] shadow-xs"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sound & Audio Card */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-black text-gray-800">Sound & Audio</h2>
              <div className="space-y-3.5 divide-y divide-gray-100">
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <h3 className="text-sm font-black text-gray-800">Sound effects</h3>
                    <p className="text-xs font-bold text-gray-400">
                      Play audio cues on correct answers, mistakes, and button presses.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const next = !soundEffects;
                      setSoundEffects(next);
                      if (next) sounds.playTap();
                    }}
                    className={`w-14 h-8 rounded-full p-1 transition-colors ${
                      soundEffects ? "bg-[#58cc02]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white transition-transform ${
                        soundEffects ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3.5">
                  <div>
                    <h3 className="text-sm font-black text-gray-800">Listening exercises</h3>
                    <p className="text-xs font-bold text-gray-400">
                      Include tap-what-you-hear and Hindi pronunciation drills in lessons.
                    </p>
                  </div>
                  <button
                    onClick={() => setListeningExercises(!listeningExercises)}
                    className={`w-14 h-8 rounded-full p-1 transition-colors ${
                      listeningExercises ? "bg-[#58cc02]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white transition-transform ${
                        listeningExercises ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3.5">
                  <div>
                    <h3 className="text-sm font-black text-gray-800">Speaking exercises</h3>
                    <p className="text-xs font-bold text-gray-400">
                      Include spoken microphone challenges.
                    </p>
                  </div>
                  <button
                    onClick={() => setSpeakingExercises(!speakingExercises)}
                    className={`w-14 h-8 rounded-full p-1 transition-colors ${
                      speakingExercises ? "bg-[#58cc02]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white transition-transform ${
                        speakingExercises ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Learning Options Card */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-black text-gray-800">Learning Experience</h2>
              <div className="space-y-3.5 divide-y divide-gray-100">
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <h3 className="text-sm font-black text-gray-800">Motivational messages</h3>
                    <p className="text-xs font-bold text-gray-400">
                      Show Duo the owl encouragement banners during long streaks.
                    </p>
                  </div>
                  <button
                    onClick={() => setMotivationalMessages(!motivationalMessages)}
                    className={`w-14 h-8 rounded-full p-1 transition-colors ${
                      motivationalMessages ? "bg-[#58cc02]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white transition-transform ${
                        motivationalMessages ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3.5">
                  <div>
                    <h3 className="text-sm font-black text-gray-800">Animations</h3>
                    <p className="text-xs font-bold text-gray-400">
                      Enable celebratory confetti and mascot transitions.
                    </p>
                  </div>
                  <button
                    onClick={() => setAnimations(!animations)}
                    className={`w-14 h-8 rounded-full p-1 transition-colors ${
                      animations ? "bg-[#58cc02]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white transition-transform ${
                        animations ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Data & Privacy Actions */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-black text-gray-800">Data & Account Actions</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleExportData}
                  className="flex-1 py-3 px-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 font-black text-xs text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition"
                >
                  <Download className="w-4 h-4 text-gray-500" />
                  <span>Export my data (JSON)</span>
                </button>
                <button
                  onClick={() => setActiveModal("delete")}
                  className="py-3 px-4 rounded-2xl border-2 border-red-200 text-red-500 hover:bg-red-50 font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete account</span>
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black text-xs uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 shadow-md transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* 2. PROFILE SECTION */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight mb-1">
                Profile
              </h1>
              <p className="text-xs font-bold text-gray-400">
                Personalize your public profile, bio, and avatar.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-4xl">
                  🧑
                </div>
                <div>
                  <h3 className="font-black text-gray-800 text-base">{username}</h3>
                  <p className="text-xs font-bold text-gray-400">{handle}</p>
                  <Link
                    href="/profile"
                    className="inline-block mt-1 text-xs font-black text-[#1cb0f6] hover:underline"
                  >
                    View Public Profile →
                  </Link>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell other learners about your Hindi learning journey..."
                    className="w-full p-3.5 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-700 outline-none focus:border-[#1cb0f6] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-700 outline-none focus:border-[#1cb0f6] transition"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSave}
                  className="py-3 px-6 rounded-2xl bg-[#58cc02] text-white font-black text-xs uppercase tracking-wider btn-3d-green"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. NOTIFICATIONS SECTION */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight mb-1">
                Notifications
              </h1>
              <p className="text-xs font-bold text-gray-400">
                Choose when and how Duolingo keeps you motivated to maintain your streak.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-black text-gray-800">Practice Reminders</h2>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-800">Daily practice alert</h3>
                  <p className="text-xs font-bold text-gray-400">
                    Get reminded to complete your 1 Hindi lesson per day.
                  </p>
                </div>
                <button
                  onClick={() => setDailyReminder(!dailyReminder)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${
                    dailyReminder ? "bg-[#58cc02]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white transition-transform ${
                      dailyReminder ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {dailyReminder && (
                <div className="pt-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1">
                    Preferred Reminder Time
                  </label>
                  <select
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="p-3 rounded-2xl border-2 border-gray-200 text-xs font-bold text-gray-700 outline-none focus:border-[#1cb0f6]"
                  >
                    <option value="08:00">8:00 AM (Morning kickstart)</option>
                    <option value="12:00">12:00 PM (Lunch break)</option>
                    <option value="19:00">7:00 PM (Evening practice)</option>
                    <option value="21:00">9:00 PM (Before bed)</option>
                  </select>
                </div>
              )}
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-black text-gray-800">Email Notifications</h2>
              <div className="space-y-3 divide-y divide-gray-100">
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <h3 className="text-sm font-black text-gray-800">Weekly progress report</h3>
                    <p className="text-xs font-bold text-gray-400">
                      Summary of XP earned, words learned, and streak health.
                    </p>
                  </div>
                  <button
                    onClick={() => setEmailProgress(!emailProgress)}
                    className={`w-14 h-8 rounded-full p-1 transition-colors ${
                      emailProgress ? "bg-[#58cc02]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white transition-transform ${
                        emailProgress ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h3 className="text-sm font-black text-gray-800">Streak freeze alerts</h3>
                    <p className="text-xs font-bold text-gray-400">
                      Warn me before midnight if my daily streak is at risk.
                    </p>
                  </div>
                  <button
                    onClick={() => setStreakFreezeAlert(!streakFreezeAlert)}
                    className={`w-14 h-8 rounded-full p-1 transition-colors ${
                      streakFreezeAlert ? "bg-[#58cc02]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white transition-transform ${
                        streakFreezeAlert ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. COURSES SECTION */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight mb-1">
                Courses
              </h1>
              <p className="text-xs font-bold text-gray-400">
                View your active languages and curriculum progression.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/50 border-2 border-amber-200">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🇮🇳</span>
                  <div>
                    <h3 className="font-black text-gray-800 text-base">Hindi 1 (हिन्दी)</h3>
                    <p className="text-xs font-bold text-gray-500">
                      3 Units • 10 Lessons • 71 Devanagari Exercises
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black px-3 py-1 bg-[#58cc02] text-white rounded-xl uppercase tracking-wider">
                  Active
                </span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/learn"
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#1cb0f6] text-white font-black text-xs uppercase tracking-wider text-center btn-3d-blue"
                >
                  Continue Learning
                </Link>
                <button
                  onClick={() => setActiveModal("resetCourse")}
                  className="py-3 px-4 rounded-2xl border-2 border-gray-200 text-gray-600 hover:text-red-500 hover:border-red-200 font-black text-xs uppercase tracking-wider transition"
                >
                  Reset Progress
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. DUOLINGO FOR SCHOOLS */}
        {activeTab === "schools" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight mb-1">
                Duolingo for Schools
              </h1>
              <p className="text-xs font-bold text-gray-400">
                Connect your Hindi progress to your teacher or school classroom.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-gray-800 text-base">Join a Classroom</h3>
                  <p className="text-xs font-bold text-gray-500 mt-0.5">
                    Enter the 6-letter classroom code provided by your teacher to submit homework assignments.
                  </p>
                </div>
              </div>

              {classJoinedMessage && (
                <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black rounded-2xl animate-fade-in">
                  {classJoinedMessage}
                </div>
              )}

              <form onSubmit={handleJoinClass} className="space-y-3">
                <input
                  type="text"
                  maxLength={8}
                  placeholder="e.g. HND101"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  className="w-full p-3.5 rounded-2xl border-2 border-gray-200 text-sm font-black tracking-widest uppercase text-gray-800 outline-none focus:border-[#58cc02]"
                />
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#58cc02] text-white font-black text-xs uppercase tracking-wider btn-3d-green"
                >
                  Join Section
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 6. SOCIAL ACCOUNTS */}
        {activeTab === "social" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight mb-1">
                Social Accounts
              </h1>
              <p className="text-xs font-bold text-gray-400">
                Link social accounts to easily sign in and find classmates.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between p-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <h4 className="font-black text-sm text-gray-800">Google</h4>
                    <p className="text-xs font-bold text-gray-400">Connected as aviral@gmail.com</p>
                  </div>
                </div>
                <button className="px-3.5 py-1.5 rounded-xl border-2 border-gray-200 text-xs font-black text-gray-500 hover:bg-gray-50">
                  Disconnect
                </button>
              </div>

              <div className="flex items-center justify-between p-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🍎</span>
                  <div>
                    <h4 className="font-black text-sm text-gray-800">Apple</h4>
                    <p className="text-xs font-bold text-gray-400">Not connected</p>
                  </div>
                </div>
                <button className="px-3.5 py-1.5 rounded-xl bg-[#1cb0f6] text-white text-xs font-black uppercase tracking-wider btn-3d-blue">
                  Connect
                </button>
              </div>

              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📘</span>
                  <div>
                    <h4 className="font-black text-sm text-gray-800">Facebook</h4>
                    <p className="text-xs font-bold text-gray-400">Not connected</p>
                  </div>
                </div>
                <button className="px-3.5 py-1.5 rounded-xl bg-[#1cb0f6] text-white text-xs font-black uppercase tracking-wider btn-3d-blue">
                  Connect
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 7. PRIVACY SETTINGS */}
        {activeTab === "privacy" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight mb-1">
                Privacy Settings
              </h1>
              <p className="text-xs font-bold text-gray-400">
                Control who can see your profile, streak, and learning achievements.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="text-sm font-black text-gray-800">Public profile</h3>
                  <p className="text-xs font-bold text-gray-400">
                    Allow other learners to view your profile and achievements.
                  </p>
                </div>
                <button
                  onClick={() => setPublicProfile(!publicProfile)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${
                    publicProfile ? "bg-[#58cc02]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white transition-transform ${
                      publicProfile ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <h3 className="text-sm font-black text-gray-800">Participate in Leaderboards</h3>
                  <p className="text-xs font-bold text-gray-400">
                    Compete in weekly leagues with other Hindi learners.
                  </p>
                </div>
                <button
                  onClick={() => setShowInLeaderboards(!showInLeaderboards)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${
                    showInLeaderboards ? "bg-[#58cc02]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white transition-transform ${
                      showInLeaderboards ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <h3 className="text-sm font-black text-gray-800">Allow friend requests</h3>
                  <p className="text-xs font-bold text-gray-400">
                    Friends can find your handle and invite you to Friend Quests.
                  </p>
                </div>
                <button
                  onClick={() => setAllowFriendRequests(!allowFriendRequests)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${
                    allowFriendRequests ? "bg-[#58cc02]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white transition-transform ${
                      allowFriendRequests ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 8. SUBSCRIPTION / CHOOSE A PLAN */}
        {activeTab === "subscription" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight mb-1">
                Subscription
              </h1>
              <p className="text-xs font-bold text-gray-400">
                Accelerate your language learning with Super Duolingo.
              </p>
            </div>

            {/* Super Hero Banner */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-md">
                  SUPER DUOLINGO
                </span>
                <h2 className="text-2xl font-black mt-2 mb-1">Supercharge Your Hindi</h2>
                <p className="text-xs text-purple-100 font-bold mb-4">
                  Unlimited hearts, personalized practice review, and zero interruptions.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-black">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Unlimited Hearts</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-black">
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Mistake Remediation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs space-y-3">
                <h3 className="font-black text-base text-gray-800">12 Months (Best Value)</h3>
                <p className="text-2xl font-black text-purple-600">$4.99 <span className="text-xs text-gray-400 font-bold">/ month</span></p>
                <p className="text-xs text-gray-500 font-bold">Billed annually at $59.99/year (Save 60%)</p>
                <button
                  onClick={() => {
                    setIsSuperActive(true);
                    setSavedToast("Super Duolingo activated! 🌟");
                    setTimeout(() => setSavedToast(null), 3000);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-purple-600 text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-purple-700 active:scale-95 transition"
                >
                  Start 14-Day Free Trial
                </button>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs space-y-3">
                <h3 className="font-black text-base text-gray-800">Monthly Plan</h3>
                <p className="text-2xl font-black text-gray-800">$12.99 <span className="text-xs text-gray-400 font-bold">/ month</span></p>
                <p className="text-xs text-gray-500 font-bold">Billed monthly, cancel anytime</p>
                <button
                  onClick={() => {
                    setIsSuperActive(true);
                    setSavedToast("Super Duolingo activated! 🌟");
                    setTimeout(() => setSavedToast(null), 3000);
                  }}
                  className="w-full py-3.5 rounded-2xl border-2 border-gray-200 hover:border-gray-300 font-black text-xs uppercase tracking-wider text-gray-700 active:scale-95 transition"
                >
                  Choose Monthly
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 9. SUPPORT / HELP CENTER */}
        {activeTab === "support" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight mb-1">
                Help Center
              </h1>
              <p className="text-xs font-bold text-gray-400">
                Frequently asked questions, pronunciation tips, and technical support.
              </p>
            </div>

            {/* FAQ Accordion */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-black text-gray-800">Frequently Asked Questions</h2>
              
              <div className="space-y-3 divide-y divide-gray-100">
                <div className="pt-1">
                  <h4 className="font-black text-sm text-gray-800">How do I restore lost hearts?</h4>
                  <p className="text-xs font-bold text-gray-500 mt-1 leading-relaxed">
                    You can restore hearts by completing a practice session in the Practice Hub, or by refilling them in the Shop using 350 gems.
                  </p>
                </div>

                <div className="pt-3">
                  <h4 className="font-black text-sm text-gray-800">How does the Snail audio button work?</h4>
                  <p className="text-xs font-bold text-gray-500 mt-1 leading-relaxed">
                    Clicking the snail icon next to any Hindi sentence plays the audio at a slower 0.5x speed using the Web Speech synthesizer, helping you hear each Devanagari syllable clearly.
                  </p>
                </div>

                <div className="pt-3">
                  <h4 className="font-black text-sm text-gray-800">What happens if I miss a question in a lesson?</h4>
                  <p className="text-xs font-bold text-gray-500 mt-1 leading-relaxed">
                    Duolingo automatically queues missed questions for the Spaced Remediation phase. Duo will help you review and clear them at the end of the lesson before awarding your XP.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Support Card */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-3">
              <h3 className="font-black text-base text-gray-800">Submit Feedback / Report Issue</h3>
              {feedbackSubmitted ? (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black rounded-2xl animate-fade-in">
                  Thank you! Your feedback has been sent to our engineering team. 🦉
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFeedbackSubmitted(true);
                  }}
                  className="space-y-3"
                >
                  <textarea
                    rows={3}
                    placeholder="Describe your issue or suggestion for Hindi 1..."
                    required
                    className="w-full p-3.5 rounded-2xl border-2 border-gray-200 text-xs font-bold text-gray-700 outline-none focus:border-[#1cb0f6]"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[#1cb0f6] text-white font-black text-xs uppercase tracking-wider btn-3d-blue"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: 4-CARD MENU MATCHING USER SCREENSHOT 1:1   */}
      {/* ======================================================== */}
      <div className="w-full lg:w-72 space-y-4">
        {/* CARD 1: MAIN PREFERENCES & NAVIGATION */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-2 shadow-xs space-y-0.5">
          {[
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
                className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition flex items-center justify-between ${
                  isActive
                    ? "bg-sky-50 text-[#1cb0f6] font-black border border-sky-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* CARD 2: SUBSCRIPTION */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 shadow-xs space-y-2">
          <h3 className="font-black text-base text-gray-800">Subscription</h3>
          <button
            onClick={() => {
              setActiveTab("subscription");
              sounds.playTap();
            }}
            className={`w-full text-left px-3 py-2.5 rounded-2xl font-bold text-sm transition ${
              activeTab === "subscription"
                ? "bg-sky-50 text-[#1cb0f6] font-black border border-sky-200"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Choose a plan
          </button>
        </div>

        {/* CARD 3: SUPPORT */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 shadow-xs space-y-2">
          <h3 className="font-black text-base text-gray-800">Support</h3>
          <button
            onClick={() => {
              setActiveTab("support");
              sounds.playTap();
            }}
            className={`w-full text-left px-3 py-2.5 rounded-2xl font-bold text-sm transition ${
              activeTab === "support"
                ? "bg-sky-50 text-[#1cb0f6] font-black border border-sky-200"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Help Center
          </button>
        </div>

        {/* CARD 4: LOG OUT BUTTON (Matching Screenshot 1:1) */}
        <button
          onClick={() => setActiveModal("logout")}
          className="w-full py-3.5 px-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 font-black text-sm uppercase tracking-wider text-[#1cb0f6] hover:bg-sky-50/50 active:scale-95 transition bg-white shadow-xs"
        >
          LOG OUT
        </button>
      </div>

      {/* ======================================================== */}
      {/* POPUP MODALS                                             */}
      {/* ======================================================== */}

      {/* Password Change Modal */}
      {activeModal === "password" && (
        <div
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border-2 border-gray-200 animate-scale-up"
          >
            <h3 className="text-lg font-black text-gray-800 mb-3">Change Password</h3>
            <input
              type="password"
              placeholder="Current password"
              className="w-full p-3 rounded-2xl border-2 border-gray-200 text-xs font-bold mb-2.5 outline-none focus:border-[#1cb0f6]"
            />
            <input
              type="password"
              placeholder="New password"
              className="w-full p-3 rounded-2xl border-2 border-gray-200 text-xs font-bold mb-4 outline-none focus:border-[#1cb0f6]"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-xs font-black uppercase text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setSavedToast("Password updated successfully! 🔑");
                  setTimeout(() => setSavedToast(null), 3000);
                }}
                className="flex-1 py-3 rounded-xl bg-[#58cc02] text-white text-xs font-black uppercase btn-3d-green"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

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
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border-2 border-gray-200 text-center animate-scale-up"
          >
            <span className="text-5xl block mb-2">🔄</span>
            <h3 className="text-lg font-black text-gray-800 mb-2">Reset Hindi Progress?</h3>
            <p className="text-xs font-bold text-gray-500 mb-6">
              This will reset completed lessons in Section 1 and allow you to restart Hindi 1 from lesson 1.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-xs font-black uppercase text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setSavedToast("Hindi course reset to Lesson 1! 🇮🇳");
                  setTimeout(() => setSavedToast(null), 3000);
                  router.push("/learn");
                }}
                className="flex-1 py-3 rounded-xl bg-amber-500 text-white text-xs font-black uppercase hover:bg-amber-600 transition"
              >
                Reset
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
