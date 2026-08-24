from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from typing import Optional
from app.database.models import Session, Message, Memory, Goal, MoodEntry
from app.ai.context.models import (
    AssembledContext, ContextMemoryItem, ContextGoalItem, ContextMoodItem
)

class ContextBuilder:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def build(self, session_id: str, user_id: str, limit_messages: int = 10) -> AssembledContext:
        # 1. Fetch recent messages in active session
        msg_stmt = (
            select(Message)
            .where(Message.session_id == session_id)
            .order_by(desc(Message.created_at))
            .limit(limit_messages)
        )
        msg_result = await self.db.execute(msg_stmt)
        messages = list(reversed(msg_result.scalars().all()))
        formatted_messages = [{"role": m.role, "content": m.content} for m in messages]

        # 2. Fetch user memories (split into confirmed vs inferred)
        mem_stmt = (
            select(Memory)
            .where(Memory.user_id == user_id)
            .order_by(desc(Memory.created_at))
            .limit(30)
        )
        mem_result = await self.db.execute(mem_stmt)
        memories = mem_result.scalars().all()

        confirmed_memories = []
        inferred_memories = []
        for mem in memories:
            item = ContextMemoryItem(
                category=mem.category,
                content=mem.content,
                is_inferred=mem.is_inferred,
                user_confirmed=mem.user_confirmed
            )
            if mem.user_confirmed:
                confirmed_memories.append(item)
            else:
                inferred_memories.append(item)

        # 3. Fetch active goals
        goal_stmt = (
            select(Goal)
            .where(Goal.user_id == user_id, Goal.status == "in_progress")
            .limit(5)
        )
        goal_result = await self.db.execute(goal_stmt)
        goals = goal_result.scalars().all()
        active_goals = [
            ContextGoalItem(
                title=g.title,
                status=g.status,
                strategies=g.strategies or []
            )
            for g in goals
        ]

        # 4. Fetch most recent mood entry
        mood_stmt = (
            select(MoodEntry)
            .where(MoodEntry.user_id == user_id)
            .order_by(desc(MoodEntry.created_at))
            .limit(1)
        )
        mood_result = await self.db.execute(mood_stmt)
        latest_mood = mood_result.scalars().first()
        recent_mood = None
        if latest_mood:
            recent_mood = ContextMoodItem(
                mood=latest_mood.mood,
                stress=latest_mood.stress,
                energy=latest_mood.energy,
                notes=latest_mood.notes,
                created_at=latest_mood.created_at
            )

        # 5. Total sessions count
        count_stmt = select(func.count(Session.id)).where(Session.user_id == user_id)
        count_res = await self.db.execute(count_stmt)
        session_count = count_res.scalar() or 1

        return AssembledContext(
            user_id=user_id,
            session_id=session_id,
            recent_messages=formatted_messages,
            confirmed_memories=confirmed_memories,
            inferred_memories=inferred_memories,
            active_goals=active_goals,
            recent_mood=recent_mood,
            session_count=session_count
        )
