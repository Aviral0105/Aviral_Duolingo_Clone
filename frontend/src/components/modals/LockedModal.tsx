"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface LockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isSuper?: boolean;
}

export default function LockedModal({ isOpen, onClose, title, isSuper }: LockedModalProps) {
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
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up shadow-2xl cursor-default"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-gray-800">{title}</h3>
            {isSuper && (
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                Super
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-xl hover:bg-gray-100 transition active:scale-95"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
        <p className="text-xs font-bold text-gray-500 mb-5">
          Complete all levels above to unlock this!
        </p>
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider btn-3d-gray cursor-pointer hover:opacity-90 active:scale-95 transition"
        >
          Locked
        </button>
      </div>
    </div>
  );
}
