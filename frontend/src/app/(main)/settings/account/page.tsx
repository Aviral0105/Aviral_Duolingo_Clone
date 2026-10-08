"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings, Volume2, Bell, Shield, Sparkles, LogOut, Check } from "lucide-react";

export default function AccountSettingsPage() {
  const [soundEffects, setSoundEffects] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [motivationalMessages, setMotivationalMessages] = useState(true);
  const [listeningExercises, setListeningExercises] = useState(true);
  const [speakingExercises, setSpeakingExercises] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
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
              defaultValue="AVIRAL JAIN"
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 font-bold text-sm text-gray-800 focus:border-[#1cb0f6] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">
              Handle
            </label>
            <input
              type="text"
              defaultValue="AVIRALJAIN51695"
              disabled
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-100 bg-gray-50 font-bold text-sm text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              defaultValue="aviral@example.com"
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 font-bold text-sm text-gray-800 focus:border-[#1cb0f6] outline-none"
            />
          </div>
        </div>

        {/* Section 2: Sound & Preferences */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-xs space-y-5">
          <h2 className="text-lg font-black text-gray-800">Sound & Learning Preferences</h2>

          {/* Toggle 1: Sound Effects */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-black text-sm text-gray-800">Sound Effects</div>
              <div className="text-xs font-bold text-gray-400">Play chimes on correct and incorrect answers</div>
            </div>
            <button
              onClick={() => setSoundEffects(!soundEffects)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                soundEffects ? "bg-[#58cc02]" : "bg-gray-200"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  soundEffects ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: Animations */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div>
              <div className="font-black text-sm text-gray-800">Animations</div>
              <div className="text-xs font-bold text-gray-400">Play celebratory confetti and mascot animations</div>
            </div>
            <button
              onClick={() => setAnimations(!animations)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                animations ? "bg-[#58cc02]" : "bg-gray-200"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  animations ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Toggle 3: Motivational Messages */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div>
              <div className="font-black text-sm text-gray-800">Motivational Messages</div>
              <div className="text-xs font-bold text-gray-400">Show encouraging interstitials during lessons</div>
            </div>
            <button
              onClick={() => setMotivationalMessages(!motivationalMessages)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                motivationalMessages ? "bg-[#58cc02]" : "bg-gray-200"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  motivationalMessages ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Toggle 4: Listening Exercises */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div>
              <div className="font-black text-sm text-gray-800">Listening Exercises</div>
              <div className="text-xs font-bold text-gray-400">Include questions that require listening to audio</div>
            </div>
            <button
              onClick={() => setListeningExercises(!listeningExercises)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                listeningExercises ? "bg-[#58cc02]" : "bg-gray-200"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  listeningExercises ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section 3: Save Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="px-8 py-3 rounded-2xl bg-[#58cc02] text-white font-black uppercase text-sm border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition hover:bg-[#61e002]"
          >
            SAVE CHANGES
          </button>
          <Link
            href="/learn"
            className="px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 font-black uppercase text-sm hover:bg-gray-50 transition"
          >
            CANCEL
          </Link>
        </div>
      </div>

      {/* RIGHT COLUMN: SETTINGS MENU NAVIGATION */}
      <div className="w-full lg:w-80 shrink-0 space-y-4">
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
            Settings Navigation
          </h3>
          <nav className="space-y-1">
            <Link
              href="/settings/account"
              className="flex items-center justify-between p-3 rounded-2xl bg-[#ddf4ff] text-[#1899d6] font-black text-xs uppercase tracking-wider border-2 border-[#84d8ff]"
            >
              <span>Account</span>
              <Settings className="w-4 h-4" />
            </Link>
            <div className="flex items-center justify-between p-3 rounded-2xl text-gray-500 font-black text-xs uppercase tracking-wider hover:bg-gray-50 cursor-pointer">
              <span>Sound & Audio</span>
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl text-gray-500 font-black text-xs uppercase tracking-wider hover:bg-gray-50 cursor-pointer">
              <span>Notifications</span>
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl text-gray-500 font-black text-xs uppercase tracking-wider hover:bg-gray-50 cursor-pointer">
              <span>Super Duolingo</span>
              <Sparkles className="w-4 h-4 text-purple-500" />
            </div>
          </nav>
        </div>

        {/* Log Out Box */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs">
          <button
            onClick={() => alert("Logged out successfully!")}
            className="w-full py-2.5 rounded-2xl border-2 border-red-200 text-red-500 hover:bg-red-50 font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>LOG OUT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
