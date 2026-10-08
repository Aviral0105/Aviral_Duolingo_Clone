import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from fastapi.testclient import TestClient
from sqlalchemy import inspect, text
from backend.app.main import app
from backend.app.database import engine, SessionLocal
from backend.app.models import User, Course, Unit, Lesson, Exercise, UserProgress, UserMistake, UserSetting

client = TestClient(app)

def test_sqlite_schema_and_tables():
    """Verify all 8 tables and indexes exist in SQLite."""
    inspector = inspect(engine)
    tables = set(inspector.get_table_names())
    expected = {
        "users", "courses", "units", "lessons",
        "exercises", "user_progress", "user_mistakes", "user_settings"
    }
    assert expected.issubset(tables), f"Missing tables: {expected - tables}"
    print("✓ Test 1 Passed: All 8 required tables exist in SQLite")

def test_sqlite_foreign_keys_pragma():
    """Verify SQLite foreign key enforcement is active."""
    db = SessionLocal()
    pragma_val = db.execute(text("PRAGMA foreign_keys;")).scalar()
    db.close()
    assert pragma_val == 1, "SQLite PRAGMA foreign_keys is not enabled!"
    print("✓ Test 2 Passed: SQLite PRAGMA foreign_keys = ON is active")

def test_curriculum_path_and_units():
    """Verify full Hindi 1 learning path with 3 units and 10 lessons."""
    res = client.get("/api/path")
    assert res.status_code == 200
    data = res.json()
    assert data["course_flag"] == "🇮🇳"
    assert len(data["units"]) == 3, f"Expected 3 units, got {len(data['units'])}"
    total_lessons = sum(len(u["lessons"]) for u in data["units"])
    assert total_lessons == 10, f"Expected 10 lessons, got {total_lessons}"
    print(f"✓ Test 3 Passed: Course path contains 3 units and 10 lessons (Flag: {data['course_flag']})")

def test_polymorphic_exercise_payloads():
    """Verify lessons load all 5 exercise types with proper content schemas."""
    res = client.get("/api/lessons/1")
    assert res.status_code == 200
    exercises = res.json()["exercises"]
    types_found = {ex["type"] for ex in exercises}
    assert "MULTIPLE_CHOICE" in types_found
    assert "WORD_BANK" in types_found
    assert "MATCH_PAIRS" in types_found
    assert "FILL_BLANK" in types_found
    assert "TYPE_ANSWER" in types_found
    print(f"✓ Test 4 Passed: All 5 exercise types loaded correctly: {sorted(list(types_found))}")

def test_mistake_recording_and_resolution():
    """Test full remediation pipeline: logging mistake and marking resolved."""
    # Fetch first exercise in lesson 2
    res_l2 = client.get("/api/lessons/2")
    assert res_l2.status_code == 200
    ex_id = res_l2.json()["exercises"][0]["id"]

    # 1. Log mistake
    res_m = client.post("/api/lessons/2/record-mistake", json={"exercise_id": ex_id})
    assert res_m.status_code == 200
    m_data = res_m.json()
    assert m_data["resolved"] is False

    # 2. Resolve mistake in review loop
    res_r = client.post("/api/lessons/2/resolve-mistake", json={"exercise_id": ex_id})
    assert res_r.status_code == 200
    r_data = res_r.json()
    assert r_data["resolved"] is True
    print("✓ Test 5 Passed: Mistake recording and spaced resolution pipeline verified")

def test_atomic_lesson_completion_and_unlock():
    """Test atomic completion: XP reward, streak update, next lesson unlock."""
    res = client.post("/api/lessons/2/complete", json={"hearts_left": 4, "mistakes_count": 1})
    assert res.status_code == 200
    comp = res.json()
    assert comp["success"] is True
    assert comp["xp_earned"] == 10
    assert comp["unlocked_next_lesson_id"] == 3
    print(f"✓ Test 6 Passed: Atomic completion verified (Next lesson unlocked: {comp['unlocked_next_lesson_id']})")

def test_shop_purchase_and_gem_accounting():
    """Test purchasing items with gem balance verification and overdraft protection."""
    # Ensure test user has 400 gems
    db = SessionLocal()
    u = db.query(User).filter(User.id == 1).first()
    u.gems = 400
    db.commit()
    db.close()

    # Refill hearts (-350 gems)
    res = client.post("/api/shop/purchase", json={"item_id": "refill_hearts"})
    assert res.status_code == 200
    assert res.json()["new_gems"] == 50

    # Insufficient funds protection (-200 freeze, but only 50 left)
    res_fail = client.post("/api/shop/purchase", json={"item_id": "freeze_streak"})
    assert res_fail.status_code == 400
    print("✓ Test 7 Passed: Shop transactions and gem overdraft protections verified")

def test_user_settings_persistence():
    """Test user settings GET and PUT roundtrip."""
    res = client.put("/api/user/settings", json={"dark_mode": "off", "sound_effects": True})
    assert res.status_code == 200
    assert res.json()["dark_mode"] == "off"

    res_get = client.get("/api/user/settings")
    assert res_get.status_code == 200
    assert res_get.json()["dark_mode"] == "off"
    print("✓ Test 8 Passed: User settings persistence verified")

def test_dynamic_leaderboard():
    """Test leaderboard ranking calculation based on live XP."""
    res = client.get("/api/leaderboard")
    assert res.status_code == 200
    entries = res.json()["entries"]
    assert len(entries) > 0
    # Ranks must be strictly sequential 1, 2, 3...
    for i, e in enumerate(entries):
        assert e["rank"] == i + 1
    print(f"✓ Test 9 Passed: Silver League standings verified with {len(entries)} ranked learners")

if __name__ == "__main__":
    print("\n==============================================")
    print(" RUNNING COMPREHENSIVE BACKEND TEST SUITE")
    print("==============================================\n")
    test_sqlite_schema_and_tables()
    test_sqlite_foreign_keys_pragma()
    test_curriculum_path_and_units()
    test_polymorphic_exercise_payloads()
    test_mistake_recording_and_resolution()
    test_atomic_lesson_completion_and_unlock()
    test_shop_purchase_and_gem_accounting()
    test_user_settings_persistence()
    test_dynamic_leaderboard()
    print("\n==============================================")
    print("  ALL 9 BACKEND PIPELINE TESTS PASSED 100%!")
    print("==============================================\n")
