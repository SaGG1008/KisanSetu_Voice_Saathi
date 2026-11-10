# Development Plan and Acceptance Checklist
## KisanSetu Voice Saathi

## Phase 0 — Verify prerequisites
- [ ] Read current Gnani developer docs.
- [ ] Confirm account access, API key, product/model availability, supported languages, audio formats/limits, pricing/credits, and exact request/response schemas.
- [ ] Confirm challenge terms and any excluded tools.
- [ ] Keep credentials out of source control.

## Phase 1 — UI reproduction
- [ ] Inspect `docs/reference/ui-reference.png`.
- [ ] Implement design tokens and fonts.
- [ ] Build Home screen.
- [ ] Build Voice Assistant screen and states.
- [ ] Build Chat screen.
- [ ] Build Features/History/Profile screen.
- [ ] Implement navigation.
- [ ] Compare screenshots at matching viewport sizes.
- [ ] Review UI before backend expansion.

## Phase 2 — Text chat foundation
- [ ] Implement message composer and conversation state.
- [ ] Add server-side reasoning provider adapter.
- [ ] Add curated knowledge retrieval.
- [ ] Return sources and clarification state.
- [ ] Validate output and error handling.

## Phase 3 — Voice input
- [ ] Implement push-to-talk recording.
- [ ] Validate file type/size/duration.
- [ ] Implement server-side Gnani speech adapter from verified docs.
- [ ] Show transcript.
- [ ] Allow transcript correction.
- [ ] Test Marathi, Hindi, English only where provider support is confirmed.

## Phase 4 — Voice output
- [ ] Implement Gnani TTS adapter if available.
- [ ] Add play/pause/loading/error states.
- [ ] Ensure text answer remains available if audio fails.

## Phase 5 — History and hardening
- [ ] Persist conversations.
- [ ] Add delete controls.
- [ ] Test mobile and desktop.
- [ ] Test API failure, timeout, malformed response, denied microphone, and network loss.
- [ ] Run lint, type-check, unit tests, and production build.
- [ ] Prepare truthful demo and integration evidence.

## Definition of done
The MVP is complete only when a user can submit a text question and a voice question, review the real transcript, receive a grounded answer, optionally hear it, and revisit/delete the conversation. Any unimplemented or unverified capability must be documented honestly.
