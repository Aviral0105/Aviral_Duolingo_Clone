"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Settings, Volume2, Bell, Shield, Sparkles, LogOut, Check, Moon, Download, Trash2, Key } from "lucide-react";
import { fetchUserSettings, updateUserSettings } from "@/lib/api";

export default function AccountSettingsPage() {
  const router = useRouter();
  const [username, setUsername] = useState("AVIRAL JAIN");
  const [handle, setHandle] = useState("AVIRALJAIN51695");
  const [email, setEmail] = useState("aviral@example.com");

  const [soundEffects, setSoundEffects] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [motivationalMessages, setMotivationalMessages] = useState(true);
  const [listeningExercises, setListeningExercises] = useState(true);
  const [speakingExercises, setSpeakingExercises] = useState(true);
  const [darkMode, setDarkMode] = useState<"system" | "on" | "off">("system");

  const [savedToast, setSavedToast] = useState(false);
  const [activeModal, setActiveModal] = useState<"password" | "delete" | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const data = await fetchUserSettings();
      if (data) {
        if (data.sound_effects !== undefined) setSoundEffects(data.sound_effects);
        if (data.animations !== undefined) setAnimations(data.animations);
        if (data.motivational_messages !== undefined) setMotivationalMessages(data.motivational_messages);
        if (data.listening_exercises !== undefined) setListeningExercises(data.listening_exercises);
        if (data.speaking_exercises !== undefined) setSpeakingExercises(data.speaking_exercises);
        if (data.dark_mode) setDarkMode(data.dark_mode);
      }
      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem("duo_username");
        if (savedUser) setUsername(savedUser);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
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
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleExportData = () => {
    const data = {
      user: { username, handle, email },
      settings: { soundEffects, animations, motivationalMessages, listeningExercises, speakingExercises, darkMode },
      course: "Hindi 1 (हिन्दी)",
      streak: 1,
      gems: 505,
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

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start pb-16">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#58cc02] text-white px-5 py-3 rounded-2xl shadow-xl font-black text-sm flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5 stroke-[3]" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* CENTER COLUMN: SETTINGS CONTROLS */}
      <div className="flex-1 w-full max-w-xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight mb-1">
            Account Settings
          </h1>
          <p className="text-xs font-bold text-gray-400">
            Manage your account preferences, sound options, and learning experience.
          </p>
        </div>

        {/* Section 1: Account Information */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-gray-800">Account</h2>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 font-bold text-sm text-gray-800 focus:border-[#1cb0f6] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">
              Handle
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 font-bold text-sm text-gray-800 focus:border-[#1cb0f6] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 font-bold text-sm text-gray-800 focus:border-[#1cb0f6] outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveModal("password")}
              className="text-xs font-black text-[#1cb0f6] hover:underline flex items-center gap-1.5"
            >
              <Key className="w-4 h-4" />
              <span>Change Password</span>
            </button>
          </div>
        </div>

        {/* Section 2: Preferences & Sound */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-5">
          <h2 className="text-lg font-black text-gray-800">Preferences</h2>

          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-black text-sm text-gray-800">Sound effects</div>
              <div className="text-xs text-gray-400 font-bold">Play chimes for correct and wrong answers</div>
            </div>
            <button
              onClick={() => setSoundEffects(!soundEffects)}
              className={`w-14 h-8 rounded-full transition p-1 ${
                soundEffects ? "bg-[#58cc02]" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition shadow-sm ${
                  soundEffects ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Motivational Animations Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-black text-sm text-gray-800">Animations</div>
              <div className="text-xs text-gray-400 font-bold">Show celebratory animations between exercises</div>
            </div>
            <button
              onClick={() => setAnimations(!animations)}
              className={`w-14 h-8 rounded-full transition p-1 ${
                animations ? "bg-[#58cc02]" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition shadow-sm ${
                  animations ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Motivational Messages */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-black text-sm text-gray-800">Motivational messages</div>
              <div className="text-xs text-gray-400 font-bold">Show Duo cheering and encouragement tips</div>
            </div>
            <button
              onClick={() => setMotivationalMessages(!motivationalMessages)}
              className={`w-14 h-8 rounded-full transition p-1 ${
                motivationalMessages ? "bg-[#58cc02]" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition shadow-sm ${
                  motivationalMessages ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Listening Exercises Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-black text-sm text-gray-800">Listening exercises</div>
              <div className="text-xs text-gray-400 font-bold">Include audio playback drills</div>
            </div>
            <button
              onClick={() => setListeningExercises(!listeningExercises)}
              className={`w-14 h-8 rounded-full transition p-1 ${
                listeningExercises ? "bg-[#58cc02]" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition shadow-sm ${
                  listeningExercises ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Dark Mode Selector */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              Appearance / Dark Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "system", label: "System default" },
                { id: "off", label: "Off" },
                { id: "on", label: "On" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setDarkMode(m.id as any)}
                  className={`py-2 px-3 rounded-xl border-2 font-black text-xs transition ${
                    darkMode === m.id
                      ? "border-[#1cb0f6] bg-sky-50 text-[#1cb0f6]"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Data & Account Actions */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-gray-800">Data & Privacy</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportData}
              className="flex-1 py-3 px-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 font-black text-xs text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition"
            >
              <Download className="w-4 h-4 text-gray-500" />
              <span>Export my data</span>
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

        {/* Save Changes Floating / Fixed Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => router.push("/welcome")}
            className="py-3.5 px-6 rounded-2xl border-2 border-gray-200 text-gray-500 font-black text-xs uppercase tracking-wider hover:bg-gray-50 transition"
          >
            Log Out
          </button>
          <button
            onClick={handleSave}
            className="py-3.5 px-8 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black text-xs uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 shadow-md transition"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: SETTINGS MENU NAVIGATION */}
      <div className="w-full lg:w-72 bg-white border-2 border-gray-200 rounded-3xl p-3 shadow-xs space-y-1">
        <Link
          href="/settings/account"
          className="flex items-center gap-3 p-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-sky-50 text-[#1cb0f6] border border-sky-200"
        >
          <Settings className="w-5 h-5" />
          <span>Account</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-3 p-3 rounded-2xl font-black text-xs uppercase tracking-wider text-gray-600 hover:bg-gray-100 transition"
        >
          <Volume2 className="w-5 h-5 text-gray-400" />
          <span>Sound & Audio</span>
        </Link>
        <div
          onClick={() => alert("Notification settings: email & push toggles")}
          className="flex items-center gap-3 p-3 rounded-2xl font-black text-xs uppercase tracking-wider text-gray-600 hover:bg-gray-100 cursor-pointer transition"
        >
          <Bell className="w-5 h-5 text-gray-400" />
          <span>Notifications</span>
        </div>
        <Link
          href="/shop"
          className="flex items-center gap-3 p-3 rounded-2xl font-black text-xs uppercase tracking-wider text-gray-600 hover:bg-gray-100 transition"
        >
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span>Super Duolingo</span>
        </Link>
      </div>

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
                  setSavedToast(true);
                  setTimeout(() => setSavedToast(false), 3000);
                }}
                className="flex-1 py-3 rounded-xl bg-[#58cc02] text-white text-xs font-black uppercase btn-3d-green"
              >
                Update
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
                onClick={() => {
                  setActiveModal(null);
                  router.push("/welcome");
                }}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-xs font-black uppercase hover:bg-red-600 transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
