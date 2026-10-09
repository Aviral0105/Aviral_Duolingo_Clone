"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { sounds } from "@/lib/sounds";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseModal({ isOpen, onClose }: CourseModalProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 cursor-pointer animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl cursor-default relative"
      >
        {toastMessage && (
          <div className="absolute top-4 left-6 right-6 z-50 bg-[#1cb0f6] text-white px-4 py-2.5 rounded-xl shadow-lg font-black text-xs text-center animate-bounce">
            {toastMessage}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h2 className="text-xl font-black text-gray-800">My Courses</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-black text-xl p-1">
            ✕
          </button>
        </div>

        {/* Current Active Course Card */}
        <div className="my-4 p-4 border-2 border-blue-400 bg-blue-50/50 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🇮🇳</span>
            <div>
              <h3 className="font-black text-gray-800 text-lg">Hindi</h3>
              <p className="text-xs font-bold text-gray-500">Your Hindi Score is 5</p>
            </div>
          </div>
          <span className="bg-[#1cb0f6] text-white text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider">
            Active
          </span>
        </div>

        {/* Add Course Button */}
        <button
          onClick={() => {
            sounds.playTap();
            showToast("🌍 Course catalog: 30+ languages coming soon!");
          }}
          className="w-full mb-5 py-3.5 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#1cb0f6] bg-gray-50 hover:bg-sky-50/50 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider text-gray-600 hover:text-[#1cb0f6] transition active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add a new course</span>
        </button>

        {/* Score Progress Milestones with Add Section Button */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Score Progress & Sections
            </span>
            <button
              onClick={() => {
                sounds.playVictory();
                showToast("✨ Section 2 unlocked! Keep advancing.");
              }}
              className="flex items-center gap-1 text-[11px] font-black text-[#1cb0f6] bg-sky-100 hover:bg-sky-200 px-2.5 py-1 rounded-lg transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add section</span>
            </button>
          </div>

          <div className="space-y-3 text-xs font-bold">
            <div className="flex items-center gap-2 text-blue-600">
              <span className="text-sm">⭐ 5:</span>
              <span>Getting started (Active)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-sm">🔒 10:</span>
              <span>Introduce yourself</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-sm">🔒 30:</span>
              <span>Order food at a restaurant</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-sm">🔒 50:</span>
              <span>Give directions to a place</span>
            </div>
          </div>
        </div>

        {/* Other Courses Carousel */}
        <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
          New Courses
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="border-2 border-gray-200 rounded-2xl p-3 flex flex-col items-center hover:bg-gray-50 cursor-pointer">
            <span className="text-2xl">🎵</span>
            <span className="text-xs font-black text-gray-700 mt-1">Music</span>
          </div>
          <div className="border-2 border-gray-200 rounded-2xl p-3 flex flex-col items-center hover:bg-gray-50 cursor-pointer">
            <span className="text-2xl">➗</span>
            <span className="text-xs font-black text-gray-700 mt-1">Math</span>
          </div>
          <div className="border-2 border-gray-200 rounded-2xl p-3 flex flex-col items-center hover:bg-gray-50 cursor-pointer">
            <span className="text-2xl">♟️</span>
            <span className="text-xs font-black text-gray-700 mt-1">Chess</span>
          </div>
        </div>
      </div>
    </div>
  );
}
