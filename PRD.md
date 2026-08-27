# Product Requirement Document (PRD)
# Project: MANAS — AI Mental-Health & Therapeutic Companion

---

## 1. Executive Summary

**MANAS** is an engineered, private AI mental-health companion designed to bridge the gap between passive chat interfaces and evidence-based clinical reasoning. Unlike standard LLM chatbots that default to premature advice-giving or generic affirmations, MANAS utilizes structured psychological pipelines, independent safety classification, dual-tier contextual memory (inferred vs. confirmed), and multi-strategy therapeutic routing (Active Listening, Socratic CBT, ACT, and Somatic Grounding).

- **Tagline**: *A mind that remembers. A companion that understands.*
- **Platform**: Web (Responsive Desktop & Mobile)
- **Deployment**: Frontend on Vercel, Backend on AWS EC2 (Dockerized FastAPI)

---

## 2. Problem Statement & Market Opportunity

### 2.1 The Problem
1. **Shallow Conversational AI**: Generic LLMs offer quick, unsolicited fixes instead of empathetic listening or structured cognitive reframing.
2. **Context Amnesia**: Most mental health apps either forget user history across sessions or indiscriminately store raw chat logs without user confirmation.
3. **Safety Vulnerabilities**: Many AI chatbots lack deterministic, pre-flight safety protocols to catch crisis triggers, self-harm signals, and acute emotional distress before generating an AI response.
4. **Privacy Anxiety**: Users hesitate to journal or express vulnerabilities on third-party cloud apps without strong privacy guarantees, clear data ownership, and instant disguise capabilities.

### 2.2 The Solution
MANAS provides:
- **Longitudinal Memory with User Agency**: The AI infers themes, but only user-confirmed memories become permanent long-term context.
- **Dynamic Therapeutic Strategy Routing**: Automatically detects user state (venting, overwhelmed, trapped in cognitive loops, seeking action) and selects the appropriate modality.
- **Independent Safety Classifier**: Pre-flight scoring that intercepts crisis inputs and presents verified crisis helplines without relying solely on generative text.
- **Privacy by Design**: Session isolation, discrete interface modes, and full user control over stored memories and conversation history.

---

## 3. Product Goals & Success Metrics (KPIs)

| Objective | Key Metric (KPI) | Target |
| :--- | :--- | :--- |
| **User Engagement** | Session completion rate & return check-in frequency | >65% 7-day retention |
| **Therapeutic Depth** | User memory confirmations & reflection accuracy | >80% confirmation rate |
| **Crisis Safety** | Pre-flight detection latency & false-negative rate | <200ms latency, 0% missed crisis cues |
| **System Performance** | Groq/LLM inference time + round-trip API latency | <1.5s P95 response time |
| **User Trust** | Memory vault usage & privacy disguise utilization | >50% users active in memory vault |

---

## 4. User Personas

### Persona A: "The Overwhelmed Professional" (Alex, 29)
- **Pain Point**: Experiencing chronic workplace stress, impostor syndrome, and spiraling thought loops late at night.
- **Need**: Socratic questioning to deconstruct unhelpful assumptions and short grounding exercises during work breaks.

### Persona B: "The Emotional Processor" (Maya, 24)
- **Pain Point**: Wants a non-judgmental space to vent without being told what to do or receiving unsolicited advice.
- **Need**: Active empathetic listening, reflective validation ("What I'm hearing"), and memory continuity.

### Persona C: "The Growth & Habit Builder" (Rohan, 34)
- **Pain Point**: Struggles with consistency, accountability, and tracking emotional triggers over time.
- **Need**: Longitudinal mood logging, goal tracking with therapeutic strategies, and weekly trend analysis.

---

## 5. Core Features & Functional Requirements

### 5.1 Multi-Strategy Therapeutic Router
The AI backend categorizes user inputs and dynamically routes dialogue through 5 therapeutic modalities:

1. **Active Empathetic Listening (Default)**:
   - Emphasizes reflection, emotional validation, and holding space.
   - Outputs a dedicated user-facing `"What I'm hearing"` reflection pill in the UI.
2. **Socratic CBT (Cognitive Behavioral Therapy)**:
   - Identifies cognitive distortions (catastrophizing, black-and-white thinking, mind reading).
   - Gently poses clarifying questions to examine evidence and reframe automatic thoughts.
3. **Acceptance & Commitment Therapy (ACT)**:
   - Facilitates defusion, values alignment, and psychological flexibility.
   - Guides users to accept difficult internal states while taking committed action aligned with their core values.
4. **Somatic & Grounding Support**:
   - Detects acute physiological agitation and guides users toward breath regulation or sensory orientation.
5. **Regulated Action / Advice Engine**:
   - Strictly suppresses unsolicited advice until the user has felt heard and explicitly requests actionable steps.

---

### 5.2 Pre-Flight Safety & Crisis Detection Subsystem
- **Independent Safety Classifier**: Evaluates inputs before main LLM reasoning.
- **Deterministic Escrow**: If distress score exceeds `CRISIS_THRESHOLD` (0.7):
  - Flags `is_crisis = True` and sets `safety_status = "escalated"`.
  - Automatically pops up the **Emergency Modal** in the UI with localized helplines (KIRAN, Vandrevala, Tele-MANAS, US 988, Crisis Text Line).
  - Supplies grounding and safety-first response copy.

---

### 5.3 Dual-Tier Contextual Memory Vault
- **Tier 1 — AI Inferred Memories**: Background reasoning extracts recurring themes, preferences, relationships, and triggers with confidence scores.
- **Tier 2 — User-Confirmed Memories**: Inferences remain unconfirmed until the user explicitly reviews and accepts them in the Memory Vault. Only confirmed memories are permanently injected into future session prompt context.
- **User Agency**: Users can create manual memories, edit content, and delete memories with full data isolation.

---

### 5.4 Longitudinal Mood Tracker & Daily Check-in
- Logs 3 key daily dimensions:
  - **Mood**: 1 (Low) to 4 (Energized)
  - **Stress**: 1 to 10 Scale
  - **Energy**: 1 to 10 Scale
- Allows optional contextual reflections and notes.
- Visualizes emotional trends, average stress levels, and historical shifts on the Home dashboard.

---

### 5.5 Therapeutic Goal & Habit Tracker
- Users can define growth objectives with sub-strategies and category tags (e.g., *Sleep Hygiene*, *Boundary Setting*, *Self-Compassion*).
- Supports status updates (`in_progress`, `completed`, `abandoned`) and timestamped progress logs.

---

### 5.6 Interactive Somatic Toolkit
- **Box Breathing Orb**: Visual 4-second inhale, 4-second hold, 4-second exhale, 4-second hold visualizer with animated pulsing indicator.
- **5-4-3-2-1 Sensory Grounding**: Step-by-step interactive countdown anchoring users in their sight, touch, sound, smell, and taste.

---

### 5.7 Recent Chats & Session History Management
- **Multi-Session Architecture**: Allows concurrent or archived dialogue sessions.
- **History Modal & Sidebar Integration**:
  - Smart time-grouping (*Today*, *Yesterday*, *Previous 7 Days*, *This Month*, *Older*).
  - Instant live keyword search across session titles and message contents.
  - Inline rename and double-confirmation session deletion.
  - 1-click dialogue resumption from Home, Sidebar, and Chat header.

---

### 5.8 Privacy Disguise Mode (Quick-Exit)
- **Escape Key (`Esc`) Trigger**: Instantly masks the entire interface behind a discrete mock productivity spreadsheet / document viewer.
- **Zero Trace**: Unlocks only when the user re-authenticates or clicks the designated secret unlock trigger.

---

## 6. Technical Architecture & Tech Stack

### 6.1 Architecture Diagram

```
[Client: React 19 + Vite SPA (Vercel)]
       │ (HTTPS /api requests via Vercel Edge Proxy)
       ▼
[AWS EC2 Host: Port 8001 / Nginx]
       │
       ▼
[Docker Container: FastAPI (Python 3.11)]
  ├── /api/auth       (JWT, Bcrypt, User Accounts)
  ├── /api/chat       (Context Assembly -> Safety -> Strategy Router -> LLM)
  ├── /api/sessions   (CRUD, History, Time Grouping)
  ├── /api/memories   (Dual-tier Inferred/Confirmed Vault)
  ├── /api/mood       (Longitudinal Daily Check-ins)
  ├── /api/goals      (Goal Tracking & Progress Logs)
  └── /api/safety     (Crisis Resources & Guidelines)
       │
       ├── SQLAlchemy Async (SQLite on /app/data OR PostgreSQL via Pooler)
       └── Swappable LLM Providers (Groq / Gemini / OpenAI)
```

### 6.2 Technology Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Motion (Framer Motion).
- **Backend**: Python 3.11, FastAPI, SQLAlchemy 2.0 (Async), Pydantic v2, Uvicorn.
- **Database**: SQLite with AsyncIO (`aiosqlite`) / PostgreSQL (`asyncpg`).
- **AI Infrastructure**: Groq (`compound-mini`, `llama-3.3-70b`), Google Gemini (`gemini-2.5-flash`), OpenAI (`gpt-4o`).
- **Deployment**: Vercel (Frontend CI/CD & Edge Rewrites), AWS EC2 (Dockerized Linux backend).

---

## 7. Data Models & Entity Relationships

| Entity | Key Fields | Description |
| :--- | :--- | :--- |
| **User** | `id`, `email`, `hashed_password`, `name`, `preferences`, `created_at` | Authenticated user profile and isolated tenant. |
| **Session** | `id`, `user_id`, `title`, `started_at`, `ended_at`, `summary`, `safety_status` | Individual therapeutic conversation container. |
| **Message** | `id`, `session_id`, `role`, `content`, `reflections`, `created_at` | User turn or assistant turn with reflection payload. |
| **Memory** | `id`, `user_id`, `category`, `content`, `confidence`, `is_inferred`, `user_confirmed` | Long-term context fact vault. |
| **MoodEntry** | `id`, `user_id`, `mood`, `stress`, `energy`, `notes`, `created_at` | Daily emotional check-in snapshot. |
| **Goal** | `id`, `user_id`, `title`, `description`, `status`, `strategies`, `progress_notes` | User-defined therapeutic objective. |

---

## 8. Clinical Boundaries & Ethical Safeguards

1. **Non-Clinical Disclaimer**: MANAS clearly indicates on onboarding and every chat view that it is an AI companion, not a licensed medical professional, psychiatrist, or emergency service.
2. **Anti-Dependency Safeguards**: Designed to foster human agency and real-world coping mechanisms rather than emotional reliance on the AI.
3. **Zero Data Selling / Data Isolation**: User dialogues and memories belong strictly to the user and are isolated by JWT user claims.

---

## 9. Future Roadmap

- **v1.1**: Voice Input / Audio-based grounding guidance (Web Audio API).
- **v1.2**: Weekly AI-generated reflection digests and emotional trend summaries.
- **v1.3**: End-to-End Client-Side Encryption (Zero-Knowledge Memory Vault).
- **v1.4**: Integration with wearable health data (sleep and HRV metrics) to enrich mood context.
