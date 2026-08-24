from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
import uuid

from app.core.database import get_db
from app.core.config import settings
from app.database.models import MoodEntry, User
from app.schemas.mood import MoodCreate, MoodOut

router = APIRouter(prefix="/mood", tags=["Mood"])

@router.get("", response_model=List[MoodOut])
async def get_mood_history(user_id: str = settings.DEFAULT_USER_ID, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(MoodEntry)
        .where(MoodEntry.user_id == user_id)
        .order_by(desc(MoodEntry.created_at))
        .limit(30)
    )
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("", response_model=MoodOut)
async def log_mood(req: MoodCreate, db: AsyncSession = Depends(get_db)):
    user_id = req.user_id or settings.DEFAULT_USER_ID

    # Ensure user exists
    user_stmt = select(User).where(User.id == user_id)
    user_res = await db.execute(user_stmt)
    if not user_res.scalars().first():
        db.add(User(id=user_id))
        await db.flush()

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
