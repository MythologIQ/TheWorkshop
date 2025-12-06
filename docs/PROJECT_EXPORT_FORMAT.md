# Project Export Format

This document describes the `.workshop.json` files that the Workshop generates when a family saves a project, and the rules the app follows when a project is reopened on another device.

## Schema versioning

- `schemaVersion` is the trusted indicator of what the Workshop understands. Currently only `1.0` is supported.
- `exportedAt` records when the file was created.
- Future updates to this format should increment the schema version and include migration notes here.

## Core structure

```json
{
  "schemaVersion": "1.0",
  "exportedAt": "2025-12-04T12:34:56.789Z",
  "project": {
    "id": "project_cool123",
    "name": "Starship Snack Lab",
    "title": "Starship Snack Lab",
    "description": "...",
    "goal": { ... },
    "status": "in_progress",
    "currentStation": "build",
    "steps": [ ... ],
    "reflections": [ ... ],
    "tests": [ ... ],
    "archives": [ ... ],
    "memory": { ... },
    "reflect": { ... },
    "share": { ... },
    "snapshots": [ ... ],
    "tags": [ "...", "imported" ],
    "createdAt": "2025-05-30T08:00:00.000Z",
    "updatedAt": "2025-05-30T08:30:00.000Z"
  }
}
```

All `project` fields are drawn from the in-app `Project` shape, except:

- Internal IDs such as step or test IDs are dropped or replaced with regenerated identifiers when a project is imported again.
- `projectId` references are not preserved so the file can be loaded on any device without leaking local storage keys.
- Text fields remain untouched so creative content (ideas, tests, memories) stays in the export.

## Station slices

- `idea`: mirrors the Design Dock fields (`title`, `mission`, `goal`, `starterSteps`).
- `build`: is represented through the `steps` array (status, order, notes).
- `test`: maps to the Diagnostics Corridor `tests` array.
- `memory`: captures Stellar Archive entries.
- `reflect`: lists Orbiter Bridge snapshots and tags.
- `share`: holds the latest sharing metadata if present.
- `snapshots`: keeps Replay Station snapshots. Each entry contains a `label`, `createdAt`, and a `projectState` snapshot of the core project fields without nested snapshots.

Other slices recorded in the Project model (reflections, archives, tags) are also preserved to keep decision history intact.

## Safety guidance

- Exported files can contain your child's ideas, reflections, snapshots, and other creative work. Treat them like a storybook—store them where a trusted adult can help keep them safe.
- Remind learners not to share `.workshop.json` files publicly, especially if the project contains sensitive details like names or locations.
- Encourage families to keep a separate backup copy on a device they control while sharing the file only with people they trust.

When the Workshop imports a file, it validates the schema version, recreates the project with a new local ID, and regenerates any internal identifiers so the restored project stays safe and intact on the new device.
