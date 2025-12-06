- [ ] Working tree clean
- [ ] All checks passing
- [ ] Docs aligned with behavior
- [ ] Next prompt entry point identified

## Intro
- **Goal:** consolidate prompts 025-040 and stabilize the Workshop repo so future prompts can run predictably.
- **Scope:** cover work from prompts 025 through 040.
- **Rules:** do not discard work without justification, prefer new commits instead of rewriting history, keep the working tree clean by the end, ensure `npm run check:assets`, `npm run lint`, `npm run build`, and `npm test` all pass.

## Current state snapshot
- **Current branch:** `prompt-025`.
- **Staged files:** none.
- **Modified files (unstaged):** large set including `app/src/*` (pages, runtime, AI, stores) plus config, docs, `package.json`, etc. (see git status for details).
- **Untracked files/directories:** `.github/`, `RELEASE_NOTES.md`, numerous new app/src directories (data, domain, pages, runtime/ai/__tests__, etc.), docs additions (`docs/AI_*`, `docs/user/`, etc.), public asset files, `codex_prompt_031.json` through `codex_prompt_041.md`.
- **Prompts clearly applied:** prompts 025-040 appear to have added new pages (AdultInsights, Diagnostics, etc.), AI persona changes, telemetry stores, docs additions, and tooling updates. No obvious gaps yet.
- **Untracked artifacts:** Most untracked directories (new UI pages, docs, stores) resemble real features; no temporary artifacts detected yet.

### Step 1 – Self evaluation
- Listed branch/staged/unstaged/untracked categories; will refine specifics later.
- Uncertain if every untracked doc belongs to production vs notes; will revisit during classification.

## Branching for consolidation
- **Source branch:** `prompt-025`
- **Consolidation branch:** `prompt-041-consolidation` (active now)

### Step 2 – Self evaluation
- Branch transition was clean with no conflicts or errors.

## Change classification
- **Core Workshop code and UI:** `app/src/pages/AdultInsightsPage.tsx`, `DiagnosticsPage.tsx`, `ProfileSelectionPage.tsx`, `ProjectSelectionPage.tsx`, plus runtime updates (`runtime/ai`, `runtime/store`, `runtime/hooks/useProfiles`, new `app/src/domain` modules, `app/src/index.html`, `App.tsx`, `components/NavOverlay.tsx`, `styles`, etc.).
- **Documentation:** `docs/AI_BEHAVIOR_AND_SAFETY.md`, `docs/AI_PERSONAS_SPEC.md`, `docs/ARCHITECTURE_OVERVIEW.md`, `docs/STATION_INTEGRATION_SPEC.md`, `docs/user/*`, `docs/PROJECT_PLAN_FULL.md`, `docs/WORKSHOP_ATLAS.md`, etc. (wide doc expansion in this prompt range).
- **Tooling and CI:** `.github/`, `package.json`, `package-lock.json`, `app/vite.config.ts`, `app/vitest.config.ts`, `scripts/check-assets.js`, telemetry/AI tests, `app/src/runtime/llm` adjustments.
- **Temporary/scratch artifacts:** `codex_prompt_031.json` through `codex_prompt_041.md`, `RELEASE_NOTES.md`, `public/assets/logo-*`, `public/service-worker.js` (likely assets or generated), untracked `app/src/data/`.

### Step 3 – Self evaluation
- Need to verify which `docs/user/*` are final vs drafts before consolidating.
- Some untracked runtime folders (e.g., `runtime/export`, `runtime/offline`) may be under development; will confirm before committing.

## Consolidation strategy for prompts 025 to 040
- **Group A (Prompt 025-027):** AI persona foundation, telemetry, profile prefs. Key files: `app/src/runtime/ai/*`, `app/src/runtime/store/profileStore.ts`, `telemetryStore.ts`, `preferencesContext.tsx`, `useProfiles.ts`, related tests (`runtime/ai/__tests__`, `runtime/store/__tests__`). Many files currently tracked or staged; include them in the first commit.
- **Group B (Prompt 028-034):** Feature pages and diagnostics/tools. Key files: `app/src/pages/DiagnosticsPage.tsx`, `ProfileSelectionPage.tsx`, `ProjectSelectionPage.tsx`, `SettingsPage.tsx`, `NavOverlay.tsx`, `docs/*` describing stations/user guides. These files already exist as tracked modifications or new files.
- **Group C (Prompt 035-040):** Adult insights, asset manifest, docs, export helpers. Key files: `app/src/pages/AdultInsightsPage.tsx`, `docs/AI_*`, `docs/user/*`, `.github/workflows/assets-check.yml`, `scripts/check-assets.js`, `public/assets/*`. Some remain untracked but align with features; stage them later.

### Step 4 – Self evaluation
- Work appears grouped by functionality, but need to confirm doc duplication across prompts.
- Unsure whether `docs/user/` subfolders all belong to final product vs notes; will review before final commits.
