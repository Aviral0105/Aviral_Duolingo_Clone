"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowLeft, Check, Sparkles, Bell } from "lucide-react";
import { sounds } from "@/lib/sounds";
import { fetchAllUsers, registerNewUser, resetUserProgress, setActiveUserId } from "@/lib/api";
import { User } from "@/lib/types";
import DuolingoFooterLinks from "@/components/common/DuolingoFooterLinks";

interface CourseCard {
  id: string;
  name: string;
  learners: string;
  flag: string;
  isPopular?: boolean;
}

const COURSES: CourseCard[] = [
  { id: "hi", name: "Hindi", learners: "14M learners", flag: "🇮🇳", isPopular: true },
  { id: "es", name: "Spanish", learners: "42M learners", flag: "🇪🇸", isPopular: true },
  { id: "en", name: "English", learners: "30M learners", flag: "🇺🇸", isPopular: true },
  { id: "fr", name: "French", learners: "23M learners", flag: "🇫🇷" },
  { id: "chess", name: "Chess", learners: "21M learners", flag: "👑" },
  { id: "ja", name: "Japanese", learners: "18M learners", flag: "🇯🇵" },
  { id: "de", name: "German", learners: "16M learners", flag: "🇩🇪" },
  { id: "math", name: "Math", learners: "14M learners", flag: "➗" },
  { id: "it", name: "Italian", learners: "10M learners", flag: "🇮🇹" },
  { id: "zh", name: "Chinese", learners: "11M learners", flag: "🇨🇳" },
  { id: "ko", name: "Korean", learners: "12M learners", flag: "🇰🇷" },
  { id: "pt", name: "Portuguese", learners: "9M learners", flag: "🇧🇷" },
];

const CAROUSEL_LANGUAGES = [
  { name: "HINDI", flag: "🇮🇳" },
  { name: "ENGLISH", flag: "🇺🇸" },
  { name: "SPANISH", flag: "🇪🇸" },
  { name: "FRENCH", flag: "🇫🇷" },
  { name: "GERMAN", flag: "🇩🇪" },
  { name: "ITALIAN", flag: "🇮🇹" },
  { name: "PORTUGUESE", flag: "🇧🇷" },
  { name: "JAPANESE", flag: "🇯🇵" },
  { name: "CHINESE", flag: "🇨🇳" },
  { name: "CHESS", flag: "👑" },
  { name: "MATH", flag: "➗" },
];

const STEPS = [
  "landing",
  "coursePicker",
  "introDuo",
  "hdyhau",
  "learningReason",
  "opportunities",
  "proficiency",
  "achieve",
  "dailyGoal",
  "reminders",
  "placement",
  "motivation1",
  "motivation2",
  "createProfile",
  "loading"
] as const;

type Step = typeof STEPS[number];

export default function WelcomePage() {
  const router = useRouter();

  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = STEPS[stepIndex];

  // User selections
  const [selectedCourse, setSelectedCourse] = useState("hi");
  const [selectedHdyhau, setSelectedHdyhau] = useState("Friends/family");
  const [selectedReason, setSelectedReason] = useState("Connect with people");
  const [selectedProficiency, setSelectedProficiency] = useState("I'm new to Hindi");
  const [selectedGoal, setSelectedGoal] = useState("10 min / day");
  const [placementOption, setPlacementOption] = useState<"scratch" | "level">("scratch");
  const [carouselIndex, setCarouselIndex] = useState(0);

  // New Profile / Account Switcher State
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newHandle, setNewHandle] = useState("");
  const [newAvatar, setNewAvatar] = useState("🧑");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto transition for the final loading screen -> directly into learning dashboard
  useEffect(() => {
    if (currentStep === "loading") {
      const timer = setTimeout(() => {
        router.push("/learn");
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [currentStep, router]);

  const loadAllUsers = async () => {
    try {
      const users = await fetchAllUsers();
      setAllUsers(users);
    } catch {}
  };

  const handleOpenAccountModal = async () => {
    sounds.playTap();
    await loadAllUsers();
    setShowAccountModal(true);
  };

  const handleSelectUser = (userId: number) => {
    sounds.playTap();
    setActiveUserId(userId);
    setShowAccountModal(false);
    router.push("/learn");
  };

  const handleResetUser = async (userId: number) => {
    sounds.playTap();
    await resetUserProgress(userId);
    await loadAllUsers();
  };

  const handleRegisterSubmit = async () => {
    if (!newUsername.trim()) return;
    try {
      setIsSubmitting(true);
      sounds.playVictory();
      const dailyMinutes = parseInt(selectedGoal, 10) || 10;
      await registerNewUser({
        username: newUsername.trim(),
        handle: newHandle.trim() || undefined,
        avatar: newAvatar,
        daily_goal_xp: dailyMinutes,
        current_league: "Gold League",
      });
      // Move to loading step
      setStepIndex(STEPS.indexOf("loading"));
    } catch (e) {
      console.error("Registration error:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    sounds.playTap();
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    sounds.playTap();
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  // Progress calculation (excluding landing and loading)
  const activeStepCount = STEPS.length - 2;
  const currentStepNumber = Math.max(1, stepIndex);
  const progressPercent = Math.min(100, Math.round((currentStepNumber / activeStepCount) * 100));

  // Reusable Wizard Header for steps 1 through 12
  const renderHeader = () => (
    <header className="w-full max-w-4xl mx-auto px-6 py-5 flex items-center gap-6">
      <button
        onClick={handleBack}
        className="text-gray-400 hover:text-gray-700 p-1.5 rounded-xl transition hover:bg-gray-100"
      >
        <ArrowLeft className="w-6 h-6 stroke-[3]" />
      </button>
      <div className="flex-1 h-3.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#58cc02] rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );

  // Reusable Sticky Bottom Bar
  const renderFooter = (btnText = "Continue") => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 py-4 px-6 z-30">
      <div className="max-w-2xl mx-auto flex justify-end">
        <button
          onClick={handleNext}
          className="w-full sm:w-auto sm:min-w-[180px] py-3.5 px-8 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black text-sm uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 shadow-md transition"
        >
          {btnText}
        </button>
      </div>
    </div>
  );

  // Mascot with speech bubble wrapper
  const renderDuoSpeech = (text: string) => (
    <div className="flex items-center gap-4 mb-8 self-start sm:self-center">
      <div className="w-16 h-16 bg-[#58cc02] rounded-2xl border-2 border-b-4 border-[#46a302] flex flex-col items-center justify-center relative shrink-0 shadow-sm">
        <div className="flex gap-1.5 mb-0.5">
          <div className="w-3.5 h-4 bg-white rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-[#4b4b4b] rounded-full" />
          </div>
          <div className="w-3.5 h-4 bg-white rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-[#4b4b4b] rounded-full" />
          </div>
        </div>
        <div className="w-3.5 h-2.5 bg-[#ff9600] rounded-b-md" />
        <div className="absolute -bottom-1 -right-1 bg-[#ffc800] w-4 h-6 rounded-sm border border-amber-600 rotate-45 flex items-center justify-center text-[8px] font-black">
          ✏️
        </div>
      </div>
      <div className="bg-white border-2 border-gray-200 rounded-2xl px-5 py-3.5 shadow-xs relative">
        <div className="text-base sm:text-lg font-black text-[#4b4b4b]">{text}</div>
        <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-3 bg-white border-b-2 border-l-2 border-gray-200 rotate-45" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#4b4b4b] selection:bg-[#58cc02] selection:text-white">
      {/* ============================================================ */}
      {/* 0. HERO LANDING VIEW (Exact layout from video at 212s)        */}
      {/* ============================================================ */}
      {currentStep === "landing" && (
        <div className="flex-1 flex flex-col justify-between">
          <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
            <span className="text-3xl font-black text-[#58cc02] tracking-tighter cursor-pointer">
              duolingo
            </span>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#afafaf] tracking-wider cursor-pointer hover:text-gray-700 transition">
              <span>Site Language: English</span>
              <span className="text-sm">⌄</span>
            </div>
          </header>

          <main className="w-full max-w-5xl mx-auto px-6 py-8 my-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center items-center">
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
                <div className="w-48 h-48 bg-[#58cc02] rounded-[44px] shadow-2xl border-4 border-b-8 border-[#46a302] flex flex-col items-center justify-center p-4 relative z-20 group hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-14 bg-white rounded-full flex items-center justify-center border-2 border-black/10 shadow-inner">
                      <div className="w-6 h-6 bg-[#4b4b4b] rounded-full translate-x-1" />
                    </div>
                    <div className="w-12 h-14 bg-white rounded-full flex items-center justify-center border-2 border-black/10 shadow-inner">
                      <div className="w-6 h-6 bg-[#4b4b4b] rounded-full -translate-x-1" />
                    </div>
                  </div>
                  <div className="w-10 h-7 bg-[#ff9600] rounded-b-2xl border-2 border-[#e08500] shadow-md -mt-1" />
                </div>
                <div className="absolute top-2 left-6 bg-pink-100 border-2 border-pink-300 w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg transform -rotate-12 hover:rotate-0 transition">
                  <span className="text-3xl">👧🏻</span>
                </div>
                <div className="absolute top-4 right-8 bg-amber-100 border-2 border-amber-300 w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg transform rotate-12 hover:rotate-0 transition">
                  <span className="text-3xl">👳🏾‍♂️</span>
                </div>
                <div className="absolute bottom-6 left-8 bg-purple-100 border-2 border-purple-300 w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg transform rotate-6 hover:rotate-0 transition">
                  <span className="text-3xl">🧕🏽</span>
                </div>
                <div className="absolute bottom-4 right-6 bg-cyan-100 border-2 border-cyan-300 w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg transform -rotate-6 hover:rotate-0 transition">
                  <span className="text-3xl">🐻</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#4b4b4b] tracking-tight leading-[1.15] mb-8">
                The most fun way to learn languages, chess, and more!
              </h1>
              <div className="w-full max-w-sm flex flex-col gap-3.5">
                <button
                  onClick={handleNext}
                  className="w-full py-4 px-6 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black text-sm uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 shadow-lg transition"
                >
                  Get Started
                </button>
                <button
                  onClick={handleOpenAccountModal}
                  className="w-full py-3.5 px-6 rounded-2xl bg-white border-2 border-[#e5e5e5] border-b-4 text-[#1cb0f6] font-black text-sm uppercase tracking-wider hover:bg-gray-50 active:border-b-2 active:translate-y-0.5 shadow-sm text-center transition"
                >
                  I Already Have An Account
                </button>
              </div>
            </div>
          </main>

          <footer className="w-full border-t border-gray-200 py-4 px-6 space-y-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <button
                onClick={() => setCarouselIndex((prev) => Math.max(0, prev - 1))}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 overflow-hidden">
                <div
                  className="flex items-center gap-8 justify-center transition-transform duration-300"
                  style={{ transform: `translateX(-${carouselIndex * 60}px)` }}
                >
                  {CAROUSEL_LANGUAGES.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (item.name === "HINDI") setSelectedCourse("hi");
                        handleNext();
                      }}
                      className="flex items-center gap-2 text-xs font-black text-[#777777] uppercase tracking-wider hover:text-[#4b4b4b] shrink-0 group transition"
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform">
                        {item.flag}
                      </span>
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setCarouselIndex((prev) => Math.min(CAROUSEL_LANGUAGES.length - 4, prev + 1))}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Official Duolingo External Links */}
            <DuolingoFooterLinks className="pt-3 border-t border-gray-100" />
          </footer>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. COURSE PICKER                                             */}
      {/* ============================================================ */}
      {currentStep === "coursePicker" && (
        <div className="flex-1 flex flex-col justify-between">
          {renderHeader()}
          <main className="w-full max-w-3xl mx-auto px-6 py-4 flex-1 flex flex-col items-center">
            {renderDuoSpeech("What would you like to learn?")}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-28">
              {COURSES.map((course) => {
                const isSelected = selectedCourse === course.id;
                return (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourse(course.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-b-4 transition-all text-left ${
                      isSelected
                        ? "border-[#84d8ff] bg-[#ddf4ff] shadow-md -translate-y-0.5"
                        : "border-[#e5e5e5] hover:bg-gray-50 bg-white"
                    }`}
                  >
                    <span className="text-3xl shrink-0">{course.flag}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-black text-base text-[#4b4b4b]">{course.name}</span>
                      <span className="text-xs font-bold text-[#afafaf]">{course.learners}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </main>
          {renderFooter()}
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. INTRO DUO: "Hi there! I'm Duo!"                           */}
      {/* ============================================================ */}
      {currentStep === "introDuo" && (
        <div className="flex-1 flex flex-col justify-between">
          {renderHeader()}
          <main className="w-full max-w-xl mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center text-center">
            <span className="text-8xl animate-bounce mb-6">🦉👋</span>
            <h2 className="text-3xl font-black text-[#4b4b4b] mb-3">Hi there! I&apos;m Duo!</h2>
            <p className="text-base font-bold text-gray-500 max-w-md">
              I&apos;ll be your guide as we learn Hindi together step by step!
            </p>
          </main>
          {renderFooter()}
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. HDYHAU: How did you hear about Duolingo?                  */}
      {/* ============================================================ */}
      {currentStep === "hdyhau" && (
        <div className="flex-1 flex flex-col justify-between">
          {renderHeader()}
          <main className="w-full max-w-xl mx-auto px-6 py-4 flex-1 flex flex-col items-center">
            {renderDuoSpeech("How did you hear about Duolingo?")}
            <div className="w-full flex flex-col gap-3 pb-28">
              {[
                { label: "Friends / family", icon: "👥" },
                { label: "Facebook / Instagram", icon: "📱" },
                { label: "Google Search", icon: "🔍" },
                { label: "TikTok", icon: "🎵" },
                { label: "Airtel", icon: "📶" },
                { label: "Brawl Stars", icon: "🎮" },
                { label: "News / article / blog", icon: "📰" },
                { label: "TV", icon: "📺" },
              ].map((item) => {
                const isSelected = selectedHdyhau === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => setSelectedHdyhau(item.label)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-b-4 transition-all text-left ${
                      isSelected
                        ? "border-[#84d8ff] bg-[#ddf4ff] shadow-md -translate-y-0.5"
                        : "border-[#e5e5e5] hover:bg-gray-50 bg-white"
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-black text-base text-[#4b4b4b]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </main>
          {renderFooter()}
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. LEARNING REASON: Why are you learning Hindi?              */}
      {/* ============================================================ */}
      {currentStep === "learningReason" && (
        <div className="flex-1 flex flex-col justify-between">
          {renderHeader()}
          <main className="w-full max-w-xl mx-auto px-6 py-4 flex-1 flex flex-col items-center">
            {renderDuoSpeech("Why are you learning Hindi?")}
            <div className="w-full flex flex-col gap-3 pb-28">
              {[
                { label: "Connect with people", icon: "👥" },
                { label: "Spend time productively", icon: "⏱️" },
                { label: "Boost my career", icon: "💼" },
                { label: "Support my education", icon: "🎓" },
                { label: "Prepare for travel", icon: "✈️" },
                { label: "Just for fun", icon: "🎉" },
                { label: "Other", icon: "💡" },
              ].map((item) => {
                const isSelected = selectedReason === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => setSelectedReason(item.label)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-b-4 transition-all text-left ${
                      isSelected
                        ? "border-[#84d8ff] bg-[#ddf4ff] shadow-md -translate-y-0.5"
                        : "border-[#e5e5e5] hover:bg-gray-50 bg-white"
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-black text-base text-[#4b4b4b]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </main>
          {renderFooter()}
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. OPPORTUNITIES: Duo cheer                                 */}
      {/* ============================================================ */}
      {currentStep === "opportunities" && (
        <div className="flex-1 flex flex-col justify-between">
          {renderHeader()}
          <main className="w-full max-w-xl mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center text-center">
            <span className="text-8xl mb-6">🚀✨</span>
            <h2 className="text-3xl font-black text-[#4b4b4b] mb-3">
              Let&apos;s unlock new opportunities for you!
            </h2>
            <p className="text-base font-bold text-gray-500 max-w-md">
              Hindi opens doors to rich cultures, vibrant communities, and millions of friendly speakers worldwide.
            </p>
          </main>
          {renderFooter()}
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. PROFICIENCY: How much Hindi do you know?                  */}
      {/* ============================================================ */}
      {currentStep === "proficiency" && (
        <div className="flex-1 flex flex-col justify-between">
          {renderHeader()}
          <main className="w-full max-w-xl mx-auto px-6 py-4 flex-1 flex flex-col items-center">
            {renderDuoSpeech("How much Hindi do you know?")}
            <div className="w-full flex flex-col gap-3 pb-28">
              {[
                { label: "I'm new to Hindi", desc: "Start right from the basics" },
                { label: "I know some common words", desc: "Know a few greetings and food names" },
                { label: "I can have basic conversations", desc: "Can introduce myself and ask questions" },
                { label: "I can talk about various topics", desc: "Comfortable with intermediate grammar" },
                { label: "I can discuss most topics in detail", desc: "Fluent speaker seeking mastery" },
              ].map((item) => {
                const isSelected = selectedProficiency === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => setSelectedProficiency(item.label)}
                    className={`flex flex-col p-4 rounded-2xl border-2 border-b-4 transition-all text-left ${
                      isSelected
                        ? "border-[#84d8ff] bg-[#ddf4ff] shadow-md -translate-y-0.5"
                        : "border-[#e5e5e5] hover:bg-gray-50 bg-white"
                    }`}
                  >
                    <span className="font-black text-base text-[#4b4b4b]">{item.label}</span>
                    <span className="text-xs font-bold text-[#afafaf] mt-0.5">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </main>
          {renderFooter()}
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. ACHIEVE: Here's what you can achieve!                     */}
      {/* ============================================================ */}
      {currentStep === "achieve" && (
        <div className="flex-1 flex flex-col justify-between">
          {renderHeader()}
          <main className="w-full max-w-xl mx-auto px-6 py-4 flex-1 flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-black text-[#4b4b4b] mb-6 text-center">
              Here&apos;s what you can achieve!
            </h2>
            <div className="w-full flex flex-col gap-4 pb-28">
              <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-200 bg-emerald-50/50">
                <span className="text-3xl">🗣️</span>
                <div>
                  <h3 className="font-black text-base text-gray-800">Converse with confidence</h3>
                  <p className="text-xs font-bold text-gray-500">Stress-free speaking and listening exercises</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-200 bg-blue-50/50">
                <span className="text-3xl">📚</span>
                <div>
                  <h3 className="font-black text-base text-gray-800">Build a large vocabulary</h3>
                  <p className="text-xs font-bold text-gray-500">Common words and practical everyday phrases</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-200 bg-amber-50/50">
                <span className="text-3xl">⏰</span>
                <div>
                  <h3 className="font-black text-base text-gray-800">Develop a learning habit</h3>
                  <p className="text-xs font-bold text-gray-500">Smart reminders, streaks, and fun challenges</p>
                </div>
              </div>
            </div>
          </main>
          {renderFooter()}
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. DAILY GOAL: What's your daily learning goal?              */}
      {/* ============================================================ */}
      {currentStep === "dailyGoal" && (
        <div className="flex-1 flex flex-col justify-between">
          {renderHeader()}
          <main className="w-full max-w-xl mx-auto px-6 py-4 flex-1 flex flex-col items-center">
            {renderDuoSpeech("What's your daily learning goal?")}
            <p className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider mb-4">
              That&apos;s 50 words in your first week!
            </p>
            <div className="w-full flex flex-col gap-3 pb-28">
              {[
                { time: "5 min / day", tag: "Casual", icon: "⚡" },
                { time: "10 min / day", tag: "Regular", icon: "🎯" },
                { time: "15 min / day", tag: "Serious", icon: "🔥" },
                { time: "20 min / day", tag: "Intense", icon: "🚀" },
              ].map((item) => {
                const isSelected = selectedGoal === item.time;
                return (
                  <button
                    key={item.time}
                    onClick={() => setSelectedGoal(item.time)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 border-b-4 transition-all text-left ${
                      isSelected
                        ? "border-[#84d8ff] bg-[#ddf4ff] shadow-md -translate-y-0.5"
                        : "border-[#e5e5e5] hover:bg-gray-50 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-black text-base text-[#4b4b4b]">{item.time}</span>
                    </div>
                    <span className="text-xs font-black uppercase text-[#afafaf]">{item.tag}</span>
                  </button>
                );
              })}
            </div>
          </main>
          {renderFooter()}
        </div>
      )}

      {/* ============================================================ */}
      {/* 9. REMINDERS: Notifications prompt                          */}
      {/* ============================================================ */}
      {currentStep === "reminders" && (
        <div className="flex-1 flex flex-col justify-between">
          {renderHeader()}
          <main className="w-full max-w-xl mx-auto px-6 py-8 flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-sm">
              <Bell className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#4b4b4b] mb-3">
              I&apos;ll remind you to practice so it becomes a habit!
            </h2>
            <p className="text-sm font-bold text-gray-500 max-w-sm mb-6">
              Learners who turn on daily reminders are 3x more likely to finish their language course.
            </p>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 w-full max-w-sm flex items-center justify-between">
              <div className="text-left">
                <div className="text-xs font-black text-gray-700">Daily Notifications</div>
                <div className="text-[10px] font-bold text-gray-400">Personalized smart nudges</div>
              </div>
              <span className="bg-[#58cc02] text-white px-3 py-1 rounded-xl text-xs font-black">
                ENABLED
              </span>
            </div>
          </main>
          {renderFooter()}
        </div>
      )}

      {/* ============================================================ */}
      {/* 10. PLACEMENT: Start from scratch vs Find my level           */}
      {/* ============================================================ */}
      {currentStep === "placement" && (
        <div className="flex-1 flex flex-col justify-between">
          {renderHeader()}
          <main className="w-full max-w-xl mx-auto px-6 py-4 flex-1 flex flex-col items-center">
            {renderDuoSpeech("Now let's find the best place to start!")}
            <div className="w-full flex flex-col gap-4 pb-28">
              <button
                onClick={() => setPlacementOption("scratch")}
                className={`flex items-center gap-5 p-5 rounded-2xl border-2 border-b-4 transition-all text-left ${
                  placementOption === "scratch"
                    ? "border-[#84d8ff] bg-[#ddf4ff] shadow-md -translate-y-0.5"
                    : "border-[#e5e5e5] hover:bg-gray-50 bg-white"
                }`}
              >
                <div className="w-14 h-16 bg-[#ffc800] rounded-xl border-2 border-b-4 border-[#e5a800] flex flex-col items-center justify-center text-white shrink-0 shadow-xs">
                  <span className="text-xs font-black uppercase opacity-90">📖</span>
                  <span className="text-2xl font-black mt-0.5 text-[#78350f]">1</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg text-[#1cb0f6]">Start from scratch</span>
                  <span className="text-xs font-bold text-[#777777]">
                    Take the easiest lesson of the Hindi course
                  </span>
                </div>
              </button>

              <button
                onClick={() => setPlacementOption("level")}
                className={`flex items-center gap-5 p-5 rounded-2xl border-2 border-b-4 transition-all text-left ${
                  placementOption === "level"
                    ? "border-[#84d8ff] bg-[#ddf4ff] shadow-md -translate-y-0.5"
                    : "border-[#e5e5e5] hover:bg-gray-50 bg-white"
                }`}
              >
                <div className="w-14 h-16 bg-[#1cb0f6] rounded-xl border-2 border-b-4 border-[#1899d6] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <span className="text-3xl">🧭</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg text-[#4b4b4b]">Find my level</span>
                  <span className="text-xs font-bold text-[#777777]">
                    Let Duo recommend where you should start learning
                  </span>
                </div>
              </button>
            </div>
          </main>
          {renderFooter()}
        </div>
      )}

      {/* ============================================================ */}
      {/* 11. MOTIVATION 1: "It can be hard to stay motivated..."     */}
      {/* ============================================================ */}
      {currentStep === "motivation1" && (
        <div className="flex-1 flex flex-col justify-between">
          {renderHeader()}
          <main className="w-full max-w-xl mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center text-center">
            <span className="text-8xl mb-6">🧘🏽‍♂️✨</span>
            <h2 className="text-3xl font-black text-[#4b4b4b] mb-3">
              It can be hard to stay motivated...
            </h2>
            <p className="text-base font-bold text-gray-500 max-w-md">
              We know learning a new script and vocabulary can feel challenging at first.
            </p>
          </main>
          {renderFooter()}
        </div>
      )}

      {/* ============================================================ */}
      {/* 12. MOTIVATION 2: "...so Duolingo is designed like a game!"  */}
      {/* ============================================================ */}
      {currentStep === "motivation2" && (
        <div className="flex-1 flex flex-col justify-between">
          {renderHeader()}
          <main className="w-full max-w-xl mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center text-center">
            <span className="text-8xl mb-6">🎮🦉</span>
            <h2 className="text-3xl font-black text-[#4b4b4b] mb-3">
              ...so Duolingo is designed to be fun like a game!
            </h2>
            <p className="text-base font-bold text-gray-500 max-w-md">
              Earn XP, maintain daily streaks, and learn through interactive bite-sized challenges!
            </p>
          </main>
          {renderFooter("Let's Go!")}
        </div>
      )}

      {/* ============================================================ */}
      {/* 13. CREATE PROFILE (Fresh user creation with 0 stats)       */}
      {/* ============================================================ */}
      {currentStep === "createProfile" && (
        <div className="flex-1 flex flex-col justify-between">
          {renderHeader()}
          <main className="w-full max-w-md mx-auto px-6 py-6 flex-1 flex flex-col items-center">
            {renderDuoSpeech("Create your profile to start learning!")}

            <div className="w-full bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
              {/* Avatar Selector */}
              <div>
                <label className="text-xs font-black uppercase text-gray-500 mb-2 block">
                  Choose your avatar
                </label>
                <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                  {["🧑", "👦🏻", "👧🏽", "👩🏽", "🧔🏻", "🧕🏽", "🦉"].map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setNewAvatar(av)}
                      className={`w-11 h-11 rounded-2xl border-2 text-2xl flex items-center justify-center transition active:scale-95 ${
                        newAvatar === av
                          ? "border-[#58cc02] bg-emerald-50 ring-2 ring-[#58cc02]/30 scale-105"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="text-xs font-black uppercase text-gray-500 mb-1.5 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#58cc02] focus:outline-none font-bold text-sm text-gray-800"
                />
              </div>

              {/* Username / Handle Input */}
              <div>
                <label className="text-xs font-black uppercase text-gray-500 mb-1.5 block">
                  Username (optional)
                </label>
                <input
                  type="text"
                  value={newHandle}
                  onChange={(e) => setNewHandle(e.target.value)}
                  placeholder="e.g. @aarav123"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#58cc02] focus:outline-none font-bold text-sm text-gray-800"
                />
              </div>

              {/* Initial Tier & Stats Summary */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-xs font-black text-amber-900">
                  <span>Starting League:</span>
                  <span>Gold League 🥇 (Tier 3)</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-700">
                  <span>Starting Stats:</span>
                  <span>0 XP · 0 Streak · 5 Hearts · 100 Gems</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleRegisterSubmit}
                disabled={!newUsername.trim() || isSubmitting}
                className="w-full py-4 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black text-sm uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating Profile..." : "CREATE PROFILE"}
              </button>
            </div>
          </main>
        </div>
      )}

      {/* ============================================================ */}
      {/* 14. LOADING SCREEN (transitions into Lesson Dashboard)       */}
      {/* ============================================================ */}
      {currentStep === "loading" && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
          <span className="text-8xl animate-bounce mb-6">🦉</span>
          <h2 className="text-2xl font-black text-gray-800 tracking-wider uppercase mb-2">
            Setting Up Your Course...
          </h2>
          <p className="text-sm font-bold text-gray-400 max-w-sm">
            Protip: Repeat each sentence in a lesson out loud!
          </p>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ACCOUNT SWITCHER / WELCOME BACK (Inspect all IDs)    */}
      {/* ============================================================ */}
      {showAccountModal && (
        <div
          onClick={() => setShowAccountModal(false)}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-gray-200 relative animate-scale-up max-h-[90vh] overflow-y-auto space-y-5"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-xl font-black text-gray-800">Welcome Back!</h3>
                <p className="text-xs font-bold text-gray-400">
                  Select an account from the database ({allUsers.length} total IDs)
                </p>
              </div>
              <button
                onClick={() => setShowAccountModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 font-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* List of registered accounts */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {allUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-3.5 rounded-2xl border-2 border-gray-200 hover:border-[#1cb0f6] bg-gray-50/50 flex items-center justify-between gap-3 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-3xl shrink-0">{u.avatar || "🧑"}</span>
                    <div className="truncate">
                      <div className="font-black text-sm text-gray-800 truncate flex items-center gap-1.5">
                        <span>{u.username}</span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                          ID: {u.id}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 font-bold mt-0.5">
                        {u.handle} · {u.xp} XP · {u.streak}🔥 · {u.gems}💎
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleSelectUser(u.id)}
                      className="px-3.5 py-2 rounded-xl bg-[#58cc02] text-white text-xs font-black uppercase tracking-wider hover:brightness-105 active:scale-95 transition"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => handleResetUser(u.id)}
                      title="Reset progress to 0 XP"
                      className="px-2.5 py-2 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 text-xs font-black transition"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="pt-2 border-t flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowAccountModal(false);
                  setStepIndex(STEPS.indexOf("createProfile"));
                }}
                className="w-full py-3.5 rounded-2xl border-2 border-[#58cc02] text-[#58cc02] hover:bg-emerald-50 text-xs font-black uppercase tracking-wider transition"
              >
                + Create Another Fresh ID
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
