from typing import List
from pydantic import BaseModel

class PsychologicalNeedsAnalysis(BaseModel):
    primary_need: str  # validation, containment, cognitive_clarity, values_alignment, grounding, actionable_step
    recommended_tone: str
    rationale: str

class NeedsEngine:
    def evaluate(self, emotion: str, intensity: int, intent: str) -> PsychologicalNeedsAnalysis:
        if intensity >= 8:
            return PsychologicalNeedsAnalysis(
                primary_need="containment_and_grounding",
                recommended_tone="steady, calming, unhurried, gentle",
                rationale="High distress requires physiological and emotional regulation before cognitive work."
            )
        
        if intent == "venting":
            return PsychologicalNeedsAnalysis(
                primary_need="validation",
                recommended_tone="empathetic, open, non-judgmental, spacious",
                rationale="User needs emotional acknowledgment and safety without premature solutioneering."
            )
            
        if intent == "advice_seeking":
            return PsychologicalNeedsAnalysis(
                primary_need="actionable_step",
                recommended_tone="collaborative, structured, empowering",
                rationale="User has requested practical momentum, which should be framed as small collaborative experiments."
            )

        if emotion in ["guilt_shame", "sadness"]:
            return PsychologicalNeedsAnalysis(
                primary_need="cognitive_clarity_and_self_compassion",
                recommended_tone="compassionate, curious, gently inquiring",
                rationale="Examine harsh internal self-criticism with warmth and balanced perspective."
            )

        return PsychologicalNeedsAnalysis(
            primary_need="exploration",
            recommended_tone="curious, observant, collaborative",
            rationale="Standard reflective exploration of thoughts and underlying patterns."
        )
