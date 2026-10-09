"use client";

import Link from "next/link";
import { User } from "@/lib/types";
import TopStatsBar from "./TopStatsBar";

interface TopbarProps {
  user: User;
  onOpenCourse?: () => void;
  onOpenStreak?: (tab?: "personal" | "friends") => void;
  onOpenShop?: () => void;
  onOpenEnergy?: () => void;
}

export default function Topbar({
  user,
  onOpenCourse,
  onOpenStreak,
}: TopbarProps) {
  return (
    <header className="w-full bg-white border-b-2 border-[#e5e5e5] px-4 py-2.5 flex items-center justify-between z-30 select-none">
      {/* Mobile-only Duolingo Logo linking to /learn */}
      <Link
        href="/learn"
        className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition shrink-0"
      >
        <span className="text-2xl font-black text-[#58cc02] tracking-tighter">
          duolingo
        </span>
      </Link>

      {/* Top Stats Bar: 100% unified with desktop */}
      <div className="flex items-center">
        <TopStatsBar
          user={user}
          onOpenCourse={onOpenCourse}
          onOpenStreak={onOpenStreak}
        />
      </div>
    </header>
  );
}
