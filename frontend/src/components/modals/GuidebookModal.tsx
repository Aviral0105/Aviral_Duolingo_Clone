"use client";

import Link from "next/link";
import { sounds } from "@/lib/sounds";

interface GuidebookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuidebookModal({ isOpen, onClose }: GuidebookModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[90vh] overflow-y-auto animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
              Section 1, Unit 1
            </span>
            <h2 className="text-xl font-black text-gray-800">Form basic sentences</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-black text-xl p-1">
            ✕
          </button>
        </div>

        <div className="text-center py-3">
          <span className="text-5xl">🦉🇮🇳</span>
        </div>

        {/* Key Phrases */}
        <div className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider mb-2">
          Key Phrases (मूल वाक्य)
        </div>
        <div className="space-y-2 mb-5">
          {[
            { hi: "नमस्ते !", en: "Hello / Greetings!" },
            { hi: "यह एक सेब है।", en: "This is an apple." },
            { hi: "वह आदमी पानी पीता है।", en: "That man drinks water." },
            { hi: "लड़का और लड़की।", en: "Boy and girl." },
          ].map((phrase, idx) => (
            <div key={idx} className="border border-gray-200 rounded-2xl p-3 flex items-start gap-3">
              <button
                onClick={() => sounds.speak(phrase.hi)}
                className="text-[#1cb0f6] p-1.5 hover:bg-sky-50 rounded-xl active:scale-95 transition"
              >
                🔊
              </button>
              <div>
                <div className="text-sm font-black text-gray-800">{phrase.hi}</div>
                <div className="text-[11px] text-gray-500 font-bold">{phrase.en}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Grammar Tip Table */}
        <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200">
          <div className="text-xs font-black text-sky-800 uppercase tracking-wider mb-1">
            Tip: Connecting words with &quot;और&quot; (and)
          </div>
          <p className="text-[11px] text-sky-700 font-bold mb-3">
            In Hindi, word order typically follows <b>Subject - Object - Verb (SOV)</b>. Use <b>और</b> (aur) to link nouns together.
          </p>
          <div className="grid grid-cols-2 bg-white rounded-xl border border-sky-200 overflow-hidden text-xs">
            <div className="p-2 font-black bg-sky-100 text-sky-800 border-r border-sky-200">Hindi (हिन्दी)</div>
            <div className="p-2 font-black bg-sky-100 text-sky-800">English</div>
            <div className="p-2 border-r border-t border-sky-200 font-black">और (aur)</div>
            <div className="p-2 border-t border-sky-200 font-bold">and</div>
            <div className="p-2 border-r border-t border-sky-200 font-black">यह (yeh)</div>
            <div className="p-2 border-t border-sky-200 font-bold">this</div>
            <div className="p-2 border-r border-t border-sky-200 font-black">वह (vah)</div>
            <div className="p-2 border-t border-sky-200 font-bold">that</div>
            <div className="p-2 border-r border-t border-sky-200 font-black">है (hai)</div>
            <div className="p-2 border-t border-sky-200 font-bold">is</div>
          </div>
        </div>

        {/* View Full Guidebook Link */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <Link
            href="/guidebook"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#1cb0f6] border-b-4 border-[#1899d6] text-white font-black text-xs uppercase tracking-wider block text-center hover:brightness-105 active:border-b-0 active:translate-y-1 transition"
          >
            VIEW FULL GUIDEBOOK
          </Link>
        </div>
      </div>
    </div>
  );
}
