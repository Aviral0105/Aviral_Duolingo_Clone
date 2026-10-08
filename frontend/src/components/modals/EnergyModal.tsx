"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { sounds } from "@/lib/sounds";
import { Zap, Heart, RefreshCw } from "lucide-react";

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
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 cursor-pointer animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h2 className="text-xl font-black text-gray-800">Hearts</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-black text-xl p-1">
            ✕
          </button>
        </div>

        {/* 5 Red Hearts Display */}
        <div className="text-center my-4">
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Heart
                key={i}
                className={`w-7 h-7 ${
                  i <= hearts ? "text-[#ff4b4b] fill-[#ff4b4b]" : "text-gray-200 fill-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm font-black text-gray-700">
            {hearts === 5 ? "You have full hearts" : `${hearts} hearts remaining`}
          </p>
          <p className="text-xs text-gray-400 font-bold">Keep on learning without worries</p>
        </div>

        {/* Action Button 1: Unlimited Hearts (Free Trial) */}
        <div className="border-2 border-purple-300 bg-purple-50/60 rounded-2xl p-4 flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <div className="text-xs font-black text-purple-700">UNLIMITED HEARTS</div>
              <div className="text-[10px] text-purple-500 font-bold">Never run out of hearts with Super</div>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playVictory();
              onActivateSuper();
              onClose();
            }}
            className="btn-3d-blue px-3 py-1.5 rounded-xl text-xs font-black"
          >
            FREE TRIAL
          </button>
        </div>

        {/* Action Button 2: Refill Hearts (💎 350) */}
        <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">❤️</span>
            <div>
              <div className="text-xs font-black text-gray-800">REFILL HEARTS</div>
              <div className="text-[10px] text-gray-400 font-bold">
                {hearts === 5 ? "Hearts are full" : "Restore all hearts to 5"}
              </div>
            </div>
          </div>
          {hearts === 5 ? (
            <span className="px-3 py-1.5 rounded-xl text-xs font-black text-gray-400 bg-gray-100">
              FULL
            </span>
          ) : (
            <button
              onClick={() => {
                sounds.playCorrect();
                onRefill();
                onClose();
              }}
              className="btn-3d-blue px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1"
            >
              <span>💎</span>
              <span>350</span>
            </button>
          )}
        </div>

        {/* Action Button 3: Practice to Earn Hearts */}
        <button
          onClick={() => {
            onClose();
            router.push("/practice");
          }}
          className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider btn-3d-white flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition"
        >
          <RefreshCw className="w-4 h-4 text-[#1cb0f6]" />
          <span>Practice to earn hearts</span>
        </button>
      </div>
    </div>
  );
}
