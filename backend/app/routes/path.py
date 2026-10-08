from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Course, Unit, Lesson, UserProgress
from ..schemas import PathResponse, UnitOut, LessonNodeOut

router = APIRouter(prefix="/api/path", tags=["Learning Path"])

@router.get("", response_model=PathResponse)
def get_learning_path(db: Session = Depends(get_db)):
    course = db.query(Course).first()
    if not course:
        return {"course_title": "Hindi", "course_flag": "🇮🇳", "units": []}

    units = db.query(Unit).filter(Unit.course_id == course.id).order_by(Unit.order_index).all()
    user_progress_map = {
        up.lesson_id: up 
        for up in db.query(UserProgress).filter(UserProgress.user_id == 1).all()
    }

    units_out = []
    # Determine which lessons are completed, available, or locked
    # The first incomplete lesson is available; lessons after that are locked
    first_incomplete_found = False

    for unit in units:
        lessons = db.query(Lesson).filter(Lesson.unit_id == unit.id).order_by(Lesson.order_index).all()
        lesson_nodes = []

        for lesson in lessons:
            prog = user_progress_map.get(lesson.id)
            if prog and prog.is_completed:
                status = "completed"
                crowns = prog.crowns if prog.crowns > 0 else 1
            elif not first_incomplete_found:
                status = "available"
                crowns = 0
                first_incomplete_found = True
            else:
                status = "locked"
                crowns = 0

            lesson_nodes.append(LessonNodeOut(
                id=lesson.id,
                title=lesson.title,
                icon=lesson.icon,
                order_index=lesson.order_index,
                status=status,
                crowns=crowns
            ))

        units_out.append(UnitOut(
            id=unit.id,
            section_title=unit.section_title,
            title=unit.title,
            description=unit.description,
            order_index=unit.order_index,
            lessons=lesson_nodes
        ))

    return {
        "course_title": course.title,
        "course_flag": course.flag,
        "units": units_out
    }
