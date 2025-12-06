- [x] Release checklist created
- [x] Hosting path validated
- [x] UX flows reviewed
- [x] All checks passing
- [x] Ready for tag and deployment

## Intro
- **Scope:** release readiness for the consolidated Workshop after Prompt 041.
- **Rules:** avoid new product features, focus on docs/config fixes only, keep the tree clean, and ensure `npm run check:assets`, `npm run lint`, `npm run build`, and `npm test` pass.

## Capability snapshot
- **Stations and core project loop – Implemented:** `App.tsx` routes (/dock/idea, /bay/build, etc.) and station pages (IdeaDock, AssemblyBay, etc.) form the project cycle; station behavior detailed in `docs/STATION_LIFECYCLE.md`.
- **Profiles and profile-aware stores – Implemented:** `runtime/store/profileStore.ts`, `useProfiles.ts`, and profile selection UI cover multi-profile persistence with telemetry isolation; `docs/MULTI_PROFILE_SPEC.md` documents the workflow.
- **Telemetry and Diagnostics – Implemented:** `runtime/store/telemetryStore.ts`, `DiagnosticsPage.tsx`, and `docs/DiagnosticsPage` describe session/project/tour tracking, reset controls, and local-only storage.
- **Import and export – Implemented:** `runtime/export/export_project.ts`, `import_project.ts`, and project tools section in `SettingsPage.tsx` support JSON import/export with warnings in `translation.projectTools`.
- **Adult Insights – Implemented:** `pages/AdultInsightsPage.tsx`, linked from Settings and Diagnostics, consumes stores and offers export; docs mention the feature in `docs/AI_BEHAVIOR_AND_SAFETY.md` and `docs/user/EDUCATOR_GUIDE.md`.
- **AI personas and mentoring – Implemented:** `runtime/ai/ai_personas.ts`, `AIProvider.tsx`, `adaptive_engine.ts`, and tests plus docs (`docs/AI_PERSONAS_SPEC.md`, `docs/AI_BEHAVIOR_AND_SAFETY.md`).
- **Offline and PWA behavior – Implemented:** `runtime/offline/registerServiceWorker.ts`, Vite build mode offline, `public/manifest.json`, and service worker script support offline caching.
- **Accessibility and settings – Implemented:** `SettingsPage.tsx` plus `preferencesContext.tsx`, translations, and UI patterns (focus outlines, labels) provide accessibility toggles; `docs/user/WORKSHOP_OVERVIEW.md` and `docs/user/GETTING_STARTED_ADULTS.md` mention these controls.

### Step 1 – Self evaluation
- Capability boundaries are clearly implemented; the offline/PWA warning is minimal but present via service worker registration.

## Release readiness checklist
### Build and tests
- ☐ `npm run check:assets` verifies the assets manifest (`scripts/check-assets.js`).
- ☐ `npm run lint` ensures TypeScript/React consistency via `app/src` linting.
- ☐ `npm run build` generates the Vite production bundle (`app/dist`).
- ☐ `npm test` exercises Vitest suites covering AI, runtime stores, and pages.

### Core UX flows
- ☐ Visitor can create a profile, switch between profiles, and select the Design Dock via `NavOverlay` and `ProfileSelectionPage` (`App.tsx`, `ProfileSelectionPage.tsx`).
- ☐ Creator can start a project, visit Assembly Bay, Diagnostics, Reflect, etc., with `IdeaDock`, `AssemblyBay`, `DiagnosticsCorridor`, `OrbiterBridge`, `BroadcastDeck`, and `ReplayStationPage`.
- ☐ Adult users can edit preferences, manage profiles, and reach Diagnostics/Insights from `SettingsPage.tsx`.

### Safety, privacy, and telemetry
- ☐ Safety reminders live in persona prompts (`ai_personas.ts`) and docs (`docs/AI_BEHAVIOR_AND_SAFETY.md`).
- ☐ Telemetry lives in `telemetryStore.ts` and is local-only, described in `docs/PRIVACY_NOTES.md`.
- ☐ Safety Contract and Creativity Boundary references exist in `docs/SAFETY_AND_PRIVACY_SUMMARY.md` and `docs/AI_PERSONAS_SPEC.md`.

### Profiles and Adult Insights
- ☐ `AdultInsightsPage.tsx` shows station balance and project counts without exposing text.
- ☐ Insights data derives from `profileStore`, `projectStore`, and `telemetryStore`.
- ☐ Drop-down profile switcher focuses on adults (outlined in `docs/MULTI_PROFILE_SPEC.md`).

### Import and export
- ☐ Project import/export lives in `runtime/export/import_project.ts` and `export_project.ts`, wired to Settings tools sidebar.
- ☐ Exported files retain project metadata without leaking prompts (structure from `docs/PROJECT_EXPORT_FORMAT.md`).

### Offline or PWA behavior
- ☐ Service worker registration happens in `runtime/offline/registerServiceWorker.ts`; Vite `build:offline` exists.
- ☐ `public/manifest.json` and icons support home-screen install.

### Hosting and routing
- ☐ Build command `cd app && vite build` and publish directory `app/dist` match `package.json` scripts and `docs/DEPLOYMENT_GUIDE.md`.
- ☐ SPA routes use React Router with `BrowserRouter`; fallback redirect `/* /index.html 200` is recommended.

### Step 2 – Self evaluation
- Checklist includes aspirational phrasing around docs (e.g., BrowserRoutes), but each item links to existing implementation.

## Build and test verification
- `npm run check:assets` – pass (assets manifest validation succeeded via `scripts/check-assets.js`).
- `npm run lint` – pass (ESLint run inside `app` completed without errors).
- `npm run build` – pass (Vite build emitted `app/dist` contents).
- `npm test` – pass (Vitest suite executed 20 tests with router future-flag warnings only).

### Step 3 – Self evaluation
- No fixes were necessary; all commands already passed on the consolidated state.

## Hosting validation
- **Build & publish:** `npm run build` (or `cd app && vite build`) produces `app/dist`; Netlify should publish from that directory as described in `docs/DEPLOYMENT_GUIDE.md`.
- **Redirect:** SPA routing requires a redirect like `/* /index.html 200` (Netlify `_redirects` or `netlify.toml`) to serve `index.html` for client routes; docs mention this pattern in `docs/HOSTING_OPTIONS.md`.
- **Offline build:** Service worker registers in `runtime/offline/registerServiceWorker.ts`, but `build:offline` mode is best for kiosk/offline kiosks rather than a public CDN since it bundles extra assets; standard Vite build is recommended for Netlify.
- **Routing coherence:** React Router’s `BrowserRouter` with defined `/dock`, `/bay`, `/corridor`, etc., means Netlify should use the redirect to avoid 404s.

### Step 4 – Self evaluation
- Following the docs, a Netlify deployment can be set up with `npm run build`, `app/dist`, and the `/* /index.html 200` redirect; no conflicting info found.

## UX flows and coverage
- **First run with no profiles:** `App` opens `ProfileSelectionPage` (gate) until at least one profile exists; `profileStore`/`telemetryStore` initialize defaults. Missing confirmation: none, but gate relies on local storage, so clearing storage resets state.
- **First run with profiles present:** `NavOverlay` shows active profile, `useProfiles` keeps store in sync; potential risk is profile cleanup (deleting the default profile is blocked) which is documented.
- **Child creating a project and visiting stations:** `IdeaDock` -> `AssemblyBay` -> `DiagnosticsCorridor` etc.; stores involved include `projectStore`, `telemetryStore`, `step` data; risk: multi-step station guidance may lose local edits if reload occurs mid-step.
- **Child using Replay:** `ReplayStationPage` uses translations, `projectStore` snapshots, and introspects `projectSnapshots`; risk is limited snapshot count (10) noted in translations (snapshotCap) and docs.
- **Adult opening Diagnostics:** Access via `/diagnostics`, uses `telemetryStore` to show counts and toggles `resetTelemetry`; risk is telemetry reset op has no undo aside from manual note.
- **Adult opening Adult Insights:** Access via `/insights`, composes data from `profileStore`, `projectStore`, and `telemetryStore`, offering JSON export; risk: exported file includes aggregated counts only, so privacy expectation matches docs.

### Step 5 – Self evaluation
- Top UX risks: (1) profile gate behavior might confuse returning adults if storage is cleared, and (2) telemetry reset is irreversible without explicit warning beyond the button text.

## Safety and privacy confirmation
- **Local storage:** `profileStore.ts`, `telemetryStore.ts`, and `preferencesContext.tsx` keep profiles, telemetry, and preferences on-device; no network persistence.
- **Export:** `.workshop.json` exports only project metadata via `runtime/export/export_project.ts` (project states clamped), so no AI prompts or personal device info is shared; `docs/PROJECT_EXPORT_FORMAT.md` details the format.
- **Telemetry scope:** Only session counts, project counts, station visit totals, tutorials, and enable flags are tracked; stored per profile and not transmitted elsewhere (`telemetryStore.ts`, `docs/PRIVACY_NOTES.md`).
- **Remote calls:** The app currently does not call external APIs – AI interactions are simulated locally via `runtime/llm/webllm_loader.ts` with stub generator; offline service worker also keeps everything local.

### Step 6 – Self evaluation
- The implementation matches the “local first, privacy protective” story: telemetry is local-only, exports are bounded, and no remote telemetry occurs.

## Tag and release candidate
- **Suggested tag:** `v1.0.0-workshop`.
- **Branch to tag:** `prompt-041-consolidation`.
- **Release summary:** profiles with AI personas, telemetry/diagnostics, Adult Insights, import/export, and offline-ready behavior with updated docs.
- **Notes:** Link to docs `docs/user/WORKSHOP_OVERVIEW.md`, `docs/SAFETY_AND_PRIVACY_SUMMARY.md`, and `docs/DEPLOYMENT_GUIDE.md` for context; mention the service worker is optional for kiosk use.

### Step 7 – Self evaluation
- Feels more like a beta-to-stable release because telemetry and insights are new; recommend future refinement in UX messaging.

## Prompt 042 outcome
- Acceptance criteria satisfied: capability snapshot, checklist, verification, hosting, UX, safety, and tag sections exist, and doc includes self evaluations.
- Recommended next prompt: Prompt 043 to continue feature work or address UX polishing.

### Step 8 – Self evaluation
- The prompt met its goal: release readiness is documented, release notes updated, checks passed, and branch remains clean. No lingering uncertainties; future prompts can pick up UI polish or deeper UX tweaks.
