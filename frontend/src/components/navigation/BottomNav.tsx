"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Target, Sparkles, User, MoreHorizontal } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  // Hide on fullscreen lesson player
  if (pathname.startsWith("/lesson")) return null;

  const tabs = [
    { href: "/learn", type: "home", label: "Learn" },
    { href: "/characters", type: "letters", label: "Letters" },
    { href: "/leaderboard", type: "ranks", label: "Ranks" },
    { href: "/quests", type: "quests", label: "Quests" },
    { href: "/shop", type: "shop", label: "Shop" },
    { href: "/profile", type: "profile", label: "Profile" },
    { href: "/settings/account", type: "more", label: "More" },
  ];

  const renderIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="w-5 h-5" />;
      case "letters":
        return <span className="font-serif font-black text-base leading-none">क</span>;
      case "ranks":
        return <Trophy className="w-5 h-5" />;
      case "quests":
        return <Target className="w-5 h-5" />;
      case "shop":
        return <Sparkles className="w-5 h-5" />;
      case "profile":
        return <User className="w-5 h-5" />;
      case "more":
        return <MoreHorizontal className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#e5e5e5] px-1 py-1.5 flex items-center justify-around z-30 select-none">
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.href ||
          (tab.href === "/characters" && pathname === "/letters") ||
          (tab.href === "/settings/account" && pathname.startsWith("/settings"));
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`p-2 rounded-xl flex flex-col items-center transition ${
              isActive ? "text-[#58cc02] scale-105" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {renderIcon(tab.type)}
            <span className="text-[10px] font-black uppercase tracking-tighter mt-0.5">
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
