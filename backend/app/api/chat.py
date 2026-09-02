from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
import uuid

from app.core.database import get_db
from app.core.config import settings
from app.core.auth import get_current_user
from app.database.models import User, Session, Message
from app.schemas.chat import ChatRequest, ChatResponse, ReflectionSummary
from app.ai.orchestrator import AIOrchestrator

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("", response_model=ChatResponse)
async def send_message(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_id = current_user.id

    # 1. Ensure user exists in database
    user_stmt = select(User).where(User.id == user_id)
    user_res = await db.execute(user_stmt)
    user = user_res.scalars().first()
    if not user:
        user = User(id=user_id, preferences={"tone": "warm", "directness": "balanced"})
        db.add(user)
        await db.flush()

    # 2. Get or create active session
    session_id = req.session_id
    active_session = None
    if session_id:
        sess_stmt = select(Session).where(Session.id == session_id, Session.user_id == user_id)
        sess_res = await db.execute(sess_stmt)
        active_session = sess_res.scalars().first()

        # If not found under current_user, check if it was an orphan session created under default user
        if not active_session:
            orphan_stmt = select(Session).where(Session.id == session_id)
            orphan_res = await db.execute(orphan_stmt)
            orphan_session = orphan_res.scalars().first()
            if orphan_session and (orphan_session.user_id == settings.DEFAULT_USER_ID or not orphan_session.user_id):
                orphan_session.user_id = user_id
                await db.flush()
                active_session = orphan_session

    if not active_session:
        session_id = str(uuid.uuid4())
        msg_preview = req.message.strip().replace("\n", " ")
        session_title = msg_preview[:35] + ("..." if len(msg_preview) > 35 else "")
        active_session = Session(
            id=session_id,
            user_id=user_id,
            title=session_title or "Reflective Session"
        )
        db.add(active_session)
        await db.flush()
    else:
        # If session still has placeholder title, update it with initial user message summary
        if active_session.title in ["Reflective Session", "Therapeutic Session", "Untitled Session"]:
            msg_preview = req.message.strip().replace("\n", " ")
            active_session.title = msg_preview[:35] + ("..." if len(msg_preview) > 35 else "")

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
