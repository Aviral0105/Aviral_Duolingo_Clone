"use client";

import { useState } from "react";
import { sounds } from "@/lib/sounds";

export default function ShopPage() {
  const [isSuper, setIsSuper] = useState(false);

  const handleActivateSuper = () => {
    sounds.playVictory();
    setIsSuper(true);
  };

  return (
    <div className="flex flex-col select-none">
      <div className="text-center py-4 mb-4">
        <span className="text-7xl block mb-2 animate-bounce">🦉✨</span>
        <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Super Duolingo
        </h1>
        <p className="text-xs font-bold text-gray-500 mt-1">
          Accelerate your learning with zero interruptions.
        </p>
      </div>

      {isSuper && (
        <div className="mb-6 p-4 bg-purple-100 border-2 border-purple-300 rounded-2xl text-purple-800 font-black text-xs text-center">
          🎉 Super Duolingo is currently ACTIVE on your account!
        </div>
      )}

      {/* Plan Card */}
      <div className="border-3 border-purple-400 rounded-3xl p-6 mb-6 bg-gradient-to-b from-purple-50 to-white shadow-sm">
        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
          Recommended
        </span>
        <h2 className="text-xl font-black text-gray-800 mt-3">Individual Plan</h2>
        <p className="text-xs font-bold text-gray-500 mb-4">Learn faster with full freedom</p>

        <ul className="text-xs font-bold text-gray-700 space-y-3 mb-6">
          <li className="flex items-center gap-2 text-purple-700">✓ Unlimited Hearts & Energy</li>
          <li className="flex items-center gap-2 text-purple-700">✓ Mistake Reviews</li>
          <li className="flex items-center gap-2 text-purple-700">✓ Completely Ad-Free</li>
        </ul>

        <button
          onClick={handleActivateSuper}
          className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider btn-3d-blue"
        >
          {isSuper ? "Activated" : "Try for ₹0.00"}
        </button>
      </div>
    </div>
  );
}
