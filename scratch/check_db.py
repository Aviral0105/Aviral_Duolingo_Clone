import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, ".")
from backend.app.database import SessionLocal
from backend.app.models import Lesson, Exercise

db = SessionLocal()
lessons = db.query(Lesson).all()
for l in lessons:
    print(f"=== Lesson {l.id}: {l.title} ===")
    exs = db.query(Exercise).filter(Exercise.lesson_id == l.id).order_by(Exercise.order_index).all()
    for e in exs:
        print(f"  Ex {e.id} ({e.type}): prompt='{e.prompt}', audio='{e.audio_text}', content={e.content}, correct='{e.correct_answer}'")
db.close()
