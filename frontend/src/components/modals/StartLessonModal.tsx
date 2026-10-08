"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Sparkles, BookOpen } from "lucide-react";
import { sounds } from "@/lib/sounds";

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
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter" && isOpen) {
        sounds.playTap();
        router.push(`/lesson/${lessonId}`);
      }
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, lessonId, router]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-3 sm:p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 animate-scale-up shadow-2xl border-2 border-gray-200 relative cursor-default"
      >
        {/* Top Header with Close Button */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">
              Lesson {orderIndex} of {totalLessons}
            </span>
            <h3 className="text-2xl font-black text-gray-800 tracking-tight mt-0.5">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#58cc02] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl shadow-xs">
              +{xpReward} XP
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition active:scale-95"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Lesson Description */}
        <p className="text-xs sm:text-sm font-bold text-gray-500 mb-6 leading-relaxed">
          Learn basic Hindi vocabulary, letters, and how to form your first sentences with interactive audio drills.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href={`/lesson/${lessonId}`}
            onClick={() => sounds.playTap()}
            className="block w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider btn-3d-green text-center active:scale-95 transition shadow-md"
          >
            Start (+{xpReward} XP)
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/guidebook"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border-2 border-gray-200 hover:border-gray-300 bg-white font-black text-xs uppercase tracking-wider text-gray-600 text-center transition flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-gray-400" />
              <span>Guidebook</span>
            </Link>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border-2 border-transparent hover:bg-gray-100 font-black text-xs uppercase tracking-wider text-gray-400 hover:text-gray-600 transition"
            >
              Back to path
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
