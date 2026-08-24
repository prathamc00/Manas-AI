from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class MemoryCreate(BaseModel):
    category: str = Field(..., description="explicit, episodic, semantic, preference, goal")
    content: str = Field(..., min_length=1)
    is_inferred: bool = False
    user_confirmed: bool = True
    confidence: float = 1.0
    source_session: Optional[str] = None
    user_id: Optional[str] = None

class MemoryUpdate(BaseModel):
    content: Optional[str] = None
    user_confirmed: Optional[bool] = None
    category: Optional[str] = None

class MemoryOut(BaseModel):
    id: str
    user_id: str
    category: str
    content: str
    confidence: float
    is_inferred: bool
    user_confirmed: bool
    source_session: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
