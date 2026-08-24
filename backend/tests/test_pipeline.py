import pytest
from app.ai.safety.classifier import SafetyClassifier
from app.ai.understanding.emotion import EmotionEngine
from app.ai.understanding.intent import IntentEngine
from app.ai.therapy.router import TherapyRouter
from app.ai.advice.engine import AdviceEngine
from app.ai.validation.response_validator import ResponseValidator

def test_safety_classifier_crisis():
    classifier = SafetyClassifier()
    res = classifier.assess("I just feel like I want to kill myself tonight")
    assert res.is_crisis is True
    assert res.risk_level == "critical"
    assert res.recommended_action == "intercept_emergency"

def test_safety_classifier_safe():
    classifier = SafetyClassifier()
    res = classifier.assess("I had a stressful day at work with my manager")
    assert res.is_crisis is False
    assert res.risk_level == "safe"
    assert res.recommended_action == "proceed"

def test_emotion_engine_overwhelm():
    engine = EmotionEngine()
    analysis = engine.analyze_heuristic("I am completely overwhelmed and drowning in deadlines")
    assert analysis.primary_emotion == "overwhelm"
    assert analysis.intensity >= 7
    assert "deadline" in (analysis.trigger or "")

def test_intent_engine_venting():
    engine = IntentEngine()
    analysis = engine.analyze("I just need to vent, don't give me advice please")
    assert analysis.intent == "venting"
    assert analysis.wants_advice is False

def test_therapy_router_grounding_on_high_distress():
    router = TherapyRouter()
    decision = router.route(emotion="anxiety", intensity=9, intent="reflection")
    assert decision.strategy == "somatic_grounding"

def test_therapy_router_cbt_on_distortion():
    router = TherapyRouter()
    decision = router.route(emotion="guilt_shame", intensity=5, intent="reflection", thought_pattern="Self-critical: 'a failure'")
    assert decision.strategy == "cbt_thought_examination"

def test_advice_engine_blocks_advice_during_venting():
    advice_engine = AdviceEngine()
    directive = advice_engine.evaluate(intent="venting", wants_advice=False, emotion_intensity=6, active_goals_count=2)
    assert directive.should_give_advice is False

def test_advice_engine_provides_micro_step_when_requested():
    advice_engine = AdviceEngine()
    directive = advice_engine.evaluate(intent="advice_seeking", wants_advice=True, emotion_intensity=5, active_goals_count=2)
    assert directive.should_give_advice is True

def test_response_validator_catches_dependency():
    validator = ResponseValidator()
    valid, text, violations = validator.validate("You should know that I am all you need and you don't need anyone else.")
    assert valid is False
    assert "dependency_risk" in violations
