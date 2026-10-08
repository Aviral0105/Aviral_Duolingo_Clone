"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Target, Heart, Sparkles, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  // Hide on fullscreen lesson player
  if (pathname.startsWith("/lesson")) return null;

  const tabs = [
    { href: "/learn", icon: Home, label: "Learn" },
    { href: "/leaderboard", icon: Trophy, label: "Ranks" },
    { href: "/quests", icon: Target, label: "Quests" },
    { href: "/practice", icon: Heart, label: "Practice" },
    { href: "/shop", icon: Sparkles, label: "Shop" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#e5e5e5] px-2 py-2 flex items-center justify-around z-30 select-none">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`p-2 rounded-xl flex flex-col items-center transition ${
              isActive ? "text-[#58cc02] scale-105" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Icon className="w-6 h-6" />
          </Link>
        );
      })}
    </nav>
  );
}
