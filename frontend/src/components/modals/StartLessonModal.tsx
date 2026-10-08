"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface StartLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: number;
  title: string;
  xpReward: number;
  orderIndex?: number;
  totalLessons?: number;
}

export default function StartLessonModal({
  isOpen,
  onClose,
  lessonId,
  title,
  xpReward,
  orderIndex = 1,
  totalLessons = 4,
}: StartLessonModalProps) {
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
      className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 cursor-pointer animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up shadow-2xl relative cursor-default"
      >
        {/* Top Header with Close Button */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
              Lesson {orderIndex} of {totalLessons}
            </span>
            <h3 className="text-2xl font-black text-gray-800">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#58cc02] bg-emerald-100 px-3 py-1 rounded-xl">
              +{xpReward} XP
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-xl hover:bg-gray-100 transition active:scale-95"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        <p className="text-xs font-bold text-gray-500 mb-6">
          Learn basic Hindi vocabulary, letters, and how to form your first sentences.
        </p>

        <div className="space-y-2">
          <Link
            href={`/lesson/${lessonId}`}
            className="block w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider btn-3d-green text-center active:scale-95 transition"
          >
            Start (+{xpReward} XP)
          </Link>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider text-gray-400 hover:text-gray-600 transition"
          >
            Back to path
          </button>
        </div>
      </div>
    </div>
  );
}
