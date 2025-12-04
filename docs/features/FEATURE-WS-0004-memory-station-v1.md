# FEATURE-WS-0004 Memory Station v1 (Stellar Archive)

## Summary
A minimal Stellar Archive that lets a child select a project, add a short reflection (win, lesson, optional reminder), and save it as a memory StationState. Keeps tone warm, blame-free, and privacy-minded.

## Scope

- In scope:
  - Project selection and mission context display.
  - Input prompts for win, lesson/learning, and an optional reminder.
  - Saving a memory StationState with recap/reminder outputs and reflections.
  - Navigation path from Test/Build to Memory while keeping project focus.
  - Local storage persistence; safety/privately sensitive language.
- Out of scope:
  - AI-generated summaries; this is user-entered for v1.
  - Multiplayer or hosted sync.
  - Advanced formatting, tagging, or media uploads.

## Affected Stations

- MemoryStation

## User Type

- Kid (primary)
- Mentor (secondary)

## Acceptance Criteria

- [ ] Child can open Stellar Archive, pick a project, and see mission summary.
 - [ ] Child can enter a win, a lesson, and an optional reminder; saving creates a StationState with reflections and outputs stored locally.
- [ ] Tone stays kind, short, and privacy-first; avoids asking for or storing personal details.
- [ ] Navigation from Test/Build into Memory preserves project focus.

## Links

- Related prompts: prompts/stations/memory_station_system.txt
- Related UI flows: docs/flows/PROJECT_CREATION_FLOW.md, docs/flows/ONBOARDING_FLOW.md
- Related issues or tickets: (TBD)
