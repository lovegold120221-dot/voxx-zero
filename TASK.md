## TASK-20260530-144500: Add Global Knowledge Base for Gemini Live

### START RECORD
- STATUS: COMPLETED
- Start time: 2026-05-30T14:45:00Z
- User request: Add a global knowledge base about Eburon AI (eburon.ai), Jo Lernout (Founder), and Master E / Emil Alvaro Serrano Danguilan (Chief Engineer), and ensure the Gemini Live model loads this context.
- Last known state: No TASK.md existed — project was in working state
- Preservation constraints: Do not alter VOICE_PERSONALITY_PROMPT, existing CSS/UI, auth flow, or any existing functionality. Minimal diff only.
- Files/directories to inspect: src/App.tsx
- Success criteria:
  - GLOBAL_KNOWLEDGE_BASE constant created with researched facts
  - Injected into the live session's systemInstruction
  - TypeScript compilation passes (`npm run lint`)

### TODO
- [x] Read TASK.md and understand project state
- [x] Research Eburon AI, Jo Lernout, Master E via web search
- [x] Read App.tsx to understand where Gemini Live context is loaded
- [x] Create the GLOBAL_KNOWLEDGE_BASE constant in App.tsx
- [x] Integrate GLOBAL_KNOWLEDGE_BASE into dynamicSystemInstruction
- [x] Verify build passes (`npm run lint` — passed with 0 errors)
- [x] Write final report in TASK.md

### FINAL REPORT
- STATUS: COMPLETED
- End time: 2026-05-30T14:55:00Z
- Files changed:
  - `src/App.tsx` — 2 insertions, 50 lines added total

#### Change 1: New `GLOBAL_KNOWLEDGE_BASE` constant (lines 476–523)
Placed right after `VOICE_PERSONALITY_PROMPT` constant. Contains thoroughly researched facts about:
- **Eburon AI** — sovereign voice intelligence platform, on-premise deployment, 120+ languages, SOC2/HIPAA, Eburon Pro Vision for Belgian govt, mission/values
- **Jo Lernout** — biographical details, L&H history (founding, NASDAQ peak, bankruptcy), current ventures (Bots R Here, Ariolas), awards, his "free up humans" philosophy
- **Master E (Emil Alvaro Serrano Danguilan)** — Chief Engineer, Aitek PH founder, GPH-Emilo LLM creator, GitHub/HuggingFace presence (MasterDee), technical focus on voice AI / multimodal / React/TypeScript / Electron

#### Change 2: Injection into `dynamicSystemInstruction` (line 2320)
`${GLOBAL_KNOWLEDGE_BASE}` added right after `${knowledgeBaseContext}`, so the global company knowledge is always present alongside any user-uploaded knowledge base files.

#### How it reaches Gemini Live
The `dynamicSystemInstruction` is passed as `systemInstruction` in the `live.connect()` call at line ~2541:
```ts
systemInstruction: dynamicSystemInstruction,
```
This means every session automatically includes all facts about Eburon, Jo Lernout, and Master E as permanent grounding context for the model. The AI can answer questions about the company's history, architecture, founders, and technical leadership with factual accuracy.

- Validation performed: `npm run lint` (tsc --noEmit) — passed with zero errors
- CSS/UI preservation: No CSS or UI files touched
- Real data/API credential check: All facts sourced from live web research (eburon.ai, Wikipedia, news articles, GitHub, Hugging Face, jo lernout's official site)
- Known issues: None
- Next step: The model now has permanent knowledge of Eburon AI and its leadership. No further changes needed.
