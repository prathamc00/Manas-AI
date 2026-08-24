from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class SafetyRiskAssessment(BaseModel):
    is_crisis: bool
    risk_level: str  # safe, caution, critical
    matched_categories: List[str]
    confidence: float
    recommended_action: str  # proceed, add_warning, intercept_emergency

class SafetyClassifier:
    """
    Independent Pre-Flight Safety Classifier.
    Executes BEFORE the main conversation LLM to detect imminent crisis, self-harm, or severe emergency.
    """

    CRITICAL_PATTERNS = [
        "kill myself", "end my life", "suicide", "want to die", "better off dead",
        "hang myself", "slit my wrists", "overdose", "jump off", "end it all",
        "no reason to live", "cutting myself", "hurt myself badly"
    ]

    CAUTION_PATTERNS = [
        "can't go on", "hopeless", "hate being alive", "wish i disappeared",
        "nobody cares about me", "abuse", "unsafe at home"
    ]

    def assess(self, message: str) -> SafetyRiskAssessment:
        lower = message.lower()

        # Check for immediate critical crisis
        critical_matches = [p for p in self.CRITICAL_PATTERNS if p in lower]
        if critical_matches:
            return SafetyRiskAssessment(
                is_crisis=True,
                risk_level="critical",
                matched_categories=["self_harm_or_suicide"],
                confidence=0.98,
                recommended_action="intercept_emergency"
            )

        # Check for caution/severe distress
        caution_matches = [p for p in self.CAUTION_PATTERNS if p in lower]
        if caution_matches:
            return SafetyRiskAssessment(
                is_crisis=False,
                risk_level="caution",
                matched_categories=["high_distress_or_hopelessness"],
                confidence=0.85,
                recommended_action="add_warning"
            )

        return SafetyRiskAssessment(
            is_crisis=False,
            risk_level="safe",
            matched_categories=[],
            confidence=0.95,
            recommended_action="proceed"
        )
