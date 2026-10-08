"use client";

import { sounds } from "@/lib/sounds";

interface EnergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  hearts: number;
  isSuper: boolean;
  onRefill: () => void;
  onActivateSuper: () => void;
}

export default function EnergyModal({
  isOpen,
  onClose,
  hearts,
  isSuper,
  onRefill,
  onActivateSuper,
}: EnergyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h2 className="text-xl font-black text-gray-800">Energy & Hearts</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-black text-xl p-1">
            ✕
          </button>
        </div>

        {/* Charging Progress Bar */}
        <div className="my-4">
          <div className="flex justify-between text-xs font-black mb-1.5">
            <span className="text-gray-500 uppercase tracking-wider">Charging</span>
            <span className="text-purple-600 font-black">⚡ 7h 46m</span>
          </div>
          <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all"
              style={{ width: `${(hearts / 5) * 100}%` }}
            ></div>
          </div>
          <div className="text-center text-xs font-black text-gray-400 mt-1.5">
            {isSuper ? "UNLIMITED" : `${hearts} / 5`}
          </div>
        </div>

        {/* Super Unlimited Option */}
        <div className="border-2 border-purple-300 bg-purple-50 rounded-2xl p-4 flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-black text-purple-700">Super Unlimited</div>
            <div className="text-[11px] text-purple-500 font-bold">Never run out of hearts</div>
          </div>
          <button
            onClick={() => {
              sounds.playVictory();
              onActivateSuper();
              onClose();
            }}
            className="btn-3d-blue px-3 py-1.5 rounded-xl text-xs font-black"
          >
            Try Free
          </button>
        </div>

        {/* Free Refill Action */}
        <button
          onClick={() => {
            sounds.playCorrect();
            onRefill();
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider btn-3d-green"
        >
          Refill All Hearts (Free Demo)
        </button>
      </div>
    </div>
  );
}
