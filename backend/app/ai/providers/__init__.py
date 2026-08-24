from app.core.config import settings
from app.ai.providers.base import BaseLLMProvider
from app.ai.providers.mock import MockLLMProvider
from app.ai.providers.groq import GroqLLMProvider
from app.ai.providers.gemini import GeminiLLMProvider
from app.ai.providers.openai import OpenAILLMProvider

def get_llm_provider() -> BaseLLMProvider:
    provider_name = (settings.AI_PROVIDER or "mock").lower()
    
    if provider_name == "groq" and settings.GROQ_API_KEY:
        try:
            return GroqLLMProvider()
        except Exception:
            return MockLLMProvider()
    elif provider_name == "gemini" and settings.GEMINI_API_KEY:
        try:
            return GeminiLLMProvider()
        except Exception:
            return MockLLMProvider()
    elif provider_name == "openai" and settings.OPENAI_API_KEY:
        try:
            return OpenAILLMProvider()
        except Exception:
            return MockLLMProvider()
    else:
        return MockLLMProvider()
