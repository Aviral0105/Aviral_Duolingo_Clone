"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2, BookOpen, Sparkles } from "lucide-react";
import RightPanel from "@/components/navigation/RightPanel";
import { fetchGuidebook } from "@/lib/api";
import { GuidebookData, KeyPhrase } from "@/lib/types";
import { sounds } from "@/lib/sounds";

export default function GuidebookPage() {
  const [guidebook, setGuidebook] = useState<GuidebookData | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<{ word: string; meaning: string } | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);

  useEffect(() => {
    fetchGuidebook(1).then(setGuidebook);
  }, []);

  const handlePlayAudio = (phrase: KeyPhrase) => {
    setPlayingId(phrase.id);
    sounds.speak(phrase.audio_text || phrase.hi);
    setTimeout(() => setPlayingId(null), 1200);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start pb-16">
      {/* ======================================================== */}
      {/* CENTER COLUMN: FULL-LENGTH GUIDEBOOK (Matching Screenshot) */}
      {/* ======================================================== */}
      <div className="flex-1 w-full max-w-xl mx-auto space-y-6">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between pb-2">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm font-black text-gray-400 hover:text-gray-700 uppercase tracking-wider transition group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition stroke-[2.5]" />
            <span>Back</span>
          </Link>

          <span className="text-xs font-black uppercase tracking-wider text-gray-400">
            {guidebook?.section_title ?? "SECTION 1, UNIT 1"}
          </span>
        </div>

        {/* Unit Title Header */}
        <div className="border-b-2 border-gray-100 pb-4">
          <div className="text-xs font-black uppercase tracking-wider text-[#58cc02] mb-1">
            UNIT GUIDEBOOK
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">
            {guidebook?.unit_title ?? "Form basic sentences"}
          </h1>
          <p className="text-xs sm:text-sm font-bold text-gray-500 mt-1">
            {guidebook?.description ??
              "Master plural pronouns, basic sentence structures, and essential food and drink vocabulary in Hindi."}
          </p>
        </div>

        {/* ======================================================== */}
        {/* KEY PHRASES SECTION (Matching Screenshot Speeches)       */}
        {/* ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <span>Key Phrases</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                (मूल वाक्य)
              </span>
            </h2>
            <span className="text-xs font-bold text-gray-400">
              Tap audio or words for hints
            </span>
          </div>

          <div className="space-y-3">
            {guidebook?.key_phrases.map((phrase) => {
              const isPlaying = playingId === phrase.id;
              return (
                <div
                  key={phrase.id}
                  className="bg-white border-2 border-gray-200 rounded-3xl p-4 sm:p-5 shadow-xs hover:border-gray-300 transition flex items-start gap-4"
                >
                  {/* Interactive Blue Speaker Audio Button */}
                  <button
                    onClick={() => handlePlayAudio(phrase)}
                    className={`p-2.5 rounded-2xl transition active:scale-95 shrink-0 ${
                      isPlaying
                        ? "bg-[#1cb0f6] text-white shadow-md scale-105"
                        : "bg-sky-50 text-[#1cb0f6] hover:bg-sky-100"
                    }`}
                    title="Listen to pronunciation"
                  >
                    <Volume2 className="w-5 h-5 stroke-[2.5]" />
                  </button>

                  <div className="flex-1 min-w-0">
                    {/* Hindi Words with Subtle Dotted Underline (Hover/Click Tooltip) */}
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      {phrase.words && phrase.words.length > 0 ? (
                        phrase.words.map((w, wIdx) => (
                          <span
                            key={wIdx}
                            onClick={() => {
                              sounds.playTap();
                              setActiveTooltip(
                                activeTooltip?.word === w.hi ? null : { word: w.hi, meaning: w.en }
                              );
                            }}
                            className="text-base sm:text-lg font-black text-gray-800 border-b border-dotted border-gray-400 hover:text-[#1cb0f6] hover:border-[#1cb0f6] cursor-pointer transition relative"
                          >
                            {w.hi}
                            {/* Duolingo Floating Vocabulary Hint Tooltip */}
                            {activeTooltip?.word === w.hi && (
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-black py-1 px-2.5 rounded-xl shadow-lg z-30 whitespace-nowrap animate-scale-up">
                                {w.en}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                              </div>
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="text-base sm:text-lg font-black text-gray-800">
                          {phrase.hi}
                        </span>
                      )}
                    </div>

                    {/* English Sentence Translation Below */}
                    <p className="text-xs sm:text-sm font-bold text-gray-500 mt-1 leading-snug">
                      {phrase.en}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* GRAMMAR TIPS & EXPLANATIONS (Seeded from Chrome/Duolingo)*/}
        {/* ======================================================== */}
        <div className="space-y-5 pt-4">
          <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#58cc02]" />
            <span>Grammar Tips & Rules</span>
          </h2>

          {guidebook?.grammar_tips.map((tip, idx) => (
            <div
              key={idx}
              className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs space-y-4"
            >
              <div>
                <h3 className="text-base font-black text-gray-800">{tip.title}</h3>
                {tip.summary && (
                  <p className="text-xs font-bold text-gray-500 mt-1">{tip.summary}</p>
                )}
              </div>

              {/* Rules List */}
              {tip.rules && (
                <div className="space-y-2.5">
                  {tip.rules.map((rule, rIdx) => (
                    <div
                      key={rIdx}
                      className="bg-[#f7f7f7] border border-gray-200 rounded-2xl p-3.5 space-y-1 text-xs"
                    >
                      <div className="font-black text-gray-800">
                        {rule.category ?? rule.type}
                      </div>
                      <div className="text-[#1cb0f6] font-bold">
                        Rule: {rule.change ?? rule.rule}
                      </div>
                      <div className="text-gray-600 font-semibold italic">
                        {rule.examples ?? rule.example}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Demonstrative Pronoun Table */}
              {tip.table && (
                <div className="overflow-x-auto rounded-2xl border-2 border-gray-100">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-sky-50 text-sky-800 font-black">
                      <tr>
                        <th className="p-3">Pronoun</th>
                        <th className="p-3">Distance</th>
                        <th className="p-3">Meaning</th>
                        <th className="p-3">Verb</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-bold text-gray-700">
                      {tip.table.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-gray-50 transition">
                          <td className="p-3 font-black text-[#1cb0f6]">{row.pronoun}</td>
                          <td className="p-3 text-gray-500">{row.distance}</td>
                          <td className="p-3">{row.meaning}</td>
                          <td className="p-3 font-black text-[#58cc02]">{row.verb}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Examples List */}
              {tip.examples && (
                <div className="space-y-2">
                  {tip.examples.map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60"
                    >
                      <span className="font-black text-sm text-gray-800">{ex.hi}</span>
                      <span className="text-xs font-bold text-gray-600">{ex.en}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ======================================================== */}
        {/* VOCABULARY REFERENCE TABLE                               */}
        {/* ======================================================== */}
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Unit 1 Vocabulary Bank</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {guidebook?.vocabulary.map((item, vIdx) => (
              <div
                key={vIdx}
                onClick={() => sounds.speak(item.devanagari)}
                className="bg-white border-2 border-gray-200 rounded-2xl p-3 shadow-xs hover:border-[#1cb0f6] hover:bg-sky-50/30 cursor-pointer transition group"
                title="Click to hear pronunciation"
              >
                <div className="text-sm font-black text-gray-800 group-hover:text-[#1cb0f6] transition">
                  {item.devanagari}
                </div>
                <div className="text-[11px] font-bold text-gray-400">
                  {item.transliteration}
                </div>
                <div className="text-xs font-black text-gray-600 mt-1">
                  {item.meaning}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="pt-6 text-center">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-white font-black text-xs uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-1 transition shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO LESSONS</span>
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT-HAND COLUMN: BRONZE LEAGUE, DAILY QUESTS, ADS      */}
      {/* ======================================================== */}
      <RightPanel />
    </div>
  );
}
