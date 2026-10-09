from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from ..models import User, UserSetting, UserFollow
from ..schemas import (
    UserOut,
    UserRegisterRequest,
    UserResetResponse,
    HeartsActionResponse,
    SimulateDayResponse,
    UserSettingsOut,
    UserSettingsUpdate,
    UserProfileUpdate,
    UserSearchItem,
    FollowActionResponse,
    SocialStatsOut,
    InviteLinkOut,
    XPSummaryOut,
)
from ..services.xp_engine import get_xp_summary
from ..services.gamification_engine import check_heart_regeneration, refill_user_hearts

router = APIRouter(prefix="/api/user", tags=["User"])

def _get_target_user(db: Session, user_id: Optional[int] = None) -> User:
    if user_id:
        u = db.query(User).filter(User.id == user_id).first()
        if u:
            return u
    u = db.query(User).filter(User.id == 1).first()
    if not u:
        u = db.query(User).first()
    return u

@router.get("", response_model=UserOut)
def get_current_user(user_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    user = _get_target_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    check_heart_regeneration(user, db)
    return user

@router.get("/all", response_model=List[UserOut])
def get_all_users(db: Session = Depends(get_db)):
    """Returns all user accounts stored in the SQLite database."""
    return db.query(User).order_by(User.id).all()

@router.post("/register", response_model=UserOut)
def register_new_user(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    """
    Creates a brand-new user with fresh zero statistics:
    0 XP, 0 Streak, 5 Hearts, 100 Gems, Gold League.
    """
    clean_username = payload.username.strip()
    if not clean_username:
        raise HTTPException(status_code=400, detail="Username cannot be empty")

    base_handle = "@" + "".join(e for e in clean_username.lower() if e.isalnum())
    handle = base_handle or "@learner"
    counter = 1
    while db.query(User).filter(User.handle == handle).first():
        counter += 1
        handle = f"{base_handle}{counter}"

    new_user = User(
        username=clean_username,
        handle=handle,
        email=payload.email.strip() if payload.email else f"{handle[1:]}@example.com",
        avatar=payload.avatar or "🧑",
        xp=0,
        streak=0,
        hearts=5,
        gems=100,
        daily_goal_xp=payload.daily_goal_xp or 10,
        current_league=payload.current_league or "Gold League",
        is_super=False,
        streak_freezes=0,
        last_active_date=datetime.utcnow(),
        created_at=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize user settings
    settings = UserSetting(user_id=new_user.id)
    db.add(settings)
    db.commit()

    return new_user

@router.post("/reset", response_model=UserResetResponse)
def reset_user_progress(
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    target_id = user_id or 1
    user = db.query(User).filter(User.id == target_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    from ..models import UserProgress, UserMistake, XPLedger
    db.query(UserProgress).filter(UserProgress.user_id == user.id).delete()
    db.query(UserMistake).filter(UserMistake.user_id == user.id).delete()
    db.query(XPLedger).filter(XPLedger.user_id == user.id).delete()

    user.xp = 0
    user.streak = 0
    user.hearts = 5
    user.gems = 100
    user.streak_freezes = 0
    user.double_xp_until = None
    user.current_league = "Bronze League"
    user.last_active_date = datetime.utcnow()

    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "user": user,
        "message": f"User {user.username} (ID: {user.id}) progress reset to 0 XP and fresh starting state!"
    }

@router.patch("/profile", response_model=UserOut)
def update_user_profile(
    payload: UserProfileUpdate,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    user = _get_target_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.username is not None:
        user.username = payload.username.strip()
    if payload.email is not None:
        user.email = payload.email.strip()
    if payload.phone is not None:
        user.phone = payload.phone.strip()
    if payload.avatar is not None:
        user.avatar = payload.avatar.strip()
    if payload.profile_image is not None:
        user.profile_image = payload.profile_image

    db.commit()
    db.refresh(user)
    return user

@router.post("/avatar", response_model=UserOut)
def update_user_avatar(
    payload: dict,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    user = _get_target_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if "avatar" in payload and payload["avatar"]:
        user.avatar = payload["avatar"]
    if "profile_image" in payload:
        user.profile_image = payload["profile_image"]

    db.commit()
    db.refresh(user)
    return user

@router.get("/invite", response_model=InviteLinkOut)
def get_invite_link(user_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    user = _get_target_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    invite_code = user.invite_code or "BDHTZTB5CW77A"
    return {
        "invite_code": invite_code,
        "invite_url": f"https://invite.duolingo.com/{invite_code}"
    }

@router.get("/search", response_model=List[UserSearchItem])
def search_users(
    q: str = Query("", description="Query by username or handle"),
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    caller = _get_target_user(db, user_id)
    caller_id = caller.id if caller else 1

    query_str = q.strip().lower()
    users = db.query(User).filter(User.id != caller_id).all()

    # Get set of users currently followed by caller
    following_ids = {
        uf.following_id
        for uf in db.query(UserFollow).filter(UserFollow.follower_id == caller_id).all()
    }

    results = []
    for u in users:
        if not query_str or query_str in u.username.lower() or query_str in u.handle.lower():
            results.append({
                "id": u.id,
                "username": u.username,
                "handle": u.handle,
                "avatar": u.avatar,
                "profile_image": getattr(u, "profile_image", None),
                "is_following": u.id in following_ids
            })
    return results

@router.post("/follow/{target_id}", response_model=FollowActionResponse)
def toggle_follow(
    target_id: int,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    caller = _get_target_user(db, user_id)
    caller_id = caller.id if caller else 1

    if target_id == caller_id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")

    target = db.query(User).filter(User.id == target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target user not found")

    existing = db.query(UserFollow).filter(
        UserFollow.follower_id == caller_id,
        UserFollow.following_id == target_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {
            "success": True,
            "target_user_id": target_id,
            "is_following": False,
            "message": f"Unfollowed {target.username}"
        }
    else:
        new_follow = UserFollow(follower_id=caller_id, following_id=target_id)
        db.add(new_follow)
        db.commit()
        return {
            "success": True,
            "target_user_id": target_id,
            "is_following": True,
            "message": f"Now following {target.username}!"
        }

@router.get("/social", response_model=SocialStatsOut)
def get_social_stats(user_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    caller = _get_target_user(db, user_id)
    caller_id = caller.id if caller else 1

    following_records = db.query(UserFollow).filter(UserFollow.follower_id == caller_id).all()
    following_user_ids = [f.following_id for f in following_records]
    following_users = db.query(User).filter(User.id.in_(following_user_ids)).all() if following_user_ids else []

    follower_records = db.query(UserFollow).filter(UserFollow.following_id == caller_id).all()
    follower_user_ids = [f.follower_id for f in follower_records]
    follower_users = db.query(User).filter(User.id.in_(follower_user_ids)).all() if follower_user_ids else []

    following_list = [
        {
            "id": u.id,
            "username": u.username,
            "handle": u.handle,
            "avatar": u.avatar,
            "profile_image": getattr(u, "profile_image", None),
            "is_following": True
        }
        for u in following_users
    ]
    followers_list = [
        {
            "id": u.id,
            "username": u.username,
            "handle": u.handle,
            "avatar": u.avatar,
            "profile_image": getattr(u, "profile_image", None),
            "is_following": u.id in following_user_ids
        }
        for u in follower_users
    ]

    return {
        "following_count": len(following_list),
        "followers_count": len(followers_list),
        "following": following_list,
        "followers": followers_list
    }

@router.get("/settings", response_model=UserSettingsOut)
def get_user_settings(db: Session = Depends(get_db)):
    settings = db.query(UserSetting).filter(UserSetting.user_id == 1).first()
    if not settings:
        settings = UserSetting(user_id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("/settings", response_model=UserSettingsOut)
def update_user_settings(payload: UserSettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(UserSetting).filter(UserSetting.user_id == 1).first()
    if not settings:
        settings = UserSetting(user_id=1)
        db.add(settings)

    if payload.sound_effects is not None:
        settings.sound_effects = payload.sound_effects
    if payload.animations is not None:
        settings.animations = payload.animations
    if payload.motivational_messages is not None:
        settings.motivational_messages = payload.motivational_messages
    if payload.listening_exercises is not None:
        settings.listening_exercises = payload.listening_exercises
    if payload.speaking_exercises is not None:
        settings.speaking_exercises = payload.speaking_exercises
    if payload.dark_mode is not None:
        settings.dark_mode = payload.dark_mode

    db.commit()
    db.refresh(settings)
    return settings

@router.post("/refill-hearts", response_model=HeartsActionResponse)
def refill_hearts(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    refill_user_hearts(user, db)
    db.commit()
    db.refresh(user)
    return {
        "hearts": user.hearts,
        "xp": user.xp,
        "message": "Hearts successfully refilled to 5!"
    }

@router.post("/practice-complete", response_model=HeartsActionResponse)
def complete_practice(
    type: str = Query("general", description="Drill type: listening, mistakes, general"),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hearts = min(5, (user.hearts or 0) + 1)
    base_xp = 20 if type == "listening" else 15
    has_double_xp = bool(user.double_xp_until and user.double_xp_until > datetime.utcnow())
    multiplier = 2 if has_double_xp else 1

    award_xp(
        db=db,
        user=user,
        source_type="practice",
        base_xp=base_xp,
        bonus_xp=0,
        multiplier=multiplier,
        description=f"Completed {type.capitalize()} practice drill"
    )
    db.commit()
    db.refresh(user)
    return {
        "hearts": user.hearts,
        "xp": user.xp,
        "message": f"Practice complete! +{base_xp * multiplier} XP earned and 1 Heart restored ❤️"
    }

@router.post("/toggle-super", response_model=UserOut)
def toggle_super(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_super = not user.is_super
    if user.is_super:
        user.hearts = 999
    else:
        user.hearts = 5
    db.commit()
    db.refresh(user)
    return user

@router.post("/simulate-day", response_model=SimulateDayResponse)
def simulate_day(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.streak += 1
    user.last_active_date = datetime.utcnow()
    db.commit()
    db.refresh(user)
    return {
        "streak": user.streak,
        "message": f"Day simulated successfully! New streak: {user.streak} days."
    }

@router.get("/xp-summary", response_model=XPSummaryOut)
def get_user_xp_summary(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return get_xp_summary(db, user)

