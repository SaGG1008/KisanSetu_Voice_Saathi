# KisanSetu Voice Saathi

A new, independent, multilingual, voice-first agricultural AI assistant inspired by the farmer-focused theme of the original KisanSetu project.

## Product summary
Farmers can ask agricultural questions by typing or speaking in Marathi, Hindi, or English. The application transcribes speech using an eligible Gnani AI speech API, sends the question to a reasoning and agricultural-knowledge workflow, and can read the answer aloud using Gnani AI text-to-speech.

## Development principles
- Treat `docs/reference/ui-reference.png` as the approved visual baseline.
- Reproduce the reference UI before expanding the feature set.
- Use real API responses in live functionality; never present mock data as live AI output.
- Keep provider credentials on the server.
- Ground consequential agricultural guidance in reliable sources and communicate uncertainty.
- Keep the first release small: chat, push-to-talk voice, transcript review, spoken response, and conversation history.

## Documentation
- `docs/PRD.md` — product requirements
- `docs/TRD.md` — technical design
- `docs/UI_UX.md` — visual and interaction specification
- `docs/ARCHITECTURE.md` — system architecture and data flow
- `docs/DEVELOPMENT_PLAN.md` — implementation sequence and acceptance checks
- `CLAUDE.md` — instructions for Claude Code

## Initial setup
1. Confirm the supported Gnani API products, credentials, request format, languages, audio limits, and current terms in the official developer documentation.
2. Copy `.env.example` to `.env.local` and fill in only credentials actually issued to your account.
3. Implement the UI against clearly labelled local fixtures if API access is not yet available.
4. Replace fixtures with live integrations and verify using real API calls before claiming completion.

## Important
This repository is independent of the previous KisanSetu project. Do not copy or modify that project without an explicit decision and review.
