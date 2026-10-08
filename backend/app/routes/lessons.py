from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from ..models import User, Lesson, Exercise, UserProgress
from ..schemas import LessonDetailOut, LessonCompleteRequest, LessonCompleteResponse

router = APIRouter(prefix="/api/lessons", tags=["Lessons"])

@router.get("/{lesson_id}", response_model=LessonDetailOut)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    exercises = db.query(Exercise).filter(Exercise.lesson_id == lesson_id).order_by(Exercise.order_index).all()
    return {
        "id": lesson.id,
        "title": lesson.title,
        "xp_reward": lesson.xp_reward,
        "exercises": exercises
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

    # Award XP
    earned_xp = lesson.xp_reward
    user.xp += earned_xp

    # If first completion of the day, ensure streak is active
    if is_first_completion and user.streak == 0:
        user.streak = 1

    # Persist updated hearts from payload if not super
    if not user.is_super:
        user.hearts = max(0, min(5, payload.hearts_left))

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
        "xp_earned": earned_xp,
        "new_total_xp": user.xp,
        "streak": user.streak,
        "unlocked_next_lesson_id": next_lesson_id,
        "message": f"Congratulations! You completed '{lesson.title}' and earned {earned_xp} XP!"
    }
