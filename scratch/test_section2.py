import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, ".")

from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.database import SessionLocal
from backend.app.models import User, UserMistake, UserProgress

client = TestClient(app)

print("=== RUNNING SECTION 2 VERIFICATION TESTS ===")

# 1. Test fetching Lesson 1
res_lesson = client.get("/api/lessons/1")
assert res_lesson.status_code == 200, f"Failed to get lesson 1: {res_lesson.text}"
data_lesson = res_lesson.json()
assert len(data_lesson["exercises"]) == 6, f"Expected 6 exercises, got {len(data_lesson['exercises'])}"
print(" PASS: GET /api/lessons/1 returned 6 exercises")

# 2. Test recording a mistake for exercise 1
res_mistake = client.post("/api/lessons/1/record-mistake", json={"exercise_id": 1})
assert res_mistake.status_code == 200, f"Failed record mistake: {res_mistake.text}"
data_m = res_mistake.json()
assert data_m["success"] is True
assert data_m["mistake_count"] >= 1
assert data_m["resolved"] is False
print(f" PASS: POST /api/lessons/1/record-mistake recorded mistake (count: {data_m['mistake_count']})")

# 3. Test recording second mistake on same exercise (increments count)
res_m2 = client.post("/api/lessons/1/record-mistake", json={"exercise_id": 1})
assert res_m2.status_code == 200
data_m2 = res_m2.json()
assert data_m2["mistake_count"] == data_m["mistake_count"] + 1
print(f" PASS: Consecutive mistake incremented count to {data_m2['mistake_count']}")

# 4. Test resolving mistake during review
res_res = client.post("/api/lessons/1/resolve-mistake", json={"exercise_id": 1})
assert res_res.status_code == 200
data_res = res_res.json()
assert data_res["resolved"] is True
print(" PASS: POST /api/lessons/1/resolve-mistake marked mistake resolved=True")

# 5. Test completing lesson atomically
res_comp = client.post("/api/lessons/1/complete", json={"hearts_left": 4, "mistakes_count": 1})
assert res_comp.status_code == 200
data_comp = res_comp.json()
assert data_comp["success"] is True
assert data_comp["xp_earned"] == 10
print(f" PASS: POST /api/lessons/1/complete atomic transaction (new XP: {data_comp['new_total_xp']}, next lesson: {data_comp['unlocked_next_lesson_id']})")

# 6. Verify SQLite records directly
db = SessionLocal()
m = db.query(UserMistake).filter(UserMistake.exercise_id == 1).first()
assert m is not None and m.resolved is True
prog = db.query(UserProgress).filter(UserProgress.lesson_id == 1).first()
assert prog is not None and prog.is_completed is True
db.close()
print(" PASS: SQLite database verified UserMistake and UserProgress records directly")

print("\n ALL SECTION 2 TESTS PASSED!")
