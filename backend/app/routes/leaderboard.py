from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, League
from ..schemas import (
    LeaderboardResponse,
    LeaderboardEntry,
    LeagueOut,
    StatusUpdateRequest,
    StatusUpdateResponse,
)

router = APIRouter(prefix="/api/leaderboard", tags=["Leaderboard"])

DEFAULT_LEAGUES = [
    {
        "id": 1,
        "name": "Bronze League",
        "tier": 1,
        "icon": "🪶",
        "color": "#b47748",
        "promotion_threshold": 11,
        "demotion_threshold": 0,
        "description": "Top 11 advance to the next league",
    },
    {
        "id": 2,
        "name": "Silver League",
        "tier": 2,
        "icon": "🥈",
        "color": "#a8a8a8",
        "promotion_threshold": 11,
        "demotion_threshold": 5,
        "description": "Top 11 advance to the Gold League",
    },
    {
        "id": 3,
        "name": "Gold League",
        "tier": 3,
        "icon": "🥇",
        "color": "#ffc800",
        "promotion_threshold": 11,
        "demotion_threshold": 5,
        "description": "Top 11 advance to the Sapphire League",
    },
    {
        "id": 4,
        "name": "Sapphire League",
        "tier": 4,
        "icon": "💎",
        "color": "#1cb0f6",
        "promotion_threshold": 11,
        "demotion_threshold": 5,
        "description": "Top 11 advance to the Ruby League",
    },
    {
        "id": 5,
        "name": "Ruby League",
        "tier": 5,
        "icon": "🔴",
        "color": "#ff4b4b",
        "promotion_threshold": 11,
        "demotion_threshold": 5,
        "description": "Top 11 advance to the Diamond League",
    },
]

# Authentic Duolingo Competitors (matching official screenshot)
COMPETITORS_BY_TIER = {
    1: [
        {"username": "Maya Patel", "avatar": "👩🏽", "xp": 120, "status_emoji": None},
        {"username": "Carlos Silva", "avatar": "👨🏽", "xp": 95, "status_emoji": "🔥"},
        {"username": "Liam O'Connor", "avatar": "🧑🏼", "xp": 82, "status_emoji": None},
        {"username": "Elena Rostova", "avatar": "👱🏻‍♀️", "xp": 74, "status_emoji": "✨"},
        {"username": "Kenji Sato", "avatar": "👨🏻", "xp": 68, "status_emoji": None},
        {"username": "Fatima Al-Zahra", "avatar": "🧕🏽", "xp": 59, "status_emoji": "🇮🇳"},
        {"username": "Arjun Sharma", "avatar": "🧑🏾", "xp": 55, "status_emoji": None},
        {"username": "Chloe Dubois", "avatar": "👩🏼", "xp": 50, "status_emoji": None},
        {"username": "Nitheesh Kumar B", "avatar": "🧑🏾‍🦱", "xp": 45, "status_emoji": None},
        {"username": "Molik", "avatar": "🕶️", "xp": 41, "status_emoji": "💪"},
        {"username": "SHAUN ALLEN", "avatar": "👨🏼", "xp": 40, "status_emoji": None},
        {"username": "Thrive", "avatar": "🧢", "xp": 29, "status_emoji": None},
        {"username": "nguyễn đức trường", "avatar": "🧑🏻", "xp": 27, "status_emoji": None},
        {"username": "Seyit Musevi", "avatar": "👦🏻", "xp": 20, "status_emoji": None},
        {"username": "Quang Quy Hà", "avatar": "🐻", "xp": 13, "status_emoji": None},
        {"username": "Priyanka M.", "avatar": "👩🏽", "xp": 10, "status_emoji": None},
        {"username": "Lucas Dupont", "avatar": "🧑🏼", "xp": 8, "status_emoji": None},
        {"username": "Sara Connor", "avatar": "👩🏼", "xp": 5, "status_emoji": None},
    ],
    2: [
        {"username": "Viktor Vance", "avatar": "🧔🏻", "xp": 280, "status_emoji": "🏆"},
        {"username": "Amira Khan", "avatar": "👩🏽", "xp": 240, "status_emoji": "💯"},
        {"username": "Mateo Rossi", "avatar": "🧑🏽", "xp": 210, "status_emoji": "💪"},
        {"username": "Zoe Chen", "avatar": "👩🏻", "xp": 190, "status_emoji": "👀"},
        {"username": "David Becker", "avatar": "👨🏼", "xp": 175, "status_emoji": None},
        {"username": "Ananya Roy", "avatar": "👧🏽", "xp": 160, "status_emoji": "🇮🇳"},
        {"username": "Tariq Mansoor", "avatar": "👳🏽‍♂️", "xp": 145, "status_emoji": None},
        {"username": "Sophie Laurent", "avatar": "👱🏻‍♀️", "xp": 130, "status_emoji": None},
        {"username": "Molik", "avatar": "🕶️", "xp": 115, "status_emoji": "💪"},
        {"username": "SHAUN ALLEN", "avatar": "👨🏼", "xp": 105, "status_emoji": None},
        {"username": "Thrive", "avatar": "🧢", "xp": 90, "status_emoji": None},
        {"username": "nguyễn đức trường", "avatar": "🧑🏻", "xp": 75, "status_emoji": None},
        {"username": "Seyit Musevi", "avatar": "👦🏻", "xp": 60, "status_emoji": None},
    ],
    3: [
        {"username": "Kavita Rao", "avatar": "👩🏽", "xp": 450, "status_emoji": "🏆"},
        {"username": "Felix Brandt", "avatar": "🧑🏼", "xp": 410, "status_emoji": "🔥"},
        {"username": "Hassan Al-Sayed", "avatar": "👨🏽", "xp": 380, "status_emoji": "💪"},
        {"username": "Mei Ling", "avatar": "👩🏻", "xp": 350, "status_emoji": "💯"},
        {"username": "Oliver Ward", "avatar": "👱🏻", "xp": 310, "status_emoji": None},
        {"username": "Deepak Verma", "avatar": "🧑🏾", "xp": 270, "status_emoji": "🇮🇳"},
        {"username": "Lucia Morales", "avatar": "👩🏻", "xp": 240, "status_emoji": None},
        {"username": "Molik", "avatar": "🕶️", "xp": 210, "status_emoji": "💪"},
        {"username": "SHAUN ALLEN", "avatar": "👨🏼", "xp": 180, "status_emoji": None},
        {"username": "Thrive", "avatar": "🧢", "xp": 150, "status_emoji": None},
    ],
    4: [
        {"username": "Rohan Gupta", "avatar": "👨🏾", "xp": 680, "status_emoji": "👑"},
        {"username": "Freja Lind", "avatar": "👱🏻‍♀️", "xp": 620, "status_emoji": "💎"},
        {"username": "Marcus Sterling", "avatar": "🧑🏼", "xp": 570, "status_emoji": "🏆"},
        {"username": "Aisha Farooq", "avatar": "👩🏽", "xp": 520, "status_emoji": "🔥"},
        {"username": "Molik", "avatar": "🕶️", "xp": 460, "status_emoji": "💪"},
        {"username": "SHAUN ALLEN", "avatar": "👨🏼", "xp": 390, "status_emoji": None},
    ],
    5: [
        {"username": "Grandmaster Dan", "avatar": "🧙🏼", "xp": 1200, "status_emoji": "👑"},
        {"username": "Siddharth Sen", "avatar": "🧑🏾", "xp": 1100, "status_emoji": "🔥"},
        {"username": "Clara Schumann", "avatar": "👩🏼", "xp": 980, "status_emoji": "💎"},
        {"username": "Molik", "avatar": "🕶️", "xp": 820, "status_emoji": "💪"},
    ]
}

def _ensure_leagues_in_db(db: Session):
    for lg in DEFAULT_LEAGUES:
        existing = db.query(League).filter(League.tier == lg["tier"]).first()
        if not existing:
            db.add(League(
                id=lg["id"],
                name=lg["name"],
                tier=lg["tier"],
                icon=lg["icon"],
                color=lg["color"],
                promotion_threshold=lg["promotion_threshold"],
                demotion_threshold=lg["demotion_threshold"],
                description=lg["description"],
            ))
    db.commit()

@router.get("", response_model=LeaderboardResponse)
def get_leaderboard(
    tier: Optional[int] = Query(None, description="League tier 1 to 5"),
    db: Session = Depends(get_db)
):
    _ensure_leagues_in_db(db)
    user = db.query(User).filter(User.id == 1).first()

    # Determine which league to view
    all_leagues = db.query(League).order_by(League.tier).all()
    selected_tier = tier or 1

    current_league_obj = next((l for l in all_leagues if l.tier == selected_tier), all_leagues[0])

    user_xp = user.xp if user else 48
    user_name = user.username if user else "Aviral Jain"
    user_avatar = user.avatar if user else "🧑"
    user_status = user.status_emoji if user else None

    # Base competitors for this tier
    pool = COMPETITORS_BY_TIER.get(selected_tier, COMPETITORS_BY_TIER[1]).copy()

    # Add current user with live XP and status emoji
    pool.append({
        "username": user_name,
        "avatar": user_avatar,
        "xp": user_xp,
        "status_emoji": user_status,
        "is_current_user": True,
    })

    # Sort descending by XP
    sorted_players = sorted(pool, key=lambda x: x["xp"], reverse=True)

    entries = []
    for idx, p in enumerate(sorted_players):
        entries.append(LeaderboardEntry(
            rank=idx + 1,
            username=p["username"],
            avatar=p["avatar"],
            xp=p["xp"],
            is_current_user=p.get("is_current_user", False),
            status_emoji=p.get("status_emoji")
        ))

    return {
        "league_name": current_league_obj.name,
        "tier": current_league_obj.tier,
        "time_remaining": "2 DAYS",
        "promotion_threshold": current_league_obj.promotion_threshold,
        "demotion_threshold": current_league_obj.demotion_threshold,
        "user_status_emoji": user_status,
        "all_leagues": all_leagues,
        "entries": entries,
    }

@router.post("/status", response_model=StatusUpdateResponse)
def set_user_status(payload: StatusUpdateRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.status_emoji = payload.status_emoji
    db.commit()
    db.refresh(user)

    msg = f"Status set to {user.status_emoji}" if user.status_emoji else "Status cleared"
    return {
        "success": True,
        "status_emoji": user.status_emoji,
        "message": msg
    }

@router.post("/switch-league")
def switch_user_league(
    tier: int = Query(..., ge=1, le=5),
    db: Session = Depends(get_db)
):
    _ensure_leagues_in_db(db)
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    league = db.query(League).filter(League.tier == tier).first()
    if not league:
        raise HTTPException(status_code=404, detail="League not found")

    user.current_league = league.name
    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "current_league": user.current_league,
        "tier": league.tier,
        "message": f"Switched to {league.name}!"
    }
