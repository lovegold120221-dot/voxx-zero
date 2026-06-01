## TASK-20260601-220000: Unify Output Handling via Supabase

### START RECORD
- STATUS: STARTED
- Start time: 2026-06-01T22:00:00Z
- User request: Unify output handler to use Supabase as the single source of truth, removing dynamic client-side rendering of tool outputs.
- Preservation constraints: Preserve existing CSS/UI/functions, no raw JSON output, use user-facing words only.
- Success criteria:
  - All tool outputs are saved to a `tool_outputs` table in Supabase.
  - The UI (Viewing Port) only renders saved data from Supabase.
  - No client-side dynamic generation of HTML/JSON in BeatriceAgent.tsx.

### TODO
- [ ] Define `tool_outputs` Supabase table schema
- [ ] Implement `saveToolResult` helper in Supabase client
- [ ] Refactor `BeatriceAgent.tsx` to save tool results to Supabase
- [ ] Refactor `DocumentViewer` to act as a stateless viewing port fetching from Supabase
- [ ] Verify no raw JSON or developer terminology in UI

### FINAL REPORT
- STATUS: PENDING

