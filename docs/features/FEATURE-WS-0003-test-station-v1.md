# FEATURE-WS-0003 Test Station v1 (Diagnostics Corridor)

## Summary
A minimal Diagnostics Corridor that lets a child select a project, run simple tests (pass/needs work/skip), record observations, and add a fix-it step. Results are saved locally in the project’s test StationState and steps list.

## Scope

- In scope:
  - Project selection and mission context display.
  - Three quick test questions with radio choices and optional notes.
  - Saving a StationState with test results and reflections.
  - Adding a single fix step (originStation: test) from user-entered issue text.
  - Navigation from Assembly Bay to Diagnostics Corridor and back.
  - Local storage persistence; safety-compliant tone and instructions.
- Out of scope:
  - External AI or rich multi-turn testing.
  - Multi-project dashboards, filtering, or analytics.
  - Multiplayer or hosted API sync.
  - Automated test generation beyond the fixed prompts.

## Affected Stations

- TestStation

## User Type

- Kid (primary)
- Mentor (secondary)

## Acceptance Criteria

- [ ] Child can open Diagnostics Corridor, pick a project, and view its mission summary.
- [ ] Three test questions accept pass/needs work/skip responses plus optional notes.
- [ ] Saving stores a test StationState with results and reflections in local storage.
- [ ] Entering an issue creates a new todo step with originStation “test.”
- [ ] Navigation from Build to Test (and back) is available and keeps project focus.
- [ ] Tone stays curious and kind; refuses/redirects unsafe ideas per Safety Contract.

## Links

- Related prompts: prompts/stations/test_station_system.txt
- Related UI flows: docs/flows/PROJECT_CREATION_FLOW.md, docs/flows/ONBOARDING_FLOW.md
- Related issues or tickets: (TBD)
