"use client";

import { useState } from "react";
import Link from "next/link";
import { Volume2, Sparkles, CheckCircle2, ChevronRight, Zap, Info, X } from "lucide-react";
import RightPanel from "@/components/navigation/RightPanel";
import { sounds } from "@/lib/sounds";

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

const COMBINATIONS = [
  { char: "का", translit: "kaa" },
  { char: "के", translit: "ke" },
  { char: "की", translit: "kii" },
  { char: "को", translit: "ko" },
  { char: "कृ", translit: "kri" },
  { char: "मा", translit: "maa" },
  { char: "मी", translit: "mee" },
  { char: "मु", translit: "mu" },
  { char: "ला", translit: "laa" },
  { char: "ले", translit: "le" },
];

const QUIZ_QUESTIONS = [
  { char: "क", translit: "ka", options: ["क", "ख", "ग", "घ"] },
  { char: "म", translit: "ma", options: ["न", "प", "म", "ब"] },
  { char: "स", translit: "sa", options: ["स", "श", "ष", "ह"] },
  { char: "अ", translit: "a", options: ["अ", "आ", "इ", "ई"] },
  { char: "र", translit: "ra", options: ["य", "र", "ल", "व"] },
];

export default function CharactersPage() {
  const [filter, setFilter] = useState<"all" | "vowel" | "consonant">("all");
  const [activeChar, setActiveChar] = useState<string | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const speakLetter = (letter: { char: string; translit: string }) => {
    setActiveChar(letter.char);
    sounds.speak(letter.char);
    setTimeout(() => setActiveChar(null), 800);
  };

  const filteredLetters = HINDI_LETTERS.filter((l) => {
    if (filter === "all") return true;
    return l.type === filter;
  });

  const currentQ = QUIZ_QUESTIONS[quizIndex];

  const handleQuizAnswer = (selected: string) => {
    if (selected === currentQ.char) {
      sounds.playCorrect();
      setFeedback("🎉 Correct!");
      setQuizScore((prev) => prev + 1);
      setTimeout(() => {
        setFeedback(null);
        if (quizIndex < QUIZ_QUESTIONS.length - 1) {
          setQuizIndex((prev) => prev + 1);
        } else {
          sounds.playVictory();
          setToastMessage(`🎉 Great job! You scored ${quizScore + 1}/${QUIZ_QUESTIONS.length} on Hindi Letters practice! (+10 XP)`);
          setTimeout(() => setToastMessage(null), 4000);
          setIsQuizModalOpen(false);
          setQuizIndex(0);
          setQuizScore(0);
        }
      }, 900);
    } else {
      sounds.playIncorrect();
      setFeedback(`❌ Not quite! That was "${selected}"`);
      setTimeout(() => setFeedback(null), 1200);
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

      {/* CENTER FEED */}
      <div className="flex-1 w-full max-w-xl mx-auto space-y-6">
        {/* Hero Card */}
        <div className="bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500 rounded-3xl p-6 text-white shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-md">
              Hindi Alphabet • देवनागरी
            </span>
            <h1 className="text-2xl font-black">Learn the letters</h1>
            <p className="text-xs font-bold text-sky-100 max-w-xs">
              Master Hindi vowels, consonants, and character sounds with interactive audio drills.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setQuizIndex(0);
                  setQuizScore(0);
                  setIsQuizModalOpen(true);
                }}
                className="bg-white text-sky-600 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-sky-50 active:scale-95 transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span>Practice (+15 XP)</span>
              </button>
              <button
                onClick={() => setShowTipsModal(true)}
                className="border-2 border-white/40 hover:bg-white/10 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider text-white transition flex items-center gap-1.5"
              >
                <Info className="w-4 h-4" />
                <span>Tips</span>
              </button>
            </div>
          </div>
          <div className="text-7xl font-serif text-white/90 select-none hidden sm:block">
            क
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 pb-1 overflow-x-auto">
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
                <div className="w-full flex justify-end">
                  <Volume2
                    className={`w-3.5 h-3.5 transition ${
                      isPlaying
                        ? "text-[#1cb0f6] scale-110"
                        : "text-gray-300 group-hover:text-gray-400"
                    }`}
                  />
                </div>
                <span className="text-3xl sm:text-4xl font-black text-gray-800 my-1 font-serif group-hover:scale-110 transition">
                  {l.char}
                </span>
                <span className="text-xs font-bold text-gray-500 mb-2">
                  {l.translit}
                </span>
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

        {/* Combinations Section (from video 135s) */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-gray-800">Combinations (मात्राएँ व युक्तियाँ)</h2>
            <span className="text-xs font-black text-[#1cb0f6]">10 Combos</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {COMBINATIONS.map((c) => (
              <div
                key={c.char}
                onClick={() => speakLetter(c)}
                className="bg-white border-2 border-gray-200 hover:border-[#1cb0f6] rounded-2xl p-3 text-center cursor-pointer transition active:scale-95 shadow-xs"
              >
                <div className="text-2xl font-black text-gray-800 font-serif">{c.char}</div>
                <div className="text-xs font-bold text-gray-400 mt-1">{c.translit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT STICKY COLUMN */}
      <RightPanel />

      {/* Interactive Letters Practice Quiz Modal */}
      {isQuizModalOpen && currentQ && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-gray-200 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
                </span>
                <h3 className="text-xl font-black text-gray-800">Letters Practice</h3>
              </div>
              <button
                onClick={() => setIsQuizModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 font-black"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-bold text-gray-500 mb-4">
              Tap the speaker to hear the letter, then pick the correct Devanagari character:
            </p>

            <div className="bg-[#ddf4ff] rounded-2xl p-6 flex flex-col items-center justify-center mb-5">
              <button
                onClick={() => sounds.speak(currentQ.char)}
                className="w-16 h-16 rounded-2xl bg-[#1cb0f6] text-white flex items-center justify-center text-2xl shadow-md hover:scale-105 active:scale-95 transition"
              >
                🔊
              </button>
              <span className="text-xs font-bold text-sky-700 mt-2">
                Tap to hear &quot;{currentQ.translit}&quot;
              </span>
            </div>

            {feedback && (
              <div
                className={`p-2.5 rounded-xl font-black text-xs text-center mb-3 animate-fade-in ${
                  feedback.startsWith("🎉")
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {feedback}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-5">
              {currentQ.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleQuizAnswer(opt)}
                  className="py-4 rounded-2xl border-2 border-gray-200 hover:border-[#1cb0f6] bg-white font-serif font-black text-2xl text-gray-800 active:scale-95 transition"
                >
                  {opt}
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

      {/* Tips Modal */}
      {showTipsModal && (
        <div
          onClick={() => setShowTipsModal(false)}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border-2 border-gray-200 relative animate-scale-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <h3 className="text-xl font-black text-gray-800">Hindi Alphabet Tips</h3>
              <button onClick={() => setShowTipsModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs font-bold text-gray-600">
              <p>
                <b>Devanagari</b> is written left-to-right with a horizontal hanging line at the top called the <i>Shirorekha</i>.
              </p>
              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-sky-900">
                💡 Every consonant has an inherent vowel sound <b>&quot;a&quot;</b> unless modified with a matra (मात्रा).
              </div>
            </div>
            <button
              onClick={() => setShowTipsModal(false)}
              className="mt-6 w-full py-3 rounded-2xl bg-[#1cb0f6] text-white font-black text-xs uppercase tracking-wider btn-3d-blue"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
