"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/navigation/Sidebar";
import Topbar from "@/components/navigation/Topbar";
import BottomNav from "@/components/navigation/BottomNav";

import CourseModal from "@/components/modals/CourseModal";
import StreakModal from "@/components/modals/StreakModal";
import ShopModal from "@/components/modals/ShopModal";
import EnergyModal from "@/components/modals/EnergyModal";

import { fetchUser, refillHearts } from "@/lib/api";
import { User } from "@/lib/types";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    id: 1,
    username: "Aviral Jain",
    handle: "@AVIRALJAIN51695",
    avatar: "🧑",
    xp: 265,
    streak: 3,
    hearts: 5,
    gems: 155,
    daily_goal_xp: 10,
    is_super: false,
  });

  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [isStreakOpen, setIsStreakOpen] = useState(false);
  const [streakTab, setStreakTab] = useState<"personal" | "friends">("personal");
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isEnergyOpen, setIsEnergyOpen] = useState(false);

  useEffect(() => {
    const refreshUser = () => fetchUser().then(setUser);
    refreshUser();

    window.addEventListener("duo_progress_updated", refreshUser);
    window.addEventListener("focus", refreshUser);

    return () => {
      window.removeEventListener("duo_progress_updated", refreshUser);
      window.removeEventListener("focus", refreshUser);
    };
  }, []);

  const handleRefill = async () => {
    const res = await refillHearts();
    setUser((prev) => ({ ...prev, hearts: res.hearts }));
  };

  const handleActivateSuper = () => {
    setUser((prev) => ({ ...prev, is_super: true, hearts: 999 }));
  };

  return (
    <div className="min-h-screen flex bg-[#f7f7f7]">
      {/* Desktop Left Sidebar */}
      <Sidebar
        onOpenEnergy={() => setIsEnergyOpen(true)}
        onOpenShop={() => setIsShopOpen(true)}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile-only Topbar header */}
        <div className="md:hidden">
          <Topbar
            user={user}
            onOpenCourse={() => setIsCourseOpen(true)}
            onOpenStreak={(tab = "personal") => {
              setStreakTab(tab);
              setIsStreakOpen(true);
            }}
            onOpenShop={() => setIsShopOpen(true)}
            onOpenEnergy={() => setIsEnergyOpen(true)}
          />
        </div>

        <main className="flex-1 pb-20 md:pb-8 flex justify-center">
          <div className="w-full max-w-5xl px-4 py-6">{children}</div>
        </main>

        <BottomNav />
      </div>

      {/* Interactive Global Modals */}
      <CourseModal isOpen={isCourseOpen} onClose={() => setIsCourseOpen(false)} />
      <StreakModal
        isOpen={isStreakOpen}
        onClose={() => setIsStreakOpen(false)}
        streak={user.streak}
        streakFreezes={user.streak_freezes ?? 2}
        initialTab={streakTab}
      />
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        gems={user.gems}
        onActivateSuper={handleActivateSuper}
      />
      <EnergyModal
        isOpen={isEnergyOpen}
        onClose={() => setIsEnergyOpen(false)}
        hearts={user.hearts}
        isSuper={user.is_super}
        onRefill={handleRefill}
        onActivateSuper={handleActivateSuper}
      />
    </div>
  );
}
