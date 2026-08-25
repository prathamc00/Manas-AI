# MANAS — AI Mental-Health & Therapeutic Companion

> **A mind that remembers. A companion that understands.**

 **Live Application**: [https://manass-ai.vercel.app/](https://manass-ai.vercel.app/)

MANAS is an engineered, private AI therapeutic companion built with structured psychological reasoning, independent safety classification, long-term memory separation (inferred vs. confirmed), and therapeutic strategy routing (Active Listening, Socratic CBT, ACT, and Somatic Grounding).

---

##  Key Features

- ** Multi-Strategy Therapeutic Router**: Socratic CBT, Acceptance and Commitment Therapy (ACT), Somatic Grounding, and Active Listening.
- ** Pre-Flight Safety & Crisis Detection**: Independent safety classifier with localized crisis resource escalation.
- ** Dual-Tier Contextual Memory**: Separates unconfirmed AI inferences from user-confirmed memory facts.
- ** Daily Check-in & Mood Tracking**: Longitudinal tracking of mood, stress, and energy levels.
- ** Growth Goals**: Therapeutic goal tracking with strategy execution and progress notes.
- ** Interactive Grounding Exercises**: Guided Box Breathing visualizer and 5-4-3-2-1 sensory anchor.
- ** Privacy Disguise Mode**: Instant single-key disguise mode (`Esc`) for discreet personal reflections.

---

## 🏗️ Architecture Overview

```
├── backend/                       # Python 3.11 + FastAPI + SQLAlchemy Async (PostgreSQL / SQLite)
│   ├── app/
│   │   ├── ai/
│   │   │   ├── providers/         # Swappable LLM Providers (Groq, Gemini, OpenAI, Dev Mock)
│   │   │   ├── context/           # Assembles history, confirmed memories, active goals, mood
│   │   │   ├── understanding/     # Emotion detection, Intent analysis, Psychological needs
│   │   │   ├── therapy/           # Strategy router (Listening, CBT, ACT, Grounding, Activation)
│   │   │   ├── advice/            # Regulated advice engine (Prevents unsolicited fixing)
│   │   │   ├── safety/            # Pre-flight independent crisis classifier & policies
│   │   │   ├── validation/        # Anti-dependency & clinical boundary validator
│   │   │   └── orchestrator.py    # Pipeline coordinator
│   │   ├── api/                   # REST endpoints (/chat, /sessions, /memories, /mood, /goals, /safety)
│   │   ├── database/              # PostgreSQL & SQLite compatible SQLAlchemy models
│   │   └── schemas/               # Pydantic v2 validation models
│   ├── Dockerfile                 # Containerized backend build
│   ├── docker-compose.yml         # Multi-container orchestration
│   ├── requirements.txt           # Python dependencies
│   └── tests/                     # Pytest suite
│
└── frontend/                      # React 19 + TypeScript + Vite + Tailwind CSS
    └── src/
        ├── components/
        │   ├── chat/              # Therapeutic chat with "What I'm hearing" reflection pills
        │   ├── checkin/           # Daily mood & energy check-in
        │   ├── memory/            # Inferred vs. Confirmed memory vault
        │   ├── goals/             # Growth goals & progress logs
        │   ├── exercises/         # Interactive Box Breathing orb & 5-4-3-2-1 anchor
        │   ├── safety/            # Localized crisis helpline directory
        │   └── disguise/          # Quick-Exit privacy disguise mode (Esc)
        └── App.tsx
```

---

##  Quick Start Guide

### 1. Start the Backend

```bash
cd backend
python -m venv .venv

# On Linux/macOS:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate

pip install -r requirements.txt
python run.py
```
*Backend runs on `http://127.0.0.1:8000` (Interactive API docs at `/docs`)*.

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*.

---

##  Running Tests

```bash
cd backend
pytest -v
```

---

##  AI Provider Configuration

Create a `backend/.env` file with your desired provider:

### Groq (Recommended for ultra-fast latency)
```env
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=groq/compound-mini
CRISIS_THRESHOLD=0.7
```

### Google Gemini
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

### OpenAI
```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
```

---

## 🌐 Deployments

- **Frontend**: Hosted on [Vercel](https://manass-ai.vercel.app/)
- **Backend**: Deployed on **AWS EC2** using Docker & FastAPI
