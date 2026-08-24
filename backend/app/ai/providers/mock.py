import asyncio
from typing import AsyncGenerator, List
from app.ai.providers.base import BaseLLMProvider, LLMMessage, LLMResponse

class MockLLMProvider(BaseLLMProvider):
    """
    Deterministic Development Mock Provider.
    Visibly synthetic to prevent accidental confusion with live therapeutic responses in development.
    """
    
    async def generate_response(
        self,
        messages: List[LLMMessage],
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> LLMResponse:
        user_msg = next((m.content for m in reversed(messages) if m.role == "user"), "")
        content = self._build_deterministic_reply(user_msg)
        return LLMResponse(content=content, raw={"provider": "mock", "deterministic": True})

    async def stream_response(
        self,
        messages: List[LLMMessage],
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> AsyncGenerator[str, None]:
        user_msg = next((m.content for m in reversed(messages) if m.role == "user"), "")
        full_content = self._build_deterministic_reply(user_msg)
        
        words = full_content.split(" ")
        for i, word in enumerate(words):
            yield word + (" " if i < len(words) - 1 else "")
            await asyncio.sleep(0.02)  # Simulates streaming latency

    def _build_deterministic_reply(self, user_msg: str) -> str:
        lower = user_msg.lower()
        if "overwhelm" in lower or "too much" in lower or "stress" in lower:
            return (
                "[DEV MOCK: Active Listening & Grounding] "
                "I hear how heavy things feel right now. When everything piles up at once, it's completely natural for your mind to feel overloaded. "
                "Would it help to pause for a moment, take a breath, and untangle just one small piece of what's in front of you?"
            )
        elif "fail" in lower or "never" in lower or "always" in lower or "worthless" in lower:
            return (
                "[DEV MOCK: CBT Reframing] "
                "I notice words like 'always' or 'never' coming up. Our minds often jump to absolute conclusions when we are hurting or disappointed. "
                "If we look at what just happened objectively, what is one piece of evidence that challenges that thought?"
            )
        elif "goal" in lower or "habit" in lower or "plan" in lower or "advice" in lower:
            return (
                "[DEV MOCK: Action Planning] "
                "I hear your readiness to create momentum. Rather than tackling the entire challenge at once, "
                "what is the smallest, lowest-friction 5-minute action you could take today?"
            )
        else:
            return (
                f"[DEV MOCK: Reflective Space] "
                f"Thank you for sharing that with me. I'm listening. "
                f"What part of this is weighing on you the most right now?"
            )
