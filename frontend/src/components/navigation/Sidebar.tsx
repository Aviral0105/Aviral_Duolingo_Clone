"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Settings,
  HelpCircle,
  GraduationCap,
  Headphones,
  BookOpen,
  LogOut,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  onOpenEnergy?: () => void;
  onOpenShop?: () => void;
}

export default function Sidebar({ onOpenEnergy, onOpenShop }: SidebarProps) {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close more menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const isSettingsActive = pathname.startsWith("/settings");

  return (
    <aside className="hidden md:flex flex-col w-64 border-r-2 border-[#e5e5e5] bg-white h-screen sticky top-0 px-4 py-6 select-none shrink-0 z-40">
      {/* Brand Logo */}
      <Link href="/learn" className="flex items-center gap-2 px-3 mb-8">
        <span className="text-3xl font-black text-[#58cc02] tracking-tighter hover:opacity-90 transition">
          duolingo
        </span>
      </Link>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1.5 relative">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href === "/characters" && pathname === "/letters");
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

        {/* MORE Button with Popover Menu */}
        <div className="relative" ref={moreRef}>
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition border-2 ${
              isSettingsActive || isMoreOpen
                ? "border-purple-300 bg-purple-50 text-purple-700"
                : "border-transparent text-gray-500 hover:bg-gray-100"
            }`}
          >
            {renderIcon("more", isSettingsActive)}
            <span>MORE</span>
          </button>

          {/* Floating MORE Popover Card */}
          {isMoreOpen && (
            <div className="absolute left-full bottom-0 ml-3 w-56 bg-white border-2 border-gray-200 rounded-3xl p-2.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="space-y-1 text-gray-700 font-black text-xs uppercase tracking-wider">
                <Link
                  href="/settings/account"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-100 transition"
                >
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span>Settings</span>
                </Link>

                <button
                  onClick={() => {
                    alert("Duolingo for Schools: Free teacher tools for classrooms!");
                    setIsMoreOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-100 transition text-left"
                >
                  <GraduationCap className="w-5 h-5 text-sky-500" />
                  <span>Schools</span>
                </button>

                <button
                  onClick={() => {
                    alert("Duolingo Podcasts: Fascinating stories in easy-to-understand audio!");
                    setIsMoreOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-100 transition text-left"
                >
                  <Headphones className="w-5 h-5 text-amber-500" />
                  <span>Podcast</span>
                </button>

                <button
                  onClick={() => {
                    alert("Duolingo Dictionary: Search Hindi translations and grammatical tips!");
                    setIsMoreOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-100 transition text-left"
                >
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  <span>Dictionary</span>
                </button>

                <button
                  onClick={() => {
                    alert("Help Center: FAQs, account recovery, and bug reporting.");
                    setIsMoreOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-100 transition text-left"
                >
                  <HelpCircle className="w-5 h-5 text-indigo-500" />
                  <span>Help</span>
                </button>

                <Link
                  href="/welcome"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-100 text-[#58cc02] transition"
                >
                  <Sparkles className="w-5 h-5 text-[#58cc02]" />
                  <span>Welcome / Home</span>
                </Link>

                <div className="border-t border-gray-100 my-1" />

                <Link
                  href="/welcome"
                  onClick={() => setIsMoreOpen(false)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 text-red-500 transition text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log out</span>
                </Link>
              </div>
            </div>
          )}
        </div>
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
