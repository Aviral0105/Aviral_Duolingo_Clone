from typing import List, Optional, Any, Dict
from pydantic import BaseModel
from datetime import datetime

# ----------------- User Schemas -----------------
class UserBase(BaseModel):
    username: str
    handle: str
    avatar: str
    xp: int
    streak: int
    hearts: int
    gems: int
    daily_goal_xp: int
    is_super: bool
    email: Optional[str] = "aviral@example.com"
    phone: Optional[str] = None
    streak_freezes: Optional[int] = 2
    invite_code: Optional[str] = "BDHTZTB5CW77A"

class UserOut(UserBase):
    id: int
    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class HeartsActionResponse(BaseModel):
    hearts: int
    xp: int
    message: str

class SimulateDayResponse(BaseModel):
    streak: int
    message: str

# ----------------- Exercise & Lesson Schemas -----------------
class ExerciseOut(BaseModel):
    id: int
    order_index: int
    type: str
    category_tag: str
    prompt: str
    audio_text: Optional[str] = None
    content: Dict[str, Any]
    correct_answer: str

    class Config:
        from_attributes = True

class LessonDetailOut(BaseModel):
    id: int
    title: str
    xp_reward: int
    exercises: List[ExerciseOut]

    class Config:
        from_attributes = True

class LessonCompleteRequest(BaseModel):
    hearts_left: int
    mistakes_count: int

class LessonCompleteResponse(BaseModel):
    success: bool
    xp_earned: int
    new_total_xp: int
    streak: int
    unlocked_next_lesson_id: Optional[int] = None
    message: str

class MistakeActionRequest(BaseModel):
    exercise_id: int

class MistakeActionResponse(BaseModel):
    success: bool
    exercise_id: int
    mistake_count: int
    resolved: bool
    message: str

# ----------------- Learning Path Schemas -----------------
class LessonNodeOut(BaseModel):
    id: int
    title: str
    icon: str
    order_index: int
    status: str
    crowns: int

class UnitOut(BaseModel):
    id: int
    section_title: str
    title: str
    description: str
    order_index: int
    lessons: List[LessonNodeOut]

class PathResponse(BaseModel):
    course_title: str
    course_flag: str
    units: List[UnitOut]

# ----------------- Leaderboard Schemas -----------------
class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    avatar: str
    xp: int
    is_current_user: bool

class LeaderboardResponse(BaseModel):
    league_name: str
    time_remaining: str
    entries: List[LeaderboardEntry]

# ----------------- User Mistakes & Settings Schemas -----------------
class UserMistakeCreate(BaseModel):
    exercise_id: int

class UserMistakeOut(BaseModel):
    id: int
    exercise_id: int
    mistake_count: int
    last_mistake_at: datetime
    resolved: bool

    class Config:
        from_attributes = True

class UserSettingsOut(BaseModel):
    sound_effects: bool
    animations: bool
    motivational_messages: bool
    listening_exercises: bool
    speaking_exercises: bool
    dark_mode: str

    class Config:
        from_attributes = True

class UserSettingsUpdate(BaseModel):
    sound_effects: Optional[bool] = None
    animations: Optional[bool] = None
    motivational_messages: Optional[bool] = None
    listening_exercises: Optional[bool] = None
    speaking_exercises: Optional[bool] = None
    dark_mode: Optional[str] = None

# ----------------- Support & Help Center Schemas -----------------
class SupportTicketCreate(BaseModel):
    name: str
    email: str
    category: str
    message: str

class SupportTicketOut(BaseModel):
    ticket_code: str
    status: str
    message: str

class FAQItemOut(BaseModel):
    question: str
    answer: str
    category: str

# ----------------- Social & Friends Schemas -----------------
class UserSearchItem(BaseModel):
    id: int
    username: str
    handle: str
    avatar: str
    is_following: bool

class FollowActionResponse(BaseModel):
    success: bool
    target_user_id: int
    is_following: bool
    message: str

class SocialStatsOut(BaseModel):
    following_count: int
    followers_count: int
    following: List[UserSearchItem]
    followers: List[UserSearchItem]

class InviteLinkOut(BaseModel):
    invite_code: str
    invite_url: str

# ----------------- Achievements Schemas -----------------
class AchievementOut(BaseModel):
    key: str
    title: str
    description: str
    icon: str
    level: int
    max_level: int
    current_value: int
    target_value: int
    unlocked: bool
