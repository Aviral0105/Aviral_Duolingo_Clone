"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, Lock, Play } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface LockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  lessonTitle?: string;
  lessonId?: number;
  isSuper?: boolean;
}

export default function LockedModal({
  isOpen,
  onClose,
  title,
  lessonTitle,
  lessonId = 1,
  isSuper,
}: LockedModalProps) {
  const [mounted, setMounted] = useState(false);
  const displayTitle = lessonTitle || title || "Locked Lesson";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-3 sm:p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 animate-scale-up shadow-2xl border-2 border-gray-200 cursor-default"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Lock className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-black text-gray-800">{displayTitle}</h3>
            {isSuper && (
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                Super
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition active:scale-95"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <p className="text-xs sm:text-sm font-bold text-gray-500 mb-6 leading-relaxed">
          Complete earlier levels to unlock this lesson and maintain your path order, or jump straight in to practice!
        </p>

        <div className="space-y-3">
          <Link
            href={`/lesson/${lessonId}`}
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-full py-4 rounded-2xl bg-[#1cb0f6] border-b-4 border-[#1899d6] text-white font-black text-xs uppercase tracking-wider text-center block hover:brightness-105 active:border-b-0 active:translate-y-1 transition shadow-md"
          >
            Start Lesson Anyway
          </Link>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-gray-400 hover:text-gray-600 transition"
          >
            Back to path
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
