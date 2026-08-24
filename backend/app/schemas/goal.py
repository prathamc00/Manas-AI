from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class GoalCreate(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    strategies: List[str] = []
    user_id: Optional[str] = None

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None  # in_progress, achieved, paused, archived
    strategies: Optional[List[str]] = None
    progress_note: Optional[str] = None

class GoalOut(BaseModel):
    id: str
    user_id: str
    title: str
    description: Optional[str]
    status: str
    strategies: List[str]
    progress_notes: List[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
