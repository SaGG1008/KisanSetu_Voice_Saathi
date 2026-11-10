# Technical Requirements Document (TRD)
## KisanSetu Voice Saathi

## 1. Proposed stack
- Frontend: Next.js App Router, React, TypeScript
- Styling: Tailwind CSS
- Validation: Zod
- Icons: Lucide React
- Database: SQLite for a single-instance prototype; PostgreSQL if deployment/concurrency requires it
- ORM: Prisma or Drizzle (choose one; do not install both without reason)
- Speech: Gnani API selected after account/API documentation verification
- Reasoning: configurable LLM provider behind a server-side adapter
- Retrieval: curated documents with keyword search initially; vector retrieval only if justified
- Testing: Vitest/Jest for unit tests, Playwright for key UI flows

## 2. Architectural rules
- Use a modular monolith, not microservices, for the MVP.
- Keep provider-specific code behind adapters.
- Keep all provider API calls server-side.
- Keep UI components independent of provider response shapes.
- Validate all external responses before using them.
- Add request IDs and structured error codes.
- Use timeouts, upload size limits, MIME validation, and rate limiting where practical.

## 3. Suggested modules
- `components/chat/` — messages, composer, conversation list
- `components/voice/` — recorder, waveform, recording state
- `components/layout/` — header, navigation, page shell
- `lib/ai/` — orchestrator and provider interfaces
- `lib/providers/gnani/` — Prisma/Timbre adapters
- `lib/knowledge/` — document retrieval and source metadata
- `lib/safety/` — response checks and refusal/clarification policies
- `lib/db/` — database client and repositories
- `app/api/voice/transcribe/route.ts` — audio transcription
- `app/api/assistant/chat/route.ts` — question answering
- `app/api/voice/synthesize/route.ts` — optional TTS
- `app/api/conversations/route.ts` — history operations

## 4. API contract principles
The exact Gnani endpoint, headers, request body, supported formats, duration limits, language codes, model identifiers, and response schema must be taken from the current official documentation and verified with a real request. Do not hard-code assumptions from old examples.

Internal application contracts may use:
- `POST /api/voice/transcribe` — multipart audio, returns transcript + detected/selected language + request ID.
- `POST /api/assistant/chat` — conversation ID + user text + language, returns assistant text + source list + clarification flag.
- `POST /api/voice/synthesize` — text + language, returns audio stream or a safe playback URL.
- `GET /api/conversations` — list the current user's conversations.
- `GET /api/conversations/:id` — fetch one conversation.
- `DELETE /api/conversations/:id` — delete a conversation.

These are application routes, not Gnani endpoints.

## 5. Data model (minimum)
### Conversation
- id
- title
- preferredLanguage
- createdAt
- updatedAt

### Message
- id
- conversationId
- role (`user` or `assistant`)
- text
- inputMode (`text` or `voice`)
- createdAt
- optional transcript metadata

### SourceDocument
- id
- title
- publisher
- url
- language
- crop/topic tags
- content or indexed chunks
- reviewedAt

Do not persist raw audio by default. If audio retention is introduced, obtain clear consent, set retention rules, and provide deletion controls.

## 6. Security
- Store secrets only in server-side environment variables.
- Never use `NEXT_PUBLIC_` for private API credentials.
- Exclude `.env*` from Git except `.env.example`.
- Validate file type, size, and duration where possible.
- Apply rate limiting to expensive endpoints.
- Avoid logging audio, transcripts, or personal data unnecessarily.
- Use secure session/authentication before storing personal histories for multiple users.
- Sanitize rendered content and validate structured model output.

## 7. Reliability
- Distinguish transcription, reasoning, retrieval, and TTS errors.
- Do not silently fall back to fabricated text.
- If TTS fails, retain the text answer.
- If retrieval returns no reliable source, state the limitation and ask for details or suggest an expert.
- Provide retry actions without duplicating messages.
