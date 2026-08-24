from typing import Optional
from pydantic import BaseModel

class AdviceDirective(BaseModel):
    should_give_advice: bool
    advice_style: Optional[str] = None
    instructions: str

class AdviceEngine:
    """
    Advice Engine: Determines *WHAT practical next step could help?*
    Strictly isolated from the Therapy Engine to prevent premature unsolicited advice.
    """

    def evaluate(
        self,
        intent: str,
        wants_advice: bool,
        emotion_intensity: int,
        active_goals_count: int
    ) -> AdviceDirective:
        # Rule 1: High distress -> NO advice yet (Grounding first)
        if emotion_intensity >= 8:
            return AdviceDirective(
                should_give_advice=False,
                advice_style=None,
                instructions="DO NOT provide advice or problem-solving. Focus entirely on emotional safety and grounding."
            )

        # Rule 2: Explicit Venting -> NO advice
        if intent == "venting":
            return AdviceDirective(
                should_give_advice=False,
                advice_style=None,
                instructions="DO NOT offer solutions or action steps. The user explicitly needs to express and feel validated."
            )

        # Rule 3: User explicitly asked for advice or action steps
        if wants_advice or intent == "advice_seeking":
            return AdviceDirective(
                should_give_advice=True,
                advice_style="collaborative_experiment",
                instructions=(
                    "The user has asked for direction. Suggest ONE clear, realistic micro-experiment (under 5 minutes). "
                    "Frame it as an invitation ('How would you feel about trying...') rather than a command."
                )
            )

        # Rule 4: Standard reflection with low-to-moderate intensity -> Suggest inquiry rather than directive
        return AdviceDirective(
            should_give_advice=False,
            advice_style=None,
            instructions="Keep the floor open for the user to lead. Ask an insightful inquiry rather than proposing an action."
        )
