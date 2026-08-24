from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
from datetime import datetime, timezone
import uuid

from app.core.database import get_db
from app.core.config import settings
from app.database.models import Goal, User
from app.schemas.goal import GoalCreate, GoalUpdate, GoalOut

router = APIRouter(prefix="/goals", tags=["Goals"])

@router.get("", response_model=List[GoalOut])
async def list_goals(user_id: str = settings.DEFAULT_USER_ID, db: AsyncSession = Depends(get_db)):
    stmt = select(Goal).where(Goal.user_id == user_id).order_by(desc(Goal.created_at))
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("", response_model=GoalOut)
async def create_goal(req: GoalCreate, db: AsyncSession = Depends(get_db)):
    user_id = req.user_id or settings.DEFAULT_USER_ID

    user_stmt = select(User).where(User.id == user_id)
    user_res = await db.execute(user_stmt)
    if not user_res.scalars().first():
        db.add(User(id=user_id))
        await db.flush()

    new_goal = Goal(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=req.title,
        description=req.description,
        strategies=req.strategies or [],
        progress_notes=[]
    )
    db.add(new_goal)
    await db.commit()
    await db.refresh(new_goal)
    return new_goal

@router.patch("/{goal_id}", response_model=GoalOut)
async def update_goal(goal_id: str, req: GoalUpdate, db: AsyncSession = Depends(get_db)):
    stmt = select(Goal).where(Goal.id == goal_id)
    res = await db.execute(stmt)
    goal = res.scalars().first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    if req.title is not None:
        goal.title = req.title
    if req.description is not None:
        goal.description = req.description
    if req.status is not None:
        goal.status = req.status
    if req.strategies is not None:
        goal.strategies = req.strategies
    if req.progress_note is not None:
        notes = list(goal.progress_notes or [])
        notes.append({
            "note": req.progress_note,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        goal.progress_notes = notes

    await db.commit()
    await db.refresh(goal)
    return goal

@router.delete("/{goal_id}")
async def delete_goal(goal_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Goal).where(Goal.id == goal_id)
    res = await db.execute(stmt)
    goal = res.scalars().first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    await db.delete(goal)
    await db.commit()
    return {"status": "deleted", "id": goal_id}
