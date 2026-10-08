"use client";

import { useState } from "react";
import { Check, X, Flag, ThumbsUp, ThumbsDown } from "lucide-react";

interface FeedbackBarProps {
  status: "idle" | "correct" | "incorrect";
  hasSelection: boolean;
  correctAnswerText?: string;
  meaningText?: string;
  praiseTitle?: string;
  onCheck: () => void;
  onContinue: () => void;
}

export default function FeedbackBar({
  status,
  hasSelection,
  correctAnswerText,
  meaningText,
  praiseTitle = "Nice job!",
  onCheck,
  onContinue,
}: FeedbackBarProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  return (
    <>
      {status === "correct" && (
        <footer className="fixed bottom-0 left-0 right-0 border-t-2 border-[#b8f28b] bg-[#d7ffb8] p-4 sm:p-5 z-40 animate-slide-up">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-full bg-[#58cc02] text-white flex items-center justify-center shrink-0">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#58cc02]">{praiseTitle}</h3>
                {meaningText && (
                  <p className="text-xs font-bold text-green-800 mt-0.5">Meaning: {meaningText}</p>
                )}
                {/* Sub feedback pills from video */}
                <div className="flex items-center gap-3 mt-2 text-[11px] font-black text-green-700">
                  <button className="flex items-center gap-1 hover:opacity-80 active:scale-95 transition">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>TOO EASY</span>
                  </button>
                  <button className="flex items-center gap-1 hover:opacity-80 active:scale-95 transition">
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>TOO DIFFICULT</span>
                  </button>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="flex items-center gap-1 hover:opacity-80 active:scale-95 transition"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>REPORT</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={onContinue}
              className="w-full sm:w-44 py-4 rounded-2xl font-black text-sm uppercase tracking-wider btn-3d-green shrink-0"
            >
              Continue
            </button>
          </div>
        </footer>
      )}

      {status === "incorrect" && (
        <footer className="fixed bottom-0 left-0 right-0 border-t-2 border-[#ffc1c3] bg-[#ffdfe0] p-4 sm:p-5 z-40 animate-slide-up">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-full bg-[#ff4b4b] text-white flex items-center justify-center shrink-0">
                <X className="w-8 h-8 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#ff4b4b]">Correct solution:</h3>
                <p className="text-base font-black text-red-700 mt-0.5">{correctAnswerText}</p>
                {/* Sub feedback pills */}
                <div className="flex items-center gap-3 mt-2 text-[11px] font-black text-red-700">
                  <button className="flex items-center gap-1 hover:opacity-80 active:scale-95 transition">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>TOO EASY</span>
                  </button>
                  <button className="flex items-center gap-1 hover:opacity-80 active:scale-95 transition">
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>TOO DIFFICULT</span>
                  </button>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="flex items-center gap-1 hover:opacity-80 active:scale-95 transition"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>REPORT</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={onContinue}
              className="w-full sm:w-44 py-4 rounded-2xl font-black text-sm uppercase tracking-wider btn-3d-red shrink-0"
            >
              Continue
            </button>
          </div>
        </footer>
      )}

      {status === "idle" && (
        <footer className="fixed bottom-0 left-0 right-0 border-t-2 border-[#e5e5e5] bg-white p-4 sm:p-5 z-40">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <button
              onClick={onContinue}
              className="px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-gray-400 hover:text-gray-600 transition"
            >
              Skip
            </button>
            <button
              onClick={onCheck}
              disabled={!hasSelection}
              className={`w-40 sm:w-44 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition ${
                hasSelection ? "btn-3d-green" : "btn-3d-gray"
              }`}
            >
              Check
            </button>
          </div>
        </footer>
      )}

      {/* Report Issue Modal from Video */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-base font-black text-gray-800">Report an issue</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600 font-black"
              >
                ✕
              </button>
            </div>

            {reportSubmitted ? (
              <div className="py-6 text-center">
                <span className="text-4xl">✓</span>
                <p className="font-black text-sm text-gray-700 mt-2">Thank you for your feedback!</p>
              </div>
            ) : (
              <div className="py-4 space-y-3 text-xs font-bold text-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded-md w-4 h-4 text-blue-500" />
                  <span>The audio does not sound correct.</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded-md w-4 h-4 text-blue-500" />
                  <span>The dictionary hints are wrong.</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded-md w-4 h-4 text-blue-500" />
                  <span>My answer should be accepted.</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded-md w-4 h-4 text-blue-500" />
                  <span>Something else went wrong.</span>
                </label>

                <button
                  onClick={() => {
                    setReportSubmitted(true);
                    setTimeout(() => {
                      setReportSubmitted(false);
                      setShowReportModal(false);
                    }, 1500);
                  }}
                  className="w-full mt-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider btn-3d-blue"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
