import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    APP_NAME: str = "MANAS - AI Therapeutic Companion"
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    # Provider configuration: "mock", "groq", "gemini", "openai"
    AI_PROVIDER: str = "groq"
    
    # Groq API Configuration
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "groq/compound-mini"
    
    # Google Gemini Configuration
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"
    
    # Database
    DATABASE_URL: str = f"sqlite+aiosqlite:///{BASE_DIR}/manas.db"
    
    # Default User ID for single-user local build
    DEFAULT_USER_ID: str = "local-user-primary"
    
    # Safety threshold: 0.0 to 1.0 (scores above trigger policy escalation)
    CRISIS_THRESHOLD: float = 0.7
    
    model_config = SettingsConfigDict(
        env_file=os.path.join(BASE_DIR, ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
