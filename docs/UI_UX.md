# UI/UX Specification
## KisanSetu Voice Saathi

**Visual authority:** `docs/reference/ui-reference.png`  
**Rule:** Match the supplied reference closely. This document supplements the image; it does not authorise redesign.

## 1. Visual direction
Modern, approachable agricultural assistant: warm off-white canvas, deep/natural greens, restrained harvest-orange accents, rounded white cards, generous whitespace, readable typography.

## 2. Design tokens
- Primary: `#2E7D32`
- Deep green: `#1B5E20`
- Accent orange: `#F57F17`
- Background: `#F8FAF6`
- Surface: `#FFFFFF`
- Main text: `#202820`
- Secondary text: `#657367`
- Font: Noto Sans Devanagari for Marathi/Hindi; Inter for Latin text
- Card radius: consistent rounded corners, visually matched to reference
- Shadows: subtle; avoid heavy elevation and glassmorphism

## 3. Primary screens
### Home
- Brand/header and visible language selector.
- Friendly farmer greeting and concise assistant description.
- Primary voice assistant entry point with prominent microphone.
- Chat/text entry point.
- Agricultural shortcuts shown in the reference.
- Bottom navigation consistent with reference.

### Voice assistant
- Back navigation and assistant title.
- Large central microphone with concentric rings.
- Waveform tied to actual audio input where feasible.
- Recording timer and clear stop/cancel controls.
- Explicit permission, recording, upload, transcribing, success, and error states.
- Text alternative.

### Chat
- User and assistant message bubbles.
- Clear composer with text and microphone controls.
- Agricultural answer presented in readable sections.
- Audio playback control when TTS is available.
- Sources/cautions where relevant.
- Follow-up interaction and accessible feedback controls.

### Features/history/profile
- Match the reference's features/history composition.
- Clearly distinguish static information from live services.
- Do not show live weather or government scheme status unless a real source is integrated.

## 4. Interaction rules
- Minimum touch target: 48x48 CSS px; primary microphone preferably larger.
- Never rely on colour alone to communicate status.
- Keep language switching visible.
- Preserve text access when audio is unavailable.
- Let users edit transcripts before submission.
- Use simple labels and icons together.
- Avoid dense tables and technical terminology in farmer-facing screens.

## 5. Responsive behaviour
- Mobile-first, matching the proportions of the supplied reference.
- On desktop, use a centred app shell with a sensible max-width; do not stretch phone UI edge-to-edge.
- Test narrow Android widths, larger phones, and desktop.
- Ensure Marathi/Hindi text wraps correctly and controls do not overflow.

## 6. Visual QA
Compare implementation screenshots against the reference at matching viewport sizes. Check hierarchy, spacing, card dimensions, typography, colours, icon placement, and bottom navigation. Record visible mismatches and correct them before adding backend features.
