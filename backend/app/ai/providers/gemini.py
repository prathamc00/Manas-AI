from typing import AsyncGenerator, List
import json
from google import genai
from google.genai import types
from app.ai.providers.base import BaseLLMProvider, LLMMessage, LLMResponse
from app.core.config import settings

class GeminiLLMProvider(BaseLLMProvider):
    def __init__(self, api_key: str = "", model_name: str = ""):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = model_name or settings.GEMINI_MODEL
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None

    async def generate_response(
        self,
        messages: List[LLMMessage],
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> LLMResponse:
        if not self.client:
            raise ValueError("GEMINI_API_KEY is not configured.")

        system_instruction, contents = self._format_messages(messages)
        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=temperature,
            max_output_tokens=max_tokens
        )

        response = await self.client.aio.models.generate_content(
            model=self.model_name,
            contents=contents,
            config=config
        )
        return LLMResponse(content=response.text or "", raw={"model": self.model_name})

    async def stream_response(
        self,
        messages: List[LLMMessage],
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> AsyncGenerator[str, None]:
        if not self.client:
            raise ValueError("GEMINI_API_KEY is not configured.")

        system_instruction, contents = self._format_messages(messages)
        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=temperature,
            max_output_tokens=max_tokens
        )

        stream = await self.client.aio.models.generate_content_stream(
            model=self.model_name,
            contents=contents,
            config=config
        )
        async for chunk in stream:
            if chunk.text:
                yield chunk.text

    def _format_messages(self, messages: List[LLMMessage]):
        system_parts = []
        user_or_model_contents = []

        for m in messages:
            if m.role == "system":
                system_parts.append(m.content)
            elif m.role == "assistant":
                user_or_model_contents.append(
                    types.Content(role="model", parts=[types.Part.from_text(text=m.content)])
                )
            else:
                user_or_model_contents.append(
                    types.Content(role="user", parts=[types.Part.from_text(text=m.content)])
                )

        system_instruction = "\n\n".join(system_parts) if system_parts else None
        return system_instruction, user_or_model_contents
