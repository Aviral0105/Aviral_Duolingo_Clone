from datetime import datetime, timedelta
from typing import Dict, Any
from sqlalchemy.orm import Session
from ..models import User

MAX_HEARTS = 5
HEART_REGEN_MINUTES = 30  # Regenerates 1 heart every 30 minutes

def process_streak_activity(user: User, db: Session) -> Dict[str, Any]:
    """
    Duolingo Calendar Streak Engine:
    - Same calendar day: Streak remains preserved (already extended today)
    - Consecutive day (gap = 1): Streak increments by 1
    - Missed 1 day (gap = 2):
        If streak_freezes > 0: Auto-consumes 1 freeze, saves streak, increments by 1
        Else: Resets streak to 1
    - Missed 2+ days: Resets streak to 1
    """
    now = datetime.utcnow()
    last_active = user.last_active_date or now

    last_date = last_active.date()
    today_date = now.date()

    day_diff = (today_date - last_date).days

    extended_today = False
    freeze_consumed = False
    streak_reset = False

    if day_diff == 0:
        # Already active today, streak safe
        if (user.streak or 0) == 0:
            user.streak = 1
            extended_today = True
    elif day_diff == 1:
        # Perfect consecutive day!
        user.streak = (user.streak or 0) + 1
        extended_today = True
    elif day_diff == 2:
        # Missed 1 day: check for Streak Freeze
        if (user.streak_freezes or 0) > 0:
            user.streak_freezes -= 1
            user.streak = (user.streak or 0) + 1
            freeze_consumed = True
            extended_today = True
        else:
            user.streak = 1
            streak_reset = True
            extended_today = True
    else:
        # Missed 2+ days: streak reset
        user.streak = 1
        streak_reset = True
        extended_today = True

    user.last_active_date = now
    return {
        "streak": user.streak,
        "streak_freezes": user.streak_freezes or 0,
        "extended_today": extended_today,
        "freeze_consumed": freeze_consumed,
        "streak_reset": streak_reset,
    }


def check_heart_regeneration(user: User, db: Session) -> int:
    """
    Hearts Engine - Auto-Regeneration:
    - Super Duolingo: Unlimited (999)
    - Free Learners: 1 heart restores every HEART_REGEN_MINUTES
    """
    if user.is_super:
        user.hearts = 999
        return 999

    now = datetime.utcnow()
    current_hearts = user.hearts or 0

    if current_hearts >= MAX_HEARTS:
        user.hearts = MAX_HEARTS
        user.hearts_updated_at = now
        return MAX_HEARTS

    last_update = user.hearts_updated_at or now
    elapsed_minutes = (now - last_update).total_seconds() / 60.0

    hearts_to_add = int(elapsed_minutes // HEART_REGEN_MINUTES)
    if hearts_to_add > 0:
        new_hearts = min(MAX_HEARTS, current_hearts + hearts_to_add)
        user.hearts = new_hearts
        # Advance timestamp by the regenerated interval
        user.hearts_updated_at = last_update + timedelta(minutes=hearts_to_add * HEART_REGEN_MINUTES)
        db.commit()

    return user.hearts


def deduct_heart_on_mistake(user: User, db: Session) -> int:
    """
    Deducts 1 heart on incorrect answer (if not Super).
    """
    if user.is_super:
        return 999

    now = datetime.utcnow()
    if (user.hearts or 0) >= MAX_HEARTS:
        user.hearts_updated_at = now

    user.hearts = max(0, (user.hearts or 0) - 1)
    return user.hearts


def refill_user_hearts(user: User, db: Session) -> int:
    """
    Refills hearts to full capacity.
    """
    user.hearts = 999 if user.is_super else MAX_HEARTS
    user.hearts_updated_at = datetime.utcnow()
    return user.hearts


def award_gems(user: User, amount: int) -> int:
    """
    Gems Economy - Add gems to user balance.
    """
    user.gems = (user.gems or 0) + max(0, amount)
    return user.gems
