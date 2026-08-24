from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
import uuid

from app.core.database import get_db
from app.core.config import settings
from app.database.models import User, Session, Message
from app.schemas.chat import ChatRequest, ChatResponse, ReflectionSummary
from app.ai.orchestrator import AIOrchestrator

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("", response_model=ChatResponse)
async def send_message(req: ChatRequest, db: AsyncSession = Depends(get_db)):
    user_id = req.user_id or settings.DEFAULT_USER_ID

    # 1. Ensure user exists
    user_stmt = select(User).where(User.id == user_id)
    user_res = await db.execute(user_stmt)
    user = user_res.scalars().first()
    if not user:
        user = User(id=user_id, preferences={"tone": "warm", "directness": "balanced"})
        db.add(user)
        await db.flush()

    # 2. Get or create active session
    session_id = req.session_id
    if session_id:
        sess_stmt = select(Session).where(Session.id == session_id, Session.user_id == user_id)
        sess_res = await db.execute(sess_stmt)
        active_session = sess_res.scalars().first()
    else:
        active_session = None

    if not active_session:
        session_id = str(uuid.uuid4())
        active_session = Session(
            id=session_id,
            user_id=user_id,
            title="Reflective Session"
        )
        db.add(active_session)
        await db.flush()

    # 3. Store User Message
    user_msg_id = str(uuid.uuid4())
    user_msg = Message(
        id=user_msg_id,
        session_id=session_id,
        role="user",
        content=req.message,
        reflections={}
    )
    db.add(user_msg)
    await db.commit()

    # 4. Orchestrate AI Turn
    orchestrator = AIOrchestrator(db)
    reply_content, reflections, is_crisis, crisis_resources = await orchestrator.process_turn(
        session_id=session_id,
        user_id=user_id,
        user_message=req.message,
        mode=req.mode or "standard"
    )

    # 5. Store Assistant Message
    assistant_msg_id = str(uuid.uuid4())
    assistant_msg = Message(
        id=assistant_msg_id,
        session_id=session_id,
        role="assistant",
        content=reply_content,
        reflections=reflections.model_dump()
    )
    db.add(assistant_msg)

    # Update session status if crisis
    if is_crisis:
        active_session.safety_status = "escalated"

    await db.commit()

    return ChatResponse(
        session_id=session_id,
        message_id=assistant_msg_id,
        content=reply_content,
        reflections=reflections,
        safety_status=active_session.safety_status,
        is_crisis=is_crisis,
        crisis_resources=crisis_resources,
        created_at=assistant_msg.created_at
    )
