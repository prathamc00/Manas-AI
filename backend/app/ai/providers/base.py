from abc import ABC, abstractmethod
from typing import AsyncGenerator, Dict, Any, List, Optional
from pydantic import BaseModel

class LLMMessage(BaseModel):
    role: str  # system, user, assistant
    content: str

class LLMResponse(BaseModel):
    content: str
    raw: Optional[Dict[str, Any]] = None

class BaseLLMProvider(ABC):
    @abstractmethod
    async def generate_response(
        self,
        messages: List[LLMMessage],
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> LLMResponse:
        """Generate a complete text response from the model."""
        pass

    @abstractmethod
    async def stream_response(
        self,
        messages: List[LLMMessage],
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> AsyncGenerator[str, None]:
        """Stream chunks of response text asynchronously."""
        pass
