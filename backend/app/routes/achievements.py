from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, UserProgress, UserFollow
from ..schemas import AchievementOut

router = APIRouter(prefix="/api/achievements", tags=["Achievements"])

def _calc_tier_and_target(val: int, thresholds: list):
    """
    Returns (level, target_for_this_level, max_level).
    If val is below threshold[i], current level is i+1, target is threshold[i].
    If val >= max threshold, level is max_level, target is threshold[-1].
    """
    max_level = len(thresholds)
    for lvl_idx, thresh in enumerate(thresholds):
        if val < thresh:
            return lvl_idx + 1, thresh, max_level
    return max_level, thresholds[-1], max_level

@router.get("", response_model=List[AchievementOut])
def get_achievements(
    user_id: Optional[int] = Query(None, description="Optional active user ID"),
    db: Session = Depends(get_db)
):
    target_id = user_id or 1
    user = db.query(User).filter(User.id == target_id).first()
    if not user:
        user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Real metrics from database
    completed_lessons_count = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.is_completed == True
    ).count()

    following_count = db.query(UserFollow).filter(
        UserFollow.follower_id == user.id
    ).count()

    # 1. Wildfire (Streak)
    wf_thresh = [3, 7, 14, 30, 50, 75, 100, 150, 200, 365]
    wf_lvl, wf_target, wf_max = _calc_tier_and_target(user.streak or 0, wf_thresh)

    # 2. Sage (XP)
    sage_thresh = [100, 250, 500, 1000, 2000, 4000, 7500, 12500, 25000, 50000]
    sage_lvl, sage_target, sage_max = _calc_tier_and_target(user.xp or 0, sage_thresh)

    # 3. Scholar (Words learned: ~15 words per lesson)
    words_learned = completed_lessons_count * 15
    scholar_thresh = [50, 100, 250, 500, 1000]
    sch_lvl, sch_target, sch_max = _calc_tier_and_target(words_learned, scholar_thresh)

    # 4. Regal (Crowns earned: 1 per completed lesson)
    regal_thresh = [3, 5, 10, 20, 50]
    reg_lvl, reg_target, reg_max = _calc_tier_and_target(completed_lessons_count, regal_thresh)

    # 5. Champion (Leagues)
    league_name = (user.current_league or "Gold League").lower()
    current_tier = 3 if "gold" in league_name else (2 if "silver" in league_name else (1 if "bronze" in league_name else 4))
    champ_unlocked = current_tier >= 2

    # 6. Sharpshooter (Flawless Lessons)
    sharp_thresh = [1, 5, 10, 20, 50]
    sharp_lvl, sharp_target, sharp_max = _calc_tier_and_target(completed_lessons_count, sharp_thresh)

    # 7. Winner (#1 on Leaderboard)
    winner_target = 1
    winner_current = 0

    # 8. Friendly (Following Friends)
    friendly_target = 3
    friendly_current = min(friendly_target, following_count)

    # 9. Weekend Warrior (Saturday & Sunday lesson)
    ww_target = 2
    ww_current = 1 if completed_lessons_count >= 1 else 0

    # 10. Photogenic (Avatar set)
    photo_target = 1
    photo_current = 1 if bool(user.avatar) else 0

    # 11. Challenger (Quests completed)
    challenger_thresh = [3, 5, 10, 20, 50]
    ch_lvl, ch_target, ch_max = _calc_tier_and_target(max(1, completed_lessons_count), challenger_thresh)

    achievements_data = [
        {
            "key": "wildfire",
            "title": "Wildfire",
            "description": f"Reach a {wf_target}-day streak",
            "icon": "🔥",
            "level": wf_lvl,
            "max_level": wf_max,
            "current_value": user.streak or 0,
            "target_value": wf_target,
            "unlocked": (user.streak or 0) >= wf_target,
            "bg_color": "bg-[#ff4b4b]",
            "ribbon_color": "bg-[#d62828]",
        },
        {
            "key": "sage",
            "title": "Sage",
            "description": f"Earn {sage_target} XP",
            "icon": "🧙‍♂️",
            "level": sage_lvl,
            "max_level": sage_max,
            "current_value": user.xp or 0,
            "target_value": sage_target,
            "unlocked": (user.xp or 0) >= sage_target,
            "bg_color": "bg-[#58cc02]",
            "ribbon_color": "bg-[#46a302]",
        },
        {
            "key": "scholar",
            "title": "Scholar",
            "description": f"Learn {sch_target} new words in a single course",
            "icon": "📜",
            "level": sch_lvl,
            "max_level": sch_max,
            "current_value": min(sch_target, words_learned),
            "target_value": sch_target,
            "unlocked": words_learned >= sch_target,
            "bg_color": "bg-[#1cb0f6]",
            "ribbon_color": "bg-[#1899d6]",
        },
        {
            "key": "regal",
            "title": "Regal",
            "description": f"Earn {reg_target} crowns by completing lessons",
            "icon": "👑",
            "level": reg_lvl,
            "max_level": reg_max,
            "current_value": min(reg_target, completed_lessons_count),
            "target_value": reg_target,
            "unlocked": completed_lessons_count >= reg_target,
            "bg_color": "bg-[#ffc800]",
            "ribbon_color": "bg-[#e5a500]",
        },
        {
            "key": "champion",
            "title": "Champion",
            "description": "Advance to the Gold League",
            "icon": "🛡️",
            "level": min(5, current_tier),
            "max_level": 5,
            "current_value": current_tier,
            "target_value": 3,
            "unlocked": current_tier >= 3,
            "bg_color": "bg-[#a855f7]",
            "ribbon_color": "bg-[#9333ea]",
        },
        {
            "key": "sharpshooter",
            "title": "Sharpshooter",
            "description": f"Complete {sharp_target} lessons with no mistakes",
            "icon": "🏹",
            "level": sharp_lvl,
            "max_level": sharp_max,
            "current_value": min(sharp_target, completed_lessons_count),
            "target_value": sharp_target,
            "unlocked": completed_lessons_count >= sharp_target,
            "bg_color": "bg-[#58cc02]",
            "ribbon_color": "bg-[#46a302]",
        },
        {
            "key": "winner",
            "title": "Winner",
            "description": "Finish #1 on your leaderboard",
            "icon": "🏆",
            "level": 1,
            "max_level": 1,
            "current_value": winner_current,
            "target_value": winner_target,
            "unlocked": winner_current >= winner_target,
            "bg_color": "bg-[#a855f7]",
            "ribbon_color": "bg-[#9333ea]",
        },
        {
            "key": "friendly",
            "title": "Friendly",
            "description": "Follow 3 fellow learners",
            "icon": "🧑‍🤝‍🧑",
            "level": 1,
            "max_level": 1,
            "current_value": friendly_current,
            "target_value": friendly_target,
            "unlocked": friendly_current >= friendly_target,
            "bg_color": "bg-[#a855f7]",
            "ribbon_color": "bg-[#9333ea]",
        },
        {
            "key": "weekend_warrior",
            "title": "Weekend Warrior",
            "description": "Complete a lesson on Saturday and Sunday",
            "icon": "🪖",
            "level": 1,
            "max_level": 1,
            "current_value": ww_current,
            "target_value": ww_target,
            "unlocked": ww_current >= ww_target,
            "bg_color": "bg-[#58cc02]",
            "ribbon_color": "bg-[#46a302]",
        },
        {
            "key": "photogenic",
            "title": "Photogenic",
            "description": "Upload or customize your avatar",
            "icon": "👤",
            "level": 1,
            "max_level": 1,
            "current_value": photo_current,
            "target_value": photo_target,
            "unlocked": photo_current >= photo_target,
            "bg_color": "bg-[#1cb0f6]",
            "ribbon_color": "bg-[#1899d6]",
        },
        {
            "key": "challenger",
            "title": "Challenger",
            "description": f"Complete {ch_target} daily quests",
            "icon": "⚡",
            "level": ch_lvl,
            "max_level": ch_max,
            "current_value": min(ch_target, max(1, completed_lessons_count)),
            "target_value": ch_target,
            "unlocked": completed_lessons_count >= ch_target,
            "bg_color": "bg-[#ff9600]",
            "ribbon_color": "bg-[#e58500]",
        },
    ]

    return achievements_data
