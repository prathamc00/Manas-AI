from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class MessageOut(BaseModel):
    id: str
    session_id: str
    role: str
    content: str
    reflections: Dict[str, Any] = {}
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class SessionCreate(BaseModel):
    title: Optional[str] = "New Reflection Session"
    user_id: Optional[str] = None

class SessionOut(BaseModel):
    id: str
    user_id: str
    title: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    summary: Dict[str, Any] = {}
    safety_status: str = "safe"
    messages: List[MessageOut] = []

    model_config = ConfigDict(from_attributes=True)
