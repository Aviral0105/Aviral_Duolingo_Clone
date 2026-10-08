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

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  xp: number;
  is_current_user: boolean;
}

export interface LeaderboardResponse {
  league_name: string;
  time_remaining: string;
  entries: LeaderboardEntry[];
}
