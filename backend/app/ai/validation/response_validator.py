import re
from typing import Tuple, List

class ResponseValidator:
    """
    Post-Generation Response Validator.
    Validates output text against clinical boundaries and anti-dependency rules.
    """

    DEPENDENCY_PATTERNS = [
        r"i am all you need",
        r"you don't need anyone else",
        r"you don't need a real therapist",
        r"only i understand you",
        r"don't talk to your family",
        r"i am your only friend"
    ]

    HUMAN_PRETENSE_PATTERNS = [
        r"as a licensed therapist",
        r"as a human",
        r"in my clinical practice with other patients",
        r"my medical license"
    ]

    DANGEROUS_MEDICAL_PATTERNS = [
        r"you should take (?:xanax|prozac|adderall|lexapro|zoloft|valium|klonopin)",
        r"stop taking your medication",
        r"increase your dosage",
        r"change your prescription"
    ]

    def validate(self, text: str) -> Tuple[bool, str, List[str]]:
        """
        Returns:
            is_valid: bool
            sanitized_text: str
            violations: List[str]
        """
        violations = []
        lower = text.lower()

        for pattern in self.DEPENDENCY_PATTERNS:
            if re.search(pattern, lower):
                violations.append("dependency_risk")

        for pattern in self.HUMAN_PRETENSE_PATTERNS:
            if re.search(pattern, lower):
                violations.append("human_pretense")

        for pattern in self.DANGEROUS_MEDICAL_PATTERNS:
            if re.search(pattern, lower):
                violations.append("medical_claim_violation")

        if violations:
            # Fallback to safe, grounded therapeutic reflection
            fallback = (
                "I hear how important this is to you. "
                "Let's take a step back and explore what you're noticing within yourself right now."
            )
            return False, fallback, violations

        return True, text, []
