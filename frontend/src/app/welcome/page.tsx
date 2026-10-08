"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

interface CourseCard {
  id: string;
  name: string;
  learners: string;
  flag: string;
  isPopular?: boolean;
}

const COURSES: CourseCard[] = [
  { id: "es", name: "Spanish", learners: "42M learners", flag: "🇪🇸", isPopular: true },
  { id: "en", name: "English", learners: "30M learners", flag: "🇺🇸", isPopular: true },
  { id: "fr", name: "French", learners: "23M learners", flag: "🇫🇷" },
  { id: "chess", name: "Chess", learners: "21M learners", flag: "👑" },
  { id: "ja", name: "Japanese", learners: "18M learners", flag: "🇯🇵" },
  { id: "de", name: "German", learners: "16M learners", flag: "🇩🇪" },
  { id: "math", name: "Math", learners: "14M learners", flag: "➗" },
  { id: "hi", name: "Hindi", learners: "12M learners", flag: "🇮🇳", isPopular: true },
  { id: "it", name: "Italian", learners: "10M learners", flag: "🇮🇹" },
  { id: "zh", name: "Chinese", learners: "11M learners", flag: "🇨🇳" },
  { id: "ko", name: "Korean", learners: "14M learners", flag: "🇰🇷" },
  { id: "pt", name: "Portuguese", learners: "9M learners", flag: "🇧🇷" },
];

const CAROUSEL_LANGUAGES = [
  { name: "ENGLISH", flag: "🇺🇸" },
  { name: "CHESS", flag: "👑" },
  { name: "MATH", flag: "➗" },
  { name: "SPANISH", flag: "🇪🇸" },
  { name: "FRENCH", flag: "🇫🇷" },
  { name: "GERMAN", flag: "🇩🇪" },
  { name: "ITALIAN", flag: "🇮🇹" },
  { name: "PORTUGUESE", flag: "🇧🇷" },
  { name: "HINDI", flag: "🇮🇳" },
  { name: "JAPANESE", flag: "🇯🇵" },
  { name: "CHINESE", flag: "🇨🇳" },
];

export default function WelcomePage() {
  const router = useRouter();

  // Current view mode: 'landing' (hero), 'coursePicker' (Step 1), 'placement' (Step 2)
  const [currentStep, setCurrentStep] = useState<"landing" | "coursePicker" | "placement">("landing");
  const [selectedCourse, setSelectedCourse] = useState<string>("hi"); // Default to Hindi
  const [placementOption, setPlacementOption] = useState<"scratch" | "level">("scratch");
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleNextStep = () => {
    if (currentStep === "coursePicker") {
      setCurrentStep("placement");
    } else if (currentStep === "placement") {
      // Direct transition to Hindi 1 lesson
      router.push("/lesson/1");
    }
  };

  const handleBack = () => {
    if (currentStep === "placement") {
      setCurrentStep("coursePicker");
    } else if (currentStep === "coursePicker") {
      setCurrentStep("landing");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#4b4b4b] selection:bg-[#58cc02] selection:text-white">
      {/* ============================================================ */}
      {/* 1. HERO LANDING VIEW (Exactly as shown in video at 212s)     */}
      {/* ============================================================ */}
      {currentStep === "landing" && (
        <div className="flex-1 flex flex-col justify-between">
          {/* Header */}
          <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-[#58cc02] tracking-tighter cursor-pointer">
                duolingo
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#afafaf] tracking-wider cursor-pointer hover:text-gray-700 transition">
              <span>Site Language: English</span>
              <span className="text-sm">⌄</span>
            </div>
          </header>

          {/* Hero Content */}
          <main className="w-full max-w-5xl mx-auto px-6 py-8 my-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Duolingo Characters Ensemble Vector */}
            <div className="flex justify-center items-center">
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
                {/* Duo Big Owl Centerpiece */}
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

                {/* Floating Character Badges Around Duo */}
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

            {/* Right: Pitch & 3D Action Buttons */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#4b4b4b] tracking-tight leading-[1.15] mb-8">
                The most fun way to learn languages, chess, and more!
              </h1>

              <div className="w-full max-w-sm flex flex-col gap-3.5">
                {/* GET STARTED */}
                <button
                  onClick={() => setCurrentStep("coursePicker")}
                  className="w-full py-4 px-6 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black text-sm uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 shadow-lg transition"
                >
                  Get Started
                </button>

                {/* I ALREADY HAVE AN ACCOUNT */}
                <Link
                  href="/learn"
                  className="w-full py-3.5 px-6 rounded-2xl bg-white border-2 border-[#e5e5e5] border-b-4 text-[#1cb0f6] font-black text-sm uppercase tracking-wider hover:bg-gray-50 active:border-b-2 active:translate-y-0.5 shadow-sm text-center transition"
                >
                  I Already Have An Account
                </Link>
              </div>
            </div>
          </main>

          {/* Bottom Scrolling Language Ribbon (Exact layout from video 212s) */}
          <footer className="w-full border-t border-gray-200 py-4 px-6">
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
                        setCurrentStep("coursePicker");
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
          </footer>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. STEP 1: COURSE PICKER (Exact layout from video 0s - 38s)    */}
      {/* ============================================================ */}
      {currentStep === "coursePicker" && (
        <div className="flex-1 flex flex-col justify-between">
          {/* Header with Back Arrow and Progress Bar */}
          <header className="w-full max-w-4xl mx-auto px-6 py-6 flex items-center gap-6">
            <button
              onClick={handleBack}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-xl transition"
            >
              <ArrowLeft className="w-6 h-6 stroke-[3]" />
            </button>
            <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#58cc02] rounded-full transition-all duration-300 w-1/4" />
            </div>
          </header>

          {/* Main Content Area */}
          <main className="w-full max-w-3xl mx-auto px-6 py-4 flex-1 flex flex-col items-center">
            {/* Duo with speech bubble */}
            <div className="flex items-center gap-4 mb-8 self-start sm:self-center">
              <div className="w-16 h-16 bg-[#58cc02] rounded-2xl border-2 border-b-4 border-[#46a302] flex flex-col items-center justify-center relative shrink-0">
                <div className="flex gap-1.5 mb-0.5">
                  <div className="w-3.5 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#4b4b4b] rounded-full" />
                  </div>
                  <div className="w-3.5 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#4b4b4b] rounded-full" />
                  </div>
                </div>
                <div className="w-3.5 h-2.5 bg-[#ff9600] rounded-b-md" />
                {/* Yellow pencil in wing */}
                <div className="absolute -bottom-1 -right-1 bg-[#ffc800] w-4 h-6 rounded-sm border border-amber-600 rotate-45 flex items-center justify-center text-[8px] font-black">
                  ✏️
                </div>
              </div>

              {/* Speech bubble */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl px-5 py-3.5 shadow-xs relative">
                <div className="text-base sm:text-lg font-black text-[#4b4b4b]">
                  What would you like to learn?
                </div>
                {/* Speech arrow */}
                <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-3 bg-white border-b-2 border-l-2 border-gray-200 rotate-45" />
              </div>
            </div>

            {/* 2-Column Course Selection Grid */}
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
                    <span className="text-3xl shrink-0 drop-shadow-xs">{course.flag}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-black text-base text-[#4b4b4b]">{course.name}</span>
                      <span className="text-xs font-bold text-[#afafaf]">{course.learners}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </main>

          {/* Sticky Bottom Continue Bar (Matching video) */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 py-5 px-6 z-30">
            <div className="max-w-3xl mx-auto flex justify-end">
              <button
                onClick={handleNextStep}
                className="w-full sm:w-auto sm:min-w-[160px] py-3.5 px-8 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black text-sm uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 shadow-md transition"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. STEP 2: PLACEMENT LEVEL (Exact layout from video at 38s)   */}
      {/* ============================================================ */}
      {currentStep === "placement" && (
        <div className="flex-1 flex flex-col justify-between">
          {/* Header with Back Arrow and Progress Bar */}
          <header className="w-full max-w-4xl mx-auto px-6 py-6 flex items-center gap-6">
            <button
              onClick={handleBack}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-xl transition"
            >
              <ArrowLeft className="w-6 h-6 stroke-[3]" />
            </button>
            <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#58cc02] rounded-full transition-all duration-300 w-1/2" />
            </div>
          </header>

          {/* Main Content Area */}
          <main className="w-full max-w-xl mx-auto px-6 py-4 flex-1 flex flex-col items-center">
            {/* Duo with speech bubble */}
            <div className="flex items-center gap-4 mb-10 self-start sm:self-center">
              <div className="w-16 h-16 bg-[#58cc02] rounded-2xl border-2 border-b-4 border-[#46a302] flex flex-col items-center justify-center relative shrink-0">
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

              {/* Speech bubble */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl px-5 py-3.5 shadow-xs relative">
                <div className="text-base sm:text-lg font-black text-[#4b4b4b]">
                  Now let's find the best place to start!
                </div>
                <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-3 bg-white border-b-2 border-l-2 border-gray-200 rotate-45" />
              </div>
            </div>

            {/* Two Large Placement Cards (Exact cards from video 38s) */}
            <div className="w-full flex flex-col gap-4 pb-28">
              {/* Card 1: Start from scratch */}
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

              {/* Card 2: Find my level */}
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

          {/* Sticky Bottom Continue Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 py-5 px-6 z-30">
            <div className="max-w-xl mx-auto flex justify-end">
              <button
                onClick={handleNextStep}
                className="w-full sm:w-auto sm:min-w-[160px] py-3.5 px-8 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black text-sm uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 shadow-md transition"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
