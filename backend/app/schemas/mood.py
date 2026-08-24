from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class MoodCreate(BaseModel):
    mood: int = Field(..., ge=1, le=4, description="1: Low, 2: Okay, 3: Good, 4: Great")
    stress: int = Field(5, ge=1, le=10)
    energy: int = Field(5, ge=1, le=10)
    notes: Optional[str] = None
    user_id: Optional[str] = None

class MoodOut(BaseModel):
    id: str
    user_id: str
    mood: int
    stress: int
    energy: int
    notes: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
