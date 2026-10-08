"use client";

import { useState } from "react";

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
}

export default function StreakModal({ isOpen, onClose, streak }: StreakModalProps) {
  const [tab, setTab] = useState<"personal" | "friends">("personal");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto animate-slide-up">
        {/* Header Tabs */}
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setTab("personal")}
              className={`font-black text-xs uppercase tracking-wider pb-2 border-b-2 transition ${
                tab === "personal"
                  ? "border-[#1cb0f6] text-[#1cb0f6]"
                  : "border-transparent text-gray-400"
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => setTab("friends")}
              className={`font-black text-xs uppercase tracking-wider pb-2 border-b-2 transition ${
                tab === "friends"
                  ? "border-[#1cb0f6] text-[#1cb0f6]"
                  : "border-transparent text-gray-400"
              }`}
            >
              Friends
            </button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-black text-xl p-1">
            ✕
          </button>
        </div>

        {tab === "personal" ? (
          <div>
            <div className="text-center my-4">
              <div className="text-6xl font-black text-[#ff9600]">{streak}</div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-wider mt-1">
                Day Streak!
              </div>
            </div>

            {/* October 2026 Calendar Grid */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black text-gray-700">October 2026</span>
                <span className="text-[10px] font-bold text-gray-400">0 Freezes used</span>
              </div>
              <div className="grid grid-cols-7 text-center text-[10px] font-black text-gray-400 mb-2">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>
              <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-600 gap-y-2">
                <span></span><span></span><span></span><span>1</span><span>2</span><span>3</span><span>4</span>
                <span>5</span><span>6</span><span>7</span>
                {/* Oct 8 Highlighted */}
                <span className="bg-[#ff9600] text-white rounded-full w-6 h-6 mx-auto flex items-center justify-center font-black">
                  8
                </span>
                <span>9</span><span>10</span><span>11</span>
                <span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span>
                <span>19</span><span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span>
                <span>26</span><span>27</span><span>28</span><span>29</span><span>30</span><span>31</span>
              </div>
            </div>

            {/* Streak Society */}
            <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-3 bg-white">
              <span className="text-3xl">🔒</span>
              <div>
                <h4 className="text-xs font-black text-gray-800 uppercase">Streak Society</h4>
                <p className="text-xs font-bold text-gray-500">
                  Reach a 7 day streak to join the Streak Society and earn exclusive rewards.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <span className="text-6xl">🦉🔥👧</span>
            <h3 className="text-base font-black text-gray-800 mt-3">Start Friend Streaks!</h3>
            <p className="text-xs font-bold text-gray-500 mt-1 mb-4">
              Make daily progress together and send each other boosts.
            </p>
            <button className="btn-3d-blue px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider">
              + Add Friends
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
