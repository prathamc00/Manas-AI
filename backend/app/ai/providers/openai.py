from typing import AsyncGenerator, List
from openai import AsyncOpenAI
from app.ai.providers.base import BaseLLMProvider, LLMMessage, LLMResponse
from app.core.config import settings

class OpenAILLMProvider(BaseLLMProvider):
    def __init__(self, api_key: str = "", model_name: str = ""):
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.model_name = model_name or settings.OPENAI_MODEL
        self.client = AsyncOpenAI(api_key=self.api_key) if self.api_key else None

    async def generate_response(
        self,
        messages: List[LLMMessage],
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> LLMResponse:
        if not self.client:
            raise ValueError("OPENAI_API_KEY is not configured.")

        formatted = [{"role": m.role, "content": m.content} for m in messages]
        resp = await self.client.chat.completions.create(
            model=self.model_name,
            messages=formatted,
            temperature=temperature,
            max_tokens=max_tokens
        )
        content = resp.choices[0].message.content or ""
        return LLMResponse(content=content, raw={"model": self.model_name})

    async def stream_response(
        self,
        messages: List[LLMMessage],
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> AsyncGenerator[str, None]:
        if not self.client:
            raise ValueError("OPENAI_API_KEY is not configured.")

        formatted = [{"role": m.role, "content": m.content} for m in messages]
        stream = await self.client.chat.completions.create(
            model=self.model_name,
            messages=formatted,
            temperature=temperature,
            max_tokens=max_tokens,
            stream=True
        )
        async for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta
