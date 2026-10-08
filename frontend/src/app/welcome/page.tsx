"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LanguageCourse {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  learners: string;
  color: string;
}

const COURSES: LanguageCourse[] = [
  { id: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", learners: "12.4M", color: "#ff9600" },
  { id: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", learners: "38.5M", color: "#ff4b4b" },
  { id: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", learners: "24.2M", color: "#1cb0f6" },
  { id: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", learners: "16.1M", color: "#ffc800" },
  { id: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", learners: "15.3M", color: "#ce82ff" },
  { id: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", learners: "9.8M", color: "#2b70c9" },
  { id: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳", learners: "11.0M", color: "#e53e3e" },
  { id: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", learners: "14.1M", color: "#22c55e" },
];

export default function WelcomePage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("hi");
  const [showPlacementModal, setShowPlacementModal] = useState<boolean>(false);
  const [step, setStep] = useState<"reason" | "goal" | "placement">("reason");
  const [selectedReason, setSelectedReason] = useState<string>("brain");
  const [dailyGoal, setDailyGoal] = useState<string>("10");

  const handleStartPlacement = () => {
    setShowPlacementModal(true);
    setStep("reason");
  };

  const handleFinishOnboarding = () => {
    router.push("/learn");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#4b4b4b] selection:bg-[#58cc02] selection:text-white">
      {/* 1. TOP HEADER */}
      <header className="w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <Link href="/welcome" className="flex items-center gap-2 group">
          <span className="text-3xl font-black text-[#58cc02] tracking-tighter">duolingo</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-xs font-black uppercase text-[#afafaf] tracking-wider hidden sm:block">
            Site Language: <span className="text-[#4b4b4b]">English</span>
          </div>
          <Link
            href="/learn"
            className="px-4 py-2 rounded-2xl border-2 border-[#e5e5e5] border-b-4 font-black text-xs text-[#1cb0f6] uppercase tracking-wider hover:bg-gray-50 active:border-b-2 active:translate-y-0.5 transition"
          >
            Direct to App
          </Link>
        </div>
      </header>

      {/* 2. HERO PRESENTATION */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 md:py-16 flex flex-col items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center my-auto">
          {/* Hero Illustration */}
          <div className="flex justify-center items-center relative">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Animated Floating Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-100 to-emerald-200 blur-2xl opacity-60 animate-pulse" />
              
              {/* Mascot Vector representation */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-44 h-44 sm:w-52 sm:h-52 bg-[#58cc02] rounded-[48px] shadow-2xl border-4 border-b-8 border-[#46a302] flex flex-col items-center justify-center p-4 relative group hover:scale-105 transition-transform duration-300">
                  {/* Duo Face */}
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-14 bg-white rounded-full flex items-center justify-center border-2 border-black/10 shadow-inner">
                      <div className="w-6 h-6 bg-[#4b4b4b] rounded-full translate-x-1" />
                    </div>
                    <div className="w-12 h-14 bg-white rounded-full flex items-center justify-center border-2 border-black/10 shadow-inner">
                      <div className="w-6 h-6 bg-[#4b4b4b] rounded-full -translate-x-1" />
                    </div>
                  </div>
                  {/* Orange Beak */}
                  <div className="w-10 h-7 bg-[#ff9600] rounded-b-2xl border-2 border-[#e08500] shadow-md -mt-1" />
                  {/* Cheerful Badge */}
                  <div className="absolute -bottom-3 bg-[#ffc800] text-[#78350f] text-[10px] font-black uppercase px-3 py-0.5 rounded-full border-2 border-[#b45309] shadow-sm">
                    Ready to learn
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Pitch & Call to Actions */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#4b4b4b] tracking-tight leading-tight mb-8">
              The free, fun, and effective way to learn a language!
            </h1>

            <div className="w-full max-w-sm flex flex-col gap-3">
              {/* Primary: GET STARTED */}
              <button
                onClick={handleStartPlacement}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black text-sm uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 shadow-lg transition"
              >
                Get Started
              </button>

              {/* Secondary: I ALREADY HAVE AN ACCOUNT */}
              <Link
                href="/learn"
                className="w-full py-3.5 px-6 rounded-2xl bg-white border-2 border-[#e5e5e5] border-b-4 text-[#1cb0f6] font-black text-sm uppercase tracking-wider hover:bg-gray-50 active:border-b-2 active:translate-y-0.5 shadow-sm text-center transition"
              >
                I Already Have An Account
              </Link>
            </div>
          </div>
        </div>

        {/* 3. LANGUAGE PICKER RIBBON */}
        <section className="w-full mt-16 pt-10 border-t border-gray-100 flex flex-col items-center">
          <div className="text-xs font-black uppercase text-[#afafaf] tracking-widest mb-6">
            Choose a language to start learning
          </div>

          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
            {COURSES.map((course) => {
              const isSelected = selectedLanguage === course.id;
              return (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedLanguage(course.id);
                    setShowPlacementModal(true);
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 border-b-4 transition-all text-left group ${
                    isSelected
                      ? "border-[#58cc02] bg-green-50/50 shadow-md translate-y-[-2px]"
                      : "border-[#e5e5e5] hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-3xl drop-shadow-sm group-hover:scale-110 transition-transform">
                    {course.flag}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-black text-sm text-[#4b4b4b] truncate">{course.name}</span>
                    <span className="text-[11px] font-bold text-[#afafaf] truncate">{course.learners} learners</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. VALUE PROPOSITION PILLARS */}
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-10 border-t border-gray-100">
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
            <span className="text-3xl mb-3">🔥</span>
            <h3 className="font-black text-base text-[#4b4b4b] mb-1">Effective & bite-sized</h3>
            <p className="text-xs text-[#777777] font-medium leading-relaxed">
              Our lessons make learning fun with game-like features and personalized practice.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
            <span className="text-3xl mb-3">🧠</span>
            <h3 className="font-black text-base text-[#4b4b4b] mb-1">Backed by science</h3>
            <p className="text-xs text-[#777777] font-medium leading-relaxed">
              We use research-proven teaching methods designed to foster long-term retention.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
            <span className="text-3xl mb-3">🏆</span>
            <h3 className="font-black text-base text-[#4b4b4b] mb-1">Stay motivated</h3>
            <p className="text-xs text-[#777777] font-medium leading-relaxed">
              Earn rewards, unlock new levels, and compete on the leaderboard with friends.
            </p>
          </div>
        </section>
      </main>

      {/* 5. ONBOARDING & PLACEMENT MODAL */}
      {showPlacementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-gray-200 relative animate-scale-up">
            {/* Close Button */}
            <button
              onClick={() => setShowPlacementModal(false)}
              className="absolute top-5 right-5 text-[#afafaf] hover:text-[#4b4b4b] font-black text-lg p-1 transition"
            >
              ✕
            </button>

            {/* STEP 1: REASON */}
            {step === "reason" && (
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🇮🇳</span>
                  <div>
                    <h2 className="text-xl font-black text-[#4b4b4b]">Why learn Hindi?</h2>
                    <p className="text-xs font-bold text-[#afafaf]">Help us personalize your experience</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 my-4">
                  {[
                    { id: "brain", label: "Brain training & mental fitness", icon: "🧠" },
                    { id: "travel", label: "Travel & explore India", icon: "✈️" },
                    { id: "career", label: "Career & professional opportunities", icon: "💼" },
                    { id: "culture", label: "Culture, Bollywood & literature", icon: "🎬" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedReason(item.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 border-b-4 font-bold text-sm text-left transition ${
                        selectedReason === item.id
                          ? "border-[#58cc02] bg-green-50 text-[#58cc02]"
                          : "border-[#e5e5e5] hover:bg-gray-50 text-[#4b4b4b]"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-extrabold">{item.label}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep("goal")}
                  className="mt-4 w-full py-3.5 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black text-sm uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 transition"
                >
                  Continue
                </button>
              </div>
            )}

            {/* STEP 2: DAILY GOAL */}
            {step === "goal" && (
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <h2 className="text-xl font-black text-[#4b4b4b]">Choose a daily goal</h2>
                    <p className="text-xs font-bold text-[#afafaf]">You can always change this later</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 my-4">
                  {[
                    { id: "5", label: "Casual", time: "5 mins / day" },
                    { id: "10", label: "Regular", time: "10 mins / day" },
                    { id: "15", label: "Serious", time: "15 mins / day" },
                    { id: "20", label: "Intense", time: "20 mins / day" },
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setDailyGoal(goal.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border-2 border-b-4 font-bold text-sm transition ${
                        dailyGoal === goal.id
                          ? "border-[#58cc02] bg-green-50 text-[#58cc02]"
                          : "border-[#e5e5e5] hover:bg-gray-50 text-[#4b4b4b]"
                      }`}
                    >
                      <span className="font-extrabold">{goal.label}</span>
                      <span className="text-xs text-[#afafaf]">{goal.time}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setStep("reason")}
                    className="w-1/3 py-3.5 rounded-2xl bg-white border-2 border-[#e5e5e5] border-b-4 text-[#afafaf] font-black text-sm uppercase tracking-wider hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep("placement")}
                    className="w-2/3 py-3.5 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black text-sm uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 transition"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PLACEMENT SELECTION */}
            {step === "placement" && (
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🧭</span>
                  <div>
                    <h2 className="text-xl font-black text-[#4b4b4b]">Where do you want to start?</h2>
                    <p className="text-xs font-bold text-[#afafaf]">Pick the starting point that fits you</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 my-4">
                  <button
                    onClick={handleFinishOnboarding}
                    className="p-4 rounded-2xl border-2 border-[#58cc02] bg-green-50/50 border-b-4 text-left hover:brightness-95 transition group"
                  >
                    <div className="font-black text-sm text-[#58cc02] mb-0.5">
                      Learning Hindi for the first time?
                    </div>
                    <div className="text-xs text-[#777777] font-medium">
                      Start from the very beginning with basic letters, words, and simple sentences.
                    </div>
                  </button>

                  <button
                    onClick={handleFinishOnboarding}
                    className="p-4 rounded-2xl border-2 border-[#e5e5e5] border-b-4 text-left hover:bg-gray-50 transition group"
                  >
                    <div className="font-black text-sm text-[#4b4b4b] mb-0.5">
                      Already know some Hindi?
                    </div>
                    <div className="text-xs text-[#777777] font-medium">
                      Take a quick placement check to jump ahead to your real proficiency level.
                    </div>
                  </button>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setStep("goal")}
                    className="w-1/3 py-3.5 rounded-2xl bg-white border-2 border-[#e5e5e5] border-b-4 text-[#afafaf] font-black text-sm uppercase tracking-wider hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinishOnboarding}
                    className="w-2/3 py-3.5 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black text-sm uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 transition"
                  >
                    Start Learning
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. AUTHENTIC FOOTER */}
      <footer className="w-full bg-[#58cc02] text-white py-8 px-6 mt-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight">duolingo</span>
            <span className="opacity-80">Clone • Round 2 Engineering Submission</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/90">
            <Link href="/learn" className="hover:underline">Learn</Link>
            <Link href="/characters" className="hover:underline">Letters</Link>
            <Link href="/leaderboard" className="hover:underline">Leaderboard</Link>
            <Link href="/quests" className="hover:underline">Quests</Link>
            <Link href="/shop" className="hover:underline">Shop</Link>
            <Link href="/profile" className="hover:underline">Profile</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
