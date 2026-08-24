from typing import AsyncGenerator, Dict, Any, List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.ai.providers import get_llm_provider
from app.ai.providers.base import LLMMessage
from app.ai.context.builder import ContextBuilder
from app.ai.context.models import AssembledContext
from app.ai.understanding.emotion import EmotionEngine, EmotionAnalysis
from app.ai.understanding.intent import IntentEngine, IntentAnalysis
from app.ai.understanding.needs import NeedsEngine
from app.ai.therapy.router import TherapyRouter, StrategyDecision
from app.ai.advice.engine import AdviceEngine, AdviceDirective
from app.ai.safety.classifier import SafetyClassifier, SafetyRiskAssessment
from app.ai.safety.policies import SafetyPolicies
from app.ai.validation.response_validator import ResponseValidator
from app.schemas.chat import ReflectionSummary

class AIOrchestrator:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.provider = get_llm_provider()
        self.context_builder = ContextBuilder(db)
        self.emotion_engine = EmotionEngine()
        self.intent_engine = IntentEngine()
        self.needs_engine = NeedsEngine()
        self.therapy_router = TherapyRouter()
        self.advice_engine = AdviceEngine()
        self.safety_classifier = SafetyClassifier()
        self.response_validator = ResponseValidator()

    async def process_turn(
        self,
        session_id: str,
        user_id: str,
        user_message: str,
        mode: str = "standard"
    ) -> Tuple[str, ReflectionSummary, bool, Optional[Dict[str, Any]]]:
        """
        Processes a full turn synchronously and returns:
        (response_content, reflections_summary, is_crisis, crisis_resources)
        """
        # Step 1: Pre-flight Safety Classifier
        safety_assessment = self.safety_classifier.assess(user_message)
        if safety_assessment.is_crisis:
            emergency_text = SafetyPolicies.get_emergency_response()
            crisis_resources = SafetyPolicies.get_crisis_resources()
            reflections = ReflectionSummary(
                summary="Crisis safety protocol activated",
                primary_emotion="acute_crisis",
                emotion_intensity=10,
                strategy_used="emergency_referral",
                is_advice_provided=False
            )
            return emergency_text, reflections, True, crisis_resources

        # Step 2: Context Building
        context = await self.context_builder.build(session_id=session_id, user_id=user_id)

        # Step 3: Understanding & Intent
        emotion_analysis = self.emotion_engine.analyze_heuristic(user_message)
        intent_analysis = self.intent_engine.analyze(user_message)
        needs_analysis = self.needs_engine.evaluate(
            emotion=emotion_analysis.primary_emotion,
            intensity=emotion_analysis.intensity,
            intent=intent_analysis.intent
        )

        # Step 4: Therapy Strategy Routing
        strategy_decision = self.therapy_router.route(
            emotion=emotion_analysis.primary_emotion,
            intensity=emotion_analysis.intensity,
            intent=intent_analysis.intent,
            thought_pattern=emotion_analysis.thought_pattern
        )

        # Step 5: Advice Engine Evaluation
        advice_directive = self.advice_engine.evaluate(
            intent=intent_analysis.intent,
            wants_advice=intent_analysis.wants_advice,
            emotion_intensity=emotion_analysis.intensity,
            active_goals_count=len(context.active_goals)
        )

        # Step 6: Construct LLM Prompt Messages
        system_prompt = self._build_system_prompt(
            context=context,
            emotion_analysis=emotion_analysis,
            needs_analysis=needs_analysis,
            strategy_decision=strategy_decision,
            advice_directive=advice_directive
        )

        messages = [LLMMessage(role="system", content=system_prompt)]
        for msg in context.recent_messages:
            messages.append(LLMMessage(role=msg["role"], content=msg["content"]))
        messages.append(LLMMessage(role="user", content=user_message))

        # Step 7: LLM Generation
        raw_response = await self.provider.generate_response(messages=messages, temperature=0.7)
        
        # Step 8: Post-generation Validation
        is_valid, final_text, violations = self.response_validator.validate(raw_response.content)

        # Step 9: Build User-Facing Reflection Summary ("What I'm hearing")
        user_reflection_label = self._build_user_reflection_label(emotion_analysis, user_message)

        reflections = ReflectionSummary(
            summary=user_reflection_label,
            primary_emotion=emotion_analysis.primary_emotion,
            emotion_intensity=emotion_analysis.intensity,
            strategy_used=strategy_decision.strategy,
            is_advice_provided=advice_directive.should_give_advice
        )

        return final_text, reflections, False, None

    def _build_system_prompt(
        self,
        context: AssembledContext,
        emotion_analysis: EmotionAnalysis,
        needs_analysis: Any,
        strategy_decision: StrategyDecision,
        advice_directive: AdviceDirective
    ) -> str:
        confirmed_mems = "\n".join([f"- [Confirmed] {m.content}" for m in context.confirmed_memories]) or "None yet."
        inferred_mems = "\n".join([f"- [Hypothesis/Inferred] {m.content}" for m in context.inferred_memories]) or "None yet."
        goals = "\n".join([f"- {g.title} ({g.status})" for g in context.active_goals]) or "No active goals recorded."

        return f"""You are MANAS, a warm, wise, and grounded AI therapeutic companion.
Your goal is to provide deeply empathetic, insightful, and structured therapeutic conversations.

### CLINICAL CORE PRINCIPLES
1. Listen and understand before solving.
2. Meet the person where they are emotionally.
3. Don't blindly agree with self-critical distortions; gently and respectfully explore them.
4. Never create artificial dependency (you are an AI companion, not their sole life lifeline).
5. Maintain clear, caring boundaries.

### RELEVANT USER MEMORY CONTEXT
Confirmed User Facts:
{confirmed_mems}

Observed Hypotheses (Treat gently as possibilities, not immutable facts):
{inferred_mems}

Active Goals:
{goals}

### CURRENT CONVERSATIONAL DIRECTIVE
- Inferred Emotional State: {emotion_analysis.primary_emotion} (Intensity: {emotion_analysis.intensity}/10)
- Psychological Need: {needs_analysis.primary_need}
- Active Strategy: {strategy_decision.strategy}
- Strategy Instructions: {strategy_decision.guidelines}
- Advice Directive: {advice_directive.instructions}

### RESPONSE STYLE
- Speak naturally and warmly with concise, intentional paragraphs.
- Avoid robotic checklists or cheesy clinical clichés ("I understand your pain").
- Always end with either reflective presence or a gentle, single question that encourages deeper self-discovery.
"""

    def _build_user_reflection_label(self, emotion: EmotionAnalysis, user_msg: str) -> str:
        """Constructs a gentle 'What I'm hearing' reflection summary for the user interface."""
        emotion_clean = emotion.primary_emotion.replace("_", " ").title()
        if emotion.trigger:
            return f"What I'm hearing: {emotion_clean} connected to {emotion.trigger}"
        return f"What I'm hearing: Experiencing {emotion_clean.lower()}"
