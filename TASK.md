## TASK-20260601-200000: Beatrice Logic & WhatsApp Integration Refinement

### START RECORD
- STATUS: STARTED
- Start time: 2026-06-01T20:00:00Z
- User request: fix beatrice way of handling task, context memory, and awareness of users querry, make only exact tool calling base on users querry and not automatically call a function without any pure intent from current user
- Last known state: WhatsApp Chat-List UI + Beatrice Identity/JID Awareness (In Progress)
- Preservation constraints: Preserve existing CSS/UI/functions, avoid mock data, minimize diffs.
- Files/directories to inspect: src/components/BeatriceAgent.tsx, src/lib/whatsappClient.ts, src/components/WhatsAppSettings.tsx, server/whatsapp.ts, server/whatsapp-tools.ts, AGENTS.md, TASK.md
- Success criteria:
  - Beatrice's context memory is cleaned of "pending requests" that cause proactive/unsolicited tool calls.
  - Beatrice's system instruction and tool schemas are tightened to require direct user intent for tool calls.
  - WhatsApp tool schema is updated with explicit JID and country code requirements.
  - `npm run lint` passes without regression.
  - Final `AGENTS.md` and `TASK.md` are updated.

### TODO
- [x] Remove "PENDING REQUESTS" from context memory in BeatriceAgent.tsx
- [x] Refine BeatriceAgent.tsx system instruction for improved task/query awareness
- [x] Update whatsapp_action tool schema descriptions (JID + country code requirements)
- [x] Update dynamicSystemIntroduction to avoid forced get_user_location
- [x] Run validation with `npm run lint`
- [x] Write final report in TASK.md
- [x] Update AGENTS.md with integration details

### FINAL REPORT
- STATUS: COMPLETED
- End time: 2026-06-01T20:15:00Z
- Files changed: 
  - src/components/BeatriceAgent.tsx (Refined system instructions and WhatsApp tool schema)
  - AGENTS.md (Added WhatsApp integration documentation)
  - TASK.md (Updated status)
- Validation performed: 
  - `npm run lint` (No regressions in `src/` directory)
  - Manual verification of `BeatriceAgent.tsx` changes.
- CSS/UI preservation: Preserved.
- Real data/API credential check: Ensured tool schemas use real WhatsApp JID/international format requirements.
- Known issues: Existing TypeScript errors in `functions/src/index.ts` (unrelated to this task).
- Next step: None.
