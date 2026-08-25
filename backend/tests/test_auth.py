import pytest
import uuid
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_auth_flow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Sign up
        unique_id = uuid.uuid4().hex[:8]
        test_email = f"user_{unique_id}@example.com"
        signup_res = await ac.post("/api/auth/signup", json={
            "email": test_email,
            "password": "SecurePassword123!",
            "name": "Test User"
        })
        assert signup_res.status_code == 200
        data = signup_res.json()
        assert "access_token" in data
        assert data["user"]["email"] == test_email
        assert data["user"]["name"] == "Test User"
        token = data["access_token"]

        # 2. Get profile with token
        me_res = await ac.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert me_res.status_code == 200
        me_data = me_res.json()
        assert me_data["email"] == test_email

        # 3. Login with credentials
        login_res = await ac.post("/api/auth/login", json={
            "email": test_email,
            "password": "SecurePassword123!"
        })
        assert login_res.status_code == 200
        assert "access_token" in login_res.json()

        # 4. Login with invalid password
        bad_login = await ac.post("/api/auth/login", json={
            "email": test_email,
            "password": "WrongPassword!"
        })
        assert bad_login.status_code == 401
