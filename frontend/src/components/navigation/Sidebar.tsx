"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, X } from "lucide-react";

interface SidebarProps {
  onOpenEnergy?: () => void;
  onOpenShop?: () => void;
}

export default function Sidebar({ onOpenEnergy, onOpenShop }: SidebarProps) {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [modalType, setModalType] = useState<"help" | "schools" | "det" | null>(null);
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
    <>
      <aside className="hidden md:flex flex-col w-64 border-r-2 border-[#e5e5e5] bg-white h-screen sticky top-0 px-4 py-6 select-none shrink-0 z-40 overflow-visible">
        {/* Brand Logo - Navigates directly to Learn from any other section */}
        <Link
          href="/learn"
          className="flex items-center gap-2 px-3 mb-6 cursor-pointer group select-none"
          title="Go to Learn section"
        >
          <span className="text-3xl font-black text-[#58cc02] tracking-tighter group-hover:opacity-85 transition active:scale-95 inline-block">
            duolingo
          </span>
        </Link>

        {/* Nav Links without any scrollbar or slider */}
        <nav className="flex-1 space-y-1.5 relative overflow-visible">
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

          {/* MORE Button with Floating Dropdown */}
          <div className="relative pt-1" ref={moreRef}>
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition border-2 ${
                isMoreOpen
                  ? "border-[#e5e5e5] bg-gray-100 text-[#4b4b4b]"
                  : isSettingsActive
                  ? "border-purple-300 bg-purple-50 text-purple-700"
                  : "border-transparent text-gray-500 hover:bg-gray-100"
              }`}
            >
              {renderIcon("more", isSettingsActive)}
              <span>MORE</span>
            </button>

            {/* Floating Dropdown next to MORE (Matches authentic Duolingo screenshot 1:1) */}
            {isMoreOpen && (
              <div className="absolute left-[calc(100%+8px)] top-0 w-[270px] bg-white border-2 border-[#e5e5e5] rounded-2xl p-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-50 animate-in fade-in zoom-in-95 duration-100 select-none">
                {/* 1. Duolingo English Test */}
                <a
                  href="https://englishtest.duolingo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-gray-100 transition group text-left"
                >
                  {/* Authentic DET Green Rosette Badge */}
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 32 32" fill="none">
                    <g fill="#58cc02">
                      <circle cx="16" cy="16" r="11" />
                      <circle cx="16" cy="5" r="4" />
                      <circle cx="21.5" cy="6.5" r="4" />
                      <circle cx="25.5" cy="10.5" r="4" />
                      <circle cx="27" cy="16" r="4" />
                      <circle cx="25.5" cy="21.5" r="4" />
                      <circle cx="21.5" cy="25.5" r="4" />
                      <circle cx="16" cy="27" r="4" />
                      <circle cx="10.5" cy="25.5" r="4" />
                      <circle cx="6.5" cy="21.5" r="4" />
                      <circle cx="5" cy="16" r="4" />
                      <circle cx="6.5" cy="10.5" r="4" />
                      <circle cx="10.5" cy="6.5" r="4" />
                    </g>
                    {/* White Duo silhouette in center */}
                    <path
                      d="M16 9.5c-3.5 0-6 2.5-6 6 0 2 1 3.8 2.4 4.8.5.4 1.2.7 2 .9h3.2c.8-.2 1.5-.5 2-.9 1.4-1 2.4-2.8 2.4-4.8 0-3.5-2.5-6-6-6z"
                      fill="white"
                    />
                    <circle cx="13.8" cy="14.8" r="1.3" fill="#58cc02" />
                    <circle cx="18.2" cy="14.8" r="1.3" fill="#58cc02" />
                    <path d="M16 16.2l-.9 1.8h1.8l-.9-1.8z" fill="#ff9600" />
                  </svg>
                  <span className="font-black text-xs uppercase tracking-wider text-[#4b4b4b] group-hover:text-black">
                    DUOLINGO ENGLISH TEST
                  </span>
                </a>

                {/* Subtle Divider */}
                <hr className="border-t-2 border-[#e5e5e5] my-1" />

                {/* 2. Settings */}
                <Link
                  href="/settings/account"
                  onClick={() => setIsMoreOpen(false)}
                  className="block w-full px-3.5 py-2.5 rounded-xl hover:bg-gray-100 transition font-black text-xs uppercase tracking-wider text-[#777777] hover:text-[#4b4b4b] text-left"
                >
                  SETTINGS
                </Link>

                {/* 3. Help */}
                <Link
                  href="/help"
                  onClick={() => setIsMoreOpen(false)}
                  className="block w-full px-3.5 py-2.5 rounded-xl hover:bg-gray-100 transition font-black text-xs uppercase tracking-wider text-[#777777] hover:text-[#4b4b4b] text-left"
                >
                  HELP
                </Link>

                {/* 4. Log Out */}
                <Link
                  href="/welcome"
                  onClick={() => {
                    setIsMoreOpen(false);
                    try {
                      localStorage.clear();
                    } catch {}
                  }}
                  className="block w-full px-3.5 py-2.5 rounded-xl hover:bg-gray-100 transition font-black text-xs uppercase tracking-wider text-[#777777] hover:text-red-500 text-left"
                >
                  LOG OUT
                </Link>
              </div>
            )}
          </div>
        </nav>
      </aside>


      {/* Info Modals for Schools, English Test, and Help */}
      {modalType && (
        <div
          onClick={() => setModalType(null)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border-2 border-gray-200 relative animate-scale-up"
          >
            <button
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {modalType === "schools" && (
              <div className="text-center">
                <span className="text-5xl">🏫</span>
                <h3 className="text-xl font-black text-gray-800 mt-3 mb-2">Duolingo for Schools</h3>
                <p className="text-xs text-gray-500 font-bold mb-6">
                  Free teacher dashboard to assign Hindi lessons, track classroom progress, and gamify homework.
                </p>
                <button
                  onClick={() => setModalType(null)}
                  className="w-full py-3.5 rounded-2xl bg-[#58cc02] text-white font-black text-xs uppercase tracking-wider btn-3d-green"
                >
                  Got It
                </button>
              </div>
            )}

            {modalType === "det" && (
              <div className="text-center">
                <span className="text-5xl">🎓</span>
                <h3 className="text-xl font-black text-gray-800 mt-3 mb-2">Duolingo English Test</h3>
                <p className="text-xs text-gray-500 font-bold mb-6">
                  An accurate, convenient, and fast online English proficiency assessment accepted by 4,000+ universities worldwide.
                </p>
                <button
                  onClick={() => setModalType(null)}
                  className="w-full py-3.5 rounded-2xl bg-[#1cb0f6] text-white font-black text-xs uppercase tracking-wider btn-3d-blue"
                >
                  Learn More
                </button>
              </div>
            )}

            {modalType === "help" && (
              <div className="text-center">
                <span className="text-5xl">❓</span>
                <h3 className="text-xl font-black text-gray-800 mt-3 mb-2">Duolingo Help Center</h3>
                <p className="text-xs text-gray-500 font-bold mb-6">
                  Need help with Hindi 1 lessons, streak freezes, or leaderboards? Visit our community forum or support docs.
                </p>
                <button
                  onClick={() => setModalType(null)}
                  className="w-full py-3.5 rounded-2xl bg-[#58cc02] text-white font-black text-xs uppercase tracking-wider btn-3d-green"
                >
                  Close Help
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
