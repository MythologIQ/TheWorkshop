# FEATURE-WS-0006 Share Station v1 (Broadcast Deck)

## Summary
First-pass Share Station that helps a child turn their project into a safe, audience-ready outline (slides/story/comic panels) with safety checks and an adult-approval reminder before sharing.

## Scope

- In scope:
  - Collect audience and desired format; outline 3–5 story beats (mission, build/test highlights, learnings).
  - Draft concise shareable text (slides/script/story beats) that avoids personal details and exaggeration.
  - Safety checklist: remove personal info, keep claims truthful, kind tone, adult approval reminder.
  - Local persistence of share outputs (as StationState: share) when implemented.
- Out of scope:
  - Actual export/posting workflows or file generation.
  - Multimedia uploads/embeds; live presentation tools.
  - Multiplayer or hosted sharing.

## Affected Stations

- ShareStation

## User Type

- Kid (primary)
- Mentor/teacher (secondary reviewer)

## Acceptance Criteria

- [ ] Child can specify audience and format and receive a 3–5 beat outline to share.
- [ ] Drafted content is concise, truthful, and free of personal details; safety reminders are explicit.
- [ ] Adult approval reminder is present before any sharing/export step.
- [ ] StationState for “share” can store outline/checklist when wired to persistence.
- [ ] Prompt follows Safety Contract and Ask→Plan→Act→Review with emphasis on planning communication.

## Links

- Related prompts: prompts/stations/share_station_system.txt
- Related UI flows: docs/flows/PROJECT_CREATION_FLOW.md, docs/flows/ONBOARDING_FLOW.md
- Related issues or tickets: (TBD)
