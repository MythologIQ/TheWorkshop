# FEATURE-WS-0007 Replay Station v1 (Time Tunnels)

## Summary
A first version of the Replay Station that lets a child browse past project checkpoints, compare “then vs. now,” and safely restore or branch content while capturing a learning takeaway.

## Scope

- In scope:
  - Read-only view of past checkpoints/snapshots (sourced from stored states).
  - Simple diff/summary of changes to help decide (textual for v1).
  - Actions: keep current, restore selected content, or create a branch copy.
  - Safety: warn before overwrite; prefer branching; no blame language.
  - Store a reflect note about what was learned from the comparison.
- Out of scope:
  - Full version control UI; rich diffs or merge tools.
  - Multiplayer or cloud sync.
  - Media diffing; audio/video playback.

## Affected Stations

- ReplayStation

## User Type

- Kid (primary)
- Mentor (secondary)

## Acceptance Criteria

- [ ] Child can select a prior checkpoint and view it without altering current content by default.
- [ ] Child can choose to restore or branch; branching avoids data loss and labels the copy.
- [ ] System warns before overwriting; defaults to safe choices.
- [ ] A reflection/takeaway is captured with the action.
- [ ] Prompt and UI follow the Safety Contract; tone remains calm and blame-free.

## Links

- Related prompts: prompts/stations/replay_station_system.txt
- Related stations: Memory Station (source of checkpoints/logs)
- Related issues or tickets: (TBD)
