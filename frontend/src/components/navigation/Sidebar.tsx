"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Target, Sparkles, MoreHorizontal } from "lucide-react";

interface SidebarProps {
  onOpenEnergy?: () => void;
  onOpenShop?: () => void;
}

export default function Sidebar({ onOpenEnergy, onOpenShop }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    {
      label: "LEARN",
      href: "/learn",
      iconType: "home",
      activeColor: "text-[#58cc02]",
    },
    {
      label: "LETTERS",
      href: "/characters",
      iconType: "letters",
      activeColor: "text-[#1cb0f6]",
    },
    {
      label: "LEADERBOARDS",
      href: "/leaderboard",
      iconType: "shield",
      activeColor: "text-[#ffc800]",
    },
    {
      label: "QUESTS",
      href: "/quests",
      iconType: "chest",
      activeColor: "text-[#ff9600]",
    },
    {
      label: "SHOP",
      href: "/shop",
      iconType: "shop",
      activeColor: "text-[#ff4b4b]",
    },
    {
      label: "PROFILE",
      href: "/profile",
      iconType: "profile",
      activeColor: "text-[#1cb0f6]",
    },
    {
      label: "MORE",
      href: "/settings/account",
      iconType: "more",
      activeColor: "text-purple-500",
    },
  ];

  const renderIcon = (type: string, isActive: boolean) => {
    switch (type) {
      case "home":
        return <span className="text-2xl">🏠</span>;
      case "letters":
        return (
          <span className="w-7 h-7 flex items-center justify-center font-black text-xl text-[#1cb0f6] border-2 border-[#1cb0f6] rounded-lg">
            क
          </span>
        );
      case "shield":
        return <span className="text-2xl">🛡️</span>;
      case "chest":
        return <span className="text-2xl">📦</span>;
      case "shop":
        return <span className="text-2xl">🏪</span>;
      case "profile":
        return (
          <div className="w-7 h-7 rounded-full border-2 border-dashed border-[#1cb0f6] flex items-center justify-center font-black text-xs text-[#1cb0f6] bg-sky-50">
            A
          </div>
        );
      case "more":
        return (
          <div className="w-7 h-7 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-xs">
            •••
          </div>
        );
      default:
        return <Home className="w-6 h-6" />;
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r-2 border-[#e5e5e5] bg-white h-screen sticky top-0 px-4 py-6 select-none shrink-0">
      {/* Brand Logo */}
      <Link href="/learn" className="flex items-center gap-2 px-3 mb-8">
        <span className="text-3xl font-black text-[#58cc02] tracking-tighter hover:opacity-90 transition">
          duolingo
        </span>
      </Link>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1.5">
        {links.map((link) => {
          const isActive = pathname === link.href;
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
              {renderIcon(link.iconType, isActive)}
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
