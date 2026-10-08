"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Settings,
  HelpCircle,
  GraduationCap,
  Sparkles,
  ExternalLink,
  LogOut,
  X,
} from "lucide-react";

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
      label: "PRACTICE",
      href: "/practice",
      iconType: "practice",
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
      case "practice":
        return <span className="text-2xl">🏋️‍♂️</span>;
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
      <aside className="hidden md:flex flex-col w-64 border-r-2 border-[#e5e5e5] bg-white h-screen sticky top-0 px-4 py-6 select-none shrink-0 z-40">
        {/* Brand Logo */}
        <Link href="/learn" className="flex items-center gap-2 px-3 mb-6">
          <span className="text-3xl font-black text-[#58cc02] tracking-tighter hover:opacity-90 transition">
            duolingo
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1.5 relative overflow-y-auto pr-1">
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
          <div className="relative pt-1" ref={moreRef}>
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
              <div className="absolute left-full bottom-0 ml-3 w-64 bg-white border-2 border-gray-200 rounded-3xl p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
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
                      setModalType("schools");
                      setIsMoreOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-100 transition text-left"
                  >
                    <GraduationCap className="w-5 h-5 text-sky-500" />
                    <span>Schools</span>
                  </button>

                  <button
                    onClick={() => {
                      setModalType("det");
                      setIsMoreOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-100 transition text-left"
                  >
                    <ExternalLink className="w-5 h-5 text-amber-500" />
                    <span>Duolingo English Test</span>
                  </button>

                  <button
                    onClick={() => {
                      setModalType("help");
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
