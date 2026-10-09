import { User, PathResponse, LessonDetail, LeaderboardResponse, GuidebookData } from "./types";

// NEXT_PUBLIC_* variables are inlined at BUILD time. On a deployed site you must set
// NEXT_PUBLIC_API_URL to your public backend URL (e.g. https://my-api.onrender.com) and REDEPLOY,
// otherwise the browser tries to call localhost:8000 and every request silently falls back to demo data.
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");

if (typeof window !== "undefined" && window.location.hostname !== "localhost" && API_BASE_URL.includes("localhost")) {
  console.error(
    "[duolingo-clone] NEXT_PUBLIC_API_URL is not set for this deployment. API calls go to " +
      API_BASE_URL + " and will fail. Set it to your deployed backend URL and redeploy the frontend."
  );
}

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

export async function fetchAchievements() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/achievements`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Achievements backend not reachable");
  }
  return null;
}

export async function searchUsers(q: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/search?q=${encodeURIComponent(q)}`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("User search backend not reachable");
  }
  return [];
}

export async function toggleFollowUser(targetId: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/follow/${targetId}`, { method: "POST" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Follow user backend not reachable");
  }
  return { success: true, target_user_id: targetId, is_following: true, message: "Updated follow status" };
}

export async function updateUserProfile(profile: { username?: string; email?: string; phone?: string }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Failed to update profile on backend");
  }
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
