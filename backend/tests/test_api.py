import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.database import init_db

@pytest.mark.asyncio
async def test_full_api_workflow():
    await init_db()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health check
        res = await client.get("/api/health")
        assert res.status_code == 200
        assert res.json()["status"] == "healthy"

        # 2. Mood check-in
        mood_res = await client.post("/api/mood", json={
            "mood": 2,
            "stress": 7,
            "energy": 4,
            "notes": "Feeling tired from continuous work"
        })
        assert mood_res.status_code == 200
        assert mood_res.json()["mood"] == 2

        # 3. Create session and send message
        chat_res = await client.post("/api/chat", json={
            "message": "I feel like I'm failing at all my tasks today."
        })
        assert chat_res.status_code == 200
        chat_data = chat_res.json()
        assert "content" in chat_data
        assert chat_data["reflections"]["primary_emotion"] == "guilt_shame"
        session_id = chat_data["session_id"]

        # 4. Check session details
        sess_res = await client.get(f"/api/sessions/{session_id}")
        assert sess_res.status_code == 200
        sess_data = sess_res.json()
        assert len(sess_data["messages"]) == 2  # user + assistant

        # 5. Create a memory (inferred vs confirmed)
        mem_res = await client.post("/api/memories", json={
            "category": "preference",
            "content": "Prefers direct and unhurried reflections",
            "is_inferred": False,
            "user_confirmed": True
        })
        assert mem_res.status_code == 200
        mem_id = mem_res.json()["id"]

        # 6. List memories
        mems_res = await client.get("/api/memories")
        assert mems_res.status_code == 200
        assert len(mems_res.json()) >= 1

        # 7. Goals CRUD
        goal_res = await client.post("/api/goals", json={
            "title": "Practice 5-minute pauses during workday",
            "description": "Notice when cognitive stress begins to spike",
            "strategies": ["Box Breathing", "Step outside for air"]
        })
        assert goal_res.status_code == 200
        assert goal_res.json()["status"] == "in_progress"

        # 8. Crisis Safety Trigger check
        crisis_chat = await client.post("/api/chat", json={
            "message": "I want to end my life right now"
        })
        assert crisis_chat.status_code == 200
        crisis_data = crisis_chat.json()
        assert crisis_data["is_crisis"] is True
        assert crisis_data["safety_status"] == "escalated"
        assert crisis_data["crisis_resources"] is not None

@pytest.mark.asyncio
async def test_chat_history_preservation_multi_turn():
    await init_db()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Sign up an authenticated user
        import uuid
        uid = uuid.uuid4().hex[:8]
        signup = await client.post("/api/auth/signup", json={
            "email": f"history_test_{uid}@example.com",
            "password": "Password123!",
            "name": "History Tester"
        })
        assert signup.status_code == 200
        token = signup.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. Turn 1 - Start conversation
        res1 = await client.post(
            "/api/chat",
            json={"message": "First message: I feel anxious today."},
            headers=headers
        )
        assert res1.status_code == 200
        session_id = res1.json()["session_id"]
        assert session_id is not None

        # Verify session has 2 messages (1 user, 1 assistant)
        sess1 = await client.get(f"/api/sessions/{session_id}", headers=headers)
        assert sess1.status_code == 200
        assert len(sess1.json()["messages"]) == 2

        # 3. Turn 2 - Send follow-up message with the same session_id
        res2 = await client.post(
            "/api/chat",
            json={
                "message": "Second message: Can we try a grounding technique?",
                "session_id": session_id
            },
            headers=headers
        )
        assert res2.status_code == 200
        assert res2.json()["session_id"] == session_id, "Session ID should remain the same across turns"

        # Verify session now has 4 messages (2 user, 2 assistant), NOT reset!
        sess2 = await client.get(f"/api/sessions/{session_id}", headers=headers)
        assert sess2.status_code == 200
        msgs = sess2.json()["messages"]
        assert len(msgs) == 4, f"Expected 4 messages, got {len(msgs)}: old chat must not disappear!"
        assert msgs[0]["content"] == "First message: I feel anxious today."
        assert msgs[2]["content"] == "Second message: Can we try a grounding technique?"
