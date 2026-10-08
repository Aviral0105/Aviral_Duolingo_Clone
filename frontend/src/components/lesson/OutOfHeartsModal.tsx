"use client";

import Link from "next/link";
import { sounds } from "@/lib/sounds";

interface OutOfHeartsModalProps {
  isOpen: boolean;
  onRefill: () => void;
}

export default function OutOfHeartsModal({ isOpen, onRefill }: OutOfHeartsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center animate-slide-up">
        <span className="text-7xl">💔</span>
        <h2 className="text-2xl font-black text-gray-800 mt-4">You ran out of hearts!</h2>
        <p className="text-xs font-bold text-gray-500 mt-2 mb-6">
          Refill your hearts or practice past lessons to earn more hearts.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => {
              sounds.playCorrect();
              onRefill();
            }}
            className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider btn-3d-green"
          >
            Refill Hearts (5 ❤️)
          </button>
          <Link
            href="/learn"
            className="block w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider btn-3d-white text-gray-600 text-center"
          >
            Exit to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
