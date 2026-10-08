"use client";

import { useState } from "react";

export default function LeaderboardPage() {
  const [selectedEmoji, setSelectedEmoji] = useState("😊");

  const emojis = [
    "😎", "🎊", "💪", "👀", "🍿", "🇮🇳",
    "😠", "💯", "💩", "🏆", "⛏️", "😾"
  ];

  const rankings = [
    {
      rank: 1,
      name: "Nitheesh Kumar B",
      xp: "45 XP",
      avatar: "🧑🏾‍🦱",
      isUser: false,
      ribbonColor: "bg-amber-400 text-amber-900 border-amber-500",
    },
    {
      rank: 2,
      name: "AVIRAL JAIN",
      xp: "34 XP",
      avatar: "A",
      isUser: true,
      ribbonColor: "bg-slate-300 text-slate-800 border-slate-400",
    },
    {
      rank: 3,
      name: "Seyit Musevi",
      xp: "10 XP",
      avatar: "👦🏻",
      isUser: false,
      ribbonColor: "bg-amber-700 text-amber-100 border-amber-800",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 select-none items-start">
      {/* LEFT/CENTER COLUMN: LEAGUE RANKINGS */}
      <div className="flex-1 w-full max-w-xl mx-auto">
        {/* League Shield Header */}
        <div className="text-center pb-6 border-b-2 border-gray-200 mb-6">
          {/* Shields Row */}
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Bronze Shield with Feather */}
            <div className="w-16 h-20 rounded-2xl bg-gradient-to-b from-amber-700 to-amber-900 border-2 border-amber-600 shadow-md flex items-center justify-center text-3xl">
              🪶
            </div>
            {/* 3 Gray Locked Shields */}
            <div className="w-12 h-16 rounded-xl bg-gray-200 opacity-60 flex items-center justify-center text-lg text-gray-400">
              🔒
            </div>
            <div className="w-12 h-16 rounded-xl bg-gray-200 opacity-40 flex items-center justify-center text-lg text-gray-400">
              🔒
            </div>
            <div className="w-12 h-16 rounded-xl bg-gray-200 opacity-30 flex items-center justify-center text-lg text-gray-400">
              🔒
            </div>
          </div>

          <h1 className="text-2xl font-black text-gray-800">Bronze League</h1>
          <p className="text-sm font-bold text-gray-500 mt-1">Top 11 advance to the next league</p>
          <div className="text-xs font-black text-amber-500 uppercase tracking-wider mt-1">
            2 days
          </div>
        </div>

        {/* Ranking List matching user's screenshot */}
        <div className="space-y-3">
          {rankings.map((item) => (
            <div
              key={item.rank}
              className={`flex items-center justify-between p-4 rounded-2xl transition border-2 ${
                item.isUser
                  ? "bg-[#d7ffb8] border-[#b8f28b] shadow-xs"
                  : "bg-white border-transparent hover:border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Ribbon Medal */}
                <div
                  className={`w-7 h-9 rounded-md flex items-center justify-center font-black text-sm shadow-xs border-b-2 ${item.ribbonColor}`}
                >
                  {item.rank}
                </div>

                {/* Avatar with Green Online Dot */}
                <div className="relative">
                  {item.isUser ? (
                    <div className="w-11 h-11 rounded-full border-2 border-dashed border-[#58cc02] bg-white flex items-center justify-center font-black text-gray-700 text-lg">
                      {item.avatar}
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                      {item.avatar}
                    </div>
                  )}
                  {/* Green Online Dot */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#58cc02] border-2 border-white rounded-full"></span>
                </div>

                {/* Name */}
                <span
                  className={`font-black text-base ${
                    item.isUser ? "text-[#58a700]" : "text-gray-800"
                  }`}
                >
                  {item.name}
                </span>
              </div>

              {/* XP */}
              <span
                className={`font-black text-sm ${
                  item.isUser ? "text-[#58a700]" : "text-gray-500"
                }`}
              >
                {item.xp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: "SET YOUR STATUS" WIDGET (Exact match to screenshot) */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-xs">
          <h2 className="text-base font-black text-gray-800 mb-4">Set your status</h2>

          {/* Avatar Preview with Selected Status */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-2xl font-black text-gray-400">
                A
              </div>
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-[#58cc02] border-2 border-white rounded-full"></span>
              {/* Speech bubble */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-gray-200 shadow-sm flex items-center justify-center text-base">
                {selectedEmoji}
              </div>
            </div>
          </div>

          {/* 12-Emoji Sticker Grid (2x6) */}
          <div className="grid grid-cols-6 gap-2">
            {emojis.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedEmoji(emoji)}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg border-2 transition active:scale-95 ${
                  selectedEmoji === emoji
                    ? "border-[#1cb0f6] bg-sky-50 shadow-xs"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <footer className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex flex-wrap gap-x-3 gap-y-1.5 px-2">
          <span>ABOUT</span>
          <span>BLOG</span>
          <span>STORE</span>
          <span>EFFICACY</span>
          <span>CAREERS</span>
          <span>INVESTORS</span>
          <span>TERMS</span>
          <span>PRIVACY</span>
        </footer>
      </div>
    </div>
  );
}
