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
    message: str

ITEM_PRICES = {
    "refill_hearts": 350,
    "freeze_streak": 200,
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
        msg = "Hearts refilled to 5!"
    elif item_id == "freeze_streak":
        msg = "Streak Freeze equipped! Your streak is protected."
    elif item_id == "double_xp":
        msg = "2x XP Boost activated for 15 minutes!"
    elif item_id == "super_trial":
        user.is_super = True
        user.hearts = 999
        msg = "Super Duolingo trial activated!"
    else:
        msg = "Item purchased successfully!"

    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "item_id": item_id,
        "new_gems": user.gems,
        "message": msg
    }
