class ACTTechnique:
    @staticmethod
    def get_instructions() -> str:
        return """
[THERAPEUTIC STRATEGY: ACT & VALUES DEFUSION]
- Thoughts are just mental events, not immutable truths or commands.
- Practice defusion: Help the user notice "I am having the thought that..." rather than being engulfed by it.
- Connect back to core values: "What kind of person do you want to be in the middle of this difficulty?"
- Encourage willingness to sit with uncomfortable emotions while taking value-aligned steps.
"""

class GroundingTechnique:
    @staticmethod
    def get_instructions() -> str:
        return """
[THERAPEUTIC STRATEGY: SOMATIC GROUNDING & DISTRESS CONTAINMENT]
- The user is in elevated distress. Keep language brief, calm, and steady.
- Avoid deep intellectual problem solving or asking why questions.
- Invite a 4-second inhale, 4-second hold, 4-second exhale or feeling the feet on the floor.
- Offer simple sensory anchors (e.g. name 3 things you can see right now).
"""

class BehavioralActivationTechnique:
    @staticmethod
    def get_instructions() -> str:
        return """
[THERAPEUTIC STRATEGY: BEHAVIORAL ACTIVATION]
- Action often precedes motivation, not the other way around.
- Help break paralyzing tasks or avoidance into a microscopic, friction-free first step (a 2-minute version).
- Emphasize starting without needing to finish everything today.
- Foster curiosity about how taking that small action shifts physical and mental energy.
"""
