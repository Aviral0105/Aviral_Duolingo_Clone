"use client";

import { useState } from "react";
import { sounds } from "@/lib/sounds";
import { Heart, Zap, Sparkles, Check, Lock, Gift } from "lucide-react";
import RightPanel from "@/components/navigation/RightPanel";

export default function ShopPage() {
  const [isSuper, setIsSuper] = useState(false);
  const [heartsRefilled, setHeartsRefilled] = useState(false);
  const [showSuperModal, setShowSuperModal] = useState(false);

  const handleActivateSuper = () => {
    sounds.playVictory();
    setIsSuper(true);
    setShowSuperModal(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start pb-12">
      {/* CENTER FEED: HEARTS & POWER-UPS */}
      <div className="flex-1 w-full max-w-xl mx-auto space-y-8">
      {/* Super Duolingo Promotion Hero */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 rounded-3xl text-white p-6 sm:p-8 flex items-center justify-between shadow-sm mb-8 relative overflow-hidden">
        <div className="max-w-xs z-10">
          <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-md">
            Super
          </span>
          <h1 className="text-xl sm:text-2xl font-black mt-2 leading-tight">
            Get started with a 1 month free trial on Super
          </h1>
          <button
            onClick={() => setShowSuperModal(true)}
            className="mt-4 bg-white text-purple-700 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl shadow-md hover:bg-purple-50 active:scale-95 transition"
          >
            Start My Free Month
          </button>
        </div>
        <div className="text-7xl sm:text-8xl z-10">🦉✨</div>
      </div>

      {/* SECTION 1: HEARTS */}
      <div className="mb-8">
        <h2 className="text-base font-black text-gray-800 mb-3">Hearts</h2>
        <div className="space-y-3">
          {/* Refill Hearts */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <span className="text-3xl">❤️</span>
              <div>
                <h3 className="font-black text-sm text-gray-800">Refill Hearts</h3>
                <p className="text-xs text-gray-400 font-bold">
                  Get full hearts so you can worry less about making mistakes in a lesson
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sounds.playCorrect();
                setHeartsRefilled(true);
                setTimeout(() => setHeartsRefilled(false), 2000);
              }}
              className="btn-3d-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-gray-400 shrink-0"
            >
              {heartsRefilled ? "REFILLED" : "FULL"}
            </button>
          </div>

          {/* Unlimited Hearts */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <span className="text-3xl">⚡</span>
              <div>
                <h3 className="font-black text-sm text-gray-800">Unlimited Hearts</h3>
                <p className="text-xs text-gray-400 font-bold">Never run out of hearts with Super!</p>
              </div>
            </div>
            <button
              onClick={() => setShowSuperModal(true)}
              className="btn-3d-blue px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0"
            >
              Free Trial
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: POWER-UPS */}
      <div className="mb-8">
        <h2 className="text-base font-black text-gray-800 mb-3">Power-ups</h2>
        <div className="space-y-3">
          {/* Streak Freeze */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <span className="text-3xl">🧊</span>
              <div>
                <h3 className="font-black text-sm text-gray-800">
                  Streak Freeze <span className="text-xs text-[#1cb0f6] ml-1">2/2 EQUIPPED</span>
                </h3>
                <p className="text-xs text-gray-400 font-bold">
                  Streak Freeze allows your streak to remain in place for one full day of inactivity.
                </p>
              </div>
            </div>
            <button className="btn-3d-gray px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0">
              Equipped
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* RIGHT STICKY COLUMN: BRONZE LEAGUE & DAILY QUESTS */}
      <RightPanel />

      {/* SUPER DUOLINGO COMPARISON MODAL FROM VIDEO */}
      {showSuperModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full animate-slide-up shadow-2xl relative text-center">
            <button
              onClick={() => setShowSuperModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-black text-xl"
            >
              ✕
            </button>

            <span className="text-6xl block mb-2">🦉🚀</span>
            <h2 className="text-2xl font-black text-gray-800 mb-1">
              You&apos;re 4.2x more likely to finish the course!
            </h2>
            <p className="text-xs font-bold text-gray-500 mb-6">
              Compare plans and choose your learning superpower
            </p>

            {/* Comparison Table from Video */}
            <div className="border-2 border-gray-200 rounded-2xl overflow-hidden mb-6 text-xs text-left">
              <div className="grid grid-cols-3 bg-gray-50 p-3 font-black text-gray-600 border-b border-gray-200">
                <span>Features</span>
                <span className="text-center">FREE</span>
                <span className="text-center text-purple-600">SUPER</span>
              </div>
              <div className="grid grid-cols-3 p-3 border-b border-gray-100 font-bold text-gray-700">
                <span>Learning content</span>
                <span className="text-center text-green-600">✓</span>
                <span className="text-center text-purple-600">✓</span>
              </div>
              <div className="grid grid-cols-3 p-3 border-b border-gray-100 font-bold text-gray-700">
                <span>Unlimited Hearts</span>
                <span className="text-center text-gray-300">—</span>
                <span className="text-center text-purple-600 font-black">✓</span>
              </div>
              <div className="grid grid-cols-3 p-3 border-b border-gray-100 font-bold text-gray-700">
                <span>No ads</span>
                <span className="text-center text-gray-300">—</span>
                <span className="text-center text-purple-600 font-black">✓</span>
              </div>
              <div className="grid grid-cols-3 p-3 font-bold text-gray-700">
                <span>Mistakes review</span>
                <span className="text-center text-gray-300">—</span>
                <span className="text-center text-purple-600 font-black">✓</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleActivateSuper}
                className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider btn-3d-blue"
              >
                Start My Free Month
              </button>
              <button
                onClick={() => setShowSuperModal(false)}
                className="w-full py-2.5 font-black text-xs uppercase tracking-wider text-gray-400 hover:text-gray-600"
              >
                No Thanks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
