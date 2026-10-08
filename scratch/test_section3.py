import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, ".")

from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.database import SessionLocal
from backend.app.models import User, UserSetting

client = TestClient(app)

print("=== RUNNING SECTION 3 VERIFICATION TESTS ===")

# 1. Test GET /api/user/settings
res_set = client.get("/api/user/settings")
assert res_set.status_code == 200, f"Failed GET settings: {res_set.text}"
data_set = res_set.json()
assert data_set["sound_effects"] is True
print(" PASS: GET /api/user/settings returned default settings")

# 2. Test PUT /api/user/settings
res_update = client.put("/api/user/settings", json={"dark_mode": "on", "sound_effects": False})
assert res_update.status_code == 200
data_up = res_update.json()
assert data_up["dark_mode"] == "on"
assert data_up["sound_effects"] is False
print(" PASS: PUT /api/user/settings updated user preferences")

# 3. Test Shop Purchases with Gems
# Set user gems to 500 for testing
db = SessionLocal()
u = db.query(User).filter(User.id == 1).first()
u.gems = 500
u.hearts = 2
db.commit()
db.close()

# Buy refill hearts (-350 gems)
res_buy1 = client.post("/api/shop/purchase", json={"item_id": "refill_hearts"})
assert res_buy1.status_code == 200, f"Purchase failed: {res_buy1.text}"
data_buy1 = res_buy1.json()
assert data_buy1["new_gems"] == 150
print(f" PASS: POST /api/shop/purchase (refill_hearts) deducted 350 gems (new gems: {data_buy1['new_gems']})")

# Buy double XP (-100 gems)
res_buy2 = client.post("/api/shop/purchase", json={"item_id": "double_xp"})
assert res_buy2.status_code == 200
data_buy2 = res_buy2.json()
assert data_buy2["new_gems"] == 50
print(f" PASS: POST /api/shop/purchase (double_xp) deducted 100 gems (new gems: {data_buy2['new_gems']})")

# Try to buy freeze_streak (costs 200 gems, but only 50 left -> must fail 400)
res_buy3 = client.post("/api/shop/purchase", json={"item_id": "freeze_streak"})
assert res_buy3.status_code == 400
print(" PASS: POST /api/shop/purchase correctly rejected purchase due to insufficient gems")

# 4. Test Super Trial (0 gems)
res_super = client.post("/api/shop/purchase", json={"item_id": "super_trial"})
assert res_super.status_code == 200
print(" PASS: POST /api/shop/purchase (super_trial) activated Super mode")

# 5. Test Dynamic Leaderboard calculation
res_lead = client.get("/api/leaderboard")
assert res_lead.status_code == 200
data_lead = res_lead.json()
assert len(data_lead["entries"]) >= 5
current_user_entry = next((e for e in data_lead["entries"] if e["is_current_user"]), None)
assert current_user_entry is not None
print(f" PASS: GET /api/leaderboard dynamically ranked current user at Rank #{current_user_entry['rank']} with {current_user_entry['xp']} XP")

print("\n ALL SECTION 3 TESTS PASSED!")
