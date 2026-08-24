from typing import Dict, Any

class SafetyPolicies:
    @staticmethod
    def get_emergency_response() -> str:
        return (
            "I hear that you are going through a deeply painful and overwhelming moment. "
            "Because your safety is the most important thing, I want to make sure you are supported right now. "
            "Please reach out to a professional or a crisis counselor who can be directly with you:\n\n"
            "• **India (Tele-MANAS)**: Call **14416** or **1800-891-4416** (24/7 Free)\n"
            "• **National Emergency**: Call **112**\n"
            "• **US/Canada Crisis Lifeline**: Call or text **988**\n"
            "• **UK (Samaritans)**: Call **116 123**\n"
            "• **International Lifelines**: Visit **https://findahelpline.com**\n\n"
            "You do not have to carry this alone. Please reach out to one of these free, confidential resources or a trusted person in your life right now."
        )

    @staticmethod
    def get_crisis_resources() -> Dict[str, Any]:
        return {
            "helplines": [
                {"country": "India (Tele-MANAS)", "number": "14416", "available": "24/7 Free"},
                {"country": "India Emergency", "number": "112", "available": "24/7"},
                {"country": "USA / Canada Lifeline", "number": "988", "available": "24/7 Call/Text"},
                {"country": "UK (Samaritans)", "number": "116 123", "available": "24/7 Free"},
                {"country": "Global", "url": "https://findahelpline.com", "available": "Worldwide Directory"}
            ],
            "safety_action": "Reach out immediately to a trusted friend, family member, or professional counselor."
        }
