"use client";

import { sounds } from "@/lib/sounds";

interface GuidebookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuidebookModal({ isOpen, onClose }: GuidebookModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
              Section 1, Unit 1
            </span>
            <h2 className="text-xl font-black text-gray-800">Order at a café</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-black text-xl p-1">
            ✕
          </button>
        </div>

        <div className="text-center py-3">
          <span className="text-5xl">🦉🥐</span>
        </div>

        {/* Key Phrases from Video */}
        <div className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider mb-2">
          Key Phrases
        </div>
        <div className="space-y-2 mb-5">
          {[
            { fr: "Bonjour Madame, je voudrais un thé.", en: "Hello Madam, I would like a tea." },
            { fr: "Un croissant, s'il vous plaît.", en: "A croissant, please." },
            { fr: "Oui, je voudrais un café et un croissant.", en: "Yes, I would like a coffee and a croissant." },
            { fr: "Merci, au revoir !", en: "Thank you, goodbye!" },
          ].map((phrase, idx) => (
            <div key={idx} className="border border-gray-200 rounded-2xl p-3 flex items-start gap-3">
              <button
                onClick={() => sounds.speak(phrase.fr)}
                className="text-[#1cb0f6] p-1.5 hover:bg-sky-50 rounded-xl active:scale-95 transition"
              >
                🔊
              </button>
              <div>
                <div className="text-xs font-black text-gray-800">{phrase.fr}</div>
                <div className="text-[11px] text-gray-500 font-bold">{phrase.en}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Grammar Tip Table from Video */}
        <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200">
          <div className="text-xs font-black text-sky-800 uppercase tracking-wider mb-1">
            Tip: Linking with &quot;et&quot; and &quot;ou&quot;
          </div>
          <p className="text-[11px] text-sky-700 font-bold mb-3">
            Use <b>et</b> to mean &quot;and&quot; and <b>ou</b> to mean &quot;or&quot; when connecting words.
          </p>
          <div className="grid grid-cols-2 bg-white rounded-xl border border-sky-200 overflow-hidden text-xs">
            <div className="p-2 font-black bg-sky-100 text-sky-800 border-r border-sky-200">French</div>
            <div className="p-2 font-black bg-sky-100 text-sky-800">English</div>
            <div className="p-2 border-r border-t border-sky-200 font-black">et</div>
            <div className="p-2 border-t border-sky-200 font-bold">and</div>
            <div className="p-2 border-r border-t border-sky-200 font-black">ou</div>
            <div className="p-2 border-t border-sky-200 font-bold">or</div>
          </div>
        </div>
      </div>
    </div>
  );
}
