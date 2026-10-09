"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
  ];

  const renderIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Image src="/learn.svg" alt="Learn" width={26} height={26} className="w-6.5 h-6.5 object-contain" />;
      case "letters":
        return <Image src="/letters.svg" alt="Letters" width={26} height={26} className="w-6.5 h-6.5 object-contain" />;
      case "ranks":
        return <Image src="/leaderboard.svg" alt="Ranks" width={26} height={26} className="w-6.5 h-6.5 object-contain" />;
      case "quests":
        return <Image src="/quests.svg" alt="Quests" width={26} height={26} className="w-6.5 h-6.5 object-contain" />;
      case "shop":
        return <Image src="/shop.svg" alt="Shop" width={26} height={26} className="w-6.5 h-6.5 object-contain" />;
      case "profile":
        return <Image src="/mascot.svg" alt="Profile" width={26} height={26} className="w-6.5 h-6.5 object-contain rounded-full" />;
      default:
        return <Image src="/learn.svg" alt="Home" width={26} height={26} className="w-6.5 h-6.5 object-contain" />;
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#e5e5e5] px-1 py-1.5 flex items-center justify-around z-30 select-none">
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.href ||
          (tab.href === "/characters" && pathname === "/letters");
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
