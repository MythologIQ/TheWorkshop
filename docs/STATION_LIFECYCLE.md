# Station Lifecycle

Stations combine domain slices, store interactions, navigation, and optional AI prompts. This document walks through the lifecycle with concrete examples so additions stay consistent with the current codebase.

## Anatomy of a station

1. **Domain slice** – Extend `app/src/domain/project.ts` with the fields your station shows (e.g., `idea`, `build`, `memory`). Keep creativity clamps (`clampIdea`, `clampProjectName`) in mind so inputs stay within safe limits.
2. **Stores & hooks** – Use `useProjects()` or other runtime hooks to read the current project and write updates via `projectStore` helpers like `updateProject`, `addMemoryEntry`, or `addSnapshot`. Each helper regenerates IDs/timestamps and persists to `localStorage`.
3. **AI & tutorials (if relevant)** – When you need creative prompts, call `useAI()` to stream responses from `AIProvider`. Provide clear system prompts referencing `docs/SAFETY_CONTRACT.md`, and respect token caps driven by `llmSettingsStore`. For guided missions, coordinate with `useTutorial()` so station entry can advance the `tutorialStore`.
4. **UI component** – Build the React section under `app/src/pages/` or `stations/`. Use semantic HTML (`<section>`, `<nav>`, `<button>`) and translation keys from `useTranslation()`. Ensure focus outlines and keyboard access follow the Accessibility Checklist.
5. **Routing & navigation** – Register the path (`/dock/idea`, `/bridge/reflect`, etc.) in `app/src/App.tsx`, add a nav entry in `NavOverlay.tsx`, and update translation/nav dictionaries so the station’s label is available in the UI.

## Idea Station example (IdeaDock.tsx)

- **Domain**: Reads `project.idea` from `projectStore`, but can also seed the station by applying a template (`applyTemplate`, `templates_builtin.ts`).
- **Stores & UI**: The `IdeaDock` component (`app/src/pages/IdeaDock.tsx`) renders a hero section with `useTranslation()` copy, surface a guided mission button (opens `tutorialStore`), and relies on `useProjects()` indirectly when templates assign the new project.
- **AI & tutorials**: The “Try a Guided Mission” button calls `startTutorial('robot_dog_comic')`, which updates `tutorialStore`. When the tutorial hops stations, the idea station can highlight suggested fields using translation strings and extra labels from Preferences.
- **Safety**: Any data written through `applyTemplate` or the storyboard fields is clamped via creativity boundary helpers before persisting in `projectStore`.
- **Navigation**: The page uses `/dock/idea` routing and has a strong focus management pattern (`focus-visible` outlines and `aria-label` wrapping).

## Reflect Station example (OrbiterBridge.tsx)

- **Domain**: Displays `project.reflect` snapshots and metadata types defined in the domain module. Fields such as `tags`, `notes`, and `createdAt` map directly to the `ReflectSnapshot` type.
- **Stores & UI**: `OrbiterBridge.tsx` reads translation copy (`stationNames.reflect`, `descriptions.reflect`) and renders a simple reflective pane for tagging insights. Navigation flows pass through the `NavOverlay` entries so Reflect is reachable by keyboard.
- **AI & tutorials**: Reflect can be part of tutorials; `tutorialStore` tracks station visits so `nextStep()` is wired when the user arrives. The station could call `useAI()` in the future, but current behavior relies on descriptive copy and manual tagging.
- **Safety & diagnostics**: Writes to `project.reflect` should go through the same `updateProject` helpers, ensuring all text is sanitized before persistence. Telemetry increments the station visit count via `telemetryStore` so diagnostics stay accurate.

## Checklist for adding or updating a station

- Introduce or extend the domain slice in `app/src/domain/project.ts`, reusing the existing step/reflection types and respecting clamps.
- Add store helpers if needed and wrap all mutations through `useProjects()` so persistence and telemetry remain centralized.
- Build the React page or component, hook into `useTranslation`, and ensure focus, aria labels, and keyboard interactions meet accessibility guidance.
- Open AI flows by calling `useAI()` or `useTutorial()` only after verifying that prompts mention the Safety Contract and obey token caps.
- Wire the route in `App.tsx`, add the nav entry, and update translation strings (navigation labels, station names, button text) under `app/src/i18n/translations.ts`.
- If the station introduces new templates, telemery events, or diagnostics hooks, document the behavior in the relevant docs (Extension Points, Deployment, etc.).

Following this lifecycle keeps each Station aligned with the runtime stores, translation machinery, and safety filters already present in the codebase.
