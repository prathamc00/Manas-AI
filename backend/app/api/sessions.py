from fastapi import APIRouter, Depends, HTTPException
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, delete
from typing import List
from datetime import datetime, timezone
import uuid

from app.core.database import get_db
from app.core.config import settings
from app.core.auth import get_current_user
from app.database.models import Session, Message, User
from app.schemas.session import SessionCreate, SessionUpdate, SessionOut, MessageOut

router = APIRouter(prefix="/sessions", tags=["Sessions"])

@router.get("", response_model=List[SessionOut])
async def list_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(Session)
        .where(Session.user_id == current_user.id)
        .order_by(desc(Session.started_at))
    )
    res = await db.execute(stmt)
    sessions = res.scalars().all()
    
    # Load messages for each session
    out = []
    for s in sessions:
        msg_stmt = select(Message).where(Message.session_id == s.id).order_by(Message.created_at)
        msg_res = await db.execute(msg_stmt)
        msgs = msg_res.scalars().all()
        
        out.append(SessionOut(
            id=s.id,
            user_id=s.user_id,
            title=s.title,
            started_at=s.started_at,
            ended_at=s.ended_at,
            summary=s.summary or {},
            safety_status=s.safety_status,
            messages=[MessageOut.model_validate(m) for m in msgs]
        ))
    return out

@router.post("", response_model=SessionOut)
async def create_session(
    req: SessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_id = current_user.id

    new_session = Session(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=req.title or f"Session - {datetime.now().strftime('%b %d, %H:%M')}"
    )
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)

    return SessionOut(
        id=new_session.id,
        user_id=new_session.user_id,
        title=new_session.title,
        started_at=new_session.started_at,
        ended_at=new_session.ended_at,
        summary=new_session.summary or {},
        safety_status=new_session.safety_status,
        messages=[]
    )

@router.get("/{session_id}", response_model=SessionOut)
async def get_session(session_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Session).where(Session.id == session_id)
    res = await db.execute(stmt)
    session = res.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    msg_stmt = select(Message).where(Message.session_id == session.id).order_by(Message.created_at)
    msg_res = await db.execute(msg_stmt)
    msgs = msg_res.scalars().all()

    return SessionOut(
        id=session.id,
        user_id=session.user_id,
        title=session.title,
        started_at=session.started_at,
        ended_at=session.ended_at,
        summary=session.summary or {},
        safety_status=session.safety_status,
        messages=[MessageOut.model_validate(m) for m in msgs]
    )

@router.post("/{session_id}/end", response_model=SessionOut)
async def end_session(session_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Session).where(Session.id == session_id)
    res = await db.execute(stmt)
    session = res.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.ended_at = datetime.now(timezone.utc)
    await db.commit()
    return await get_session(session_id, db)

@router.patch("/{session_id}", response_model=SessionOut)
async def update_session(
    session_id: str,
    req: SessionUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Session).where(Session.id == session_id, Session.user_id == current_user.id)
    res = await db.execute(stmt)
    session = res.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if req.title is not None:
        session.title = req.title.strip() or "Untitled Session"

    await db.commit()
    return await get_session(session_id, db)

@router.delete("/{session_id}")
async def delete_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Session).where(Session.id == session_id, Session.user_id == current_user.id)
    res = await db.execute(stmt)
    session = res.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Delete related messages first
    del_msg_stmt = delete(Message).where(Message.session_id == session_id)
    await db.execute(del_msg_stmt)

    # Delete session
    del_session_stmt = delete(Session).where(Session.id == session_id)
    await db.execute(del_session_stmt)
    await db.commit()

    return {"status": "success", "message": "Session deleted"}
