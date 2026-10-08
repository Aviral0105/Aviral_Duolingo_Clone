from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from ..models import User, UserSetting
from ..schemas import (
    UserOut,
    HeartsActionResponse,
    SimulateDayResponse,
    UserSettingsOut,
    UserSettingsUpdate
)

router = APIRouter(prefix="/api/user", tags=["User"])

@router.get("", response_model=UserOut)
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

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
