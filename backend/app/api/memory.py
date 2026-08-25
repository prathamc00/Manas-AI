from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional
import uuid

from app.core.database import get_db
from app.core.config import settings
from app.core.auth import get_current_user
from app.database.models import Memory, User
from app.schemas.memory import MemoryCreate, MemoryUpdate, MemoryOut

router = APIRouter(prefix="/memories", tags=["Memories"])

@router.get("", response_model=List[MemoryOut])
async def list_memories(
    category: Optional[str] = None,
    user_confirmed_only: Optional[bool] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Memory).where(Memory.user_id == current_user.id)
    if category:
        query = query.where(Memory.category == category)
    if user_confirmed_only is not None:
        query = query.where(Memory.user_confirmed == user_confirmed_only)
        
    query = query.order_by(desc(Memory.created_at))
    res = await db.execute(query)
    return res.scalars().all()

@router.post("", response_model=MemoryOut)
async def create_memory(
    req: MemoryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_id = current_user.id

    new_mem = Memory(
        id=str(uuid.uuid4()),
        user_id=user_id,
        category=req.category,
        content=req.content,
        confidence=req.confidence,
        is_inferred=req.is_inferred,
        user_confirmed=req.user_confirmed,
        source_session=req.source_session
    )
    db.add(new_mem)
    await db.commit()
    await db.refresh(new_mem)
    return new_mem

@router.patch("/{memory_id}", response_model=MemoryOut)
async def update_memory(memory_id: str, req: MemoryUpdate, db: AsyncSession = Depends(get_db)):
    stmt = select(Memory).where(Memory.id == memory_id)
    res = await db.execute(stmt)
    mem = res.scalars().first()
    if not mem:
        raise HTTPException(status_code=404, detail="Memory not found")

    if req.content is not None:
        mem.content = req.content
    if req.user_confirmed is not None:
        mem.user_confirmed = req.user_confirmed
    if req.category is not None:
        mem.category = req.category

    await db.commit()
    await db.refresh(mem)
    return mem

@router.delete("/{memory_id}")
async def delete_memory(memory_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Memory).where(Memory.id == memory_id)
    res = await db.execute(stmt)
    mem = res.scalars().first()
    if not mem:
        raise HTTPException(status_code=404, detail="Memory not found")

    await db.delete(mem)
    await db.commit()
    return {"status": "deleted", "id": memory_id}
