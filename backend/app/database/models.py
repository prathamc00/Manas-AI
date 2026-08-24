import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, Float, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

def now_utc():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    preferences = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    memories = relationship("Memory", back_populates="user", cascade="all, delete-orphan")
    mood_entries = relationship("MoodEntry", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), default="Therapeutic Session")
    started_at = Column(DateTime(timezone=True), default=now_utc)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    summary = Column(JSON, default=dict)
    safety_status = Column(String(32), default="safe")  # safe, caution, escalated
    
    user = relationship("User", back_populates="sessions")
    messages = relationship("Message", back_populates="session", cascade="all, delete-orphan", order_by="Message.created_at")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    session_id = Column(String(64), ForeignKey("sessions.id"), nullable=False)
    role = Column(String(16), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    reflections = Column(JSON, default=dict)  # "What I'm hearing" user-facing summary, emotion tags, technique
    created_at = Column(DateTime(timezone=True), default=now_utc)
    
    session = relationship("Session", back_populates="messages")

class Memory(Base):
    __tablename__ = "memories"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    category = Column(String(32), nullable=False)  # explicit, episodic, semantic, preference, goal
    content = Column(Text, nullable=False)
    confidence = Column(Float, default=1.0)
    is_inferred = Column(Boolean, default=True)  # Inferred vs Explicit
    user_confirmed = Column(Boolean, default=False)  # Confirmed fact vs unconfirmed inference
    source_session = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    
    user = relationship("User", back_populates="memories")

class MoodEntry(Base):
    __tablename__ = "mood_entries"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    mood = Column(Integer, nullable=False)  # 1 (Low) to 4 (Great)
    stress = Column(Integer, default=5)  # 1 to 10
    energy = Column(Integer, default=5)  # 1 to 10
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    
    user = relationship("User", back_populates="mood_entries")

class Goal(Base):
    __tablename__ = "goals"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(32), default="in_progress")  # in_progress, achieved, paused, archived
    strategies = Column(JSON, default=list)
    progress_notes = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    
    user = relationship("User", back_populates="goals")
