from typing import Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..database import get_db
from ..models import User

router = APIRouter(prefix="/api/shop", tags=["Shop"])

class PurchaseRequest(BaseModel):
    item_id: str

class PurchaseResponse(BaseModel):
    success: bool
    item_id: str
    new_gems: int
    streak_freezes: Optional[int] = None
    hearts: Optional[int] = None
    is_super: Optional[bool] = None
    message: str

ITEM_PRICES = {
    "refill_hearts": 350,
    "freeze_streak": 200,
    "streak_freeze": 200,
    "double_xp": 100,
    "super_trial": 0
}

@router.post("/purchase", response_model=PurchaseResponse)
def purchase_item(payload: PurchaseRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    item_id = payload.item_id
    if item_id not in ITEM_PRICES:
        raise HTTPException(status_code=400, detail=f"Invalid item: '{item_id}'. Valid items: {list(ITEM_PRICES.keys())}")

    if item_id in ("freeze_streak", "streak_freeze") and (user.streak_freezes or 0) >= 2:
        raise HTTPException(
            status_code=400,
            detail="Streak Freeze inventory is already full (2/2 equipped)!"
        )

    if item_id == "refill_hearts" and user.hearts >= 5 and not user.is_super:
        raise HTTPException(
            status_code=400,
            detail="Hearts are already full (5/5)!"
        )

    cost = ITEM_PRICES[item_id]
    if user.gems < cost:
        raise HTTPException(
            status_code=400,
            detail=f"Not enough gems. Required: {cost}, Available: {user.gems}"
        )

    # Deduct gems
    user.gems -= cost

    # Apply item effects
    if item_id == "refill_hearts":
        user.hearts = 5
        user.hearts_updated_at = None
        msg = "Hearts refilled to 5!"
    elif item_id in ("freeze_streak", "streak_freeze"):
        user.streak_freezes = min(2, (user.streak_freezes or 0) + 1)
        msg = f"Streak Freeze equipped! ({user.streak_freezes}/2 EQUIPPED)"
    elif item_id == "double_xp":
        user.double_xp_until = datetime.utcnow() + timedelta(minutes=15)
        msg = "2x XP Boost activated for 15 minutes!"
    elif item_id == "super_trial":
        user.is_super = True
        user.hearts = 999
        msg = "Super Duolingo trial activated! Enjoy Unlimited Hearts."
    else:
        msg = "Item purchased successfully!"

    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "item_id": item_id,
        "new_gems": user.gems,
        "streak_freezes": user.streak_freezes,
        "hearts": user.hearts,
        "is_super": user.is_super,
        "message": msg
    }
