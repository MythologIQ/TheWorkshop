# FEATURE-WS-0001 Idea Station v1 (Design Dock)

## Summary
A minimal Idea Station (Design Dock) that helps a child turn a spark into a clear, buildable mission with a mission brief, project name, and 3-5 starter steps.

## Scope

- In scope:
  - Collecting the child’s idea, audience, and goal with kid-friendly prompts.
  - Generating a concise mission brief the child can edit and approve.
  - Suggesting a project name the child can accept or tweak.
  - Producing 3-5 tiny starter steps sized for beginners, editable and reorderable.
  - Basic Safety Contract checks (redirect unsafe topics, label guesses, keep tone kind).
  - Storing the Project with mission brief, name, and starter steps.
- Out of scope:
  - Multiplayer or co-editing.
  - Rich media uploads or drawing tools inside the Design Dock.
  - Advanced AI planning beyond short starter steps.
  - Cross-project templates or idea libraries.

## Affected Stations

- IdeaStation

## User Type

- Kid (primary)
- Mentor (secondary, light guidance only)

## Acceptance Criteria

- [ ] A child can enter an idea and audience/goal details and see them reflected in a generated mission brief they can edit.
- [ ] The Station suggests a project name the child can accept or change.
- [ ] The Station suggests 3-5 small starter steps sized for beginners; the child can reorder and edit them.
- [ ] Safety behaviors apply: blocks/redirects unsafe topics, labels guesses, tone stays kind.
- [ ] Saving creates a Project with mission brief, project name, and starter steps persisted and ready for the next Station.

## Links

- Related prompts: prompts/stations/idea_station_system.txt
- Related UI flows: docs/flows/PROJECT_CREATION_FLOW.md, docs/flows/ONBOARDING_FLOW.md
- Related issues or tickets: (TBD)
