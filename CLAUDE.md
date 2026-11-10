# Claude Code Project Instructions

## Mission
Build KisanSetu Voice Saathi, a new standalone multilingual agricultural voice-and-chat assistant. The approved visual reference is `docs/reference/ui-reference.png`. Treat it as the visual source of truth.

## Non-negotiable constraints
1. Do not modify or import code from the user's older KisanSetu project unless explicitly instructed.
2. Match the supplied reference UI closely. Do not redesign it, change the palette, invent extra navigation, or add dashboard clutter without approval.
3. Build the UI first. Do not start broad backend implementation until the four primary views have been reviewed.
4. Never fake a live Gnani response. Clearly label fixtures/demo data and keep them out of production flows.
5. Never expose API keys in browser code, client-side environment variables, logs, screenshots, or Git.
6. Confirm current Gnani API documentation before implementing endpoints, headers, payloads, response parsing, model names, language codes, or audio constraints. Do not guess API contracts.
7. Do not use Gnani AI Agent Builder if the challenge terms exclude it. Implement orchestration in our own application.
8. Do not invent agricultural facts, citations, weather, scheme eligibility, or diagnoses. Use verified sources and disclose uncertainty.
9. Ask for clarification when a crop, symptom, location, or other critical detail is missing.
10. Keep changes focused, typed, tested, and documented.

## Working method
- Inspect the repository before editing.
- State a short plan for each substantial task.
- Implement in small phases.
- Run lint, type-check, tests, and build when available.
- Report exactly what was changed, what was tested, and what remains unverified.
- Do not claim a test passed unless it was actually run and passed.
- Avoid unnecessary dependencies and premature microservices.

## Product behaviour
- Support text chat and push-to-talk voice.
- Let users review and correct speech transcripts before sending.
- Show truthful states: recording, uploading, transcribing, generating, synthesizing, completed, and error.
- Keep text answers available if TTS fails.
- Save conversations only with clear user expectations and appropriate controls.
- Provide language selection for Marathi, Hindi, and English; verify each language against actual provider support before enabling it.

## Visual baseline
Palette:
- Primary green: #2E7D32
- Deep green: #1B5E20
- Accent orange: #F57F17
- Background: #F8FAF6
- Surface: #FFFFFF
- Primary text: #202820
- Secondary text: #657367

Typography:
- Noto Sans Devanagari for Marathi/Hindi.
- Inter for Latin text.

Use reusable components, accessible touch targets, responsive layouts, and consistent spacing/radii. Keep the mobile composition close to the supplied reference.
