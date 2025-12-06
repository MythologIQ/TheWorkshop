# Extension Points

The Workshop intentionally exposes safe extension surfaces so contributors can iterate on templates, themes, stations, and tooling without touching the Safety Contract or the runtime core. Here are the main areas you can safely extend today.

## Templates & content packs

- Built-in templates live under `app/src/data/templates_builtin.ts` and follow the `Template` shape defined in `app/src/domain/templates.ts`.
- To add a new template, extend the registry with an entry that includes `packId`, `displayName`, `description`, `recommendedStations`, and partial `Project` payloads (steps, reflections, memory, etc.).
- The `applyTemplate` helper (`app/src/runtime/templates/applyTemplate.ts`) regenerates `project` IDs, adds clamped fields, and routes learners to the station suggested by `recommendedStations`.
- `ProjectSelectionPage.tsx` lists the templates grouped by `CONTENT_PACKS`, so updating the registry automatically makes the new template selectable.
- Document new packs in `docs/CONTENT_PACKS.md` (if present) and ensure `templates_builtin.ts` mirrors the structure you describe.

## Tutorials & guided missions

- Tutorials are stored in `tutorialStore` (`app/src/runtime/store/tutorialStore.ts`) and exposed via hooks like `useTutorial()` and components under `app/src/ui/tutorial/`.
- Define steps with `stationKey`, `description`, and optional `targetElementId` so the overlay knows where to point learners.
- Use `startTutorial`, `nextStep`, `prevStep`, and `completeTutorial` from the store rather than mutating the progress directly.
- Stations that participate (e.g., IdeaDock, OrbiterBridge) should call `tutorialStore` helpers so the overlay advances as the learner moves between stations.

## Stations & navigation

- Station components live under `app/src/pages/` (IdeaDock, BroadcastDeck, OrbiterBridge, etc.). Follow the Station Lifecycle doc when adding or refactoring a station.
- Register the route in `App.tsx`, place links inside `NavOverlay.tsx`, and update translation keys (`app/src/i18n/translations.ts`) for nav labels and station names.
- Keep station UI keyboard reachable, use `<button>`s for actions, and rely on shared components (TopBar, panels, etc.) for consistent rhythm.
- When a station writes data, use `useProjects()` hooks so telemetry counts and persistence remain centralized.

## Themes & presentation

- Theme definitions live in `app/src/domain/theme.ts` and drive palette tokens and gradients.
- The `themeStore` (`app/src/runtime/store/themeStore.ts`) persists the active theme in localStorage and the Settings surface allows live switching.
- Adding icons, background assets, or palette overrides should stay within the theme config so presentation swaps do not touch the Safety Contract or station logic.

## Telemetry, diagnostics, and preferences

- Telemetry counts live in `telemetryStore.ts` and feed the Diagnostics UI (`docs/PRIVACY_NOTES.md` and `DiagnosticsPage.tsx` describe the local-only guarantees).
- Preference toggles (language, accessibility helpers, font size) live in `preferencesContext` and surface through `SettingsPage.tsx`. Persist new flags via the same context so they load on startup.
- Diagnostic tools (reset buttons, toggle telemetry) should only mutate store flags and never emit network requests.

## Offline & assets

- The offline build (`npm run build:offline`) uses `app/src/runtime/offline/registerServiceWorker.ts` and `public/service-worker.js` to cache the shell; service worker registration is gated by `import.meta.env.MODE === 'offline'`.
- Asset validation is enforced by `scripts/check-assets_manifest.mjs`/`scripts/check-assets.js` and `public/assets/manifest.csv`. Add new icons or backgrounds there before referencing them in the UI.
- Documentation (Deployment Guide, Accessibility checklist) explains how these pieces fit together so new contributors can extend the offline story without breaking caching or safety.

Always cross-reference these extension points before making large changes and keep the Safety Contract doc handy so new additions stay within the creativity boundaries.
