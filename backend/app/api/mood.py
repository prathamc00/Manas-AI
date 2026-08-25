from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
import uuid

from app.core.database import get_db
from app.core.config import settings
from app.core.auth import get_current_user
from app.database.models import MoodEntry, User
from app.schemas.mood import MoodCreate, MoodOut

router = APIRouter(prefix="/mood", tags=["Mood"])

@router.get("", response_model=List[MoodOut])
async def get_mood_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(MoodEntry)
        .where(MoodEntry.user_id == current_user.id)
        .order_by(desc(MoodEntry.created_at))
        .limit(30)
    )
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("", response_model=MoodOut)
async def log_mood(
    req: MoodCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_id = current_user.id

    new_mood = MoodEntry(
        id=str(uuid.uuid4()),
        user_id=user_id,
        mood=req.mood,
        stress=req.stress,
        energy=req.energy,
        notes=req.notes
    )
    db.add(new_mood)
    await db.commit()
    await db.refresh(new_mood)
    return new_mood
