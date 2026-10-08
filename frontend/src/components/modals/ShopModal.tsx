"use client";

import { sounds } from "@/lib/sounds";

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  gems: number;
  onActivateSuper: () => void;
}

export default function ShopModal({ isOpen, onClose, gems, onActivateSuper }: ShopModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-gray-800">Shop</h2>
            <span className="text-sm font-black text-[#1cb0f6]">💎 {gems}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-black text-xl p-1">
            ✕
          </button>
        </div>

        {/* Super Duolingo Promotion */}
        <div className="my-4 p-5 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-md">
              Super
            </span>
            <h3 className="text-base font-black mt-1.5">Faster learning for 2-6 people</h3>
            <p className="text-xs text-purple-200 font-bold mt-0.5">Unlimited Hearts & No Ads</p>
          </div>
          <button
            onClick={() => {
              sounds.playVictory();
              onActivateSuper();
              onClose();
            }}
            className="bg-white text-purple-700 text-xs font-black px-4 py-2.5 rounded-xl uppercase tracking-wider shadow-md hover:bg-purple-50 active:scale-95 transition"
          >
            Try Free
          </button>
        </div>

        {/* My Items */}
        <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">My Items</div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="border-2 border-gray-200 rounded-2xl p-2.5 flex flex-col items-center">
            <span className="text-2xl">⏱️</span>
            <span className="text-[11px] font-black text-gray-700 mt-1">Timer Boost</span>
            <span className="text-[10px] font-bold text-gray-400">x1</span>
          </div>
          <div className="border-2 border-gray-200 rounded-2xl p-2.5 flex flex-col items-center">
            <span className="text-2xl">🧪</span>
            <span className="text-[11px] font-black text-gray-700 mt-1">XP Boost</span>
            <span className="text-[10px] font-bold text-gray-400">x0</span>
          </div>
          <div className="border-2 border-gray-200 rounded-2xl p-2.5 flex flex-col items-center">
            <span className="text-2xl">🧊</span>
            <span className="text-[11px] font-black text-gray-700 mt-1">Freeze</span>
            <span className="text-[10px] font-bold text-gray-400">x0</span>
          </div>
        </div>

        {/* Streak Freeze Purchase */}
        <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Streak Freeze</div>
        <div className="space-y-2 mb-4">
          <div className="border-2 border-gray-200 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧊</span>
              <div>
                <div className="text-xs font-black text-gray-800">1-day Freeze</div>
                <div className="text-[10px] font-bold text-gray-400">Protects streak for 1 day</div>
              </div>
            </div>
            <button className="btn-3d-blue px-3 py-1.5 rounded-xl text-xs font-black">
              💎 600
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
