import random
import string
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import SupportTicket
from ..schemas import SupportTicketCreate, SupportTicketOut, FAQItemOut

router = APIRouter(prefix="/api/help", tags=["Help & Support"])

FAQS_DATA = [
    # Category 1: Using Duolingo
    {
        "category": "Using Duolingo",
        "question": "How do streaks work?",
        "answer": "A streak counts how many days in a row you've practiced. Your streak increases by 1 each day you complete a lesson before midnight."
    },
    {
        "category": "Using Duolingo",
        "question": "What happens if I lose all my hearts?",
        "answer": "When you run out of hearts, you cannot start new lessons until they refill. Hearts replenish over time, or you can refill them instantly in the Shop with gems, or get Unlimited Hearts with Super Duolingo."
    },
    {
        "category": "Using Duolingo",
        "question": "How do leagues and leaderboards work?",
        "answer": "Compete with 30 learners every week. Earn XP by finishing lessons. The top performers advance to the next tier, while the lowest might be demoted."
    },
    # Category 2: Account Management
    {
        "category": "Account Management",
        "question": "How do I change my password or email?",
        "answer": "Navigate to More > Settings > Account to update your registered email, password, and public display name."
    },
    {
        "category": "Account Management",
        "question": "Can I delete or reset my account?",
        "answer": "Yes, you can request full account deletion or export your learning data under More > Settings > Privacy settings."
    },
    # Category 3: Subscription & Payments
    {
        "category": "Subscription & Payments",
        "question": "What is Super Duolingo?",
        "answer": "Super Duolingo provides unlimited hearts, zero advertisements, personalized practice mistakes review, and monthly challenge badges."
    },
    {
        "category": "Subscription & Payments",
        "question": "How do family plans work?",
        "answer": "A Family Plan lets up to 6 members enjoy Super Duolingo perks under a single subscription with independent progress tracking."
    }
]

@router.get("/faqs", response_model=List[FAQItemOut])
def get_faqs():
    return FAQS_DATA

@router.post("/feedback", response_model=SupportTicketOut)
def submit_feedback(payload: SupportTicketCreate, db: Session = Depends(get_db)):
    # Generate unique ticket code like DUO-83921
    code_digits = "".join(random.choices(string.digits, k=5))
    ticket_code = f"DUO-{code_digits}"

    ticket = SupportTicket(
        ticket_code=ticket_code,
        name=payload.name.strip(),
        email=payload.email.strip(),
        category=payload.category.strip(),
        message=payload.message.strip(),
        status="open"
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return {
        "ticket_code": ticket.ticket_code,
        "status": ticket.status,
        "message": f"Thank you! Your feedback has been received. Ticket reference: {ticket.ticket_code}."
    }
