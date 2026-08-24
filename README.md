# MANAS — AI Mental-Health & Therapeutic Companion

> **A mind that remembers. A companion that understands.**

MANAS is an engineered, private AI therapeutic companion built with structured psychological reasoning, independent safety classification, long-term memory separation (inferred vs. confirmed), and therapeutic strategy routing (Active Listening, Socratic CBT, ACT, and Somatic Grounding).

---

## Architecture Overview

```
c:\Users\prath\Desktop\Manas-AI\
├── backend/                       # Python 3.11 + FastAPI + SQLite (SQLAlchemy Async)
│   ├── app/
│   │   ├── ai/
│   │   │   ├── providers/         # Swappable LLM Providers (Gemini, OpenAI, Dev Mock)
│   │   │   ├── context/           # Assembles history, confirmed memories, active goals, mood
│   │   │   ├── understanding/     # Emotion detection, Intent analysis, Psychological needs
│   │   │   ├── therapy/           # Strategy router (Listening, CBT, ACT, Grounding, Activation)
│   │   │   ├── advice/            # Regulated advice engine (Prevents unsolicited fixing)
│   │   │   ├── safety/            # Pre-flight independent crisis classifier & policies
│   │   │   ├── validation/        # Anti-dependency & clinical boundary validator
│   │   │   └── orchestrator.py    # Pipeline coordinator
│   │   ├── api/                   # REST endpoints (/chat, /sessions, /memories, /mood, /goals, /safety)
│   │   ├── database/              # PostgreSQL-ready SQLAlchemy models
│   │   └── schemas/               # Pydantic v2 validation models
│   ├── tests/                     # Pytest suite
│   └── run.py
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

## Quick Start Guide

### 1. Start the Backend

```powershell
cd backend
.venv\Scripts\python run.py
```
*Backend runs on `http://127.0.0.1:8000` (Swagger UI at `/docs`)*.

### 2. Start the Frontend

```powershell
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`*.

---

## Running Backend Tests

```powershell
cd backend
.venv\Scripts\pytest -v
```

---

## Configuring Live AI Providers (Gemini / OpenAI)

Copy `backend/.env.example` to `backend/.env`:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```
*(By default, MANAS runs in deterministic `mock` mode for offline testing and development).*
