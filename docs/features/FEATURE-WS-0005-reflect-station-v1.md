# FEATURE-WS-0005 Reflect Station v1 (Orbiter Bridge)

## Summary
First version of the Reflect Station (Orbiter Bridge) that helps a child tag breakthroughs and confusions, notice patterns, and record a short reminder or question for next time, all in a safe, blame-free tone.

## Scope

- In scope:
  - Reflection prompts for wins/breakthroughs, confusions, and personal takeaways.
  - Tagging highlights vs. blockers and capturing a “remember this” note.
  - Safety-compliant tone: minimal personal details, kind redirection, labeled uncertainty.
  - Local storage of reflection outputs (StationState for reflect).
- Out of scope:
  - AI-generated summaries beyond simple templated prompts.
  - Multiplayer or cloud sync.
  - Rich media uploads or long-form journaling.

## Affected Stations

- ReflectStation

## User Type

- Kid (primary)
- Mentor (secondary, light guidance)

## Acceptance Criteria

- [ ] Child can open Reflect Station (Orbiter Bridge) for a project and see basic context.
- [ ] Child can enter at least a breakthrough and a confusion (or skip), plus an optional reminder/question.
- [ ] Saving creates/updates a reflect StationState with tagged reflections stored locally.
- [ ] Tone and prompts follow the Safety Contract and emphasize Reflect/Review steps of the loop.
- [ ] No personal identifiers are requested or stored beyond project context.

## Links

- Related prompts: prompts/stations/reflect_station_system.txt
- Related UI flows: docs/flows/PROJECT_CREATION_FLOW.md, docs/flows/ONBOARDING_FLOW.md
- Related issues or tickets: (TBD)
