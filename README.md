# Video Demonstration Of This 

https://drive.google.com/file/d/1RnWq4kjhmrDBsnwG2NzNCLBxl4cZ9mYt/view?usp=sharing

# Eubrics AI Sales Arena

**Practice. Improve. Close More Deals.**

A premium, dark-themed SaaS platform where a salesperson practices live voice roleplay against an
AI customer. The AI never behaves like an assistant — it stays strictly in character as a
customer: it interrupts, negotiates, objects, mentions competitors, and can end the call
unsatisfied.

## Stack

- **Frontend**: React + Vite + TypeScript + TailwindCSS + Framer Motion + Zustand
- **Backend**: Node.js + Express + TypeScript
- **Voice**: Google Gemini Live API (WebSocket, browser ↔ Gemini directly via `@google/genai`,
  ephemeral auth token minted server-side)
- **Data**: Personas, scenarios, and prompt rules live in JSON (`/personas`, `/prompts`) — nothing
  persona-specific is hardcoded in TypeScript. Sessions are kept in memory for the life of the
  backend process (no database).

## Project layout

```
sales-roleplay-bot/
  backend/     Express API: persona engine, Gemini Live token minting, AI coach scoring
  frontend/    React app: landing page + 3-column practice arena
  personas/    JSON persona seeds + industry/personality/difficulty trait tables + scenarios
  prompts/     Base system-prompt guardrails used to build the AI customer's instructions
```

## Setup

### 1. Backend

```bash
cd sales-roleplay-bot/backend
npm install
cp .env.example .env
```

Edit `.env` and set `GEMINI_API_KEY` to a Gemini API key with Live API access. Then:

```bash
npm run dev
```

Runs on `http://localhost:4000`.

### 2. Frontend

```bash
cd sales-roleplay-bot/frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`. Open it, click **Start Practice**, configure a customer, and go.

Run backend and frontend in two separate terminals — both need to be up for the app to work.

## How the voice pipeline works

1. The left panel posts your configuration to `POST /api/session/start`.
2. The backend resolves a persona (from `/personas` JSON, composed with industry/personality/
   difficulty trait tables), renders a full system prompt, and mints a short-lived Gemini Live
   ephemeral auth token with that prompt, voice, and transcription config locked in via
   `liveConnectConstraints`. The browser never sees your standing API key, and can't override the
   persona prompt since it's baked into the token server-side.
3. The browser opens a Gemini Live **WebSocket** session (`@google/genai`'s `ai.live.connect()`)
   using that ephemeral token. Mic audio is captured via the Web Audio API, downsampled to 16kHz
   PCM16, and streamed to Gemini as base64 frames; audio replies (24kHz PCM16) are decoded and
   scheduled back through a Web Audio playback graph — live transcript text arrives as separate
   `inputTranscription`/`outputTranscription` events on the same socket.
4. On **End Session**, the full transcript is sent to `POST /api/session/:id/end`, which asks
   Gemini to grade the call (confidence, discovery, rapport, objection handling, closing) via
   structured JSON output and returns strengths, weaknesses, and actionable suggestions.

The right-panel meters during the call are lightweight **live heuristics** computed client-side
from the transcript so far (talk-time ratio, question count, filler words, etc.) — a real-time
approximation, distinct from the graded report you get at the end.

### Why a WebSocket instead of WebRTC

OpenAI's Realtime API connects the browser to the model over WebRTC (media tracks, SDP/ICE).
Gemini's Live API instead streams raw PCM audio as JSON/base64 frames over a WebSocket. That
protocol difference is the one place this migration had to touch frontend code — everything else
(all components, routing, styling, analytics UI, transcript UI, persona configuration) is
untouched. The hook's public contract stayed identical (`{ remoteStream, disconnect, toggleMic }`)
so nothing downstream — `CustomerStage`, `Avatar`, `Waveform`, `useAudioAnalyser` — needed to
change: playback audio is routed through a `MediaStreamAudioDestinationNode` so `remoteStream` is
still a real `MediaStream`, keeping the existing audio-reactive visuals working unmodified.

## Known limitations

- Voice requires a real `GEMINI_API_KEY` with Live API access in `backend/.env`. Without one,
  every other part of the app (browsing personas/scenarios, the UI, error handling) still works —
  starting a call will fail with a clear "GEMINI_API_KEY is not configured" message instead of a
  silent crash.
- Ephemeral auth tokens are a `v1alpha`-only Gemini API feature as of this writing; the SDK calls
  are pinned to that API version. If Google changes this surface, `backend/src/services/
  realtimeService.ts` and `frontend/src/hooks/useRealtimeSession.ts` are the two files to check.
- The `speakerState` (idle/listening/thinking/speaking) driving the avatar and orb animations is
  inferred from Gemini's transcription and turn-completion events, since the Live API doesn't
  expose a direct "user started talking" signal the way OpenAI's Realtime API does. It's a close
  approximation, not a 1:1 mapping.
- No database — session transcripts and coach reports live in memory and are lost on backend
  restart. This was an explicit scope decision for this build.
- `npm audit` flags moderate advisories in `react-router` (6.x) and `esbuild`/`vite` (dev-server
  only). Both are dev-time-only or require a major version bump to clear; left as-is for this
  build rather than risking a breaking upgrade — revisit before any real deployment.

## Scripts

| Location | Command | What it does |
| --- | --- | --- |
| `backend/` | `npm run dev` | Start the API with hot reload (tsx watch) |
| `backend/` | `npm run build` | Type-check and compile to `dist/` |
| `backend/` | `npm start` | Run the compiled server |
| `frontend/` | `npm run dev` | Start the Vite dev server |
| `frontend/` | `npm run build` | Type-check and build for production |
