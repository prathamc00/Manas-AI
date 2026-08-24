from typing import AsyncGenerator, List
from groq import AsyncGroq
from app.ai.providers.base import BaseLLMProvider, LLMMessage, LLMResponse
from app.ai.providers.mock import MockLLMProvider
from app.core.config import settings

class GroqLLMProvider(BaseLLMProvider):
    def __init__(self, api_key: str = "", model_name: str = ""):
        self.api_key = api_key or settings.GROQ_API_KEY
        self.model_name = model_name or settings.GROQ_MODEL or "llama-3.3-70b-versatile"
        self.client = AsyncGroq(api_key=self.api_key) if self.api_key else None
        self.fallback = MockLLMProvider()

    async def generate_response(
        self,
        messages: List[LLMMessage],
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> LLMResponse:
        if not self.client or not self.api_key:
            return await self.fallback.generate_response(messages, temperature, max_tokens)

        try:
            formatted = [{"role": m.role, "content": m.content} for m in messages]
            resp = await self.client.chat.completions.create(
                model=self.model_name,
                messages=formatted,
                temperature=temperature,
                max_tokens=max_tokens
            )
            content = resp.choices[0].message.content or ""
            return LLMResponse(content=content, raw={"model": self.model_name, "provider": "groq"})
        except Exception as e:
            # If invalid key or model error, gracefully fall back with indicator
            fallback_res = await self.fallback.generate_response(messages, temperature, max_tokens)
            fallback_res.content = f"[Groq Error: {str(e)[:60]}... Falling back to local reasoning]\n\n" + fallback_res.content
            return fallback_res

    async def stream_response(
        self,
        messages: List[LLMMessage],
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> AsyncGenerator[str, None]:
        if not self.client or not self.api_key:
            async for chunk in self.fallback.stream_response(messages, temperature, max_tokens):
                yield chunk
            return

        try:
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
        except Exception:
            async for chunk in self.fallback.stream_response(messages, temperature, max_tokens):
                yield chunk
