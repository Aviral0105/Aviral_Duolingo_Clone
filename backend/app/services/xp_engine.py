from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models import User, XPLedger

def calculate_lesson_xp(
    base_xp: int = 10,
    mistakes_count: int = 0,
    is_review: bool = False,
    multiplier: int = 1
) -> Dict[str, int]:
    """
    Production Duolingo XP Engine:
    - Base XP: standard lesson reward (default 10)
    - Accuracy Bonus:
        0 mistakes (100% Perfect): +4 XP
        1 mistake  (90%+):         +2 XP
        2 mistakes (80%+):         +1 XP
    - Remediation/Review bonus:    +1 XP
    - Multiplier: Active 2x XP Boost potion
    """
    bonus = 0
    if mistakes_count == 0:
        bonus += 4
    elif mistakes_count == 1:
        bonus += 2
    elif mistakes_count == 2:
        bonus += 1

    if is_review:
        bonus += 1

    total = (base_xp + bonus) * max(1, multiplier)
    return {
        "base_xp": base_xp,
        "bonus_xp": bonus,
        "multiplier": max(1, multiplier),
        "total_xp": total
    }

def award_xp(
    db: Session,
    user: User,
    source_type: str,
    base_xp: int,
    bonus_xp: int = 0,
    multiplier: int = 1,
    source_id: Optional[int] = None,
    description: Optional[str] = None
) -> XPLedger:
    """
    Atomic XP Transaction Writer:
    - Records entry into immutable XPLedger
    - Updates User.xp atomically
    - Updates User.last_active_date
    """
    amount = (base_xp + bonus_xp) * max(1, multiplier)
    user.xp = (user.xp or 0) + amount
    user.last_active_date = datetime.utcnow()

    ledger_entry = XPLedger(
        user_id=user.id,
        amount=amount,
        base_xp=base_xp,
        bonus_xp=bonus_xp,
        multiplier=max(1, multiplier),
        source_type=source_type,
        source_id=source_id,
        description=description or f"Awarded {amount} XP from {source_type}",
        created_at=datetime.utcnow()
    )
    db.add(ledger_entry)
    return ledger_entry

def get_xp_summary(db: Session, user: User) -> Dict[str, Any]:
    """
    Returns weekly aggregate stats and recent transactions for user analytics and leaderboards.
    """
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)
    seven_days_ago = today_start - timedelta(days=6)

    # Fetch ledger records in the last 7 days
    entries = db.query(XPLedger).filter(
        XPLedger.user_id == user.id,
        XPLedger.created_at >= seven_days_ago
    ).all()

    # Bucket XP by date
    daily_map = { (today_start - timedelta(days=i)).strftime("%Y-%m-%d"): 0 for i in range(7) }
    for entry in entries:
        d_str = entry.created_at.strftime("%Y-%m-%d")
        if d_str in daily_map:
            daily_map[d_str] += entry.amount

    daily_breakdown = []
    # Order from oldest to newest (Mon -> Today)
    for date_str in sorted(daily_map.keys()):
        dt = datetime.strptime(date_str, "%Y-%m-%d")
        daily_breakdown.append({
            "day": dt.strftime("%a"),
            "date": date_str,
            "xp": daily_map[date_str]
        })

    today_str = today_start.strftime("%Y-%m-%d")
    today_xp = daily_map.get(today_str, 0)
    weekly_xp = sum(daily_map.values())

    # Recent transactions
    recent_transactions = db.query(XPLedger).filter(
        XPLedger.user_id == user.id
    ).order_by(XPLedger.created_at.desc()).limit(15).all()

    return {
        "total_xp": user.xp,
        "weekly_xp": weekly_xp,
        "today_xp": today_xp,
        "daily_breakdown": daily_breakdown,
        "recent_transactions": recent_transactions
    }
