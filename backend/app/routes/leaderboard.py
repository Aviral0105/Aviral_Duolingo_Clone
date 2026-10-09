from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import LeaderboardResponse, LeaderboardEntry

router = APIRouter(prefix="/api/leaderboard", tags=["Leaderboard"])

@router.get("", response_model=LeaderboardResponse)
def get_leaderboard(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    user_xp = user.xp if user else 34
    user_name = user.username if user else "AVIRAL JAIN"
    user_avatar = user.avatar if user else "🧑"

    # Learners in user's league
    seeded_players = [
        {"username": "Nitheesh Kumar B", "avatar": "🧑🏾‍🦱", "xp": 45, "is_current_user": False},
        {"username": user_name, "avatar": user_avatar, "xp": user_xp, "is_current_user": True},
        {"username": "Seyit Musevi", "avatar": "👦🏻", "xp": 10, "is_current_user": False},
        {"username": "Priyanka M.", "avatar": "👩🏽", "xp": 8, "is_current_user": False},
        {"username": "Lucas Dupont", "avatar": "🧑🏼", "xp": 5, "is_current_user": False},
    ]

    # Sort descending by XP
    sorted_players = sorted(seeded_players, key=lambda x: x["xp"], reverse=True)

    entries = [
        LeaderboardEntry(
            rank=idx + 1,
            username=p["username"],
            avatar=p["avatar"],
            xp=p["xp"],
            is_current_user=p["is_current_user"]
        )
        for idx, p in enumerate(sorted_players)
    ]

    league = "Silver League" if user_xp >= 300 else "Bronze League"

    return {
        "league_name": league,
        "time_remaining": "2 DAYS",
        "entries": entries
    }
