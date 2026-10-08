"use client";

import { useState } from "react";
import Link from "next/link";
import { Volume2, Sparkles, CheckCircle2, ChevronRight, Zap } from "lucide-react";

interface Letter {
  char: string;
  translit: string;
  type: "vowel" | "consonant";
  mastery: number; // 0 to 3
}

const HINDI_LETTERS: Letter[] = [
  // Vowels (स्वर)
  { char: "अ", translit: "a", type: "vowel", mastery: 3 },
  { char: "आ", translit: "aa", type: "vowel", mastery: 3 },
  { char: "इ", translit: "i", type: "vowel", mastery: 2 },
  { char: "ई", translit: "ee", type: "vowel", mastery: 2 },
  { char: "उ", translit: "u", type: "vowel", mastery: 3 },
  { char: "ऊ", translit: "oo", type: "vowel", mastery: 1 },
  { char: "ए", translit: "e", type: "vowel", mastery: 2 },
  { char: "ऐ", translit: "ai", type: "vowel", mastery: 2 },
  { char: "ओ", translit: "o", type: "vowel", mastery: 2 },
  { char: "औ", translit: "au", type: "vowel", mastery: 1 },
  { char: "अं", translit: "am", type: "vowel", mastery: 1 },
  { char: "अः", translit: "ah", type: "vowel", mastery: 0 },

  // Consonants (व्यंजन)
  { char: "क", translit: "ka", type: "consonant", mastery: 3 },
  { char: "ख", translit: "kha", type: "consonant", mastery: 3 },
  { char: "ग", translit: "ga", type: "consonant", mastery: 3 },
  { char: "घ", translit: "gha", type: "consonant", mastery: 2 },
  { char: "च", translit: "cha", type: "consonant", mastery: 3 },
  { char: "छ", translit: "chha", type: "consonant", mastery: 2 },
  { char: "ज", translit: "ja", type: "consonant", mastery: 3 },
  { char: "झ", translit: "jha", type: "consonant", mastery: 1 },
  { char: "ट", translit: "ta", type: "consonant", mastery: 2 },
  { char: "ठ", translit: "tha", type: "consonant", mastery: 1 },
  { char: "ड", translit: "da", type: "consonant", mastery: 2 },
  { char: "ढ", translit: "dha", type: "consonant", mastery: 1 },
  { char: "त", translit: "ta", type: "consonant", mastery: 3 },
  { char: "थ", translit: "tha", type: "consonant", mastery: 2 },
  { char: "द", translit: "da", type: "consonant", mastery: 3 },
  { char: "ध", translit: "dha", type: "consonant", mastery: 2 },
  { char: "न", translit: "na", type: "consonant", mastery: 3 },
  { char: "प", translit: "pa", type: "consonant", mastery: 3 },
  { char: "फ", translit: "pha", type: "consonant", mastery: 2 },
  { char: "ब", translit: "ba", type: "consonant", mastery: 3 },
  { char: "भ", translit: "bha", type: "consonant", mastery: 2 },
  { char: "म", translit: "ma", type: "consonant", mastery: 3 },
  { char: "य", translit: "ya", type: "consonant", mastery: 2 },
  { char: "र", translit: "ra", type: "consonant", mastery: 3 },
  { char: "ल", translit: "la", type: "consonant", mastery: 3 },
  { char: "व", translit: "va", type: "consonant", mastery: 2 },
  { char: "श", translit: "sha", type: "consonant", mastery: 2 },
  { char: "ष", translit: "shha", type: "consonant", mastery: 1 },
  { char: "स", translit: "sa", type: "consonant", mastery: 3 },
  { char: "ह", translit: "ha", type: "consonant", mastery: 3 },
];

export default function CharactersPage() {
  const [filter, setFilter] = useState<"all" | "vowel" | "consonant">("all");
  const [activeChar, setActiveChar] = useState<string | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const filteredLetters = HINDI_LETTERS.filter((l) =>
    filter === "all" ? true : l.type === filter
  );

  const speakLetter = (letter: Letter) => {
    setActiveChar(letter.char);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(letter.char);
      utterance.lang = "hi-IN";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
    setTimeout(() => setActiveChar(null), 800);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start pb-12">
      {/* CENTER FEED: LETTERS LEARNING ROADMAP */}
      <div className="flex-1 w-full max-w-xl mx-auto space-y-6">
        {/* Hero Card */}
        <div className="bg-[#1cb0f6] rounded-3xl text-white p-6 sm:p-7 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div className="max-w-xs z-10">
            <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">
              Let&apos;s learn Hindi!
            </h1>
            <p className="text-xs sm:text-sm font-bold text-sky-100 leading-relaxed mb-4">
              Get to know the characters and sounds in Hindi. Tap any letter to hear its pronunciation.
            </p>
            <button
              onClick={() => setIsQuizModalOpen(true)}
              className="px-6 py-2.5 rounded-2xl bg-white text-[#1cb0f6] font-black uppercase text-xs tracking-wider border-b-4 border-sky-100 active:border-b-0 active:translate-y-1 transition hover:bg-sky-50 shadow-xs"
            >
              LEARN THE LETTERS
            </button>
          </div>

          <div className="text-7xl sm:text-8xl shrink-0 select-none animate-bounce">
            क✨
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 border-b-2 border-gray-100 pb-3 overflow-x-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              filter === "all"
                ? "bg-[#1cb0f6] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            All Letters ({HINDI_LETTERS.length})
          </button>
          <button
            onClick={() => setFilter("vowel")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              filter === "vowel"
                ? "bg-[#1cb0f6] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            Vowels / स्वर (12)
          </button>
          <button
            onClick={() => setFilter("consonant")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              filter === "consonant"
                ? "bg-[#1cb0f6] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            Consonants / व्यंजन (30)
          </button>
        </div>

        {/* Letters Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {filteredLetters.map((l) => {
            const isPlaying = activeChar === l.char;
            return (
              <div
                key={l.char}
                onClick={() => speakLetter(l)}
                className={`bg-white border-2 rounded-2xl p-3 flex flex-col items-center justify-between cursor-pointer transition active:scale-95 shadow-xs group ${
                  isPlaying
                    ? "border-[#1cb0f6] bg-sky-50 ring-2 ring-[#1cb0f6]/30"
                    : "border-gray-200 hover:border-[#1cb0f6]/50 hover:bg-gray-50/50"
                }`}
              >
                {/* Speaker indicator on top right */}
                <div className="w-full flex justify-end">
                  <Volume2
                    className={`w-3.5 h-3.5 transition ${
                      isPlaying
                        ? "text-[#1cb0f6] scale-110"
                        : "text-gray-300 group-hover:text-gray-400"
                    }`}
                  />
                </div>

                {/* Main Character */}
                <span className="text-3xl sm:text-4xl font-black text-gray-800 my-1 font-serif group-hover:scale-110 transition">
                  {l.char}
                </span>

                {/* Transliteration */}
                <span className="text-xs font-bold text-gray-500 mb-2">
                  {l.translit}
                </span>

                {/* 3-Bar Mastery Level */}
                <div className="flex gap-1 w-full justify-center">
                  {[1, 2, 3].map((bar) => (
                    <div
                      key={bar}
                      className={`h-1.5 flex-1 rounded-full ${
                        bar <= l.mastery ? "bg-[#58cc02]" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT STICKY COLUMN: PROMO & DAILY QUESTS (Static across Main Pages) */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        {/* Super Duolingo Promo Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 text-white shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="text-base font-black uppercase tracking-wider text-amber-300">
              Super Duolingo
            </h3>
          </div>
          <p className="text-xs font-bold text-purple-200 leading-relaxed mb-4">
            Learn Hindi script faster with unlimited listening practice and zero ads.
          </p>
          <Link
            href="/shop"
            className="block text-center w-full py-2.5 rounded-2xl bg-white text-purple-900 font-black uppercase text-xs tracking-wider border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 transition hover:bg-gray-50"
          >
            TRY FOR FREE
          </Link>
        </div>

        {/* Daily Quests Widget */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-black text-gray-800">Daily Quests</h3>
            <Link
              href="/quests"
              className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider hover:underline"
            >
              VIEW ALL
            </Link>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-[#ffc800] fill-[#ffc800]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black text-gray-800 mb-1">
                Earn 10 XP
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#ffc800] h-full rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
            <span className="text-xl">📦</span>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-black text-gray-400 uppercase tracking-wider px-2">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Blog</a>
          <a href="#" className="hover:underline">Store</a>
          <a href="#" className="hover:underline">Efficacy</a>
          <a href="#" className="hover:underline">Careers</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Privacy</a>
        </div>
      </div>

      {/* Interactive Letters Practice Quiz Modal */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-gray-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-gray-800">Letters Practice</h3>
              <button
                onClick={() => setIsQuizModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 font-black"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-bold text-gray-500 mb-4">
              Tap the speaker and match the sound with the correct Devanagari character:
            </p>

            <div className="bg-[#ddf4ff] rounded-2xl p-6 flex flex-col items-center justify-center mb-5">
              <button
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance("क");
                  utterance.lang = "hi-IN";
                  window.speechSynthesis?.speak(utterance);
                }}
                className="w-16 h-16 rounded-2xl bg-[#1cb0f6] text-white flex items-center justify-center text-2xl shadow-md hover:scale-105 active:scale-95 transition"
              >
                🔊
              </button>
              <span className="text-xs font-bold text-sky-700 mt-2">
                Tap to hear &quot;ka&quot;
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {["क", "ख", "ग", "घ"].map((c, i) => (
                <button
                  key={c}
                  onClick={() => {
                    if (c === "क") {
                      alert("🎉 Correct! That is the letter 'ka' (क)");
                      setQuizScore((prev) => prev + 1);
                      setIsQuizModalOpen(false);
                    } else {
                      alert("❌ Not quite! That is '" + (i === 1 ? "kha" : i === 2 ? "ga" : "gha") + "'");
                    }
                  }}
                  className="py-4 rounded-2xl border-2 border-gray-200 hover:border-[#1cb0f6] bg-white font-serif font-black text-2xl text-gray-800 active:scale-95 transition"
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsQuizModalOpen(false)}
              className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-500 font-black uppercase text-xs hover:bg-gray-50 transition"
            >
              Exit Practice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
