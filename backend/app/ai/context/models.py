from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class ContextMemoryItem(BaseModel):
    category: str
    content: str
    is_inferred: bool
    user_confirmed: bool

class ContextGoalItem(BaseModel):
    title: str
    status: str
    strategies: List[str]

class ContextMoodItem(BaseModel):
    mood: int
    stress: int
    energy: int
    notes: Optional[str]
    created_at: datetime

class AssembledContext(BaseModel):
    user_id: str
    session_id: str
    recent_messages: List[Dict[str, str]]
    confirmed_memories: List[ContextMemoryItem]
    inferred_memories: List[ContextMemoryItem]
    active_goals: List[ContextGoalItem]
    recent_mood: Optional[ContextMoodItem] = None
    session_count: int = 1
