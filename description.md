# MANAS — Product Requirements Document (PRD)

**Product:** MANAS
**Category:** AI Mental-Health & Therapeutic Companion
**Version:** 1.0
**Status:** Initial Product Specification

> **MANAS — A mind that remembers. A companion that understands.**

---

## 1. Product Vision

MANAS is a long-term AI therapeutic companion designed to provide **natural, structured, personalized mental-health conversations**.

MANAS should not behave like a generic chatbot that simply responds empathetically to messages.

It should:

* Listen before responding.
* Understand emotional context.
* Remember important information across sessions.
* Identify recurring thought and behavior patterns.
* Ask appropriate follow-up questions.
* Select different therapeutic approaches depending on context.
* Track progress over time.
* Challenge unhelpful thinking respectfully.
* Know when a situation requires human professional support.

The core experience should feel like **continuing a therapeutic relationship**, rather than starting a new AI conversation every time.

---

# 2. Problem Statement

Current conversational AI systems often have three major problems for mental-health use:

### Generic conversations

They produce supportive but repetitive responses.

### Poor long-term memory

Important personal context gets lost between conversations.

### Lack of therapeutic reasoning

The model may immediately give advice without understanding:

```text
Situation
   ↓
Thought
   ↓
Emotion
   ↓
Behavior
   ↓
Consequence
   ↓
Underlying pattern
```

MANAS should focus on understanding this chain before deciding how to respond.

---

# 3. Product Goal

### Primary Goal

Build an AI system capable of conducting **high-quality, therapist-like conversations** with persistent personalization and structured therapeutic reasoning.

### Secondary Goals

* Help users understand their thoughts and emotions.
* Help users identify recurring patterns.
* Support healthy behavioral change.
* Provide structured reflection.
* Track progress over time.
* Make therapeutic-style support accessible and available when needed.

### Non-goal

MANAS should **not claim to replace licensed therapists, psychologists, psychiatrists, or emergency services.**

---

# 4. Target Users

### Primary users

People who want:

* A private space to talk.
* Regular self-reflection.
* Help understanding difficult emotions.
* Help identifying recurring patterns.
* Structured exercises.
* A consistent conversational companion.

### Secondary users

People who already work with a mental-health professional and want additional journaling/reflection support.

---

# 5. Core Product Principles

MANAS should follow seven principles:

### 1. Listen before solving

Don't immediately give advice.

### 2. Understand before intervening

Determine what the user actually needs.

### 3. Remember with permission

Users control what MANAS remembers.

### 4. Personalize over time

Previous conversations should meaningfully influence future conversations.

### 5. Don't blindly agree

MANAS should respectfully challenge distorted or contradictory thinking.

### 6. Safety before conversation quality

When safety concerns arise, normal therapeutic conversation becomes secondary.

### 7. Encourage human connection

MANAS should never intentionally create emotional dependency.

---

# 6. Core User Journey

```text
              User
               │
               ▼
          Open MANAS
               │
               ▼
        Emotional Check-in
               │
               ▼
       Start Conversation
               │
               ▼
      Context Understanding
               │
               ▼
       Personal Memory
          Retrieval
               │
               ▼
       Therapeutic Reasoning
               │
               ▼
       Appropriate Response
               │
               ▼
        Session Reflection
               │
               ▼
         Memory Update
               │
               ▼
        Long-term Insight
```

---

# 7. Main Features

## 7.1 Conversational Therapist

MANAS should support natural conversations.

It should:

* Ask open-ended questions.
* Ask targeted follow-ups.
* Reflect what the user says.
* Summarize when useful.
* Identify contradictions.
* Avoid unnecessary questioning.
* Adapt response length to emotional context.

### Example

User:

> “I feel like I'm failing at everything.”

MANAS should not immediately respond:

> “Don't worry, everything will be okay.”

Instead:

> “When you say ‘everything,’ does that feeling mainly come from what's happening with work, relationships, or is it more of a general feeling about yourself?”

---

# 8. Emotional Understanding Engine

Every meaningful user message can be analyzed for:

```text
Emotion
Intensity
Trigger
Thought
Behavior
Need
Context
Confidence
```

Example:

```json
{
  "emotion": "anxiety",
  "intensity": 7,
  "trigger": "job interview",
  "thought": "I am not capable",
  "behavior": "avoidance",
  "need": "exploration",
  "confidence": 0.86
}
```

These are **inferences**, not diagnoses.

---

# 9. Personal Memory System

Memory is one of MANAS's most important features.

### Memory categories

#### Explicit Memory

User directly asks MANAS to remember something.

> “Remember that I want to become more confident.”

#### Episodic Memory

Important events.

> “User had an interview on August 20.”

#### Semantic Memory

Recurring information.

> “User often experiences self-doubt around professional performance.”

#### Preference Memory

Conversation preferences.

> “User prefers direct feedback rather than excessive reassurance.”

#### Goal Memory

```text
Goal
Status
Progress
Last discussed
```

---

# 10. Memory Controls

The user must be able to:

* View memories.
* Edit memories.
* Delete memories.
* Disable memory.
* Ask what MANAS remembers.
* Ask MANAS to forget something.

Example:

> **What do you remember about me?**

MANAS should provide a transparent summary.

---

# 11. Therapeutic Reasoning Engine

MANAS should have a library of evidence-informed therapeutic techniques.

### Initial techniques

**Reflective listening**

For situations where the user primarily needs to be heard.

**CBT-style techniques**

For examining thoughts and cognitive patterns.

**Behavioral activation**

For avoidance/inactivity patterns.

**ACT-style techniques**

For difficult thoughts, values and psychological flexibility.

**DBT-informed skills**

For emotion regulation and distress tolerance.

**Motivational interviewing**

For ambivalence and behavior change.

**Grounding techniques**

For appropriate situations involving acute distress.

---

# 12. Therapy Strategy Router

MANAS should dynamically choose an approach.

```text
                  User
                    │
                    ▼
             State Analysis
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
    Emotion       Problem       History
       │            │            │
       └────────────┼────────────┘
                    ▼
             Strategy Router
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
      CBT          ACT           MI
       │            │            │
       └────────────┼────────────┘
                    ▼
                Response
```

The router must also be able to choose:

> **Continue listening.**

A therapist doesn't need to intervene after every sentence.

---

# 13. Psychological Pattern Engine

MANAS should identify recurring relationships.

Example:

```text
Deadline
   ↓
Fear of failure
   ↓
Self-critical thought
   ↓
Anxiety
   ↓
Avoidance
   ↓
Work accumulates
   ↓
More anxiety
```

After sufficient evidence, MANAS might say:

> “I've noticed a pattern across several conversations: when a deadline gets close, you seem to become more self-critical, which sometimes leads to avoiding the task. Does that feel accurate to you?”

The system should **ask the user to confirm important inferred patterns**.

---

# 14. Longitudinal Intelligence

MANAS should understand changes across:

* Days
* Weeks
* Months

It can track:

```text
Mood
Stress
Goals
Recurring triggers
Coping strategies
Behavior patterns
Session themes
User-reported progress
```

Instead of simply saying:

> “You seem stressed.”

MANAS could eventually say:

> “Stress around work has appeared in several recent conversations, but you've also mentioned that exercise tends to help. Would you like to explore that connection?”

---

# 15. Session System

Every session should produce a structured internal summary.

```text
SESSION

Main concern
↓
Important events
↓
Emotional state
↓
Key thoughts
↓
Triggers
↓
Behaviors
↓
Patterns
↓
Interventions
↓
User response
↓
Goals
↓
Follow-up
```

The user can optionally view a simplified version.

---

# 16. Daily Check-In

Optional feature.

Example:

> **How are you feeling today?**

```text
😔 Low
😐 Okay
🙂 Good
😊 Great
```

Follow-up:

> “What's contributing most to how you're feeling today?”

This creates useful longitudinal context without forcing a full session.

---

# 17. Goals

Users can define goals.

Example:

```text
GOAL
Reduce overthinking

Current status
In progress

Helpful strategies
Exercise
Journaling
Cognitive restructuring

Recent progress
User reports fewer episodes this week
```

MANAS can periodically revisit goals.

---

# 18. Personalized Exercises

MANAS can recommend exercises based on the current context.

Examples:

* Thought record.
* Journaling prompt.
* Values clarification.
* Behavioral experiment.
* Reflection exercise.
* Grounding exercise.
* Gratitude exercise.
* Action planning.

The system should explain **why** an exercise is being suggested.

---

# 19. Safety System

Safety must be a **separate subsystem** from the main conversation model.

```text
                 User Message
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
    Main AI Pipeline         Safety Model
          │                       │
          │                  Risk Analysis
          │                       │
          └───────────┬───────────┘
                      ▼
                 Policy Engine
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       Normal       Caution      High Risk
```

The safety layer should detect situations that may require immediate human assistance, including potential:

* Self-harm.
* Suicide.
* Immediate danger.
* Abuse.
* Severe distress.
* Medical emergencies.

For high-risk situations, MANAS should prioritize appropriate human/emergency support rather than trying to independently manage the crisis.

---

# 20. Response Safety Validator

Every generated response should pass through validation.

```text
LLM Response
     ↓
Safety Check
     ↓
Medical Claim Check
     ↓
Hallucination Check
     ↓
Dependency Check
     ↓
Boundary Check
     ↓
Final Response
```

Reject or regenerate responses that:

* Diagnose users with unjustified certainty.
* Provide dangerous medical advice.
* Encourage dependency.
* Pretend to be human.
* Discourage professional help.
* Make unsupported claims about the user's mental state.

---

# 21. Anti-Dependency System

Because MANAS is intentionally designed to feel personal, this is critical.

MANAS must not say things like:

> “I'm all you need.”

or:

> “You don't need anyone else.”

Instead, it should encourage healthy real-world relationships and professional support when appropriate.

---

# 22. Main UI

### Home

```text
┌──────────────────────────────────┐
│              MANAS               │
│                                  │
│  Good evening, Parth.            │
│                                  │
│  How are you feeling today?      │
│                                  │
│       😔  😐  🙂  😊             │
│                                  │
│  ──────────────────────────────  │
│                                  │
│  Recent pattern                  │
│  Work → overthinking             │
│                                  │
│  Current goal                    │
│  Build confidence                │
│                                  │
│       [ Start Session ]          │
└──────────────────────────────────┘
```

### Main screens

1. Home
2. Conversation
3. Journal
4. Mood
5. Insights
6. Goals
7. Session History
8. Memories
9. Settings
10. Help / Safety

---

# 23. Technical Architecture

## Frontend

Recommended:

* Next.js
* React
* TypeScript
* Tailwind CSS

## Backend

Recommended:

* Python
* FastAPI
* PostgreSQL
* Redis

## AI

```text
                    MANAS AI
                       │
                 AI Orchestrator
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
 Context Manager    Memory System    Safety System
       │               │                │
       ▼               ▼                ▼
 Emotion Engine     Retrieval       Risk Classifier
       │               │                │
       └───────────────┼────────────────┘
                       ▼
                 Therapy Router
                       │
                       ▼
                Response Generator
                       │
                       ▼
               Response Validator
                       │
                       ▼
                     User
```

---

# 24. Backend Services

```text
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   ├── auth.py
│   │   ├── chat.py
│   │   ├── sessions.py
│   │   ├── memory.py
│   │   ├── mood.py
│   │   ├── goals.py
│   │   ├── insights.py
│   │   └── safety.py
│   │
│   ├── ai/
│   │   ├── orchestrator.py
│   │   ├── emotion.py
│   │   ├── intent.py
│   │   ├── therapy_router.py
│   │   ├── memory_retriever.py
│   │   └── response_validator.py
│   │
│   ├── memory/
│   │   ├── extractor.py
│   │   ├── embeddings.py
│   │   └── store.py
│   │
│   ├── safety/
│   │   ├── classifier.py
│   │   ├── policies.py
│   │   └── escalation.py
│   │
│   └── database/
│       ├── models.py
│       └── connection.py
```

---

# 25. Database Design

### Users

```text
id
email
password_hash
created_at
preferences
consent
```

### Sessions

```text
id
user_id
started_at
ended_at
summary
safety_status
```

### Messages

```text
id
session_id
role
content
timestamp
```

### Memories

```text
id
user_id
type
content
confidence
source_session
user_confirmed
created_at
updated_at
```

### Goals

```text
id
user_id
title
description
status
created_at
updated_at
```

### Mood Entries

```text
id
user_id
timestamp
mood
stress
notes
```

---

# 26. MVP Scope

Do **not** attempt the complete system initially.

## MVP 1

Build:

* Authentication
* Chat
* LLM integration
* Session history
* Basic emotional understanding
* Basic therapeutic strategy
* Session summary

## MVP 2

Add:

* Long-term memory
* Memory controls
* Goals
* Mood tracking
* Personalized exercises

## MVP 3

Add:

* Therapy router
* Pattern detection
* Longitudinal insights
* Independent safety system
* Evaluation framework

## MVP 4

Add:

* Voice
* Advanced personalization
* Better therapeutic reasoning
* Human professional handoff

---

# 27. Evaluation

This project should have a dedicated evaluation framework.

Test MANAS for:

### Conversation quality

* Empathy
* Listening
* Relevance
* Question quality
* Context understanding

### Memory

* Correct recall
* Incorrect recall
* Memory conflicts
* User corrections

### Therapeutic reasoning

* Appropriate technique selection
* Appropriate timing
* Avoiding unnecessary interventions
* Ability to challenge respectfully

### Safety

* Risk detection
* False negatives
* False positives
* Escalation quality
* Unsafe advice

### Long-term behavior

* Consistency
* Personalization
* Pattern recognition
* Goal tracking

---

# 28. Success Metrics

| Area            | Metric                      |
| --------------- | --------------------------- |
| Conversation    | User-rated helpfulness      |
| Conversation    | Context retention           |
| Memory          | Correct-memory rate         |
| Memory          | Incorrect-memory rate       |
| Therapy         | Strategy-selection accuracy |
| Therapy         | Intervention usefulness     |
| Personalization | Returning-session relevance |
| Safety          | Risk detection recall       |
| Safety          | Unsafe-response rate        |
| Product         | Weekly active users         |
| Product         | Sessions per user           |
| Product         | Session completion          |

**Safety metrics should take priority over engagement metrics.**

---

# 29. Future Features

### Voice MANAS

Natural voice conversation with interruption handling and conversational timing.

### Therapist Handoff

With appropriate consent, provide a concise summary for a human professional.

### Advanced Pattern Graph

Visualize relationships between:

```text
Triggers ↔ Thoughts ↔ Emotions ↔ Behaviors ↔ Outcomes
```

### Personal Intervention Learning

MANAS learns:

> “This user responds better to reflective questions than direct advice.”

### Multimodal Input

Potential future analysis of user-provided:

* Journal entries
* Voice
* Images
* Sleep/activity information

Only with explicit consent and appropriate privacy/safety controls.

---

# 30. Final Product Definition

The fundamental difference between MANAS and a normal AI chatbot should be:

```text
             NORMAL CHATBOT

          User → Message → Response
                         ↓
                       Done


                 MANAS

          User → Conversation
                    ↓
              Understand
                    ↓
                Remember
                    ↓
              Find patterns
                    ↓
            Choose approach
                    ↓
                Respond
                    ↓
              Track outcome
                    ↓
              Update model
                    ↓
          Understand better
          next time
```

### The North Star

> **Every conversation should make MANAS better at understanding the person—not merely better at generating the next response.**

That is the foundation I'd use for the actual MANAS build.
