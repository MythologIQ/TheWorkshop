# FEATURE-WS-0002 Build Station v1 (Assembly Bay)

## Summary
A minimal Assembly Bay that lets a child pick a project, see steps from the mission brief, mark steps done, and get safe, encouraging hints. It reads/writes locally so progress persists between sessions.

## Scope

- In scope:
  - Project selection and display of mission summary (title, audience, description).
  - Listing starter steps and marking them done/undone with immediate persistence.
  - Safe, encouraging hint button that suggests small, doable actions (no external AI call yet).
  - Local storage integration using existing Project/Step types.
  - Navigation from Design Dock to Assembly Bay after saving a project.
- Out of scope:
  - Multiplayer, cloud sync, or hosted API calls.
  - Rich text editing, drag-and-drop ordering, or bulk step editing.
  - Full routing shell or design system.
  - External AI integration (stubbed with local hints for v1).

## Affected Stations

- BuildStation

## User Type

- Kid (primary)
- Mentor (secondary, light guidance)

## Acceptance Criteria

- [ ] A child can open Assembly Bay, select a saved project, and see its mission summary.
- [ ] Steps appear with checkboxes; toggling updates status (done/undo) and persists locally.
- [ ] A “Get a safe hint” control provides a concise, kind nudge aligned with safety rules (no unsafe guidance, no authority claims).
- [ ] Navigation from Design Dock to Assembly Bay works after saving a project (focuses the saved project when possible).
- [ ] Tone stays calm, supportive, and safety-compliant (redirect to safe ideas if something seems risky).

## Links

- Related prompts: prompts/stations/build_station_system.txt
- Related UI flows: docs/flows/PROJECT_CREATION_FLOW.md, docs/flows/ONBOARDING_FLOW.md
- Related issues or tickets: (TBD)
