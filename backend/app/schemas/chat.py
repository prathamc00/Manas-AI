from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=10000)
    user_id: Optional[str] = None
    mode: Optional[str] = Field("standard", description="standard, venting, socratic, grounding, advice")

class ReflectionSummary(BaseModel):
    summary: Optional[str] = Field(None, description="User-facing 'What I'm hearing' reflection")
    primary_emotion: Optional[str] = None
    emotion_intensity: Optional[int] = None
    strategy_used: Optional[str] = None
    is_advice_provided: bool = False

class ChatResponse(BaseModel):
    session_id: str
    message_id: str
    content: str
    reflections: ReflectionSummary
    safety_status: str = "safe"
    is_crisis: bool = False
    crisis_resources: Optional[Dict[str, Any]] = None
    created_at: datetime
