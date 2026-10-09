import { User, PathResponse, LessonDetail, LeaderboardResponse, GuidebookData, AchievementItem, SocialStats, UserFriend } from "./types";

// NEXT_PUBLIC_* variables are inlined at BUILD time. On a deployed site you must set
// NEXT_PUBLIC_API_URL to your public backend URL (e.g. https://my-api.onrender.com) and REDEPLOY,
// otherwise the browser tries to call localhost:8000 and every request silently falls back to demo data.
const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined" && window.location.hostname && window.location.hostname !== "localhost") {
    return `http://${window.location.hostname}:8000`;
  }
  return "http://localhost:8000";
};

export const API_BASE_URL = typeof window !== "undefined" ? getApiBaseUrl() : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");

// Fallback seed data if backend is offline during frontend dev
const FALLBACK_USER: User = {
  id: 1,
  username: "Aviral Jain",
  handle: "@AVIRALJAIN213584",
  avatar: "🧑",
  profile_image: null,
  invite_code: "BDHTZTB5CW77A",
  xp: 265,
  streak: 3,
  hearts: 5,
  gems: 126,
  daily_goal_xp: 10,
  is_super: false,
};

const FALLBACK_PATH: PathResponse = {
  course_title: "Hindi",
  course_flag: "🇮🇳",
  units: [
    {
      id: 1,
      section_title: "SECTION 1, UNIT 1",
      title: "Form basic sentences",
      description: "Identify basic objects, people, and simple sentence structures in Hindi",
      order_index: 1,
      lessons: [
        { id: 1, title: "Basics 1", icon: "star", order_index: 1, status: "available", crowns: 0 },
        { id: 2, title: "Basics 2", icon: "star", order_index: 2, status: "locked", crowns: 0 },
        { id: 3, title: "Phrases 1", icon: "headphones", order_index: 3, status: "locked", crowns: 0 },
        { id: 4, title: "Unit 1 Milestone", icon: "chest", order_index: 4, status: "locked", crowns: 0 },
      ],
    },
    {
      id: 2,
      section_title: "SECTION 1, UNIT 2",
      title: "Greet people & describe things",
      description: "Learn everyday greetings, polite expressions, colors, and numbers",
      order_index: 2,
      lessons: [
        { id: 5, title: "Greetings", icon: "star", order_index: 1, status: "locked", crowns: 0 },
        { id: 6, title: "Questions", icon: "headphones", order_index: 2, status: "locked", crowns: 0 },
        { id: 7, title: "Unit 2 Milestone", icon: "chest", order_index: 3, status: "locked", crowns: 0 },
      ],
    },
    {
      id: 3,
      section_title: "SECTION 1, UNIT 3",
      title: "Talk about family & food",
      description: "Describe family members, daily meals, and favorite Indian drinks",
      order_index: 3,
      lessons: [
        { id: 8, title: "Family 1", icon: "star", order_index: 1, status: "locked", crowns: 0 },
        { id: 9, title: "Food & Drinks", icon: "camera", order_index: 2, status: "locked", crowns: 0 },
        { id: 10, title: "Section 1 Trophy", icon: "chest", order_index: 3, status: "locked", crowns: 0 },
      ],
    },
  ],
};

export function getActiveUserId(): number {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("duo_active_user_id");
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }
  return 1;
}

export function setActiveUserId(id: number) {
  if (typeof window !== "undefined") {
    localStorage.setItem("duo_active_user_id", id.toString());
    window.dispatchEvent(new Event("duo_progress_updated"));
  }
}

export async function fetchUser(userId?: number): Promise<User> {
  const targetId = userId || getActiveUserId();
  try {
    const res = await fetch(`${API_BASE_URL}/api/user?user_id=${targetId}`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend not reachable, using local user fallback");
  }
  return FALLBACK_USER;
}

export async function fetchAllUsers(): Promise<User[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/all`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend not reachable for all users");
  }
  return [FALLBACK_USER];
}

export async function registerNewUser(data: {
  username: string;
  handle?: string;
  email?: string;
  avatar?: string;
  daily_goal_xp?: number;
  current_league?: string;
}): Promise<User> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const newUser = await res.json();
      setActiveUserId(newUser.id);
      return newUser;
    }
    const err = await res.json();
    throw new Error(err.detail || "Registration failed");
  } catch (e: any) {
    console.warn("Backend registration failed, using local user fallback:", e.message);
    const mockUser: User = {
      id: Date.now(),
      username: data.username,
      handle: data.handle || `@${data.username.toLowerCase().replace(/\s+/g, "")}`,
      avatar: data.avatar || "🧑",
      xp: 0,
      streak: 0,
      hearts: 5,
      gems: 100,
      daily_goal_xp: data.daily_goal_xp || 10,
      is_super: false,
    };
    setActiveUserId(mockUser.id);
    return mockUser;
  }
}

export async function resetUserProgress(userId?: number) {
  const targetId = userId || getActiveUserId();
  const currentBase = typeof window !== "undefined" ? getApiBaseUrl() : API_BASE_URL;
  try {
    const res = await fetch(`${currentBase}/api/user/reset?user_id=${targetId}`, {
      method: "POST",
    });
    if (res.ok) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("duo_completed_lessons");
        localStorage.removeItem("duo_claimed_chests");
        localStorage.removeItem("duo_unlocked_units");
        window.dispatchEvent(new Event("duo_progress_updated"));
      }
      return await res.json();
    }
  } catch (e) {
    console.warn("Reset failed on backend", e);
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem("duo_completed_lessons");
    localStorage.removeItem("duo_claimed_chests");
    localStorage.removeItem("duo_unlocked_units");
    window.dispatchEvent(new Event("duo_progress_updated"));
  }
  return { success: true, message: "Progress reset to 0!" };
}

export async function fetchPath(): Promise<PathResponse> {
  const activeId = getActiveUserId();
  try {
    const res = await fetch(`${API_BASE_URL}/api/path?user_id=${activeId}`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend not reachable, using local path fallback");
  }

  // If local storage has completed lessons, dynamically calculate progression
  if (typeof window !== "undefined") {
    try {
      const completed: number[] = JSON.parse(localStorage.getItem("duo_completed_lessons") || "[]");
      if (completed.length > 0) {
        const pathCopy: PathResponse = JSON.parse(JSON.stringify(FALLBACK_PATH));
        let firstIncompleteFound = false;
        for (const unit of pathCopy.units) {
          for (const l of unit.lessons) {
            if (completed.includes(l.id)) {
              l.status = "completed";
              l.crowns = 1;
            } else if (!firstIncompleteFound) {
              l.status = "available";
              firstIncompleteFound = true;
            } else {
              l.status = "locked";
            }
          }
        }
        return pathCopy;
      }
    } catch {}
  }
  return FALLBACK_PATH;
}

export async function fetchLesson(id: number): Promise<LessonDetail> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/lessons/${id}`, { cache: "no-store" });
    if (res.ok) return await res.json();
    console.error(`[duolingo-clone] GET /api/lessons/${id} failed with HTTP ${res.status}`);
  } catch (e) {
    console.error(`[duolingo-clone] Could not reach backend at ${API_BASE_URL} - showing offline demo lesson`, e);
  }
  // 5 Exercise Types Fallback (Matching user's Hindi 1 video recording exactly)
  return {
    id,
    title: "Unit 1: Form basic sentences",
    xp_reward: 10,
    exercises: [
      {
        id: 1,
        order_index: 1,
        type: "MULTIPLE_CHOICE",
        category_tag: "NEW WORD",
        prompt: 'Which one of these is "Man"?',
        audio_text: "आदमी",
        content: {
          target_word: "आदमी",
          options: [
            { id: "opt1", text: "किताब", icon: "📖" },
            { id: "opt2", text: "औरत", icon: "👩" },
            { id: "opt3", text: "आदमी", icon: "🧔" },
          ],
        },
        correct_answer: "आदमी",
      },
      {
        id: 2,
        order_index: 2,
        type: "WORD_BANK",
        category_tag: "NEW WORD",
        prompt: "Write this in English",
        audio_text: "वह औरत",
        content: {
          sentence_to_translate: "वह औरत",
          word_pool: ["That", "woman", "apple", "man"],
        },
        correct_answer: "That woman",
      },
      {
        id: 3,
        order_index: 3,
        type: "WORD_BANK",
        category_tag: "LISTEN",
        prompt: "Tap what you hear",
        audio_text: "एक सेब",
        content: {
          sentence_to_translate: "एक सेब",
          word_pool: ["और", "है", "एक", "सेब", "किताब", "वह"],
        },
        correct_answer: "एक सेब",
      },
      {
        id: 4,
        order_index: 4,
        type: "MATCH_PAIRS",
        category_tag: "PAIR MATCH",
        prompt: "Tap the matching pairs",
        content: {
          pairs: [
            { es: "नमस्ते", en: "Hello" },
            { es: "किताब", en: "Book" },
            { es: "पानी", en: "Water" },
            { es: "औरत", en: "Woman" },
            { es: "आदमी", en: "Man" },
          ],
        },
        correct_answer: "ALL_MATCHED",
      },
    ],
  };
}

export async function recordMistake(lessonId: number, exerciseId: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/lessons/${lessonId}/record-mistake`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exercise_id: exerciseId }),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Failed to log mistake to backend");
  }
}

export async function resolveMistake(lessonId: number, exerciseId: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/lessons/${lessonId}/resolve-mistake`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exercise_id: exerciseId }),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Failed to log mistake resolution to backend");
  }
}

export async function completeLesson(id: number, heartsLeft: number, mistakesCount: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/lessons/${id}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hearts_left: heartsLeft, mistakes_count: mistakesCount }),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("duo_progress_updated"));
      }
      return data;
    }
  } catch (e) {
    console.warn("Backend not reachable, saving local progress");
  }

  // Fallback local storage persistence if offline
  if (typeof window !== "undefined") {
    try {
      const completed: number[] = JSON.parse(localStorage.getItem("duo_completed_lessons") || "[]");
      if (!completed.includes(id)) {
        completed.push(id);
        localStorage.setItem("duo_completed_lessons", JSON.stringify(completed));
      }
      window.dispatchEvent(new Event("duo_progress_updated"));
    } catch {}
  }
  return { success: true, xp_earned: 10, new_total_xp: 275, streak: 3 };
}

export async function refillHearts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/refill-hearts`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("duo_progress_updated"));
      }
      return data;
    }
  } catch (e) {
    console.warn("Backend not reachable");
  }
  return { hearts: 5, xp: 265, message: "Hearts refilled!" };
}

export async function completePractice(type: "listening" | "mistakes" | "general" = "general") {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/practice-complete?type=${type}`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("duo_progress_updated"));
      }
      return data;
    }
  } catch (e) {
    console.warn("Backend not reachable for practice complete");
  }
  return { hearts: 5, xp: 285, message: "Practice complete!" };
}

export async function fetchXPSummary() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/xp-summary`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend not reachable for xp-summary");
  }
  return null;
}

export async function purchaseShopItem(itemId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/shop/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_id: itemId }),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("duo_progress_updated"));
      }
      return data;
    }
    const err = await res.json();
    throw new Error(err.detail || "Purchase failed");
  } catch (e: any) {
    console.warn("Shop purchase failed:", e.message);
    throw e;
  }
}

export async function fetchUserSettings() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/settings`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Failed to load user settings from backend");
  }
  return {
    sound_effects: true,
    animations: true,
    motivational_messages: true,
    listening_exercises: true,
    speaking_exercises: true,
    dark_mode: "system",
  };
}

export async function updateUserSettings(settings: Record<string, any>) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Failed to update user settings on backend");
  }
}


export async function fetchLeaderboard(tier?: number, userId?: number): Promise<LeaderboardResponse> {
  const targetId = userId || getActiveUserId();
  const params = new URLSearchParams();
  if (tier) params.set("tier", String(tier));
  if (targetId) params.set("user_id", String(targetId));
  const queryString = params.toString();
  const url = queryString ? `${API_BASE_URL}/api/leaderboard?${queryString}` : `${API_BASE_URL}/api/leaderboard`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend not reachable, using local leaderboard fallback");
  }

  let userXp = 265;
  let userName = "Aviral Jain";
  let userLeague = "Gold League";
  let userStatus: string | null = null;
  try {
    const u = await fetchUser(targetId);
    if (u?.xp !== undefined) userXp = u.xp;
    if (u?.username) userName = u.username;
    if (u?.current_league) userLeague = u.current_league;
    if (typeof window !== "undefined") {
      userStatus = localStorage.getItem("duo_user_status") || null;
    }
  } catch {}

  const seeded = [
    { username: "Maya Patel", avatar: "👩🏽", xp: 120, status_emoji: null },
    { username: "Carlos Silva", avatar: "👨🏽", xp: 95, status_emoji: "🔥" },
    { username: "Liam O'Connor", avatar: "🧑🏼", xp: 82, status_emoji: null },
    { username: "Elena Rostova", avatar: "👱🏻‍♀️", xp: 74, status_emoji: "✨" },
    { username: "Kenji Sato", avatar: "👨🏻", xp: 68, status_emoji: null },
    { username: "Fatima Al-Zahra", avatar: "🧕🏽", xp: 59, status_emoji: "🇮🇳" },
    { username: "Arjun Sharma", avatar: "🧑🏾", xp: 55, status_emoji: null },
    { username: "Chloe Dubois", avatar: "👩🏼", xp: 50, status_emoji: null },
    { username: userName, avatar: "🧑", xp: userXp, status_emoji: userStatus, is_current_user: true },
    { username: "Molik", avatar: "🕶️", xp: 41, status_emoji: "💪" },
    { username: "SHAUN ALLEN", avatar: "👨🏼", xp: 40, status_emoji: null },
    { username: "Thrive", avatar: "🧢", xp: 29, status_emoji: null },
    { username: "nguyễn đức trường", avatar: "🧑🏻", xp: 27, status_emoji: null },
    { username: "Seyit Musevi", avatar: "👦🏻", xp: 20, status_emoji: null },
    { username: "Quang Quy Hà", avatar: "🐻", xp: 13, status_emoji: null },
  ].sort((a, b) => b.xp - a.xp);

  return {
    league_name: userLeague,
    tier: tier || 3,
    time_remaining: "2 DAYS",
    promotion_threshold: 11,
    demotion_threshold: 5,
    user_status_emoji: userStatus,
    all_leagues: [
      { id: 1, name: "Bronze League", tier: 1, icon: "🪶", color: "#b47748", promotion_threshold: 11, demotion_threshold: 0, description: "Top 11 advance to the next league" },
      { id: 2, name: "Silver League", tier: 2, icon: "🥈", color: "#a8a8a8", promotion_threshold: 11, demotion_threshold: 5, description: "Top 11 advance to the Gold League" },
      { id: 3, name: "Gold League", tier: 3, icon: "🥇", color: "#ffc800", promotion_threshold: 11, demotion_threshold: 5, description: "Top 11 advance to the Sapphire League" },
      { id: 4, name: "Sapphire League", tier: 4, icon: "💎", color: "#1cb0f6", promotion_threshold: 11, demotion_threshold: 5, description: "Top 11 advance to the Ruby League" },
      { id: 5, name: "Ruby League", tier: 5, icon: "🔴", color: "#ff4b4b", promotion_threshold: 11, demotion_threshold: 5, description: "Top 11 advance to the Diamond League" },
    ],
    entries: seeded.map((item, idx) => ({
      rank: idx + 1,
      username: item.username,
      avatar: item.avatar,
      xp: item.xp,
      is_current_user: (item as any).is_current_user || false,
      status_emoji: item.status_emoji,
    })),
  };
}

export async function setLeaderboardStatus(emoji: string | null) {
  if (typeof window !== "undefined") {
    if (emoji) {
      localStorage.setItem("duo_user_status", emoji);
    } else {
      localStorage.removeItem("duo_user_status");
    }
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/leaderboard/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status_emoji: emoji }),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("duo_progress_updated"));
      }
      return data;
    }
  } catch (e) {
    console.warn("Backend not reachable for status update, using local status");
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("duo_progress_updated"));
  }
  return { success: true, status_emoji: emoji, message: emoji ? `Status set to ${emoji}` : "Status cleared" };
}

export async function switchLeague(tier: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/leaderboard/switch-league?tier=${tier}`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("duo_progress_updated"));
      }
      return data;
    }
  } catch (e) {
    console.warn("Backend not reachable for switch-league");
  }
  return { success: true, tier, message: "Switched league!" };
}

export async function submitSupportFeedback(data: { name: string; email: string; category: string; message: string }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/help/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Feedback backend not reachable, using offline ticket");
  }
  return {
    ticket_code: `DUO-${Math.floor(10000 + Math.random() * 90000)}`,
    status: "open",
    message: "Thank you! Your feedback has been received.",
  };
}

export async function fetchAchievements(userId?: number): Promise<AchievementItem[]> {
  const targetId = userId || getActiveUserId();
  const url = targetId ? `${API_BASE_URL}/api/achievements?user_id=${targetId}` : `${API_BASE_URL}/api/achievements`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Achievements backend not reachable, using calculated fallback");
  }

  // Robust fallback calculation matching backend logic
  let streak = 3;
  let xp = 265;
  let league = "Gold League";
  let hasAvatar = true;
  try {
    const u = await fetchUser(targetId);
    if (u) {
      streak = u.streak ?? 0;
      xp = u.xp ?? 0;
      league = u.current_league ?? "Gold League";
      hasAvatar = Boolean(u.avatar);
    }
  } catch {}

  const calcTier = (val: number, thresh: number[]) => {
    for (let i = 0; i < thresh.length; i++) {
      if (val < thresh[i]) return { level: i + 1, target: thresh[i], max: thresh.length };
    }
    return { level: thresh.length, target: thresh[thresh.length - 1], max: thresh.length };
  };

  const wf = calcTier(streak, [3, 7, 14, 30, 50, 75, 100, 150, 200, 365]);
  const sg = calcTier(xp, [100, 250, 500, 1000, 2000, 4000, 7500, 12500, 25000, 50000]);

  return [
    {
      key: "wildfire",
      title: "Wildfire",
      description: `Reach a ${wf.target}-day streak`,
      icon: "🔥",
      level: wf.level,
      max_level: wf.max,
      current_value: streak,
      target_value: wf.target,
      unlocked: streak >= wf.target,
      bg_color: "bg-[#ff4b4b]",
      ribbon_color: "bg-[#d62828]",
    },
    {
      key: "sage",
      title: "Sage",
      description: `Earn ${sg.target} XP`,
      icon: "🧙‍♂️",
      level: sg.level,
      max_level: sg.max,
      current_value: xp,
      target_value: sg.target,
      unlocked: xp >= sg.target,
      bg_color: "bg-[#58cc02]",
      ribbon_color: "bg-[#46a302]",
    },
    {
      key: "scholar",
      title: "Scholar",
      description: "Learn 50 new words in a single course",
      icon: "📜",
      level: 1,
      max_level: 5,
      current_value: 30,
      target_value: 50,
      unlocked: false,
      bg_color: "bg-[#1cb0f6]",
      ribbon_color: "bg-[#1899d6]",
    },
    {
      key: "regal",
      title: "Regal",
      description: "Earn 3 crowns by completing lessons",
      icon: "👑",
      level: 1,
      max_level: 5,
      current_value: 1,
      target_value: 3,
      unlocked: false,
      bg_color: "bg-[#ffc800]",
      ribbon_color: "bg-[#e5a500]",
    },
    {
      key: "champion",
      title: "Champion",
      description: `Advance to the ${league}`,
      icon: "🛡️",
      level: 3,
      max_level: 5,
      current_value: 3,
      target_value: 3,
      unlocked: true,
      bg_color: "bg-[#a855f7]",
      ribbon_color: "bg-[#9333ea]",
    },
    {
      key: "sharpshooter",
      title: "Sharpshooter",
      description: "Complete 5 lessons with no mistakes",
      icon: "🏹",
      level: 1,
      max_level: 5,
      current_value: 1,
      target_value: 5,
      unlocked: false,
      bg_color: "bg-[#58cc02]",
      ribbon_color: "bg-[#46a302]",
    },
    {
      key: "winner",
      title: "Winner",
      description: "Finish #1 on your leaderboard",
      icon: "🏆",
      level: 1,
      max_level: 1,
      current_value: 0,
      target_value: 1,
      unlocked: false,
      bg_color: "bg-[#a855f7]",
      ribbon_color: "bg-[#9333ea]",
    },
    {
      key: "friendly",
      title: "Friendly",
      description: "Follow 3 fellow learners",
      icon: "🧑‍🤝‍🧑",
      level: 1,
      max_level: 1,
      current_value: 0,
      target_value: 3,
      unlocked: false,
      bg_color: "bg-[#a855f7]",
      ribbon_color: "bg-[#9333ea]",
    },
    {
      key: "weekend_warrior",
      title: "Weekend Warrior",
      description: "Complete a lesson on Saturday and Sunday",
      icon: "🪖",
      level: 1,
      max_level: 1,
      current_value: 0,
      target_value: 2,
      unlocked: false,
      bg_color: "bg-[#58cc02]",
      ribbon_color: "bg-[#46a302]",
    },
    {
      key: "photogenic",
      title: "Photogenic",
      description: "Upload or customize your avatar",
      icon: "👤",
      level: 1,
      max_level: 1,
      current_value: hasAvatar ? 1 : 0,
      target_value: 1,
      unlocked: hasAvatar,
      bg_color: "bg-[#1cb0f6]",
      ribbon_color: "bg-[#1899d6]",
    },
    {
      key: "challenger",
      title: "Challenger",
      description: "Complete 5 daily quests",
      icon: "⚡",
      level: 1,
      max_level: 5,
      current_value: 1,
      target_value: 5,
      unlocked: false,
      bg_color: "bg-[#ff9600]",
      ribbon_color: "bg-[#e58500]",
    },
  ];
}

export async function searchUsers(q: string): Promise<UserFriend[]> {
  const currentId = getActiveUserId();
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/search?q=${encodeURIComponent(q)}&user_id=${currentId}`, {
      cache: "no-store",
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("User search backend not reachable, using mock list");
  }
  // Local fallback mock users if offline
  const fallbackFollowers: UserFriend[] = [
    { id: 2, username: "Priyanka M.", handle: "@priyanka_m", avatar: "👩🏽", is_following: false },
    { id: 3, username: "Nitheesh Kumar B", handle: "@nitheesh_k", avatar: "🧑🏾‍🦱", is_following: false },
    { id: 4, username: "Lucas Dupont", handle: "@lucas_d", avatar: "🧑🏼", is_following: false },
    { id: 5, username: "Seyit Musevi", handle: "@seyit_m", avatar: "👦🏻", is_following: false },
    { id: 6, username: "Sara Connor", handle: "@sara_c", avatar: "👩🏼", is_following: false },
  ];
  if (!q.trim()) return fallbackFollowers;
  return fallbackFollowers.filter(
    (u) =>
      u.username.toLowerCase().includes(q.toLowerCase()) ||
      u.handle.toLowerCase().includes(q.toLowerCase())
  );
}

export async function toggleFollowUser(targetId: number): Promise<{ success: boolean; target_user_id: number; is_following: boolean; message: string }> {
  const currentId = getActiveUserId();
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/follow/${targetId}?user_id=${currentId}`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("duo_social_updated"));
      }
      return data;
    }
  } catch (e) {
    console.warn("Follow user backend not reachable");
  }
  return { success: true, target_user_id: targetId, is_following: true, message: "Updated follow status" };
}

export async function fetchSocialStats(): Promise<SocialStats> {
  const currentId = getActiveUserId();
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/social?user_id=${currentId}`, {
      cache: "no-store",
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Social stats backend not reachable");
  }
  return {
    following_count: 0,
    followers_count: 0,
    following: [],
    followers: [],
  };
}

export async function fetchInviteLink(): Promise<{ invite_code: string; invite_url: string }> {
  const currentId = getActiveUserId();
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/invite?user_id=${currentId}`, {
      cache: "no-store",
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Invite link backend not reachable");
  }
  return {
    invite_code: "BDHTZTB5CW77A",
    invite_url: "https://invite.duolingo.com/BDHTZTB5CW77A",
  };
}

export async function updateUserAvatar(data: {
  avatar?: string;
  profile_image?: string | null;
}): Promise<User | null> {
  const currentId = getActiveUserId();
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/avatar?user_id=${currentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updatedUser = await res.json();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("duo_progress_updated"));
      }
      return updatedUser;
    }
  } catch (e) {
    console.warn("Avatar update backend not reachable");
  }
  return null;
}

export async function updateUserProfile(profile: {
  username?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  profile_image?: string | null;
}): Promise<User | null> {
  const currentId = getActiveUserId();
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/profile?user_id=${currentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (res.ok) {
      const updated = await res.json();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("duo_progress_updated"));
      }
      return updated;
    }
  } catch (e) {
    console.warn("Failed to update profile on backend");
  }
  return null;
}

export async function fetchGuidebook(unitId: number = 1): Promise<GuidebookData> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/guidebook/${unitId}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Guidebook backend unavailable, using fallback");
  }

  return {
    unit_id: unitId,
    section_title: `SECTION 1, UNIT ${unitId}`,
    unit_title: unitId === 1 ? "Form basic sentences" : unitId === 2 ? "Greet people & describe things" : "Talk about family & food",
    description: "Master plural pronouns, basic sentence structures, and essential food and drink vocabulary in Hindi.",
    key_phrases: [
      {
        id: 1,
        hi: "वे औरतें हैं।",
        en: "They are women.",
        audio_text: "वे औरतें हैं।",
        words: [
          { hi: "वे", en: "They / Those" },
          { hi: "औरतें", en: "women" },
          { hi: "हैं।", en: "are" },
        ],
      },
      {
        id: 2,
        hi: "ये सेब हैं।",
        en: "These are apples.",
        audio_text: "ये सेब हैं।",
        words: [
          { hi: "ये", en: "These" },
          { hi: "सेब", en: "apples" },
          { hi: "हैं।", en: "are" },
        ],
      },
      {
        id: 3,
        hi: "हम केले और सेब खाते हैं।",
        en: "We eat bananas and apples.",
        audio_text: "हम केले और सेब खाते हैं।",
        words: [
          { hi: "हम", en: "We" },
          { hi: "केले", en: "bananas" },
          { hi: "और", en: "and" },
          { hi: "सेब", en: "apples" },
          { hi: "खाते", en: "eat" },
          { hi: "हैं।", en: "are" },
        ],
      },
      {
        id: 4,
        hi: "राज और नेहा पानी पीते हैं।",
        en: "Raj and Neha drink water.",
        audio_text: "राज और नेहा पानी पीते हैं।",
        words: [
          { hi: "राज", en: "Raj" },
          { hi: "और", en: "and" },
          { hi: "नेहा", en: "Neha" },
          { hi: "पानी", en: "water" },
          { hi: "पीते", en: "drink" },
          { hi: "हैं।", en: "are" },
        ],
      },
      {
        id: 5,
        hi: "लड़के चाय नहीं पीते।",
        en: "The boys do not drink tea.",
        audio_text: "लड़के चाय नहीं पीते।",
        words: [
          { hi: "लड़के", en: "The boys" },
          { hi: "चाय", en: "tea" },
          { hi: "नहीं", en: "do not" },
          { hi: "पीते।", en: "drink" },
        ],
      },
      {
        id: 6,
        hi: "नमस्ते! आप कैसे हैं?",
        en: "Hello! How are you?",
        audio_text: "नमस्ते! आप कैसे हैं?",
        words: [
          { hi: "नमस्ते!", en: "Hello / Greetings!" },
          { hi: "आप", en: "you (polite)" },
          { hi: "कैसे", en: "how" },
          { hi: "हैं?", en: "are?" },
        ],
      },
      {
        id: 7,
        hi: "लड़कियाँ किताबें पढ़ती हैं।",
        en: "The girls read books.",
        audio_text: "लड़कियाँ किताबें पढ़ती हैं।",
        words: [
          { hi: "लड़कियाँ", en: "The girls" },
          { hi: "किताबें", en: "books" },
          { hi: "पढ़ती", en: "read" },
          { hi: "हैं।", en: "are" },
        ],
      },
      {
        id: 8,
        hi: "यह एक बड़ा और मीठा सेब है।",
        en: "This is a big and sweet apple.",
        audio_text: "यह एक बड़ा और मीठा सेब है।",
        words: [
          { hi: "यह", en: "This" },
          { hi: "एक", en: "a / one" },
          { hi: "बड़ा", en: "big" },
          { hi: "और", en: "and" },
          { hi: "मीठा", en: "sweet" },
          { hi: "सेब", en: "apple" },
          { hi: "है।", en: "is" },
        ],
      },
    ],
    grammar_tips: [
      {
        title: "Tip: Making Things Plural (बहुवचन)",
        summary: "In Hindi, plural formation depends on gender and noun endings.",
        rules: [
          {
            category: "Feminine nouns ending in consonants",
            change: "Add -एँ (-en)",
            examples: "औरत (woman) → औरतें (women), किताब (book) → किताबें (books)",
          },
          {
            category: "Masculine nouns ending in -आ (-aa)",
            change: "Change -आ to -ए (-e)",
            examples: "लड़का (boy) → लड़के (boys), केला (banana) → केले (bananas)",
          },
          {
            category: "Invariable masculine nouns",
            change: "No change in direct plural",
            examples: "सेब (apple) → सेब (apples), आदमी (man) → आदमी (men)",
          },
        ],
      },
      {
        title: "Tip: Demonstrative Pronouns (यह/ये and वह/वे)",
        summary: "Use different demonstrative pronouns for near vs. far objects and singular vs. plural.",
        table: [
          { pronoun: "यह (yeh)", distance: "Near", number: "Singular", meaning: "This / He / She", verb: "है (hai)" },
          { pronoun: "ये (ye)", distance: "Near", number: "Plural", meaning: "These / They", verb: "हैं (hain)" },
          { pronoun: "वह (vah)", distance: "Far", number: "Singular", meaning: "That / He / She", verb: "है (hai)" },
          { pronoun: "वे (ve)", distance: "Far", number: "Plural", meaning: "Those / They", verb: "हैं (hain)" },
        ],
      },
      {
        title: "Tip: Verb Agreement & Negation (क्रिया और नकार)",
        summary: "Verbs agree in gender and number with the subject. In negative sentences, 'नहीं' comes right before the verb.",
        examples: [
          { hi: "राज पानी पीता है।", en: "Raj drinks water. (Masculine Singular: -ता है)" },
          { hi: "नेहा पानी पीती है।", en: "Neha drinks water. (Feminine Singular: -ती है)" },
          { hi: "लड़के पानी पीते हैं।", en: "The boys drink water. (Masculine Plural: -ते हैं)" },
          { hi: "लड़के चाय नहीं पीते।", en: "The boys do not drink tea. (Negation: नहीं before verb)" },
        ],
      },
    ],
    vocabulary: [
      { category: "Pronouns", devanagari: "वे", transliteration: "ve", meaning: "they / those" },
      { category: "Pronouns", devanagari: "ये", transliteration: "ye", meaning: "these" },
      { category: "Pronouns", devanagari: "हम", transliteration: "ham", meaning: "we" },
      { category: "People", devanagari: "औरतें", transliteration: "auraten", meaning: "women" },
      { category: "People", devanagari: "लड़के", transliteration: "ladke", meaning: "boys" },
      { category: "People", devanagari: "लड़कियाँ", transliteration: "ladkiyan", meaning: "girls" },
      { category: "Food & Drinks", devanagari: "सेब", transliteration: "seb", meaning: "apple(s)" },
      { category: "Food & Drinks", devanagari: "केले", transliteration: "kele", meaning: "bananas" },
      { category: "Food & Drinks", devanagari: "पानी", transliteration: "paani", meaning: "water" },
      { category: "Food & Drinks", devanagari: "चाय", transliteration: "chaay", meaning: "tea" },
      { category: "Actions", devanagari: "खाते हैं", transliteration: "khaate hain", meaning: "eat (plural)" },
      { category: "Actions", devanagari: "पीते हैं", transliteration: "peete hain", meaning: "drink (plural)" },
    ],
  };
}
