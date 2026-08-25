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
    allow_origins=["*"],
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

@app.get("/")
@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "provider": settings.AI_PROVIDER,
        "env": settings.APP_ENV
    }
