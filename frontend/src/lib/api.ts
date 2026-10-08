import { User, PathResponse, LessonDetail, LeaderboardResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Fallback seed data if backend is offline during frontend dev
const FALLBACK_USER: User = {
  id: 1,
  username: "Aviral Jain",
  handle: "@AVIRALJAIN213584",
  avatar: "🧑",
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
        { id: 1, title: "Basics 1", icon: "star", order_index: 1, status: "completed", crowns: 1 },
        { id: 2, title: "Basics 2", icon: "star", order_index: 2, status: "available", crowns: 0 },
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

export async function fetchUser(): Promise<User> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend not reachable, using local user fallback");
  }
  return FALLBACK_USER;
}

export async function fetchPath(): Promise<PathResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/path`, { cache: "no-store" });
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
  } catch (e) {
    console.warn("Backend not reachable, returning default exercises sequence");
  }

  // 5 Exercise Types Fallback (Matching user's Hindi 1 video recording exactly)
  return {
    id: 1,
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
      {
        id: 5,
        order_index: 5,
        type: "FILL_BLANK",
        category_tag: "FILL BLANK",
        prompt: "Complete the sentence",
        audio_text: "यह एक सेब है",
        content: {
          prefix: "यह एक",
          suffix: "है।",
          options: ["सेब", "पीती", "और"],
        },
        correct_answer: "सेब",
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


export async function fetchLeaderboard(): Promise<LeaderboardResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/leaderboard`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend not reachable, using local leaderboard fallback");
  }
  return {
    league_name: "Silver League",
    time_remaining: "2 DAYS",
    entries: [
      { rank: 1, username: "Elena_G", avatar: "👧", xp: 410, is_current_user: false },
      { rank: 2, username: "Aviral Jain (You)", avatar: "🧑", xp: 265, is_current_user: true },
      { rank: 3, username: "Carlos99", avatar: "🧔", xp: 220, is_current_user: false },
      { rank: 4, username: "Sophie_Paris", avatar: "👩", xp: 180, is_current_user: false },
    ],
  };
}
