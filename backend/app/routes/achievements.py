from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, UserProgress, UserFollow
from ..schemas import AchievementOut

router = APIRouter(prefix="/api/achievements", tags=["Achievements"])

@router.get("", response_model=List[AchievementOut])
def get_achievements(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
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

    # Calculate 8 authentic Duolingo achievements matching frontend
    achievements_data = [
        {
            "key": "wildfire",
            "title": "Wildfire",
            "description": "Reach a 3-day streak",
            "icon": "🔥",
            "level": min(10, max(1, user.streak // 3 + 1)),
            "max_level": 10,
            "current_value": user.streak,
            "target_value": 3,
            "unlocked": user.streak >= 3
        },
        {
            "key": "sage",
            "title": "Sage",
            "description": "Earn 100 XP",
            "icon": "⚡",
            "level": min(10, max(1, user.xp // 100 + 1)),
            "max_level": 10,
            "current_value": user.xp,
            "target_value": 100,
            "unlocked": user.xp >= 100
        },
        {
            "key": "champion",
            "title": "Champion",
            "description": "Advance to the next League",
            "icon": "🛡️",
            "level": 1,
            "max_level": 10,
            "current_value": 1 if user.xp >= 30 else 0,
            "target_value": 1,
            "unlocked": user.xp >= 30
        },
        {
            "key": "sharpshooter",
            "title": "Sharpshooter",
            "description": "Complete a lesson with 100% accuracy",
            "icon": "🎯",
            "level": 1,
            "max_level": 10,
            "current_value": 1 if completed_lessons_count >= 1 else 0,
            "target_value": 1,
            "unlocked": completed_lessons_count >= 1
        },
        {
            "key": "winner",
            "title": "Winner",
            "description": "Finish #1 on your leaderboard",
            "icon": "🏆",
            "level": 1,
            "max_level": 10,
            "current_value": 0,
            "target_value": 1,
            "unlocked": False
        },
        {
            "key": "friendly",
            "title": "Friendly",
            "description": "Follow 3 fellow learners",
            "icon": "👥",
            "level": 1,
            "max_level": 10,
            "current_value": min(3, following_count),
            "target_value": 3,
            "unlocked": following_count >= 3
        },
        {
            "key": "weekend_warrior",
            "title": "Weekend Warrior",
            "description": "Complete a lesson on Saturday and Sunday",
            "icon": "⚔️",
            "level": 1,
            "max_level": 10,
            "current_value": 1,
            "target_value": 2,
            "unlocked": False
        },
        {
            "key": "photogenic",
            "title": "Photogenic",
            "description": "Upload a profile avatar or customize your avatar",
            "icon": "📸",
            "level": 1,
            "max_level": 1,
            "current_value": 1,
            "target_value": 1,
            "unlocked": True
        }
    ]

    return achievements_data
