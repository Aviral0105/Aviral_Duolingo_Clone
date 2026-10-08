"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Target, Heart, Sparkles, User, Settings } from "lucide-react";

interface SidebarProps {
  onOpenEnergy?: () => void;
  onOpenShop?: () => void;
}

export default function Sidebar({ onOpenEnergy, onOpenShop }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { label: "LEARN", href: "/learn", icon: Home, color: "text-[#58cc02]" },
    { label: "LEADERBOARDS", href: "/leaderboard", icon: Trophy, color: "text-[#ffc800]" },
    { label: "QUESTS", href: "/quests", icon: Target, color: "text-[#ff4b4b]" },
    { label: "PRACTICE", href: "/practice", icon: Heart, color: "text-[#1cb0f6]" },
    { label: "SHOP", href: "/shop", icon: Sparkles, color: "text-[#a855f7]" },
    { label: "PROFILE", href: "/profile", icon: User, color: "text-[#1cb0f6]" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r-2 border-[#e5e5e5] bg-white h-screen sticky top-0 px-4 py-6 select-none shrink-0">
      {/* Brand Logo */}
      <Link href="/learn" className="flex items-center gap-2 px-3 mb-8">
        <span className="text-3xl font-black text-[#58cc02] tracking-tighter hover:opacity-90 transition">
          duolingo
        </span>
      </Link>

      {/* Nav Links */}
      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition border-2 ${
                isActive
                  ? "border-[#84d8ff] bg-[#ddf4ff] text-[#1899d6]"
                  : "border-transparent text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-[#1899d6]" : link.color}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Action Buttons */}
      <div className="pt-4 border-t border-gray-200 space-y-2">
        <button
          onClick={onOpenShop}
          className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 border-2 border-purple-200 hover:bg-purple-100 transition"
        >
          ✨ Super Duolingo
        </button>
      </div>
    </aside>
  );
}
