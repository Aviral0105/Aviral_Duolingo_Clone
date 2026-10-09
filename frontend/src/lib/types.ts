export type ExerciseType = 
  | "MULTIPLE_CHOICE"
  | "WORD_BANK"
  | "MATCH_PAIRS"
  | "FILL_BLANK"
  | "TYPE_ANSWER";

export interface User {
  id: number;
  username: string;
  handle: string;
  avatar: string;
  xp: number;
  streak: number;
  hearts: number;
  gems: number;
  daily_goal_xp: number;
  is_super: boolean;
  streak_freezes?: number;
  double_xp_until?: string | null;
  hearts_updated_at?: string | null;
  current_league?: string;
}

export interface Exercise {
  id: number;
  order_index: number;
  type: ExerciseType;
  category_tag: string;
  prompt: string;
  audio_text?: string;
  content: any;
  correct_answer: string;
}

export interface LessonDetail {
  id: number;
  title: string;
  xp_reward: number;
  exercises: Exercise[];
}

export interface LessonNode {
  id: number;
  title: string;
  icon: string;
  order_index: number;
  status: "completed" | "available" | "locked";
  crowns: number;
}

export interface Unit {
  id: number;
  section_title: string;
  title: string;
  description: string;
  order_index: number;
  lessons: LessonNode[];
}

export interface PathResponse {
  course_title: string;
  course_flag: string;
  units: Unit[];
}

export interface LeagueInfo {
  id: number;
  name: string;
  tier: number;
  icon: string;
  color: string;
  promotion_threshold: number;
  demotion_threshold: number;
  description: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  xp: number;
  is_current_user: boolean;
  status_emoji?: string | null;
}

export interface LeaderboardResponse {
  league_name: string;
  tier?: number;
  time_remaining: string;
  promotion_threshold?: number;
  demotion_threshold?: number;
  user_status_emoji?: string | null;
  all_leagues?: LeagueInfo[];
  entries: LeaderboardEntry[];
}

export interface KeyPhraseWord {
  hi: string;
  en: string;
}

export interface KeyPhrase {
  id: number;
  hi: string;
  en: string;
  audio_text?: string;
  words?: KeyPhraseWord[];
}

export interface GrammarTipRule {
  category?: string;
  change?: string;
  examples?: string;
  type?: string;
  rule?: string;
  example?: string;
}

export interface GrammarTip {
  title: string;
  summary?: string;
  explanation?: string;
  rules?: GrammarTipRule[];
  table?: any[];
  examples?: any[];
  notes?: string[];
}

export interface VocabularyWord {
  category: string;
  devanagari: string;
  transliteration: string;
  meaning: string;
}

export interface GuidebookData {
  unit_id: number;
  section_title: string;
  unit_title: string;
  description: string;
  key_phrases: KeyPhrase[];
  grammar_tips: GrammarTip[];
  vocabulary: VocabularyWord[];
}

export interface AchievementItem {
  key: string;
  title: string;
  description: string;
  icon: string;
  level: number;
  max_level: number;
  current_value: number;
  target_value: number;
  unlocked: boolean;
  bg_color?: string;
  ribbon_color?: string;
}

