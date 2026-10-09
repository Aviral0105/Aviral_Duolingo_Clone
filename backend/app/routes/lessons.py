import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Lesson, Exercise, UserProgress, Unit, UserMistake
from ..schemas import (
    LessonDetailOut,
    LessonCompleteRequest,
    LessonCompleteResponse,
    MistakeActionRequest,
    MistakeActionResponse
)
from ..services.xp_engine import calculate_lesson_xp, award_xp
from ..services.gamification_engine import (
    process_streak_activity,
    award_gems,
    deduct_heart_on_mistake
)

router = APIRouter(prefix="/api/lessons", tags=["Lessons"])

@router.get("/{lesson_id}", response_model=LessonDetailOut)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    exercises = db.query(Exercise).filter(Exercise.lesson_id == lesson_id).order_by(Exercise.order_index).all()
    
    # Non-linear word scattering: jumble word bank pools
    exercise_items = []
    for ex in exercises:
        ex_content = dict(ex.content) if isinstance(ex.content, dict) else ex.content
        if ex.type == "WORD_BANK" and isinstance(ex_content, dict) and "word_pool" in ex_content:
            pool = list(ex_content["word_pool"])
            random.shuffle(pool)
            ex_content["word_pool"] = pool

        exercise_items.append({
            "id": ex.id,
            "order_index": ex.order_index,
            "type": ex.type,
            "category_tag": ex.category_tag,
            "prompt": ex.prompt,
            "audio_text": ex.audio_text,
            "content": ex_content,
            "correct_answer": ex.correct_answer
        })

    return {
        "id": lesson.id,
        "title": lesson.title,
        "xp_reward": lesson.xp_reward,
        "exercises": exercise_items
    }

@router.post("/{lesson_id}/record-mistake", response_model=MistakeActionResponse)
def record_mistake(
    lesson_id: int,
    payload: MistakeActionRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == 1).first()
    exercise = db.query(Exercise).filter(
        Exercise.id == payload.exercise_id,
        Exercise.lesson_id == lesson_id
    ).first()

    if not user or not exercise:
        raise HTTPException(status_code=404, detail="User or Exercise not found")

    mistake = db.query(UserMistake).filter(
        UserMistake.user_id == user.id,
        UserMistake.exercise_id == exercise.id
    ).first()

    if mistake:
        mistake.mistake_count += 1
        mistake.last_mistake_at = datetime.utcnow()
        mistake.resolved = False
    else:
        mistake = UserMistake(
            user_id=user.id,
            exercise_id=exercise.id,
            mistake_count=1,
            last_mistake_at=datetime.utcnow(),
            resolved=False
        )
        db.add(mistake)

    deduct_heart_on_mistake(user, db)
    db.commit()
    db.refresh(mistake)

    return {
        "success": True,
        "exercise_id": exercise.id,
        "mistake_count": mistake.mistake_count,
        "resolved": mistake.resolved,
        "message": f"Mistake recorded for exercise {exercise.id} (count: {mistake.mistake_count})"
    }

@router.post("/{lesson_id}/resolve-mistake", response_model=MistakeActionResponse)
def resolve_mistake(
    lesson_id: int,
    payload: MistakeActionRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == 1).first()
    exercise = db.query(Exercise).filter(
        Exercise.id == payload.exercise_id,
        Exercise.lesson_id == lesson_id
    ).first()

    if not user or not exercise:
        raise HTTPException(status_code=404, detail="User or Exercise not found")

    mistake = db.query(UserMistake).filter(
        UserMistake.user_id == user.id,
        UserMistake.exercise_id == exercise.id
    ).first()

    if mistake:
        mistake.resolved = True
        mistake.last_mistake_at = datetime.utcnow()
        db.commit()
        db.refresh(mistake)
        count = mistake.mistake_count
    else:
        count = 0

    return {
        "success": True,
        "exercise_id": exercise.id,
        "mistake_count": count,
        "resolved": True,
        "message": f"Mistake resolved for exercise {exercise.id}"
    }

@router.post("/{lesson_id}/complete", response_model=LessonCompleteResponse)
def complete_lesson(lesson_id: int, payload: LessonCompleteRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == 1).first()
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not user or not lesson:
        raise HTTPException(status_code=404, detail="User or Lesson not found")

    # Update or insert UserProgress
    prog = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.lesson_id == lesson.id
    ).first()

    if not prog:
        prog = UserProgress(user_id=user.id, lesson_id=lesson.id)
        db.add(prog)

    is_first_completion = not prog.is_completed
    prog.is_completed = True
    prog.crowns = (prog.crowns or 0) + 1
    prog.completed_at = datetime.utcnow()

    # Check if user has an active 2x XP boost
    has_double_xp = bool(user.double_xp_until and user.double_xp_until > datetime.utcnow())
    active_multiplier = 2 if has_double_xp else 1

    # Calculate detailed XP using production calculation engine
    xp_calc = calculate_lesson_xp(
        base_xp=lesson.xp_reward or 10,
        mistakes_count=payload.mistakes_count,
        is_review=False,
        multiplier=active_multiplier
    )

    # Award XP and log atomic entry to XPLedger
    award_xp(
        db=db,
        user=user,
        source_type="lesson",
        base_xp=xp_calc["base_xp"],
        bonus_xp=xp_calc["bonus_xp"],
        multiplier=xp_calc["multiplier"],
        source_id=lesson.id,
        description=f"Completed '{lesson.title}' (Mistakes: {payload.mistakes_count})"
    )

    # Authentic streak engine with freeze protection
    streak_info = process_streak_activity(user, db)

    # Gems Economy: Award gems for accuracy & progress
    gems_earned = 0
    if payload.mistakes_count == 0:
        gems_earned += 5
        award_gems(user, 5)
    if is_first_completion:
        gems_earned += 10
        award_gems(user, 10)

    # Persist updated hearts from payload if not super
    if not user.is_super:
        user.hearts = max(0, min(5, payload.hearts_left))
        if user.hearts < 5:
            user.hearts_updated_at = datetime.utcnow()

    # Determine next lesson to unlock across units/sections
    next_lesson = db.query(Lesson).filter(
        Lesson.unit_id == lesson.unit_id,
        Lesson.order_index > lesson.order_index
    ).order_by(Lesson.order_index).first()

    if not next_lesson and lesson.unit:
        next_unit = db.query(Unit).filter(
            Unit.course_id == lesson.unit.course_id,
            Unit.order_index > lesson.unit.order_index
        ).order_by(Unit.order_index).first()
        if next_unit:
            next_lesson = db.query(Lesson).filter(
                Lesson.unit_id == next_unit.id
            ).order_by(Lesson.order_index).first()

    next_lesson_id = next_lesson.id if next_lesson else None

    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "xp_earned": xp_calc["total_xp"],
        "base_xp": xp_calc["base_xp"],
        "bonus_xp": xp_calc["bonus_xp"],
        "multiplier": xp_calc["multiplier"],
        "new_total_xp": user.xp,
        "gems_earned": gems_earned,
        "new_total_gems": user.gems or 155,
        "streak": user.streak,
        "unlocked_next_lesson_id": next_lesson_id,
        "message": f"Congratulations! You completed '{lesson.title}' and earned {xp_calc['total_xp']} XP!"
    }
