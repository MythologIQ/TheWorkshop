# Backend (v0 plan)

Goal: simple, local-first storage for Projects, Steps, and StationState with an interface that can swap to a hosted API later.

## Approach
- Provide a thin data service with CRUD for User, Project, Step, and StationState using the shapes in `docs/DATA_MODEL.md`.
- Default implementation: local storage layer (e.g., files/IndexedDB/SQLite) with clear interfaces.
- Keep transport-agnostic contracts (e.g., repository or service interfaces) so a remote API client can replace the local adapter without UI changes.
- Include basic migrations/versioning for stored data to evolve the model safely.

## Responsibilities (v0)
- Create/read/update/delete Projects, Steps, StationState for a single local user.
- Persist mission briefs, starter steps, and per-Station context.
- Expose simple query helpers (e.g., list projects, list steps by project, get station state).
- Enforce Safety Contract at data boundaries where applicable (e.g., filter/flag unsafe content fields before save if needed).

## Out of scope (v0)
- Multiplayer or real-time sync.
- Authentication and roles beyond a single local profile.
- Hosted API deployment (kept as a future adapter).
