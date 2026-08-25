from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

# Create async engine. Compatible with SQLite and PostgreSQL
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

from sqlalchemy import text

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
        # SQLite schema migration for users table if needed
        if "sqlite" in settings.DATABASE_URL:
            try:
                # Check columns in users table
                result = await conn.execute(text("PRAGMA table_info(users)"))
                columns = [row[1] for row in result.fetchall()]
                
                if "email" not in columns:
                    await conn.execute(text("ALTER TABLE users ADD COLUMN email VARCHAR(255)"))
                if "hashed_password" not in columns:
                    await conn.execute(text("ALTER TABLE users ADD COLUMN hashed_password VARCHAR(255)"))
                if "name" not in columns:
                    await conn.execute(text("ALTER TABLE users ADD COLUMN name VARCHAR(255)"))
            except Exception:
                pass
