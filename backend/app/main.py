from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import init_db
from app.api import auth, chat, sessions, memory, mood, goals, safety

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database and tables
    await init_db()
    yield

app = FastAPI(
    title=settings.APP_NAME,
    description="Engineered AI Mental-Health & Therapeutic Companion Backend",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(sessions.router, prefix="/api")
app.include_router(memory.router, prefix="/api")
app.include_router(mood.router, prefix="/api")
app.include_router(goals.router, prefix="/api")
app.include_router(safety.router, prefix="/api")

@app.get("/health")
@app.get("/")
async def root_health():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "provider": settings.AI_PROVIDER,
        "env": settings.APP_ENV
    }

from sqlalchemy import text
from app.core.database import engine

@app.get("/api/health")
async def api_health():
    db_status = "unknown"
    db_type = "postgresql" if "postgres" in settings.DATABASE_URL else "sqlite"
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
            db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "app": settings.APP_NAME,
        "provider": settings.AI_PROVIDER,
        "database": db_status,
        "database_type": db_type,
        "env": settings.APP_ENV
    }
