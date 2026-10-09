from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from ..models import User, UserSetting, UserFollow
from ..schemas import (
    UserOut,
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

router = APIRouter(prefix="/api/user", tags=["User"])

@router.get("", response_model=UserOut)
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/profile", response_model=UserOut)
def update_user_profile(payload: UserProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.username is not None:
        user.username = payload.username.strip()
    if payload.email is not None:
        user.email = payload.email.strip()
    if payload.phone is not None:
        user.phone = payload.phone.strip()

    db.commit()
    db.refresh(user)
    return user

@router.get("/invite", response_model=InviteLinkOut)
def get_invite_link(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    invite_code = user.invite_code or "BDHTZTB5CW77A"
    return {
        "invite_code": invite_code,
        "invite_url": f"https://invite.duolingo.com/{invite_code}"
    }

@router.get("/search", response_model=List[UserSearchItem])
def search_users(q: str = Query("", description="Query by username or handle"), db: Session = Depends(get_db)):
    query_str = q.strip().lower()
    users = db.query(User).filter(User.id != 1).all()

    # Get set of users currently followed by user 1
    following_ids = {
        uf.following_id
        for uf in db.query(UserFollow).filter(UserFollow.follower_id == 1).all()
    }

    results = []
    for u in users:
        if not query_str or query_str in u.username.lower() or query_str in u.handle.lower():
            results.append({
                "id": u.id,
                "username": u.username,
                "handle": u.handle,
                "avatar": u.avatar,
                "is_following": u.id in following_ids
            })
    return results

@router.post("/follow/{target_id}", response_model=FollowActionResponse)
def toggle_follow(target_id: int, db: Session = Depends(get_db)):
    if target_id == 1:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")

    target = db.query(User).filter(User.id == target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target user not found")

    existing = db.query(UserFollow).filter(
        UserFollow.follower_id == 1,
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
        new_follow = UserFollow(follower_id=1, following_id=target_id)
        db.add(new_follow)
        db.commit()
        return {
            "success": True,
            "target_user_id": target_id,
            "is_following": True,
            "message": f"Now following {target.username}!"
        }

@router.get("/social", response_model=SocialStatsOut)
def get_social_stats(db: Session = Depends(get_db)):
    following_records = db.query(UserFollow).filter(UserFollow.follower_id == 1).all()
    following_user_ids = [f.following_id for f in following_records]
    following_users = db.query(User).filter(User.id.in_(following_user_ids)).all() if following_user_ids else []

    follower_records = db.query(UserFollow).filter(UserFollow.following_id == 1).all()
    follower_user_ids = [f.follower_id for f in follower_records]
    follower_users = db.query(User).filter(User.id.in_(follower_user_ids)).all() if follower_user_ids else []

    following_list = [
        {"id": u.id, "username": u.username, "handle": u.handle, "avatar": u.avatar, "is_following": True}
        for u in following_users
    ]
    followers_list = [
        {"id": u.id, "username": u.username, "handle": u.handle, "avatar": u.avatar, "is_following": u.id in following_user_ids}
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
    user.hearts = 5
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

