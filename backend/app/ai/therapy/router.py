from typing import Literal
from pydantic import BaseModel

TherapeuticStrategyType = Literal[
    "reflective_listening",
    "cbt_thought_examination",
    "act_values_defusion",
    "somatic_grounding",
    "behavioral_activation"
]

class StrategyDecision(BaseModel):
    strategy: TherapeuticStrategyType
    guidelines: str
    focus_prompt: str

class TherapyRouter:
    """
    Therapy Strategy Router: Determines *HOW* MANAS should support the conversation.
    Distinct from the Advice Engine.
    """

    def route(self, emotion: str, intensity: int, intent: str, thought_pattern: str | None = None) -> StrategyDecision:
        # High distress (8-10) -> Somatic Grounding
        if intensity >= 8:
            return StrategyDecision(
                strategy="somatic_grounding",
                guidelines="Keep messages short. Guide the user back to the present moment, bodily sensations, or breath. Do not analyze complex thoughts yet.",
                focus_prompt="Guide the user through a gentle grounding or breath pause."
            )

        # Explicit venting intent -> Reflective Listening
        if intent == "venting":
            return StrategyDecision(
                strategy="reflective_listening",
                guidelines="Provide deep emotional validation and reflection. Do not offer solutions or analyze distortions. Hold space.",
                focus_prompt="Reflect what the user is experiencing and validate their emotional burden."
            )

        # Behavioral avoidance / lethargy -> Behavioral Activation
        if emotion == "overwhelm" and intent != "venting":
            return StrategyDecision(
                strategy="behavioral_activation",
                guidelines="Help unbundle the overwhelming pile into tiny, low-friction micro-actions (1-5 min steps).",
                focus_prompt="Help the user isolate one tiny, manageable piece to reduce overwhelm."
            )

        # Distorted/Absolute thinking patterns -> CBT Thought Examination
        if thought_pattern or emotion in ["guilt_shame", "anxiety"]:
            return StrategyDecision(
                strategy="cbt_thought_examination",
                guidelines="Gently and respectfully explore absolute statements ('always', 'never', 'failure'). Ask Socratic questions to look at evidence.",
                focus_prompt="Ask a gentle Socratic question to help the user examine the underlying thought."
            )

        # Existential or conflicting desires -> ACT Values Defusion
        return StrategyDecision(
            strategy="act_values_defusion",
            guidelines="Help the user observe thoughts as passing events rather than literal facts. Connect to core personal values.",
            focus_prompt="Help the user observe their thoughts with compassionate distance and connect to what truly matters to them."
        )
