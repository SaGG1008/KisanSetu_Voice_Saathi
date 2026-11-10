# System Architecture
## KisanSetu Voice Saathi

## 1. Logical flow

```text
Mobile-first web UI
  ├─ Text composer
  └─ Push-to-talk recorder
          |
          v
Next.js server API
  ├─ Request validation
  ├─ Session/conversation management
  └─ Orchestrator
       |
       ├─ Speech adapter (Gnani Prisma, after API verification)
       |      └─ transcript returned for user review
       |
       ├─ Knowledge retrieval
       |      └─ curated agricultural references
       |
       ├─ Reasoning provider adapter
       |      └─ answer or clarification
       |
       ├─ Safety/source validation
       |
       └─ Speech synthesis adapter (Gnani Timbre, optional)
              |
              v
        Text answer + optional audio
              |
              v
        Conversation storage
```

## 2. Important separation
- Coding agent (Claude Code) is a development tool; it is not part of the deployed product.
- Gnani speech APIs provide speech capabilities; they are not the whole agricultural reasoning system.
- The reasoning model and retrieval layer must be explicitly configured and documented.
- The application implements its own orchestration. Do not use a challenge-excluded Agent Builder.

## 3. Request lifecycle
1. User submits text or records audio.
2. For audio, server validates upload and calls the configured speech provider.
3. Transcript is shown to the user for correction/confirmation.
4. Confirmed question is sent to the orchestrator.
5. Orchestrator classifies intent and retrieves relevant approved content.
6. Reasoning provider generates a concise response with source references or asks for clarification.
7. Safety checks validate response structure and source grounding.
8. Text response is returned and stored.
9. If requested and configured, TTS generates audio; TTS failure does not remove the text answer.

## 4. Provider abstraction
Define interfaces such as:
- `SpeechToTextProvider.transcribe(audio, language)`
- `TextToSpeechProvider.synthesize(text, language)`
- `ReasoningProvider.generate(messages, context)`
- `KnowledgeRetriever.search(query, filters)`

Provider adapters must map the verified external API contract into stable internal types.
