# Architecture Overview

The Workshop organizes contributors around layered modules so creative logic, safety checks, and UI navigation remain predictable and localized.

## Module map

- **Domain (`app/src/domain/`)** – Defines the canonical data shapes (`Project`, `Step`, `Reflection`, `TelemetryState`, `Template`, `Theme`, etc.) along with clamps that enforce the creativity boundaries described in `docs/CREATIVITY_BOUNDARY_SPEC.md`.
- **Data (`app/src/data/`)** – Hosts the built-in template registry (`templates_builtin.ts`), image manifests, and any static payloads that the preview or pipeline pages consume.
- **Runtime (`app/src/runtime/`)** – Powers persistence, AI, templates, telemetry, exports, and offline helpers:
  - `store/` contains the caches (`projectStore`, `telemetryStore`, `tutorialStore`, `themeStore`, etc.) and keeps localStorage synchronized via shared helpers (`persistProject`, `getProjectsFromStorage`, etc.).
  - `hooks/` expose the stores to React through `useProjects`, `useTutorial`, `useLLMSettings`, and other subscribers that rely on `useSyncExternalStore`.
  - `ai/`, `llm/`, and `templates/` orchestrate creative assistance: `AIProvider` wraps `webllm_loader`, which respects settings from `llmSettingsStore` and `model_config`, scrubs tokens, and enforces system prompts aligned with SafetyContract rules.
  - `export/` and `runtime/export/` implement project export/import flows that reuse the domain models without leaking internal IDs.
  - `telemetry/` manages device-only metrics surfaced by `DiagnosticsPage.tsx`, while `offline/` registers the service worker when the `offline` build runs.
- **UI surface (`app/src/pages/`, `components/`, `ui/`, `styles/`)** – Contains the main screens (`ProjectSelectionPage`, `IdeaDock.tsx`, `DiagnosticsPage.tsx`, etc.), navigation chrome (`NavOverlay`, `TopBar`), and presentation helpers that rely on `useTranslation`.
- **Public assets (`public/`, `public/assets/`)** – Supply the PWA manifest, service worker, icons, and the asset manifest consumed by `scripts/check-assets.js`.
- **Scripts & docs (`scripts/`, `docs/`)** – Utility scripts (asset checks, template appliation validators) and documentation collections (Safety Contract, Deployment, Accessibility, Extension Points) keep contributors aligned on expectations.

## Data flow

1. **User interaction** – The router (`app/src/App.tsx`) renders the appropriate Station page (e.g., `IdeaDock` at `/dock/idea` or `OrbiterBridge` at `/bridge/reflect`) based on nav clicks captured by `NavOverlay`.
2. **Store updates** – Station components call hooks such as `useProjects()` or `useTranslation()`; `useProjects` reads from `projectStore`, and write helpers (`registerProject`, `updateProject`, `applyTemplate`) clamp data before persisting via `localStorage`.
3. **AI assistance** – When a component needs language assistance, it uses `useAI()` from `AIProvider`. `AIProvider` loads the model via `loadModel` in `webllm_loader.ts`, which consults `model_config.ts`, applies `calculateTokenCap`, and tags/filters output before streaming it back to the UI.
4. **Feedback loop** – Stores push updates through subscriptions so every Station, overlay, and diagnostics view renders the newest state. Telemetry hooks also increment counters (`telemetryStore`) when events such as station visits or template creation occur.
5. **Offline & export** – The offline service worker caches shell assets in `public/service-worker.js` when `npm run build:offline` runs; `export_project.ts` and `import_project.ts` serialize projects into `.workshop.json` files that can be downloaded or reloaded locally.

## Safety & privacy guardrails

- **Creativity boundaries** – `projectStore`, `templates/`, and helpers clamp text lengths, enforce required fields, and regenerate IDs so no station can bypass the safety rules documented in `docs/SAFETY_CONTRACT.md`.
- **AI enforcement** – `webllm_loader.ts` scrub patterns matching disallowed or unsafe terms and tags uncertain replies; `AIProvider` prefixes prompts with the SafetyContract language so every model interaction obeys the same guardrails.
- **Telemetry & diagnostics** – All counts live in `telemetryStore` and render in `DiagnosticsPage.tsx`; users can reset or disable telemetry, and nothing is sent off-device (`docs/PRIVACY_NOTES.md` explains the guarantees).
- **Offline builds** – The offline mode only caches UI assets, never the WebLLM binaries, to keep the offline service worker predictable while reusing the same SafetyContract enforcement as the standard build.

Consult the Station Lifecycle, Extension Points, and Accessibility docs before introducing new flows so future contributors reuse the same structure and guardrails.
