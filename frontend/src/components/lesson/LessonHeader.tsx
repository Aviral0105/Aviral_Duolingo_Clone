"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Heart, Zap } from "lucide-react";

interface LessonHeaderProps {
  progressPercentage: number;
  hearts: number;
  isSuper: boolean;
  onQuitLesson: () => void;
}

export default function LessonHeader({
  progressPercentage,
  hearts,
  isSuper,
  onQuitLesson,
}: LessonHeaderProps) {
  const [showExitDialog, setShowExitDialog] = useState(false);

  return (
    <>
      <header className="p-4 flex items-center gap-4 max-w-3xl mx-auto w-full select-none">
        {/* Close Button */}
        <button
          onClick={() => setShowExitDialog(true)}
          className="text-gray-400 hover:text-gray-600 p-1 active:scale-95 transition"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
          <div
            className="bg-[#58cc02] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1.5 font-black text-[#ff4b4b]">
          {isSuper ? (
            <Zap className="w-6 h-6 text-purple-600 fill-purple-600" />
          ) : (
            <Heart className="w-6 h-6 fill-[#ff4b4b]" />
          )}
          <span className="text-lg">{isSuper ? "∞" : hearts}</span>
        </div>
      </header>

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center animate-slide-up">
            <span className="text-6xl">🦉😢</span>
            <h3 className="text-xl font-black text-gray-800 mt-3">Wait, don&apos;t go!</h3>
            <p className="text-xs font-bold text-gray-500 mt-1 mb-6">
              You&apos;ll lose your progress if you quit now.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setShowExitDialog(false)}
                className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider btn-3d-blue"
              >
                Keep learning
              </button>
              <button
                onClick={onQuitLesson}
                className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-red-500 hover:bg-red-50 transition"
              >
                End session
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
