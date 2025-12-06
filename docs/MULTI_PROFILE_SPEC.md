# Multi Profile Specification

This document defines a multi profile architecture so multiple children can share The Workshop while keeping projects, telemetry, and preferences isolated. The design builds on the existing domain/store layers, templates, diagnostics, and offline stacks without touching the SafetyContract or Creativity Boundaries.

## Profile domain model

- `ProfileId` – A UUID or short slug that uniquely identifies a profile (e.g., `profile-abc123`).
- `Profile` object:
  - `id` (ProfileId).
  - `displayName` (string) – Friendlier label shown in the UI.
  - `avatarId` or `color` (optional string) – Choosable visual accent used in nav chrome or project cards.
  - `ageBand` (enum: `toddlers`, `young_creators`, `tweens`, `teens`) – Helps the system suggest appropriate templates and regulations.
  - `createdAt` and `updatedAt` timestamps.
  - `active` boolean flag (for local convenience; the active profile controls which data is surfaced).

Profiles own:

1. **Projects** – Every project stored in `projectStore` includes a `profileId` so the UI can hide unrelated projects.
2. **Templates** – Template suggestions remain global, but the decision to start from a template records the `profileId`.
3. **Telemetry** – `telemetryStore` stores counts per profile (`totalProjectsCreated`, `stationVisitCounts`) and aggregates only when a global overview is requested (e.g., diagnostics for a caregiver view).
4. **Settings/Preferences** – Preferences (language, accessibility helpers, theme) are stored per profile so each child keeps their choices.

If there is a single profile, the system behaves like today: a default profile (`profile-default`) is created during boot, and all existing projects, telemetry, and preferences automatically map to that profile. The active profile is `profile-default`, and nothing appears to change for the current experience while the groundwork for additional profiles exists.

## Partitioning rules

- **Project partitioning** – When persisting a project, `projectStore` includes the active `profileId`. Store queries filter by `profileId` so `ProjectSelectionPage` only lists projects for the active profile.
- **Telemetry partitioning** – `telemetryStore` keeps metrics keyed by profile. Aggregating totals for an admin/parent view sums across profiles, but the standard Diagnostics page shows only the active profile metrics unless a “view all” toggle is explicitly enabled.
- **Settings partitioning** – Preferences (language, font size, accessibility hints) serialize to local storage using profile-scoped keys (e.g., `workshop.preferences.{profileId}`).
- **Migration** – When enabling multi profile support on an existing install, the migration process:
  1. Creates `profile-default` with metadata (displayName “First Creator” or similar).
  2. Rewrites all projects, telemetry counts, and preference values to include `profileId = profile-default`.
  3. Marks `profile-default` as active and hides any placeholder profiles.
- Profiles cannot see each other's data; every read path enforces `profileId` filtering. Exported `.workshop.json` files include the `profileId` metadata, but tools that import them can decide whether to keep the profile association or map them into the currently active profile to avoid leaks.

## Profile lifecycle

1. **Create** – The UI offers an “Add profile” flow that collects `displayName`, optional avatar/color, and `ageBand`. Creation:
   - Generates a new `ProfileId`.
   - Persists the profile to `profilesStore` or an equivalent runtime store.
   - Sets the new profile as active and initializes empty projects/telemetry for it.
2. **Rename** – Updates the `displayName`, avatar/color, and `ageBand` in the profile record and refreshes UI chrome and project cards.
3. **Delete** – Removes the profile record and all associated projects/telemetry/preferences after confirmation. If deletion would orphan projects, the UI offers to export them or migrate them to another profile before deleting. Deleting the active profile switches to another existing profile (falling back to `profile-default` if none remain).
4. **Activation at startup** – The app reads the last active `profileId` from local storage (fallback to `profile-default`). If no profiles exist, it immediately creates and activates `profile-default`. A profile selector in the launcher allows switching before all routes load.

## Interaction with other systems

- **Import/export** – `.workshop.json` payloads include a `profileId` field. When importing, the user can choose to keep the original `profileId` (if the profile already exists) or remap the project into the current profile to avoid exposing other profiles’ data. The import UI should warn if a profile mismatch might mix content.
- **Diagnostics & adult views** – Diagnostics keep profile-scoped metrics but can expose parent/caregiver toggles for “view all profiles” summaries. These summaries aggregate across profile telemetry counts and can show profiles side by side without revealing detailed project text.
- **Offline/PWA considerations** – All profile data remains local (no backend), so offline builds store the profile metadata in `localStorage` just like projects. Service worker caching is profile-agnostic because it only caches static assets. During offline use, the active profile is read from storage before the router resolves, ensuring the correct projects and telemetry load once the shell is ready.

This spec enables multi profile safety without changing existing guardrails: every store/store hook enforces `profileId`, telemetry remains local, and offline behavior simply continues to read profile-scoped values from the same persistence layer.
