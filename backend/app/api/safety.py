from fastapi import APIRouter
from app.ai.safety.policies import SafetyPolicies

router = APIRouter(prefix="/safety", tags=["Safety"])

@router.get("/resources")
async def get_safety_resources():
    return SafetyPolicies.get_crisis_resources()
