# Product Requirements Document (PRD)
## KisanSetu Voice Saathi

**Status:** Draft for development  
**Product type:** Mobile-first web application  
**Primary users:** Indian farmers seeking accessible agricultural information

## 1. Problem
Farmers may find it difficult to type detailed questions, navigate complex apps, or access agricultural information in a language they are comfortable using. A voice-first conversational interface can reduce these barriers, provided that responses are understandable, grounded, and appropriately cautious.

## 2. Product vision
A simple agricultural assistant where a farmer can type or speak a question in a supported language, review what the system understood, and receive a clear text answer with optional spoken playback.

## 3. Goals
- Make agricultural Q&A accessible through text and voice.
- Provide Marathi, Hindi, and English UI/content where supported and tested.
- Integrate at least one genuine Gnani AI model/API for the challenge entry, subject to current official terms and account access.
- Make speech transcription reviewable and correctable.
- Present concise, source-grounded agricultural information.
- Preserve conversation history with user control.

## 4. Non-goals for the first release
- Autonomous diagnosis or guaranteed crop-disease identification.
- Automatic pesticide prescriptions or dosage recommendations.
- Government service submission or official complaint filing.
- Live weather unless a verified provider and location consent flow are implemented.
- Image diagnosis, marketplace, payments, IoT, or complex farm-management features.
- Continuous always-on listening. Use push-to-talk for the MVP.

## 5. Target user journey
1. User opens the app and chooses a language.
2. User starts a new chat or taps the microphone.
3. User records a short question.
4. App transcribes the recording through the configured speech API.
5. User reviews and edits the transcript.
6. User sends the question.
7. The assistant retrieves relevant approved agricultural information and generates a response.
8. App displays the answer and offers audio playback when TTS is configured.
9. User can ask a follow-up or save/delete the conversation.

## 6. MVP requirements
### P0 — required
- Responsive home/chat experience matching approved reference.
- Text question input and conversation display.
- Push-to-talk recording with permission/error handling.
- Server-side speech-to-text integration with a Gnani API, after contract verification.
- Transcript review/edit/confirm.
- Reasoning workflow with a small curated agricultural knowledge source.
- Answer display with source attribution where available.
- Honest uncertainty and clarification behaviour.
- Conversation persistence or a clearly documented local-only history implementation.
- Secure server-side credential handling.
- Loading, empty, error, retry, and offline/network states.

### P1 — desirable
- Text-to-speech playback through Gnani Timbre if available to the account and suitable for the selected languages.
- Language-specific response preference.
- Search and delete conversation history.
- Feedback controls.
- Accessibility refinements and performance testing.

### P2 — later
- Weather integration.
- Image-based crop support.
- Additional regional languages.
- Personalised crop/region profile, only with consent and clear data controls.

## 7. Safety and trust requirements
- Do not present generated output as an official agricultural recommendation.
- Prefer curated sources from agricultural universities, ICAR, KVKs, and relevant government publications.
- Display source name and link when retrieved.
- If evidence is insufficient, say so and ask for missing details.
- Avoid definitive diagnosis from symptoms alone.
- Do not recommend pesticide products, dosages, or application schedules without authoritative, crop- and region-specific source support.
- Encourage local agricultural expert/KVK consultation for severe or uncertain cases.
- Do not fabricate weather, scheme details, prices, or eligibility.

## 8. Success criteria
- A user can complete a text Q&A interaction end-to-end.
- A user can record speech, receive a real transcript, correct it, and submit it.
- The assistant can return a grounded answer or ask a relevant clarification.
- TTS playback works when enabled; text remains usable if it fails.
- No API secret is exposed to the browser or repository.
- Primary screens are usable on a typical mobile viewport.
- A test report records supported languages, tested audio conditions, API failures, and known limitations.

## 9. Challenge compliance note
The project must follow the current official challenge terms. Confirm the exact required Gnani model/API usage, prohibited tools, submission fields, attribution, and disclosure rules from the official programme pages before final submission. Do not assume a third-party tool is approved merely because it is technically usable.
