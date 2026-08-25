from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

def get_normalized_database_url_and_args():
    url = settings.DATABASE_URL
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    
    # Handle SSL / asyncpg query parameters
    connect_args = {}
    if "sqlite" in url:
        connect_args["check_same_thread"] = False
    elif "sslmode=" in url:
        # asyncpg prefers ssl=require over sslmode=require
        url = url.replace("sslmode=require", "ssl=require")
        
    return url, connect_args

db_url, db_connect_args = get_normalized_database_url_and_args()

# Create async engine. Compatible with SQLite and PostgreSQL
engine = create_async_engine(
    db_url,
    echo=False,
    connect_args=db_connect_args,
    pool_pre_ping=True if "sqlite" not in db_url else False,
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
