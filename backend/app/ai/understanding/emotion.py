from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class EmotionAnalysis(BaseModel):
    primary_emotion: str
    secondary_emotion: Optional[str] = None
    intensity: int  # 1 to 10
    trigger: Optional[str] = None
    thought_pattern: Optional[str] = None
    confidence: float

class EmotionEngine:
    """Analyzes emotional state and intensity from message context."""
    
    KEYWORD_EMOTION_MAP = {
        "anxiety": ["anxious", "worried", "nervous", "panic", "scared", "dread", "racing", "uneasy", "fear"],
        "overwhelm": ["overwhelmed", "too much", "drowning", "suffocating", "paralyzed", "exhausted", "burnout", "can't cope"],
        "sadness": ["sad", "depressed", "hopeless", "crying", "empty", "lonely", "down", "heavy", "heartbroken", "grief"],
        "frustration": ["angry", "frustrated", "pissed", "annoyed", "resentful", "irritated", "furious", "mad"],
        "guilt_shame": ["guilty", "ashamed", "worthless", "failure", "failed", "failing", "fail", "my fault", "hate myself", "disappointed", "incompetent"],
        "hope": ["better", "hopeful", "grateful", "good", "calm", "relieved", "excited", "happy", "peaceful", "proud"]
    }

    def analyze_heuristic(self, message: str) -> EmotionAnalysis:
        lower = message.lower()
        
        detected_emotions: List[tuple[str, int]] = []
        for emotion, keywords in self.KEYWORD_EMOTION_MAP.items():
            count = sum(1 for kw in keywords if kw in lower)
            if count > 0:
                detected_emotions.append((emotion, count))

        # Default fallback if no keywords match
        if not detected_emotions:
            return EmotionAnalysis(
                primary_emotion="neutral_reflective",
                intensity=4,
                trigger=None,
                thought_pattern=None,
                confidence=0.5
            )

        # Sort by match count
        detected_emotions.sort(key=lambda x: x[1], reverse=True)
        primary = detected_emotions[0][0]
        secondary = detected_emotions[1][0] if len(detected_emotions) > 1 else None

        # Estimate intensity
        intensity = 5
        if any(w in lower for w in ["extremely", "so much", "can't take", "cannot handle", "completely", "severely", "burst"]):
            intensity = 8
        elif any(w in lower for w in ["a bit", "a little", "mildly", "kind of", "somewhat"]):
            intensity = 3

        return EmotionAnalysis(
            primary_emotion=primary,
            secondary_emotion=secondary,
            intensity=intensity,
            trigger=self._extract_trigger_heuristic(lower),
            thought_pattern=self._extract_thought_heuristic(lower),
            confidence=0.8
        )

    def _extract_trigger_heuristic(self, text: str) -> Optional[str]:
        triggers = ["work", "job", "manager", "boss", "interview", "exam", "task", "tasks", "relationship", "family", "deadline", "partner", "friend", "money", "health"]
        found = [t for t in triggers if t in text]
        return ", ".join(found) if found else None

    def _extract_thought_heuristic(self, text: str) -> Optional[str]:
        if "i am" in text or "i'm" in text or "i feel like" in text:
            for pattern in ["not good enough", "a failure", "failing", "broken", "stupid", "stuck", "alone", "unlovable"]:
                if pattern in text:
                    return f"Self-critical: '{pattern}'"
        return None
