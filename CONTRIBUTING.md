# Contributing

Thanks for helping keep The Workshop creative, safe, and welcoming. This repo follows clear patterns so every change respects the current architecture, safety rules, and prompt-driven workflow.

## Project overview & docs

- The UI runs from `app/src/`, with domain models in `app/src/domain/`, runtime stores/hooks in `app/src/runtime/`, and pages/components under `app/src/pages/`, `components/`, and `ui/`.
- Read `docs/ARCHITECTURE_OVERVIEW.md`, `docs/STATION_LIFECYCLE.md`, and `docs/EXTENSION_POINTS.md` to understand how stations, themes, templates, and stores fit together.
- Use `docs/DEVELOPER_SETUP.md` for tooling expectations (Node 20+, `npm install`, and core scripts), and `docs/DEPLOYMENT_GUIDE.md`/`docs/SAFETY_CONTRACT.md` when touching offline builds or AI behavior.

## Coding style and expectations

- Stick to the existing TypeScript, React, and Tailwind patterns: functional components, hooks like `useProjects()` or `useAI()`, and semantic HTML (`<section>`, `<main>`, `<nav>` for layout).
- Keep logic encapsulated in stores/hooks (e.g., `projectStore`, `telemetryStore`, `tutorialStore`) and reuse helpers such as `applyTemplate`, `updateProject`, or `clampIdea`.
- Name files and folders with kebab-case (e.g., `idea-dock.tsx`, `project-selection-page.tsx`) and keep CSS/Tailwind tokens centralized in `app/src/styles/` when possible.
- When adding UI copy or navigation labels, use `useTranslation()` keys from `app/src/i18n/translations.ts` so future localization stays manageable.

## Testing and validation

- Tests are run with `npm run test` (Vitest) and linting uses `npm run lint` (ESLint). Run both before merging, along with `npm run check:assets` and `npm run build` to ensure assets and production bundles are healthy.
- When possible, add unit or component tests for new stores, helpers, or UI states. Document any manual verification steps in the relevant doc (e.g., `docs/PROJECT_EXPORT_FORMAT.md` or `docs/DEPLOYMENT_GUIDE.md`).

## Workflow and prompts

- Branches follow the Codex prompt pattern (e.g., `prompt-031`, `prompt-033`). When contributing outside the prompt stream, use a descriptive feature branch (e.g., `feature/new-theme`).
- Commit messages should follow the `chore: apply Prompt 0XX` format when you are advancing a Codex prompt branch; human contributors can use `feat:`, `fix:`, or `docs:` plus descriptive text for clarity. Keep history tidy by squashing small fixups before pushing.
- Codex prompts live in JSON files at the repo root (e.g., `codex_prompt_033.json`), while system prompts and helper assets live under `prompts/`. When adding prompts, place them in the right folder, keep the sequence order, and avoid conflicting IDs or numbering.

## Expectations for changes

- Always respect the Safety Contract (`docs/SAFETY_CONTRACT.md`) and creativity boundaries (`docs/CREATIVITY_BOUNDARY_SPEC.md`). If a change touches AI prompts, templates, or tutorials, restate the guardrails in the prompt copy and reuse scrub helpers from `webllm_loader.ts`.
- New stations, stores, or AI flows must go through the existing runtime (hooks/stores) and persist via the shared localStorage helpers to keep telemetry, diagnostics, and import/export flows consistent.
- When altering preferences, telemetry, or offline behavior, update the corresponding docs (e.g., `docs/PRIVACY_NOTES.md`, `docs/DEPLOYMENT_GUIDE.md`, `docs/ACCESSIBILITY_CHECKLIST.md`) so humans know what changed.

## Need help?

Ask on the team channel, reference the docs above, and point to relevant prompt JSON if you are continuing a Codex flow. Keeping communication clear ensures prompts and human contributions stay aligned.
