export interface LeagueConfig {
  id: number;
  name: string;
  tier: number;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  gradient: string;
  promotion_threshold: number;
  demotion_threshold: number;
  description: string;
}

export const LEAGUES_CONFIG: LeagueConfig[] = [
  {
    id: 1,
    name: "Bronze League",
    tier: 1,
    icon: "🪶",
    color: "#b47748",
    bgColor: "bg-[#b47748]/20",
    borderColor: "border-[#d99462]",
    gradient: "from-[#b47748] to-[#8d542b]",
    promotion_threshold: 11,
    demotion_threshold: 0,
    description: "Top 11 advance to the next league",
  },
  {
    id: 2,
    name: "Silver League",
    tier: 2,
    icon: "🥈",
    color: "#a8a8a8",
    bgColor: "bg-slate-200/50",
    borderColor: "border-slate-300",
    gradient: "from-slate-400 to-slate-600",
    promotion_threshold: 11,
    demotion_threshold: 5,
    description: "Top 11 advance to the Gold League",
  },
  {
    id: 3,
    name: "Gold League",
    tier: 3,
    icon: "🥇",
    color: "#ffc800",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-400",
    gradient: "from-amber-400 to-amber-600",
    promotion_threshold: 11,
    demotion_threshold: 5,
    description: "Top 11 advance to the Sapphire League",
  },
  {
    id: 4,
    name: "Sapphire League",
    tier: 4,
    icon: "💎",
    color: "#1cb0f6",
    bgColor: "bg-sky-100",
    borderColor: "border-sky-400",
    gradient: "from-sky-400 to-blue-600",
    promotion_threshold: 11,
    demotion_threshold: 5,
    description: "Top 11 advance to the Ruby League",
  },
  {
    id: 5,
    name: "Ruby League",
    tier: 5,
    icon: "🔴",
    color: "#ff4b4b",
    bgColor: "bg-rose-100",
    borderColor: "border-rose-400",
    gradient: "from-rose-500 to-red-700",
    promotion_threshold: 11,
    demotion_threshold: 5,
    description: "Top 11 advance to the Diamond League",
  },
];

export function getLeagueConfig(nameOrTier?: string | number | null): LeagueConfig {
  if (!nameOrTier) return LEAGUES_CONFIG[2]; // Default to Gold League (Tier 3)
  if (typeof nameOrTier === "number") {
    return LEAGUES_CONFIG.find((l) => l.tier === nameOrTier) || LEAGUES_CONFIG[2];
  }
  const clean = String(nameOrTier).toLowerCase();
  if (clean.includes("bronze")) return LEAGUES_CONFIG[0];
  if (clean.includes("silver")) return LEAGUES_CONFIG[1];
  if (clean.includes("gold")) return LEAGUES_CONFIG[2];
  if (clean.includes("sapphire")) return LEAGUES_CONFIG[3];
  if (clean.includes("ruby")) return LEAGUES_CONFIG[4];
  return LEAGUES_CONFIG[2];
}
