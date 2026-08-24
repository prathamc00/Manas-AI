from typing import Literal
from pydantic import BaseModel

UserIntentType = Literal[
    "venting",          # Just wanting to be heard, no fixing
    "advice_seeking",   # Explicitly asking what to do
    "reflection",       # Exploring a thought, memory, or pattern
    "crisis",           # Acute emotional distress / emergency
    "smalltalk",        # Casual greeting or check-in
    "clarification"     # Answering a previous question
]

class IntentAnalysis(BaseModel):
    intent: UserIntentType
    wants_advice: bool
    confidence: float

class IntentEngine:
    """Classifies user conversational intent to regulate advice and technique selection."""

    def analyze(self, message: str) -> IntentAnalysis:
        lower = message.lower()

        # 1. Explicit Venting or "Do not give advice" takes absolute priority
        venting_phrases = [
            "just need to vent", "don't give me advice", "dont give me advice",
            "no advice", "i just want to rant", "just listen",
            "i am just so tired", "i just hate this", "let me vent"
        ]
        if any(phrase in lower for phrase in venting_phrases):
            return IntentAnalysis(intent="venting", wants_advice=False, confidence=0.95)

        # 2. Check for advice seeking
        advice_phrases = [
            "what should i do", "what do you suggest", "give me advice", "how do i fix",
            "how can i solve", "what is the best way", "how do i handle", "tell me what to do",
            "give me a plan", "what steps should i take"
        ]
        if any(phrase in lower for phrase in advice_phrases):
            return IntentAnalysis(intent="advice_seeking", wants_advice=True, confidence=0.9)

        # 3. Check for reflection
        reflection_phrases = [
            "i've been wondering why", "i noticed that i", "i wonder if", "maybe i do this because",
            "reflecting on", "thinking about why"
        ]
        if any(phrase in lower for phrase in reflection_phrases):
            return IntentAnalysis(intent="reflection", wants_advice=False, confidence=0.8)

        # Default standard intent
        return IntentAnalysis(intent="reflection", wants_advice=False, confidence=0.6)
