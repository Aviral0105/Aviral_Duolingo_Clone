"use client";

import { useState } from "react";
import { sounds } from "@/lib/sounds";
import { Heart, Zap, Sparkles, Check, Lock, Gift, ChevronRight, X } from "lucide-react";
import RightPanel from "@/components/navigation/RightPanel";
import { purchaseShopItem } from "@/lib/api";

export default function ShopPage() {
  const [isSuper, setIsSuper] = useState(false);
  const [heartsCount, setHeartsCount] = useState(4);
  const [freezeEquipped, setFreezeEquipped] = useState(true);
  const [xpBoostActive, setXpBoostActive] = useState(false);
  const [showSuperModal, setShowSuperModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefillHearts = async () => {
    if (heartsCount >= 5) {
      showToast("Hearts are already full!");
      return;
    }
    try {
      const res = await purchaseShopItem("refill_hearts");
      sounds.playCorrect();
      setHeartsCount(5);
      showToast(`❤️ Hearts refilled to 5! (Remaining: ${res.new_gems} Gems)`);
    } catch (e: any) {
      showToast(e.message || "Failed to refill hearts");
    }
  };

  const handleBuyBoost = async () => {
    try {
      const res = await purchaseShopItem("double_xp");
      sounds.playVictory();
      setXpBoostActive(true);
      showToast(`⚡ 2x XP Boost activated for 15 minutes! (Remaining: ${res.new_gems} Gems)`);
    } catch (e: any) {
      showToast(e.message || "Failed to activate boost");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#58cc02] text-white px-5 py-3 rounded-2xl shadow-xl font-black text-sm flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

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
        <div>
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
              {heartsCount >= 5 ? (
                <span className="btn-3d-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-gray-400 shrink-0">
                  FULL
                </span>
              ) : (
                <button
                  onClick={handleRefillHearts}
                  className="btn-3d-blue px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 flex items-center gap-1"
                >
                  <span>💎</span>
                  <span>350</span>
                </button>
              )}
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
        <div>
          <h2 className="text-base font-black text-gray-800 mb-3">Power-ups</h2>
          <div className="space-y-3">
            {/* Streak Freeze */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">🧊</span>
                <div>
                  <h3 className="font-black text-sm text-gray-800">
                    Streak Freeze{" "}
                    <span className="text-xs text-[#1cb0f6] ml-1">
                      {freezeEquipped ? "2/2 EQUIPPED" : "1/2 EQUIPPED"}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400 font-bold">
                    Streak Freeze allows your streak to remain in place for one full day of inactivity.
                  </p>
                </div>
              </div>
              <span className="btn-3d-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-gray-400 shrink-0">
                Equipped
              </span>
            </div>

            {/* XP Boost */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">⚡</span>
                <div>
                  <h3 className="font-black text-sm text-gray-800">
                    XP Boost{" "}
                    {xpBoostActive && <span className="text-xs text-[#58cc02] ml-1">ACTIVE (2X)</span>}
                  </h3>
                  <p className="text-xs text-gray-400 font-bold">
                    Double your XP earned in lessons for the next 15 minutes!
                  </p>
                </div>
              </div>
              {xpBoostActive ? (
                <span className="btn-3d-green px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0">
                  ACTIVE
                </span>
              ) : (
                <button
                  onClick={handleBuyBoost}
                  className="btn-3d-blue px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 flex items-center gap-1"
                >
                  <span>💎</span>
                  <span>100</span>
                </button>
              )}
            </div>

            {/* Family Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
                <div>
                  <h3 className="font-black text-sm text-gray-800">Super Duolingo Family Plan</h3>
                  <p className="text-xs text-gray-400 font-bold">
                    Share unlimited hearts and Super benefits with up to 5 family members.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSuperModal(true)}
                className="btn-3d-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN WITH AUTHENTIC "DISCOVER MORE" CARD */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs">
          <div className="bg-sky-50 rounded-2xl p-4 mb-4 border border-sky-100">
            <h3 className="font-black text-sm text-gray-800 mb-3">Discover more</h3>
            <div className="space-y-2 text-xs font-bold text-gray-600">
              <div
                onClick={() => alert("Duolingo Mobile App available on iOS and Android!")}
                className="flex items-center justify-between py-1.5 hover:text-[#1cb0f6] cursor-pointer"
              >
                <span>Language learning app</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <div
                onClick={() => alert("Duolingo English Test accepted worldwide!")}
                className="flex items-center justify-between py-1.5 hover:text-[#1cb0f6] cursor-pointer"
              >
                <span>English proficiency test</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <div
                onClick={() => alert("Duolingo for Business language training!")}
                className="flex items-center justify-between py-1.5 hover:text-[#1cb0f6] cursor-pointer"
              >
                <span>Business language training</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSuperModal(true)}
            className="w-full py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider text-[#1cb0f6] hover:bg-sky-50 border border-sky-200 transition"
          >
            Remove Ads
          </button>
        </div>

        {/* Footer Links */}
        <div className="text-[11px] font-bold text-gray-400 flex flex-wrap gap-x-3 gap-y-1 px-2">
          <span>ABOUT</span>
          <span>BLOG</span>
          <span>STORE</span>
          <span>EFFICACY</span>
          <span>CAREERS</span>
          <span>INVESTORS</span>
          <span>TERMS</span>
          <span>PRIVACY</span>
        </div>
      </div>

      {/* Super Free Month Modal */}
      {showSuperModal && (
        <div
          onClick={() => setShowSuperModal(false)}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-gray-200 text-center relative animate-scale-up"
          >
            <button
              onClick={() => setShowSuperModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-6xl block mb-3">🦉✨</span>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Try Super for Free</h2>
            <p className="text-xs font-bold text-gray-500 mb-6">
              Learn faster with unlimited hearts, no ads, and personalized practice sessions.
            </p>
            <button
              onClick={() => {
                sounds.playVictory();
                setIsSuper(true);
                setShowSuperModal(false);
                showToast("✨ Super Duolingo 1 Month Free Trial activated!");
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition"
            >
              Start My Free Month
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
